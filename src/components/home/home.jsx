import React from "react";
import "./home.css"

function Home() {
  return (
    <section id="home">
      <div className="home">
        <div className="homeLeft">
            <h1>Empower<br/>Minds,Ignite<br/>Change</h1>
            {/* <br/> */}
            <h3>Unlesh the Power of Books Through Generosity</h3>
        </div>
        <div className="homeRight">
            <div className="homeRightIm"></div>
            {/* <img src="/images/hero.png" alt="" /> */}
        </div>
      </div>
    </section>
  );
}

export default Home;
