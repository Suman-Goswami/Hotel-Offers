import React, { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
import "./App.css";

const App = () => {
  const [creditCards, setCreditCards] = useState([]);
  const [filteredCreditCards, setFilteredCreditCards] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState("");
  const [easeOffers, setEaseOffers] = useState([]);
  const [yatraOffers, setYatraOffers] = useState([]);
  const [clearOffers, setClearOffers] = useState([]);
  const [ixigoOffers, setIxigoOffers] = useState([]);
  const [noOffers, setNoOffers] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCSVData = async () => {
      try {
        const files = [
          { name: "EASE HOTEL.csv", setter: setEaseOffers },
          { name: "YATRA HOTEL.csv", setter: setYatraOffers },
          { name: "CLEAR HOTEL.csv", setter: setClearOffers },
          { name: "IXIGO HOTEL.csv", setter: setIxigoOffers },
        ];

        let allCreditCards = new Set();

        for (let file of files) {
          const response = await axios.get(`${file.name}`);

          const parsedData = Papa.parse(response.data, { header: true });

          parsedData.data.forEach((row) => {
            if (row["Credit Card"]) {
              allCreditCards.add(row["Credit Card"].trim());
            }
          });

          file.setter(parsedData.data);
        }

        setCreditCards(Array.from(allCreditCards).sort());
      } catch (error) {
        console.error("Error loading CSV data:", error);
      }
    };

    fetchCSVData();
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);

    if (value) {
      const filtered = creditCards.filter((card) =>
        card.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredCreditCards(filtered);

      if (filtered.length === 0) {
        setNoOffers(true);
      } else {
        setNoOffers(false);
      }
    } else {
      setFilteredCreditCards([]);
      setNoOffers(false);
      setSelectedCard("");
    }
  };

  const handleCardSelection = (card) => {
    setSelectedCard(card);
    setQuery(card);
    setFilteredCreditCards([]);
    setNoOffers(false);
  };

  const getOffersForSelectedCard = (offers) => {
    return offers.filter(
      (offer) => offer["Credit Card"] && offer["Credit Card"].trim() === selectedCard
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const selectedEaseOffers = getOffersForSelectedCard(easeOffers);
  const selectedYatraOffers = getOffersForSelectedCard(yatraOffers);
  const selectedClearOffers = getOffersForSelectedCard(clearOffers);
  const selectedIxigoOffers = getOffersForSelectedCard(ixigoOffers);

  return (
    <div className="App" style={{ fontFamily: "'Libre Baskerville', serif" }}>
      {/* Navbar Component */}
      <nav style={styles.navbar}>
  <div style={styles.logoContainer}>
    <a href="https://www.myrupaya.in/">
      <img
        src="https://static.wixstatic.com/media/f836e8_26da4bf726c3475eabd6578d7546c3b2~mv2.jpg/v1/crop/x_124,y_0,w_3152,h_1458/fill/w_909,h_420,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/dark_logo_white_background.jpg"
        alt="MyRupaya Logo"
        style={styles.logo}
      />
    </a>
    {/* Move the links here */}
    <div
      style={{
        ...styles.linksContainer,
        ...(isMobileMenuOpen ? styles.mobileMenuOpen : {}),
      }}
    >
      <a href="https://www.myrupaya.in/" style={styles.link}>
        Home
      </a>
    </div>
  </div>
</nav>

      <h1>Hotel Offers</h1>
      <div className="dropdown-container">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Type a Credit Card..."
          className="dropdown-input"
        />
        {filteredCreditCards.length > 0 && (
          <ul className="dropdown-list">
            {filteredCreditCards.map((card, index) => (
              <li key={index} onClick={() => handleCardSelection(card)} className="dropdown-item">
                {card}
              </li>
            ))}
          </ul>
        )}
      </div>

      {noOffers && (
        <div style={{ color: "red", marginTop: "10px" }}>
          No offers found for this credit card.
        </div>
      )}

      {selectedCard && !noOffers && (
        <div className="offers-section">
          {selectedEaseOffers.length > 0 && (
            <div className="offer-group">
              <h2>EaseMyTrip Offers</h2>
              <div className="offer-grid">
                {selectedEaseOffers.map((offer, index) => (
                  <div key={index} className="offer-card">
                    <img src={offer.Image} alt={offer.Title} />
                    <div className="offer-info">
                      <h3>{offer.Title}</h3>
                      <p>{offer.Offer}</p>
                      <button onClick={() => window.open(offer.Link, "_blank")}>View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedYatraOffers.length > 0 && (
            <div className="offer-group">
              <h2>Yatra Offers</h2>
              <div className="offer-grid">
                {selectedYatraOffers.map((offer, index) => (
                  <div key={index} className="offer-card">
                    <img src={offer.Image} alt={offer.Title} />
                    <div className="offer-info">
                      <h3>{offer.Title}</h3>
                      <p>{offer.Offer}</p>
                      <button onClick={() => window.open(offer.Link, "_blank")}>View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedClearOffers.length > 0 && (
            <div className="offer-group">
              <h2>ClearTrip Offers</h2>
              <div className="offer-grid">
                {selectedClearOffers.map((offer, index) => (
                  <div key={index} className="offer-card">
                    <img src={offer.Image} alt={offer.Title} />
                    <div className="offer-info">
                      <h3>{offer.Title}</h3>
                      <p>{offer.Offer}</p>
                      <button onClick={() => window.open(offer.Link, "_blank")}>View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedIxigoOffers.length > 0 && (
            <div className="offer-group">
              <h2>Ixigo Offers</h2>
              <div className="offer-grid">
                {selectedIxigoOffers.map((offer, index) => (
                  <div key={index} className="offer-card">
                    <img src={offer.Image} alt={offer.Title} />
                    <div className="offer-info">
                      <h3>{offer.Title}</h3>
                      <p>{offer.Offer}</p>
                      <button onClick={() => window.open(offer.Link, "_blank")}>View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#CDD1C1",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: "100px",
    height: "100px",
    marginRight: "20px",
  },
  linksContainer: {
    display: "flex",
    gap: "35px",
    flexWrap: "wrap",
    marginLeft: "40px", // Adjust spacing from the logo
  },
  link: {
    textDecoration: "none",
    color: "black",
    fontSize: "18px", // Increased font size
    fontFamily: "Arial, sans-serif",
    transition: "color 0.3s ease", // Smooth transition effect
  },
  mobileMenuOpen: {
    display: "block",
  },
};


export default App;
