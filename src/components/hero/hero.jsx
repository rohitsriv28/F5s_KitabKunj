import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Hero.css';
import { Link } from 'react-router-dom';

const Hero = () => {
  const bookImages = [
    '/images/book1.avif',
    '/images/book2.png',
    '/images/book3.jpg',
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="hero-container">
      <div className="hero-content">
        <Slider {...settings}>
          {bookImages.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Book ${index + 1}`} />
            </div>
          ))}
        </Slider>
        <div className="text-overlay">
          <h1>Your Book Journey Starts Here</h1>
          <p>Explore, Share, Learn - A World of Books Awaits You</p>
          <div className="cta-button">
            <button><Link to="/login">Get Started</Link></button>
          </div>
          <div className="social-icons">
            <FontAwesomeIcon icon={faFacebook} />
            <FontAwesomeIcon icon={faTwitter} />
            <FontAwesomeIcon icon={faInstagram} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
