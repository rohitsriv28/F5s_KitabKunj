// src/Chat.js
import React, { useState, useEffect } from 'react';
import { db } from '../helper/firebaseConfig';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  setDoc,
} from 'firebase/firestore';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const userUid = localStorage.getItem('uid');
    if (!userUid) {
      // Handle user not authenticated
      return;
    }

    const chatRef = collection(db, 'message', 'uploadedBy', userUid);
    const q = query(chatRef, orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMessages(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const sendMessage = async () => {
    const userUid = localStorage.getItem('uid');
    if (!userUid) {
      // Handle user not authenticated
      return;
    }

    if (newMessage.trim() === '') return;

    const messageData = {
      sent: newMessage,
      timestamp: new Date(),
      // Add other fields or user information here if needed
    };

    try {
      const userDocRef = doc(db, 'message', 'uploadedBy', userUid);
      const bookDocRef = doc(userDocRef, 'bookId', 'exampleBookId'); 

      await setDoc(doc(bookDocRef, 'userID', userUid), messageData, {
        merge: true,
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <strong>{message.username}:</strong> {message.sent}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
