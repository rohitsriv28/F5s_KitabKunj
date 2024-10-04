import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../helper/firebaseConfig';

const HostEvent = () => {
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');

  const handleHostEvent = async () => {
    try {
      // Create an event document in the "events" collection
      const eventsCollection = collection(db, 'events');
      const newEventRef = await addDoc(eventsCollection, {
        title: eventTitle,
        createdAt: eventDate,
      });

      // Redirect to the event page with the created event ID
      // You might want to implement navigation according to your routing setup
      console.log('Event hosted successfully. Event ID:', newEventRef.id);
    } catch (error) {
      console.error('Error hosting event:', error.message);
    }
  };

  return (
    <div>
      <h2>Host an Event</h2>
      <label>
        Event Title:
        <input
          type="text"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
        />
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
      </label>
      <button onClick={handleHostEvent}>Host Event</button>
    </div>
  );
};

export default HostEvent;
