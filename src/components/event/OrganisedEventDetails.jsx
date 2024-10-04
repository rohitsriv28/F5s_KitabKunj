import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../helper/firebaseConfig';

const OrganisedEventDetails = () => {
  const { eventId } = useParams();
  const [organisedEventData, setOrganisedEventData] = useState(null);

  useEffect(() => {
    const fetchOrganisedEventData = async () => {
      try {
        // Fetch data for the specific event from the "organisedEvents" collection
        const organisedEventDocRef = doc(db, 'organisedEvents', eventId);
        const organisedEventDoc = await getDoc(organisedEventDocRef);

        if (organisedEventDoc.exists()) {
          // Extract data from the document
          const eventData = organisedEventDoc.data();
          setOrganisedEventData(eventData);
        } else {
          console.error(`Organised event with ID ${eventId} not found.`);
        }
      } catch (error) {
        console.error('Error fetching organised event details:', error.message);
      }
    };

    // Call the fetch function when the component mounts
    fetchOrganisedEventData();
  }, [eventId]); // Depend on eventId to re-fetch data when it changes

  return (
    <div>
      <h2>Organised Event Details</h2>
      {organisedEventData ? (
        <div>
          <p>Event ID: {organisedEventData.eventId}</p>
          <p>Content: {organisedEventData.content}</p>
          <p>Images: {organisedEventData.images.join(', ')}</p>
          <p>Timestamp: {organisedEventData.timestamp.toDate().toLocaleString()}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default OrganisedEventDetails;
