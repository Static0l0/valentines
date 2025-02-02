import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

function App() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [rejectCount, setRejectCount] = useState(0);
  const [hearts, setHearts] = useState<{ id: number; left: number }[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const rejectMessages = [
    "Are you sure?",
    "Are you really sure?",
    "Think again!",
    "Pretty please?",
    "Don't break my heart!",
    "Last chance...",
    "Final decision..."
  ];

  useEffect(() => {
    setIsMobile('ontouchstart' in window);
  }, []);

  useEffect(() => {
    if (answer === 'yes') {
      const interval = setInterval(() => {
        setHearts(prev => [
          ...prev,
          { id: Date.now(), left: Math.random() * 100 }
        ]);
      }, 300);

      return () => clearInterval(interval);
    }
  }, [answer]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (answer === null && !isMobile) {
      const noButton = document.getElementById('no-button');
      if (noButton) {
        const rect = noButton.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const buttonCenterX = rect.x + rect.width / 2;
        const buttonCenterY = rect.y + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(mouseX - buttonCenterX, 2) + Math.pow(mouseY - buttonCenterY, 2)
        );

        if (distance < 100) {
          setNoButtonPosition({
            x: Math.random() * (window.innerWidth - rect.width),
            y: Math.random() * (window.innerHeight - rect.height)
          });
        }
      }
    }
  };

  const handleNo = () => {
    if (isMobile) {
      setRejectCount(prev => prev + 1);
    }
  };

  return (
    <div 
      className="min-h-screen bg-pink-50 flex items-center justify-center overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      {answer === 'yes' ? (
        <div className="text-center z-10">
          <h1 className="text-4xl font-bold text-pink-600 mb-4">YAY, THANK YOU VERY MUCH! ❤️</h1>
          {hearts.map(heart => (
            <div
              key={heart.id}
              className="absolute animate-float"
              style={{
                left: `${heart.left}%`,
                bottom: '-20px'
              }}
            >
              <Heart className="text-red-500 w-8 h-8 fill-current" />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md mx-4">
          <h1 className="text-3xl font-bold text-pink-600 mb-8">
            {isMobile && rejectCount < rejectMessages.length
              ? rejectMessages[rejectCount]
              : "Will you be my Valentine?"}
          </h1>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setAnswer('yes')}
              className="px-8 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors font-semibold"
            >
              Yes
            </button>
            
            {(isMobile && rejectCount >= rejectMessages.length - 1) ? (
              <button
                onClick={() => setAnswer('yes')}
                className="px-8 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors font-semibold"
              >
                Yes
              </button>
            ) : (
              <button
                id="no-button"
                onClick={handleNo}
                className="px-8 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors font-semibold"
                style={!isMobile ? {
                  position: 'absolute',
                  left: `${noButtonPosition.x}px`,
                  top: `${noButtonPosition.y}px`,
                  transition: 'all 0.2s ease'
                } : {}}
              >
                No
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;