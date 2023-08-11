import { Formik, Form } from 'formik';
import React from 'react';
import Schems from '../../utils/validators/validationSchems';
import Input from '../EventFormInput/EventFormInput';
import InputNotify from '../EventFormInputNotify/EventFormInputNotify';
import styles from './EventForm.module.sass';
import { connect } from 'react-redux';
import { createEvent } from '../../store/slices/eventSlice';

function EventForm ({ createNewEvent }) {
  const initialValues = {
    name: '',
    date: '',
    time: '',
    daysNotify: 0,
    hoursNotify: 0,
    minutesNotify: 0,
    secondsNotify: 0,
  };

  const handleSubmit = (values, formikBag) => {
    createNewEvent(values);
    formikBag.resetForm();
  };

  const classes = {
    error: styles.error,
    input: styles.input,
    inputNotify: styles.inputNotify,
    valid: styles.valid,
    invalid: styles.invalid,
    title: styles.title,
    titleNotify: styles.titleNotify,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={Schems.EventSchema}
    >
      <Form className={styles.form}>
        <Input
          label='Event name:'
          type='text'
          name='name'
          autoFocus
          classes={classes}
        />
        <Input label='Date:' type='date' name='date' classes={classes} />
        <Input label='Time:' type='time' name='time' classes={classes} />
        <label className={styles.labelNotyfy}>
          <span className={styles.title}>Notify me in:</span>
          <div className={styles.notify}>
            <InputNotify
              label='d'
              type='number'
              name='daysNotify'
              classes={classes}
            />
            <InputNotify
              label='h'
              type='number'
              name='hoursNotify'
              classes={classes}
            />
            <InputNotify
              label='m'
              type='number'
              name='minutesNotify'
              classes={classes}
            />
            <InputNotify
              label='s'
              type='number'
              name='secondsNotify'
              classes={classes}
            />
          </div>
        </label>
        <button className={styles.submit} type='submit'>
          ADD NEW EVENT
        </button>
      </Form>
    </Formik>
  );
}

const mapDispatchToProps = dispatch => ({
  createNewEvent: e => dispatch(createEvent(e)),
});

export default connect(null, mapDispatchToProps)(EventForm);
