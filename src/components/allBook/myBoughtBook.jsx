// MyBoughtBook.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../helper/firebaseConfig";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import ProfileLayout from "../users/myProfile/profileLayout";
import "./MyBoughtBook.css";

function BookDetails({ bookDetails }) {
  // Component to display detailed information of a book
  return (
    <div>
      <h2>{bookDetails.bookName}</h2>
      <p>{bookDetails.description}</p>
      <p>Price Offered: {bookDetails.priceOffered}</p>
      {/* Add more detailed information */}
    </div>
  );
}

function MyBoughtBook() {
  const [userRentRequests, setUserRentRequests] = useState([]);
  const myUID = localStorage.getItem("uid");

  useEffect(() => {
    const fetchUserRentRequests = async () => {
      try {
        const myRequestRentCollection = collection(db, "myRequest");
        const myRequestDoc = doc(myRequestRentCollection, myUID);
        const myRequestSnapshot = await getDoc(myRequestDoc);
        const getBookIdCollection = collection(db, "saveMyRequest");
        const getBookIdDoc = doc(getBookIdCollection, myUID);
        const okGetBookId = await getDoc(getBookIdDoc);
        const bookIds = okGetBookId.data()?.myBookId || [];

        const bookDetailsPromises = bookIds.map(async (bookId) => {
          const bookCOllection = collection(db, "myRequest");
          const bookDoc = doc(bookCOllection, myUID);
          const newbookCOllection = collection(bookDoc, bookId);
          const booksSnapshot = await getDocs(newbookCOllection);
          const booksData = booksSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            bookId: bookId,
          }));

          const userDoc = await getDoc(
            doc(collection(db, "users"), booksData[0].uploadedBy)
          );
          const username = userDoc.exists() ? userDoc.data().name : "Unknown";

          return { ...booksData[0], uploadedByUsername: username };
        });

        const booksDetails = await Promise.all(bookDetailsPromises);
        setUserRentRequests(booksDetails);
      } catch (error) {
        console.error("Error fetching user rent requests:", error.message);
      }
    };

    fetchUserRentRequests();
  }, [myUID]);

  return (
    <ProfileLayout>
      <div className="c-container">
        <div className="card-container">
          {userRentRequests.map((bookDetails, index) => (
            <div className="card" key={index}>
              <div className="card-l">
                <img src={bookDetails.bookImg} alt={bookDetails.bookName} />
              </div>
              <div className="card-r">
                <div className="card-d">
                <h3>{bookDetails.bookName}</h3>
                <p>{bookDetails.uploadedByUsername}</p>
                {console.log(bookDetails)}
                </div>
                <Link
                  to={`/books/${myUID}/${bookDetails.bookId}/${bookDetails.id}`}
                  className="card-link">
                  <button>View Details</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProfileLayout>
  );
}

export default MyBoughtBook;
