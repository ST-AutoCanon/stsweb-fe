// Pagination.jsx
import React, { useState } from "react";

export default function Pagination({
  totalPages = 1,
  currentPage = 1,
  onPageChange = () => {},
}) {
  const [jump, setJump] = useState(currentPage);

  const goTo = (p) => {
    const pageNum = Math.min(Math.max(1, p), totalPages);
    setJump(pageNum);
    onPageChange(pageNum);
  };

  const renderPages = () => {
    const pages = [];
    const windowSize = 5;
    let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
    let end = start + windowSize - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - windowSize + 1);
    }
    for (let p = start; p <= end; p++) {
      pages.push(
        <button
          key={p}
          className={`rp-page-num ${p === currentPage ? "active" : ""}`}
          onClick={() => goTo(p)}
          aria-current={p === currentPage ? "page" : undefined}
        >
          {p}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="rp-pagination">
      <button
        className="rp-page-btn"
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        Prev
      </button>

      {renderPages()}

      <button
        className="rp-page-btn"
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next
      </button>

      <div className="rp-page-jump">
        <label style={{ fontSize: 13 }}>Go to</label>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={jump}
          onChange={(e) => setJump(Number(e.target.value || 1))}
          onKeyDown={(e) => {
            if (e.key === "Enter") goTo(jump);
          }}
        />
        <button className="rp-page-btn" onClick={() => goTo(jump)}>
          Go
        </button>
      </div>
    </div>
  );
}
