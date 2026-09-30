import "./OurProcess.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faCartShopping,
  faScissors,
  faSeedling,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

const processSteps = [
  {
    number: "01",
    icon: faCartShopping,
    title: "Select",
    description: "Carefully chosen materials.",
    className: "process-yarn",
  },
  {
    number: "02",
    icon: faScissors,
    title: "Create",
    description: "Crafted with patience.",
    className: "process-create",
  },
  {
    number: "03",
    icon: faSeedling,
    title: "Craft",
    description: "Bringing the design to life.",
    className: "process-craft",
  },
  {
    number: "04",
    icon: faHeart,
    title: "Finish",
    description: "A piece made with love.",
    className: "process-finish",
  },
];

const OurProcess = () => {
  return (
    <section className="our-process-section">
      {/* Decorative elements */}
      <div className="process-decoration process-decoration-heart">♡</div>

      <div className="our-process-container">
        {/* LEFT IMAGE */}
        <div className="our-process-image-wrapper">
          <img
            src="/images/our_process.png"
            alt="Yarn and handmade materials"
            className="our-process-image"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="our-process-content">
          <p className="our-process-eyebrow">OUR PROCESS</p>

          <h2 className="our-process-title">From Yarn to Handmade</h2>

          <p className="our-process-subtitle">
            Process filled with care and creativity.
          </p>

          {/* PROCESS STEPS */}
          <div className="process-steps">
            {processSteps.map((step, index) => (
              <div className="process-step-wrapper" key={step.number}>
                <div className="process-step">
                  <div className={`process-icon ${step.className}`}>
                    <FontAwesomeIcon icon={step.icon} />
                  </div>

                  <span className="process-number">{step.number}</span>

                  <h3>{step.title}</h3>

                  <p>{step.description}</p>
                </div>

                {/* Arrow between steps */}
                {index < processSteps.length - 1 && (
                  <div className="process-arrow">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurProcess;
