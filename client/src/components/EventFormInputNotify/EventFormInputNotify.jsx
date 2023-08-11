import classNames from 'classnames';
import { Field } from 'formik';
import React from 'react';

function Input (props) {
  const { name, label, classes, value, ...restProps } = props;

  return (
    <Field name={name}>
      {({ field, form: { errors, touched }, meta }) => {
        const inputNotifyClassNames = classNames(classes.inputNotify, {
          [classes.valid]: !meta.error && meta.touched,
          [classes.invalid]: meta.error && meta.touched,
        });

        return (
          <label>
            <input
              className={inputNotifyClassNames}
              {...restProps}
              {...field}
            />
            {meta.error && meta.touched && (
              <span className={classes.error}>{meta.error}</span>
            )}
            <span className={classes.titleNotify}>{label} </span>
          </label>
        );
      }}
    </Field>
  );
}

export default Input;
