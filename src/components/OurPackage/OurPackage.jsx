import { useEffect, useRef } from "react";
import "./OurPackage.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

const steps = [
  {
    number: "1.",
    title: "Crochet",
    description: (
      <>
        With love, one stitch
        <br />
        at a time.
      </>
    ),
    image: "/images/process-crochet.png",
  },
  {
    number: "2.",
    title: "Wrap",
    description: (
      <>
        Beautifully packed
        <br />
        with care.
      </>
    ),
    image: "/images/process-wrap.png",
  },
  {
    number: "3.",
    title: "Thank You Card",
    description: (
      <>
        A little note
        <br />
        from our hearts.
      </>
    ),
    image: "/images/process-thankyou.png",
  },
  {
    number: "4.",
    title: "Happy Home",
    description: (
      <>
        Handmade touches
        <br />
        for a happier space.
      </>
    ),
    image: "/images/process-home.png",
  },
];

const OurPackage = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const items = section.querySelectorAll(".package-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("package-item-visible");
          } else {
            entry.target.classList.remove("package-item-visible");
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="our-package-section">
      {/* Decorative elements */}
      <div className="package-corner package-corner-top-left">
        <span className="package-flower">✿</span>
        <span className="package-yarn-line">♡</span>
      </div>

      <div className="package-corner package-corner-top-right">
        <span className="package-heart">♡</span>
        <span className="package-leaves">❧</span>
      </div>

      <div className="package-corner package-corner-bottom-left" />
      <div className="package-corner package-corner-bottom-right" />

      <div className="our-package-container">
        {/* HEADER */}
        <div className="our-package-header">
          <div className="package-eyebrow-row package-reveal">
            <span>OUR package</span>
            <span className="package-small-heart">♥</span>
          </div>

          <h2 className="our-package-title package-reveal">
            From Yarn to Handmade
          </h2>

          <div className="package-title-decoration package-reveal">
            <span />
            <FontAwesomeIcon icon={faHeart} />
            <span />
          </div>

          <p className="our-package-subtitle package-reveal">
            package filled with care and creativity.
          </p>
        </div>

        {/* STEPS */}
        <div className="package-steps">
          {steps.map((step, index) => (
            <div className="package-step-wrapper package-reveal" key={step.title}>
              <article className="package-step">
                <div className="package-image-wrapper">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="package-image"
                  />
                </div>

                <h3 className="package-step-title">
                  <span>{step.number}</span> {step.title}
                </h3>

                <p className="package-step-description">
                  {step.description}
                </p>
              </article>

              {index < steps.length - 1 && (
                <div className="package-arrow" aria-hidden="true">
                  <FontAwesomeIcon icon={faArrowRight} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* BOTTOM MESSAGE */}
        <div className="package-bottom-message package-reveal">
          <span className="package-bottom-leaf">❧</span>

          <h3>From Our Hands to Your Home</h3>

          <span className="package-bottom-leaf package-bottom-leaf-right">
            ❧
          </span>

          <div className="package-bottom-heart">
            <span />
            <FontAwesomeIcon icon={faHeart} />
            <span />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPackage;
