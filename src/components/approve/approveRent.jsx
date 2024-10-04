import React, { useState, useEffect } from "react";
import { db } from "../helper/firebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import Loader from "../loader/loader";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../Admin/adminLayout/layout";

const ApproveRent = () => {
  const navigate = useNavigate()
  const [pendingBooks, setPendingBooks] = useState([]);
  const myUID = localStorage.getItem("uid");
  console.log(myUID);

  useEffect(() => {
    const fetchPendingBooks = async () => {
      try {
        const pendingCollection = collection(db, "pendingRent");
        const pendingDoc = doc(pendingCollection, myUID);
        const newPendingColl = collection(pendingDoc, "book");

        const pendingBooksSnapshot = await getDocs(newPendingColl);

        const booksData = [];
        pendingBooksSnapshot.forEach((doc) => {
          booksData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        console.log(booksData);

        setPendingBooks(booksData);
      } catch (error) {
        console.error("Error fetching pending books:", error.message);
      }
    };

    fetchPendingBooks();
  }, []);

  if (pendingBooks.length===0){
    return(
      <Loader/>
    )

  }

  const approveBook = async (bookId) => {
    try {
      // Remove the book from the pending collection
      const pendingCollection = collection(db, "pendingRent");
      const pendingDocRef = doc(pendingCollection, myUID, "book", bookId);
      const getPendingBook = await getDoc(pendingDocRef);
      console.log(getPendingBook.data());
      var bookwa = getPendingBook.data();
      if (getPendingBook.exists()) {
        console.log(getPendingBook.data());
        const { motive, rentPrice, uploadedBy, rentedBy } =
          getPendingBook.data();

        console.log(uploadedBy);

        await updateDoc(pendingDocRef, {
          status: "approved",
          approvedDate: Timestamp.now(),
        });

        const myMoneyRequestColl = collection(db, "rentMoneyHolder");
        const myMoneyRequestDoc = doc(myMoneyRequestColl, uploadedBy);
        const newMyMoneyRequestColl = collection(myMoneyRequestDoc, rentedBy);
        const newMyRequestDocMoney = doc(newMyMoneyRequestColl, bookId);

        // const newMyRequestDocMoneyData =

        await updateDoc(newMyRequestDocMoney, {
          approvedON: Timestamp.now(),
          todayDate: Timestamp.now(),
        });

        const myRequestColl = collection(db, "myRequestRent");
        const myRequestDoc = doc(myRequestColl, rentedBy);
        await setDoc(myRequestDoc, { uid: myUID });
        const newMyRequestColl = collection(myRequestDoc, bookId);

        const saveMyRequest = collection(db, "saveMyRent");
        const saveMyRequestDoc = doc(saveMyRequest, rentedBy);

        // Get the existing array of book IDs (if any)
        const existingData = (await getDoc(saveMyRequestDoc)).data();
        const existingBookIds = existingData ? existingData.myBookId || [] : [];

        // Add the new book ID to the array
        const newBookIds = [...existingBookIds, bookId];

        // Update the document with the updated array
        await setDoc(saveMyRequestDoc, { myBookId: newBookIds });

        const querySnapshot = await getDocs(newMyRequestColl);
        const documentIds = [];

        querySnapshot.forEach((doc) => {
          const docId = doc.id;
          documentIds.push(docId);
        });

        console.log(documentIds);
        const newMyRequestDoc = doc(newMyRequestColl, documentIds[0]);

        // console.log(bookwa)
        await updateDoc(newMyRequestDoc, {
          ...bookwa,
          status: "Approved",
          approvedDate: Timestamp.now(),
        });

        console.log(
          "Book approved, user credit updated, and removed from pending collection."
        );

        alert("Book has been approved")

        setPendingBooks((prevBooks) =>
          prevBooks.filter((book) => book.id !== bookId)
        );
      } else {
        console.log("Book not found in the pending collection.");
      }
    } catch (error) {
      console.error("Error approving the book:", error.message);
    }
  };

  const rejectBook = async (bookId) => {
    try {
      const pendingCollection = collection(db, "pendingRent");
      const pendingDocRef = doc(pendingCollection, myUID, "book", bookId);
      const getPendingBook = await getDoc(pendingDocRef);
      console.log(getPendingBook.data());
      var bookwa = getPendingBook.data();
      if (getPendingBook.exists()) {
        console.log(getPendingBook.data());
        const { motive, rentPrice, uploadedBy, rentedBy } =
          getPendingBook.data();

        console.log(uploadedBy);

        await updateDoc(pendingDocRef, {
          status: "rejected",
          rejectOn: Timestamp.now(),
        });

        const myRequestColl = collection(db, "myRequestRent");
        const myRequestDoc = doc(myRequestColl, rentedBy);
        const newMyRequestColl = collection(myRequestDoc, bookId);

        const querySnapshot = await getDocs(newMyRequestColl);
        const documentIds = [];

        querySnapshot.forEach((doc) => {
          const docId = doc.id;
          documentIds.push(docId);
        });

        console.log(documentIds[0]);
        const newMyRequestDoc = doc(newMyRequestColl, documentIds[0]);

        const myMoneyRequestColl = collection(db, "rentMoneyHolder");
        const myMoneyRequestDoc = doc(myMoneyRequestColl, uploadedBy);
        const newMyMoneyRequestColl = collection(myMoneyRequestDoc, rentedBy);
        const newMyRequestDocMoney = doc(newMyMoneyRequestColl, bookId);

        const newMyRequestDocMoneyData = await getDoc(newMyRequestDocMoney);

        console.log(uploadedBy, myUID, bookId);
        if (newMyRequestDocMoneyData.exists()) {
          const bookDataMoney = newMyRequestDocMoneyData.data();
          console.log(bookDataMoney.originalPrice);

          const userCollection = collection(db, "users");
          const userDocRef = doc(userCollection, rentedBy);
          const userDoc = await getDoc(userDocRef);
          // console.log(userDoc.data());

          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log(userData);
            const userCredit = userData.credit || 0;

            const updatedCredit =
              userCredit + parseFloat(bookDataMoney.originalPrice);

            await updateDoc(userDocRef, { credit: updatedCredit });
          }

          await updateDoc(newMyRequestDocMoney, { originalPrice: 0 });
        } else {
          console.log("Document not found");
        }

        console.log(bookwa);
        await deleteDoc(newMyRequestDoc).then(() => {
          alert("Acha chalta hu dua me yaad rakhna");
        });

        setPendingBooks((prevBooks) =>
          prevBooks.filter((book) => book.id !== bookId)
        );
      }
    } catch (error) {
      console.error("Error rejecting the book:", error.message);
    }
  };

  return (
    <AdminLayout>
    <div className="pending-books-list-container">
      <h2>Pending Books for Approval</h2>
      <table>
        <thead>
          <tr>
            <th>Book Name</th>
            <th>Language</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingBooks
            // .filter(
            //   (book) => book.status !== "approved" && book.status !== "rejected"
            //   // book.status !== undefined
            // )
            .map((book) => (
              <tr key={book.id}>
                <td>{book.bookName}</td>
                <td>{book.Language}</td>
                <td>
                  <button onClick={() => approveBook(book.id)}>Approve</button>
                  <button onClick={() => rejectBook(book.id)}>Reject</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
    </AdminLayout>
  );
};

export default ApproveRent;
