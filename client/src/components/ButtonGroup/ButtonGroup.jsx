import React, { useState } from 'react';
import styles from './ButtonGroup.module.sass';
import classNames from 'classnames';

const ButtonGroup = () => {
  const [selectedButton, setSelectedButton] = useState(2);

  const handleClick = buttonId => {
    setSelectedButton(buttonId);
  };

  return (
    <div className={styles.container}>
      <div
        className={classNames(styles.item, {
          [styles.selected]: selectedButton === 1,
        })}
        onClick={() => handleClick(1)}
      >
        <button className={styles.btn}>
          {selectedButton === 1 ? 'Yes' : 'No'}
        </button>
        <span className={styles.text}>
          The Domain should exactly match the name
        </span>
      </div>
      <div
        className={classNames(styles.item, {
          [styles.selected]: selectedButton === 2,
        })}
        onClick={() => handleClick(2)}
      >
        <button className={styles.btn}>
          {selectedButton === 2 ? 'Yes' : 'No'}
        </button>
        <span className={styles.text}>
          But minor variations are allowed (Recommended)
        </span>
      </div>
      <div
        className={classNames(styles.item, {
          [styles.selected]: selectedButton === 3,
        })}
        onClick={() => handleClick(3)}
      >
        <button className={styles.btn}>
          {selectedButton === 3 ? 'Yes' : 'No'}
        </button>
        <span className={styles.text}>
          I am only looking for a name, not a Domain
        </span>
      </div>
    </div>
  );
};

export default ButtonGroup;
