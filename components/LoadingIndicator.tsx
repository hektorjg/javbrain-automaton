import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center text-cyan-400 text-sm">
      <span className="mr-2">ARCADE_AI ></span>
      <p className="animate-pulse">GENERATING GAME CODE...</p>
    </div>
  );
};

export default LoadingIndicator;