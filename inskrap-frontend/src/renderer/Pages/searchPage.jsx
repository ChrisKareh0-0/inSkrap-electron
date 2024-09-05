import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CSS/searchPage.css';
// import io from 'socket.io-client';

function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); 

    try {
      // Fetch data from the Flask backend
      const response = await axios.post('http://127.0.0.1:5000/scrape', {
        keyword,
        location,
      });

      // Set the results once the response is returned
      setResults(response.data);
    } catch (error) {
      console.error('There was an error with the request:', error);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  return (
    <div className="search-page">
      <button className="button" onClick={() => navigate('/')}>
        <div className="button-box">
          <span className="button-elem">
          <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"
              ></path>
            </svg>
          </span>
          <span className="button-elem">
          <svg viewBox="0 0 46 40">
              <path
                d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"
              ></path>
            </svg>
          </span>
        </div>
      </button>

      <h1 style={{ color: '#fff', marginLeft: '60px' }}>inSkrap</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={{ color: '#fff' }}>Keyword:</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            required
          />
        </div>
        <div>
          <label style={{ color: '#fff' }}>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <button type="submit">Search</button>
      </form>

      {loading && (
        <div className="loader">
          <span></span>
        </div>
      )}

      {!loading && (
        <div>
          <h2 style={{ color: '#fff' }}>Results</h2>
          <p style={{ color: '#fff' }}>Total Results: {results.length}</p>
          {results.length > 0 && (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Link</th>
                    <th>Website</th>
                    <th>Phone</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index}>
                      <td>{result.title}</td>
                      <td>
                        <a href={result.link} target="_blank" rel="noopener noreferrer">
                          <button>Map Link</button>
                        </a>
                      </td>
                      <td>
                        <a href={result.website} target="_blank" rel="noopener noreferrer">
                          <button>Website</button>
                        </a>
                      </td>
                      <td>{result.phone}</td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
