import React from "react";
import BookCard from "./BookCard";

const BooksByMotive = ({ booksData, motive }) => {
  // Filter books based on the provided motive
  const filteredBooks = booksData.filter((book) => book.motive === motive);

  // Render BookCard components for filtered books
  return (
    <div>
      <h2>Books with Motive: {motive}</h2>
      <div className="books-grid">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BooksByMotive;
