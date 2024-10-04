import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../helper/firebaseConfig';
import { useParams } from 'react-router-dom';
import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const EventPage = () => {
  const { eventId } = useParams();
  const [inputText, setInputText] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const handleAddContent = async () => {
    try {
      // Ensure imageFiles is an array
      const filesArray = Array.from(imageFiles);

      // Upload new images to Firebase Storage
      const storagePromises = filesArray.map(async (file, index) => {
        const storageRef = ref(storage, `eventImages/${eventId}/${index}`);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);
        return imageUrl;
      });

      const newImageUrls = await Promise.all(storagePromises);

      // Create a new document in the "organisedEvents" collection
      const organisedEventsCollection = collection(db, 'organisedEvents');
      await addDoc(organisedEventsCollection, {
        eventId,
        content: inputText,
        images: newImageUrls,
        timestamp: new Date(),
      });

      console.log('Content added successfully.');

      // Optionally, you can update the "events" collection with new content and image URLs
      await updateDoc(doc(db, 'events', eventId), {
        content: inputText,
        images: [...imageUrls, ...newImageUrls],
      });

      console.log('Event updated successfully.');
    } catch (error) {
      console.error('Error adding content:', error.message);
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;

    // Convert FileList to an array
    const filesArray = Array.from(files);

    setImageFiles(filesArray);
  };

  return (
    <div>
      <h2>Event Page</h2>
      <p>Event ID: {eventId}</p>

      <label>
        Input Text:
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </label>

      <label>
        Upload Images:
        <input type="file" multiple onChange={handleImageChange} />
      </label>

      <button onClick={handleAddContent}>Add Content</button>
    </div>
  );
};

export default EventPage;
