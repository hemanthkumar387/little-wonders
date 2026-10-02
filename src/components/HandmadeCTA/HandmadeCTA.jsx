import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./HandmadeCTA.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowRight,
  faHeart,
  faLeaf,
  faSeedling,
} from "@fortawesome/free-solid-svg-icons";

const HandmadeCTA = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const items = section.querySelectorAll(".cta-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("cta-item-visible");
          } else {
            entry.target.classList.remove("cta-item-visible");
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

  return (
    <section ref={sectionRef} className="handmade-cta-section">
      {/* =========================================
          LEFT DECORATIVE AREA
      ========================================= */}

      <div className="cta-left-decoration">
        <div className="cta-flower cta-reveal">
          <FontAwesomeIcon icon={faLeaf} />
        </div>

        <div className="cta-yarn cta-yarn-pink cta-reveal"></div>

        <div className="cta-yarn cta-yarn-cream cta-reveal"></div>

        <div className="cta-yarn cta-yarn-small cta-reveal"></div>
      </div>

      {/* =========================================
          CONTENT
      ========================================= */}

      <div className="handmade-cta-content">
        <span className="cta-small-heart cta-reveal">
          <FontAwesomeIcon icon={faHeart} />
        </span>

        <p className="handmade-cta-eyebrow cta-reveal">MADE WITH LOVE</p>

        <h2 className="cta-reveal">
          Find Something
          <br />
          <span>Made Just for You.</span>
        </h2>

        <p className="handmade-cta-description cta-reveal">
          Explore our collection and discover handmade pieces
          <br className="cta-desktop-break" />
          that bring warmth, beauty, and joy to your everyday life.
        </p>

        <Link to="/products" className="handmade-cta-button cta-reveal">
          <span>Explore All Products</span>

          <span className="cta-button-icon">
            <FontAwesomeIcon icon={faArrowRight} />
          </span>
        </Link>
      </div>

      {/* =========================================
          RIGHT DECORATIVE AREA
      ========================================= */}

      <div className="cta-right-decoration">
        <div className="cta-flower cta-reveal">
          <FontAwesomeIcon icon={faSeedling} />
        </div>

        <div className="cta-yarn cta-yarn-green cta-reveal"></div>

        <div className="cta-yarn cta-yarn-pink-right cta-reveal"></div>

        <div className="cta-yarn cta-yarn-beige cta-reveal"></div>
      </div>
    </section>
  );
};

export default HandmadeCTA;
