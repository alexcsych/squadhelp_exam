import React, { useState } from 'react';
import { ErrorMessage } from 'formik';

const ImageUpload = ({ classes, name, setValue }) => {
  const { uploadContainer, inputContainer, imgStyle, error } = classes;
  const [imageName, setImageName] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = e => {
    if (e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      setImageName(selectedImage.name);
      setValue(name, selectedImage);

      const imageUrl = URL.createObjectURL(selectedImage);
      setImagePreview(imageUrl);
    } else {
      setImageName('');
      setValue(name, null);
      setImagePreview(null);
    }
  };

  return (
    <div className={uploadContainer}>
      <div className={inputContainer}>
        <span>Support only images (*.png, *.gif, *.jpeg)</span>
        <input
          id='fileInput'
          name={name}
          type='file'
          accept='.gif, .png, .jpg, .jpeg'
          onChange={handleFileChange}
        />
        <label htmlFor='fileInput'>Choose file</label>
        <ErrorMessage name={name} component='span' className={error} />
      </div>
      {imagePreview && (
        <div className={imgStyle}>
          <img className={imgStyle} src={imagePreview} alt={imageName} />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
