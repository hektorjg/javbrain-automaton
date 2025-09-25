import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageAuthor } from './types';
import { generateGameCode } from './services/geminiService';
import ChatInput from './components/ChatInput';
import GameDisplay from './components/GameDisplay';
import LoadingIndicator from './components/LoadingIndicator';
import ChatMessageDisplay from './components/ChatMessage';
import GameLoadingScreen from './components/GameLoadingScreen';

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: '1', author: MessageAuthor.SYSTEM, text: 'ENTER A RETRO GAME TO GENERATE (E.G., TETRIS, PONG, SNAKE)' },
  ]);
  const [userInput, setUserInput] = useState('');
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const validateGameCode = (code: string): boolean => {
    const lowerCaseCode = code.toLowerCase();
    const hasHtml = lowerCaseCode.includes('<!doctype html>');
    const hasCanvas = lowerCaseCode.includes('<canvas');
    const hasScript = lowerCaseCode.includes('<script');
    return hasHtml && hasCanvas && hasScript;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), author: MessageAuthor.USER, text: userInput };
    setChatHistory(prev => [...prev, userMessage]);
    const requestedGame = userInput;
    setUserInput('');
    setIsLoading(true);
    setError(null);
    setGameCode(null);
    
    try {
      setLoadingStatus('GENERATING');
      const finalCode = await generateGameCode(requestedGame, (status) => setLoadingStatus(status));
      
      setLoadingStatus('VALIDATING');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const cleanedCode = finalCode.replace(/^```html\s*|```$/g, '').trim();

      if (validateGameCode(cleanedCode)) {
        setGameCode(cleanedCode);
        const aiMessage: ChatMessage = { id: `${Date.now()}-ai`, author: MessageAuthor.AI, text: `OK! GENERATING ${requestedGame.toUpperCase()}... COMPLETE!` };
        setChatHistory(prev => [...prev, aiMessage]);
      } else {
        throw new Error("AI output failed validation. It may not be a playable game.");
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      const errorMessageObj: ChatMessage = { id: `${Date.now()}-error`, author: MessageAuthor.SYSTEM, text: `ERROR: ${errorMessage}` };
      setChatHistory(prev => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  return (
    <div className="h-screen bg-black text-green-400 p-2 sm:p-4 md:p-6 lg:p-8 flex flex-col font-['Press_Start_2P'] overflow-hidden">
      <header className="text-center mb-4 sm:mb-6 flex-shrink-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-cyan-400 animate-pulse" style={{ textShadow: '0 0 10px #22d3ee, 0 0 20px #22d3ee' }}>
          AI RETRO ARCADE
        </h1>
      </header>

      <main className="flex-grow grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8 min-h-0 overflow-hidden">
        {/* Left Column: Chat Interface (20%) */}
        <div className="flex flex-col h-full min-h-0 md:col-span-1">
          <div className="flex-grow border-2 border-dashed border-pink-500 p-4 overflow-y-auto bg-black/50 min-h-0 mb-4">
            <div className="space-y-1">
              {chatHistory.map(msg => (
                <ChatMessageDisplay key={msg.id} message={msg} />
              ))}
              {isLoading && !gameCode && <LoadingIndicator />}
            </div>
            <div ref={chatEndRef} />
          </div>
          <div className="flex-shrink-0">
            <ChatInput 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onSubmit={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Right Column: Game Display (80%) */}
        <div className="border-4 border-cyan-400 shadow-[0_0_20px_theme(colors.cyan.400)] bg-black p-2 h-full min-h-[300px] md:min-h-0 md:col-span-4">
          {isLoading ? (
            <GameLoadingScreen status={loadingStatus} />
          ) : gameCode ? (
            <GameDisplay code={gameCode} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-xl text-pink-500 animate-pulse">GAME WILL LOAD HERE</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;