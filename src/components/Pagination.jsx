import React from 'react';
import '../styles/Pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalElements,
  size,
  onPageChange,
  loading 
}) => {
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(0, currentPage - 2);
      const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 0 && page < totalPages && !loading) {
      onPageChange(page);
    }
  };

  const pageNumbers = generatePageNumbers();
  const startItem = currentPage * size + 1;
  const endItem = Math.min((currentPage + 1) * size, totalElements);

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <span className="pagination-text">
          Showing {startItem}-{endItem} of {totalElements} photos
        </span>
      </div>
      
      <div className="pagination-controls">
        <button
          className="pagination-btn pagination-prev"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 0 || loading}
          aria-label="Previous page"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
          Previous
        </button>

        <div className="pagination-numbers">
          {currentPage > 2 && (
            <>
              <button
                className="pagination-number"
                onClick={() => handlePageClick(0)}
                disabled={loading}
              >
                1
              </button>
              {currentPage > 3 && <span className="pagination-ellipsis">...</span>}
            </>
          )}

          {pageNumbers.map((page) => (
            <button
              key={page}
              className={`pagination-number ${page === currentPage ? 'active' : ''}`}
              onClick={() => handlePageClick(page)}
              disabled={loading}
            >
              {page + 1}
            </button>
          ))}

          {currentPage < totalPages - 3 && (
            <>
              {currentPage < totalPages - 4 && <span className="pagination-ellipsis">...</span>}
              <button
                className="pagination-number"
                onClick={() => handlePageClick(totalPages - 1)}
                disabled={loading}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          className="pagination-btn pagination-next"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages - 1 || loading}
          aria-label="Next page"
        >
          Next
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;