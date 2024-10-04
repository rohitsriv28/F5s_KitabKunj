import React, { useState, useEffect } from "react";
import { storage, db } from "../helper/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./UploadBookForm.css";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const UploadBookForm = () => {
  
  const [bookName, setBookName] = useState("");
  const [bookImg, setBookImg] = useState(null);
  const [bookLanguage, setBookLanguage] = useState("");
  const [bookEdition, setBookEdition] = useState("");
  const [motive, setMotive] = useState("donate");
  const [priceOriginal, setPriceOriginal] = useState("");
  const [priceOffered, setPriceOffered] = useState("");
  const [rentPrice, setRentPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Validate price offered against the original price
    const validatePriceOffered = () => {
      if (priceOriginal && priceOffered) {
        const original = parseFloat(priceOriginal);
        const offered = parseFloat(priceOffered);

        if (offered > original * 0.6) {
          setErrorMessage("Price offered cannot exceed 60% of the original price.");
        } else {
          setErrorMessage("");
        }
      }
    };

    validatePriceOffered();
  }, [priceOriginal, priceOffered]);

  const fetchLocalstorgae = localStorage.getItem("userD");
  const LocalstorgaeData = JSON.parse(fetchLocalstorgae);

  const handleImageChange = (e) => {
    console.log("Selected File:", e.target.files[0]);
    if (e.target.files[0]) {
      console.log("Setting bookImg:", e.target.files[0]);
      setBookImg(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const myRentNumber = collection(db, "myNumber");
    const myRentNumberDoc = doc(myRentNumber, localStorage.getItem("uid"));
    const userDoc = await getDoc(myRentNumberDoc);

    const fileExtension = bookImg.name.split(".").pop();
    const storageRef = ref(
      storage,
      `bookImages/${bookName}-${Date.now()}.${fileExtension}`
    );
    const uploadTask = uploadBytes(storageRef, bookImg);

    uploadTask
      .then(async (snapshot) => {
        const downloadURL = await getDownloadURL(snapshot.ref);

        const booksCollection = collection(db, "books");

        await addDoc(booksCollection, {
          bookName,
          bookImg: downloadURL,
          bookLanguage,
          bookEdition,
          motive,
          priceOriginal,
          priceOffered,
          condition,
          description,
          rentPrice,
          uploadedBy: localStorage.getItem("uid"),
        });

        const myBooksCollection = collection(db, "mylistedBook");
        const myBookDoc = doc(myBooksCollection, localStorage.getItem("uid"));
        await setDoc(myBookDoc, { id: localStorage.getItem("uid") });
        const newMyBooksCollection = collection(myBookDoc, "Books");
        await addDoc(newMyBooksCollection, {
          bookName,
          bookImg: downloadURL,
          bookLanguage,
          bookEdition,
          motive,
          priceOriginal,
          priceOffered,
          condition,
          description,
        });

        if (motive === "sale") {
          if (!userDoc.exists()) {
            await setDoc(myRentNumberDoc, { sale: 1 });
          }
          await updateDoc(myRentNumberDoc, {
            sale: increment(1),
          });
        }
        if (motive === "donate") {
          const recentDonation = collection(db, "recentDonation");
          await addDoc(recentDonation, {
            book: {
              bookName,
              bookImg: downloadURL,
              bookLanguage,
              bookEdition,
              condition,
              description,
            },
            user: {
              ...LocalstorgaeData,
              uid: localStorage.getItem("uid"),
            },
            timestamp: serverTimestamp(),
          });

          if (!userDoc.exists()) {
            await setDoc(myRentNumberDoc, { donate: 1 });
          }
          await updateDoc(myRentNumberDoc, {
            donate: increment(1),
          });

          const myDonationCollection = collection(db, "myDonation");
          const myDonationDoc = doc(
            myDonationCollection,
            localStorage.getItem("uid")
          );

          await setDoc(myDonationDoc, { id: localStorage.getItem("uid") });
          const newMyDonationCollection = collection(myDonationDoc, "Books");

          await addDoc(newMyDonationCollection, {
            bookName,
            bookImg: downloadURL,
            bookLanguage,
            bookEdition,
            condition,
            description,
          });

          const userCollection = collection(db, "users");
          const userDocRef = doc(userCollection, localStorage.getItem("uid"));

          await updateDoc(userDocRef, {
            donationCount: increment(1),
          });

          const totalDonationsCollRef = collection(db, "TotalDonations");
          const totalDonationsDocRef = doc(
            totalDonationsCollRef,
            "totalDonation"
          );
          await updateDoc(totalDonationsDocRef, {
            count: increment(1),
          });
        }

        if (motive === "rent") {
          const myRentCollection = collection(db, "myRentBook");
          const myRentDoc = doc(myRentCollection, localStorage.getItem("uid"));

          await setDoc(myRentDoc, { id: localStorage.getItem("uid") });
          const newMyRentCollection = collection(myRentDoc, "Books");

          if (!userDoc.exists()) {
            await setDoc(myRentNumberDoc, { rent: 1 });
          }
          await updateDoc(myRentNumberDoc, {
            rent: increment(1),
          });

          await addDoc(newMyRentCollection, {
            bookName,
            bookImg: downloadURL,
            bookLanguage,
            bookEdition,
            condition,
            description,
            rentPrice,
          });
        }
        setBookName("");
        setBookImg(null);
        setBookLanguage("");
        setBookEdition("");
        setMotive("donate");
        setPriceOriginal("");
        setPriceOffered("");
        setRentPrice("");
        setCondition("");
        setDescription("");
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  return (
    <>
      <div className="heading">
        <h2>Upload Book Details</h2>
      </div>
      <div className="upload-form-container">
        <form onSubmit={handleSubmit}>
          <label className="form-label">
            Book Name:
            <input
              className="form-input"
              type="text"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              required
            />
          </label>

          <label className="form-label">
            Book Image:
            <input
              className="form-input"
              type="file"
              onChange={handleImageChange}
              required
            />
          </label>

          <label className="form-label">
            Book Language:
            <select
              className="form-select"
              value={bookLanguage}
              onChange={(e) => setBookLanguage(e.target.value)}
              required
            >
              <option value="">Select Language</option>
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="nepali">Nepali</option>
            </select>
          </label>

          <label className="form-label">
            Book Edition:
            <input
              className="form-input"
              type="number"
              value={bookEdition}
              onChange={(e) => setBookEdition(e.target.value)}
              required
            />
          </label>

          <label className="form-label">
            Motive of Upload:
            <div className="form-radio-group">
              <label className="label">
                Donate
                <input
                  type="radio"
                  value="donate"
                  checked={motive === "donate"}
                  onChange={() => setMotive("donate")}
                />
              </label>
              <label className="label">
                Sell
                <input
                  type="radio"
                  value="sale"
                  checked={motive === "sale"}
                  onChange={() => setMotive("sale")}
                />
              </label>
              <label className="label">
                Rent
                <input
                  type="radio"
                  value="rent"
                  checked={motive === "rent"}
                  onChange={() => setMotive("rent")}
                />
              </label>
            </div>
          </label>

          {motive === "sale" && (
            <>
              <label className="form-label">
                Price (Original):
                <input
                  className="form-input"
                  type="number"
                  value={priceOriginal}
                  onChange={(e) => setPriceOriginal(e.target.value)}
                  required
                />
              </label>
              <label className="form-label">
                Price (Offered):
                <input
                  className="form-input"
                  type="number"
                  value={priceOffered}
                  onChange={(e) => setPriceOffered(e.target.value)}
                  required
                />
              </label>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </>
          )}
          {motive === "rent" && (
            <>
              <label className="form-label">
                Price (Original):
                <input
                  className="form-input"
                  type="number"
                  value={priceOriginal}
                  onChange={(e) => setPriceOriginal(e.target.value)}
                  required
                />
              </label>
              <label className="form-label">
                Price (Rent/ day):
                <input
                  className="form-input"
                  type="number"
                  value={rentPrice}
                  onChange={(e) => setRentPrice(e.target.value)}
                  required
                />
              </label>
            </>
          )}

          <label className="form-label">
            Condition:
            <select
              className="form-select"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
            >
              <option value="">Select Condition</option>
              <option value="likeNew">Like New</option>
              <option value="new">New</option>
              <option value="usedGood">Used - Good</option>
              <option value="average">Average</option>
            </select>
          </label>

          <label className="form-label">
            Description:
            <textarea
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="form-button">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default UploadBookForm;
