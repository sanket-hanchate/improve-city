import React, { useState, useEffect } from 'react';
import './index.css';

const slides = [
  { 
    id: 1, 
    url: "https://images.unsplash.com/photo-1542037104857-ff90150d4e4f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    caption: "Empowering communities, one report at a time." 
  },
  { 
    id: 2, 
    url: "https://images.unsplash.com/photo-1558961363-23376083bda4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    caption: "Fast, easy, and impactful civic engagement." 
  },
  { 
    id: 3, 
    url: "https://images.unsplash.com/photo-1490604169996-0371ca1e6fd2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    caption: "Your location pin is the first step to resolution." 
  },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Auto-play feature
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-slide" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((slide) => (
          <div key={slide.id} className="carousel-item">
            <img src={slide.url} alt={`Slide ${slide.id}`} className="carousel-image" />
            <div className="carousel-caption">
              <h2>{slide.caption}</h2>
              <button onClick={() => document.getElementById('report-form-anchor').scrollIntoView({ behavior: 'smooth' })}>
                Report Now! 👇
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows */}
      <button className="carousel-arrow left" onClick={prevSlide}>&#10094;</button>
      <button className="carousel-arrow right" onClick={nextSlide}>&#10095;</button>

      {/* Dots */}
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <span 
            key={index} 
            className={`dot ${index === current ? 'active' : ''}`}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;