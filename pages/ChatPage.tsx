import React, { useEffect, useRef, useState } from 'react';
import { FlatList, TextInput, Button, View, StyleSheet, Text } from 'react-native';
import io from 'socket.io-client';
import * as Crypto from "expo-crypto"

const public_id = Crypto.randomUUID();

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://10.2.218.30:3000/"); // Conexión al servidor Socket.IO

    // Escuchar mensajes entrantes
    socketRef.current.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Limpiar efectos al desmontar el componente
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleSubmit = () => {
    if (inputValue.trim() !== '') {
      socketRef.current.emit('chat message', inputValue);
      setInputValue('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text>{item}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Type your message..."
        />
        <Button title="Send" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  message: {
    padding: 10,
    backgroundColor: '#efefef',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    padding: 10,
    paddingBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});

export default ChatPage;
