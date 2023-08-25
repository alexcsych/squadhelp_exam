import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { updateOffer } from '../../store/slices/offersSlice';
import styles from './OfferElement.module.sass';
import CONSTANTS from '../../constants';

const OfferList = ({
  offer,
  moderatedStatus,
  page,
  limit,
  offset,
  updateOffer,
}) => {
  const [currentOffer, setCurrentOffer] = useState(offer);

  const handleUpdateOffer = (offerId, isModerated) => {
    updateOffer({
      offerId,
      isModerated,
      moderatedStatus,
      limit,
      offset: (page - 1) * limit + offset - 1,
    });
  };

  useEffect(() => {
    setCurrentOffer(offer);
  }, [offer]);

  const renderModerationButtons = () => {
    if (currentOffer.isModerated === null) {
      return (
        <div className={styles.buttons}>
          <button onClick={() => handleUpdateOffer(currentOffer.id, true)}>
            Approve
          </button>
          <button onClick={() => handleUpdateOffer(currentOffer.id, false)}>
            Reject
          </button>
        </div>
      );
    } else if (currentOffer.isModerated === false) {
      return (
        <button onClick={() => handleUpdateOffer(currentOffer.id, true)}>
          Approve
        </button>
      );
    } else if (currentOffer.isModerated === true) {
      return (
        <button onClick={() => handleUpdateOffer(currentOffer.id, false)}>
          Reject
        </button>
      );
    }
  };

  return (
    <div className={styles.offerElement}>
      <div className={styles.content}>
        {`id: ${currentOffer.id}, content: ${
          currentOffer.fileName == null ? currentOffer.text : ''
        }`}
        {currentOffer.fileName && (
          <div className={styles.imgContainer}>
            <img
              src={`${CONSTANTS.publicURL}${currentOffer.fileName}`}
              alt='offer'
            />
          </div>
        )}
      </div>

      {renderModerationButtons()}
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  updateOffer: data => {
    dispatch(updateOffer(data));
  },
});

export default connect(null, mapDispatchToProps)(OfferList);
