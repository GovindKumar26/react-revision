// Custom Hooks - Reusable Logic
import { useState, useEffect, useRef, useCallback } from 'react';

// Custom Hook 1: useFetch
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(url, { signal: abortController.signal });
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => abortController.abort();
  }, [url]);

  return { data, loading, error };
}

function UseFetchExample() {
  const [userId, setUserId] = useState(1);
  const { data, loading, error } = useFetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  return (
    <div>
      <h3>useFetch Custom Hook</h3>
      <div>
        <button onClick={() => setUserId(1)}>User 1</button>
        <button onClick={() => setUserId(2)}>User 2</button>
        <button onClick={() => setUserId(3)}>User 3</button>
      </div>
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <div>
          <h4>{data.name}</h4>
          <p>Email: {data.email}</p>
        </div>
      )}
    </div>
  );
}

// Custom Hook 2: useLocalStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setStoredValue = (newValue) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(error);
    }
  };

  return [value, setStoredValue];
}

function UseLocalStorageExample() {
  const [name, setName] = useLocalStorage('name', '');
  const [age, setAge] = useLocalStorage('age', 0);

  return (
    <div>
      <h3>useLocalStorage Custom Hook</h3>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
        placeholder="Age"
      />
      <p>Stored: {name}, {age}</p>
      <p>Refresh the page - data persists!</p>
    </div>
  );
}

// Custom Hook 3: useToggle
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  return [value, toggle];
}

function UseToggleExample() {
  const [isVisible, toggleVisible] = useToggle(false);
  const [isEnabled, toggleEnabled] = useToggle(true);

  return (
    <div>
      <h3>useToggle Custom Hook</h3>
      <button onClick={toggleVisible}>
        {isVisible ? 'Hide' : 'Show'} Content
      </button>
      {isVisible && <p>This content is visible!</p>}
      
      <button onClick={toggleEnabled}>
        {isEnabled ? 'Disable' : 'Enable'}
      </button>
      <p>Status: {isEnabled ? 'Enabled' : 'Disabled'}</p>
    </div>
  );
}

// Custom Hook 4: useDebounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function UseDebounceExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      console.log('Searching for:', debouncedSearch);
      // API call would go here
    }
  }, [debouncedSearch]);

  return (
    <div>
      <h3>useDebounce Custom Hook</h3>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Type to search..."
      />
      <p>Search Term: {searchTerm}</p>
      <p>Debounced (500ms): {debouncedSearch}</p>
      <p>Check console - API calls only after 500ms pause</p>
    </div>
  );
}

// Custom Hook 5: usePrevious
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

function UsePreviousExample() {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div>
      <h3>usePrevious Custom Hook</h3>
      <p>Current: {count}</p>
      <p>Previous: {previousCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}

// Custom Hook 6: useWindowSize
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

function UseWindowSizeExample() {
  const { width, height } = useWindowSize();

  return (
    <div>
      <h3>useWindowSize Custom Hook</h3>
      <p>Width: {width}px</p>
      <p>Height: {height}px</p>
      <p>Resize the window to see values update</p>
    </div>
  );
}

// Custom Hook 7: useOnClickOutside
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

function UseOnClickOutsideExample() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <div>
      <h3>useOnClickOutside Custom Hook</h3>
      <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
        <button onClick={() => setIsOpen(!isOpen)}>
          Toggle Menu
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
            <p>Menu Item 1</p>
            <p>Menu Item 2</p>
            <p>Menu Item 3</p>
            <p>Click outside to close</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Custom Hook 8: useInterval
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => clearInterval(id);
  }, [delay]);
}

function UseIntervalExample() {
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  const [isRunning, setIsRunning] = useState(true);

  useInterval(
    () => {
      setCount(count + 1);
    },
    isRunning ? delay : null
  );

  return (
    <div>
      <h3>useInterval Custom Hook</h3>
      <p>Count: {count}</p>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button onClick={() => setCount(0)}>Reset</button>
      <div>
        <label>
          Delay: {delay}ms
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
}

// Custom Hook 9: useForm
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, errors, setErrors, handleChange, reset };
}

function UseFormExample() {
  const { values, errors, setErrors, handleChange, reset } = useForm({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!values.username) newErrors.username = 'Username is required';
    if (!values.email.includes('@')) newErrors.email = 'Invalid email';
    if (values.password.length < 6) newErrors.password = 'Password must be 6+ chars';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    alert('Form submitted: ' + JSON.stringify(values));
    reset();
  };

  return (
    <div>
      <h3>useForm Custom Hook</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            name="username"
            value={values.username}
            onChange={handleChange}
            placeholder="Username"
          />
          {errors.username && <span style={{ color: 'red' }}>{errors.username}</span>}
        </div>
        
        <div>
          <input
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="Email"
          />
          {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
        </div>
        
        <div>
          <input
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            placeholder="Password"
          />
          {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
        </div>
        
        <button type="submit">Submit</button>
        <button type="button" onClick={reset}>Reset</button>
      </form>
    </div>
  );
}

export default function CustomHooksExamples() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Custom Hooks Examples</h1>
      
      <section>
        <h2>1. useFetch</h2>
        <UseFetchExample />
      </section>
      
      <section>
        <h2>2. useLocalStorage</h2>
        <UseLocalStorageExample />
      </section>
      
      <section>
        <h2>3. useToggle</h2>
        <UseToggleExample />
      </section>
      
      <section>
        <h2>4. useDebounce</h2>
        <UseDebounceExample />
      </section>
      
      <section>
        <h2>5. usePrevious</h2>
        <UsePreviousExample />
      </section>
      
      <section>
        <h2>6. useWindowSize</h2>
        <UseWindowSizeExample />
      </section>
      
      <section>
        <h2>7. useOnClickOutside</h2>
        <UseOnClickOutsideExample />
      </section>
      
      <section>
        <h2>8. useInterval</h2>
        <UseIntervalExample />
      </section>
      
      <section>
        <h2>9. useForm</h2>
        <UseFormExample />
      </section>
    </div>
  );
}
