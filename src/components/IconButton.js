import React from 'react';

const IconButton = ({ icon, label, onClick, className, testID }) => {
  return (
    <button 
      data-testid={testID}
      className={`flex flex-col items-center w-20 ${className || ''}`}
      onClick={onClick}
      aria-label={label}
    >
      <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center">
        {icon}
      </div>
      <span className="mt-2 text-xs text-center font-medium">{label}</span>
    </button>
  );
};

export default React.memo(IconButton);
