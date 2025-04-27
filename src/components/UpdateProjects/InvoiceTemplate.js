import React from "react";
import "./InvoiceTemplate.css";
import { numberToWords } from "./numberToWords";

const InvoiceTemplate = React.forwardRef((props, ref) => {
  const { invoiceType = "", invoiceNumber = "", downloadDetails = {} } = props;

  // Destructure all relevant details from downloadDetails
  const {
    to,
    address,
    contact,
    companyGst,
    state,
    invoiceDate,
    referenceDate,
    referenceId,
    placeOfSupply,
    withSeal,
    lineItems,
    subTotal,
    gst, // GST percentage, for example "18"
    gstAmount, // Total GST amount
    advance, // Advance paid
    totalExcludingTax,
    totalIncludingTax,
    terms,
    // Optionally additional fields if needed
  } = downloadDetails;

  // Ensure that lineItems is an array
  const parsedLineItems =
    Array.isArray(lineItems) && lineItems.length > 0 ? lineItems : [];

  // Calculate totals if not provided
  const totals = parsedLineItems.reduce(
    (acc, item) => {
      acc.quantity += Number(item.quantity || 0);
      acc.amount += Number(item.rate || 0);
      acc.total += Number(item.total || 0);
      return acc;
    },
    { quantity: 0, amount: 0, total: 0 }
  );

  // Calculate total GST from line items if not provided
  const totalGST = parsedLineItems.reduce(
    (acc, item) => acc + (Number(item.total || 0) * Number(gst || 0)) / 100,
    0
  );

  // Use provided totals if available; otherwise compute gross total
  const grossTotal = totalIncludingTax || totals.total + totalGST;

  // For invoices from Karnataka, compute half GST values
  const halfGSTRate =
    gst && Number(gst) > 0 ? (Number(gst) / 2).toFixed(2) : "0.00";
  const halfGSTAmount =
    gstAmount && Number(gstAmount) > 0
      ? (Number(gstAmount) / 2).toFixed(2)
      : (totalGST / 2).toFixed(2);

  // Fixed rows logic: if you want a fixed 8 rows, create empty rows if needed.
  const fixedRows = 8;
  const emptyRowCount = fixedRows - parsedLineItems.length;
  const emptyRows =
    emptyRowCount > 0 ? Array.from({ length: emptyRowCount }) : [];

  return (
    <div ref={ref} className="emp-inv-container">
      <header className="emp-inv-header">
        <div className="emp-inv-logo">
          <img src="/images/company-logo.png" alt="Company Logo" />
        </div>
        <div className="emp-inv-address">
          <h2 className="emp-inv-name">Sukalpa Tech Solutions Pvt Ltd</h2>
          <p>MSME/Udyam No: UDYAM-KR-04-0106460</p>
          <p>#71, Sarathi Nagar, Near Sahyadri Nagar, Belagavi -591108</p>
          <p>State: 29-Karnataka</p>
          <p>Phone no.: 9686465612</p>
          <p>Email: om@sukalpatechsolutions.com</p>
          <p>GSTIN: 29ABICS7525C1Z6</p>
          <p>PAN: ABICS7525C</p>
        </div>
      </header>

      <div className="emp-inv-title-section">
        <div className="emp-inv-title-block">
          {invoiceType ? invoiceType.toUpperCase() : "INVOICE"}
        </div>
        <div className="emp-bill-header">
          <h4>{invoiceType === "Quotation" ? "Estimate For" : "Bill To"}</h4>
          <h4>
            {invoiceType === "Quotation" ? "Estimate Details" : "Bill Details"}
          </h4>
        </div>
        <div className="emp-bill-data">
          {/* Recipient / Bill To Details */}
          <div className="emp-bill-to">
            <strong>
              <p className="emp-project-company">{to || "_________"}</p>
            </strong>
            <p className="emp-project-address">{address || "_________"}</p>
            <p>Contact No. : {contact || "_________"}</p>
            <p>GSTIN : {companyGst || "_________"}</p>
            <p>State: {state || "_________"}</p>
          </div>
          {/* Invoice Details */}
          <div className="emp-inv-details">
            <p>
              <span className="temp-label">
                {invoiceType === "Quotation" ? "Estimate No" : "Invoice No"}
              </span>
              : <strong>{invoiceNumber}</strong>
            </p>
            <p>
              <span className="temp-label">
                {invoiceType === "Quotation" ? "Date" : "Invoice Date"}
              </span>
              :{" "}
              <strong>
                {invoiceDate
                  ? new Date(invoiceDate)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")
                  : "_________"}
              </strong>
            </p>
            <p>
              <span className="temp-label">Place of supply</span>:{" "}
              <strong>{placeOfSupply || "_________"}</strong>
            </p>
            {invoiceType !== "Quotation" && (
              <>
                <p>
                  <span className="temp-label">PO Date</span>:{" "}
                  <strong>
                    {referenceDate
                      ? new Date(referenceDate)
                          .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          .replace(/ /g, "-")
                      : "_________"}
                  </strong>
                </p>
                <p>
                  <span className="temp-label">PO Number</span>:{" "}
                  <strong>{referenceId || "_________"}</strong>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <table className="emp-inv-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Item/Service Description</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th>Sub total</th>
            <th>GST ({gst}%)</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {parsedLineItems.map((item, idx) => {
            const lineGST = (Number(item.total || 0) * Number(gst || 0)) / 100;
            const lineGross = Number(item.total || 0) + lineGST;
            return (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{item.description || ""}</td>
                <td>{item.quantity || ""}</td>
                <td>₹ {Number(item.rate || 0).toLocaleString("en-IN")}</td>
                <td>₹ {Number(item.total || 0).toLocaleString("en-IN")}</td>
                <td>₹ {Number(lineGST.toFixed(2)).toLocaleString("en-IN")}</td>
                <td>
                  ₹ {Number(lineGross.toFixed(2)).toLocaleString("en-IN")}
                </td>
              </tr>
            );
          })}

          {emptyRows.map((_, index) => (
            <tr key={`empty-${index}`}>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          ))}

          <tr className="emp-totals-row">
            <td></td>
            <td>
              <strong>Totals</strong>
            </td>
            <td>
              <strong>{totals.quantity}</strong>
            </td>
            <td>
              <strong>₹ {Number(totals.amount).toLocaleString("en-IN")}</strong>
            </td>
            <td>
              <strong>₹ {Number(totals.total).toLocaleString("en-IN")}</strong>
            </td>
            <td>
              <strong>
                ₹ {Number(totalGST.toFixed(2)).toLocaleString("en-IN")}
              </strong>
            </td>
            <td>
              <strong>₹ {Number(grossTotal.toLocaleString("en-IN"))}</strong>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="emp-tax-section">
        <div className="emp-partition">
          <div className="emp-tax-box">
            <p>Tax type</p>
            <p>Taxable amount</p>
            <p>Rate</p>
            <p>Tax amount</p>
          </div>
          {state && state.toLowerCase() === "karnataka" ? (
            <>
              <div className="emp-tax-box-body">
                <p className="emp-tax-label">CGST</p>
                <p>
                  ₹ {Number(totalExcludingTax || 0).toLocaleString("en-IN")}
                </p>
                <p>{halfGSTRate}%</p>
                <p>₹ {Number(halfGSTAmount).toLocaleString("en-IN")}</p>
              </div>
              <div className="emp-tax-box-body">
                <p className="emp-tax-label">SGST</p>
                <p>
                  ₹ {Number(totalExcludingTax || 0).toLocaleString("en-IN")}
                </p>
                <p>{halfGSTRate}%</p>
                <p>₹ {Number(halfGSTAmount).toLocaleString("en-IN")}</p>
              </div>
            </>
          ) : (
            <div className="emp-tax-box-body">
              <p className="emp-tax-label">IGST</p>
              <p>₹ {Number(totalExcludingTax || 0).toLocaleString("en-IN")}</p>
              <p>{gst}%</p>
              <p>₹ {Number(gstAmount || 0).toLocaleString("en-IN")}</p>
            </div>
          )}
          <p className="emp-amount-in-words">
            <strong>Order Amount in words</strong>
          </p>
          <div className="emp-amount-in-words-text">
            {numberToWords(Math.round(grossTotal || 0))}
          </div>
          <p className="emp-amount-in-words">
            <strong>Terms and Conditions</strong>
          </p>
          <div>
            <p className="emp-terms">{terms || ""}</p>
          </div>
        </div>
        <div className="emp-partition">
          <p className="emp-amounts">
            <strong>Amounts</strong>
          </p>
          <div>
            <div className="emp-amounts-section">
              <p className="emp-total-block">
                <p>Sub Total</p>
                <p>₹ {Number(totals.total).toLocaleString("en-IN")}</p>
              </p>
            </div>
            <div className="emp-amounts-section">
              <p className="emp-total-block">
                <p className="emp-bold">Total</p>
                <p className="emp-bold">
                  ₹ {Number(grossTotal).toLocaleString("en-IN")}
                </p>
              </p>
              <p className="emp-total-block">
                <p>Advance</p>
                <p>₹ {Number(advance || 0).toLocaleString("en-IN")}</p>
              </p>
            </div>
            <div className="emp-amounts-section">
              <p className="emp-total-block">
                <p>Payable Amount</p>
                <p>
                  ₹ {Number(totalIncludingTax || 0).toLocaleString("en-IN")}
                </p>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="emp-inv-footer">
        <div className="emp-footer-partition">
          <strong>
            <h4>Bank Details</h4>
          </strong>
          <div className="emp-bank-details">
            <div className="emp-qr-code">
              <img src="/images/upi-qr-code.png" alt="UPI QR Code" />
            </div>
            <p>
              Name: HDFC BANK, BELGAUM
              <br />
              <br />
              Account No: 50200089573214
              <br />
              <br />
              IFSC code: HDFC0000253
              <br />
              <br />
              Account holder's name: Sukalpa Tech Solutions Pvt Ltd
            </p>
          </div>
        </div>
        <div className="emp-seal-signs">
          <p>For: Sukalpa Tech Solutions Pvt Ltd</p>
          {withSeal ? (
            <div className="emp-seal">
              <img src="/images/seal.png" alt="SEAL" />
            </div>
          ) : (
            <div className="emp-no-seal"></div>
          )}
          <strong>
            <p className="emp-authorized">Authorized Signatory</p>
          </strong>
        </div>
      </footer>
      <p className="emp-note">
        Note: We are a registered MSME under the MSMED Act. As per Section 15,
        kindly ensure payment within 45 days from the invoice date. <br />
        Timely payment supports small businesses like ours.
      </p>
    </div>
  );
});

export default InvoiceTemplate;
