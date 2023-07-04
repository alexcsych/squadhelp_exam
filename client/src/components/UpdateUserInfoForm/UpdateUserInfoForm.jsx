import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { connect } from 'react-redux';
import { clearUserError } from '../../store/slices/userSlice';
import styles from './UpdateUserInfoForm.module.sass';
import FormInput from '../FormInput/FormInput';
import Schems from '../../utils/validators/validationSchems';
import Error from '../Error/Error';

const UpdateUserInfoForm = props => {
  const [imageName, setImageName] = useState('anon.png');
  const { onSubmit, submitting, error, clearUserError } = props;
  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={props.initialValues}
      validationSchema={Schems.UpdateUserSchema}
    >
      {formikProps => (
        <Form className={styles.updateContainer}>
          {error && (
            <Error
              data={error.data}
              status={error.status}
              clearError={clearUserError}
            />
          )}
          <div className={styles.container}>
            <span className={styles.label}>First Name</span>
            <FormInput
              name='firstName'
              type='text'
              label='First Name'
              classes={{
                container: styles.inputContainer,
                input: styles.input,
                warning: styles.error,
                notValid: styles.notValid,
              }}
            />
          </div>
          <div className={styles.container}>
            <span className={styles.label}>Last Name</span>
            <FormInput
              name='lastName'
              type='text'
              label='LastName'
              classes={{
                container: styles.inputContainer,
                input: styles.input,
                warning: styles.error,
                notValid: styles.notValid,
              }}
            />
          </div>
          <div className={styles.container}>
            <span className={styles.label}>Display Name</span>
            <FormInput
              name='displayName'
              type='text'
              label='Display Name'
              classes={{
                container: styles.inputContainer,
                input: styles.input,
                warning: styles.error,
                notValid: styles.notValid,
              }}
            />
          </div>
          <div className={styles.imageUploadContainer}>
            <div className={styles.uploadInputContainer}>
              <span>Support only images (*.png, *.gif, *.jpeg)</span>
              <input
                id='fileInput'
                name='file'
                type='file'
                accept='.jpg, .png, .jpeg'
                onChange={e => {
                  setImageName(e.target.files[0].name);
                  formikProps.setFieldValue('file', e.target.files[0]);
                }}
              />
              <label htmlFor='fileInput'>Chose file</label>
            </div>
            <div className={styles.imgName}>{imageName}</div>
          </div>
          <button type='submit' disabled={submitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

const mapStateToProps = state => {
  const { data, error } = state.userStore;
  return {
    error,
    initialValues: {
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: data.displayName,
      file: data.avatar,
    },
  };
};

const mapDispatchToProps = dispatch => ({
  clearUserError: () => dispatch(clearUserError()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateUserInfoForm);
