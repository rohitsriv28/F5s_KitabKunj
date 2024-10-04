import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./components/signup/signup";
import Login from "./components/signup/login";
import Navbar from "./components/navbar/navbar";
import Hero from "./components/hero/hero";
import UploadBookForm from "./components/UploadBookForm/UploadBookForm";
import AllBooks from "./components/allBook/allBook";
import BookDetails from "./components/allBook/BookDetails";
import PendingBooksList from "./components/approve/approve";
import ApproveRent from "./components/approve/approveRent";
import UserRent from "./components/allBook/userRent";
import MyBoughtBook from "./components/allBook/myBoughtBook";
import SellerBook from "./components/allBook/sellerBook";
import RenterBook from "./components/allBook/renterBook";
import BooksForRent from "./components/allBook/BooksForRent";
import BooksForSale from "./components/allBook/BooksForSale";
import BooksForDonate from "./components/allBook/BooksForDonate";
import ErrorPG from "./components/error/error";
import ChatPage from "./components/support/support";
import MyProfile from "./components/users/myProfile/myProfile";
import PaymentForm from "./components/uploadCredit/uploadCredit";
import RecentDonors from "./components/topDonar/topDonar";
import Footer from "./components/footer/footer";
import Loader from "./components/loader/loader";
import Profile from "./components/profile/profile";
import Home from "./components/home/home";
import ProfileLayout from "./components/users/myProfile/profileLayout";
import MyBookDetails from "./components/allBook/myBookDetails";
import Chat from "./components/chat/ChatComponent";
import ChatBubble from "./components/support/ChatBubble";
import BookRequeestForm from "./components/bookRequest/bookRequest";
import SeeReq from "./components/allBook/seeReq";
import HostEvent from "./components/event/HostEvent";
import EventPage from "./components/event/EventPage";
import ViewEvents from "./components/event/ViewEvents";
import ViewOrganisedEvents from "./components/event/ViewOrganisedEvents";
import OrganisedEventDetails from "./components/event/OrganisedEventDetails";
import AdminLayout from "./Admin/adminLayout/layout";
// import ChatComponent from "./components/chat/ChatComponent";

function App() {
  const [isChatOpen, setChatOpen] = useState(false);

  const openChat = () => {
    setChatOpen(true);
  };

  const closeChat = () => {
    setChatOpen(false);
  };

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <div className="heightOp">
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/UploadBookForm" element={<UploadBookForm />} />
            <Route path="/home" element={<Hero />} />
            <Route path="/all" element={<AllBooks />} />
            <Route path="/all/:id" element={<BookDetails />} />
            <Route path="/PendingBooksList" element={<PendingBooksList />} />
            <Route path="/ApproveRent" element={<ApproveRent />} />
            <Route path="/UserRent" element={<UserRent />} />
            <Route path="/MyBoughtBook" element={<MyBoughtBook />} />
            <Route path="/SellerBook" element={<SellerBook />} />
            <Route path="/RenterBook" element={<RenterBook />} />
            <Route path="/rent" element={<BooksForRent />} />
            <Route path="/buy" element={<BooksForSale />} />
            <Route path="/loader" element={<Loader />} />
            <Route path="/donate" element={<BooksForDonate />} />
            <Route path="/requestForm" element={<BookRequeestForm/>}/>
            {/* <Route path="/profile" element={<Profile />} /> */}
            <Route path="*" element={<ErrorPG />} />
            <Route path="/support" element={<ChatPage />} />
            <Route path="/MyProfile" element={<MyProfile />} />
            <Route path="/PaymentForm" element={<PaymentForm />} />
            <Route path="/RecentDonors" element={<RecentDonors />} />
            <Route path="/ProfileLayout" element={<ProfileLayout />} />
            <Route
              path="/books/:myUID/:bookId/:id"
              element={<MyBookDetails />}
            />
            <Route path="/host-event" element={<HostEvent />} />
            <Route path="/event/:eventId" element={<EventPage />} />
            <Route path="/events" element={<ViewEvents />} />
            <Route
              path="/ViewOrganisedEvents"
              element={<ViewOrganisedEvents />}
            />
            <Route
              path="/organised-events"
              element={<OrganisedEventDetails />}
            />
            <Route path="/" element={<Home />} />
            <Route path="/d" element={<SeeReq />} />
            <Route path="/dash" element={<AdminLayout />} />
          </Routes>
        </div>
        <Footer />
        <ChatBubble onClick={openChat} />
        <ChatPage
          isAdmin={false}
          isOpen={isChatOpen}
          onRequestClose={closeChat}
        />
      </BrowserRouter>
    </>
  );
}

export default App;
