import React from 'react';
import styles from './OfferPagination.module.sass';

const OfferPagination = ({ setPage, currentPage, limit, displayedOffers }) => {
  return (
    <div className={styles.pagination}>
      <button
        onClick={() => setPage(currentPage => currentPage - 1)}
        disabled={currentPage === 1}
        className={currentPage === 1 ? styles.buttonActive : null}
      >
        Previous Page
      </button>
      <span>{currentPage}</span>
      <button
        onClick={() => setPage(currentPage => currentPage + 1)}
        disabled={displayedOffers.length < limit}
        className={displayedOffers.length < limit ? styles.buttonActive : null}
      >
        Next Page
      </button>
    </div>
  );
};

export default OfferPagination;
