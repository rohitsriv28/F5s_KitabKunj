import React, { useState, useEffect } from "react";
import { db } from "../helper/firebaseConfig";
import {
  collection,
  getDocs,
  doc, // Import the 'doc' function
  getDoc,
  updateDoc,
  setDoc,
  increment,
} from "firebase/firestore";
import AdminLayout from "../../Admin/adminLayout/layout";

const PendingBooksList = () => {
  const [pendingBooks, setPendingBooks] = useState([]);
  const myUID = localStorage.getItem("uid");

  useEffect(() => {
    const fetchPendingBooks = async () => {
      try {
        const pendingCollection = collection(db, "pending");
        const pendingDoc = doc(pendingCollection, myUID);
        const newPendingColl = collection(pendingDoc, "book");

        const pendingBooksSnapshot = await getDocs(newPendingColl);

        const booksData = [];
        await Promise.all(
          pendingBooksSnapshot.docs.map(async (docSnapshot) => {
            const bookData = docSnapshot.data();
            const userCollRef = collection(db, "users");
            const userDocRef = doc(userCollRef, bookData.grabedBy);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
              const userData = userDocSnapshot.data();
              const grabedByName = userData.name;

              if (bookData.status !== "approved") {
                booksData.push({
                  id: docSnapshot.id,
                  ...bookData,
                  grabedByName,
                });
              }
            }
          })
        );

        setPendingBooks(booksData);
      } catch (error) {
        console.error("Error fetching pending books:", error.message);
      }
    };

    fetchPendingBooks();
  }, []);

  // if(pendingBooks.length===0){
  //   return(
  //     <Loader/>
  //   )
  // }

  const approveBook = async (bookId) => {
    try {
      const pendingCollection = collection(db, "pending");
      const pendingDocRef = doc(pendingCollection, myUID, "book", bookId);
      const getPendingBook = await getDoc(pendingDocRef);

      if (getPendingBook.exists()) {
        const { motive, priceOffered, uploadedBy, grabedBy } =
          getPendingBook.data();

        if (motive === "sale") {
          const userCollection = collection(db, "users");
          const userDocRef = doc(userCollection, grabedBy);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userCredit = userData.credit || 0;

            const updatedCredit = userCredit - parseFloat(priceOffered);

            await updateDoc(userDocRef, { credit: updatedCredit });
          }
        }
        const myRentNumber = collection(db, "myNumber");
        const myRentNumberDoc = doc(myRentNumber, grabedBy);
        const userDoc = await getDoc(myRentNumberDoc);
        if (!userDoc.exists()) {
          await setDoc(myRentNumberDoc, { bought: 1 });
        }
        await updateDoc(myRentNumberDoc, {
          bought: increment(1),
        });
        await updateDoc(pendingDocRef, { status: "approved" });

        const myRequestColl = collection(db, "myRequest");
        const myRequestDoc = doc(myRequestColl, grabedBy);
        await setDoc(myRequestDoc, { uid: myUID });
        const newMyRequestColl = collection(myRequestDoc, bookId);

        const saveMyRequest = collection(db, "saveMyRequest");
        const saveMyRequestDoc = doc(saveMyRequest, grabedBy);

        const existingData = (await getDoc(saveMyRequestDoc)).data();
        const existingBookIds = existingData ? existingData.myBookId || [] : [];
        const newBookIds = [...existingBookIds, bookId];

        await setDoc(saveMyRequestDoc, { myBookId: newBookIds });

        const querySnapshot = await getDocs(newMyRequestColl);
        const documentIds = [];

        querySnapshot.forEach((doc) => {
          const docId = doc.id;
          documentIds.push(docId);
        });

        const newMyRequestDoc = doc(newMyRequestColl, documentIds[0]);

        await updateDoc(newMyRequestDoc, {
          ...getPendingBook.data(),
          status: "Approved",
        });

        console.log(
          "Book approved, user credit updated, and removed from pending collection."
        );

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

  return (
    <AdminLayout>
    <div className="pending-books-list-container">
      <h2>Pending Books for Approval</h2>
      {pendingBooks.length === 0 ? (
        <p>No pending books for approval.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Book Name</th>
              {/* <th>Author</th> */}
              <th>Requested By</th>
              <th>Email</th>
              <th>Address</th>


              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingBooks.map((book) => (
              <>
              {console.log(book)}
              <tr key={book.id}>
                {/* <td>{book.grabedByName}</td> */}
                <td>{book.bookName}</td>
                <td>{book.userD?.shippingName || "Aadarsh"}</td>
                <td>{book.userD?.shippingEmail || "aadiKumar@gmail.com"}</td>
                <td>{book.userD?.shippingAddress || "Simrangadh"}</td>
                {/* <td>{book.author}</td> */}
                <td>
                  <button onClick={() => approveBook(book.id)}>Approve</button>
                </td>
              </tr>
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </AdminLayout>
  );
};

export default PendingBooksList;
