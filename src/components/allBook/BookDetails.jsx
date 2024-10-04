import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../helper/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import "./BookDetails.css";
import ChatPage from "../chat/ChatComponent";
import { Link } from "react-router-dom";
import Loader from "../loader/loader";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

const BookDetails = () => {
  const navigate = useNavigate();
  const user = useAuthState(auth);
  const { id } = useParams();
  const [uploadedBy, setUploadedBy] = useState("");
  const [bookDetails, setBookDetails] = useState();
  const myUid = localStorage.getItem("uid");
  const userin = localStorage.getItem("userD")|| null;
  const userDetailsin = userin? JSON.parse(userin).role  : "";
  console.log(userDetailsin);

  // Refs for dialog
  const [shippingName, setShippingName] = useState();
  const [shippingEmail, setShippingEmail] = useState();
  const [shippingMobile, setShippingMobile] = useState();
  const [shippingAddress, setShippingAddress] = useState();
  const [donateRequestMessage, setDonateRequestMessage] = useState("");

  const saleDialogRef = useRef(null);
  const dialogRef = useRef(null);
  const donateRequestMessageRef = useRef("");

  const grabIt = async () => {
    closeSaleDialog()

      // console.log(id);
      try {
        // console.log(bookDetails.motive)
        if (bookDetails.motive === "rent") {
          const userCollection = collection(db, "users");
          const userDocRef = doc(userCollection, myUid);
          const userDoc = await getDoc(userDocRef);
          // console.log(userDoc.data());

          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("userData", userData);
            if (userData.credit >= bookDetails.priceOriginal) {
              var userConfirmation = window.confirm("Do you want to proceed?");
              if (userConfirmation) {
                console.log("User clicked OK");
                const booksCollection = collection(db, "books");
                const bookDocRef = doc(booksCollection, id);

                await updateDoc(bookDocRef, { status: "sold" });

                const pendingCollection = collection(db, "pendingRent");
                const pendingDoc = doc(
                  pendingCollection,
                  bookDetails.uploadedBy
                );
                await setDoc(pendingDoc, { id });

                const newPendingColl = collection(pendingDoc, "book");
                const newPendingDoc = doc(newPendingColl, id);
                await setDoc(newPendingDoc, {
                  ...bookDetails,
                  rentedBy: myUid,
                  rentRequestedOn: Timestamp.now(),
                });

                const myRequestColl = collection(db, "myRequestRent");
                const myRequestDoc = doc(myRequestColl, myUid);
                await setDoc(myRequestDoc, { uid: myUid });
                const newMyRequestColl = collection(myRequestDoc, id);

                await addDoc(newMyRequestColl, {
                  ...bookDetails,
                  status: "pending",
                  rentRequestedOn: Timestamp.now(),
                }).then(async () => {
                  const querySnapshot = await getDocs(newMyRequestColl);
                  const documentIds = [];

                  querySnapshot.forEach((doc) => {
                    const docId = doc.id;
                    documentIds.push(docId);
                  });

                  console.log(documentIds);
                  const takeMoneyColl = collection(db, "rentMoneyHolder");
                  const takeMoneyDOC = doc(
                    takeMoneyColl,
                    bookDetails.uploadedBy
                  );
                  await setDoc(takeMoneyDOC, { uid: myUid });
                  const newMyMoneyColl = collection(takeMoneyDOC, myUid);
                  const newMyMoneyDOC = doc(newMyMoneyColl, id);
                  await setDoc(newMyMoneyDOC, {
                    originalPrice: bookDetails.priceOriginal,
                    currentPrice: bookDetails.priceOriginal,
                    rentPrice: bookDetails.rentPrice,
                    rentRequestedOn: Timestamp.now(),
                  });

                  const userCollection = collection(db, "users");
                  const userDocRef = doc(userCollection, myUid);
                  const userDoc = await getDoc(userDocRef);
                  // console.log(userDoc.data());

                  if (userDoc.exists()) {
                    const userData = userDoc.data();
                    console.log(userData);
                    const userCredit = userData.credit || 0;

                    const updatedCredit =
                      userCredit - parseFloat(bookDetails.priceOriginal);

                    await updateDoc(userDocRef, { credit: updatedCredit });
                  }
                });

                alert("wait for acceptance");
              } else {
                console.log("User clicked Cancel");
              }
            } else {
              alert("DO CREDIT");
              return;
            }
          }
          // console.log(bookDetails.motive);
        } else {
          const booksCollection = collection(db, "books");
          const bookDocRef = doc(booksCollection, id);

          await updateDoc(bookDocRef, { status: "sold" });

          const pendingCollection = collection(db, "pending");
          const pendingDoc = doc(pendingCollection, bookDetails.uploadedBy);
          await setDoc(pendingDoc, { id });

          const newPendingColl = collection(pendingDoc, "book");
          const newPendingDoc = doc(newPendingColl, id);
          await setDoc(newPendingDoc, { 
            ...bookDetails, 
            grabedBy: myUid
            
          });
          
          const myRequestColl = collection(db, "myRequest");
          const myRequestDoc = doc(myRequestColl, myUid, );
          await setDoc(myRequestDoc, { uid: myUid });
          const newMyRequestColl = collection(myRequestDoc, id);

          await addDoc(newMyRequestColl, { ...bookDetails, status: "pending", userD: { 
            shippingName: shippingName,
            shippingEmail: shippingEmail,
            shippingAddress: shippingAddress,
          }  });
          console.log("Book marked as sold and added to pending collection.");
        }
      } catch (error) {
        console.error("Error grabbing the book:", error.message);
      }
    
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const booksCollection = collection(db, "books");
        const bookDocRef = doc(booksCollection, id);
        const bookSnapshot = await getDoc(bookDocRef);

        if (bookSnapshot.exists()) {
          setBookDetails(bookSnapshot.data());
          console.log(bookSnapshot.data());
        } else {
          console.error(`Book with ID ${id} not found.`);
        }
      } catch (error) {
        console.error("Error fetching book details:", error.message);
      }
    };

    fetchBookDetails();
  }, [id]);

  const openDialogSale = () => {
    if (!user || (Array.isArray(user) && user.length === 0) || !user[0]?.uid) {
      navigate("/login");
    } else {
    saleDialogRef.current.showModal();
    }
  };

  const openDialog = () => {
    setDonateRequestMessage(""); // Clear the input when opening the dialog
    dialogRef.current.showModal();
  };

  const closeSaleDialog = () => {
    saleDialogRef.current.close();
  };

  const closeDialog = () => {
    dialogRef.current.close();
  };

  const handleDonateRequestSubmit = async () => {
    const donateRequestCollection = collection(db, "donateRequest");

    // Post data to Firestore collection
    await addDoc(donateRequestCollection, {
      userId: myUid,
      donate: {
        bookId: id,
        message: donateRequestMessage,
      },
    });

    closeDialog(); // Close the dialog after submitting
  };

  return (
    <>
      <div className="details">
        <div className="back">
          {/* <Link to="/all">Back</Link> */}
          {userDetailsin === "admin" ? (
            <Link to="/donate">Back</Link>
          ) : (
            <Link to="/all">Back</Link>
          )}
        </div>
        <div className="book-details-container">
          {bookDetails ? (
            <>
              <div className="book-name">
                <h2>Book for {bookDetails.motive}</h2>
              </div>

              <div className="book-details-content">
                <div className="banner">
                  <img
                    src={bookDetails.bookImg}
                    alt="Book Banner"
                    height="400px"
                  />
                </div>
                <div className="detailsb">
                  <h1>{bookDetails.bookName}</h1>
                  <p>{/* <strong>Author:</strong> {bookDetails.author} */}</p>
                  <p>
                    <strong>Language:</strong> {bookDetails.bookLanguage}
                  </p>
                  <p>
                    <strong>Edition:</strong> {bookDetails.bookEdition}
                  </p>
                  <p>
                    <strong>Condition:</strong> {bookDetails.condition}
                  </p>
                  {bookDetails.motive === "rent" && (
                    <p>
                      <strong>Rent Price: </strong>NPR. {bookDetails.rentPrice}
                      /day
                    </p>
                  )}
                  {bookDetails.motive === "sale" && (
                    <>
                      <p>
                        <strong>Original Price: </strong>NPR.{" "}
                        {bookDetails.priceOriginal}
                      </p>
                      <p>
                        <strong>Offered Price: </strong>NPR.{" "}
                        {bookDetails.priceOffered}
                      </p>
                    </>
                  )}
                  <p>
                    <strong>Description:</strong> {bookDetails.description}
                  </p>
                  {bookDetails.motive !== "donate" && (
                    <button className="details-btn" onClick={openDialogSale}>
                      place order
                    </button>
                  )}
                  {/* {bookDetails.motive == "donate" && (
                    <button onClick={openDialog}>Contact</button>
                  )} */}
                </div>
              </div>
            </>
          ) : (
            <Loader />
          )}
        </div>
      </div>

      <dialog ref={dialogRef} className="dialog">
        <form>
          <label>
            Why do you need this book?
            <textarea
              value={donateRequestMessage}
              onChange={(e) => setDonateRequestMessage(e.target.value)}
            />
          </label>
          <button type="button" onClick={handleDonateRequestSubmit}>
            Submit
          </button>
          <button type="button" onClick={closeDialog}>
            Cancel
          </button>
        </form>
      </dialog>

      {/* for sale dialog */}
      <dialog ref={saleDialogRef} className="dialog">
        <form>
          <label>
            Name
            <input
              type="text"
              value={shippingName}
              onChange={(e) => setShippingName(e.target.value)}
              required
            />
          </label>
          <label>
            Email
            <input
              type="text"
              value={shippingEmail}
              onChange={(e) => setShippingEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Mobile
            <input
              type="text"
              value={shippingMobile}
              onChange={(e) => setShippingMobile(e.target.value)}
            />
          </label>
          <label>
            Shipping Address
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              required
            />
          </label>
          {/* <p>Price{bookDetails.priceOffered}</p> */}
          <button type="button" onClick={grabIt}>
            Submit
          </button>
          <button type="button" onClick={closeSaleDialog}>
            Cancel
          </button>
        </form>
      </dialog>
    </>
  );
};

export default BookDetails;
