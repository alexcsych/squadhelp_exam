import React from 'react';
import { connect } from 'react-redux';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './EventPage.module.sass';
import Spinner from '../../components/Spinner/Spinner';
import EventForm from '../../components/EventForm/EventForm';
import EventsList from '../../components/EventsList/EventsList';

const EventPage = props => {
  const { isFetching } = props;
  return (
    <>
      <Header />
      {isFetching ? (
        <Spinner />
      ) : (
        <>
          <section className={styles.eventSection}>
            <EventForm />
            <EventsList />
          </section>
          <Footer />
        </>
      )}
    </>
  );
};

const mapStateToProps = state => {
  const { isFetching } = state.userStore;
  return { isFetching };
};

export default connect(mapStateToProps, null)(EventPage);
