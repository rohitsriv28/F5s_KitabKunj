import React, { useState } from "react";
import { db, storage } from "../helper/firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./uploadCredit.css";

const PaymentForm = () => {
  const userId = localStorage.getItem("uid");
  const [paymentImage, setPaymentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);
  const [check, setCheck] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageSelected(true);
    setPaymentImage(file);
    setCheck(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (paymentImage) {
        setLoading(true);

        const storageRef = ref(
          storage,
          `payment_slips/${userId}_${Date.now()}`
        );
        await uploadBytes(storageRef, paymentImage);

        const downloadURL = await getDownloadURL(storageRef);

        const paymentsCollection = collection(db, "creditPayments");
        const paymentDocRef = doc(paymentsCollection, userId);

        const paymentDocSnapshot = await getDoc(paymentDocRef);
        const existingData = paymentDocSnapshot.exists()
          ? paymentDocSnapshot.data()
          : { payments: [] };

        const updatedPayments = [
          ...existingData.payments,
          { imageLink: downloadURL, paidOn: Timestamp.now() },
        ];

        await setDoc(
          paymentDocRef,
          { payments: updatedPayments },
          { merge: true }
        );

        alert("Payment uploaded successfully!");
        setPaymentImage(null);
        setImageSelected(false);
        setCheck(null);
      }
    } catch (error) {
      console.error("Error uploading payment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form-container">
      <div className="left-section">
        <h2>Payment Details</h2>
        {/* Add dummy payment details and placeholder image here */}
        <p>Bank: ABC Bank</p>
        <img
          src="https://via.placeholder.com/150" // Replace with your placeholder image URL
          alt="QR Code"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <div className="right-section">
        <div className="payment-form">
          <h2>Payment Form</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Select Payment Slip:
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                required
              />
            </label>
            {imageSelected && (
              <div>
                <p>Selected Image Preview:</p>
                <img
                  src={URL.createObjectURL(paymentImage)}
                  alt="Selected Payment Slip"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            )}
            <button type="submit" disabled={!imageSelected || loading}>
              {loading ? "Uploading..." : "Submit Payment"}
            </button>
          </form>   
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
