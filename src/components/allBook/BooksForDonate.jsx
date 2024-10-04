import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../helper/firebaseConfig";
import BookCard from "./BookCard";
import Loader from "../loader/loader";
import AdminLayout from "../../Admin/adminLayout/layout";
// import { useAuthState } from "react-firebase-hooks/auth";

const BooksForDonate = () => {
  const [rentBooks, setRentBooks] = useState([]);
  const motive = "donate"; // Specify the motive you want to filter

  useEffect(() => {
    const fetchBooksForDonate = async () => {
      try {
        const booksCollection = collection(db, "books");
        const booksSnapshot = await getDocs(booksCollection);

        // Filter books based on the motive
        const rentBooksData = booksSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((book) => book.motive === motive);

        setRentBooks(rentBooksData);
      } catch (error) {
        console.error("Error fetching books for rent:", error.message);
      }
    };

    fetchBooksForDonate();
  }, [motive]);

  if (rentBooks.length === 0) {
    return <Loader />;
  }

  return (
    <AdminLayout>
    <div>
      <h2>Books for Donation</h2>
      <div className="books-grid">
        {rentBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
    </AdminLayout>
  );
};

export default BooksForDonate;
