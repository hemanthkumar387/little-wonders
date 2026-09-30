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
  return (
    <section className="handmade-cta-section">

      {/* =========================================
          LEFT DECORATIVE AREA
      ========================================= */}

      <div className="cta-left-decoration">

        <div className="cta-flower">
          <FontAwesomeIcon icon={faLeaf} />
        </div>

        <div className="cta-yarn cta-yarn-pink"></div>

        <div className="cta-yarn cta-yarn-cream"></div>

        <div className="cta-yarn cta-yarn-small"></div>

      </div>


      {/* =========================================
          CONTENT
      ========================================= */}

      <div className="handmade-cta-content">

        <span className="cta-small-heart">
          <FontAwesomeIcon icon={faHeart} />
        </span>

        <p className="handmade-cta-eyebrow">
          MADE WITH LOVE
        </p>

        <h2>
          Find Something
          <br />
          <span>Made Just for You.</span>
        </h2>

        <p className="handmade-cta-description">
          Explore our collection and discover handmade pieces
          <br className="cta-desktop-break" />
          that bring warmth, beauty, and joy to your everyday life.
        </p>

        <Link
          to="/products"
          className="handmade-cta-button"
        >
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

    <div className="cta-flower">
          <FontAwesomeIcon icon={faSeedling} />
        </div>

        <div className="cta-yarn cta-yarn-green"></div>

        <div className="cta-yarn cta-yarn-pink-right"></div>

        <div className="cta-yarn cta-yarn-beige"></div>

      </div>

    </section>
  );
};

export default HandmadeCTA;