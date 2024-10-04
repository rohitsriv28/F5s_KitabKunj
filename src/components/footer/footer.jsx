import React from "react";
import "../footer/footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <div className="footer">
        <div className="footerdetail">
        <div className="firstFooter">
          <div className="footerLogo">
          </div>
          <div className="social-icons">
            <FontAwesomeIcon icon={faFacebook} />
            <FontAwesomeIcon icon={faTwitter} />
            <FontAwesomeIcon icon={faInstagram} />
          </div>
        </div>
        <div className="secondFooter">
          <h2>Contact</h2>
          <span>Link-road,Birgunj</span>
          <span>Madhesh Province</span>
          <span>Nepal</span>
        </div>
        <div className="thirdFooter">
          <h2>Usefull Link</h2>
          <ol>
            <Link to="/UploadBookForm"><li>Place your Book</li></Link>
            <Link to="requestForm"><li>Book request</li></Link>
            <Link to="/RecentDonors"><li>Doanar List</li></Link>
            <Link to="#"><li>Donation Event</li></Link>
            <Link to="#"><li>Event Blogs</li></Link>
          </ol>
        </div>
        <div className="fourthFooter">
          <h2>Legal</h2>
          <ol>
            <li>Privacy</li>
            <li>T &amp; C</li>
            <li>Add</li>
            <li>Add</li>
          </ol>
        </div>
        </div>
        <div className="copyright">
        <p>&copy; 2024 KitabKunj. All rights reserved.</p>
        </div>
      </div>
    </>
  );
}

export default Footer;
