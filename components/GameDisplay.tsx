import React from 'react';

interface GameDisplayProps {
  code: string;
}

const GameDisplay: React.FC<GameDisplayProps> = ({ code }) => {
  return (
    <iframe
      srcDoc={code}
      title="Generated Retro Game"
      sandbox="allow-scripts allow-same-origin"
      className="w-full h-full border-0"
      key={code} 
    />
  );
};

export default GameDisplay;