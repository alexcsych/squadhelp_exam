import React from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { pay, clearPaymentStore } from '../../store/slices/paymentSlice';
import PayForm from '../../components/PayForm/PayForm';
import styles from './Payment.module.sass';
import Error from '../../components/Error/Error';
import Logo from '../../components/Logo';

const Payment = props => {
  const pay = values => {
    const { contests } = props.contestCreationStore;
    const contestArray = [];
    Object.keys(contests).forEach(key =>
      contestArray.push({ ...contests[key] })
    );
    const { number, expiry, cvc } = values;
    const data = new FormData();

    for (let i = 0; i < contestArray.length; i++) {
      if (contestArray[i].file === '') {
        data.append('files', contestArray[i].file);
      } else {
        const tempFileData = localStorage.getItem(
          `${contestArray[i].contestType}FileData`
        );
        const binaryData = atob(tempFileData);
        const byteArray = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          byteArray[i] = binaryData.charCodeAt(i);
        }
        const file = new File([byteArray], contestArray[i].file.name, {
          type: contestArray[i].file.type,
        });
        contestArray[i].file = file;
        data.append('files', file);
      }
      localStorage.removeItem(`${contestArray[i].contestType}FileData`);
      contestArray[i].haveFile = !!contestArray[i].file;
    }

    data.append('number', number);
    data.append('expiry', expiry);
    data.append('cvc', cvc);
    data.append('contests', JSON.stringify(contestArray));
    data.append('price', '100');
    props.pay({
      data: {
        formData: data,
      },
      history: props.history,
    });
  };

  const goBack = () => {
    props.history.goBack();
  };

  const { contests } = props.contestCreationStore;
  const { error } = props.payment;
  const { clearPaymentStore } = props;
  if (isEmpty(contests)) {
    props.history.replace('startContest');
  }
  return (
    <div>
      <div className={styles.header}>
        <Logo alt='blue_logo' />
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.paymentContainer}>
          <span className={styles.headerLabel}>Checkout</span>
          {error && (
            <Error
              data={error.data}
              status={error.status}
              clearError={clearPaymentStore}
            />
          )}
          <PayForm sendRequest={pay} back={goBack} isPayForOrder />
        </div>
        <div className={styles.orderInfoContainer}>
          <span className={styles.orderHeader}>Order Summary</span>
          <div className={styles.packageInfoContainer}>
            <span className={styles.packageName}>Package Name: Standard</span>
            <span className={styles.packagePrice}>$100 USD</span>
          </div>
          <div className={styles.resultPriceContainer}>
            <span>Total:</span>
            <span>$100.00 USD</span>
          </div>
          <a href='http://www.google.com'>Have a promo code?</a>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  payment: state.payment,
  contestCreationStore: state.contestCreationStore,
});

const mapDispatchToProps = dispatch => ({
  pay: ({ data, history }) => dispatch(pay({ data, history })),
  clearPaymentStore: () => dispatch(clearPaymentStore()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
