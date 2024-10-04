import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../helper/firebaseConfig';
import { Link } from 'react-router-dom';
import OrganisedEventDetails from './OrganisedEventDetails';

const ViewOrganisedEvents = () => {
  const [organisedEvents, setOrganisedEvents] = useState([]);

  useEffect(() => {
    const fetchOrganisedEvents = async () => {
      try {
        // Fetch data from the "organisedEvents" collection
        const organisedEventsCollection = collection(db, 'organisedEvents');
        const querySnapshot = await getDocs(organisedEventsCollection);

        // Extract data from the query snapshot
        const eventsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Update the state with the fetched data
        setOrganisedEvents(eventsData);
      } catch (error) {
        console.error('Error fetching organised events:', error.message);
      }
    };

    // Call the fetch function when the component mounts
    fetchOrganisedEvents();
  }, []); // Empty dependency array ensures the effect runs once on mount

  return (
    <div>
      <h2>Organised Events</h2>
      <ul>
        {organisedEvents.map((event) => (
          <li key={event.id}>
            {/* Link to the detailed view of the organised event */}
            <Link to={`/organised-events/${event.id}`}>{event.eventId}</Link>
          </li>
        ))}
      </ul>

      {/* Include the OrganisedEventDetails component for displaying detailed information */}
      <OrganisedEventDetails />
    </div>
  );
};

export default ViewOrganisedEvents;
