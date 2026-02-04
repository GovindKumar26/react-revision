// useEffect - Side Effects and Lifecycle
import { useState, useEffect } from 'react';

// Example 1: Basic Effect (runs after every render)
function BasicEffect() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Effect ran! Count is:', count);
  });

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// Example 2: Effect with Dependency Array
function DependencyArray() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]); // Only runs when count changes

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type name (doesn't trigger effect)"
      />
    </div>
  );
}

// Example 3: Run Once on Mount (empty dependency array)
function RunOnce() {
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log('Component mounted! Fetching data...');
    
    fetch('https://jsonplaceholder.typicode.com/users/1')
      .then(res => res.json())
      .then(data => setData(data));
  }, []); // Empty array = run once on mount

  return (
    <div>
      <h3>User Data:</h3>
      {data ? (
        <div>
          <p>Name: {data.name}</p>
          <p>Email: {data.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

// Example 4: Cleanup Function
function CleanupExample() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);

    // Cleanup function
    return () => {
      console.log('Cleaning up interval');
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <h3>Auto Counter: {count}</h3>
      <p>This counter increments every second</p>
    </div>
  );
}

// Example 5: Event Listeners
function EventListenerExample() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <h3>Window Width: {width}px</h3>
      <p>Resize the window to see it change</p>
    </div>
  );
}

// Example 6: Document Title Update
function DocumentTitleExample() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
    
    // Cleanup: reset title when component unmounts
    return () => {
      document.title = 'React App';
    };
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>Check the browser tab title!</p>
    </div>
  );
}

// Example 7: Fetch Data with Abort Controller
function FetchWithAbort() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    
    setLoading(true);
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
      signal: abortController.signal
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
          setLoading(false);
        }
      });

    // Cleanup: abort fetch if component unmounts or userId changes
    return () => {
      abortController.abort();
    };
  }, [userId]);

  return (
    <div>
      <div>
        <button onClick={() => setUserId(1)}>User 1</button>
        <button onClick={() => setUserId(2)}>User 2</button>
        <button onClick={() => setUserId(3)}>User 3</button>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <div>
          <h4>{user.name}</h4>
          <p>{user.email}</p>
        </div>
      ) : null}
    </div>
  );
}

// Example 8: Local Storage Sync
function LocalStorageSync() {
  const [name, setName] = useState(() => {
    return localStorage.getItem('name') || '';
  });

  useEffect(() => {
    localStorage.setItem('name', name);
  }, [name]);

  return (
    <div>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
      <p>Stored in localStorage: {name}</p>
      <p>Refresh the page - your name will persist!</p>
    </div>
  );
}

// Example 9: Multiple Effects
function MultipleEffects() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState(null);

  // Effect 1: Log count changes
  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]);

  // Effect 2: Fetch user data once
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users/1')
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  // Effect 3: Update document title
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      {user && <p>User: {user.name}</p>}
    </div>
  );
}

export default function UseEffectExamples() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>useEffect Examples</h1>
      
      <section>
        <h2>1. Basic Effect</h2>
        <BasicEffect />
      </section>
      
      <section>
        <h2>2. Dependency Array</h2>
        <DependencyArray />
      </section>
      
      <section>
        <h2>3. Run Once on Mount</h2>
        <RunOnce />
      </section>
      
      <section>
        <h2>4. Cleanup Function (Timer)</h2>
        <CleanupExample />
      </section>
      
      <section>
        <h2>5. Event Listeners</h2>
        <EventListenerExample />
      </section>
      
      <section>
        <h2>6. Document Title</h2>
        <DocumentTitleExample />
      </section>
      
      <section>
        <h2>7. Fetch with Abort</h2>
        <FetchWithAbort />
      </section>
      
      <section>
        <h2>8. Local Storage Sync</h2>
        <LocalStorageSync />
      </section>
      
      <section>
        <h2>9. Multiple Effects</h2>
        <MultipleEffects />
      </section>
    </div>
  );
}
