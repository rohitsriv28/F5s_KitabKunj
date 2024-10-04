import React from "react";
import { Link } from "react-router-dom";
import "./BookCard.css";

const BookCard = ({ book }) => {
  const {
    id,
    bookName,
    bookImg,
    bookLanguage,
    bookEdition,
    motive,
    priceOriginal,
    priceOffered,
    condition,
    description,
    rentPrice,
  } = book;

  return (
    <Link to={`/all/${id}`} className="book-card-link">
      <div className="book-card">
        <div
          className="book-image"
          style={{ background: `url(${bookImg})` }}
        ></div>
        <div className="book-details">
          <div className="detail">
          <h3>{bookName}</h3>
          <p>{`Language: ${bookLanguage}`}</p>
        {motive != "donate" && (
          <p>{`Edition: ${bookEdition}`}</p>
          )}
          {motive === "sale" && (
            <>
              <p className="price">
                Rs:
                <span>
                  <h5>{`${priceOffered}`}</h5>
                </span>
                <span>{`${priceOriginal}`}</span>
              </p>
            </>
          )}
          {motive === "rent" && (
            <>
              <p className="price">
                Rs:
                <span className="spam">
                  <h5>{`${rentPrice}`}</h5>
                  <p>/Day</p>
                </span>
              </p>
            </>
          )}
          {/* <p>{`Condition: ${condition}`}</p> */}
          </div>
          <button className="details-btn">Details</button>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
