// useRef - Accessing DOM and Persisting Values
import { useRef, useState, useEffect } from 'react';

// Example 1: Focus Input on Mount
function FocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div>
      <input ref={inputRef} placeholder="This input is auto-focused" />
    </div>
  );
}

// Example 2: Scroll to Element
function ScrollToElement() {
  const topRef = useRef(null);
  const bottomRef = useRef(null);

  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div ref={topRef}>
        <h3>Top of the section</h3>
        <button onClick={scrollToBottom}>Scroll to Bottom</button>
      </div>
      
      <div style={{ height: '300px', background: '#f0f0f0', margin: '10px 0' }}>
        <p>Scroll content...</p>
      </div>
      
      <div ref={bottomRef}>
        <h3>Bottom of the section</h3>
        <button onClick={scrollToTop}>Scroll to Top</button>
      </div>
    </div>
  );
}

// Example 3: Persisting Values Without Re-render
function RenderCounter() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <div>
      <p>State Count: {count}</p>
      <p>Render Count: {renderCount.current}</p>
      <button onClick={() => setCount(count + 1)}>Increment State</button>
      <p>Notice: Render count increases but doesn't cause re-render</p>
    </div>
  );
}

// Example 4: Storing Previous Value
function PreviousValue() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();

  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCountRef.current}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// Example 5: Interval with useRef
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setSeconds(0);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div>
      <h3>Timer: {seconds}s</h3>
      <button onClick={startTimer} disabled={isRunning}>Start</button>
      <button onClick={stopTimer} disabled={!isRunning}>Stop</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}

// Example 6: Video Player Controls
function VideoPlayer() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipForward = () => {
    videoRef.current.currentTime += 10;
  };

  const skipBackward = () => {
    videoRef.current.currentTime -= 10;
  };

  return (
    <div>
      <video 
        ref={videoRef}
        width="400"
        src="https://www.w3schools.com/html/mov_bbb.mp4"
      />
      <div>
        <button onClick={togglePlay}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={skipBackward}>-10s</button>
        <button onClick={skipForward}>+10s</button>
      </div>
    </div>
  );
}

// Example 7: Tracking Click Outside
function ClickOutside() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div>
      <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
        <button onClick={() => setIsOpen(!isOpen)}>
          Toggle Dropdown
        </button>
        
        {isOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: 'white',
            border: '1px solid #ccc',
            padding: '10px',
            marginTop: '5px'
          }}>
            <p>Dropdown content</p>
            <p>Click outside to close</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Example 8: Measuring DOM Element
function MeasureElement() {
  const divRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const measureElement = () => {
    if (divRef.current) {
      const { width, height } = divRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  };

  return (
    <div>
      <div 
        ref={divRef}
        style={{
          width: '50%',
          height: '100px',
          background: '#e0e0e0',
          padding: '20px'
        }}
      >
        Resize the window and click "Measure"
      </div>
      
      <button onClick={measureElement}>Measure Element</button>
      
      {dimensions.width > 0 && (
        <p>Width: {dimensions.width.toFixed(2)}px, Height: {dimensions.height.toFixed(2)}px</p>
      )}
    </div>
  );
}

export default function UseRefExamples() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>useRef Examples</h1>
      
      <section>
        <h2>1. Focus Input</h2>
        <FocusInput />
      </section>
      
      <section>
        <h2>2. Scroll to Element</h2>
        <ScrollToElement />
      </section>
      
      <section>
        <h2>3. Render Counter</h2>
        <RenderCounter />
      </section>
      
      <section>
        <h2>4. Previous Value</h2>
        <PreviousValue />
      </section>
      
      <section>
        <h2>5. Timer with Interval</h2>
        <Timer />
      </section>
      
      <section>
        <h2>6. Video Player Controls</h2>
        <VideoPlayer />
      </section>
      
      <section>
        <h2>7. Click Outside Detection</h2>
        <ClickOutside />
      </section>
      
      <section>
        <h2>8. Measure Element</h2>
        <MeasureElement />
      </section>
    </div>
  );
}
