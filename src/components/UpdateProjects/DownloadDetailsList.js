// DownloadDetailsList.jsx

import React, { useState, useEffect } from "react";
import "./DownloadDetailsList.css";

const DownloadDetailsList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const resp = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/download-details`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.REACT_APP_API_KEY,
            },
          }
        );
        if (!resp.ok) throw new Error(`Error ${resp.status}`);
        const { downloadDetails } = await resp.json();
        setRecords(downloadDetails);
      } catch (err) {
        console.error("Fetch download details failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  const toggleRow = (id) =>
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );

  if (loading) return <p>Loading download records…</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="download-details-container">
      <h2>Download Details</h2>

      {records.length === 0 ? (
        <p>No download records found.</p>
      ) : (
        <table className="download-table">
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>Invoice No.</th>
              <th>Type</th>
              <th>To</th>
              <th>Date</th>
              <th>Total (Incl. Tax)</th>
              <th>Downloaded At</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            {records.map((r, idx) => {
              // Ensure numeric values
              const totalInc = Number(r.totalIncludingTax || 0);
              return (
                <React.Fragment key={r.id}>
                  <tr>
                    <td>{idx + 1}</td>
                    <td>{r.invoiceNumber}</td>
                    <td>{r.invoiceType}</td>
                    <td>{r.toName}</td>
                    <td>{new Date(r.invoiceDate).toLocaleDateString()}</td>
                    <td>{totalInc.toFixed(2)}</td>
                    <td>{new Date(r.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="toggle-btn"
                        onClick={() => toggleRow(r.id)}
                      >
                        {expandedRows.includes(r.id) ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>

                  {expandedRows.includes(r.id) && (
                    <tr className="expanded-content">
                      <td colSpan={8}>
                        <strong>Items:</strong>
                        <table className="line-items-table">
                          <thead>
                            <tr>
                              <th>Sl. No.</th>
                              <th>Description</th>
                              <th>Qty</th>
                              <th>Rate</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {r.lineItems.map((item, i) => (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{item.description}</td>
                                <td>{item.quantity}</td>
                                <td>{item.rate}</td>
                                <td>{item.total}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div className="order-details">
                          <strong>Order Details:</strong>
                          <ul className="other-info-list">
                            <li>
                              <strong>Address:</strong> {r.address}
                            </li>
                            <li>
                              <strong>Contact:</strong> {r.contact}
                            </li>
                            <li>
                              <strong>GSTIN:</strong> {r.companyGst}
                            </li>
                            <li>
                              <strong>State:</strong> {r.state}
                            </li>
                            <li>
                              <strong>Reference:</strong> {r.referenceId} on{" "}
                              {new Date(r.referenceDate).toLocaleDateString()}
                            </li>
                            <li>
                              <strong>Place of Supply:</strong>{" "}
                              {r.placeOfSupply}
                            </li>
                            <li>
                              <strong>With Seal:</strong>{" "}
                              {r.withSeal ? "Yes" : "No"}
                            </li>
                            <li>
                              <strong>Sub Total:</strong>{" "}
                              {Number(r.subTotal || 0).toFixed(2)}
                            </li>
                            <li>
                              <strong>Advance:</strong>{" "}
                              {Number(r.advance || 0).toFixed(2)}
                            </li>
                            <li>
                              <strong>GST %:</strong> {r.gst}
                            </li>
                            <li>
                              <strong>GST Amount:</strong>{" "}
                              {Number(r.gstAmount || 0).toFixed(2)}
                            </li>
                            <li>
                              <strong>Total Excl. Tax:</strong>{" "}
                              {Number(r.totalExcludingTax || 0).toFixed(2)}
                            </li>
                            <li>
                              <strong>Terms:</strong> {r.terms}
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DownloadDetailsList;
