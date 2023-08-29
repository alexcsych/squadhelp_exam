import { ErrorMessage } from 'formik';
import React from 'react';
import { useState } from 'react';

const FieldFileInput = ({ name, classes, fileName, onFileSelect }) => {
  const { fileUploadContainer, labelClass, fileNameClass, fileInput } = classes;
  const [file, setFile] = useState(fileName);

  const handleFileChange = e => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile.name);
      onFileSelect(selectedFile);
    } else {
      setFile('');
      onFileSelect(null);
    }
  };

  return (
    <div className={fileUploadContainer}>
      <label htmlFor='fileInput' className={labelClass}>
        Choose file
      </label>
      <span id='fileNameContainer' className={fileNameClass}>
        {file}
      </span>
      <input
        name={name}
        className={fileInput}
        id='fileInput'
        type='file'
        onChange={handleFileChange}
      />
      <ErrorMessage name={name} component='span' />
    </div>
  );
};

export default FieldFileInput;
