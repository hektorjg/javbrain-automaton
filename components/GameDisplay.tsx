import React from 'react';

interface GameDisplayProps {
  code: string;
}

const GameDisplay: React.FC<GameDisplayProps> = ({ code }) => {
  return (
    <iframe
      srcDoc={code}
      title="Generated Retro Game"
      sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-fullscreen"
      className="w-full h-full border-0"
      key={code}
      allowFullScreen
      style={{ backgroundColor: '#000' }}
    />
  );
};

export default GameDisplay;