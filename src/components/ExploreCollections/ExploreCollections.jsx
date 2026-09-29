import "./ExploreCollections.css";

const collections = [
  {
    title: "Wool & Yarn",
    description: "Cozy creations for everyday moments.",
    image: "/images/wool-yarn.png",
    color: "peach",
  },
  {
    title: "Wrist Bands",
    description: "Handcrafted bands for every style.",
    image: "/images/wrist-bands.png",
    color: "sage",
  },
  {
    title: "Keychains",
    description: "Little handmade charms to carry.",
    image: "/images/keychain.png",
    color: "sand",
  },
  {
    title: "Bouquets",
    description: "Beautiful flowers, made to last.",
    image: "/images/Bouquet.png",
    color: "terracotta",
  },
];

const ExploreCollections = () => {
  return (
    <section className="collections-section">

      {/* Decorative elements */}
      <div className="collections-decoration collections-decoration-left">
        <span className="branch">⌁</span>
        <span className="small-heart">♡</span>
      </div>

      <div className="collections-decoration collections-decoration-right">
        <span className="small-heart">♡</span>
        <span className="branch">⌁</span>
      </div>

      {/* Heading */}
      <div className="collections-heading">

        <p className="collections-eyebrow">
          CATEGORIES
        </p>

        <h2>
          Explore Our Collections
        </h2>

        <p className="collections-subtitle">
          From cozy wool creations to beautiful handcrafted pieces.
        </p>

      </div>

      {/* Collection Cards */}
      <div className="collections-grid">

        {collections.map((collection) => (
          <article
            className="collection-card"
            key={collection.title}
          >

            {/* Image */}
            <div className="collection-image">
              <img
                src={collection.image}
                alt={collection.title}
              />
            </div>

            {/* Card information */}
            <div
              className={`collection-info ${collection.color}`}
            >

              <div className="collection-text">
                <h3>{collection.title}</h3>

                <p>
                  {collection.description}
                </p>
              </div>

              <a
                href="/products"
                className="collection-arrow"
                aria-label={`Explore ${collection.title}`}
              >
                →
              </a>

            </div>

          </article>
        ))}

      </div>

    </section>
  );
};

export default ExploreCollections;