import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../helper/firebaseConfig";
import { collection, doc, getDoc } from "firebase/firestore";
import "./myBookDetails.css"

function MyBookDetails() {
  const { myUID, bookId, id } = useParams();
  console.log(myUID, bookId, id);
  const [bookDetails, setBookDetails] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const bookDoc = doc(
          collection(doc(collection(db, "myRequest"), myUID), bookId),
          id
        );
        const bookSnapshot = await getDoc(bookDoc);
        console.log(bookSnapshot.data());

        if (bookSnapshot.exists()) {
          setBookDetails({ id: bookSnapshot.id, ...bookSnapshot.data() });
        } else {
          console.error("Book not found");
        }
      } catch (error) {
        console.error("Error fetching book details:", error.message);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (!bookDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="book-details-containers">
      <div className="book-image">
        <img src={bookDetails.bookImg} alt={bookDetails.bookName} />
      </div>
      <div className="book-info">
        <h2>{bookDetails.bookName}</h2>
        <p className="description">Description: {bookDetails.description}</p>
        <p>Condition: {bookDetails.condition}</p>
        <p>Motive: {bookDetails.motive}</p>
        <p>Status: {bookDetails.status}</p>
        <p>Original Price: {bookDetails.priceOriginal}</p>
        <p>Offered Price: {bookDetails.priceOffered}</p>
        <p>Language: {bookDetails.bookLanguage}</p>
        <p>Edition: {bookDetails.bookEdition}</p>
        <p>Rent Price: {bookDetails.rentPrice}</p>
      </div>
    </div>
  );
}

export default MyBookDetails;
