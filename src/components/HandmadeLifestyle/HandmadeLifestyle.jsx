import "./HandmadeLifestyle.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faHeart,
  faLeaf,
  faPalette,
  faScissors,
  faArrowRight,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";

const HandmadeLifestyle = () => {
  return (
    <section className="handmade-lifestyle-section">

      {/* Decorative background shapes */}
      <div className="lifestyle-bg-circle lifestyle-bg-circle-one"></div>
      <div className="lifestyle-bg-circle lifestyle-bg-circle-two"></div>

      <div className="handmade-lifestyle-container">

        {/* =========================================
            LEFT CREATIVE AREA
        ========================================= */}

        <div className="lifestyle-visual">

          <div className="lifestyle-visual-circle">

            <div className="lifestyle-main-icon">
              <FontAwesomeIcon icon={faHeart} />
            </div>

            <span className="lifestyle-stitch stitch-one">
              ✦
            </span>

            <span className="lifestyle-stitch stitch-two">
              ✦
            </span>

            <span className="lifestyle-stitch stitch-three">
              ·
            </span>

          </div>


          {/* Floating cards */}

          <div className="lifestyle-mini-card lifestyle-card-one">

            <div className="lifestyle-mini-icon">
              <FontAwesomeIcon icon={faLeaf} />
            </div>

            <div>
              <strong>Natural</strong>
              <span>Materials</span>
            </div>

          </div>


          <div className="lifestyle-mini-card lifestyle-card-two">

            <div className="lifestyle-mini-icon">
              <FontAwesomeIcon icon={faScissors} />
            </div>

            <div>
              <strong>Made</strong>
              <span>By Hand</span>
            </div>

          </div>


          <div className="lifestyle-mini-card lifestyle-card-three">

            <div className="lifestyle-mini-icon">
              <FontAwesomeIcon icon={faPalette} />
            </div>

            <div>
              <strong>Creative</strong>
              <span>Details</span>
            </div>

          </div>

        </div>


        {/* =========================================
            CONTENT
        ========================================= */}

        <div className="handmade-lifestyle-content">

          <div className="lifestyle-content-top">

            <span className="lifestyle-small-icon">
              <FontAwesomeIcon icon={faHouse} />
            </span>

            <p className="handmade-lifestyle-eyebrow">
              HANDMADE LIFESTYLE
            </p>

          </div>


          <h2>
            Create a Warmer,
            <br />
            <span>Happier Space</span>
          </h2>


          <p className="handmade-lifestyle-description">
            Bring warmth and charm to your home with
            <br className="lifestyle-desktop-break" />
            handmade creations that tell a story.
          </p>


          {/* Small benefits */}

          <div className="lifestyle-benefits">

            <div className="lifestyle-benefit">
              <FontAwesomeIcon icon={faHeart} />
              <span>Made with love</span>
            </div>

            <div className="lifestyle-benefit">
              <FontAwesomeIcon icon={faLeaf} />
              <span>Thoughtfully crafted</span>
            </div>

          </div>


          {/* CTA */}

          <a
            href="/products"
            className="handmade-lifestyle-button"
          >
            <span>Explore Home Decor</span>

            <span className="lifestyle-button-arrow">
              <FontAwesomeIcon icon={faArrowRight} />
            </span>

          </a>

        </div>


        {/* Decorative leaf */}

        <div className="lifestyle-decorative-leaf">
          <FontAwesomeIcon icon={faLeaf} />
        </div>


        {/* Decorative heart */}

        <div className="lifestyle-decorative-heart">
          <FontAwesomeIcon icon={faHeart} />
        </div>

      </div>

    </section>
  );
};

export default HandmadeLifestyle;