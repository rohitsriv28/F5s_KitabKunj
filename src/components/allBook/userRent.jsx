import React, { useState, useEffect } from "react";
import { db } from "../helper/firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import DetailsDialog from "./DetailsDialog"; // Import the new component
import { differenceInDays } from "date-fns"; // Import from date-fns or another date library

function UserRent() {
  const [userRentRequests, setUserRentRequests] = useState([]);
  const [uploadedByUID, setUploadedByUID] = useState("");
  const myUID = localStorage.getItem("uid");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({});

  useEffect(() => {
    const fetchUserRentRequests = async () => {
      try {
        console.log("Fetching user rent requests...");

        const myRequestRentCollection = collection(db, "myRequestRent");
        const myRequestDoc = doc(myRequestRentCollection, myUID);
        const myRequestSnapshot = await getDoc(myRequestDoc);

        console.log("User rent request data:", myRequestSnapshot.data());

        const getBookIdCollection = collection(db, "saveMyRent");
        const getBookIdDoc = doc(getBookIdCollection, myUID);
        const okGetBookId = await getDoc(getBookIdDoc);
        const bookIds = okGetBookId.data()?.myBookId || [];
        // console.log(okGetBookId.data())

        const bookDetailsPromises = bookIds.map(async (bookId) => {
          console.log("Fetching details for book ID:", bookId);

          const bookCOllection = collection(db, "myRequestRent");
          const bookDoc = doc(bookCOllection, myUID);
          const newbookCOllection = collection(bookDoc, bookId);

          const booksSnapshot = await getDocs(newbookCOllection);
          const booksData = booksSnapshot.docs.map((doc) => ({
            id: doc.id,
            bookIDD: bookId,
            ...doc.data(),
          }));

          console.log("Book details:", booksData);
          setUploadedByUID(booksData[0].uploadedBy);
          return booksData;
        });

        const booksDetails = await Promise.all(bookDetailsPromises);
        setUserRentRequests(booksDetails);
      } catch (error) {
        console.error("Error fetching user rent requests:", error.message);
      }
    };

    fetchUserRentRequests();
  }, [myUID]);

  const handleSeeDetails = async (uploadedBy, myUID, BookID) => {
    try {
      const getPaisaCollection = collection(db, "rentMoneyHolder");
      const getPaisaDoc = doc(getPaisaCollection, uploadedBy);
      const newGetPaisaCollection = collection(getPaisaDoc, myUID);
      const newGetPaisaDoc = doc(newGetPaisaCollection, BookID);

      const getMoneyData = await getDoc(newGetPaisaDoc);
      const moneyData = getMoneyData.data();

      // If Date1 is null, subtract rentPrice from currentPrice
      if (!moneyData.Date1) {
        const currentPrice = parseFloat(moneyData.currentPrice);
        const rentPrice = parseFloat(moneyData.rentPrice);

        // Deduct rentPrice from currentPrice
        const newCurrentPrice = currentPrice - rentPrice;

        // Update currentPrice
        await updateDoc(newGetPaisaDoc, {
          currentPrice: newCurrentPrice.toString(),
        });
      } else {
        // Compare Date1 and Date2 to check if there is a one-day gap
        const daysDifference = differenceInDays(
          new Date(moneyData.Date2.seconds * 1000),
          new Date(moneyData.Date1.seconds * 1000)
        );

        if (daysDifference === 1) {
          const currentPrice = parseFloat(moneyData.currentPrice);
          const rentPrice = parseFloat(moneyData.rentPrice);

          // Deduct rentPrice from currentPrice
          const newCurrentPrice = currentPrice - rentPrice;

          // Update currentPrice and set Date1 to Date2
          await updateDoc(newGetPaisaDoc, {
            currentPrice: newCurrentPrice.toString(),
            Date1: moneyData.Date2,
          });
        }
      }

      // Open the dialog with the updated data
      setDialogData(moneyData);
      setIsDialogOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReturn = async (uploadedBy, myUID, BookID) => {
    console.log(BookID);
    try {
      const BookCollection = collection(db, "books");
      const BookDoc = doc(BookCollection, BookID);

      await updateDoc(BookDoc, { status: "" });

      const MyRequestRentCollection = collection(db, "myRequestRent");
      const MyRequestRentDoc = doc(MyRequestRentCollection, myUID);
      const newMyRequestRentCollection = collection(MyRequestRentDoc, BookID);

      const opopopp = await getDocs(newMyRequestRentCollection);
      const booksData = opopopp.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(booksData[0]);

      await updateDoc(doc(newMyRequestRentCollection, booksData[0].id), {
        status: "returned",
        returnDate: Timestamp.now(),
      });

      const pendingRentCollection = collection(db, "pendingRent");
      const pendingRentDOc = doc(pendingRentCollection, uploadedBy);
      const newpendingRentCollection = collection(pendingRentDOc, "book");
      const newpendingRentDOc = doc(newpendingRentCollection, BookID);

      await deleteDoc(newpendingRentDOc);

      const getPaisaCollection = collection(db, "rentMoneyHolder");
      const getPaisaDoc = doc(getPaisaCollection, uploadedBy);
      const newGetPaisaCollection = collection(getPaisaDoc, myUID);
      const newGetPaisaDoc = doc(newGetPaisaCollection, BookID);

      const getMoneyData = await getDoc(newGetPaisaDoc);
      const moneyData = getMoneyData.data();

      console.log(moneyData);

      if (getMoneyData.exists()) {
        const bookDataMoney = getMoneyData.data();
        console.log(bookDataMoney.originalPrice);

        const userCollection = collection(db, "users");
        const userDocRef = doc(userCollection, myUID);
        const userDoc = await getDoc(userDocRef);
        // console.log(userDoc.data());

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log(userData);
          const userCredit = userData.credit || 0;

          const updatedCredit =
            userCredit + parseFloat(bookDataMoney.currentPrice);

          await updateDoc(userDocRef, { credit: updatedCredit }).then(async()=>{
            await deleteDoc(newGetPaisaDoc)
          })
        }


        
        // await updateDoc(newMyRequestDocMoney, { originalPrice: 0 });
      } else {
        console.log("Document not found");
      }

      // const pendingCollection = collection(db, "pendingRent");
      // const pendingDocRef = doc(pendingCollection, myUID, "book", bookId);
      // const getPendingBook = await getDoc(pendingDocRef);
      // console.log(getPendingBook.data());
      // var bookwa = getPendingBook.data();
      // if (getPendingBook.exists()) {
      //   console.log(getPendingBook.data());
      //   const { motive, rentPrice, uploadedBy, rentedBy } =
      //     getPendingBook.data();

      //   console.log(uploadedBy);

      //   await updateDoc(pendingDocRef, {
      //     status: "rejected",
      //     rejectOn: Timestamp.now(),
      //   });

      //   const myRequestColl = collection(db, "myRequestRent");
      //   const myRequestDoc = doc(myRequestColl, rentedBy);
      //   const newMyRequestColl = collection(myRequestDoc, bookId);

      //   const querySnapshot = await getDocs(newMyRequestColl);
      //   const documentIds = [];

      //   querySnapshot.forEach((doc) => {
      //     const docId = doc.id;
      //     documentIds.push(docId);
      //   });

      //   console.log(documentIds[0]);
      //   const newMyRequestDoc = doc(newMyRequestColl, documentIds[0]);

      //   const myMoneyRequestColl = collection(db, "rentMoneyHolder");
      //   const myMoneyRequestDoc = doc(myMoneyRequestColl, uploadedBy);
      //   const newMyMoneyRequestColl = collection(myMoneyRequestDoc, rentedBy);
      //   const newMyRequestDocMoney = doc(newMyMoneyRequestColl, bookId);

      //   const newMyRequestDocMoneyData = await getDoc(newMyRequestDocMoney);

      //   console.log(uploadedBy, myUID, bookId);
      //   if (newMyRequestDocMoneyData.exists()) {
      //     const bookDataMoney = newMyRequestDocMoneyData.data();
      //     console.log(bookDataMoney.originalPrice);

      //     const userCollection = collection(db, "users");
      //     const userDocRef = doc(userCollection, rentedBy);
      //     const userDoc = await getDoc(userDocRef);
      //     // console.log(userDoc.data());

      //     if (userDoc.exists()) {
      //       const userData = userDoc.data();
      //       console.log(userData);
      //       const userCredit = userData.credit || 0;

      //       const updatedCredit =
      //         userCredit + parseFloat(bookDataMoney.originalPrice);

      //       await updateDoc(userDocRef, { credit: updatedCredit });
      //     }

      //     await updateDoc(newMyRequestDocMoney, { originalPrice: 0 });
      //   } else {
      //     console.log("Document not found");
      //   }

      //   console.log(bookwa);
      //   await deleteDoc(newMyRequestDoc).then(() => {
      //     alert("Acha chalta hu dua me yaad rakhna");
      //   });

      //   setPendingBooks((prevBooks) =>
      //     prevBooks.filter((book) => book.id !== bookId)
      //   );
      // }
    } catch (error) {
      console.error("Error rejecting the book:", error.message);
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price Offered</th>
            <th>Return</th>
            {/* Add more header columns as needed */}
          </tr>
        </thead>
        <tbody>
          {userRentRequests.map((bookDetails, index) => (
            <tr key={index}>
              <td>{bookDetails[0].id}</td>
              <td>{bookDetails[0].bookName}</td>
              <td>{bookDetails[0].description}</td>
              <td>{bookDetails[0].priceOffered}</td>
              <td>
                <button
                  onClick={() =>
                    handleReturn(
                      bookDetails[0].uploadedBy,
                      myUID,
                      bookDetails[0].bookIDD
                    )
                  }>
                  REturn
                </button>
              </td>
              <td>
                <button
                  onClick={() =>
                    handleSeeDetails(
                      bookDetails[0].uploadedBy,
                      myUID,
                      bookDetails[0].bookIDD
                    )
                  }>
                  See Details
                </button>
              </td>
              {/* Add more table cells for other book details */}
            </tr>
          ))}
        </tbody>
      </table>{" "}
      <DetailsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        data={dialogData}
      />
    </div>
  );
}

export default UserRent;
