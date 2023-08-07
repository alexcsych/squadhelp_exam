import { Formik, Form } from 'formik';
import React from 'react';
import Schems from '../../utils/validators/validationSchems';
import Input from '../EventFormInput/EventFormInput';
import styles from './EventForm.module.sass';
import { connect } from 'react-redux';
import { createEvent } from '../../store/slices/eventSlice';

function EventForm ({ createNewEvent }) {
  const initialValues = { name: '', date: '', time: '' };

  const handleSubmit = (values, formikBag) => {
    createNewEvent(values);
    formikBag.resetForm();
  };

  const classes = {
    error: styles.error,
    input: styles.input,
    valid: styles.valid,
    invalid: styles.invalid,
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
          placeholder='Event name'
          autoFocus
          classes={classes}
        />
        <Input label='Date:' type='date' name='date' classes={classes} />
        <Input label='Time:' type='time' name='time' classes={classes} />
        <button type='submit'>Add new event</button>
      </Form>
    </Formik>
  );
}

const mapDispatchToProps = dispatch => ({
  createNewEvent: e => dispatch(createEvent(e)),
});

export default connect(null, mapDispatchToProps)(EventForm);
