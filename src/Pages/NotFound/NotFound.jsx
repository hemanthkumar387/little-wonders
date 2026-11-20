
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faHeart,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

import "./NotFound.css";

export default function NotFound() {
  return (
    <section className="lw-not-found">
      <div className="lw-not-found-content">
        <div className="lw-not-found-icon">
          <FontAwesomeIcon icon={faHeart} />
        </div>

        <span className="lw-not-found-label">
          OOPS! SOMETHING WENT MISSING
        </span>

        <h1>
          4<span>0</span>4
        </h1>

        <h2>This page wandered off!</h2>

        <p>
          Looks like the page you're looking for doesn't exist or may have
          been moved. Don't worry, let's get you back to something lovely.
        </p>

        <div className="lw-not-found-actions">
          <Link to="/" className="lw-not-found-home">
            <FontAwesomeIcon icon={faHouse} />
            Back to Home
          </Link>

          <Link to="/products" className="lw-not-found-products">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            Explore Products
          </Link>
        </div>

        <div className="lw-not-found-footer">
          <FontAwesomeIcon icon={faHeart} />
          <span>LittleWonders — Nurture. Grow. Inspire.</span>
        </div>
      </div>
    </section>
  );
}
