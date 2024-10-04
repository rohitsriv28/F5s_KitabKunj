import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../helper/firebaseConfig";
import BookCard from "./BookCard";
import "../allBook/allBook.css";
import Loader from "../loader/loader";
import BooksForSale from "./BooksForSale";
import BooksForDonate from "./BooksForDonate";
import BooksForRent from "./BooksForRent";

const AllBooks = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchEdition, setSearchEdition] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      setLoading(true);

      // Build the query based on the search criteria
      let booksQuery = collection(db, "books");

      // Add a filter for book name (compulsory)
      if (searchName) {
        booksQuery = query(booksQuery, where("name", "==", searchName));
      }

      // Add a filter for edition (optional)
      if (searchEdition) {
        booksQuery = query(booksQuery, where("edition", "==", searchEdition));
      }

      // Execute the query
      const booksSnapshot = await getDocs(booksQuery);
      const booksData = booksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllBooks(booksData);
    } catch (error) {
      console.error("Error fetching books:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchBooks();
  };

  useEffect(() => {
    // Fetch books on initial mount
    fetchBooks();
  }, []); // Empty dependency array to fetch books only on mount

  return (
    <div>
      <BooksForRent/>
      <BooksForSale/>
      {/* <BooksForDonate/> */}
    </div>
  );
};

export default AllBooks;
