import React, { useState } from 'react';
import { ErrorMessage } from 'formik';

const ImageUpload = props => {
  const { uploadContainer, inputContainer, imgStyle, error } = props.classes;
  const [imageName, setImageName] = useState('');

  const handleFileChange = e => {
    if (e.target.files.length > 0) {
      setImageName(e.target.files[0].name);
      props.setValue(props.name, e.target.files[0]);
    } else {
      setImageName('');
      props.setValue(props.name, null);
    }
  };

  return (
    <div className={uploadContainer}>
      <div className={inputContainer}>
        <span>Support only images (*.png, *.gif, *.jpeg)</span>
        <input
          id='fileInput'
          name={props.name}
          type='file'
          accept='.gif, .png, .jpg, .jpeg'
          onChange={handleFileChange}
        />
        <label htmlFor='fileInput'>Choose file</label>
        <ErrorMessage name={props.name} component='span' className={error} />
      </div>
      <div className={imgStyle}>{imageName}</div>
    </div>
  );
};

export default ImageUpload;
