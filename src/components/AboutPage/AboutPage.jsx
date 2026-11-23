
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faSeedling,
  faLightbulb,
  faPalette,
  faHandsHolding,
  faStar,
  faGift,
  faHandSparkles,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import "./AboutPage.css";

const AboutPage = () => {
  return (
    <main className="about-page">
      {/* =========================================
          OUR STORY
      ========================================== */}

      <section className="about-story">
        <div className="about-story-container">
          <div className="about-story-image">
            <div className="story-image-frame">
              <img
                src="/images/about_image.png"
                alt="Little Wonders handmade creations"
              />

              <div className="story-image-badge">
                <FontAwesomeIcon icon={faHeart} />
                <span>Made with Love</span>
              </div>
            </div>
          </div>

          <div className="about-story-content">
            <span className="section-label">WELCOME TO OUR WORLD</span>

            <h2>
              A Warm Welcome to
              <span> Little Wonders!</span>
            </h2>

            <div className="story-line"></div>

            <p>
              Hi everyone! I'm <strong>Hasini</strong> (Swetha's sister), and
              together with <strong>Pravallika</strong> (Niharika's sister), we
              welcome you to our cozy corner! We all live in the same apartment
              building.
            </p>

            <p>
              Although we moved here in 2021, our story really began on{" "}
              <strong>February 28th</strong>, the day we met Pravallika and
              Niharika.
            </p>

            <p>
              What started as neighbors hanging out turned into a sisterly bond
              that grows stronger every single day.
            </p>

            <div className="story-highlight">
              <FontAwesomeIcon icon={faHeart} />
              <p>
                Sometimes the most beautiful friendships begin with something
                as simple as being neighbors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          JOURNEY
      ========================================== */}

      <section className="about-journey">
        <div className="journey-container">
          <div className="journey-heading">
            <span className="section-label">HOW IT ALL STARTED</span>

            <h2>
              From Neighbors
              <span> to Little Wonders</span>
            </h2>

            <p>
              A few special moments slowly turned into something we could call
              our own.
            </p>
          </div>

          <div className="journey-timeline">
            <div className="timeline-line"></div>

            <div className="timeline-item">
              <div className="timeline-dot">
                <FontAwesomeIcon icon={faSeedling} />
              </div>

              <div className="timeline-card">
                <span className="timeline-year">2021</span>
                <h3>A New Beginning</h3>
                <p>
                  We moved into the same apartment building and slowly became
                  part of the same little community.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot">
                <FontAwesomeIcon icon={faHeart} />
              </div>

              <div className="timeline-card">
                <span className="timeline-year">28TH FEBRUARY</span>
                <h3>The Day We Met</h3>
                <p>
                  February 28th became a special day for us — the beginning of a
                  friendship that would grow into a sisterly bond.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot">
                <FontAwesomeIcon icon={faLightbulb} />
              </div>

              <div className="timeline-card">
                <span className="timeline-year">4TH APRIL 2026</span>
                <h3>Little Wonders Was Born</h3>
                <p>
                  After countless afternoons crafting together, a spark of
                  inspiration turned our hobby into{" "}
                  <strong>Little Wonders_04</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          WHY WE STARTED
      ========================================== */}

      <section className="about-purpose">
        <div className="purpose-container">
          <div className="purpose-heading">
            <span className="section-label">MORE THAN A BUSINESS</span>

            <h2>
              Why Little Wonders
              <span> Means So Much to Us</span>
            </h2>

            <p>
              What started as a way to earn our own spending money quickly
              became something much bigger.
            </p>
          </div>

          <div className="purpose-grid">
            <div className="purpose-card">
              <div className="purpose-icon">
                <FontAwesomeIcon icon={faHandsHolding} />
              </div>

              <span className="purpose-number">01</span>
              <h3>Focus & Patience</h3>

              <p>
                Crocheting keeps us grounded. Every little stitch teaches us
                patience and focus.
              </p>
            </div>

            <div className="purpose-card">
              <div className="purpose-icon">
                <FontAwesomeIcon icon={faSeedling} />
              </div>

              <span className="purpose-number">02</span>
              <h3>Growth & Learning</h3>

              <p>
                We're learning how to manage a real business while growing
                together with every experience.
              </p>
            </div>

            <div className="purpose-card">
              <div className="purpose-icon">
                <FontAwesomeIcon icon={faPalette} />
              </div>

              <span className="purpose-number">03</span>
              <h3>Creativity & Peace</h3>

              <p>
                Creating handmade pieces is our favorite way to relax, express
                ourselves, and de-stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          OUR MISSION
      ========================================== */}

      <section className="about-mission">
        <div className="mission-container">
          <div className="mission-icon">
            <FontAwesomeIcon icon={faHeart} />
          </div>

          <span className="section-label">A LITTLE DREAM WITH A BIG HEART</span>

          <h2>
            Our Mission Is to Make
            <span> Everyday Moments Special</span>
          </h2>

          <p className="mission-description">
            At LittleWonders, our mission is to bring a little more joy,
            creativity, and warmth into everyday life through handmade
            creations. We want every piece to feel personal, thoughtful, and
            made with love — because the smallest details can create the
            loveliest memories.
          </p>

          <div className="mission-values">
            <div className="mission-value">
              <FontAwesomeIcon icon={faHandSparkles} />
              <span>Handmade with care</span>
            </div>

            <div className="mission-value">
              <FontAwesomeIcon icon={faPalette} />
              <span>Created with creativity</span>
            </div>

            <div className="mission-value">
              <FontAwesomeIcon icon={faHeart} />
              <span>Shared with love</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          WHY SHOP WITH US
      ========================================== */}

      <section className="about-why-shop">
        <div className="why-shop-container">
          <div className="why-shop-heading">
            <span className="section-label">THE LITTLEWONDERS EXPERIENCE</span>

            <h2>
              Why Shop
              <span> With Us?</span>
            </h2>

            <p>
              Every order means a lot to us. Here's what makes shopping with
              LittleWonders special.
            </p>
          </div>

          <div className="why-shop-grid">
            <article className="why-shop-card">
              <div className="why-shop-icon">
                <FontAwesomeIcon icon={faHandSparkles} />
              </div>

              <span className="why-shop-number">01</span>

              <h3>Made by Hand</h3>

              <p>
                Each creation is carefully handmade, giving every little piece
                its own charm and personality.
              </p>
            </article>

            <article className="why-shop-card">
              <div className="why-shop-icon">
                <FontAwesomeIcon icon={faPalette} />
              </div>

              <span className="why-shop-number">02</span>

              <h3>Made with Creativity</h3>

              <p>
                We love exploring colors, designs, and little details to bring
                our creative ideas to life.
              </p>
            </article>

            <article className="why-shop-card">
              <div className="why-shop-icon">
                <FontAwesomeIcon icon={faHeart} />
              </div>

              <span className="why-shop-number">03</span>

              <h3>Personal Touch</h3>

              <p>
                We put thought and care into our creations and appreciate every
                person who supports our little dream.
              </p>
            </article>

            <article className="why-shop-card">
              <div className="why-shop-icon">
                <FontAwesomeIcon icon={faGift} />
              </div>

              <span className="why-shop-number">04</span>

              <h3>Lovely Little Gifts</h3>

              <p>
                Find thoughtful handmade pieces for yourself or someone who
                deserves a little happiness.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* =========================================
          HANDMADE MOMENT
      ========================================== */}

      <section className="about-handmade">
        <div className="handmade-overlay"></div>

        <div className="handmade-content">
          <div className="handmade-symbol">✦</div>

          <h2>
            Every little creation
            <br />
            carries a little piece of us.
          </h2>

          <p>Made slowly. Made patiently. Made with love.</p>
        </div>
      </section>

      {/* =========================================
          JOIN OUR COMMUNITY
      ========================================== */}

      <section className="about-community">
        <div className="community-decoration community-decoration-one">
          ✿
        </div>

        <div className="community-decoration community-decoration-two">
          ♡
        </div>

        <div className="community-content">
          <div className="community-icon">
            <FontAwesomeIcon icon={faHeart} />
          </div>

          <span className="section-label">LET'S STAY CONNECTED</span>

          <h2>
            Join Our
            <span> Little Community</span>
          </h2>

          <p>
            We invite you to follow us on social media and stay updated with
            the latest products, promotions, and updates. Feel free to reach
            out with any questions — we're always here to help!
          </p>

          <div className="community-actions">
            <a
              href="https://www.instagram.com/littlewonders_04/"
              target="_blank"
              rel="noopener noreferrer"
              className="community-instagram-button"
            >
              Follow Us on Instagram
              <FontAwesomeIcon icon={faArrowRight} />
            </a>

            <a href="/contact" className="community-contact-button">
              Get in Touch
            </a>
          </div>

          <div className="community-note">
            <FontAwesomeIcon icon={faStar} />
            <span>Thank you for being part of our little journey!</span>
            <FontAwesomeIcon icon={faStar} />
          </div>
        </div>
      </section>

      {/* =========================================
          THANK YOU
      ========================================== */}

      <section className="about-thank-you">
        <div className="thank-you-decoration left">♡</div>
        <div className="thank-you-decoration right">✿</div>

        <div className="thank-you-content">
          <span className="section-label">FROM OUR HEARTS</span>

          <h2>
            Thank You for Being
            <span> Part of Our Journey</span>
          </h2>

          <p>
            Having the support of our parents, siblings, and friends means the
            absolute world to us.
          </p>

          <p className="thank-you-message">
            Thank you for supporting our little dream and becoming a part of the
            Little Wonders family.
          </p>

          <div className="love-line">
            <span></span>
            <FontAwesomeIcon icon={faHeart} />
            <span></span>
          </div>

          <p className="with-love">With lots of love,</p>

          <h3>Hasini & Pravallika</h3>

          <div className="tiny-hearts">♡ &nbsp; ✿ &nbsp; ♡</div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
