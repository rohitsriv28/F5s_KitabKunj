import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../helper/firebaseConfig";
import BookCard from "./BookCard";
import Loader from "../loader/loader";

const BooksForRent = () => {
  const [rentBooks, setRentBooks] = useState([]);
  const motive = "rent"; 

  useEffect(() => {
    const fetchBooksForRent = async () => {
      try {
        const booksCollection = collection(db, "books");
        const booksSnapshot = await getDocs(booksCollection);

        const rentBooksData = booksSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((book) => book.motive === motive);

          // console.log(rentBooksData)
        setRentBooks(rentBooksData);
      } catch (error) {
        console.error("Error fetching books for rent:", error.message);
      }
    };

    fetchBooksForRent();
  }, [motive]);

  if (rentBooks.length === 0) {
    return <Loader />;
  }

  return (
    <div>
      <h2>Books for Rent</h2>
      <div className="books-grid">
        {rentBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BooksForRent;
