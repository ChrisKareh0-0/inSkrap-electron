import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CSS/searchPage.css";
import Modal from "../Components/modal";
import ExportModal from "../Components/exportmodal";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [isModalVisible, setModalVisible] = useState(false);
  const [isExportModalVisible, setExportModalVisible] = useState(false);
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

  // Function to export data to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Search Results", 20, 10);

    const tableColumn = ["Title", "Link", "Website", "Phone"];
    const tableRows = [];

    // Add rows for the table excluding the "Map Link" text in the Link column
    results.forEach((result) => {
      const rowData = [
        result.title,
        "", // Leave the Link column empty for now, we'll add the link later
        result.website || "No website",
        result.phone || "No phone",
      ];
      tableRows.push(rowData);
    });

    // Generate the table without the placeholder link
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      columnStyles: {
        // Custom width for Link and Phone columns
        0: { cellWidth: 50 },
        1: { cellWidth: 40 }, // Link column
        3: { cellWidth: 40 }, // Phone column
      },
      didDrawCell: (data) => {
        // Check if we are in the "Link" column (index 1)
        if (data.column.index === 1) {
          const result = results[data.row.index];
          if (result && result.link) {
            // Add clickable "Map Link" button
            doc.textWithLink("Map Link", data.cell.x + 2, data.cell.y + 6, {
              url: result.link,
            });
          }
        }
      },
    });

    doc.save("search_results.pdf");
  };

  // Function to export data to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      results.map((result) => ({
        Title: result.title,
        Link: result.link,
        Website: result.website || "No website",
        Phone: result.phone || "No phone",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Search Results");

    XLSX.writeFile(workbook, "search_results.xlsx");
  };

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
              className="keyword-input"
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
              className="location-input"
              type="text"
              value={location}
              placeholder="Enter location"
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <button className="search-button" type="submit">
            Search
          </button>
        </form>

        {loading && (
          <div className="loader">
            <span></span>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div>
            <h2 style={{ color: "#fff" }}>Results</h2>
            <p style={{ color: "#fff" }}>Total Results: {results.length}</p>
            <div>
              {/* Export Buttons */}
              <div className="export-buttons">
                <button
                  className="Btn"
                  onClick={() => setExportModalVisible(true)}
                >
                  <svg
                    className="svgIcon"
                    viewBox="0 0 384 512"
                    height="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
                  </svg>
                  <span className="icon2"></span>
                  <span className="tooltip">Export</span>
                </button>
              </div>
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

      {/* Export Modal */}
      <ExportModal
        isVisible={isExportModalVisible}
        exportToPDF={exportToPDF}
        exportToExcel={exportToExcel}
        onClose={() => setExportModalVisible(false)}
      />
    </>
  );
}

export default SearchPage;
