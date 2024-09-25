import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./CSS/searchPage.css";
import Modal from "../Components/modal";

import SettingsIcon from "../assets/settings.svg";
import Settings from "../Components/settings";

function SearchPage({ isBlurred, toggleBlur }) {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInitiated, setSearchInitiated] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const [hasPhoneNumbers, setHasPhoneNumbers] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setHasPhoneNumbers(false);
    setSearchInitiated(true);

    try {
      // Fetch data from the Flask backend
      const response = await axios.post("http://127.0.0.1:5000/scrape", {
        keyword,
        location,
      });

      // Set the results once the response is returned
      setResults(response.data);
    } catch (error) {
      console.error("There was an error with the request:", error);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // Check for phone numbers after results are set
  useEffect(() => {
    const phoneNumbersExist = results.some((result) => result.phone);
    setHasPhoneNumbers(phoneNumbersExist);
  }, [results]);

  return (
    <>
      <div className="search-page">
        <h1 className="main-title" style={{ lineHeight: "1rem" }}>
          inSkrap
        </h1>
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-container">
            <label>Keyword:</label>
            <div className="element-with-tooltip">
              <input
                className="themed-input"
                type="text"
                value={keyword}
                placeholder="Enter keyword"
                onChange={(e) => setKeyword(e.target.value)}
                required
              />
              <span className="tooltip-text">
                Enter a keyword such as: <strong>Software</strong>
              </span>
            </div>
          </div>
          <div className="search-container">
            <label>Location:</label>
            <div className="element-with-tooltip">
              <input
                className="themed-input"
                type="text"
                value={location}
                placeholder="Enter location"
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <span className="tooltip-text">
                Enter a location such as: <strong>Beirut, Lebanon</strong>
              </span>
            </div>
          </div>
          <div className="search-button-container">
            <button
              className="themed-button search-button"
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? "gray" : "",
                cursor: !loading ? "pointer" : "not-allowed",
              }}
            >
              Search
            </button>
            <button
              className="themed-button settings-button"
              type="button"
              onClick={() => setSettingsVisible(true)}
            >
              <img src={SettingsIcon} alt="Settings icon" />
            </button>
          </div>
        </form>

        {loading && (
          <div className="loader">
            <span></span>
          </div>
        )}

        {!loading && searchInitiated && (
          <div>
            <h2 style={{ color: "#fff" }}>Results</h2>
            <p style={{ color: "#fff" }}>Total Results: {results.length}</p>
            {results.length > 0 && (
              <div>
                <table className="search-table">
                  <thead>
                    <tr>
                      <th className="title-th">Title</th>
                      <th>Link</th>
                      <th>Website</th>
                      <th className="phone-th">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index}>
                        <td>{result.title}</td>
                        <td>
                          <a
                            href={result.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <button>Map Link</button>
                          </a>
                        </td>
                        <td>
                          {result.website ? (
                            <a
                              href={result.website}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <button>Website</button>
                            </a>
                          ) : (
                            <span>No website detected</span>
                          )}
                        </td>
                        {result.phone ? (
                          <td>{result.phone}</td>
                        ) : (
                          <td>No phone detected</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Button */}
      {hasPhoneNumbers && (
        <button
          onClick={() => setModalVisible(true)}
          className="floating-button"
        >
          Create Broadcast
        </button>
      )}

      {/* Modal */}
      <Modal
        isModalVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        isBlurred={isBlurred}
      />

      <Settings
        isSettingsVisible={isSettingsVisible}
        onClose={() => setSettingsVisible(false)}
        isBlurred={isBlurred}
        toggleBlur={toggleBlur}
      />
    </>
  );
}

export default SearchPage;
