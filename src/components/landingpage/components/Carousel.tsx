import * as React from "react";
import { useState, useEffect } from "react";
import { HeroSlide } from "../../../utils/types";

interface CarouselProps {
  slides: HeroSlide[];
}

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const [idx, setIdx] = useState(0);

  // Reset index when new slides arrive
  useEffect(() => {
    setIdx(0);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="lp-card lp-carousel">
      <img
        src={slides[idx].image}
        alt="hero"
        className="lp-carousel-img"
      />

      <div className="lp-carousel-overlay">
        <div className="lp-carousel-left">
          <h1 className="lp-carousel-title">{slides[idx].title}</h1>
          <p className="lp-carousel-excerpt">{slides[idx].subtitle}</p>
        </div>

        <div className="lp-carousel-controls">
          <button
            className="lp-arrow-btn"
            onClick={() => setIdx((idx - 1 + slides.length) % slides.length)}
            aria-label="Previous slide"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="39"
                height="39"
                rx="19.5"
                stroke="white"
                strokeOpacity="0.3"
              />
              <path
                d="M22.3359 24.6654L17.6693 19.9987L22.3359 15.332"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            className="lp-arrow-btn"
            onClick={() => setIdx((idx + 1) % slides.length)}
            aria-label="Next slide"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="39"
                height="39"
                rx="19.5"
                stroke="white"
                strokeOpacity="0.3"
              />
              <path
                d="M17.6641 15.3346L22.3307 20.0013L17.6641 24.668"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Carousel;
