import { useEffect, useRef } from "react";
import "./MoreThanProduct.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faLeaf,
  faHeart,
  faLightbulb,
  faGift,
} from "@fortawesome/free-solid-svg-icons";

const features = [
  {
    icon: faLeaf,
    title: "Unique",
    description: "Every piece has its own character.",
    className: "feature-leaf",
  },
  {
    icon: faHeart,
    title: "Personal",
    description: "Created by real hands, not machines.",
    className: "feature-heart",
  },
  {
    icon: faLightbulb,
    title: "Thoughtful",
    description: "Made with care from beginning to end.",
    className: "feature-lightbulb",
  },
  {
    icon: faGift,
    title: "Meaningful",
    description: "Something special to keep or gift.",
    className: "feature-gift",
  },
];

const MoreThanProduct = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("more-product-visible");
        } else {
          section.classList.remove("more-product-visible");
        }
      },
      {
        threshold: 0.15,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);
  return (
    <section ref={sectionRef} className="more-product-section">
      <img
        src="/images/leaf-orange.png"
        alt=""
        className="hero-decoration leaf-orange-morethanproduct"
      />

      {/* Decorative element */}
      <div className="more-product-decoration">♡</div>

      <div className="more-product-container">
        {/* LEFT CONTENT */}
        <div className="more-product-content">
          <p className="more-product-eyebrow">WHY CHOOSE HANDMADE?</p>

          <h2 className="more-product-title">More Than Just a Product</h2>

          <p className="more-product-description">
            Every piece carries a little story, a little effort, and a lot of
            care. That's what makes handmade truly special.
          </p>

          {/* Features */}
          <div className="more-product-features">
            {features.map((feature) => (
              <div className="more-product-feature" key={feature.title}>
                <div className={`more-feature-icon ${feature.className}`}>
                  <FontAwesomeIcon icon={feature.icon} />
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="more-product-image-wrapper">
          <img
            src="/images/morethanproduct_image.png"
            alt="Handmade crochet being crafted"
            className="more-product-image"
          />
        </div>
      </div>
    </section>
  );
};

export default MoreThanProduct;
