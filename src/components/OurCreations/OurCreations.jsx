import { useRef } from "react";
import "./OurCreations.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

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

  return (
    <section className="our-creations-section">
      {/* Decorative background */}
      <div className="creations-bg-circle creations-bg-circle-left"></div>
      <div className="creations-bg-circle creations-bg-circle-right"></div>

      <div className="our-creations-container">
        {/* HEADER */}
        <div className="our-creations-header">
          <p className="our-creations-eyebrow">OUR CREATIONS</p>

          <h2 className="our-creations-title">
            A Glimpse of Our Handmade World
          </h2>

          <p className="our-creations-subtitle">
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
            {creations.map((creation) => (
              <div className="creation-card" key={creation.id}>
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
    </section>
  );
};

export default OurCreations;
