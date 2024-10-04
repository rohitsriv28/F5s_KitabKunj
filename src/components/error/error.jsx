import React from "react";
import { Link } from "react-router-dom";
import "./error.css";

function ErrorPG({ msg, msgcode,link }) {
  return (
    <>
      <div id="notfound">
        <div className="notfound">
          <div className="notfound-404">
            <h1>{msgcode ? msgcode : "404"}</h1>
          </div>
          <h2>
            {msg ? msg : "Oops, The Page you are looking for can't be found!"}
          </h2>
          <Link to={link?link:"/"}>
            <span className="arrow"></span>Return To Homepage
          </Link>
        </div>
      </div>
    </>
  );
}

export default ErrorPG;
