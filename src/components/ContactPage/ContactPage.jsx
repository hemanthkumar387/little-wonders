import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faMessage,
  faBoxOpen,
  faHeart,
  faArrowRight,
  faPlus,
  faMinus,
  faPaperPlane,
  faCircleCheck,
  faClock,
  faLeaf,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import "./ContactPage.css";

const faqs = [
  {
    question: "How can I place an order?",
    answer:
      "Explore our collection, choose your favourite products, add them to your cart, and follow the checkout process. If you need assistance placing an order, send us a message.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery time depends on your location and whether your product is ready to ship or made to order. Please check your order confirmation for the expected delivery timeline.",
  },
  {
    question: "Are your products handmade?",
    answer:
      "Yes! LittleWonders celebrates thoughtful handmade creations. Every piece is made with care, and slight variations can make each item feel wonderfully unique.",
  },
  {
    question: "Can I request a customised product?",
    answer:
      "We love creative ideas! Tell us the product you have in mind, your preferred colours, and any special requirements. We will let you know if we can create something for you.",
  },
  {
    question: "What if my order arrives damaged?",
    answer:
      "Contact us as soon as possible with your order details and clear photos of the item and packaging. We can review the issue and help you understand the next steps.",
  },
  {
    question: "Can I cancel or return an order?",
    answer:
      "Cancellation and return eligibility depends on your order status and the applicable store policy. Contact us with your order number so we can review your request.",
  },
  {
    question: "How can I check my order status?",
    answer:
      "Select Order Support in the contact form and include your order number in the message. Our team can use these details to help with your enquiry.",
  },
  {
    question: "What if I have another question?",
    answer:
      "We are happy to hear from you! Choose the most relevant topic in our contact form, describe your question, and share any details that might help us assist you.",
  },
];

const initialForm = {
  name: "",
  email: "",
  category: "",
  subject: "",
  message: "",
};

