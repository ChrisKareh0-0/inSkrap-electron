// HistoryPage.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/historyPage.css";
import { useNavigate } from "react-router-dom";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch history from the backend
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://127.0.0.1:5000/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="loader">
        <span></span>
      </div>
    );
  }

  return (
    <div className="history-page">
      <button className="nav-button" onClick={() => navigate("/search")}>
        Back to Search
      </button>
      <h1>Your Search History</h1>
      {history.length === 0 ? (
        <p>No search history found.</p>
      ) : (
        history.map((entry, index) => (
          <div key={index} className="history-entry">
            <h2>
              {entry.keyword} in {entry.location}
            </h2>
            <p>Searched on: {new Date(entry.timestamp).toLocaleString()}</p>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Link</th>
                  <th>Website</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {entry.results.map((result, idx) => (
                  <tr key={idx}>
                    <td>{result.title}</td>
                    <td>
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Map Link
                      </a>
                    </td>
                    <td>
                      {result.website ? (
                        <a
                          href={result.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Website
                        </a>
                      ) : (
                        <span>No website</span>
                      )}
                    </td>
                    <td>{result.phone || "No phone"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}

export default HistoryPage;
