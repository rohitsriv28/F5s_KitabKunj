import { useEffect, useState } from "react";
import { collection, setDoc, doc, getDocs } from "firebase/firestore"; 
import { db, auth } from "../helper/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export function useSignupHook() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
  });

  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword);
  }, [formData.password, formData.confirmPassword]);

  const signUp = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    )
      .then(async (userCredential) => {
        const user = userCredential.user;
        await updateProfile(auth.currentUser, {
          displayName: formData.name,
        });

        var userDataCollection = collection(db, "users");
        await setDoc(doc(userDataCollection, user.uid), {
          ...formData,
          uid: user.uid,
          credit: 1000,
          role: ""
        });

        alert("User Created");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          address: "",
          phone: "",
        });
      })
      .catch((error) => {
        console.log(`${error.message}`);
      });
  };

  const getUser = async () => {
    var userData = collection(db, "users");
    var result = await getDocs(userData);
    return result.docs.map((doc) => doc.data());
  };

  return {
    formData,
    setFormData,
    passwordMatch,
    signUp,
    getUser,
  };
}
