import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Button,
  FlatList,
} from 'react-native';

import axios from 'axios';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-bot-message', // Give a unique ID
      text: "Hello, I'm an expert Q&A system that answers all you want to know about labchip. What can I help you today?", // The text you want the bot to say
      sender: 'bot', // Identify the message as being from the bot
    },
  ]);

  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        {id: `${Date.now()}`, text: input, sender: 'user'},
      ]);

      // Send the user's input to your custom endpoint
      axios
        .post('http://75.101.226.28:5000/retrieve', {query: input})
        .then(response => {
          // Assuming response.data has the structure you expect
          setMessages(prev => [
            ...prev,
            {
              id: `${Date.now() + 1}`,
              text: response.data.response,
              sender: 'bot',
            },
          ]);
        })
        .catch(error => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Data:', error.response.data);
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            console.error('Request:', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', error.message);
          }
          console.error('Config:', error.config);
        });

      setInput('');
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#000000' : '#000000'},
      ]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View
            style={
              item.sender === 'user' ? styles.userBubble : styles.botBubble
            }>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={input}
          onChangeText={text => setInput(text)}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  userBubble: {
    backgroundColor: '#FFEB0F', // Revvity Yellow
    marginBottom: 10,
    marginLeft: '25%',
    marginRight: '5%',
    padding: 10,
    borderRadius: 10,
  },
  botBubble: {
    backgroundColor: '#FA7E33', // Revvity Orange
    marginBottom: 10,
    marginLeft: '5%',
    marginRight: '25%',
    padding: 10,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#8724B0', // Revvity Orchid
    borderWidth: 1,
    marginRight: 10,
    paddingLeft: 10,
    borderRadius: 10,
    color: 'white', // Set the text color to white
  },
});

export default App;
