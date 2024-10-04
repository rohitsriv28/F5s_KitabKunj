import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../helper/firebaseConfig";
import BookCard from "./BookCard";
import Loader from "../loader/loader";

const BooksForSale = () => {
  const [saleBooks, setSaleBooks] = useState([]);
  const motive = "sale"; // Specify the motive you want to filter

  useEffect(() => {
    const fetchBooksForSale = async () => {
      try {
        const booksCollection = collection(db, "books");
        const booksSnapshot = await getDocs(booksCollection);

        // Filter books based on the motive
        const saleBooksData = booksSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((book) => book.motive === motive);

        setSaleBooks(saleBooksData);
      } catch (error) {
        console.error("Error fetching books for sale:", error.message);
      }
    };

    fetchBooksForSale();
  }, [motive]);

  if (saleBooks.length === 0) {
    return <Loader />;
  }

  return (
    <div>
      <h2>Books for Sell</h2>
      <div className="books-grid">
        {saleBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BooksForSale;
