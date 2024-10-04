import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../helper/firebaseConfig';

function SeeReq() {
  const [donateRequests, setDonateRequests] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState('');
  const dialogMessageRef = useRef(null);

  useEffect(() => {
    const fetchDonateRequests = async () => {
      try {
        const donateRequestCollection = collection(db, 'donateRequest');
        const querySnapshot = await getDocs(donateRequestCollection);

        const requests = [];

        for (const docRef of querySnapshot.docs) {
          const requestData = docRef.data();

          const userDocRef = doc(db, 'users', requestData.userId);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.exists() ? userDoc.data() : null;

          const bookDocRef = doc(db, 'books', requestData.donate.bookId);
          const bookDoc = await getDoc(bookDocRef);
          const bookData = bookDoc.exists() ? bookDoc.data() : null;

          requests.push({
            id: docRef.id,
            user: userData,
            book: bookData,
            message: requestData.donate.message,
          });
        }

        setDonateRequests(requests);
      } catch (error) {
        console.error('Error fetching donate requests:', error.message);
      }
    };

    fetchDonateRequests();
  }, []);

  const openDialogMessage = (message) => {
    setSelectedMessage(message);
    dialogMessageRef.current.showModal();
  };

  const closeDialogMessage = () => {
    dialogMessageRef.current.close();
  };

  return (
    <div>
      <h2>Donate Requests</h2>
      <table>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Book Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {donateRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.user?.name}</td>
              <td>{request.book?.bookName}</td>
              <td>
                <button onClick={() => openDialogMessage(request.message)}>
                  See Message
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <dialog ref={dialogMessageRef}>
        <div>
            <h1>Message</h1>
          <p>{selectedMessage}</p>
          <button onClick={closeDialogMessage}>Close</button>
        </div>
      </dialog>
    </div>
  );
}

export default SeeReq;
