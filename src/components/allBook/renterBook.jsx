import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../helper/firebaseConfig";

function RenterBook() {
  const myUID = localStorage.getItem("uid");
  const [booksData, setBooksData] = useState([]);

  useEffect(() => {
    async function getDetails() {
      try {
        const SellerCollectionRef = collection(db, "pendingRent");
        const SellerDocRef = doc(SellerCollectionRef, myUID);
        const newSellerCollectionRef = collection(SellerDocRef, "book");

        const booksSnapshot = await getDocs(newSellerCollectionRef);
        const booksData = booksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBooksData(booksData);
      } catch (error) {
        console.error("Error fetching book data:", error.message);
      }
    }
    getDetails();
  }, [myUID]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price Offered</th>
            {/* Add more header columns as needed */}
          </tr>
        </thead>
        <tbody>
          {booksData.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.bookName}</td>
              <td>{book.description}</td>
              <td>{book.priceOffered}</td>
              {/* Add more table cells for other book details */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RenterBook;