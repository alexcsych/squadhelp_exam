import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getOffers, clearOffersList } from '../../store/slices/offersSlice';
import OfferElement from '../OfferElement/OfferElement';
import styles from './ModeratorDashboard.module.sass';
import Spinner from '../Spinner/Spinner';
import TryAgain from '../TryAgain/TryAgain';
import OfferPagination from '../OfferPagination/OfferPagination';

const tryLoadAgain = ({
  moderatedStatus,
  notModeratedPage,
  approvedPage,
  rejectedPage,
  limit,
}) => {
  clearOffersList();
  getOffers({
    moderatedStatus,
    page:
      moderatedStatus === null
        ? notModeratedPage
        : moderatedStatus === true
        ? approvedPage
        : rejectedPage,
    limit,
  });
};

const StatusButton = ({ activeStatus, message, status, onClick }) => (
  <button
    className={activeStatus === status ? styles.buttonActive : null}
    onClick={() => onClick(status)}
  >
    {message}
  </button>
);

const ModeratorDashboard = ({ offers, isFetching, error, getOffers }) => {
  const [moderatedStatus, setModeratedStatus] = useState(null);
  const [notModeratedPage, setNotModeratedPage] = useState(1);
  const [approvedPage, setApprovedPage] = useState(1);
  const [rejectedPage, setRejectedPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    getOffers({
      moderatedStatus,
      page:
        moderatedStatus === null
          ? notModeratedPage
          : moderatedStatus === true
          ? approvedPage
          : rejectedPage,
      limit,
    });
  }, [moderatedStatus, notModeratedPage, approvedPage, rejectedPage]);

  const moderatedOffers = offers.filter(
    offer => offer.isModerated === moderatedStatus
  );

  const isVisible =
    (moderatedStatus === null && notModeratedPage > 1) ||
    (moderatedStatus === true && approvedPage > 1) ||
    (moderatedStatus === false && rejectedPage > 1);

  const renderPagination = () => (
    <OfferPagination
      setPage={
        moderatedStatus === null
          ? setNotModeratedPage
          : moderatedStatus === true
          ? setApprovedPage
          : setRejectedPage
      }
      currentPage={
        moderatedStatus === null
          ? notModeratedPage
          : moderatedStatus === true
          ? approvedPage
          : rejectedPage
      }
      limit={limit}
      displayedOffers={moderatedOffers}
    />
  );

  return (
    <div className={styles.mainContainer}>
      <div className={styles.moderatedStatusContainer}>
        <StatusButton
          activeStatus={moderatedStatus}
          message='Not moderated'
          status={null}
          onClick={setModeratedStatus}
        />
        <StatusButton
          activeStatus={moderatedStatus}
          message='Approved'
          status={true}
          onClick={setModeratedStatus}
        />
        <StatusButton
          activeStatus={moderatedStatus}
          message='Rejected'
          status={false}
          onClick={setModeratedStatus}
        />
      </div>
      {error ? (
        <div className={styles.messageContainer}>
          <TryAgain getData={() => tryLoadAgain(moderatedStatus)} />
        </div>
      ) : (
        <div>
          {isFetching ? (
            <div className={styles.spinnerContainer}>
              <Spinner />
            </div>
          ) : moderatedOffers.length === 0 ? (
            <span className={styles.textContainer}>None found</span>
          ) : (
            <>
              {moderatedOffers.map(offer => (
                <OfferElement
                  key={offer.id}
                  offer={offer}
                  moderatedStatus={moderatedStatus}
                  notModeratedPage={notModeratedPage}
                  approvedPage={approvedPage}
                  rejectedPage={rejectedPage}
                  limit={limit}
                />
              ))}
              {renderPagination()}
            </>
          )}
          {moderatedOffers.length === 0 && isVisible && renderPagination()}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  const { offers, isFetching } = state.offerStore;
  return {
    offers,
    isFetching,
  };
};

const mapDispatchToProps = dispatch => ({
  getOffers: data => dispatch(getOffers(data)),
  clearOffersList: () => dispatch(clearOffersList()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModeratorDashboard);
