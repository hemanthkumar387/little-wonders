import { useEffect, useRef, useState } from "react";
import "./OurCreations.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const creations = [
  {
    id: 1,
    image: "myimages/keychain2.jpeg",
    title: "Handmade Keychains",
  },
  {
    id: 2,
    image: "myimages/bag.jpeg",
    title: "Crochet Bag",
  },
  {
    id: 3,
    image: "myimages/keychain4.jpeg",
    title: "Handmade Keychains",
  },
  {
    id: 4,
    image: "myimages/flower.jpeg",
    title: "Flower Bouquet",
  },
  {
    id: 5,
    image: "myimages/keychain.jpeg",
    title: "Handmade Keychain",
  },
  {
    id: 6,
    image: "myimages/wrist_art.jpeg",
    title: "Wrist art",
  },
  {
    id: 7,
    image: "myimages/keychain1.jpeg",
    title: "Handmade Keychain",
  },
  {
    id: 8,
    image: "myimages/keychain5.jpeg",
    title: "Handmade Keychains",
  },
  {
    id: 9,
    image: "myimages/flower3.jpeg",
    title: "Flower Bouquet",
  },
];

const OurCreations = () => {
  const galleryRef = useRef(null);
  const sectionRef = useRef(null);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const [selectedCreation, setSelectedCreation] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const items = section.querySelectorAll(".creations-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("creations-item-visible");
          } else {
            entry.target.classList.remove("creations-item-visible");
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -30px 0px",
      },
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedCreation(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const scrollLeft = () => {
    const gallery = galleryRef.current;

    if (!gallery) return;

    const maxScroll = gallery.scrollWidth - gallery.clientWidth;

    if (gallery.scrollLeft <= 5) {
      // Reached beginning → go to end
      gallery.scrollTo({
        left: maxScroll,
        behavior: "smooth",
      });
    } else {
      gallery.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    const gallery = galleryRef.current;

    if (!gallery) return;

    const maxScroll = gallery.scrollWidth - gallery.clientWidth;

    if (gallery.scrollLeft >= maxScroll - 5) {
      // Reached end → go back to beginning
      gallery.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    } else {
      gallery.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  const openLightbox = (creation, index) => {
    setSelectedCreation(creation);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedCreation(null);
  };

  const showPrevious = () => {
    const previousIndex =
      selectedIndex === 0 ? creations.length - 1 : selectedIndex - 1;

    setSelectedIndex(previousIndex);
    setSelectedCreation(creations[previousIndex]);
  };

  const showNext = () => {
    const nextIndex =
      selectedIndex === creations.length - 1 ? 0 : selectedIndex + 1;

    setSelectedIndex(nextIndex);
    setSelectedCreation(creations[nextIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedCreation) return;

      if (e.key === "Escape") {
        closeLightbox();
      }

      if (e.key === "ArrowLeft") {
        showPrevious();
      }

      if (e.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCreation, selectedIndex]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;

    const swipeDistance = touchStartX.current - touchEndX.current;

    // Minimum distance required for a swipe
    if (Math.abs(swipeDistance) < 50) return;

    if (swipeDistance > 0) {
      // Swipe left → next image
      showNext();
    } else {
      // Swipe right → previous image
      showPrevious();
    }
  };

  return (
    <section ref={sectionRef} className="our-creations-section">
      {/* Decorative background */}
      <div className="creations-bg-circle creations-bg-circle-left"></div>
      <div className="creations-bg-circle creations-bg-circle-right"></div>

      <div className="our-creations-container">
        {/* HEADER */}
        <div className="our-creations-header">
          <p className="our-creations-eyebrow creations-reveal">
            OUR CREATIONS
          </p>

          <h2 className="our-creations-title creations-reveal">
            A Glimpse of Our Handmade World
          </h2>

          <p className="our-creations-subtitle creations-reveal">
            Little pieces of creativity, made with care and love.
          </p>
        </div>

        {/* GALLERY */}
        <div className="creations-gallery-wrapper">
          {/* LEFT ARROW */}
          <button
            type="button"
            className="creations-arrow creations-arrow-left"
            aria-label="Previous creations"
            onClick={scrollLeft}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          <div className="creations-gallery" ref={galleryRef}>
            {creations.map((creation, index) => (
              <div
                className="creation-card creations-reveal"
                key={creation.id}
                onClick={() => openLightbox(creation, index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    openLightbox(creation, index);
                  }
                }}
              >
                <div className="creation-image-wrapper">
                  <img
                    src={creation.image}
                    alt={creation.title}
                    className="creation-image"
                  />

                  <div className="creation-overlay">
                    <span>{creation.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT ARROW */}
          <button
            type="button"
            className="creations-arrow creations-arrow-right"
            aria-label="Next creations"
            onClick={scrollRight}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
      {selectedCreation && (
        <div
          className="creation-lightbox"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* CLOSE */}
          <button
            type="button"
            className="creation-lightbox-close"
            aria-label="Close image viewer"
            onClick={closeLightbox}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>

          {/* PREVIOUS */}
          <button
            type="button"
            className="creation-lightbox-nav creation-lightbox-prev"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              showPrevious();
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          {/* MAIN IMAGE */}
          <div
            className="creation-lightbox-main"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={selectedCreation.image}
              alt={selectedCreation.title}
              className="creation-lightbox-image"
            />

            <p className="creation-lightbox-title">{selectedCreation.title}</p>
          </div>

          {/* NEXT */}
          <button
            type="button"
            className="creation-lightbox-nav creation-lightbox-next"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>

          {/* THUMBNAILS */}
          <div
            className="creation-lightbox-thumbnails"
            onClick={(e) => e.stopPropagation()}
          >
            {creations.map((creation, index) => (
              <button
                type="button"
                key={creation.id}
                className={`creation-lightbox-thumbnail ${
                  selectedIndex === index ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedIndex(index);
                  setSelectedCreation(creation);
                }}
                aria-label={`View ${creation.title}`}
              >
                <img src={creation.image} alt={creation.title} />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default OurCreations;
