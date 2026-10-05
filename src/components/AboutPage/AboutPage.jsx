import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faSeedling,
  faLightbulb,
  faPalette,
  faHandsHolding,
//   faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

import "./AboutPage.css";

const AboutPage = () => {
  return (
    <main className="about-page">
      {/* =========================================
          HERO
      ========================================== */}

      {/* <section className="about-hero">
        <div className="about-hero-decoration about-leaf">✿</div>

        <div className="about-hero-decoration about-heart">♡</div>

        <div className="about-hero-content">
          <span className="about-eyebrow">OUR LITTLE STORY</span>

          <h1>
            A Warm Welcome to
            <span> Little Wonders</span>
          </h1>

          <p>
            A little corner filled with handmade creations, friendship,
            creativity, and lots of love.
          </p>

          <div className="about-scroll-indicator">
            <span>Discover our story</span>

            <FontAwesomeIcon icon={faArrowDown} />
          </div>
        </div>
      </section> */}

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
              Hi everyone! I'm <strong>Hasini</strong> (Swetha's sister), and together
              with <strong>Pravallika</strong> (Niharika's sister), we welcome you to our
              cozy corner! We all live in the same apartment building.
            </p>

            <p>
              Although we moved here in 2021, our story really began on{" "}
              <strong>February 28th</strong>, the day we met Pravallika and Niharika.
            </p>

            <p>
              What started as neighbors hanging out turned into a sisterly bond
              that grows stronger every single day.
            </p>

            <div className="story-highlight">
              <FontAwesomeIcon icon={faHeart} />

              <p>
                Sometimes the most beautiful friendships begin with something as
                simple as being neighbors.
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

            {/* 2021 */}

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

            {/* February */}

            <div className="timeline-item">
              <div className="timeline-dot">
                <FontAwesomeIcon icon={faHeart} />
              </div>

              <div className="timeline-card">
                <span className="timeline-year">28th FEBRUARY</span>

                <h3>The Day We Met</h3>

                <p>
                  February 28th became a special day for us — the beginning of a
                  friendship that would grow into a sisterly bond.
                </p>
              </div>
            </div>

            {/* April */}

            <div className="timeline-item">
              <div className="timeline-dot">
                <FontAwesomeIcon icon={faLightbulb} />
              </div>

              <div className="timeline-card">
                <span className="timeline-year">4th APRIL 2026</span>

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
            {/* Focus */}

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

            {/* Growth */}

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

            {/* Creativity */}

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
