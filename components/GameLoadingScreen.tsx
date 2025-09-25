import React, { useState, useEffect } from 'react';

const loadingMessages = [
  'INITIALIZING ARCADE CORE...',
  'Reticulating splines...',
  'Querying pixel matrix...',
  'Compiling 8-bit shaders...',
  'Booting game logic...',
  'Loading sprite data...',
  'Connecting to mainframe...',
  'Generating procedural levels...',
  'Finalizing game loop...',
];

const validationMessages = [
    'VALIDATING GAME CODE...',
    'Checking for rogue pixels...',
    'Ensuring playability...',
    'Verifying integrity...',
]

interface GameLoadingScreenProps {
  status: string;
}

const GameLoadingScreen: React.FC<GameLoadingScreenProps> = ({ status }) => {
  const [message, setMessage] = useState(loadingMessages[0]);
  
  useEffect(() => {
    let intervalId: number;

    const messages = status === 'VALIDATING' ? validationMessages : loadingMessages;
    let messageIndex = 0;
    setMessage(messages[0]);

    intervalId = window.setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setMessage(messages[messageIndex]);
    }, 1500);

    return () => clearInterval(intervalId);
  }, [status]);


  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black text-center p-4">
      <div className="w-16 h-16 border-4 border-dashed border-cyan-400 rounded-full animate-spin mb-6"></div>
      <p className="text-xl text-pink-500 animate-pulse">{message}</p>
      <p className="text-sm text-green-400 mt-2">PLEASE STAND BY</p>
    </div>
  );
};

export default GameLoadingScreen;