const ContactPage = () => {
  const [formData, setFormData] = useState(initialForm);
  const [openFaq, setOpenFaq] = useState(0);
  const [formStatus, setFormStatus] = useState({
    type: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormStatus({ type: "", message: "" });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { name, email, category, subject, message } = formData;

    if (
      !name.trim() ||
      !email.trim() ||
      !category ||
      !subject.trim() ||
      !message.trim()
    ) {
      setFormStatus({
        type: "error",
        message: "Please complete all required fields.",
      });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setFormStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    // TODO: Send formData to your backend or email service.
    // Do not show a delivery confirmation until the server succeeds.
    setFormStatus({
      type: "info",
      message:
        "Your details are valid. Connect the form to your backend or email service to submit your message.",
    });
  };

  const handleReset = () => {
    setFormData(initialForm);
    setFormStatus({ type: "", message: "" });
  };

  return (
    <main className="contact-page">
      {/* Hero section */}
      <section className="contact-hero">
        <div className="contact-hero-orbit contact-orbit-one" />
        <div className="contact-hero-orbit contact-orbit-two" />

        <div className="contact-hero-content">
          <span className="contact-eyebrow">
            <FontAwesomeIcon icon={faLeaf} />A LITTLE NOTE GOES A LONG WAY
          </span>

          <h1>
            We'd love to <span>hear from you.</span>
          </h1>

          <p>
            Need a hand, have a question, or dreaming up something special?
            Whatever it is, there's a little space for it here.
          </p>

          <a href="#contact-form" className="contact-primary-button">
            Let's talk
            <FontAwesomeIcon icon={faArrowRight} />
          </a>

          <div className="contact-hero-signature">
            <span />
            Made with care, always
            <FontAwesomeIcon icon={faHeart} />
            <span />
          </div>
        </div>

        <div className="contact-hero-stamp" aria-hidden="true">
          <FontAwesomeIcon icon={faHeart} />
          <span>made with</span>
          <strong>love</strong>
        </div>
      </section>

      {/* Contact section */}
      <section className="contact-main-section" id="contact-form">
        <div className="contact-section-heading">
          <span className="contact-eyebrow">HERE TO MAKE THINGS EASIER</span>
          <h2>
            How can we <span>help?</span>
          </h2>
          <p>
            Tell us a little about what you need. We'll help you find the right
            next step.
          </p>
        </div>

        <div className="contact-layout">
          {/* Contact information */}
          <aside className="contact-info-panel">
            <div className="contact-info-heading">
              <div className="contact-info-icon">
                <FontAwesomeIcon icon={faHeadset} />
              </div>

              <span className="contact-info-overline">
                THE LITTLEWONDERS TEAM
              </span>
              <h3>
                A friendly ear, <span>always.</span>
              </h3>

              <p>
                From choosing a gift to sorting out an order, we're here to make
                your experience a little easier.
              </p>
            </div>

            <div className="contact-info-divider" />

            <div className="contact-info-item">
              <div className="contact-info-item-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <div>
                <h4>General enquiries</h4>
                <p>Questions, ideas, and everything in between.</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-item-icon">
                <FontAwesomeIcon icon={faBoxOpen} />
              </div>
              <div>
                <h4>Order assistance</h4>
                <p>Include your order number for quicker reference.</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-item-icon">
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div>
                <h4>We're listening</h4>
                <p>
                  We'll respond according to our support team's availability.
                </p>
              </div>
            </div>

            <div className="contact-handmade-note">
              <FontAwesomeIcon icon={faHeart} />
              <p>
                Every message matters. Thank you for supporting our little
                handmade world.
              </p>
            </div>

            <span className="contact-panel-flower" aria-hidden="true">
              ✿
            </span>
          </aside>

          {/* Form */}
          <div className="contact-form-panel">
            <div className="contact-form-heading">
              <span className="contact-form-kicker">WRITE TO US</span>
              <h3>
                Drop us a <span>little note.</span>
              </h3>
              <p>Fields marked with * are required.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="contact-name">Your name *</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-email">Email address *</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="contact-category">How can we help? *</label>
                <select
                  id="contact-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select a topic
                  </option>
                  <option value="Order Support">Order support</option>
                  <option value="Product Enquiry">Product enquiry</option>
                  <option value="Customisation">Customisation request</option>
                  <option value="Delivery Issue">Delivery issue</option>
                  <option value="Damaged Product">Damaged product</option>
                  <option value="Payment Issue">Payment issue</option>
                  <option value="Cancellation or Return">
                    Cancellation or return
                  </option>
                  <option value="Website Issue">Website issue</option>
                  <option value="Other">Something else</option>
                </select>
              </div>

              <div className="contact-field">
                <label htmlFor="contact-subject">Subject *</label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  placeholder="What is your message about?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field">
                <div className="contact-label-row">
                  <label htmlFor="contact-message">Your message *</label>
                  <span>We're all ears ♡</span>
                </div>

                <textarea
                  id="contact-message"
                  name="message"
                  rows="5"
                  maxLength="1500"
                  placeholder="Tell us what happened or how we can help..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />

                <span className="contact-character-count">
                  {formData.message.length} / 1500
                </span>
              </div>

              {formStatus.message && (
                <div
                  className={`contact-form-status ${formStatus.type}`}
                  role="status"
                  aria-live="polite"
                >
                  {formStatus.type === "info" && (
                    <FontAwesomeIcon icon={faMessage} />
                  )}
                  {formStatus.type === "error" && (
                    <FontAwesomeIcon icon={faCircleCheck} />
                  )}
                  <span>{formStatus.message}</span>
                </div>
              )}

              <div className="contact-form-actions">
                <button type="submit" className="contact-submit-button">
                  Send your message
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>

                <button
                  type="button"
                  className="contact-reset-button"
                  onClick={handleReset}
                >
                  Clear fields
                </button>
              </div>

              <p className="contact-privacy-note">
                <FontAwesomeIcon icon={faHeart} />
                Your information should only be used to handle your enquiry.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="contact-faq-section" id="contact-faq">
        <div className="contact-faq-heading">
          <span className="contact-eyebrow">
            THE LITTLE THINGS YOU MAY WONDER
          </span>
          <h2>
            Good questions. <span>Helpful answers.</span>
          </h2>
          <p>
            A little clarity goes a long way. Open a question to find out more.
          </p>
        </div>

        <div className="contact-faq-layout">
          <div className="contact-faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              const answerId = `contact-faq-answer-${index}`;

              return (
                <article
                  className={`contact-faq-item ${isOpen ? "faq-open" : ""}`}
                  key={faq.question}
                >
                  <button
                    type="button"
                    className="contact-faq-question"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  >
                    <span className="contact-faq-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="contact-faq-question-text">
                      {faq.question}
                    </span>

                    <span className="contact-faq-toggle" aria-hidden="true">
                      <FontAwesomeIcon icon={isOpen ? faMinus : faPlus} />
                    </span>
                  </button>

                  <div
                    id={answerId}
                    className="contact-faq-answer"
                    hidden={!isOpen}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="contact-faq-help-card">
            <div className="contact-faq-heart">
              <FontAwesomeIcon icon={faHeart} />
            </div>

            <span className="contact-faq-small-label">WE'RE HERE TO HELP</span>

            <h3>
              Your question deserves a <span>little care.</span>
            </h3>

            <p>
              Couldn't find what you were looking for? Tell us what's on your
              mind and we'll help you work through it.
            </p>

            <a href="#contact-form" className="contact-faq-button">
              Ask us directly
              <FontAwesomeIcon icon={faArrowRight} />
            </a>

            <span className="contact-faq-flower" aria-hidden="true">
              ✿
            </span>
          </aside>
        </div>
      </section>

      {/* Closing banner */}
      <section className="contact-bottom-banner">
        <span className="contact-bottom-heart">♡</span>
        <h2>Thoughtfully made. Happily connected.</h2>
        <p>Thank you for being a part of our LittleWonders journey.</p>
      </section>
    </main>
  );
};

export default ContactPage;
