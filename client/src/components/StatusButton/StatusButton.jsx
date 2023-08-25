import React from 'react';

const StatusButton = ({ activeStatus, message, status, onClick, style }) => (
  <button
    className={activeStatus === status ? style : null}
    onClick={() => onClick(status)}
  >
    {message}
  </button>
);

export default StatusButton;
