import * as React from "react";
import { useState } from "react";
import { GalleryItemType } from "../../../utils/types";
import { useNavigate } from "react-router-dom";

interface PhotoVideoGalleryProps {
  items: GalleryItemType[];
}

const PhotoVideoGallery: React.FC<PhotoVideoGalleryProps> = ({ items }) => {
  const hasItems = Array.isArray(items) && items.length > 0;
  const ITEMS_PER_PAGE = 3;

  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (!hasItems) return;
    setIndex((prev) =>
      prev + ITEMS_PER_PAGE >= items.length ? 0 : prev + ITEMS_PER_PAGE
    );
  };

  const prev = () => {
    if (!hasItems) return;
    setIndex((prev) =>
      prev - ITEMS_PER_PAGE < 0
        ? Math.floor((items.length - 1) / ITEMS_PER_PAGE) * ITEMS_PER_PAGE
        : prev - ITEMS_PER_PAGE
    );
  };

  const visibleItems = hasItems
    ? items.slice(index, index + ITEMS_PER_PAGE)
    : [];

  const openDetail = (id: any) => {
    if (!id) return;
    navigate(`/detail/VideoGalleryLibrary/${id}`);
  };

  return (
    <div className="lp-card lp-gallery-og">
      <div className="lp-section-header">
        <h3>Photo Video Gallery</h3>
        <button
          className="lp-viewall"
          onClick={() => navigate("/listing/VideoGalleryLibrary")}
        >
          View all ➜
        </button>
      </div>

      <div className="lp-gallery-carousel-wrapper">
        <div className="lp-gallery">
          {visibleItems.length > 0 ? (
            visibleItems.map((item) =>
              item.imageType === "mp4" || item.imageType === "video" ? (
                <video
                  key={item.id}
                  src={item.url}
                  className="lp-gallery-img"
                  controls
                  onClick={() => openDetail(item.id)}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <img
                  key={item.id}
                  src={item.url}
                  alt={item.description}
                  className="lp-gallery-img"
                  onClick={() => openDetail(item.id)}
                  style={{ cursor: "pointer" }}
                />
              )
            )
          ) : (
            <div className="lp-gallery-empty">
              No gallery items available.
            </div>
          )}
        </div>

        <div className="lp-gallery-nav">
          <button className="lp-circle small" onClick={next} aria-label="Next">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle
                opacity="0.4"
                cx="20"
                cy="20"
                r="19.5"
                transform="matrix(-1 0 0 1 40 0)"
                stroke="black"
                strokeOpacity="0.3"
              />
              <path
                d="M22.5 25L17.5 20L22.5 15"
                stroke="black"
                strokeWidth="1.875"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            className="lp-circle small"
            onClick={prev}
            aria-label="Previous"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle
                opacity="0.4"
                cx="20"
                cy="20"
                r="19.5"
                stroke="black"
                strokeOpacity="0.3"
              />
              <path
                d="M17.5 25L22.5 20L17.5 15"
                stroke="black"
                strokeWidth="1.875"
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

export default PhotoVideoGallery;
