import { useState, useEffect } from 'react';
import { useAppStore } from './store';
import { AnimatedBackground } from './components/AnimatedBackground';
import { SetupWizard } from './components/setup/SetupWizard';
import { Projects } from './components/Projects';
import { Tasks } from './components/Tasks';
import { Settings, Play, Pause, Square } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function App() {
  const { settings, timer, startTimer, pauseTimer, resetTimer, tickTimer } = useAppStore();
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer.isRunning && timer.timeLeft > 0) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    } else if (timer.timeLeft === 0 && timer.isRunning) {
      // Timer hit 0, handled internally by tickTimer, but we can also ensure it stops here.
      pauseTimer();
    }
    return () => clearInterval(interval);
  }, [timer.isRunning, timer.timeLeft, tickTimer, pauseTimer]);

  // Minimal App State for Demo
  // Show setup wizard if MongoDB is not configured on first load
  const [showSetup, setShowSetup] = useState(() => !settings.mongoDbUrl || !settings.mongoDbApiKey);

  // Format time (e.g., 25:00)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <AnimatedBackground />
      <Toaster position="bottom-center" toastOptions={{
        style: { background: 'rgba(0,0,0,0.8)', color: '#fff', backdropFilter: 'blur(10px)' }
      }}/>
      
      {showSetup && <SetupWizard onClose={() => setShowSetup(false)} />}
      
      {/* Header with settings icon */}
      <div className="absolute top-0 right-0 p-6 z-20">
        <button 
          onClick={() => setShowSetup(true)} 
          className="glass-button p-3 rounded-full hover:rotate-90 transition-transform duration-300"
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="relative z-10 min-h-screen text-white p-6 flex flex-col items-center justify-center">
        
        {/* Main Pomodoro Panel */}
        <div className="glass-panel w-full max-w-md flex flex-col items-center justify-center p-8 gap-8 animate-in slide-in-from-bottom-8 duration-500">
          
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-cyan-200">
              Zen Focus
            </h1>
            <p className="text-white/50 text-sm font-medium uppercase tracking-widest">{timer.mode.replace(/([A-Z])/g, ' $1').trim()}</p>
          </div>
          
          {/* Timer Display */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full filter blur-2xl animate-pulse"></div>
            <div className="text-8xl font-light tracking-tighter tabular-nums text-white drop-shadow-2xl">
              {formatTime(timer.timeLeft)}
            </div>
          </div>
          
          {/* Timer Controls */}
          <div className="flex gap-4 w-full">
            {timer.isRunning ? (
              <button onClick={pauseTimer} className="glass-button flex-1 py-4 text-lg">
                <Pause size={24} className="mr-2" /> Pause
              </button>
            ) : (
              <button onClick={startTimer} className="glass-button-primary flex-1 py-4 text-lg">
                <Play size={24} className="mr-2 ml-1" /> Start
              </button>
            )}
            <button onClick={resetTimer} className="glass-button aspect-square p-4" aria-label="Reset">
              <Square size={24} className="text-white/70 hover:text-white" />
            </button>
          </div>
          
        </div>

        {/* Projects and Tasks UI */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center">
          <Projects />
          <Tasks />
        </div>

      </div>
    </>
  );
}

export default App;
