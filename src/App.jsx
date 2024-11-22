import { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
import "./App.css";

const HotelOffers = () => {
  const [creditCards, setCreditCards] = useState([]);
  const [filteredCreditCards, setFilteredCreditCards] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState("");
  const [easeOffers, setEaseOffers] = useState([]);
  const [yatraOffers, setYatraOffers] = useState([]);
  const [clearOffers, setClearOffers] = useState([]);
  const [ixigoOffers, setIxigoOffers] = useState([]);

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
          const response = await axios.get(`/${file.name}`);
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
    } else {
      setFilteredCreditCards([]);
    }
  };

  const handleCardSelection = (card) => {
    setSelectedCard(card);
    setQuery(card);
    setFilteredCreditCards([]);
  };

  const getOffersForSelectedCard = (offers) => {
    return offers.filter(
      (offer) => offer["Credit Card"] && offer["Credit Card"].trim() === selectedCard
    );
  };

  const selectedEaseOffers = getOffersForSelectedCard(easeOffers);
  const selectedYatraOffers = getOffersForSelectedCard(yatraOffers);
  const selectedClearOffers = getOffersForSelectedCard(clearOffers);
  const selectedIxigoOffers = getOffersForSelectedCard(ixigoOffers);

  return (
    <div className="App">
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
              <li
                key={index}
                onClick={() => handleCardSelection(card)}
                className="dropdown-item"
              >
                {card}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedCard && (
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
                      <button onClick={() => window.open(offer.Link, "_blank")}>
                        View Details
                      </button>
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
                      <button onClick={() => window.open(offer.Link, "_blank")}>
                        View Details
                      </button>
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
                      <button onClick={() => window.open(offer.Link, "_blank")}>
                        View Details
                      </button>
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
                      <button onClick={() => window.open(offer.Link, "_blank")}>
                        View Details
                      </button>
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

export default HotelOffers;
