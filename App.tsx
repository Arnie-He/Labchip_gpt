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
import {Colors} from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        {id: `${Date.now()}`, text: input, sender: 'user'},
      ]);
      setInput('');
      axios
        .post('http://127.0.0.1:5000/retrieve', {query: input})
        .then(response => {
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
          console.error(error);
          // Handle the error appropriately in your app
        });
    }
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
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
    backgroundColor: '#d1e7dd',
    marginBottom: 10,
    marginLeft: '25%',
    marginRight: '5%',
    padding: 10,
    borderRadius: 10,
  },
  botBubble: {
    backgroundColor: '#d2e2e2',
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
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingLeft: 10,
    borderRadius: 10,
  },
});

export default App;
