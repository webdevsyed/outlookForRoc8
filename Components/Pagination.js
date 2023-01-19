import React from 'react';
import '../styles/Pagination.css'

function Pagination({ currentPage, handlePageChange,totalPages }) {
  return (
    <div className='pagination-container'>
      <button className='pagination-button' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
       Previous
      </button>
      <button className='pagination-button' onClick={() => handlePageChange(currentPage + 1)} disabled={totalPages/currentPage<10}>Next</button>
    </div>
  );
}

export default Pagination;
