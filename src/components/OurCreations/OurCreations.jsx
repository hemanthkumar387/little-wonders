import { useEffect, useRef, useState, useCallback } from "react";
import "./OurCreations.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faArrowRight,
  faArrowLeft,
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
    title: "Wrist Art",
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
  const isAdjustingScroll = useRef(false);
  const scrollFrame = useRef(null);

  const [selectedCreation, setSelectedCreation] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Three sets provide enough buffer on both sides.
  const loopedCreations = [...creations, ...creations, ...creations];

  // Get the width of one complete set, including gaps.
  const getSetWidth = useCallback(() => {
    const gallery = galleryRef.current;

    if (!gallery) return 0;

    const firstCard = gallery.querySelector(".creation-card");

    if (!firstCard) return 0;

    const styles = window.getComputedStyle(gallery);
    const gap = parseFloat(styles.columnGap) || 0;

    return (firstCard.offsetWidth + gap) * creations.length;
  }, []);

  // Initialize at the middle set.
  useEffect(() => {
    const gallery = galleryRef.current;

    if (!gallery) return;

    let frame;

    const initializeGallery = () => {
      const setWidth = getSetWidth();

      if (setWidth > 0) {
        gallery.scrollLeft = setWidth;
      }
    };

    frame = requestAnimationFrame(initializeGallery);

    return () => cancelAnimationFrame(frame);
  }, [getSetWidth]);

  // Keep the scroll position inside the middle set.
  const handleGalleryScroll = useCallback(() => {
    const gallery = galleryRef.current;

    if (!gallery || isAdjustingScroll.current) return;

    if (scrollFrame.current) {
      cancelAnimationFrame(scrollFrame.current);
    }

    scrollFrame.current = requestAnimationFrame(() => {
      const setWidth = getSetWidth();

      if (!setWidth) return;

      const currentPosition = gallery.scrollLeft;

      isAdjustingScroll.current = true;

      // Move forward when approaching the third set.
      if (currentPosition >= setWidth * 1.8) {
        gallery.scrollLeft = currentPosition - setWidth;
      }

      // Move backward when approaching the first set.
      else if (currentPosition <= setWidth * 0.2) {
        gallery.scrollLeft = currentPosition + setWidth;
      }

      requestAnimationFrame(() => {
        isAdjustingScroll.current = false;
      });
    });
  }, [getSetWidth]);

  // Mouse wheel: vertical wheel movement scrolls horizontally.
  useEffect(() => {
    const gallery = galleryRef.current;

    if (!gallery) return;

    const handleWheel = (event) => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.preventDefault();
        gallery.scrollBy({
          left: event.deltaY,
          behavior: "auto",
        });
      }
    };

    gallery.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      gallery.removeEventListener("wheel", handleWheel);

      if (scrollFrame.current) {
        cancelAnimationFrame(scrollFrame.current);
      }
    };
  }, []);

  // Recalculate the middle position after resizing.
  useEffect(() => {
    const gallery = galleryRef.current;

    if (!gallery) return;

    const handleResize = () => {
      const setWidth = getSetWidth();

      if (setWidth > 0) {
        gallery.scrollLeft = setWidth;
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [getSetWidth]);

  // Scroll reveal animation.
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const items = section.querySelectorAll(".creations-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("creations-item-visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -20px 0px",
      },
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  // Lightbox navigation.
  const closeLightbox = useCallback(() => {
    setSelectedCreation(null);
  }, []);

  const showPrevious = useCallback(() => {
    setSelectedIndex((currentIndex) => {
      const previousIndex =
        (currentIndex - 1 + creations.length) % creations.length;

      setSelectedCreation(creations[previousIndex]);

      return previousIndex;
    });
  }, []);

  const showNext = useCallback(() => {
    setSelectedIndex((currentIndex) => {
      const nextIndex = (currentIndex + 1) % creations.length;

      setSelectedCreation(creations[nextIndex]);

      return nextIndex;
    });
  }, []);

  const openLightbox = (creation, index) => {
    setSelectedCreation(creation);
    setSelectedIndex(index);
  };

  // Keyboard controls.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedCreation) return;

      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCreation, closeLightbox, showPrevious, showNext]);

  // Touch/swipe controls for lightbox.
  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    const touchEndX = event.changedTouches[0].clientX;

    const swipeDistance = touchStartX.current - touchEndX;

    if (Math.abs(swipeDistance) < 50) return;

    if (swipeDistance > 0) {
      showNext();
    } else {
      showPrevious();
    }
  };

  return (
    <section ref={sectionRef} className="our-creations-section">
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

        {/* INFINITE GALLERY */}
        <div className="creations-gallery-wrapper">
          <div
            className="creations-gallery"
            ref={galleryRef}
            onScroll={handleGalleryScroll}
            aria-label="Our handmade creations"
          >
            {loopedCreations.map((creation, loopIndex) => {
              const originalIndex = loopIndex % creations.length;

              return (
                <div
                  className="creation-card creations-reveal"
                  key={`${creation.id}-${loopIndex}`}
                  onClick={() => openLightbox(creation, originalIndex)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openLightbox(creation, originalIndex);
                    }
                  }}
                >
                  <div className="creation-image-wrapper">
                    <img
                      src={creation.image}
                      alt={creation.title}
                      className="creation-image"
                      loading="lazy"
                    />

                    <div className="creation-overlay">
                      <span>{creation.title}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX */}
      {selectedCreation && (
        <div className="creation-lightbox" onClick={closeLightbox}>
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
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          {/* MAIN IMAGE */}
          <div
            className="creation-lightbox-main"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={selectedCreation.image}
              alt={selectedCreation.title}
              className="creation-lightbox-image"
              draggable="false"
            />

            <p className="creation-lightbox-title">{selectedCreation.title}</p>
          </div>

          {/* NEXT */}
          <button
            type="button"
            className="creation-lightbox-nav creation-lightbox-next"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>

          {/* THUMBNAILS */}
          <div
            className="creation-lightbox-thumbnails"
            onClick={(event) => event.stopPropagation()}
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
