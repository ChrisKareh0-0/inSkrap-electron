import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CSS/searchPage.css";
import Modal from "../Components/modal";

function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [isModalVisible, setModalVisible] = useState(false);
  const [hasPhoneNumbers, setHasPhoneNumbers] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setHasPhoneNumbers(false);

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
        <button className="button" onClick={() => navigate("/")}>
          <div className="button-box">
            <span className="button-elem">
              <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
              </svg>
            </span>
            <span className="button-elem">
              <svg viewBox="0 0 46 40">
                <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
              </svg>
            </span>
          </div>
        </button>

        <h1 className="main-title">inSkrap</h1>
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-container">
            <label>Keyword:</label>
            <input
              className="themed-input"
              type="text"
              value={keyword}
              placeholder="Enter keyword"
              onChange={(e) => setKeyword(e.target.value)}
              required
            />
          </div>
          <div className="search-container">
            <label>Location:</label>
            <input
              className="themed-input"
              type="text"
              value={location}
              placeholder="Enter location"
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <button className="themed-button" type="submit">
            Search
          </button>
        </form>

        {loading && (
          <div className="loader">
            <span></span>
          </div>
        )}

        {!loading && (
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
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

export default SearchPage;
