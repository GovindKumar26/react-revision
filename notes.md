# React Revision Notes

---

## 🎣 Most Important React Hooks - Complete Guide

### Overview
Hooks let you use state and other React features in function components. They must be called at the **top level** of your component (not inside loops, conditions, or nested functions).

---

## 1. useState - State Management

### What it does:
Adds state to function components. When state changes, the component re-renders with the new value.

### Syntax:
```jsx
const [state, setState] = useState(initialValue);
```

### Parameters:
- `initialValue` - The initial state value (can be any type: string, number, object, array, etc.)

### Returns:
- `state` - Current state value
- `setState` - Function to update the state

### Why use it:
To manage data that changes over time and affects what the user sees (form inputs, toggle buttons, counters, etc.)

### Where to use it:
Any component that needs to track changing data that should trigger a re-render.

### Examples:

#### Basic counter:
```jsx
function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <button onClick={() => setCount(count - 1)}>Decrement</button>
            <button onClick={() => setCount(0)}>Reset</button>
        </div>
    );
}
```

#### Form input:
```jsx
function NameForm() {
    const [name, setName] = useState('');
    
    return (
        <div>
            <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
            />
            <p>Hello, {name}!</p>
        </div>
    );
}
```

#### Object state:
```jsx
function UserProfile() {
    const [user, setUser] = useState({ name: '', age: 0 });
    
    const updateName = (name) => {
        setUser({ ...user, name });  // Spread to keep other properties
    };
    
    return (
        <input 
            value={user.name}
            onChange={(e) => updateName(e.target.value)}
        />
    );
}
```

#### Functional updates (when new state depends on old state):
```jsx
function Counter() {
    const [count, setCount] = useState(0);
    
    // ✅ GOOD - Use functional update
    const increment = () => setCount(prevCount => prevCount + 1);
    
    // ❌ AVOID - Can be stale in async operations
    const incrementBad = () => setCount(count + 1);
    
    return <button onClick={increment}>Count: {count}</button>;
}
```

### Important notes:
- ⚠️ **Never mutate state directly** - Always use the setter function
- ⚠️ **State updates are asynchronous** - Don't rely on the new value immediately after calling setState
- ✅ **For objects/arrays, create new copies** - Use spread operator or array methods that return new arrays

### Function Initializer (Lazy Initialization):
Use a function when initial value requires expensive computation.

```jsx
// ❌ BAD - expensiveCalc() runs on EVERY render (wasted work)
const [data, setData] = useState(expensiveCalc());

// ✅ GOOD - function runs ONLY on first render
const [data, setData] = useState(() => expensiveCalc());
```

**Why it matters:**
- Without function: Code executes every render, React ignores result after first
- With function: React only calls function on mount, skips on re-renders

**When to use:**
```jsx
// ✅ Use function for expensive operations
useState(() => localStorage.getItem('key'))
useState(() => heavyCalculation())
useState(() => props.items.filter(...))
useState(() => JSON.parse(data))

// ❌ Not needed for simple values
useState(0)
useState('')
useState([])
```

**Example - localStorage:**
```jsx
// Reads localStorage on every render (wasteful)
const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

// Reads localStorage only once (efficient)
const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
```

---

## 2. useEffect - Side Effects

### What it does:
Performs side effects after render (data fetching, subscriptions, timers, manual DOM manipulation, etc.)

### Syntax:
```jsx
useEffect(() => {
    // Effect code runs after render
    
    return () => {
        // Optional cleanup function
    };
}, [dependencies]);
```

### Parameters:
- **Effect function** - Runs after the component renders
- **Dependencies array** - Controls when the effect runs
  - `[]` - Run once on mount
  - `[dep1, dep2]` - Run when dep1 or dep2 changes
  - No array - Run after every render

### Returns:
Nothing (cleanup function is returned from inside the effect)

### Why use it:
To perform operations that aren't pure rendering logic (API calls, event listeners, timers, logging, etc.)

### Where to use it:
- Fetching data when component mounts
- Setting up subscriptions or event listeners
- Updating the document title
- Starting/stopping timers
- Logging or analytics

### Examples:

#### Run once on mount:
```jsx
function DataLoader() {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        fetch('/api/data')
            .then(res => res.json())
            .then(data => setData(data));
    }, []);  // Empty array = run once
    
    return <div>{data ? data.title : 'Loading...'}</div>;
}
```

#### Run when dependency changes:
```jsx
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        fetch(`/api/users/${userId}`)
            .then(res => res.json())
            .then(data => setUser(data));
    }, [userId]);  // Re-fetch when userId changes
    
    return <div>{user?.name}</div>;
}
```

#### With cleanup (timer):
```jsx
function Timer() {
    const [seconds, setSeconds] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(s => s + 1);
        }, 1000);
        
        // Cleanup: stop timer when component unmounts
        return () => clearInterval(interval);
    }, []);
    
    return <div>Seconds: {seconds}</div>;
}
```

#### With cleanup (event listener):
```jsx
function MouseTracker() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    
    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        
        // Cleanup: remove listener when component unmounts
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);
    
    return <div>Mouse: {position.x}, {position.y}</div>;
}
```

#### Update document title:
```jsx
function PageTitle({ title }) {
    useEffect(() => {
        document.title = title;
    }, [title]);  // Update when title changes
    
    return <h1>{title}</h1>;
}
```

### Important notes:
- ⚠️ **Always clean up side effects** - Return cleanup function to prevent memory leaks
- ⚠️ **Be careful with dependencies** - Missing deps can cause stale closures, too many can cause infinite loops
- ✅ **Don't forget the dependency array** - Omitting it runs the effect after every render
- ⚠️ **Effects run after render** - Don't rely on effects for rendering logic

---

## 3. useRef - References & Mutable Values

### What it does:
Creates a mutable reference that persists across renders without triggering re-renders when changed.

### Syntax:
```jsx
const ref = useRef(initialValue);
```

### Parameters:
- `initialValue` - Initial value of `ref.current`

### Returns:
- A ref object: `{ current: initialValue }`

### Why use it:
- Access DOM elements directly
- Store mutable values that don't need to trigger re-renders
- Keep references to timers, previous values, or any mutable data

### Where to use it:
- Focus management (auto-focus inputs)
- Measuring element dimensions
- Storing interval/timeout IDs
- Tracking previous state values
- Imperative animations

### Examples:

#### Access DOM element:
```jsx
function FocusInput() {
    const inputRef = useRef(null);
    
    const handleFocus = () => {
        inputRef.current.focus();
    };
    
    return (
        <div>
            <input ref={inputRef} />
            <button onClick={handleFocus}>Focus Input</button>
        </div>
    );
}
```

#### Store timer ID:
```jsx
function Stopwatch() {
    const [time, setTime] = useState(0);
    const intervalRef = useRef(null);
    
    const start = () => {
        intervalRef.current = setInterval(() => {
            setTime(t => t + 1);
        }, 1000);
    };
    
    const stop = () => {
        clearInterval(intervalRef.current);
    };
    
    return (
        <div>
            <p>Time: {time}s</p>
            <button onClick={start}>Start</button>
            <button onClick={stop}>Stop</button>
        </div>
    );
}
```

#### Track previous value:
```jsx
function Counter() {
    const [count, setCount] = useState(0);
    const prevCountRef = useRef();
    
    useEffect(() => {
        prevCountRef.current = count;
    });
    
    return (
        <div>
            <p>Current: {count}</p>
            <p>Previous: {prevCountRef.current}</p>
            <button onClick={() => setCount(count + 1)}>+</button>
        </div>
    );
}
```

### Important notes:
- ⚠️ **Changing ref.current doesn't trigger re-renders** - Use useState if you need that
- ⚠️ **Don't read/write refs during rendering** - Do it in effects or event handlers
- ✅ **Same object across renders** - React gives you the same ref object every time
- ✅ **Perfect for DOM manipulation** - Direct access to DOM elements

---

## 4. useContext - Context API

### What it does:
Reads and subscribes to a context value. Allows you to pass data through the component tree without prop drilling.

### Syntax:
```jsx
const value = useContext(MyContext);
```

### Parameters:
- `MyContext` - The context object created with `React.createContext()`

### Returns:
- The current context value

### Why use it:
To avoid passing props through many levels (prop drilling). Useful for global data like themes, user authentication, language preferences.

### Where to use it:
- Theme switching (dark/light mode)
- User authentication state
- Language/localization
- Global settings or configuration

### Example:

```jsx
// 1. Create context
const ThemeContext = React.createContext('light');

// 2. Provide context at top level
function App() {
    const [theme, setTheme] = useState('light');
    
    return (
        <ThemeContext.Provider value={theme}>
            <Toolbar />
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                Toggle Theme
            </button>
        </ThemeContext.Provider>
    );
}

// 3. Consume context in nested component
function Toolbar() {
    return <ThemedButton />;
}

function ThemedButton() {
    const theme = useContext(ThemeContext);  // No prop drilling!
    
    return (
        <button style={{ background: theme === 'light' ? '#fff' : '#333' }}>
            I'm {theme} themed
        </button>
    );
}
```

### Complex example with user authentication:
```jsx
const UserContext = React.createContext(null);

function App() {
    const [user, setUser] = useState(null);
    
    const login = (username) => setUser({ username });
    const logout = () => setUser(null);
    
    return (
        <UserContext.Provider value={{ user, login, logout }}>
            <Header />
            <Dashboard />
        </UserContext.Provider>
    );
}

function Header() {
    const { user, logout } = useContext(UserContext);
    
    return (
        <header>
            {user ? (
                <>
                    <span>Welcome, {user.username}</span>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <span>Not logged in</span>
            )}
        </header>
    );
}
```

### Important notes:
- ⚠️ **Component re-renders when context value changes** - All consumers re-render
- ✅ **Use for truly global data** - Don't overuse; prop drilling isn't always bad
- ⚠️ **Provider value should be memoized** - Wrap in useMemo to prevent unnecessary re-renders

---

## 5. useMemo - Performance Optimization

### What it does:
Memoizes (caches) the result of an expensive calculation. Only recalculates when dependencies change.

### Syntax:
```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

### Parameters:
- **Calculate function** - Returns the value to memoize
- **Dependencies** - Recalculate when these change

### Returns:
- The memoized value

### Why use it:
To optimize performance by avoiding expensive calculations on every render.

### Where to use it:
- Heavy computations (filtering large lists, complex calculations)
- Creating objects/arrays that are passed as props (to prevent child re-renders)
- Derived state calculations

### Examples:

#### Expensive calculation:
```jsx
function FilteredList({ items, searchText }) {
    // Without useMemo, this filters on EVERY render (even unrelated state changes)
    const filteredItems = useMemo(() => {
        console.log('Filtering...');
        return items.filter(item => 
            item.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [items, searchText]);  // Only re-filter when items or searchText changes
    
    return (
        <ul>
            {filteredItems.map(item => <li key={item.id}>{item.name}</li>)}
        </ul>
    );
}
```

#### Prevent object recreation:
```jsx
function Parent() {
    const [count, setCount] = useState(0);
    
    // ❌ BAD - New object on every render, Child re-renders unnecessarily
    const config = { color: 'blue', size: 'large' };
    
    // ✅ GOOD - Same object reference unless dependencies change
    const config = useMemo(() => ({ 
        color: 'blue', 
        size: 'large' 
    }), []);
    
    return (
        <div>
            <Child config={config} />
            <button onClick={() => setCount(count + 1)}>Count: {count}</button>
        </div>
    );
}
```

### Important notes:
- ⚠️ **Don't overuse** - Only for expensive calculations or preventing re-renders
- ⚠️ **Has a cost** - Memoization itself has overhead, don't use for cheap operations
- ✅ **Measure first** - Profile before optimizing

---

## 6. useCallback - Memoize Functions

### What it does:
Memoizes (caches) a function definition. Returns the same function reference unless dependencies change.

### Syntax:
```jsx
const memoizedCallback = useCallback(() => {
    doSomething(a, b);
}, [a, b]);
```

### Parameters:
- **Callback function** - The function to memoize
- **Dependencies** - Create new function when these change

### Returns:
- The memoized function

### Why use it:
To prevent child components from re-rendering when they receive function props (if child is wrapped in React.memo).

### Where to use it:
- Passing callbacks to optimized child components
- Dependencies in useEffect that are functions
- Event handlers passed to many children

### Example:

```jsx
function Parent() {
    const [count, setCount] = useState(0);
    const [otherState, setOtherState] = useState(0);
    
    // ❌ BAD - New function on every render
    const handleClick = () => {
        console.log('Clicked', count);
    };
    
    // ✅ GOOD - Same function reference unless count changes
    const handleClick = useCallback(() => {
        console.log('Clicked', count);
    }, [count]);
    
    return (
        <div>
            <Child onClick={handleClick} />
            <button onClick={() => setOtherState(otherState + 1)}>
                Other: {otherState}
            </button>
        </div>
    );
}

const Child = React.memo(({ onClick }) => {
    console.log('Child rendered');
    return <button onClick={onClick}>Click me</button>;
});
```

### Important notes:
- ⚠️ **Only useful with React.memo** - Without memoized children, no benefit
- ⚠️ **Similar to useMemo** - `useCallback(fn, deps)` is like `useMemo(() => fn, deps)`
- ✅ **Use for event handlers passed to children** - Prevents unnecessary re-renders

---

## 7. use() - Read Resources in Render

### What it does:
Reads the value of a **Promise** or **Context** during render. Works like `await` for promises.

### Syntax:
```jsx
// With Promise
const data = use(promiseOrResource);

// With Context
const theme = use(ThemeContext);
```

### Key Features:
- ✅ Can be called **conditionally** (unlike other hooks)
- ✅ Can be called in **loops** and **if statements**
- ✅ Suspends component until Promise resolves
- ✅ Alternative to `useContext` for reading context

### Returns:
- Resolved value of the Promise
- Or value from Context

---

### Example 1: Fetching Data with Promises

```jsx
import { use, Suspense } from 'react';

// Create a promise (typically from API)
function fetchUser(userId) {
  return fetch(`/api/users/${userId}`).then(res => res.json());
}

function UserProfile({ userPromise }) {
  // use() suspends until promise resolves
  const user = use(userPromise);
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

function App() {
  const userPromise = fetchUser(1);
  
  return (
    <Suspense fallback={<p>Loading user...</p>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}
```

---

### Example 2: Conditional Data Fetching

```jsx
function Comments({ showComments, commentPromise }) {
  // ✅ Can use conditionally (unlike useEffect)
  if (!showComments) {
    return null;
  }
  
  // use() only called when showComments is true
  const comments = use(commentPromise);
  
  return (
    <ul>
      {comments.map(comment => (
        <li key={comment.id}>{comment.text}</li>
      ))}
    </ul>
  );
}

function Post() {
  const [showComments, setShowComments] = useState(false);
  const commentPromise = showComments ? fetchComments(postId) : null;
  
  return (
    <div>
      <button onClick={() => setShowComments(!showComments)}>
        Toggle Comments
      </button>
      {showComments && (
        <Suspense fallback={<p>Loading comments...</p>}>
          <Comments showComments={showComments} commentPromise={commentPromise} />
        </Suspense>
      )}
    </div>
  );
}
```

---

### Example 3: Reading Context (Alternative to useContext)

```jsx
import { use, createContext } from 'react';

const ThemeContext = createContext('light');

function Button() {
  // ✅ Using use() instead of useContext
  const theme = use(ThemeContext);
  
  return (
    <button className={theme === 'dark' ? 'btn-dark' : 'btn-light'}>
      Click me
    </button>
  );
}

// Can also use conditionally
function ConditionalTheme({ useTheme }) {
  if (!useTheme) {
    return <button>Default button</button>;
  }
  
  // ✅ use() called conditionally
  const theme = use(ThemeContext);
  return <button className={theme}>Themed button</button>;
}
```

---

### Example 4: Multiple Promises in Parallel

```jsx
function Dashboard({ userPromise, statsPromise }) {
  // Both promises fetched in parallel
  const user = use(userPromise);
  const stats = use(statsPromise);
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Posts: {stats.posts}</p>
      <p>Followers: {stats.followers}</p>
    </div>
  );
}

function App() {
  // Start both fetches immediately
  const userPromise = fetchUser(1);
  const statsPromise = fetchStats(1);
  
  return (
    <Suspense fallback={<p>Loading dashboard...</p>}>
      <Dashboard 
        userPromise={userPromise} 
        statsPromise={statsPromise} 
      />
    </Suspense>
  );
}
```

---

### Example 5: Loop Through Promises

```jsx
function ProductList({ productPromises }) {
  return (
    <div>
      {productPromises.map((promise, index) => (
        <Suspense key={index} fallback={<p>Loading product...</p>}>
          <Product productPromise={promise} />
        </Suspense>
      ))}
    </div>
  );
}

function Product({ productPromise }) {
  // ✅ use() called in a loop (via map)
  const product = use(productPromise);
  
  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
}
```

---

### Important Differences from Other Hooks

| Feature | use() | Other Hooks |
|---------|-------|-------------|
| Conditional calls | ✅ Allowed | ❌ Not allowed |
| Inside loops | ✅ Allowed | ❌ Not allowed |
| Inside if statements | ✅ Allowed | ❌ Not allowed |
| Suspends render | ✅ Yes (for Promises) | ❌ No |
| Requires Suspense | ✅ Yes (for Promises) | ❌ No |

```jsx
// ❌ Regular hooks - NOT allowed
function MyComponent({ showData }) {
  if (showData) {
    const data = useState(0);  // ❌ ERROR: Conditional hook
  }
}

// ✅ use() - Allowed
function MyComponent({ showData, dataPromise }) {
  if (showData) {
    const data = use(dataPromise);  // ✅ OK: Conditional use()
  }
}
```

---

### Handling Errors

```jsx
import { use, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function UserProfile({ userPromise }) {
  // If promise rejects, ErrorBoundary catches it
  const user = use(userPromise);
  
  return <h1>{user.name}</h1>;
}

function App() {
  const userPromise = fetchUser(1);
  
  return (
    <ErrorBoundary fallback={<p>Failed to load user</p>}>
      <Suspense fallback={<p>Loading...</p>}>
        <UserProfile userPromise={userPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}
```

---

### Caching Promises (Important!)

```jsx
// ❌ BAD: New promise on every render
function App() {
  // Creates new promise each render!
  const userPromise = fetchUser(1);  // ❌
  
  return <UserProfile userPromise={userPromise} />;
}

// ✅ GOOD: Cache the promise
import { cache } from 'react';

const fetchUser = cache((userId) => {
  return fetch(`/api/users/${userId}`).then(res => res.json());
});

function App() {
  // Same promise returned from cache
  const userPromise = fetchUser(1);  // ✅
  
  return <UserProfile userPromise={userPromise} />;
}
```

---

### When to Use use()

#### ✅ Use use() when:
- Reading data from promises in components
- Need conditional data fetching
- Want to read context conditionally
- Working with Server Components (Next.js 13+)
- Need parallel data fetching with Suspense

#### ❌ Don't use use() when:
- You need to trigger fetch on user action (use useEffect + useState)
- You need to handle loading state manually (use useState)
- Promise doesn't need Suspense (use regular .then())

---

### use() vs useEffect for Fetching

```jsx
// ❌ Old way: useEffect + useState
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    fetchUser(userId)
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);
  
  if (loading) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}

// ✅ New way: use() + Suspense
function UserProfile({ userPromise }) {
  const user = use(userPromise);  // Suspends automatically
  return <h1>{user.name}</h1>;
}

function App() {
  const userPromise = fetchUser(1);
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}
```

---

### Quick Reference

```jsx
// 1. Basic Promise usage
const data = use(promise);

// 2. Conditional
if (condition) {
  const data = use(promise);
}

// 3. Context (alternative to useContext)
const value = use(MyContext);

// 4. Multiple promises
const user = use(userPromise);
const posts = use(postsPromise);

// 5. Loop
items.map(promise => {
  const item = use(promise);
  return <Item data={item} />;
});
```

### Key Takeaways:
- 🎯 **Reads promises and context** during render
- 🔄 **Suspends component** until promise resolves
- ✅ **Can be conditional** (unlike other hooks)
- 🚀 **Works with Suspense** for loading states
- ⚠️ **Cache promises** to avoid re-fetching

---

## 8. useReducer - Complex State Logic

### What it does:
Alternative to useState for complex state logic. Similar to Redux reducers.

### Syntax:
```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

### Parameters:
- **Reducer function** - `(state, action) => newState`
- **Initial state** - Starting state value

### Returns:
- `state` - Current state
- `dispatch` - Function to send actions to the reducer

### Why use it:
When state logic is complex, involves multiple sub-values, or next state depends on previous state.

### Where to use it:
- Complex state with multiple fields
- State transitions that depend on previous state
- When you want to separate state logic from component

### Example:

```jsx
function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return { count: state.count + 1 };
        case 'decrement':
            return { count: state.count - 1 };
        case 'reset':
            return { count: 0 };
        default:
            return state;
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, { count: 0 });
    
    return (
        <div>
            <p>Count: {state.count}</p>
            <button onClick={() => dispatch({ type: 'increment' })}>+</button>
            <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
            <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
        </div>
    );
}
```

### Complex example (form):
```jsx
function formReducer(state, action) {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'RESET':
            return { name: '', email: '', age: 0 };
        default:
            return state;
    }
}

function Form() {
    const [state, dispatch] = useReducer(formReducer, {
        name: '',
        email: '',
        age: 0
    });
    
    const setField = (field, value) => {
        dispatch({ type: 'SET_FIELD', field, value });
    };
    
    return (
        <form>
            <input 
                value={state.name}
                onChange={(e) => setField('name', e.target.value)}
            />
            <input 
                value={state.email}
                onChange={(e) => setField('email', e.target.value)}
            />
            <button type="button" onClick={() => dispatch({ type: 'RESET' })}>
                Reset
            </button>
        </form>
    );
}
```

### Important notes:
- ✅ **Better than multiple useState** - When state is related or complex
- ✅ **Predictable state updates** - All logic in one place
- ⚠️ **More boilerplate** - Use useState for simple cases

---

## 🎯 Quick Decision Guide: Which Hook to Use?

| Scenario | Hook |
|----------|------|
| Track changing data that affects UI | `useState` |
| Fetch data when component mounts | `useEffect` |
| Access/manipulate DOM element | `useRef` |
| Avoid prop drilling | `useContext` |
| Expensive calculation | `useMemo` |
| Pass function to child component | `useCallback` |
| Complex state with many updates | `useReducer` |
| Store value without re-rendering | `useRef` |
| Run code after render | `useEffect` |
| Previous value tracking | `useRef` + `useEffect` |

---

## ⚠️ Rules of Hooks

1. **Only call hooks at the top level** - Don't call inside loops, conditions, or nested functions
2. **Only call hooks from React functions** - Function components or custom hooks
3. **Always include all dependencies** - In useEffect, useMemo, useCallback dependency arrays

```jsx
// ❌ BAD - Conditional hook
if (condition) {
    const [state, setState] = useState(0);  // ERROR!
}

// ✅ GOOD - Hook at top level
const [state, setState] = useState(0);
if (condition) {
    // Use state here
}
```

---

## useRef Hook

### What is useRef?
`useRef` is a React Hook that lets you reference a value that **doesn't trigger re-renders** when it changes. It returns a mutable object with a `.current` property.

### Syntax:
```jsx
const myRef = React.useRef(initialValue);
```

### Two main uses:

#### 1. **Accessing DOM elements directly**
```jsx
function MyComponent() {
    const inputRef = React.useRef(null);
    
    const focusInput = () => {
        inputRef.current.focus();  // Access the actual DOM element
    };
    
    return (
        <>
            <input ref={inputRef} type="text" />
            <button onClick={focusInput}>Focus Input</button>
        </>
    );
}
```

#### 2. **Storing mutable values that persist between renders (without causing re-renders)**
```jsx
function Timer() {
    const [count, setCount] = React.useState(0);
    const intervalRef = React.useRef(null);
    
    const startTimer = () => {
        intervalRef.current = setInterval(() => {
            setCount(c => c + 1);
        }, 1000);
    };
    
    const stopTimer = () => {
        clearInterval(intervalRef.current);
    };
    
    return (
        <div>
            Count: {count}
            <button onClick={startTimer}>Start</button>
            <button onClick={stopTimer}>Stop</button>
        </div>
    );
}
```

### Key differences: useRef vs useState

| Feature | useState | useRef |
|---------|----------|--------|
| Triggers re-render when changed | ✅ Yes | ❌ No |
| Persists between renders | ✅ Yes | ✅ Yes |
| Value accessible as | `value` | `ref.current` |
| Use for | UI state | DOM refs, timers, previous values |

### Common use cases:
1. **Focus management** - Focus inputs, scroll to elements
2. **Storing interval/timeout IDs** - So you can clear them later
3. **Storing previous values** - Compare current vs previous state
4. **Accessing DOM measurements** - Get element width, height, etc.
5. **Keeping mutable values** - Values that change but shouldn't trigger re-renders

### Examples:

#### Auto-focus input on mount:
```jsx
function SearchBox() {
    const inputRef = React.useRef(null);
    
    React.useEffect(() => {
        inputRef.current.focus();  // Auto-focus when component mounts
    }, []);
    
    return <input ref={inputRef} placeholder="Search..." />;
}
```

#### Track previous state value:
```jsx
function Counter() {
    const [count, setCount] = React.useState(0);
    const prevCountRef = React.useRef();
    
    React.useEffect(() => {
        prevCountRef.current = count;  // Store previous value after each render
    });
    
    return (
        <div>
            <p>Current: {count}</p>
            <p>Previous: {prevCountRef.current}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}
```

#### Scroll to element:
```jsx
function ScrollExample() {
    const bottomRef = React.useRef(null);
    
    const scrollToBottom = () => {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    };
    
    return (
        <div>
            <button onClick={scrollToBottom}>Scroll to bottom</button>
            <div style={{height: '200vh'}}>Long content...</div>
            <div ref={bottomRef}>Bottom of page</div>
        </div>
    );
}
```

### Important notes:
- ⚠️ **Changing `ref.current` doesn't trigger re-renders** - Don't use it for values that affect the UI
- ⚠️ **Don't read/write refs during rendering** - Do it in event handlers or useEffect
- ✅ **Refs persist across renders** - Same object every time
- ✅ **Initial value only used on first render** - Changes to initialValue in subsequent renders are ignored

---

## Other React Concepts Covered

### JSX
- **JSX** = JavaScript XML syntax extension
- Looks like HTML but it's JavaScript
- `<button>Click</button>` gets transpiled to `React.createElement('button', null, 'Click')`
- Use `{}` to embed JavaScript expressions
- Must return a single root element (or use fragments `<>...</>`)

### Props
- **Props** = data passed from parent to child component
- `props` is just a parameter name (convention, not a keyword)
- Can be any name: `props`, `p`, `data`, etc.
- Destructuring is common: `function MyComponent({ name, age }) { ... }`
- Props are **read-only** (immutable)

### map() in React
- Used to render lists of data
- Transforms array of data → array of JSX elements
- React automatically renders arrays of JSX
- **Always add `key` prop** for list items: `key={item.id}`
- Example: `{users.map(user => <UserCard key={user.id} {...user} />)}`

### Components
- **Function components** are just JavaScript functions that return JSX
- Can be called as `{ChatbotInput()}` or rendered as `<ChatbotInput />`
- Use JSX syntax `<Component />` (preferred) for proper React behavior
- Components must start with capital letter

### useState
- Hook for managing state that triggers re-renders
- `const [value, setValue] = React.useState(initialValue)`
- Calling `setValue` causes component to re-render
- State persists between renders

### useEffect
- Hook for side effects (timers, subscriptions, API calls)
- Runs after render
- `React.useEffect(() => { /* effect */ }, [dependencies])`
- Return a cleanup function to clean up side effects
- Empty dependency array `[]` = run once on mount

### Lifting State Up
- Move state to common parent when multiple children need to share it
- Parent passes state down via props
- Parent passes updater functions down so children can modify state
- **Single source of truth** principle
- Data flows down, events flow up

### Fragments
- `<>...</>` or `<React.Fragment>...</React.Fragment>`
- Group multiple elements without adding extra DOM nodes
- Useful when component must return multiple elements

---

## Quick Reference

### React Hooks Summary
```jsx
// State that triggers re-renders
const [state, setState] = React.useState(initialValue);

// Side effects
React.useEffect(() => {
    // effect code
    return () => { /* cleanup */ };
}, [dependencies]);

// DOM refs or persistent values (no re-render)
const ref = React.useRef(initialValue);
```

### Component Patterns
```jsx
// Basic component
function MyComponent(props) {
    return <div>{props.message}</div>;
}

// With destructured props
function MyComponent({ message, count }) {
    return <div>{message}: {count}</div>;
}

// With state
function MyComponent() {
    const [count, setCount] = React.useState(0);
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>+</button>
        </div>
    );
}
```

---

## � Context API - Deep Dive

### What is Context API?

Built-in React feature for **sharing data across components** without passing props through every level (prop drilling).

### The Problem: Prop Drilling

```jsx
// ❌ Passing props through many levels
function App() {
  const [user, setUser] = useState({ name: 'Alice' });
  return <Dashboard user={user} setUser={setUser} />;
}

function Dashboard({ user, setUser }) {
  return <Sidebar user={user} setUser={setUser} />;  // Just passing through
}

function Sidebar({ user, setUser }) {
  return <Profile user={user} setUser={setUser} />;  // Just passing through
}

function Profile({ user, setUser }) {
  return <div>{user.name}</div>;  // Finally used here!
}
```

**Problem:** Props passed through components that don't need them.

### The Solution: Context API

```jsx
// ✅ Using Context - no prop drilling
const UserContext = React.createContext();

function App() {
  const [user, setUser] = useState({ name: 'Alice' });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Dashboard />
    </UserContext.Provider>
  );
}

function Dashboard() {
  return <Sidebar />;  // No props!
}

function Sidebar() {
  return <Profile />;  // No props!
}

function Profile() {
  const { user } = useContext(UserContext);  // Direct access!
  return <div>{user.name}</div>;
}
```

---

### Three Steps to Use Context

#### 1. Create Context
```jsx
import { createContext } from 'react';

// With default value
const ThemeContext = createContext('light');

// Without default (use null)
const UserContext = createContext(null);
```

#### 2. Provide Context (wrap components)
```jsx
function App() {
  const [theme, setTheme] = useState('dark');
  
  return (
    <ThemeContext.Provider value={theme}>
      {/* All children can access theme */}
      <Header />
      <Main />
      <Footer />
    </ThemeContext.Provider>
  );
}
```

#### 3. Consume Context (use in components)
```jsx
import { useContext } from 'react';

function Header() {
  const theme = useContext(ThemeContext);
  return <header className={theme}>Header</header>;
}
```

---

### Complete Example: Theme Switcher

```jsx
import { createContext, useContext, useState } from 'react';

// 1. Create context
const ThemeContext = createContext();

// 2. Create provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Custom hook for convenience
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// 4. App with provider
function App() {
  return (
    <ThemeProvider>
      <Page />
    </ThemeProvider>
  );
}

// 5. Components consuming context
function Page() {
  return (
    <div>
      <Header />
      <Content />
    </div>
  );
}

function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header style={{ background: theme === 'light' ? '#fff' : '#333' }}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  );
}

function Content() {
  const { theme } = useTheme();
  return <div className={theme}>Content here</div>;
}
```

---

### Authentication Example

```jsx
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in (e.g., from localStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);
  
  const login = async (username, password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

// Usage
function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}

function Dashboard() {
  const { user, logout, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, 'password');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={e => setUsername(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

### Multiple Contexts

```jsx
const ThemeContext = createContext();
const UserContext = createContext();
const LanguageContext = createContext();

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <LanguageProvider>
          <Dashboard />
        </LanguageProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

// Consume multiple contexts
function Dashboard() {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const { lang } = useContext(LanguageContext);
  
  return <div>...</div>;
}
```

---

### Performance: Avoiding Unnecessary Re-renders

#### Problem: Object value causes re-renders
```jsx
// ❌ BAD - New object on every render
function App() {
  const [count, setCount] = useState(0);
  
  return (
    <MyContext.Provider value={{ count, setCount }}>
      {/* All consumers re-render when App re-renders! */}
      <Child />
    </MyContext.Provider>
  );
}
```

#### Solution: Memoize the value
```jsx
// ✅ GOOD - Memoized value
function App() {
  const [count, setCount] = useState(0);
  
  const value = useMemo(() => ({ count, setCount }), [count]);
  
  return (
    <MyContext.Provider value={value}>
      <Child />
    </MyContext.Provider>
  );
}
```

---

### Context + Reducer Pattern

Combine Context with useReducer for complex state:

```jsx
const TodoContext = createContext();

function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: Date.now(), text: action.text, done: false }];
    case 'TOGGLE':
      return state.map(todo =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    case 'DELETE':
      return state.filter(todo => todo.id !== action.id);
    default:
      return state;
  }
}

function TodoProvider({ children }) {
  const [todos, dispatch] = useReducer(todoReducer, []);
  
  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

function useTodos() {
  return useContext(TodoContext);
}

// Usage
function TodoList() {
  const { todos, dispatch } = useTodos();
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => dispatch({ type: 'TOGGLE', id: todo.id })}
          />
          {todo.text}
          <button onClick={() => dispatch({ type: 'DELETE', id: todo.id })}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

---

### Best Practices

1. **Create custom hooks** - Wrap useContext for better error handling
   ```jsx
   function useAuth() {
     const context = useContext(AuthContext);
     if (!context) throw new Error('useAuth must be used within AuthProvider');
     return context;
   }
   ```

2. **Split contexts** - Don't put everything in one context
   ```jsx
   // ✅ GOOD - Separate concerns
   <ThemeProvider>
     <AuthProvider>
       <SettingsProvider>
   
   // ❌ BAD - One giant context
   <AppProvider value={{ theme, user, settings, ... }}>
   ```

3. **Keep context focused** - One context per domain/feature

4. **Memoize context values** - Prevent unnecessary re-renders

5. **Use default values** - Provide sensible defaults in createContext

6. **Don't overuse** - Context isn't always better than props
   - Use for truly global data (theme, user, language)
   - Props are fine for 2-3 levels deep

---

### When NOT to Use Context

- ❌ **Frequently changing data** - Context causes all consumers to re-render
- ❌ **Component-specific state** - Use local state instead
- ❌ **Simple prop passing** - 2-3 levels is fine with props
- ❌ **Performance-critical updates** - Consider state management libs (Zustand, Redux)

---

### Context vs Other Solutions

| Solution | Use Case |
|----------|----------|
| **Props** | 1-3 levels deep, simple data |
| **Context** | Global data (theme, auth), avoid prop drilling |
| **Redux/Zustand** | Complex state, many updates, dev tools |
| **React Query** | Server state, caching, async data |
| **URL/Router** | Shareable state, bookmarkable |

---

### Quick Reference

```jsx
// 1. Create
const MyContext = createContext(defaultValue);

// 2. Provide
<MyContext.Provider value={data}>
  <App />
</MyContext.Provider>

// 3. Consume
const data = useContext(MyContext);

// Custom hook pattern
function useMyContext() {
  const context = useContext(MyContext);
  if (!context) throw new Error('Must be used within Provider');
  return context;
}
```

---

## �🚀 Vite - Modern Build Tool & Dev Server

### What is Vite?

**Vite** (French word for "quick", pronounced `/vit/`) is a **modern build tool and development server** for web projects. Created by Evan You (creator of Vue.js), it's extremely fast and works great with React, Vue, and vanilla JavaScript.

### Why Vite Exists - The Problem It Solves

#### Traditional bundlers (Webpack, Parcel):
- ❌ **Slow cold starts** - Must bundle entire app before dev server starts
- ❌ **Slow HMR (Hot Module Replacement)** - Updates take time as app grows
- ❌ **Complex configuration** - Lots of setup needed

#### Vite's approach:
- ✅ **Instant server start** - No bundling in dev mode, uses native ES modules
- ✅ **Lightning fast HMR** - Updates are instant regardless of app size
- ✅ **Minimal config** - Works out of the box
- ✅ **Production optimized** - Uses Rollup to bundle for production

### How Vite Works

#### Development Mode:
```
Traditional bundler:          Vite:
Entry → Bundle → Server      Entry → Server (no bundling!)
(takes minutes)              (takes seconds)

Browser requests file →       Browser requests file →
Server sends bundled code     Server transforms & sends on-demand
```

**Key insight:** Modern browsers support ES modules natively, so Vite doesn't need to bundle during development!

#### Production Mode:
Vite uses **Rollup** to create an optimized production bundle with code splitting, tree shaking, and minification.

---

### Vite Dev Server

The **Vite dev server** is a local development server that:

1. **Serves your source files** - Sends files to browser as-is (with transforms)
2. **Handles HMR** - Updates code in browser without full reload
3. **Transforms on-demand** - JSX → JS, TypeScript → JS, CSS modules, etc.
4. **Provides fast refresh** - React state persists during updates

#### Starting Vite dev server:
```bash
npm run dev
# or
npm run vite
```

Default URL: `http://localhost:5173`

---

### Creating a React Project with Vite

#### Method 1: Using npm create vite
```bash
# Create new project
npm create vite@latest my-react-app

# Select options:
# Framework: React
# Variant: JavaScript or TypeScript

# Navigate and install
cd my-react-app
npm install

# Start dev server
npm run dev
```

#### Method 2: With React template directly
```bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
```

---

### Vite Project Structure

```
my-react-app/
├── node_modules/       # Dependencies
├── public/             # Static assets (copied as-is)
│   └── vite.svg
├── src/                # Source code
│   ├── App.jsx         # Main component
│   ├── App.css         # Component styles
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML entry (at root!)
├── package.json        # Dependencies & scripts
├── vite.config.js      # Vite configuration (optional)
└── .gitignore
```

**Key difference from Create React App:** 
- `index.html` is at the **root**, not in `public/`
- `src/main.jsx` is imported directly from `index.html`

---

### Important Files Explained

#### `index.html` (Entry Point)
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

#### `src/main.jsx` (React Entry)
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### `src/App.jsx` (Main Component)
```jsx
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>Vite + React</h1>
      <button onClick={() => setCount(count + 1)}>
        count is {count}
      </button>
    </div>
  )
}

export default App
```

#### `package.json` (Scripts)
```json
{
  "scripts": {
    "dev": "vite",              // Start dev server
    "build": "vite build",      // Build for production
    "preview": "vite preview"   // Preview production build locally
  }
}
```

---

### Vite Commands

```bash
# Development
npm run dev          # Start dev server (port 5173)
npm run dev -- --port 3000  # Use custom port
npm run dev -- --open       # Auto-open browser

# Production
npm run build        # Build for production (creates /dist folder)
npm run preview      # Preview production build locally

# Other
npx vite --help      # See all options
```

---

### Vite Features

#### 1. Hot Module Replacement (HMR)
- **What it is:** Updates code in browser without full page reload
- **React Fast Refresh:** Preserves component state during updates
- **Instant:** Changes appear in milliseconds

```jsx
// Edit this file and save - changes appear instantly!
function App() {
  const [count, setCount] = useState(0);  // State preserved!
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

#### 2. ES Modules Support
```jsx
// Direct imports work instantly
import React from 'react';
import MyComponent from './MyComponent.jsx';
import './styles.css';  // CSS imports work too
```

#### 3. TypeScript Support
- Works out of the box, no config needed
- Just use `.tsx` or `.ts` files

#### 4. CSS Features
```jsx
// Regular CSS
import './App.css';

// CSS Modules (scoped styles)
import styles from './App.module.css';
<div className={styles.container}>...</div>

// Sass/SCSS (after installing)
import './App.scss';
```

#### 5. Environment Variables
```js
// Create .env file
VITE_API_URL=https://api.example.com

// Access in code (must start with VITE_)
console.log(import.meta.env.VITE_API_URL);
```

#### 6. Asset Handling
```jsx
// Images
import logo from './logo.png';
<img src={logo} alt="Logo" />

// JSON
import data from './data.json';
console.log(data);

// Public folder (accessible at /)
<img src="/favicon.ico" />
```

---

### Vite vs Other Tools

| Feature | Vite | Create React App (CRA) | Webpack |
|---------|------|------------------------|---------|
| Dev server startup | ⚡ Instant | 🐌 Slow (30s-2min) | 🐌 Slow |
| HMR speed | ⚡ Instant | 🐌 Slower as app grows | 🐌 Slower |
| Production build | ✅ Fast (Rollup) | ✅ Good | ✅ Good |
| Configuration | ✅ Minimal | ✅ Zero (ejected = complex) | ❌ Complex |
| TypeScript | ✅ Out of box | ✅ Out of box | ⚙️ Config needed |
| Modern | ✅ Yes (2020+) | ⚠️ Maintenance mode | ✅ Yes |

**Recommendation:** Use Vite for new projects!

---

### Vite Configuration (Optional)

#### `vite.config.js`
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // Custom port
  server: {
    port: 3000,
    open: true  // Auto-open browser
  },
  
  // Build options
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  
  // Path aliases
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components'
    }
  }
})
```

Usage with aliases:
```jsx
// Instead of: import Button from '../../../components/Button'
import Button from '@components/Button'
```

---

### Common Vite Workflows

#### 1. Development workflow
```bash
# Start dev server
npm run dev

# Edit files in src/
# Changes appear instantly in browser

# Ctrl+C to stop server
```

#### 2. Production workflow
```bash
# Build for production
npm run build

# Creates /dist folder with optimized files:
# - index.html
# - assets/index-abc123.js (hashed filenames)
# - assets/index-xyz789.css

# Preview production build locally
npm run preview

# Deploy /dist folder to hosting service
# (Netlify, Vercel, GitHub Pages, etc.)
```

#### 3. Adding dependencies
```bash
# Install library
npm install axios

# Use immediately (no restart needed!)
import axios from 'axios';
```

---

### Vite + React Best Practices

1. **Use `.jsx` extension** - For files containing JSX
2. **Import React** - In files using JSX: `import React from 'react'`
3. **Fast Refresh friendly** - Export components as named or default exports
4. **Environment variables** - Prefix with `VITE_` to expose to client
5. **Static assets** - Put in `/public` if you need fixed URLs
6. **Dynamic imports** - Use for code splitting:
   ```jsx
   const LazyComponent = React.lazy(() => import('./LazyComponent'));
   ```

---

### Troubleshooting Vite

#### Port already in use:
```bash
# Use different port
npm run dev -- --port 3000
```

#### Clear cache:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### HMR not working:
- Check browser console for errors
- Restart dev server
- Make sure you're using ES modules syntax (`import`/`export`)

---

### Alternatives to Vite

| Tool | Description | Use Case |
|------|-------------|----------|
| **Vite** | Fast, modern, minimal config | ✅ New projects (recommended) |
| **Create React App** | Official React tool | ⚠️ Maintenance mode, use Vite instead |
| **Next.js** | React framework with SSR | Server-side rendering, full-stack apps |
| **Parcel** | Zero-config bundler | Simple projects, minimal setup |
| **Webpack** | Powerful, flexible | Complex builds, custom needs |
| **Turbopack** | Rust-based (Next.js 13+) | Next.js projects only |

---

### Quick Start Summary

```bash
# Create React + Vite project
npm create vite@latest my-app -- --template react

# Install dependencies
cd my-app
npm install

# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**You're ready to build with Vite! 🚀**

---

## 🪝 Custom Hooks - Reusable Logic

### What are Custom Hooks?

**Custom hooks** are JavaScript functions that use React hooks and allow you to **extract and reuse component logic**. They let you share stateful logic between components without changing component hierarchy.

### Why Custom Hooks?

**Problem:** You have the same logic in multiple components
- Fetching data
- Form handling
- Window dimensions tracking
- localStorage sync
- etc.

**Solution:** Extract logic into a custom hook and reuse it everywhere!

---

### Rules for Custom Hooks

1. **Must start with "use"** - `useSomething()`
2. **Can call other hooks** - useState, useEffect, other custom hooks
3. **Follow all hook rules** - Call at top level, not conditionally
4. **Return anything** - Values, functions, objects, arrays

---

### Basic Example: useToggle

```jsx
// Custom hook
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = () => setValue(prev => !prev);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  
  return [value, toggle, setTrue, setFalse];
}

// Usage in component
function Modal() {
  const [isOpen, toggle, open, close] = useToggle(false);
  
  return (
    <div>
      <button onClick={open}>Open Modal</button>
      {isOpen && (
        <div className="modal">
          <h2>Modal Content</h2>
          <button onClick={close}>Close</button>
        </div>
      )}
    </div>
  );
}
```

---

### Common Custom Hooks

#### 1. useFetch - Data Fetching

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);
  
  return { data, loading, error };
}

// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{user.name}</div>;
}
```

#### 2. useLocalStorage - Sync with localStorage

```jsx
function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use default
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });
  
  // Update localStorage when value changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue];
}

// Usage
function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [user, setUser] = useLocalStorage('user', null);
  
  return (
    <div>
      <p>Theme: {theme}</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  );
}
```

#### 3. useWindowSize - Track window dimensions

```jsx
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

// Usage
function ResponsiveComponent() {
  const { width } = useWindowSize();
  
  return (
    <div>
      {width < 768 ? <MobileView /> : <DesktopView />}
    </div>
  );
}
```

#### 4. useDebounce - Debounce values

```jsx
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage - Search with debounce
function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    if (debouncedSearch) {
      // API call only happens 500ms after user stops typing
      fetch(`/api/search?q=${debouncedSearch}`)
        .then(res => res.json())
        .then(data => console.log(data));
    }
  }, [debouncedSearch]);
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

#### 5. usePrevious - Track previous value

```jsx
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

// Usage
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  
  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

#### 6. useForm - Form handling

```jsx
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (callback) => (e) => {
    e.preventDefault();
    callback(values);
  };
  
  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };
  
  return { values, errors, handleChange, handleSubmit, reset };
}

// Usage
function LoginForm() {
  const { values, handleChange, handleSubmit, reset } = useForm({
    email: '',
    password: ''
  });
  
  const onSubmit = (data) => {
    console.log('Form data:', data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        name="email"
        value={values.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Login</button>
      <button type="button" onClick={reset}>Reset</button>
    </form>
  );
}
```

#### 7. useOnClickOutside - Detect clicks outside element

```jsx
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
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

// Usage - Close dropdown on outside click
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useOnClickOutside(dropdownRef, () => setIsOpen(false));
  
  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && (
        <ul>
          <li>Option 1</li>
          <li>Option 2</li>
        </ul>
      )}
    </div>
  );
}
```

#### 8. useAsync - Handle async operations

```jsx
function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  
  const execute = useCallback(async (...params) => {
    setStatus('pending');
    setValue(null);
    setError(null);
    
    try {
      const response = await asyncFunction(...params);
      setValue(response);
      setStatus('success');
    } catch (error) {
      setError(error);
      setStatus('error');
    }
  }, [asyncFunction]);
  
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  
  return { execute, status, value, error };
}

// Usage
function UserProfile({ userId }) {
  const fetchUser = useCallback(
    () => fetch(`/api/users/${userId}`).then(res => res.json()),
    [userId]
  );
  
  const { status, value: user, error } = useAsync(fetchUser);
  
  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error: {error.message}</div>;
  if (status === 'success') return <div>{user.name}</div>;
  return null;
}
```

---

### Composing Custom Hooks

Custom hooks can use other custom hooks:

```jsx
// useAuthUser combines multiple hooks
function useAuthUser() {
  const [user, setUser] = useLocalStorage('user', null);
  const { data: userData, loading } = useFetch(user ? `/api/users/${user.id}` : null);
  
  const login = (credentials) => {
    // Login logic
    setUser(credentials);
  };
  
  const logout = () => {
    setUser(null);
  };
  
  return { user: userData, loading, login, logout };
}

// Usage
function App() {
  const { user, loading, login, logout } = useAuthUser();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login({ id: 1 })}>Login</button>
      )}
    </div>
  );
}
```

---

### When to Create Custom Hooks

**Create a custom hook when:**
- ✅ Same logic used in multiple components
- ✅ Complex state logic that can be extracted
- ✅ Logic involves multiple hooks (useState + useEffect)
- ✅ Want to test logic independently
- ✅ Improve code readability

**Don't create custom hooks for:**
- ❌ Logic used only once
- ❌ Simple one-liner operations
- ❌ Just to rename existing hooks

---

### Best Practices

1. **Name with "use" prefix** - `useMyHook()`, not `myHook()`
2. **Keep focused** - One responsibility per hook
3. **Return consistent structure** - Array `[value, setter]` or object `{ value, error }`
4. **Document parameters** - Clear what inputs are expected
5. **Handle cleanup** - Return cleanup function from useEffect
6. **Make reusable** - Don't hardcode values, accept parameters

```jsx
// ❌ BAD - Hardcoded, not reusable
function useUser() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch('/api/users/1').then(...);
  }, []);
  return user;
}

// ✅ GOOD - Flexible, reusable
function useUser(userId) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/users/${userId}`).then(...);
  }, [userId]);
  return user;
}
```

---

### Testing Custom Hooks

Use `@testing-library/react-hooks`:

```jsx
import { renderHook, act } from '@testing-library/react-hooks';
import useCounter from './useCounter';

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter());
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

---

### Popular Custom Hook Libraries

- **react-use** - Collection of essential hooks
- **ahooks** - High-quality React hooks
- **usehooks-ts** - TypeScript-ready hooks
- **react-query** - Data fetching hooks
- **swr** - Stale-while-revalidate hooks

---

### Quick Reference

```jsx
// Custom hook structure
function useCustomHook(params) {
  // Use built-in hooks
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects
    return () => {
      // Cleanup
    };
  }, [dependencies]);
  
  // Return values/functions
  return { state, setState };
}

// Usage
const { state, setState } = useCustomHook(params);
```

---

### How Custom Hooks Work - Execution Flow

#### Key Concept: Hooks create state in the calling component

```jsx
function UserProfile() {
  const { data, loading } = useFetch('/api/user');
  // useFetch's useState calls create state IN UserProfile
  // When state changes, UserProfile re-renders
}
```

#### Render Lifecycle

**1. Render Phase (Synchronous - Pure)**
```
UserProfile mounts
  ↓
Calls useFetch()
  ↓
useState() creates state (data=null, loading=true)
  ↓
useEffect() REGISTERED (not executed yet!)
  ↓
Return { data: null, loading: true }
  ↓
UserProfile returns JSX with "Loading..."
  ↓
React builds virtual DOM
```

**2. Commit Phase (After Render)**
```
React updates actual DOM
  ↓
Browser paints "Loading..."
  ↓
✅ NOW useEffect runs
  ↓
fetch() called
  ↓
Response arrives → setData() → triggers re-render
```

#### Re-renders: Hook Functions Run Again

```jsx
// Every render:
const { data, loading } = useFetch('/api/user');  // ← Runs every time

// But inside useFetch:
useState()   // ← Returns EXISTING state (doesn't reset)
useEffect()  // ← Only runs if dependencies changed
```

**Why?**
- Custom hooks are functions that run on every render
- useState remembers state between renders
- useEffect only executes when dependencies change

#### Complete Flow Example

```
Mount → Render 1:
  useFetch() called
  useState creates state: data=null, loading=true
  useEffect registered (fetch not started yet)
  Returns { data: null, loading: true }
  UserProfile renders: "Loading..."

After Render 1:
  useEffect runs → fetch() starts

Fetch completes:
  setData() called → triggers re-render

Render 2:
  useFetch() called AGAIN
  useState returns existing state: data={...}, loading=false
  useEffect checks [url] - unchanged, skipped
  Returns { data: {...}, loading: false }
  UserProfile renders: "John Doe"
```

**Why useEffect waits:**
- Rendering must be pure (no side effects)
- React updates DOM first
- Then runs effects (fetch, timers, subscriptions)
- Prevents infinite loops and ensures consistency

---

## 📘 TypeScript with React - Type Safety

### What is TypeScript?

**TypeScript** is a superset of JavaScript that adds **static typing**. It catches errors at compile-time rather than runtime.

### Why Use TypeScript?

- ✅ **Catch bugs early** - Before code runs
- ✅ **Better autocomplete** - IDE knows what's available
- ✅ **Self-documenting** - Types show what props/functions expect
- ✅ **Refactoring confidence** - Rename things safely
- ✅ **Team collaboration** - Clear contracts between code

---

### Setup with Vite

```bash
# Create TypeScript React project
npm create vite@latest my-app -- --template react-ts

# Or add to existing project
npm install --save-dev typescript @types/react @types/react-dom
```

**File extensions:**
- `.tsx` - TypeScript with JSX
- `.ts` - TypeScript without JSX

---

### Basic Types

```typescript
// Primitives
let age: number = 25;
let name: string = "John";
let isActive: boolean = true;
let data: null = null;
let value: undefined = undefined;

// Arrays
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["Alice", "Bob"];

// Objects
let user: { name: string; age: number } = {
  name: "John",
  age: 30
};

// Any (avoid when possible)
let anything: any = "could be anything";

// Union types
let id: string | number = 123;
id = "abc";  // Also valid

// Literal types
let status: "success" | "error" | "loading" = "success";
```

---

### Component Props

#### Function Components

```tsx
// Basic props
interface ButtonProps {
  text: string;
  onClick: () => void;
}

function Button({ text, onClick }: ButtonProps) {
  return <button onClick={onClick}>{text}</button>;
}

// Usage
<Button text="Click me" onClick={() => console.log('clicked')} />
```

#### Optional Props

```tsx
interface UserCardProps {
  name: string;
  age?: number;  // Optional (can be undefined)
  email?: string;
}

function UserCard({ name, age, email }: UserCardProps) {
  return (
    <div>
      <h2>{name}</h2>
      {age && <p>Age: {age}</p>}
      {email && <p>Email: {email}</p>}
    </div>
  );
}

// Valid usage
<UserCard name="John" />
<UserCard name="Jane" age={25} email="jane@example.com" />
```

#### Default Props

```tsx
interface ButtonProps {
  text: string;
  variant?: "primary" | "secondary";
}

function Button({ text, variant = "primary" }: ButtonProps) {
  return <button className={variant}>{text}</button>;
}
```

#### Children Prop

```tsx
import { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;  // Can be any valid React element
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
}

// Usage
<Card title="My Card">
  <p>Content here</p>
  <button>Click</button>
</Card>
```

---

### useState with TypeScript

```tsx
import { useState } from 'react';

// Type inference (TypeScript guesses the type)
const [count, setCount] = useState(0);  // Type: number
const [name, setName] = useState("John");  // Type: string

// Explicit type annotation
const [age, setAge] = useState<number>(25);

// Union types
const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

// Object state
interface User {
  name: string;
  age: number;
  email: string;
}

const [user, setUser] = useState<User>({
  name: "John",
  age: 30,
  email: "john@example.com"
});

// Nullable state
const [user, setUser] = useState<User | null>(null);
if (user) {
  console.log(user.name);  // TypeScript knows user is not null here
}

// Array state
const [items, setItems] = useState<string[]>([]);
const [users, setUsers] = useState<User[]>([]);
```

---

### Event Handlers

```tsx
import { ChangeEvent, MouseEvent, FormEvent } from 'react';

function Form() {
  // Input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  // Button click
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    console.log('Clicked');
  };

  // Form submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitted');
  };

  // Textarea change
  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
      <textarea onChange={handleTextareaChange} />
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}
```

---

### useRef with TypeScript

```tsx
import { useRef } from 'react';

function MyComponent() {
  // DOM element ref
  const inputRef = useRef<HTMLInputElement>(null);
  
  const focusInput = () => {
    inputRef.current?.focus();  // ? = optional chaining (safe)
  };

  // Mutable value ref
  const countRef = useRef<number>(0);
  
  const increment = () => {
    countRef.current += 1;
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}
```

---

### useEffect with TypeScript

```tsx
import { useEffect } from 'react';

function DataFetcher({ userId }: { userId: number }) {
  useEffect(() => {
    // Async function inside useEffect
    const fetchData = async () => {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      console.log(data);
    };
    
    fetchData();
    
    // Cleanup function (optional)
    return () => {
      console.log('Cleanup');
    };
  }, [userId]);  // Dependencies

  return <div>Fetching...</div>;
}
```

---

### Custom Hooks with TypeScript

```tsx
import { useState, useEffect } from 'react';

// Return type inferred
function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}

// Explicit return type
interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then((data: T) => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);
  
  return { data, loading, error };
}

// Usage with type parameter
interface User {
  id: number;
  name: string;
  email: string;
}

function UserProfile() {
  const { data: user, loading } = useFetch<User>('/api/user');
  
  if (loading) return <div>Loading...</div>;
  return <div>{user?.name}</div>;
}
```

---

### Type vs Interface

Both define object shapes, but with slight differences:

```tsx
// Interface (preferred for React components)
interface User {
  name: string;
  age: number;
}

// Type alias
type User = {
  name: string;
  age: number;
};

// Interface can extend
interface Admin extends User {
  role: string;
}

// Type can use unions
type Status = "idle" | "loading" | "success" | "error";

// Type can use intersections
type AdminUser = User & { role: string };
```

**Recommendation:** Use `interface` for props and object shapes, `type` for unions and primitives.

---

### Generics

Reusable types that work with multiple types:

```tsx
// Generic component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage
interface User {
  id: number;
  name: string;
}

function App() {
  const users: User[] = [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" }
  ];
  
  return (
    <List 
      items={users}
      renderItem={(user) => <span>{user.name}</span>}
    />
  );
}
```

---

### Common React Types

```tsx
import { 
  ReactNode,      // Any valid React child
  ReactElement,   // JSX element
  FC,            // FunctionComponent (older style)
  CSSProperties, // Inline styles
  ComponentProps // Extract props from component
} from 'react';

// ReactNode (most flexible for children)
interface Props {
  children: ReactNode;  // string, number, JSX, array, etc.
}

// ReactElement (only JSX)
interface Props {
  header: ReactElement;  // Must be JSX
}

// CSSProperties (inline styles)
const style: CSSProperties = {
  backgroundColor: 'blue',
  fontSize: 16
};

// Extract props from existing component
type ButtonProps = ComponentProps<'button'>;  // All native button props
```

---

### Typing API Responses

```tsx
// Define response shape
interface User {
  id: number;
  name: string;
  email: string;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Async function with types
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const user: User = await response.json();
  return user;
}

// With error handling
async function fetchUserSafe(id: number): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) return null;
    const user: User = await response.json();
    return user;
  } catch {
    return null;
  }
}
```

---

### Common Patterns

#### Discriminated Unions (State Machines)

```tsx
type State = 
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: string }
  | { status: "error"; error: string };

function DataDisplay({ state }: { state: State }) {
  switch (state.status) {
    case "idle":
      return <div>Not started</div>;
    case "loading":
      return <div>Loading...</div>;
    case "success":
      return <div>Data: {state.data}</div>;  // TypeScript knows data exists
    case "error":
      return <div>Error: {state.error}</div>;  // TypeScript knows error exists
  }
}
```

#### Utility Types

```tsx
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Pick - Select specific properties
type PublicUser = Pick<User, "id" | "name">;
// { id: number; name: string }

// Omit - Exclude specific properties
type UserWithoutPassword = Omit<User, "password">;
// { id: number; name: string; email: string }

// Partial - Make all properties optional
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; password?: string }

// Required - Make all properties required
type RequiredUser = Required<Partial<User>>;

// Readonly - Make all properties readonly
type ReadonlyUser = Readonly<User>;
```

---

### Type Assertions

```tsx
// When you know more than TypeScript
const input = document.getElementById('myInput') as HTMLInputElement;
input.value = "Hello";

// Alternative syntax
const input = <HTMLInputElement>document.getElementById('myInput');

// Non-null assertion (use carefully!)
const value = input!.value;  // Tells TS: "I guarantee this isn't null"
```

---

### Best Practices

1. **Let TypeScript infer when possible**
   ```tsx
   // ✅ GOOD - TypeScript infers type
   const [count, setCount] = useState(0);
   
   // ❌ UNNECESSARY
   const [count, setCount] = useState<number>(0);
   ```

2. **Use interfaces for props**
   ```tsx
   // ✅ GOOD
   interface Props {
     name: string;
   }
   
   function Component({ name }: Props) { }
   ```

3. **Avoid `any` - use `unknown` if unsure**
   ```tsx
   // ❌ BAD
   let data: any;
   
   // ✅ BETTER
   let data: unknown;
   if (typeof data === "string") {
     console.log(data.toUpperCase());  // Must check type first
   }
   ```

4. **Use union types for fixed values**
   ```tsx
   // ✅ GOOD
   type Size = "small" | "medium" | "large";
   
   // ❌ BAD
   type Size = string;  // Too broad
   ```

5. **Export types you reuse**
   ```tsx
   // types.ts
   export interface User {
     id: number;
     name: string;
   }
   
   // Component.tsx
   import { User } from './types';
   ```

---

### Quick Reference

```tsx
// Component props
interface Props {
  text: string;
  count?: number;
  onClick: () => void;
  children: ReactNode;
}

// State
const [user, setUser] = useState<User | null>(null);

// Events
const handleClick = (e: MouseEvent<HTMLButtonElement>) => { };
const handleChange = (e: ChangeEvent<HTMLInputElement>) => { };

// Ref
const ref = useRef<HTMLDivElement>(null);

// Custom hook
function useData<T>(url: string): { data: T | null; loading: boolean } {
  // ...
}
```

---

## 📋 React Hook Form - Performant Form Handling

### What is React Hook Form?

**React Hook Form** is a library for building performant, flexible forms with easy validation. It uses **uncontrolled components** and **refs** to minimize re-renders.

### Why Use React Hook Form?

Traditional form handling in React:
```jsx
// ❌ TRADITIONAL - Re-renders on every keystroke
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
// Every input change triggers re-render
```

React Hook Form:
```jsx
// ✅ REACT HOOK FORM - Minimal re-renders
const { register, handleSubmit } = useForm();
// Form state managed internally, component doesn't re-render on input
```

**Benefits:**
- ✅ **Fewer re-renders** - Better performance
- ✅ **Less code** - No useState for each field
- ✅ **Built-in validation** - Simple and powerful
- ✅ **TypeScript support** - Full type safety
- ✅ **Easy integration** - Works with UI libraries

---

### Installation

```bash
npm install react-hook-form
```

---

### Basic Usage

```jsx
import { useForm } from 'react-hook-form';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data) => {
    console.log(data);  // { email: "...", password: "..." }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input 
        {...register("email")} 
        placeholder="Email"
      />
      
      <input 
        {...register("password")} 
        type="password"
        placeholder="Password"
      />
      
      <button type="submit">Login</button>
    </form>
  );
}
```

**How it works:**
- `register()` connects input to form state
- `handleSubmit()` validates and calls your submit function
- Form state managed via refs (no re-renders)

---

### Validation

#### Built-in Validation

```jsx
function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data) => {
    console.log(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Required field */}
      <input 
        {...register("username", { 
          required: "Username is required" 
        })}
      />
      {errors.username && <p>{errors.username.message}</p>}
      
      {/* Email validation */}
      <input 
        {...register("email", { 
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address"
          }
        })}
      />
      {errors.email && <p>{errors.email.message}</p>}
      
      {/* Min/Max length */}
      <input 
        {...register("password", { 
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters"
          }
        })}
        type="password"
      />
      {errors.password && <p>{errors.password.message}</p>}
      
      {/* Min/Max value (numbers) */}
      <input 
        type="number"
        {...register("age", { 
          required: true,
          min: { value: 18, message: "Must be 18+" },
          max: { value: 120, message: "Invalid age" }
        })}
      />
      {errors.age && <p>{errors.age.message}</p>}
      
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

#### Custom Validation

```jsx
function PasswordForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const password = watch("password");  // Watch password field
  
  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input 
        type="password"
        {...register("password", { required: true })} 
      />
      
      {/* Confirm password - custom validation */}
      <input 
        type="password"
        {...register("confirmPassword", {
          required: "Please confirm password",
          validate: (value) => 
            value === password || "Passwords don't match"
        })}
      />
      {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

### Default Values

```jsx
function EditProfileForm({ user }) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      age: user.age
    }
  });
  
  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register("name")} />
      <input {...register("email")} />
      <input type="number" {...register("age")} />
      <button type="submit">Update</button>
    </form>
  );
}
```

---

### Watching Values

```jsx
function DynamicForm() {
  const { register, watch } = useForm();
  
  // Watch single field
  const watchCountry = watch("country");
  
  // Watch multiple fields
  const watchFields = watch(["firstName", "lastName"]);
  
  // Watch all fields
  const watchAllFields = watch();
  
  return (
    <form>
      <input {...register("country")} />
      
      {/* Show conditional field */}
      {watchCountry === "USA" && (
        <input {...register("state")} placeholder="State" />
      )}
      
      <input {...register("firstName")} />
      <input {...register("lastName")} />
      
      <p>Full name: {watchFields[0]} {watchFields[1]}</p>
    </form>
  );
}
```

---

### Reset Form

```jsx
function ContactForm() {
  const { register, handleSubmit, reset } = useForm();
  
  const onSubmit = async (data) => {
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    // Reset form after successful submit
    reset();
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      <input {...register("email")} />
      <button type="submit">Send</button>
      <button type="button" onClick={() => reset()}>Clear</button>
    </form>
  );
}
```

---

### Set Value Programmatically

```jsx
function FormWithSetValue() {
  const { register, setValue, handleSubmit } = useForm();
  
  const fillDemoData = () => {
    setValue("name", "John Doe");
    setValue("email", "john@example.com");
  };
  
  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register("name")} />
      <input {...register("email")} />
      <button type="button" onClick={fillDemoData}>Fill Demo Data</button>
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

### Form State

```jsx
function FormWithState() {
  const { 
    register, 
    handleSubmit, 
    formState: { 
      errors,       // Validation errors
      isDirty,      // User modified any field
      isValid,      // All fields valid
      isSubmitting, // Submit in progress
      isSubmitted,  // Form was submitted
      touchedFields,// Fields user interacted with
      dirtyFields   // Fields that changed from default
    } 
  } = useForm({ mode: "onChange" });  // Validate on change
  
  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register("email", { required: true })} />
      
      <button 
        type="submit" 
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
      
      {isSubmitted && <p>✅ Form submitted!</p>}
    </form>
  );
}
```

---

### TypeScript Support

```tsx
import { useForm, SubmitHandler } from 'react-hook-form';

interface FormInputs {
  name: string;
  email: string;
  age: number;
}

function TypedForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormInputs>();
  
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log(data);  // Type-safe!
    // data.name is string
    // data.age is number
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name", { required: true })} />
      
      <input 
        type="number"
        {...register("age", { 
          valueAsNumber: true  // Convert to number
        })} 
      />
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

### Controller (for Custom Components)

Use `Controller` for controlled components (like React Select, Material-UI):

```jsx
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';

function FormWithSelect() {
  const { control, handleSubmit } = useForm();
  
  const options = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' }
  ];
  
  return (
    <form onSubmit={handleSubmit(console.log)}>
      <Controller
        name="framework"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select 
            {...field}
            options={options}
          />
        )}
      />
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

### Validation Schema (Yup/Zod)

#### With Yup

```bash
npm install @hookform/resolvers yup
```

```jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  age: yup.number().positive().integer().min(18).required()
}).required();

function FormWithYup() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  
  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register("name")} />
      {errors.name && <p>{errors.name.message}</p>}
      
      <input {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}
      
      <input type="number" {...register("age")} />
      {errors.age && <p>{errors.age.message}</p>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### With Zod

```bash
npm install @hookform/resolvers zod
```

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18+')
});

type FormData = z.infer<typeof schema>;  // TypeScript type from schema

function FormWithZod() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });
  
  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register("name")} />
      {errors.name && <p>{errors.name.message}</p>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

### Array Fields

```jsx
import { useForm, useFieldArray } from 'react-hook-form';

function DynamicFieldsForm() {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      users: [{ name: "", email: "" }]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "users"
  });
  
  return (
    <form onSubmit={handleSubmit(console.log)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input 
            {...register(`users.${index}.name`)} 
            placeholder="Name"
          />
          <input 
            {...register(`users.${index}.email`)} 
            placeholder="Email"
          />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      
      <button 
        type="button" 
        onClick={() => append({ name: "", email: "" })}
      >
        Add User
      </button>
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

### Error Handling

```jsx
function FormWithErrors() {
  const { 
    register, 
    handleSubmit, 
    setError,
    formState: { errors } 
  } = useForm();
  
  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        // Set server error
        setError("email", {
          type: "server",
          message: "Email already exists"
        });
        return;
      }
      
      console.log("Success!");
    } catch (error) {
      // Set root error (general error)
      setError("root", {
        type: "server",
        message: "Something went wrong"
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}
      
      {errors.root && <p className="error">{errors.root.message}</p>}
      
      <button type="submit">Register</button>
    </form>
  );
}
```

---

### Mode Options

```jsx
// Validate on submit (default)
useForm({ mode: "onSubmit" });

// Validate on blur
useForm({ mode: "onBlur" });

// Validate on change (real-time)
useForm({ mode: "onChange" });

// Validate on first blur, then on change
useForm({ mode: "onTouched" });

// Validate everything
useForm({ mode: "all" });
```

---

### Complete Example

```jsx
import { useForm } from 'react-hook-form';

function CompleteForm() {
  const { 
    register, 
    handleSubmit, 
    watch,
    reset,
    formState: { errors, isSubmitting, isValid } 
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      terms: false
    }
  });
  
  const watchTerms = watch("terms");
  
  const onSubmit = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 2000));  // Simulate API
    console.log(data);
    reset();  // Clear form
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input 
          {...register("firstName", { 
            required: "First name is required",
            minLength: { value: 2, message: "Too short" }
          })}
          placeholder="First Name"
        />
        {errors.firstName && <span>{errors.firstName.message}</span>}
      </div>
      
      <div>
        <input 
          {...register("lastName", { required: true })}
          placeholder="Last Name"
        />
        {errors.lastName && <span>Last name is required</span>}
      </div>
      
      <div>
        <input 
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email"
            }
          })}
          placeholder="Email"
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      
      <div>
        <input 
          type="password"
          {...register("password", { 
            required: "Password is required",
            minLength: { value: 8, message: "Min 8 characters" }
          })}
          placeholder="Password"
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>
      
      <div>
        <label>
          <input 
            type="checkbox"
            {...register("terms", { 
              required: "You must accept terms" 
            })}
          />
          I accept terms and conditions
        </label>
        {errors.terms && <span>{errors.terms.message}</span>}
      </div>
      
      <button 
        type="submit" 
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Register"}
      </button>
    </form>
  );
}
```

---

### React Hook Form vs Traditional

| Feature | Traditional | React Hook Form |
|---------|-------------|-----------------|
| **State management** | useState for each field | Internal (refs) |
| **Re-renders** | Every keystroke | Minimal |
| **Code amount** | More verbose | Less code |
| **Validation** | Manual | Built-in |
| **Performance** | Slower (large forms) | Fast |
| **TypeScript** | Manual types | Automatic inference |

---

### Best Practices

1. **Use `mode` wisely**
   - `onSubmit` (default) - Best for simple forms
   - `onChange` - Real-time validation (can be annoying)
   - `onBlur` - Good compromise

2. **Memoize validation**
   ```jsx
   const validateUsername = useCallback((value) => {
     return value.length >= 3 || "Too short";
   }, []);
   
   {...register("username", { validate: validateUsername })}
   ```

3. **Use schema validation for complex forms** (Yup/Zod)

4. **Show errors conditionally**
   ```jsx
   {errors.email && <span>{errors.email.message}</span>}
   ```

5. **Disable submit button during submission**
   ```jsx
   <button disabled={isSubmitting}>Submit</button>
   ```

---

### Quick Reference

```jsx
// Setup
const { 
  register,        // Connect input to form
  handleSubmit,    // Submit handler
  watch,           // Watch field values
  reset,           // Reset form
  setValue,        // Set field value
  setError,        // Set error manually
  formState        // Form state (errors, isDirty, etc.)
} = useForm();

// Register input
<input {...register("fieldName", { 
  required: "Error message",
  minLength: { value: 5, message: "Too short" },
  pattern: { value: /regex/, message: "Invalid" },
  validate: (value) => value !== "admin" || "Reserved"
})} />

// Submit
<form onSubmit={handleSubmit(onSubmit)}>

// Errors
{errors.fieldName && <span>{errors.fieldName.message}</span>}
```

---

## � useMemo vs useCallback - Quick Comparison

### Basic Difference

| Hook | Memoizes | Returns | Use Case |
|------|----------|---------|----------|
| **useMemo** | **Value** (result of computation) | Computed value | Expensive calculations, filtered lists |
| **useCallback** | **Function** (reference) | Same function reference | Pass callbacks to child components |

### Visual Comparison

```jsx
// useMemo - Memoizes the RESULT
const expensiveResult = useMemo(() => {
  return expensiveCalculation(a, b);
}, [a, b]);
// Returns: the computed value (number, object, array, etc.)

// useCallback - Memoizes the FUNCTION ITSELF
const memoizedFunction = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
// Returns: the function reference
```

### Real Example

```jsx
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  // useMemo - Memoize filtered LIST (value)
  const filteredTodos = useMemo(() => {
    console.log('Filtering todos...');
    return todos.filter(todo => {
      if (filter === 'completed') return todo.completed;
      if (filter === 'active') return !todo.completed;
      return true;
    });
  }, [todos, filter]);
  // Returns: filtered array

  // useCallback - Memoize FUNCTION reference
  const handleToggle = useCallback((id) => {
    console.log('Toggle function created');
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);
  // Returns: same function reference

  return (
    <div>
      <FilterButtons filter={filter} setFilter={setFilter} />
      {/* filteredTodos is the ARRAY */}
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle} {/* handleToggle is the FUNCTION */}
        />
      ))}
    </div>
  );
}

// Child prevents re-render because handleToggle reference doesn't change
const TodoItem = React.memo(({ todo, onToggle }) => {
  console.log('TodoItem render:', todo.text);
  return (
    <div>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      {todo.text}
    </div>
  );
});
```

### When to Use Each

#### ✅ Use useMemo for:
```jsx
// 1. Expensive calculations
const sortedList = useMemo(() => 
  items.sort((a, b) => a.value - b.value), 
  [items]
);

// 2. Filtered/transformed data
const searchResults = useMemo(() => 
  data.filter(item => item.name.includes(searchTerm)), 
  [data, searchTerm]
);

// 3. Derived state
const totalPrice = useMemo(() => 
  cart.reduce((sum, item) => sum + item.price, 0), 
  [cart]
);

// 4. Creating objects/arrays for child props
const config = useMemo(() => ({ theme, lang }), [theme, lang]);
```

#### ✅ Use useCallback for:
```jsx
// 1. Functions passed to memoized children
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
<MemoizedChild onClick={handleClick} />

// 2. Functions in dependency arrays
const fetchData = useCallback(() => {
  api.get(id);
}, [id]);
useEffect(() => {
  fetchData();
}, [fetchData]); // Won't cause infinite loop

// 3. Event handlers passed down multiple levels
const onSubmit = useCallback((data) => {
  submitForm(data);
}, []);
```

### Common Mistake

```jsx
// ❌ WRONG - useMemo for function (technically works but confusing)
const handleClick = useMemo(() => {
  return () => console.log('clicked');
}, []);

// ✅ CORRECT - useCallback for functions
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);

// ❌ WRONG - useCallback for values (doesn't make sense)
const total = useCallback(() => a + b, [a, b]); // Returns function, not value!

// ✅ CORRECT - useMemo for values
const total = useMemo(() => a + b, [a, b]); // Returns the sum
```

### Mental Model

```jsx
// Think of useMemo as:
const value = useMemo(() => COMPUTE_VALUE, [deps]);
//                           ^^^^^^^^^^^^
//                           Run this, return result

// Think of useCallback as:
const fn = useCallback(FUNCTION_TO_KEEP, [deps]);
//                     ^^^^^^^^^^^^^^^^
//                     Keep this function itself

// Equivalent (but useCallback is clearer):
const fn1 = useCallback(() => doSomething(), []);
const fn2 = useMemo(() => () => doSomething(), []); // Returns a function
```

### Performance Example

```jsx
function ProductList({ category }) {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('name');

  // useMemo - Expensive filtering/sorting (value)
  const displayProducts = useMemo(() => {
    console.log('🔄 Filtering and sorting...');
    return products
      .filter(p => p.category === category)
      .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
  }, [products, category, sortBy]);

  // useCallback - Function reference for child
  const handleDelete = useCallback((id) => {
    console.log('🗑️ Delete function');
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  return (
    <div>
      {/* displayProducts = array of filtered/sorted items */}
      {displayProducts.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onDelete={handleDelete} {/* Same function reference */}
        />
      ))}
    </div>
  );
}
```

### Quick Decision Guide

**Ask yourself:**
- "Do I need the **result** of a calculation?" → **useMemo**
- "Do I need a **stable function reference**?" → **useCallback**

**Remember:**
- `useMemo(() => x)` returns `x`
- `useCallback(() => x)` returns `() => x` (the function itself)

---

## �🏷️ HTML `<label>` and `htmlFor`

### What is `<label>`?

Label for form inputs. Provides:
- **Accessibility** - Screen readers identify input purpose
- **Usability** - Clicking label focuses/activates input
- **Better UX** - Larger clickable area (especially for checkboxes)

### Two Ways to Use

#### 1. Wrap Input (Implicit)
```jsx
<label>
  Email Address
  <input type="email" />
</label>
// No htmlFor needed, input is inside label
```

#### 2. Separate with `htmlFor` (Explicit)
```jsx
<label htmlFor="email">Email Address</label>
<input id="email" type="email" />
// htmlFor must match input's id
```

### Why `htmlFor` in React?

```jsx
// HTML uses "for"
<label for="email">Email</label>

// React uses "htmlFor" (because "for" is JavaScript keyword)
<label htmlFor="email">Email</label>
```

### Purpose

**Associates label with input** via matching `id`:
- Click label → focuses input
- Screen readers announce label when input focused
- Required for accessibility

### Most Useful: Checkboxes & Radio Buttons

```jsx
// ❌ Without label - must click tiny box
<input type="checkbox" id="terms" />
<span>I agree</span>

// ✅ With label - entire text is clickable
<input type="checkbox" id="terms" />
<label htmlFor="terms">I agree to terms</label>

// ✅ Alternative: wrap in label
<label>
  <input type="checkbox" />
  I agree to terms
</label>
```

### Common Pattern

```jsx
<div>
  <label htmlFor="name">Name</label>
  <input id="name" type="text" />
</div>

<div>
  <label htmlFor="email">Email</label>
  <input id="email" type="email" />
</div>

<label>
  <input type="checkbox" />
  Subscribe to newsletter
</label>
```

### Quick Reference

```jsx
// Text input
<label htmlFor="username">Username</label>
<input id="username" type="text" />

// Checkbox (wrapped)
<label>
  <input type="checkbox" />
  Accept terms
</label>

// Radio buttons
<input type="radio" id="male" name="gender" />
<label htmlFor="male">Male</label>

<input type="radio" id="female" name="gender" />
<label htmlFor="female">Female</label>
```

**Key:** Always use labels with inputs for accessibility and better UX!

---

## 📝 Form `action` - HTML vs React

### HTML Form Action (Traditional)

In HTML, `action` attribute specifies **where to send form data** when submitted.

```html
<!-- HTML Form - Full page reload -->
<form action="/submit-form" method="POST">
  <input name="username" type="text" />
  <input name="email" type="email" />
  <button type="submit">Submit</button>
</form>

<!-- What happens: -->
<!-- 1. User clicks submit -->
<!-- 2. Browser sends POST request to /submit-form -->
<!-- 3. Page RELOADS with server response -->
<!-- 4. Data sent as form-encoded: username=john&email=john@example.com -->
```

### Form Action Behavior

```html
<!-- No action = submits to current URL -->
<form method="POST">
  <!-- Submits to same page -->
</form>

<!-- Absolute URL -->
<form action="https://api.example.com/users" method="POST">
  <!-- Submits to external server -->
</form>

<!-- Relative URL -->
<form action="/api/users" method="POST">
  <!-- Submits to /api/users on same domain -->
</form>

<!-- GET request (data in URL) -->
<form action="/search" method="GET">
  <input name="q" />
  <!-- Navigates to: /search?q=value -->
</form>
```

---

### React Form (Controlled - Standard Way)

React **prevents default form submission** and handles data with JavaScript.

```jsx
function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();  // ⚠️ Prevents default HTML form submission
    
    // Handle form data with JavaScript
    console.log(formData);
    
    // Send data with fetch/axios
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
  };

  return (
    <form onSubmit={handleSubmit}>  {/* ❌ No action attribute */}
      <input
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      <input
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Key differences:**
- ❌ **No `action` attribute** - React handles submission
- ✅ **`onSubmit` handler** - JavaScript function processes data
- ✅ **`e.preventDefault()`** - Stops page reload
- ✅ **Controlled inputs** - React state manages values
- ✅ **Fetch/Axios for API** - Send data programmatically

---

### React with action (Next.js 13+ Server Actions)

**New in Next.js 13+**: Forms can have `action` that calls server functions.

```jsx
// app/actions.js (Server-side)
'use server';

export async function createUser(formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  
  // Save to database
  await db.users.create({ username, email });
  
  return { success: true };
}

// app/page.jsx (Client-side)
import { createUser } from './actions';

function SignupForm() {
  return (
    <form action={createUser}>  {/* ✅ action = server function */}
      <input name="username" type="text" />
      <input name="email" type="email" />
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

**What happens:**
1. User submits form
2. Next.js automatically sends data to server function
3. No `e.preventDefault()` needed
4. Works without JavaScript (progressive enhancement)

---

### Comparison Table

| Feature | HTML Form | React (Standard) | React (Server Actions) |
|---------|-----------|------------------|------------------------|
| **action attribute** | ✅ URL string | ❌ Not used | ✅ Server function |
| **Page reload** | ✅ Yes (full reload) | ❌ No | ❌ No |
| **JavaScript required** | ❌ No | ✅ Yes | ❌ No (progressive) |
| **Submit handler** | Browser default | `onSubmit` + `e.preventDefault()` | Server function |
| **Data format** | Form-encoded | JSON (fetch/axios) | FormData |
| **Validation** | HTML5 only | JavaScript | JavaScript |
| **State management** | None | React state | Optional |

---

### When to Use Each

#### ✅ HTML Form with action (Traditional)
```jsx
// Static site, no React state needed
<form action="/contact" method="POST">
  <input name="message" />
  <button type="submit">Send</button>
</form>
// Use when: Simple forms, static sites, no client-side validation
```

#### ✅ React Controlled Form (Most Common)
```jsx
function ContactForm() {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate, transform, send data
    if (message.length < 5) return;
    fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
      />
      <button>Send</button>
    </form>
  );
}
// Use when: Client-side validation, complex state, real-time feedback
```

#### ✅ React Server Actions (Next.js 13+)
```jsx
function ContactForm() {
  return (
    <form action={sendMessage}>
      <input name="message" />
      <button>Send</button>
    </form>
  );
}
// Use when: Next.js app, want progressive enhancement, simple forms
```

---

### Common Mistakes

#### ❌ WRONG: Using action without preventDefault
```jsx
function Form() {
  const handleSubmit = () => {
    console.log('Submitting...');
  };
  
  return (
    <form action="/submit" onSubmit={handleSubmit}>
      {/* ❌ Page will reload! Form submits to /submit */}
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### ✅ CORRECT: Prevent default in React
```jsx
function Form() {
  const handleSubmit = (e) => {
    e.preventDefault();  // ✅ Stops page reload
    console.log('Submitting...');
  };
  
  return (
    <form onSubmit={handleSubmit}>  {/* ❌ No action needed */}
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

### Real-World Examples

#### HTML Form (Traditional - Full Reload)
```html
<!-- Old-school form submission -->
<form action="/login" method="POST">
  <input name="username" required />
  <input name="password" type="password" required />
  <button type="submit">Login</button>
</form>
<!-- Browser handles everything, page reloads -->
```

#### React Form (Modern - No Reload)
```jsx
function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (username.length < 3) {
      setError('Username too short');
      return;
    }

    // Send to API
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (res.ok) {
        // Handle success (no page reload!)
        console.log('Logged in!');
      } else {
        setError('Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

#### Next.js Server Actions (Progressive Enhancement)
```jsx
// app/actions.js
'use server';
export async function login(formData) {
  const username = formData.get('username');
  const password = formData.get('password');
  
  // Validate and authenticate
  const user = await db.users.findOne({ username, password });
  
  if (!user) {
    return { error: 'Invalid credentials' };
  }
  
  // Set session, redirect, etc.
  return { success: true };
}

// app/page.jsx
import { login } from './actions';

function LoginForm() {
  return (
    <form action={login}>
      <input name="username" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
    </form>
  );
}
// Works without JavaScript! Progressive enhancement.
```

---

### Key Takeaways

| Approach | When to Use |
|----------|-------------|
| **HTML `action`** | Static sites, simple forms, no React state |
| **React `onSubmit`** | Most React apps, validation, complex logic |
| **Server Actions** | Next.js 13+, progressive enhancement |

**Remember:**
- 🔑 **HTML action** = URL, causes page reload
- 🔑 **React onSubmit** = JavaScript function, no reload
- 🔑 **Always `e.preventDefault()`** in React forms (unless using Server Actions)
- 🔑 **Server Actions** = best of both worlds (works without JS)

---

## 🔄 TanStack Query (React Query) - Server State Management

### What is TanStack Query?

**TanStack Query** (formerly React Query) is a powerful library for **fetching, caching, synchronizing, and updating server state** in React applications.

### The Problem It Solves

#### Without TanStack Query (Manual approach):
```jsx
function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return <ul>{users.map(user => <li key={user.id}>{user.name}</li>)}</ul>;
}

// Problems:
// ❌ Boilerplate code (loading, error, data states)
// ❌ No caching (refetches on every mount)
// ❌ No background updates
// ❌ No retry logic
// ❌ Hard to share data between components
```

#### With TanStack Query:
```jsx
import { useQuery } from '@tanstack/react-query';

function Users() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json())
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return <ul>{data.map(user => <li key={user.id}>{user.name}</li>)}</ul>;
}

// Benefits:
// ✅ Less boilerplate
// ✅ Automatic caching
// ✅ Background refetching
// ✅ Built-in retry logic
// ✅ Easy data sharing
```

---

### Installation

```bash
npm install @tanstack/react-query
```

---

### Setup

#### Wrap app with QueryClientProvider

```jsx
// main.jsx or App.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}
```

---

### Core Concepts

#### 1. **queryKey** - Unique identifier for the query
#### 2. **queryFn** - Function that returns a promise
#### 3. **useQuery** - Fetch and cache data
#### 4. **useMutation** - Create/update/delete data
#### 5. **Automatic caching** - Data stored and reused
#### 6. **Background refetching** - Keep data fresh

---

### useQuery - Fetching Data

#### Basic Usage

```jsx
import { useQuery } from '@tanstack/react-query';

function Posts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    }
  });

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

#### What useQuery Returns

```jsx
const {
  data,           // The data from the query
  error,          // Error object if query failed
  isLoading,      // true if first load
  isFetching,     // true when fetching (including background)
  isError,        // true if query failed
  isSuccess,      // true if query succeeded
  refetch,        // Function to manually refetch
  status          // 'pending' | 'error' | 'success'
} = useQuery({ queryKey, queryFn });
```

---

### Query Keys (Important!)

Query keys uniquely identify queries and are used for caching.

```jsx
// Simple key
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos
});

// Key with parameters
useQuery({
  queryKey: ['todo', todoId],
  queryFn: () => fetchTodo(todoId)
});

// Key with multiple parameters
useQuery({
  queryKey: ['todos', { status: 'done', page: 1 }],
  queryFn: () => fetchTodos({ status: 'done', page: 1 })
});

// Keys are compared by value (deep equality)
['todos'] === ['todos']  // Same cache
['todos', 1] === ['todos', 1]  // Same cache
['todos', 1] !== ['todos', 2]  // Different cache
```

---

### 🔑 Query Keys - Complete Guide

#### What are Query Keys?

**Query keys** are unique identifiers for queries. They determine:
- 🗄️ **Cache storage** - Where data is stored
- 🔄 **Refetching** - When to refetch data
- ♻️ **Invalidation** - Which queries to update
- 📊 **Sharing** - How components share data

**Rule:** If query keys match, they share the same cache!

---

#### Query Key Types

##### 1. Simple String Key (Array with one item)

```jsx
useQuery({
  queryKey: ['todos'],  // Array with string
  queryFn: fetchTodos
});

// ❌ WRONG: Don't use string directly
useQuery({
  queryKey: 'todos',  // ❌ Should be array
  queryFn: fetchTodos
});

// ✅ CORRECT: Always use array
useQuery({
  queryKey: ['todos'],  // ✅ Array
  queryFn: fetchTodos
});
```

##### 2. Key with ID/Parameter

```jsx
useQuery({
  queryKey: ['todo', todoId],  // ['todo', 5]
  queryFn: () => fetchTodo(todoId)
});

// Different IDs = Different cache
// ['todo', 1] !== ['todo', 2]
```

##### 3. Key with Multiple Parameters

```jsx
useQuery({
  queryKey: ['todos', userId, { status: 'done', page: 1 }],
  queryFn: () => fetchTodos(userId, { status: 'done', page: 1 })
});

// Order matters!
// ['todos', 1, { status: 'done' }] !== ['todos', { status: 'done' }, 1]
```

##### 4. Nested Object Keys

```jsx
useQuery({
  queryKey: ['projects', { teamId: 5, filters: { status: 'active', priority: 'high' } }],
  queryFn: () => fetchProjects({ teamId: 5, filters: { status: 'active', priority: 'high' } })
});

// Objects are compared by value (deep equality)
// { teamId: 5 } === { teamId: 5 }  ✅ Same cache
```

---

#### Query Key Structure Best Practices

##### Hierarchical Structure (Recommended)

```jsx
// ✅ GOOD: Hierarchical structure
['users']                           // All users
['users', userId]                   // Specific user
['users', userId, 'posts']          // User's posts
['users', userId, 'posts', postId]  // Specific post

// Benefits:
// - Easy to invalidate by prefix
// - Clear hierarchy
// - Intuitive caching
```

##### Example: E-commerce App

```jsx
// Products
['products']                                    // All products
['products', { category: 'electronics' }]       // Products by category
['products', productId]                         // Single product
['products', productId, 'reviews']              // Product reviews
['products', productId, 'reviews', { page: 1 }] // Paginated reviews

// Cart
['cart']                           // User's cart
['cart', 'items']                  // Cart items
['cart', 'items', itemId]          // Specific cart item

// Orders
['orders']                         // All orders
['orders', { status: 'pending' }]  // Orders by status
['orders', orderId]                // Specific order
```

---

#### Key Matching and Invalidation

##### Exact Match

```jsx
// Invalidate exact query
queryClient.invalidateQueries({ queryKey: ['todos'] });

// Only invalidates: ['todos']
// Does NOT invalidate: ['todos', 1] or ['todos', { status: 'done' }]
```

##### Prefix Match (Default)

```jsx
// Invalidate all queries starting with ['todos']
queryClient.invalidateQueries({ queryKey: ['todos'] });

// Invalidates:
// ✅ ['todos']
// ✅ ['todos', 1]
// ✅ ['todos', { status: 'done' }]
// ✅ ['todos', 1, 'comments']
// ❌ ['users'] (different prefix)
```

##### Exact Match (Explicit)

```jsx
// Only invalidate exact key
queryClient.invalidateQueries({ 
  queryKey: ['todos'],
  exact: true  // Only exact match
});

// Invalidates:
// ✅ ['todos']
// ❌ ['todos', 1] (has extra parameters)
```

---

#### Dynamic Query Keys

##### Keys with Variables

```jsx
function UserProfile({ userId }) {
  // Key includes userId - changes when userId changes
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId)
  });

  return <h1>{user.name}</h1>;
}

// Flow:
// userId = 1 → queryKey: ['user', 1] → Fetches user 1
// userId = 2 → queryKey: ['user', 2] → Fetches user 2
// Both cached separately!
```

##### Keys with Filters

```jsx
function TodoList({ status, priority }) {
  const { data: todos } = useQuery({
    queryKey: ['todos', { status, priority }],
    queryFn: () => fetchTodos({ status, priority })
  });

  return <ul>{/* render todos */}</ul>;
}

// Different filters = Different cache
// ['todos', { status: 'done', priority: 'high' }]
// ['todos', { status: 'pending', priority: 'low' }]
```

##### Keys with Search/Pagination

```jsx
function SearchResults({ query, page }) {
  const { data } = useQuery({
    queryKey: ['search', query, { page }],
    queryFn: () => searchPosts(query, page),
    enabled: !!query  // Only search if query exists
  });

  return <div>{/* results */}</div>;
}

// Each search + page combination is cached separately
// ['search', 'react', { page: 1 }]
// ['search', 'react', { page: 2 }]
// ['search', 'vue', { page: 1 }]
```

---

#### Query Key Factories (Advanced Pattern)

Create functions to generate consistent query keys across your app.

```jsx
// queryKeys.js
export const todoKeys = {
  all: ['todos'],
  lists: () => [...todoKeys.all, 'list'],
  list: (filters) => [...todoKeys.lists(), filters],
  details: () => [...todoKeys.all, 'detail'],
  detail: (id) => [...todoKeys.details(), id]
};

// Usage
useQuery({
  queryKey: todoKeys.all,  // ['todos']
  queryFn: fetchTodos
});

useQuery({
  queryKey: todoKeys.list({ status: 'done' }),  // ['todos', 'list', { status: 'done' }]
  queryFn: () => fetchTodos({ status: 'done' })
});

useQuery({
  queryKey: todoKeys.detail(5),  // ['todos', 'detail', 5]
  queryFn: () => fetchTodo(5)
});

// Invalidation is easy
queryClient.invalidateQueries({ queryKey: todoKeys.all });  // Invalidates ALL todos
queryClient.invalidateQueries({ queryKey: todoKeys.lists() });  // Only lists
queryClient.invalidateQueries({ queryKey: todoKeys.detail(5) });  // Single todo
```

##### Complete Key Factory Example

```jsx
// api/queryKeys.js
export const queryKeys = {
  // Users
  users: {
    all: ['users'],
    lists: () => [...queryKeys.users.all, 'list'],
    list: (filters) => [...queryKeys.users.lists(), filters],
    details: () => [...queryKeys.users.all, 'detail'],
    detail: (id) => [...queryKeys.users.details(), id],
    posts: (userId) => [...queryKeys.users.detail(userId), 'posts']
  },
  
  // Posts
  posts: {
    all: ['posts'],
    lists: () => [...queryKeys.posts.all, 'list'],
    list: (filters) => [...queryKeys.posts.lists(), filters],
    details: () => [...queryKeys.posts.all, 'detail'],
    detail: (id) => [...queryKeys.posts.details(), id],
    comments: (postId) => [...queryKeys.posts.detail(postId), 'comments']
  },
  
  // Products
  products: {
    all: ['products'],
    lists: () => [...queryKeys.products.all, 'list'],
    list: (filters) => [...queryKeys.products.lists(), filters],
    details: () => [...queryKeys.products.all, 'detail'],
    detail: (id) => [...queryKeys.products.details(), id],
    reviews: (productId) => [...queryKeys.products.detail(productId), 'reviews']
  }
};

// Usage in components
function Products({ category }) {
  const { data: products } = useQuery({
    queryKey: queryKeys.products.list({ category }),
    queryFn: () => fetchProducts({ category })
  });
  
  return <div>{/* render */}</div>;
}

function ProductDetail({ productId }) {
  const { data: product } = useQuery({
    queryKey: queryKeys.products.detail(productId),
    queryFn: () => fetchProduct(productId)
  });
  
  const { data: reviews } = useQuery({
    queryKey: queryKeys.products.reviews(productId),
    queryFn: () => fetchReviews(productId)
  });
  
  return <div>{/* render */}</div>;
}

// Invalidation
const addProductMutation = useMutation({
  mutationFn: addProduct,
  onSuccess: () => {
    // Invalidate all product lists
    queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
  }
});

const updateProductMutation = useMutation({
  mutationFn: updateProduct,
  onSuccess: (data, variables) => {
    // Invalidate specific product
    queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.id) });
    // Also invalidate lists
    queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
  }
});
```

---

#### Common Query Key Patterns

##### Pattern 1: Resource-based

```jsx
// Resource + optional filters
['posts']                          // All posts
['posts', { author: 'john' }]      // Filtered posts
['posts', { author: 'john', published: true }]  // More filters
```

##### Pattern 2: Resource + ID

```jsx
// Resource + ID + optional sub-resource
['user', 123]                      // User 123
['user', 123, 'posts']             // User 123's posts
['user', 123, 'posts', { page: 1 }]  // Paginated posts
```

##### Pattern 3: Nested Resources

```jsx
// Parent → Child → Grandchild
['organizations', orgId]
['organizations', orgId, 'projects']
['organizations', orgId, 'projects', projectId]
['organizations', orgId, 'projects', projectId, 'tasks']
```

##### Pattern 4: Computed/Derived Data

```jsx
['dashboard']                      // Dashboard data
['analytics', { range: '7d' }]    // Analytics for 7 days
['report', 'sales', { year: 2025 }]  // Sales report
```

---

#### Invalidation Strategies

##### Strategy 1: Invalidate Specific Query

```jsx
// After updating user 5
queryClient.invalidateQueries({ queryKey: ['user', 5] });
```

##### Strategy 2: Invalidate All Related Queries

```jsx
// After adding a post, invalidate all post lists
queryClient.invalidateQueries({ queryKey: ['posts'] });

// Invalidates:
// ['posts']
// ['posts', { status: 'published' }]
// ['posts', { author: 'john' }]
```

##### Strategy 3: Selective Invalidation

```jsx
// Only invalidate active queries
queryClient.invalidateQueries({ 
  queryKey: ['posts'],
  refetchType: 'active'  // Only refetch mounted queries
});

// Only mark as stale (don't refetch)
queryClient.invalidateQueries({ 
  queryKey: ['posts'],
  refetchType: 'none'
});
```

##### Strategy 4: Predicate-based Invalidation

```jsx
// Invalidate all queries for a specific user
queryClient.invalidateQueries({
  predicate: (query) => {
    const [resource, id] = query.queryKey;
    return resource === 'user' && id === userId;
  }
});

// Invalidate stale queries only
queryClient.invalidateQueries({
  predicate: (query) => query.isStale()
});
```

---

#### Real-World Examples

##### Example 1: Blog Application

```jsx
// Define keys
const blogKeys = {
  posts: {
    all: ['posts'],
    list: (filters) => ['posts', 'list', filters],
    detail: (id) => ['posts', 'detail', id],
    comments: (id) => ['posts', 'detail', id, 'comments']
  },
  authors: {
    all: ['authors'],
    detail: (id) => ['authors', 'detail', id],
    posts: (id) => ['authors', 'detail', id, 'posts']
  }
};

// Use in components
function PostList({ category, author }) {
  const { data: posts } = useQuery({
    queryKey: blogKeys.posts.list({ category, author }),
    queryFn: () => fetchPosts({ category, author })
  });
  
  return <div>{/* posts */}</div>;
}

function PostDetail({ postId }) {
  const { data: post } = useQuery({
    queryKey: blogKeys.posts.detail(postId),
    queryFn: () => fetchPost(postId)
  });
  
  const { data: comments } = useQuery({
    queryKey: blogKeys.posts.comments(postId),
    queryFn: () => fetchComments(postId)
  });
  
  return <div>{/* post and comments */}</div>;
}

// Mutations
const createPostMutation = useMutation({
  mutationFn: createPost,
  onSuccess: () => {
    // Invalidate all post lists
    queryClient.invalidateQueries({ queryKey: ['posts', 'list'] });
  }
});

const addCommentMutation = useMutation({
  mutationFn: addComment,
  onSuccess: (data, variables) => {
    // Invalidate comments for specific post
    queryClient.invalidateQueries({ 
      queryKey: blogKeys.posts.comments(variables.postId) 
    });
  }
});
```

##### Example 2: Social Media Feed

```jsx
const socialKeys = {
  feed: (userId) => ['feed', userId],
  posts: {
    all: ['posts'],
    detail: (id) => ['posts', id],
    likes: (id) => ['posts', id, 'likes']
  },
  users: {
    profile: (id) => ['users', id],
    followers: (id) => ['users', id, 'followers']
  }
};

function Feed({ userId }) {
  const { data: feed } = useQuery({
    queryKey: socialKeys.feed(userId),
    queryFn: () => fetchFeed(userId),
    refetchInterval: 30000  // Refresh every 30s
  });
  
  return <div>{/* feed */}</div>;
}

function Post({ postId }) {
  const { data: post } = useQuery({
    queryKey: socialKeys.posts.detail(postId),
    queryFn: () => fetchPost(postId)
  });
  
  const { data: likes } = useQuery({
    queryKey: socialKeys.posts.likes(postId),
    queryFn: () => fetchLikes(postId)
  });
  
  return <div>{/* post with likes */}</div>;
}

// Like mutation
const likeMutation = useMutation({
  mutationFn: likePost,
  onSuccess: (data, variables) => {
    // Invalidate post likes
    queryClient.invalidateQueries({ 
      queryKey: socialKeys.posts.likes(variables.postId) 
    });
    // Invalidate feeds (post appears in multiple feeds)
    queryClient.invalidateQueries({ queryKey: ['feed'] });
  }
});
```

---

#### Common Mistakes

```jsx
// ❌ WRONG: String instead of array
useQuery({
  queryKey: 'todos',  // ❌
  queryFn: fetchTodos
});

// ✅ CORRECT
useQuery({
  queryKey: ['todos'],  // ✅
  queryFn: fetchTodos
});

// ❌ WRONG: Forgetting to include dependencies
useQuery({
  queryKey: ['user'],  // ❌ Missing userId
  queryFn: () => fetchUser(userId)  // Uses userId but not in key!
});

// ✅ CORRECT
useQuery({
  queryKey: ['user', userId],  // ✅ Include all dependencies
  queryFn: () => fetchUser(userId)
});

// ❌ WRONG: Using objects with functions (not serializable)
useQuery({
  queryKey: ['data', { callback: () => {} }],  // ❌ Functions can't be compared
  queryFn: fetchData
});

// ✅ CORRECT: Only serializable values
useQuery({
  queryKey: ['data', { id: 5, status: 'active' }],  // ✅
  queryFn: fetchData
});

// ❌ WRONG: Order inconsistency
useQuery({
  queryKey: ['posts', { author: 'john', status: 'published' }],
  queryFn: fetchPosts
});

useQuery({
  queryKey: ['posts', { status: 'published', author: 'john' }],  // ❌ Different order!
  queryFn: fetchPosts
});

// ✅ CORRECT: Consistent ordering
const filters = { author: 'john', status: 'published' };
useQuery({
  queryKey: ['posts', filters],  // ✅ Same object reference
  queryFn: fetchPosts
});
```

---

#### Quick Reference

```jsx
// Basic patterns
['resource']                        // All resources
['resource', id]                    // Single resource
['resource', { filters }]           // Filtered resources
['resource', id, 'subresource']     // Nested resource

// Invalidation
queryClient.invalidateQueries({ queryKey: ['todos'] });  // All todos
queryClient.invalidateQueries({ queryKey: ['todos'], exact: true });  // Exact match
queryClient.invalidateQueries({ queryKey: ['todos', 5] });  // Specific todo

// Key factories
const keys = {
  all: ['todos'],
  detail: (id) => [...keys.all, id]
};
```

---

#### Key Takeaways

- 🔑 **Query keys** - Unique identifiers for caching
- 📦 **Always use arrays** - `['todos']` not `'todos'`
- 🎯 **Include all dependencies** - IDs, filters, params
- 🏗️ **Hierarchical structure** - Easier invalidation
- 🏭 **Key factories** - Consistent keys across app
- 🔄 **Prefix matching** - Invalidate by prefix (default)
- ✅ **Serializable values** - No functions in keys
- 📊 **Order matters** - Keep consistent structure

---

### Dynamic Queries with Parameters

```jsx
import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],  // Include userId in key
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}`);
      return res.json();
    }
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

// When userId changes, query automatically refetches
// <UserProfile userId={1} /> → Fetches user 1
// <UserProfile userId={2} /> → Fetches user 2
```

---

### Dependent Queries

```jsx
function UserPosts({ userId }) {
  // First query: fetch user
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId)
  });

  // Second query: only runs if user exists
  const { data: posts } = useQuery({
    queryKey: ['posts', user?.id],
    queryFn: () => fetchUserPosts(user.id),
    enabled: !!user  // Only fetch if user exists
  });

  return <div>{/* render posts */}</div>;
}
```

---

### useMutation - Modifying Data

Used for **creating, updating, or deleting** data.

#### Basic Usage

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function AddTodo() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      }).then(res => res.json());
    },
    onSuccess: () => {
      // Invalidate and refetch todos query
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ title: 'New Todo', completed: false });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Adding...' : 'Add Todo'}
      </button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
      {mutation.isSuccess && <p>Todo added!</p>}
    </form>
  );
}
```

#### What useMutation Returns

```jsx
const {
  mutate,         // Function to trigger mutation
  mutateAsync,    // Async version (returns promise)
  data,           // Response data
  error,          // Error object
  isPending,      // true while mutating
  isError,        // true if failed
  isSuccess,      // true if succeeded
  reset           // Reset mutation state
} = useMutation({ mutationFn });
```

---

### Update Example (PUT/PATCH)

```jsx
function UpdateUser({ userId }) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (updatedData) => {
      return fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      }).then(res => res.json());
    },
    onSuccess: () => {
      // Invalidate specific user query
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    }
  });

  const handleUpdate = () => {
    updateMutation.mutate({ name: 'Updated Name' });
  };

  return (
    <button onClick={handleUpdate} disabled={updateMutation.isPending}>
      {updateMutation.isPending ? 'Updating...' : 'Update User'}
    </button>
  );
}
```

---

### Delete Example

```jsx
function TodoItem({ todo }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (todoId) => {
      return fetch(`/api/todos/${todoId}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });

  return (
    <div>
      <span>{todo.title}</span>
      <button
        onClick={() => deleteMutation.mutate(todo.id)}
        disabled={deleteMutation.isPending}
      >
        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}
```

---

### Optimistic Updates

Update UI immediately before server confirms.

```jsx
function TodoList() {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: (todo) => {
      return fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: !todo.completed })
      });
    },
    // Optimistic update
    onMutate: async (updatedTodo) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot previous value
      const previousTodos = queryClient.getQueryData(['todos']);

      // Optimistically update
      queryClient.setQueryData(['todos'], (old) =>
        old.map(todo =>
          todo.id === updatedTodo.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      );

      // Return context with snapshot
      return { previousTodos };
    },
    // Rollback on error
    onError: (err, updatedTodo, context) => {
      queryClient.setQueryData(['todos'], context.previousTodos);
    },
    // Always refetch after success or error
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });

  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleMutation.mutate(todo)}
          />
          {todo.title}
        </div>
      ))}
    </div>
  );
}
```

---

### Query Options

```jsx
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  
  // Refetch options
  staleTime: 5000,              // Data fresh for 5 seconds
  gcTime: 10 * 60 * 1000,       // Cache for 10 minutes (formerly cacheTime)
  refetchOnWindowFocus: true,    // Refetch when window focused
  refetchOnReconnect: true,      // Refetch when reconnected
  refetchInterval: 30000,        // Refetch every 30 seconds
  
  // Retry options
  retry: 3,                      // Retry 3 times on failure
  retryDelay: 1000,              // Wait 1s between retries
  
  // Enabled
  enabled: true,                 // Enable/disable query
  
  // Callbacks
  onSuccess: (data) => {
    console.log('Data fetched:', data);
  },
  onError: (error) => {
    console.error('Error:', error);
  }
});
```

---

### 🕐 staleTime, gcTime & invalidateQueries - Deep Dive

#### Understanding the Cache Lifecycle

TanStack Query has **two important time periods**:

1. **`staleTime`** - How long data is considered **fresh**
2. **`gcTime`** (garbage collection time, formerly `cacheTime`) - How long **unused** data stays in memory

---

### 1. staleTime - Data Freshness

**What it does:** Controls how long fetched data is considered **fresh** (doesn't need refetching).

**Default:** `0` (data immediately becomes stale)

#### How It Works

```jsx
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 5000  // Fresh for 5 seconds
});

// Timeline:
// 0s: Data fetched → Status: FRESH ✅
// 0-5s: Remounts/refocuses DON'T refetch (data is fresh)
// 5s+: Data becomes STALE → Status: STALE ⚠️
// Next mount/refocus: Refetches data
```

#### Visual Timeline

```
Fetch → |-------- FRESH (5s) --------| → STALE → Refetch on next trigger
        ↑                              ↑
    staleTime: 0                  staleTime: 5000
```

#### Example: Fresh vs Stale

```jsx
// ❌ staleTime: 0 (default) - Always stale, refetches often
useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  staleTime: 0  // Default: refetch on every mount/focus
});

// ✅ staleTime: 5 seconds - Fresh for 5s, reduces refetches
useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  staleTime: 5 * 1000  // 5 seconds
});

// ✅ staleTime: Infinity - Never stale, manual refetch only
useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  staleTime: Infinity  // Never automatically refetch
});
```

#### Real-World staleTime Examples

```jsx
// Static data (rarely changes)
useQuery({
  queryKey: ['countries'],
  queryFn: fetchCountries,
  staleTime: 24 * 60 * 60 * 1000  // 24 hours
});

// Slow-changing data (product catalog)
useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
  staleTime: 5 * 60 * 1000  // 5 minutes
});

// Real-time data (stock prices)
useQuery({
  queryKey: ['stock-price'],
  queryFn: fetchStockPrice,
  staleTime: 0,  // Always stale, refetch often
  refetchInterval: 5000  // Auto-refetch every 5s
});

// User profile (moderate changes)
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 60 * 1000  // 1 minute
});
```

---

### 2. gcTime - Cache Duration

**What it does:** Controls how long **inactive/unused** query data stays in memory cache.

**Default:** `5 minutes` (300,000ms)

**Formerly called:** `cacheTime` (renamed in v5)

#### How It Works

```jsx
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  gcTime: 10 * 60 * 1000  // Cache for 10 minutes
});

// Timeline:
// Component mounts → Fetch data → Data cached
// Component unmounts → Start gcTime timer (10 min)
// If component remounts within 10 min → Use cached data (instant!)
// After 10 min of being unused → Data removed from cache
```

#### Visual Timeline

```
Mount → Fetch → Unmount → |--- gcTime (10min) ---| → Cache cleared
                          ↑                        ↑
                     Remount here?            Data deleted
                     Uses cache ✅
```

#### Example: Cache Behavior

```jsx
function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    gcTime: 5 * 60 * 1000  // Cache for 5 minutes
  });

  return <div>{data.name}</div>;
}

// Scenario:
// 1. User visits /profile/1 → Fetches user 1 → Cached
// 2. User navigates away → Component unmounts → gcTime starts (5min)
// 3. User returns to /profile/1 within 5min → Instant! (uses cache)
// 4. After 5min of no visits → Cache deleted → Next visit refetches
```

#### gcTime Examples

```jsx
// Short cache (frequently changing data)
useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  gcTime: 30 * 1000  // 30 seconds
});

// Long cache (static data)
useQuery({
  queryKey: ['app-config'],
  queryFn: fetchConfig,
  gcTime: 60 * 60 * 1000  // 1 hour
});

// No cache (always fetch fresh)
useQuery({
  queryKey: ['live-data'],
  queryFn: fetchLiveData,
  gcTime: 0  // Don't cache, always refetch
});

// Infinite cache (keep forever)
useQuery({
  queryKey: ['static-content'],
  queryFn: fetchStaticContent,
  gcTime: Infinity  // Never remove from cache
});
```

---

### 3. staleTime vs gcTime - The Difference

| Feature | staleTime | gcTime |
|---------|-----------|--------|
| **Controls** | When data becomes stale | When cache is deleted |
| **Applies to** | Active queries | Inactive/unmounted queries |
| **Default** | 0 (always stale) | 5 minutes |
| **Purpose** | Reduce unnecessary refetches | Persist data between mounts |
| **When matters** | Component is mounted | Component is unmounted |

#### Visual Comparison

```jsx
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  staleTime: 30 * 1000,   // 30s - how long data is FRESH
  gcTime: 5 * 60 * 1000   // 5min - how long INACTIVE cache persists
});

// Timeline:
// Mount → Fetch → |--Fresh (30s)--| → Stale (refetch on next trigger)
//              Unmount → |--Cache (5min)--| → Deleted
```

#### Common Combinations

```jsx
// 1. Keep fresh for 1 minute, cache for 10 minutes
useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  staleTime: 1 * 60 * 1000,    // 1 minute
  gcTime: 10 * 60 * 1000       // 10 minutes
});
// Result: Won't refetch for 1min, but cache persists for 10min if unmounted

// 2. Always stale, but cache for 5 minutes
useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  staleTime: 0,                // Always stale (refetch on focus/mount)
  gcTime: 5 * 60 * 1000        // Cache for 5 minutes
});
// Result: Refetches on every focus, but instant if remounted within 5min

// 3. Fresh forever, cached forever
useQuery({
  queryKey: ['static-data'],
  queryFn: fetchStaticData,
  staleTime: Infinity,         // Never stale
  gcTime: Infinity             // Never delete cache
});
// Result: Fetches once, never refetches automatically
```

---

### 4. invalidateQueries - Manual Cache Invalidation

**What it does:** Manually marks queries as **stale** and triggers refetch.

**When to use:** After mutations (create/update/delete) to refresh data.

#### Basic Usage

```jsx
import { useQueryClient } from '@tanstack/react-query';

function AddTodo() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      // Invalidate todos query → marks as stale → refetches
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });

  return <button onClick={() => mutation.mutate(newTodo)}>Add</button>;
}

// Flow:
// 1. User adds todo
// 2. Mutation succeeds
// 3. invalidateQueries marks ['todos'] as stale
// 4. Query automatically refetches
// 5. UI updates with new data
```

#### Invalidate Patterns

```jsx
const queryClient = useQueryClient();

// 1. Invalidate exact query
queryClient.invalidateQueries({ queryKey: ['todos'] });

// 2. Invalidate all queries starting with prefix
queryClient.invalidateQueries({ queryKey: ['todos'] });
// Invalidates: ['todos'], ['todos', 1], ['todos', { status: 'done' }]

// 3. Invalidate specific query with parameters
queryClient.invalidateQueries({ queryKey: ['todo', todoId] });

// 4. Invalidate all queries
queryClient.invalidateQueries();

// 5. Invalidate with predicate (custom logic)
queryClient.invalidateQueries({
  predicate: (query) => query.queryKey[0] === 'posts'
});

// 6. Invalidate multiple queries
queryClient.invalidateQueries({ queryKey: ['todos'] });
queryClient.invalidateQueries({ queryKey: ['user', userId] });
```

#### Real-World Examples

##### Example 1: Add Todo (Create)
```jsx
function AddTodo() {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (newTodo) => fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify(newTodo)
    }).then(res => res.json()),
    onSuccess: () => {
      // Invalidate to refetch updated list
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });

  return (
    <button onClick={() => addMutation.mutate({ title: 'New Todo' })}>
      Add Todo
    </button>
  );
}
```

##### Example 2: Update User (Update)
```jsx
function EditProfile({ userId }) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (updatedData) => fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedData)
    }),
    onSuccess: () => {
      // Invalidate specific user
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      // Also invalidate users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  return (
    <button onClick={() => updateMutation.mutate({ name: 'New Name' })}>
      Update
    </button>
  );
}
```

##### Example 3: Delete Todo (Delete)
```jsx
function TodoItem({ todo }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id) => fetch(`/api/todos/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });

  return (
    <div>
      {todo.title}
      <button onClick={() => deleteMutation.mutate(todo.id)}>Delete</button>
    </div>
  );
}
```

---

### invalidateQueries vs setQueryData

| Method | Purpose | Use Case |
|--------|---------|----------|
| **invalidateQueries** | Mark stale → refetch | After mutation, get fresh data |
| **setQueryData** | Update cache directly | Optimistic updates, manual cache update |

#### When to Use Each

```jsx
// ❌ setQueryData - Manual update (no refetch)
queryClient.setQueryData(['todos'], (oldTodos) => {
  return [...oldTodos, newTodo];
});
// Cache updated, but NOT refetched from server

// ✅ invalidateQueries - Refetch from server
queryClient.invalidateQueries({ queryKey: ['todos'] });
// Marks stale, triggers refetch, ensures fresh data

// ✅ Optimistic update (use both)
useMutation({
  mutationFn: addTodo,
  onMutate: async (newTodo) => {
    // Optimistically update
    queryClient.setQueryData(['todos'], (old) => [...old, newTodo]);
  },
  onSuccess: () => {
    // Then refetch to ensure correctness
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  }
});
```

---

### Advanced: Refetch Behavior

#### Options for invalidateQueries

```jsx
// Basic - refetch active queries immediately
queryClient.invalidateQueries({ queryKey: ['todos'] });

// Refetch all (including inactive)
queryClient.invalidateQueries({ 
  queryKey: ['todos'],
  refetchType: 'all'  // 'active' | 'inactive' | 'all'
});

// Don't refetch, just mark stale
queryClient.invalidateQueries({ 
  queryKey: ['todos'],
  refetchType: 'none'  // Mark stale but don't refetch
});
```

#### Automatic Refetch Triggers

```jsx
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 30000,  // Fresh for 30s
  
  // Refetch triggers (when data is STALE):
  refetchOnWindowFocus: true,   // Refetch when tab focused
  refetchOnReconnect: true,     // Refetch when internet reconnects
  refetchOnMount: true,         // Refetch on component mount
  refetchInterval: 60000        // Refetch every 60s
});

// If data is FRESH (within staleTime), none of these trigger!
```

---

### Complete Example: All Concepts Together

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function TodoApp() {
  const queryClient = useQueryClient();

  // Query with staleTime and gcTime
  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    staleTime: 30 * 1000,      // Fresh for 30s (no refetch)
    gcTime: 5 * 60 * 1000,     // Cache for 5min when unmounted
    refetchOnWindowFocus: true  // Refetch if stale when focus
  });

  // Add todo mutation with invalidation
  const addMutation = useMutation({
    mutationFn: (newTodo) => fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify(newTodo)
    }),
    onSuccess: () => {
      // Invalidate to get fresh data
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });

  // Delete todo mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => fetch(`/api/todos/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Todos</h1>
      <button onClick={() => addMutation.mutate({ title: 'New Todo' })}>
        Add Todo
      </button>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.title}
            <button onClick={() => deleteMutation.mutate(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Flow:
// 1. Mount → Fetch todos → Fresh for 30s
// 2. User switches tabs → Come back → If >30s passed → Refetch
// 3. User adds todo → invalidateQueries → Refetch todos
// 4. User unmounts component → Cache persists for 5min
// 5. User remounts within 5min → Instant (uses cache)
```

---

### Quick Reference Table

| Concept | Default | Common Values | Purpose |
|---------|---------|---------------|---------|
| **staleTime** | 0 (always stale) | 30s, 1min, 5min, Infinity | How long data is fresh |
| **gcTime** | 5 minutes | 30s, 10min, 1hr, Infinity | How long cache persists |
| **invalidateQueries** | N/A | After mutations | Force refetch fresh data |

---

### Best Practices

```jsx
// ✅ GOOD: Static data - long staleTime
useQuery({
  queryKey: ['countries'],
  queryFn: fetchCountries,
  staleTime: 24 * 60 * 60 * 1000,  // 24 hours
  gcTime: Infinity                  // Keep forever
});

// ✅ GOOD: Dynamic data - short staleTime
useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  staleTime: 0,              // Always refetch
  gcTime: 2 * 60 * 1000      // Cache 2min
});

// ✅ GOOD: Invalidate after mutation
useMutation({
  mutationFn: updateUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['user'] });
  }
});

// ❌ BAD: staleTime > gcTime (doesn't make sense)
useQuery({
  queryKey: ['data'],
  staleTime: 10 * 60 * 1000,  // 10 minutes fresh
  gcTime: 1 * 60 * 1000       // But delete after 1 min? ❌
});
```

---

### Key Takeaways

- 🕐 **staleTime** - How long data is **fresh** (doesn't need refetch)
- 🗑️ **gcTime** - How long **inactive** cache persists in memory
- 🔄 **invalidateQueries** - Mark queries stale & refetch (use after mutations)
- 📊 **Default flow**: Fetch → Fresh (staleTime) → Stale → Unmount → Cached (gcTime) → Deleted
- ✅ **Best practice**: `staleTime < gcTime` always
- 🎯 **Common pattern**: Invalidate after create/update/delete operations

---

### Real-World Example: Todo App

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

// API functions
const fetchTodos = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
  return res.json();
};

const addTodo = async (newTodo) => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTodo)
  });
  return res.json();
};

function TodoApp() {
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();

  // Fetch todos
  const { data: todos, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos
  });

  // Add todo mutation
  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setTitle('');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addMutation.mutate({ title, completed: false, userId: 1 });
  };

  if (isLoading) return <div>Loading todos...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Todo List</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New todo..."
        />
        <button type="submit" disabled={addMutation.isPending}>
          {addMutation.isPending ? 'Adding...' : 'Add Todo'}
        </button>
      </form>

      {addMutation.isError && (
        <p style={{ color: 'red' }}>Error: {addMutation.error.message}</p>
      )}

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input type="checkbox" checked={todo.completed} readOnly />
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### Pagination Example

```jsx
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

function Posts() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => fetch(`/api/posts?page=${page}`).then(res => res.json()),
    placeholderData: (previousData) => previousData  // Keep previous data while fetching
  });

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data.posts.map(post => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}

      <div>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1 || isPlaceholderData}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={!data?.hasMore || isPlaceholderData}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

---

### Infinite Queries (Load More)

```jsx
import { useInfiniteQuery } from '@tanstack/react-query';

function InfinitePosts() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) =>
      fetch(`/api/posts?page=${pageParam}`).then(res => res.json()),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
    initialPageParam: 1
  });

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.posts.map(post => (
            <div key={post.id}>{post.title}</div>
          ))}
        </div>
      ))}

      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load More'
          : 'Nothing more to load'}
      </button>
    </div>
  );
}
```

---

### DevTools (Optional but Helpful)

```bash
npm install @tanstack/react-query-devtools
```

```jsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// Provides visual debugging for queries and mutations
```

---

### Key Concepts Summary

| Concept | Purpose | Example |
|---------|---------|---------|
| **useQuery** | Fetch and cache data | `useQuery({ queryKey: ['users'], queryFn })` |
| **useMutation** | Create/update/delete | `useMutation({ mutationFn })` |
| **queryKey** | Unique cache identifier | `['todos']` or `['todo', id]` |
| **invalidateQueries** | Refetch stale data | `queryClient.invalidateQueries(['todos'])` |
| **staleTime** | How long data stays fresh | `staleTime: 5000` (5 seconds) |
| **gcTime** | How long cache persists | `gcTime: 10 * 60 * 1000` (10 min) |
| **enabled** | Conditional fetching | `enabled: !!userId` |
| **Optimistic Updates** | Update UI before server | `onMutate`, `onError`, `onSettled` |

---

### When to Use TanStack Query

#### ✅ Use TanStack Query when:
- Fetching data from APIs
- Need automatic caching
- Want background refetching
- Building dashboards with real-time data
- Need retry logic
- Want to share server state across components

#### ❌ Don't use for:
- Local UI state (use useState)
- Form state (use React Hook Form)
- Global app state (use Context/Zustand)

---

### Quick Reference

```jsx
// Setup
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ['key'],
  queryFn: () => fetch('/api').then(res => res.json())
});

// Mutate data
const mutation = useMutation({
  mutationFn: (newData) => fetch('/api', { method: 'POST', body: JSON.stringify(newData) }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['key'] })
});
mutation.mutate(data);

// Invalidate (refetch)
queryClient.invalidateQueries({ queryKey: ['key'] });
```

---

### Key Takeaways

- 🎯 **TanStack Query** - Server state management library
- 🔄 **Automatic caching** - Fetched data stored and reused
- 🚀 **Background updates** - Keeps data fresh automatically
- 🔑 **useQuery** - For fetching (GET)
- 🔑 **useMutation** - For modifying (POST/PUT/DELETE)
- 🗝️ **queryKey** - Unique identifier for cache
- ⚡ **Optimistic updates** - Instant UI feedback
- 🛠️ **DevTools** - Visual debugging for queries

---

## 🔁 Polling - Automatic Data Refetching

### What is Polling?

**Polling** is the technique of **repeatedly fetching data at regular intervals** to keep it up-to-date. Used for real-time or near-real-time updates.

**Use cases:**
- Live dashboards
- Stock prices
- Order status tracking
- Notification counts
- Chat message updates
- Server health monitoring

---

### Method 1: Manual Polling with useEffect

#### Basic Polling Setup

```jsx
import { useState, useEffect } from 'react';

function StockPrice() {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch immediately on mount
    const fetchPrice = async () => {
      setLoading(true);
      const res = await fetch('/api/stock-price');
      const data = await res.json();
      setPrice(data.price);
      setLoading(false);
    };

    fetchPrice();  // Initial fetch

    // Set up polling interval
    const interval = setInterval(() => {
      fetchPrice();  // Fetch every 5 seconds
    }, 5000);

    // Cleanup: clear interval on unmount
    return () => clearInterval(interval);
  }, []);

  if (loading && !price) return <p>Loading...</p>;

  return <h1>Current Price: ${price}</h1>;
}
```

#### Polling with Start/Stop Control

```jsx
function LiveData() {
  const [data, setData] = useState([]);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!isPolling) return;  // Don't poll if stopped

    const fetchData = async () => {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json);
    };

    fetchData();  // Fetch immediately

    const interval = setInterval(fetchData, 3000);  // Poll every 3s

    return () => clearInterval(interval);
  }, [isPolling]);  // Re-run when isPolling changes

  return (
    <div>
      <button onClick={() => setIsPolling(!isPolling)}>
        {isPolling ? 'Stop Polling' : 'Start Polling'}
      </button>
      
      <div>
        <p>Status: {isPolling ? '🟢 Live' : '⚫ Stopped'}</p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}
```

#### Polling with Dynamic Interval

```jsx
function AdaptivePolling() {
  const [data, setData] = useState(null);
  const [interval, setInterval] = useState(5000);  // Default 5s

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json);
      
      // Adjust interval based on data freshness
      if (json.urgent) {
        setInterval(1000);  // Poll faster for urgent data
      } else {
        setInterval(10000);  // Slower for normal data
      }
    };

    fetchData();
    const timer = setInterval(fetchData, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return <div>Data: {JSON.stringify(data)}</div>;
}
```

---

### Method 2: Polling with TanStack Query (Recommended)

TanStack Query has **built-in polling** via `refetchInterval`.

#### Basic Polling

```jsx
import { useQuery } from '@tanstack/react-query';

function StockPrice() {
  const { data, isLoading } = useQuery({
    queryKey: ['stock-price'],
    queryFn: async () => {
      const res = await fetch('/api/stock-price');
      return res.json();
    },
    refetchInterval: 5000  // Poll every 5 seconds
  });

  if (isLoading) return <p>Loading...</p>;

  return <h1>Price: ${data.price}</h1>;
}

// ✅ Automatic polling
// ✅ Automatic cleanup
// ✅ Background refetching
// ✅ Error handling built-in
```

#### Conditional Polling

```jsx
function OrderTracking({ orderId }) {
  const { data: order } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetch(`/api/orders/${orderId}`).then(res => res.json()),
    refetchInterval: (data) => {
      // Stop polling if order is delivered
      if (data?.status === 'delivered') {
        return false;  // Stop polling
      }
      return 3000;  // Poll every 3s
    }
  });

  return (
    <div>
      <h2>Order Status: {order?.status}</h2>
      <p>{order?.status === 'delivered' ? '✅ Delivered' : '🚚 In Transit'}</p>
    </div>
  );
}
```

#### Polling Only When Window Focused

```jsx
function LiveNotifications() {
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 10000,            // Poll every 10s
    refetchIntervalInBackground: false  // Stop when tab inactive
  });

  return (
    <div>
      <h3>Notifications ({notifications?.length})</h3>
      <ul>
        {notifications?.map(n => <li key={n.id}>{n.message}</li>)}
      </ul>
    </div>
  );
}
```

#### Polling with Loading States

```jsx
function LiveDashboard() {
  const { data, isLoading, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    refetchInterval: 5000
  });

  return (
    <div>
      <div className="status-bar">
        {isFetching && !isLoading && (
          <span>🔄 Updating...</span>
        )}
        <span>Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}</span>
      </div>

      {isLoading ? (
        <p>Loading dashboard...</p>
      ) : (
        <div>
          <h2>Sales: ${data.sales}</h2>
          <h2>Orders: {data.orders}</h2>
          <h2>Users: {data.users}</h2>
        </div>
      )}
    </div>
  );
}
```

---

### Real-World Examples

#### Example 1: Live Chat Message Count

```jsx
function ChatNotification() {
  const { data: unreadCount } = useQuery({
    queryKey: ['unread-messages'],
    queryFn: async () => {
      const res = await fetch('/api/messages/unread');
      const data = await res.json();
      return data.count;
    },
    refetchInterval: 3000,  // Check every 3 seconds
    refetchIntervalInBackground: false  // Only when tab active
  });

  return (
    <div className="notification-badge">
      💬 Messages {unreadCount > 0 && `(${unreadCount})`}
    </div>
  );
}
```

#### Example 2: Server Status Monitor

```jsx
function ServerMonitor() {
  const { data: status, isError } = useQuery({
    queryKey: ['server-status'],
    queryFn: async () => {
      const res = await fetch('/api/health');
      return res.json();
    },
    refetchInterval: 10000,  // Check every 10 seconds
    retry: 1  // Retry once on failure
  });

  return (
    <div className={`status ${status?.healthy ? 'healthy' : 'down'}`}>
      {status?.healthy ? '🟢 Server Online' : '🔴 Server Down'}
      <p>Uptime: {status?.uptime}</p>
    </div>
  );
}
```

#### Example 3: Real-Time Stock Ticker

```jsx
function StockTicker({ symbol }) {
  const { data: stock } = useQuery({
    queryKey: ['stock', symbol],
    queryFn: async () => {
      const res = await fetch(`/api/stocks/${symbol}`);
      return res.json();
    },
    refetchInterval: 2000,  // Update every 2 seconds
    staleTime: 0  // Always stale, always refetch
  });

  const priceColor = stock?.change >= 0 ? 'green' : 'red';

  return (
    <div className="stock-ticker">
      <h3>{symbol}</h3>
      <p className="price">${stock?.price}</p>
      <p style={{ color: priceColor }}>
        {stock?.change >= 0 ? '▲' : '▼'} {stock?.changePercent}%
      </p>
    </div>
  );
}
```

#### Example 4: Order Status Tracking

```jsx
function OrderStatus({ orderId }) {
  const [isDelivered, setIsDelivered] = useState(false);

  const { data: order } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${orderId}`);
      return res.json();
    },
    refetchInterval: (data) => {
      // Stop polling when delivered
      if (data?.status === 'delivered') {
        setIsDelivered(true);
        return false;  // Stop polling
      }
      return 5000;  // Poll every 5 seconds
    },
    enabled: !isDelivered  // Disable query when delivered
  });

  const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStep = statusSteps.indexOf(order?.status);

  return (
    <div>
      <h2>Order #{orderId}</h2>
      
      <div className="progress-bar">
        {statusSteps.map((step, index) => (
          <div
            key={step}
            className={index <= currentStep ? 'active' : 'inactive'}
          >
            {index <= currentStep ? '✅' : '⭕'} {step}
          </div>
        ))}
      </div>

      {order?.status === 'delivered' && (
        <p>✅ Your order has been delivered!</p>
      )}
    </div>
  );
}
```

#### Example 5: Build/Job Status Poller

```jsx
function BuildStatus({ buildId }) {
  const { data: build, refetch } = useQuery({
    queryKey: ['build', buildId],
    queryFn: async () => {
      const res = await fetch(`/api/builds/${buildId}`);
      return res.json();
    },
    refetchInterval: (data) => {
      // Poll while building
      if (data?.status === 'building') {
        return 2000;  // Check every 2 seconds
      }
      // Stop when done
      if (data?.status === 'success' || data?.status === 'failed') {
        return false;
      }
      return 5000;  // Default: 5 seconds
    }
  });

  return (
    <div>
      <h3>Build #{buildId}</h3>
      <p>Status: {build?.status}</p>
      <p>Progress: {build?.progress}%</p>

      {build?.status === 'building' && (
        <div className="spinner">🔄 Building...</div>
      )}

      {build?.status === 'success' && (
        <p>✅ Build completed successfully</p>
      )}

      {build?.status === 'failed' && (
        <p>❌ Build failed</p>
      )}
    </div>
  );
}
```

---

### Advanced Polling Patterns

#### Exponential Backoff Polling

```jsx
function SmartPolling() {
  const [pollInterval, setPollInterval] = useState(1000);

  const { data, isError } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
    refetchInterval: pollInterval,
    onError: () => {
      // Slow down polling on error
      setPollInterval(prev => Math.min(prev * 2, 60000));  // Max 1 minute
    },
    onSuccess: () => {
      // Reset to normal speed on success
      setPollInterval(1000);
    }
  });

  return <div>Data: {JSON.stringify(data)}</div>;
}
```

#### Multiple Simultaneous Polls

```jsx
function MultiPollDashboard() {
  // Poll different data at different intervals
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    refetchInterval: 10000  // Every 10s
  });

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    refetchInterval: 5000  // Every 5s
  });

  const { data: alerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    refetchInterval: 2000  // Every 2s (more urgent)
  });

  return (
    <div>
      <h2>Users: {users?.count}</h2>
      <h2>Orders: {orders?.count}</h2>
      <h2>Alerts: {alerts?.count}</h2>
    </div>
  );
}
```

#### Pause/Resume Polling

```jsx
function ControllablePolling() {
  const [isPaused, setIsPaused] = useState(false);

  const { data } = useQuery({
    queryKey: ['live-data'],
    queryFn: fetchLiveData,
    refetchInterval: isPaused ? false : 3000,  // Pause by setting to false
    enabled: !isPaused  // Optionally disable query entirely
  });

  return (
    <div>
      <button onClick={() => setIsPaused(!isPaused)}>
        {isPaused ? '▶️ Resume' : '⏸️ Pause'} Polling
      </button>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
}
```

---

### Polling Best Practices

```jsx
// ✅ GOOD: Poll only when needed
useQuery({
  queryKey: ['order', orderId],
  queryFn: fetchOrder,
  refetchInterval: (data) => {
    return data?.status === 'delivered' ? false : 5000;
  }
});

// ✅ GOOD: Stop polling when window inactive
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  refetchInterval: 5000,
  refetchIntervalInBackground: false  // Save server resources
});

// ✅ GOOD: Use appropriate intervals
useQuery({
  queryKey: ['critical-data'],
  queryFn: fetchCriticalData,
  refetchInterval: 1000  // 1s for critical data
});

useQuery({
  queryKey: ['non-critical'],
  queryFn: fetchNonCritical,
  refetchInterval: 60000  // 1min for less important data
});

// ❌ BAD: Polling too frequently
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  refetchInterval: 100  // ❌ Too fast! Wastes resources
});

// ❌ BAD: Not cleaning up manual polling
useEffect(() => {
  const interval = setInterval(fetchData, 5000);
  // ❌ Missing cleanup!
}, []);

// ✅ GOOD: Always cleanup
useEffect(() => {
  const interval = setInterval(fetchData, 5000);
  return () => clearInterval(interval);  // ✅ Cleanup
}, []);
```

---

### Polling vs WebSockets

| Feature | Polling | WebSockets |
|---------|---------|------------|
| **Connection** | HTTP requests | Persistent connection |
| **Server load** | Higher (repeated requests) | Lower (single connection) |
| **Latency** | Interval-dependent | Real-time |
| **Implementation** | Simple | More complex |
| **Fallback** | Not needed | Often uses polling |
| **Use case** | Periodic updates | True real-time |

#### When to Use Polling
- ✅ Updates every few seconds acceptable
- ✅ Simple implementation needed
- ✅ Server doesn't support WebSockets
- ✅ Data changes infrequently

#### When to Use WebSockets
- ✅ Need real-time updates (< 1s)
- ✅ High-frequency data changes
- ✅ Chat applications
- ✅ Live multiplayer games

---

### Quick Reference

```jsx
// Manual polling (useEffect)
useEffect(() => {
  const fetchData = async () => {
    const data = await fetch('/api/data');
    setData(data);
  };
  
  fetchData();  // Initial fetch
  const interval = setInterval(fetchData, 5000);  // Poll every 5s
  
  return () => clearInterval(interval);  // Cleanup
}, []);

// TanStack Query polling
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  refetchInterval: 5000  // Poll every 5 seconds
});

// Conditional polling
useQuery({
  queryKey: ['order'],
  queryFn: fetchOrder,
  refetchInterval: (data) => data?.done ? false : 3000
});

// Stop when tab inactive
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  refetchInterval: 5000,
  refetchIntervalInBackground: false
});
```

---

### Key Takeaways

- 🔁 **Polling** - Repeatedly fetch data at intervals
- ⏱️ **Manual polling** - Use `setInterval` + cleanup in `useEffect`
- 🚀 **TanStack Query** - Built-in polling with `refetchInterval`
- 🎯 **Conditional** - Stop polling with callbacks (`return false`)
- 💤 **Background** - Use `refetchIntervalInBackground: false` to pause when inactive
- ⚡ **Intervals** - Choose based on urgency (1s critical, 60s non-critical)
- 🧹 **Always cleanup** - Clear intervals to prevent memory leaks
- 🔌 **WebSockets** - Use for true real-time (< 1s latency)

---

## Tips & Best Practices

1. **Always use keys in lists** - Helps React identify which items changed
2. **Don't mutate state directly** - Use setter functions: `setState(newValue)`
3. **Keep state as local as possible** - Only lift up when necessary
4. **One component per file** (in real projects) - Better organization
5. **Name components with PascalCase** - `MyComponent`, not `myComponent`
6. **Use destructuring for props** - Cleaner and more readable
7. **Clean up effects** - Return cleanup function from useEffect
8. **Don't call hooks conditionally** - Always at top level of component

---

## 🧭 React Router - Client-Side Routing

### What is React Router?

**React Router** is the standard routing library for React. It enables **navigation between different pages/views** in a single-page application (SPA) without full page reloads.

### The Problem: Single-Page Apps

Traditional websites:
```
User clicks link → Browser requests new page → Server sends HTML → Full page reload
```

React apps without router:
```
Everything on one page → No URL changes → Can't bookmark or share specific views
```

React apps with router:
```
User clicks link → URL changes → React Router shows different component → No page reload ✅
```

### Why Use React Router?

1. **Navigation without page reloads** - Instant transitions between views
2. **URL-based navigation** - Each view has its own URL
3. **Bookmarkable pages** - Users can bookmark specific views
4. **Browser history** - Back/forward buttons work correctly
5. **Nested routing** - Routes within routes (layouts)
6. **Dynamic routing** - URLs with parameters (e.g., `/user/123`)

---

### Installation

```bash
npm install react-router-dom
```

**Note:** Use `react-router-dom` for web apps (not just `react-router`)

---

### Basic Concepts

#### 1. **Router** - Wraps your entire app
#### 2. **Routes** - Defines all possible routes
#### 3. **Route** - Maps a URL path to a component
#### 4. **Link** - Navigation component (replaces `<a>`)
#### 5. **Outlet** - Placeholder for nested routes

---

### Setup Methods

React Router v6 offers **two approaches**: traditional (component-based) and modern (data router).

---

### Method 1: Traditional Setup (Component-Based)

#### Step 1: Wrap app with BrowserRouter

```jsx
// main.jsx or index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

#### Step 2: Define routes in App component

```jsx
// App.jsx
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <div>
      {/* Navigation */}
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      {/* Route definitions */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
```

#### Step 3: Create page components

```jsx
// pages/Home.jsx
function Home() {
  return <h1>Home Page</h1>;
}

export default Home;

// pages/About.jsx
function About() {
  return <h1>About Page</h1>;
}

export default About;
```

---

### Method 2: Modern Setup (createBrowserRouter) ⭐ RECOMMENDED

The **modern approach** uses `createBrowserRouter` to define routes as **data objects**. This enables advanced features like data loaders, actions, and better error handling.

#### Step 1: Create router object

```jsx
// main.jsx or router.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import ErrorPage from './pages/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'contact',
        element: <Contact />
      }
    ]
  }
]);

export default router;
```

#### Step 2: Use RouterProvider in main.jsx

```jsx
// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

#### Step 3: Create Root layout with Outlet

```jsx
// routes/Root.jsx
import { Outlet, Link, useNavigation } from 'react-router-dom';

export default function Root() {
  const navigation = useNavigation();

  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <main>
        {navigation.state === 'loading' && <div>Loading...</div>}
        <Outlet />  {/* Child routes render here */}
      </main>

      <footer>© 2025 My App</footer>
    </div>
  );
}
```

---

### Modern Router: Complete Example

```jsx
// router.jsx
import { createBrowserRouter } from 'react-router-dom';
import Root from './routes/Root';
import Home from './pages/Home';
import About from './pages/About';
import Products, { loader as productsLoader } from './pages/Products';
import ProductDetail, { loader as productLoader } from './pages/ProductDetail';
import ErrorPage from './pages/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,  // Matches exactly "/"
        element: <Home />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'products',
        element: <Products />,
        loader: productsLoader  // Data loader
      },
      {
        path: 'products/:id',
        element: <ProductDetail />,
        loader: productLoader
      }
    ]
  }
]);

export default router;
```

```jsx
// pages/Products.jsx
import { useLoaderData } from 'react-router-dom';

// Loader function - fetches data before component renders
export async function loader() {
  const res = await fetch('/api/products');
  if (!res.ok) throw new Response('Failed to load', { status: 500 });
  return res.json();
}

export default function Products() {
  const products = useLoaderData();  // Access loaded data

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

### Comparison: Traditional vs Modern

| Feature | Traditional (`<Routes>`) | Modern (`createBrowserRouter`) |
|---------|--------------------------|--------------------------------|
| **Setup** | JSX components | JavaScript objects |
| **Data loading** | useEffect in component | `loader` function (before render) |
| **Error handling** | Try-catch + state | `errorElement` (built-in) |
| **Form actions** | onSubmit handlers | `action` function |
| **Pending UI** | Manual loading state | `useNavigation()` hook |
| **Code splitting** | React.lazy | Built-in with loaders |
| **Type safety** | Basic | Better with loaders |
| **Recommended** | ❌ Old way | ✅ New way |

---

### Advanced Modern Router Features

#### 1. Data Loaders

```jsx
// Fetch data BEFORE component renders
const router = createBrowserRouter([
  {
    path: '/user/:id',
    element: <UserProfile />,
    loader: async ({ params }) => {
      const res = await fetch(`/api/users/${params.id}`);
      return res.json();
    }
  }
]);

// Component
import { useLoaderData } from 'react-router-dom';

function UserProfile() {
  const user = useLoaderData();  // Data already loaded!
  return <h1>{user.name}</h1>;
}
```

#### 2. Form Actions

```jsx
// Handle form submissions server-side style
const router = createBrowserRouter([
  {
    path: '/create-post',
    element: <CreatePost />,
    action: async ({ request }) => {
      const formData = await request.formData();
      const post = {
        title: formData.get('title'),
        content: formData.get('content')
      };
      await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify(post)
      });
      return redirect('/posts');
    }
  }
]);

// Component
import { Form } from 'react-router-dom';

function CreatePost() {
  return (
    <Form method="post">  {/* Uses action automatically */}
      <input name="title" />
      <textarea name="content" />
      <button type="submit">Create</button>
    </Form>
  );
}
```

#### 3. Error Boundaries

```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,  // Catches all errors
    children: [
      {
        path: 'user/:id',
        element: <User />,
        loader: async ({ params }) => {
          const res = await fetch(`/api/users/${params.id}`);
          if (!res.ok) {
            throw new Response('User not found', { status: 404 });
          }
          return res.json();
        }
      }
    ]
  }
]);

// ErrorPage.jsx
import { useRouteError } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();

  return (
    <div>
      <h1>Oops!</h1>
      <p>{error.statusText || error.message}</p>
    </div>
  );
}
```

#### 4. Nested Routes with Loaders

```jsx
const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    loader: dashboardLoader,  // Parent loader
    children: [
      {
        path: 'overview',
        element: <Overview />,
        loader: overviewLoader  // Child loader (runs after parent)
      },
      {
        path: 'stats',
        element: <Stats />,
        loader: statsLoader
      }
    ]
  }
]);
```

#### 5. Lazy Loading Routes

```jsx
import { lazy } from 'react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'products',
        lazy: async () => {
          const { Products, loader } = await import('./pages/Products');
          return { Component: Products, loader };
        }
      }
    ]
  }
]);
```

---

### When to Use Each Method

#### Use Traditional (`<Routes>`) when:
- ✅ Simple app with basic routing
- ✅ No complex data fetching
- ✅ Already familiar with component-based approach
- ✅ Migrating from old React Router

#### Use Modern (`createBrowserRouter`) when: ⭐
- ✅ **New projects** (recommended)
- ✅ Need data loaders
- ✅ Want better error handling
- ✅ Using form actions
- ✅ Need loading states
- ✅ Want code splitting
- ✅ Building production apps

---

### Migration Example

**Before (Traditional):**
```jsx
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

**After (Modern):**
```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}
```

---

### Quick Reference: Modern Router

```jsx
// 1. Create router
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <Error />,
    loader: dataLoader,
    action: formAction,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> }
    ]
  }
]);

// 2. Render
<RouterProvider router={router} />

// 3. Use in components
import { useLoaderData, useNavigation, Form } from 'react-router-dom';

const data = useLoaderData();
const navigation = useNavigation();
```

---

### Navigation with Link

#### Link vs `<a>` tag

```jsx
// ❌ BAD - Causes full page reload
<a href="/about">About</a>

// ✅ GOOD - Client-side navigation (no reload)
<Link to="/about">About</Link>
```

#### Styling active links

```jsx
import { NavLink } from 'react-router-dom';

// NavLink adds 'active' class automatically
<NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''}>
  Home
</NavLink>

// CSS
.active-link {
  color: blue;
  font-weight: bold;
}
```

---

### 🔗 Link vs NavLink - Complete Comparison

#### Overview

| Component | Purpose | Active State | Use Case |
|-----------|---------|--------------|----------|
| **Link** | Basic navigation | ❌ No | Regular links, buttons, cards |
| **NavLink** | Navigation with styling | ✅ Yes | Navigation menus, tabs, breadcrumbs |

---

#### 1. Link - Basic Navigation

**Purpose:** Navigate between pages without page reload.

##### Basic Usage

```jsx
import { Link } from 'react-router-dom';

function App() {
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
    </div>
  );
}

// Renders as: <a href="/">Home</a>
// But with client-side navigation (no page reload)
```

##### Link with Relative Paths

```jsx
// Absolute path (from root)
<Link to="/products">Products</Link>

// Relative path (from current route)
<Link to="details">Details</Link>  // If at /products → goes to /products/details
<Link to="../">Back</Link>         // Go up one level
```

##### Link with State

```jsx
// Pass state to next route
<Link 
  to="/profile" 
  state={{ from: 'homepage', userId: 123 }}
>
  Go to Profile
</Link>

// Access in destination component
import { useLocation } from 'react-router-dom';

function Profile() {
  const location = useLocation();
  console.log(location.state);  // { from: 'homepage', userId: 123 }
  
  return <h1>Profile</h1>;
}
```

##### Link with Replace

```jsx
// Replace history (can't go back)
<Link to="/login" replace>
  Login
</Link>

// Normal: Home → About → Contact (can go back)
// Replace: Home → Contact (About removed from history)
```

##### Styling Link

```jsx
// Inline style
<Link to="/about" style={{ color: 'blue', textDecoration: 'none' }}>
  About
</Link>

// CSS class
<Link to="/about" className="nav-link">
  About
</Link>

// CSS
.nav-link {
  color: #333;
  text-decoration: none;
  padding: 10px;
}

.nav-link:hover {
  color: blue;
}
```

---

#### 2. NavLink - Navigation with Active State

**Purpose:** Navigate with automatic styling for the active/current page.

##### Basic Usage

```jsx
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/contact">Contact</NavLink>
    </nav>
  );
}

// NavLink automatically adds "active" class to the current page link
// <a href="/" class="active">Home</a>  (when on home page)
```

##### Styling with className Function

```jsx
<NavLink 
  to="/about"
  className={({ isActive }) => isActive ? 'active-link' : 'link'}
>
  About
</NavLink>

// CSS
.link {
  color: #333;
  text-decoration: none;
}

.active-link {
  color: blue;
  font-weight: bold;
  border-bottom: 2px solid blue;
}
```

##### Styling with style Function

```jsx
<NavLink
  to="/about"
  style={({ isActive }) => ({
    color: isActive ? 'blue' : '#333',
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: 'none'
  })}
>
  About
</NavLink>
```

##### Using isActive and isPending

```jsx
<NavLink
  to="/about"
  className={({ isActive, isPending }) => {
    if (isPending) return 'pending';
    if (isActive) return 'active';
    return 'link';
  }}
>
  About
</NavLink>

// CSS
.link { color: #333; }
.active { color: blue; font-weight: bold; }
.pending { color: gray; opacity: 0.7; }  /* While navigating */
```

##### Custom Active Content

```jsx
<NavLink to="/about">
  {({ isActive }) => (
    <span>
      {isActive && '👉 '}
      About
      {isActive && ' ✓'}
    </span>
  )}
</NavLink>

// Result when active: 👉 About ✓
// Result when inactive: About
```

---

#### Comparison Examples

##### Example 1: Simple Links

```jsx
// Link - No active styling
<Link to="/about">About</Link>
// Always looks the same, whether active or not

// NavLink - Automatic active styling
<NavLink to="/about">About</NavLink>
// Gets "active" class when on /about
```

##### Example 2: Navigation Menu

```jsx
// ❌ Using Link (manual active detection)
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav>
      <Link 
        to="/" 
        className={location.pathname === '/' ? 'active' : ''}
      >
        Home
      </Link>
      <Link 
        to="/about" 
        className={location.pathname === '/about' ? 'active' : ''}
      >
        About
      </Link>
    </nav>
  );
}

// ✅ Using NavLink (automatic)
function Navigation() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/about">About</NavLink>
    </nav>
  );
}

// CSS handles active styling
.active {
  color: blue;
  font-weight: bold;
}
```

##### Example 3: Horizontal Navigation Bar

```jsx
function Navbar() {
  return (
    <nav className="navbar">
      <NavLink 
        to="/"
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Home
      </NavLink>
      <NavLink 
        to="/products"
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Products
      </NavLink>
      <NavLink 
        to="/about"
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        About
      </NavLink>
    </nav>
  );
}

// CSS
.navbar {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #f5f5f5;
}

.nav-link {
  color: #333;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 5px;
  transition: all 0.3s;
}

.nav-link:hover {
  background: #ddd;
}

.nav-link.active {
  background: blue;
  color: white;
  font-weight: bold;
}
```

##### Example 4: Sidebar Navigation

```jsx
function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink
        to="/dashboard"
        className={({ isActive }) => 
          `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
        }
      >
        📊 Dashboard
      </NavLink>
      
      <NavLink
        to="/profile"
        className={({ isActive }) => 
          `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
        }
      >
        👤 Profile
      </NavLink>
      
      <NavLink
        to="/settings"
        className={({ isActive }) => 
          `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
        }
      >
        ⚙️ Settings
      </NavLink>
    </aside>
  );
}

// CSS
.sidebar {
  width: 250px;
  background: #2c3e50;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar-link {
  color: white;
  text-decoration: none;
  padding: 12px 15px;
  border-radius: 5px;
  transition: background 0.3s;
}

.sidebar-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-link-active {
  background: #3498db;
  font-weight: bold;
}
```

---

#### When to Use Each

##### Use Link when:
- ✅ Regular page navigation (not in nav menu)
- ✅ Button-style navigation
- ✅ Links in content/cards
- ✅ No need to show active state
- ✅ Navigation that's not repetitive

```jsx
// Regular content links
<div className="article">
  <h2>Read More</h2>
  <Link to="/articles/123">View Article</Link>
</div>

// Button-style navigation
<button>
  <Link to="/checkout">Proceed to Checkout</Link>
</button>

// Cards
<div className="card">
  <h3>Product Name</h3>
  <Link to={`/products/${id}`}>View Details</Link>
</div>
```

##### Use NavLink when:
- ✅ Navigation menus (header, sidebar)
- ✅ Tabs
- ✅ Breadcrumbs
- ✅ Any navigation where showing "current page" is important
- ✅ Need to highlight active/current page

```jsx
// Header navigation
<header>
  <nav>
    <NavLink to="/">Home</NavLink>
    <NavLink to="/products">Products</NavLink> 
    <NavLink to="/about">About</NavLink>
  </nav>
</header>

// Tabs
<div className="tabs">
  <NavLink to="/profile/posts">Posts</NavLink>
  <NavLink to="/profile/photos">Photos</NavLink>
  <NavLink to="/profile/videos">Videos</NavLink>
</div>

// Breadcrumbs
<div className="breadcrumbs">
  <NavLink to="/">Home</NavLink> / 
  <NavLink to="/products">Products</NavLink> / 
  <span>Details</span>
</div>
```

---

#### Advanced Patterns

##### Pattern 1: Conditional NavLink Styling

```jsx
function Navigation() {
  return (
    <nav>
      <NavLink
        to="/"
        end  // Only active when exactly at "/"
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        Home
      </NavLink>
      
      <NavLink
        to="/products"
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        Products
      </NavLink>
    </nav>
  );
}

// Without "end":
// At /products/123 → Both "/" and "/products" are active ❌

// With "end" on "/":
// At /products/123 → Only "/products" is active ✅
```

##### Pattern 2: NavLink with Icons

```jsx
function Sidebar() {
  return (
    <nav>
      <NavLink to="/dashboard">
        {({ isActive }) => (
          <div className={`nav-item ${isActive ? 'active' : ''}`}>
            <span className="icon">📊</span>
            <span>Dashboard</span>
            {isActive && <span className="indicator">●</span>}
          </div>
        )}
      </NavLink>
    </nav>
  );
}
```

##### Pattern 3: Link with Custom Click Handler

```jsx
function Navigation() {
  const handleClick = () => {
    console.log('Navigating...');
    // Track analytics, etc.
  };

  return (
    <Link to="/about" onClick={handleClick}>
      About
    </Link>
  );
}
```

##### Pattern 4: Programmatic NavLink

```jsx
import { useNavigate, useLocation } from 'react-router-dom';

function CustomNavButton({ to, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <button
      className={isActive ? 'active' : ''}
      onClick={() => navigate(to)}
    >
      {children}
    </button>
  );
}
```

---

#### Common Patterns

##### Pattern 1: Mobile Menu with NavLink

```jsx
function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>☰ Menu</button>
      
      {isOpen && (
        <nav className="mobile-nav">
          <NavLink 
            to="/" 
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Home
          </NavLink>
          <NavLink 
            to="/products" 
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Products
          </NavLink>
        </nav>
      )}
    </div>
  );
}
```

##### Pattern 2: Styled Components with NavLink

```jsx
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const StyledNavLink = styled(NavLink)`
  color: #333;
  text-decoration: none;
  padding: 10px 15px;
  
  &.active {
    color: blue;
    font-weight: bold;
    border-bottom: 2px solid blue;
  }
  
  &:hover {
    background: #f5f5f5;
  }
`;

function Navigation() {
  return (
    <nav>
      <StyledNavLink to="/">Home</StyledNavLink>
      <StyledNavLink to="/about">About</StyledNavLink>
    </nav>
  );
}
```

---

#### Quick Reference

```jsx
// Link - Basic navigation
<Link to="/about">About</Link>
<Link to="/profile" state={{ userId: 123 }}>Profile</Link>
<Link to="/login" replace>Login</Link>

// NavLink - Navigation with active state
<NavLink to="/about">About</NavLink>
<NavLink 
  to="/about"
  className={({ isActive }) => isActive ? 'active' : ''}
>
  About
</NavLink>
<NavLink 
  to="/about"
  style={({ isActive }) => ({ color: isActive ? 'blue' : 'black' })}
>
  About
</NavLink>
<NavLink to="/" end>Home</NavLink>  {/* Exact match */}
```

---

#### Key Takeaways

- 🔗 **Link** - Basic navigation, no active state detection
- 🎯 **NavLink** - Navigation with automatic active styling
- ✅ **Use Link for** - Regular links, buttons, cards, content
- ✅ **Use NavLink for** - Menus, tabs, breadcrumbs, sidebars
- 🎨 **className/style** - Can be function with `isActive`
- 🔚 **end prop** - Exact path matching (for "/" routes)
- 📦 **state prop** - Pass data between routes
- 🔄 **replace prop** - Replace history entry
- ⚡ **isPending** - Shows loading state during navigation

**Rule of thumb:** If it's a navigation menu → use **NavLink**. Everything else → use **Link**.

---

### Dynamic Routes (URL Parameters)

#### Define route with parameter

```jsx
<Routes>
  <Route path="/user/:id" element={<UserProfile />} />
  <Route path="/product/:productId" element={<Product />} />
</Routes>
```

#### Access parameter in component

```jsx
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { id } = useParams();  // Get :id from URL
  
  return <h1>User Profile #{id}</h1>;
}

// URL: /user/123 → Shows: User Profile #123
// URL: /user/456 → Shows: User Profile #456
```

#### Multiple parameters

```jsx
<Route path="/blog/:category/:postId" element={<BlogPost />} />

function BlogPost() {
  const { category, postId } = useParams();
  
  return (
    <div>
      <p>Category: {category}</p>
      <p>Post ID: {postId}</p>
    </div>
  );
}

// URL: /blog/tech/42 → Category: tech, Post ID: 42
```

---

### 🔗 useParams() - Access URL Parameters

#### What is useParams()?

A **React Router hook** that returns an object of key-value pairs from the current URL's dynamic segments (parameters).

#### Where is it used?

**Use `useParams()` when you need to:**
1. Get user/product/post ID from URL
2. Fetch data based on URL parameter
3. Display content specific to URL
4. Build detail pages (user profiles, product pages, blog posts)

---

#### Basic Usage

```jsx
// 1. Define route with parameter (use colon :)
<Route path="/user/:userId" element={<UserProfile />} />

// 2. Access parameter in component
import { useParams } from 'react-router-dom';

function UserProfile() {
  const params = useParams();
  console.log(params);  // { userId: "123" }
  
  return <h1>User ID: {params.userId}</h1>;
}

// URL: /user/123 → User ID: 123
```

#### Destructuring (Most Common)

```jsx
function UserProfile() {
  const { userId } = useParams();  // ✅ Destructure directly
  
  return <h1>User ID: {userId}</h1>;
}
```

---

#### Real-World Example: Fetch Data with useParams

```jsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function UserProfile() {
  const { userId } = useParams();  // Get ID from URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data based on userId
    fetch(`https://api.example.com/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);  // Re-fetch when userId changes

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Age: {user.age}</p>
    </div>
  );
}

// Route setup
<Route path="/user/:userId" element={<UserProfile />} />

// URL: /user/5 → Fetches user with ID 5
// URL: /user/10 → Fetches user with ID 10
```

---

#### Multiple Parameters

```jsx
// Route with multiple params
<Route path="/store/:category/:productId" element={<ProductDetail />} />

function ProductDetail() {
  const { category, productId } = useParams();
  
  return (
    <div>
      <h2>Category: {category}</h2>
      <h3>Product ID: {productId}</h3>
    </div>
  );
}

// URL: /store/electronics/42
// Output: Category: electronics, Product ID: 42
```

---

#### Optional Parameters (with ?)

```jsx
// Optional parameter
<Route path="/search/:query?" element={<SearchResults />} />

function SearchResults() {
  const { query } = useParams();
  
  return (
    <div>
      {query ? (
        <p>Searching for: {query}</p>
      ) : (
        <p>No search query provided</p>
      )}
    </div>
  );
}

// URL: /search/react → Searching for: react
// URL: /search → No search query provided
```

---

#### Nested Routes with Parameters

```jsx
function App() {
  return (
    <Routes>
      <Route path="/users" element={<Users />}>
        <Route path=":userId" element={<UserDetail />} />
        <Route path=":userId/posts" element={<UserPosts />} />
        <Route path=":userId/posts/:postId" element={<PostDetail />} />
      </Route>
    </Routes>
  );
}

function UserDetail() {
  const { userId } = useParams();
  return <h2>User {userId} Details</h2>;
}

function PostDetail() {
  const { userId, postId } = useParams();
  
  return (
    <div>
      <p>User: {userId}</p>
      <p>Post: {postId}</p>
    </div>
  );
}

// URL: /users/5 → User 5 Details
// URL: /users/5/posts → User 5's posts
// URL: /users/5/posts/10 → User: 5, Post: 10
```

---

#### Common Use Cases

##### 1. Blog Post Detail Page
```jsx
// Route
<Route path="/blog/:slug" element={<BlogPost />} />

// Component
function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then(res => res.json())
      .then(data => setPost(data));
  }, [slug]);

  if (!post) return <p>Loading...</p>;

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}

// URL: /blog/react-hooks-guide
```

##### 2. E-commerce Product Page
```jsx
// Route
<Route path="/products/:id" element={<ProductPage />} />

// Component
function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) return <p>Loading product...</p>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
      <button>Add to Cart</button>
    </div>
  );
}

// URL: /products/42
```

##### 3. User Profile with Tabs
```jsx
// Routes
<Route path="/profile/:username" element={<Profile />}>
  <Route path="posts" element={<UserPosts />} />
  <Route path="followers" element={<Followers />} />
  <Route path="following" element={<Following />} />
</Route>

// Component
import { useParams, Outlet, Link } from 'react-router-dom';

function Profile() {
  const { username } = useParams();

  return (
    <div>
      <h1>@{username}</h1>
      <nav>
        <Link to={`/profile/${username}/posts`}>Posts</Link>
        <Link to={`/profile/${username}/followers`}>Followers</Link>
        <Link to={`/profile/${username}/following`}>Following</Link>
      </nav>
      <Outlet />  {/* Nested routes render here */}
    </div>
  );
}

function UserPosts() {
  const { username } = useParams();
  return <p>Posts by {username}</p>;
}

// URL: /profile/john/posts → Shows John's posts
// URL: /profile/sarah/followers → Shows Sarah's followers
```

---

#### Type Conversion (Important!)

```jsx
function ProductPage() {
  const { id } = useParams();
  
  console.log(typeof id);  // "string" ⚠️
  
  // ❌ WRONG - id is string, not number
  if (id === 123) {  // Always false!
    console.log('Product 123');
  }
  
  // ✅ CORRECT - Convert to number
  const productId = Number(id);
  if (productId === 123) {
    console.log('Product 123');
  }
  
  // ✅ Or use parseInt
  const numericId = parseInt(id, 10);
}
```

**Remember:** useParams() always returns **strings**, convert if needed!

---

#### Using with Navigate (Programmatic)

```jsx
import { useParams, useNavigate } from 'react-router-dom';

function EditUser() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const handleSave = () => {
    // Save user data...
    
    // Navigate back to user profile
    navigate(`/user/${userId}`);
  };

  return (
    <div>
      <h2>Editing User {userId}</h2>
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

// Route
<Route path="/user/:userId/edit" element={<EditUser />} />

// URL: /user/5/edit → After save → /user/5
```

---

#### 404 with Invalid Parameter

```jsx
function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => setNotFound(true));
  }, [userId]);

  if (notFound) return <h1>User not found!</h1>;
  if (!user) return <p>Loading...</p>;

  return <h1>{user.name}</h1>;
}

// URL: /user/999 (doesn't exist) → User not found!
```

---

#### Quick Reference

```jsx
// 1. Define route with parameter
<Route path="/user/:id" element={<User />} />

// 2. Access in component
import { useParams } from 'react-router-dom';

function User() {
  const { id } = useParams();  // Get parameter
  return <h1>User {id}</h1>;
}

// 3. Multiple parameters
<Route path="/:category/:id" element={<Item />} />

function Item() {
  const { category, id } = useParams();
  return <p>{category} - {id}</p>;
}

// 4. Use with useEffect (fetch data)
useEffect(() => {
  fetch(`/api/users/${id}`)
    .then(res => res.json())
    .then(setUser);
}, [id]);
```

---

#### Key Takeaways

- 🔑 **useParams()** - Extracts dynamic segments from URL
- 🔑 **Used in component** that's rendered by `<Route path=".../:param">`
- 🔑 **Always returns strings** - Convert to number if needed
- 🔑 **Common pattern** - Use with useEffect to fetch data
- 🔑 **Multiple params** - Destructure all: `const { id, category } = useParams()`
- 🔑 **Syntax** - Route: `/user/:id` → Component: `const { id } = useParams()`

**When to use:** Any time you need to read dynamic parts of the URL (IDs, slugs, categories, etc.)

---

### Programmatic Navigation

#### Using useNavigate hook

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // After login logic...
    navigate('/dashboard');  // Navigate programmatically
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" />
      <button type="submit">Login</button>
    </form>
  );
}
```

#### Navigation options

```jsx
const navigate = useNavigate();

// Navigate to path
navigate('/about');

// Navigate back
navigate(-1);

// Navigate forward
navigate(1);

// Replace history (can't go back)
navigate('/dashboard', { replace: true });

// With state
navigate('/profile', { state: { from: 'login' } });
```

---

### Nested Routes (Layouts)

#### Define layout with nested routes

```jsx
import { Routes, Route, Outlet } from 'react-router-dom';

// Layout component
function Layout() {
  return (
    <div>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
        </nav>
      </header>
      
      <main>
        <Outlet />  {/* Child routes render here */}
      </main>
      
      <footer>© 2025 My App</footer>
    </div>
  );
}

// App with nested routes
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />  {/* Matches exactly "/" */}
        <Route path="products" element={<Products />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  );
}
```

**Result:** Header and footer appear on all pages, only `<Outlet />` content changes.

---

### 🪆 `<Outlet>` - Render Nested Routes

#### What is `<Outlet>`?

A **React Router component** that acts as a **placeholder** for child routes. It renders the matching child route component in a layout.

**Think of it as:** "Insert child route content here"

---

#### Why Use `<Outlet>`?

**Problem:** You want a consistent layout (header, sidebar, footer) across multiple pages.

**Without Outlet (Repetitive):**
```jsx
function Home() {
  return (
    <div>
      <Header />  {/* Repeated */}
      <h1>Home Content</h1>
      <Footer />  {/* Repeated */}
    </div>
  );
}

function About() {
  return (
    <div>
      <Header />  {/* Repeated */}
      <h1>About Content</h1>
      <Footer />  {/* Repeated */}
    </div>
  );
}

// ❌ Header and Footer duplicated in every component
```

**With Outlet (DRY - Don't Repeat Yourself):**
```jsx
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div>
      <Header />  {/* Once */}
      <Outlet />  {/* Child content goes here */}
      <Footer />  {/* Once */}
    </div>
  );
}

function Home() {
  return <h1>Home Content</h1>;  // No repetition
}

function About() {
  return <h1>About Content</h1>;  // No repetition
}

// ✅ Header and Footer defined once
```

---

#### Basic Usage

```jsx
import { Routes, Route, Outlet, Link } from 'react-router-dom';

// Layout with Outlet
function Layout() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      
      <main>
        <Outlet />  {/* Child routes render here */}
      </main>
      
      <footer>© 2025</footer>
    </div>
  );
}

// Page components
function Home() {
  return <h1>Home Page</h1>;
}

function About() {
  return <h1>About Page</h1>;
}

function Contact() {
  return <h1>Contact Page</h1>;
}

// Route setup
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

// URL: "/" → Layout renders with Home in <Outlet />
// URL: "/about" → Layout renders with About in <Outlet />
// URL: "/contact" → Layout renders with Contact in <Outlet />
```

---

#### How It Works

1. **User navigates to `/about`**
2. **React Router matches** `<Route path="/" element={<Layout />}>`
3. **Renders Layout component**
4. **Finds nested route** `<Route path="about" element={<About />}>`
5. **Renders `<About />`** inside `<Outlet />`

**Visual representation:**
```
┌─────────────────────────┐
│      Layout             │
│  ┌─────────────────┐    │
│  │   Navigation    │    │
│  └─────────────────┘    │
│  ┌─────────────────┐    │
│  │   <Outlet />    │ ← Child route renders here
│  │   (About page)  │    │
│  └─────────────────┘    │
│  ┌─────────────────┐    │
│  │     Footer      │    │
│  └─────────────────┘    │
└─────────────────────────┘
```

---

#### Multiple Levels of Nesting

```jsx
function App() {
  return (
    <Routes>
      {/* Level 1: Root layout */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        
        {/* Level 2: Dashboard layout */}
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}

// Root layout (outer)
function RootLayout() {
  return (
    <div>
      <header>Main Header</header>
      <Outlet />  {/* DashboardLayout or Home renders here */}
      <footer>Main Footer</footer>
    </div>
  );
}

// Dashboard layout (inner)
function DashboardLayout() {
  return (
    <div className="dashboard">
      <aside>Dashboard Sidebar</aside>
      <main>
        <Outlet />  {/* Dashboard pages render here */}
      </main>
    </div>
  );
}

// URL: "/" → RootLayout with Home
// URL: "/dashboard" → RootLayout > DashboardLayout > DashboardHome
// URL: "/dashboard/profile" → RootLayout > DashboardLayout > Profile
```

**Visual:**
```
┌───────────────────────────────┐
│     RootLayout (Header)       │
│  ┌─────────────────────────┐  │
│  │   DashboardLayout       │  │
│  │ ┌─────┐  ┌───────────┐ │  │
│  │ │Side │  │ <Outlet/> │ │  │
│  │ │bar  │  │ (Profile) │ │  │
│  │ └─────┘  └───────────┘ │  │
│  └─────────────────────────┘  │
│     RootLayout (Footer)       │
└───────────────────────────────┘
```

---

#### Sharing Data with Context

```jsx
import { Outlet, useOutletContext } from 'react-router-dom';
import { useState } from 'react';

// Layout provides context
function Layout() {
  const [user, setUser] = useState({ name: 'John' });

  return (
    <div>
      <nav>Navigation</nav>
      <Outlet context={{ user, setUser }} />  {/* Pass data to children */}
      <footer>Footer</footer>
    </div>
  );
}

// Child component consumes context
function Profile() {
  const { user, setUser } = useOutletContext();
  
  return (
    <div>
      <h1>Profile: {user.name}</h1>
      <button onClick={() => setUser({ name: 'Jane' })}>
        Change Name
      </button>
    </div>
  );
}
```

---

#### Real-World Example: Admin Dashboard

```jsx
import { Routes, Route, Outlet, Link, Navigate } from 'react-router-dom';

// Admin Layout with Outlet
function AdminLayout() {
  const isAdmin = true;  // Check authentication

  if (!isAdmin) {
    return <Navigate to="/login" />;  // Redirect if not admin
  }

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/products">Products</Link>
          <Link to="/admin/settings">Settings</Link>
        </nav>
      </aside>
      
      <main className="content">
        <Outlet />  {/* Admin pages render here */}
      </main>
    </div>
  );
}

// Admin pages
function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome to admin panel</p>
    </div>
  );
}

function Users() {
  return <h1>Manage Users</h1>;
}

function Products() {
  return <h1>Manage Products</h1>;
}

function Settings() {
  return <h1>Admin Settings</h1>;
}

// Route setup
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      {/* Admin routes with shared layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

// URL: /admin → AdminLayout with AdminDashboard
// URL: /admin/users → AdminLayout with Users
// All admin pages share the same sidebar and layout!
```

---

#### With Loading States

```jsx
import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';

function Layout() {
  return (
    <div>
      <header>Header</header>
      
      <Suspense fallback={<div>Loading page...</div>}>
        <Outlet />  {/* Shows loading while child loads */}
      </Suspense>
      
      <footer>Footer</footer>
    </div>
  );
}
```

---

#### Conditional Outlet Rendering

```jsx
function Layout() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="layout">
      {showSidebar && <Sidebar />}
      
      <main className={showSidebar ? 'with-sidebar' : 'full-width'}>
        <button onClick={() => setShowSidebar(!showSidebar)}>
          Toggle Sidebar
        </button>
        <Outlet />  {/* Always renders matched child */}
      </main>
    </div>
  );
}
```

---

#### Outlet with Parameters

```jsx
function App() {
  return (
    <Routes>
      <Route path="/users" element={<UsersLayout />}>
        <Route path=":userId" element={<UserProfile />} />
        <Route path=":userId/posts" element={<UserPosts />} />
      </Route>
    </Routes>
  );
}

function UsersLayout() {
  return (
    <div>
      <h1>Users Section</h1>
      <Outlet />  {/* UserProfile or UserPosts renders here */}
    </div>
  );
}

function UserProfile() {
  const { userId } = useParams();
  return <h2>Profile for User {userId}</h2>;
}

// URL: /users/5 → UsersLayout with UserProfile (userId=5)
// URL: /users/5/posts → UsersLayout with UserPosts (userId=5)
```

---

#### Default/Fallback Content

```jsx
function Layout() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      
      <main>
        <Outlet />
        {/* If no child route matches, Outlet renders nothing */}
        {/* You can add fallback content after */}
      </main>
    </div>
  );
}

// Better: Use index route
<Route path="/" element={<Layout />}>
  <Route index element={<DefaultContent />} />  {/* Renders at "/" */}
  <Route path="about" element={<About />} />
</Route>
```

---

#### Common Patterns

##### 1. Protected Routes
```jsx
function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Header />
      <Outlet />  {/* Only renders if authenticated */}
      <Footer />
    </div>
  );
}

<Route element={<ProtectedLayout />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/profile" element={<Profile />} />
</Route>
```

##### 2. Breadcrumbs
```jsx
function Layout() {
  const location = useLocation();

  return (
    <div>
      <nav>
        <Breadcrumbs path={location.pathname} />
      </nav>
      <Outlet />
    </div>
  );
}
```

##### 3. Persistent State
```jsx
function Layout() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <SearchBar query={searchQuery} setQuery={setSearchQuery} />
      <Outlet context={{ searchQuery }} />  {/* Pass to children */}
    </div>
  );
}
```

---

#### Quick Reference

```jsx
// 1. Basic layout
function Layout() {
  return (
    <div>
      <Header />
      <Outlet />  {/* Children render here */}
      <Footer />
    </div>
  );
}

// 2. Route setup
<Route path="/" element={<Layout />}>
  <Route index element={<Home />} />
  <Route path="about" element={<About />} />
</Route>

// 3. Pass context to children
<Outlet context={{ data }} />

// 4. Consume context in child
const { data } = useOutletContext();

// 5. Nested outlets
function OuterLayout() {
  return <div><Outlet /></div>;  // Renders InnerLayout
}

function InnerLayout() {
  return <div><Outlet /></div>;  // Renders actual page
}
```

---

#### Key Takeaways

- 🪆 **`<Outlet />`** - Placeholder for nested child routes
- 📍 **Renders matched child** - Shows the active nested route component
- 🎨 **Shared layouts** - Keep header/footer/sidebar consistent
- 🔗 **Nested routing** - Support multiple levels of nesting
- 📤 **Context sharing** - Pass data to children via `context` prop
- 🔐 **Protected routes** - Wrap with authentication logic
- 🎯 **Use case** - Any time you want a persistent layout across routes

**Remember:** `<Outlet />` is like `{children}` but for routes!

---

### Index Routes

```jsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />  {/* Default child route */}
    <Route path="about" element={<About />} />
  </Route>
</Routes>

// URL: "/" → Shows Layout with Home
// URL: "/about" → Shows Layout with About
```

---

### 404 Not Found Page

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  
  {/* Catch-all route (must be last) */}
  <Route path="*" element={<NotFound />} />
</Routes>

function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <Link to="/">Go Home</Link>
    </div>
  );
}
```

---

### Protected Routes (Authentication)

```jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Usage
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
```

---

### Query Parameters (Search Params)

```jsx
import { useSearchParams } from 'react-router-dom';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get('q');      // Get ?q=value
  const page = searchParams.get('page');    // Get ?page=2
  
  return (
    <div>
      <p>Search: {query}</p>
      <p>Page: {page}</p>
      
      {/* Update query params */}
      <button onClick={() => setSearchParams({ q: 'react', page: '2' })}>
        Search React (page 2)
      </button>
    </div>
  );
}

// URL: /search?q=javascript&page=1
// query = "javascript", page = "1"
```

---

### useLocation Hook

```jsx
import { useLocation } from 'react-router-dom';

function CurrentPage() {
  const location = useLocation();
  
  console.log(location.pathname);  // "/about"
  console.log(location.search);    // "?id=123"
  console.log(location.hash);      // "#section"
  console.log(location.state);     // Passed state from navigate()
  
  return <p>Current path: {location.pathname}</p>;
}
```

---

### Complete Example: Blog App

```jsx
// App.jsx
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/posts">Posts</Link>
        <Link to="/about">About</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/:postId" element={<PostDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  return <h1>Welcome to My Blog</h1>;
}

function PostList() {
  const posts = [
    { id: 1, title: 'First Post' },
    { id: 2, title: 'Second Post' },
    { id: 3, title: 'Third Post' }
  ];
  
  return (
    <div>
      <h1>All Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PostDetail() {
  const { postId } = useParams();
  
  return (
    <div>
      <h1>Post #{postId}</h1>
      <p>This is the content of post {postId}.</p>
      <Link to="/posts">← Back to all posts</Link>
    </div>
  );
}

function About() {
  return <h1>About This Blog</h1>;
}

function NotFound() {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <Link to="/">Go Home</Link>
    </div>
  );
}

export default App;
```

---

### React Router Hooks Summary

| Hook | Purpose | Example |
|------|---------|---------|
| `useNavigate` | Navigate programmatically | `navigate('/about')` |
| `useParams` | Get URL parameters | `const { id } = useParams()` |
| `useSearchParams` | Get/set query params | `searchParams.get('q')` |
| `useLocation` | Get current location | `location.pathname` |
| `useMatch` | Check if path matches | `const match = useMatch('/user/:id')` |

---

### React Router v6 vs v5 (Major Changes)

#### v5 (Old):
```jsx
<Switch>
  <Route path="/about" component={About} />
</Switch>
```

#### v6 (Current):
```jsx
<Routes>
  <Route path="/about" element={<About />} />
</Routes>
```

**Key changes in v6:**
- `<Switch>` → `<Routes>`
- `component={About}` → `element={<About />}`
- `useHistory()` → `useNavigate()`
- Nested routes use `<Outlet />`
- Relative paths by default

---

### Common Patterns

#### 1. Layout with sidebar
```jsx
function DashboardLayout() {
  return (
    <div style={{ display: 'flex' }}>
      <aside>
        <nav>
          <Link to="/dashboard">Overview</Link>
          <Link to="/dashboard/settings">Settings</Link>
          <Link to="/dashboard/profile">Profile</Link>
        </nav>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<Overview />} />
  <Route path="settings" element={<Settings />} />
  <Route path="profile" element={<Profile />} />
</Route>
```

#### 2. Breadcrumbs
```jsx
import { useLocation, Link } from 'react-router-dom';

function Breadcrumbs() {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(x => x);
  
  return (
    <nav>
      <Link to="/">Home</Link>
      {paths.map((path, index) => (
        <span key={path}>
          {' / '}
          <Link to={`/${paths.slice(0, index + 1).join('/')}`}>
            {path}
          </Link>
        </span>
      ))}
    </nav>
  );
}
```

#### 3. Redirect after action
```jsx
function CreatePost() {
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = await createPost(formData);
    navigate(`/posts/${newPost.id}`);  // Redirect to new post
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

### Best Practices

1. **Use `<Link>` instead of `<a>`** - Prevents page reloads
2. **Organize routes in one place** - Easier to maintain
3. **Use layouts for shared UI** - Headers, footers, sidebars
4. **Protect sensitive routes** - Check authentication
5. **Handle 404s** - Always have a catch-all route
6. **Use lazy loading** - For code splitting on routes
   ```jsx
   const About = React.lazy(() => import('./pages/About'));
   
   <Route path="/about" element={
     <React.Suspense fallback={<div>Loading...</div>}>
       <About />
     </React.Suspense>
   } />
   ```

---

## BrowserRouter vs RouterProvider (v6.4+)

### Two Approaches to Routing

#### BrowserRouter (Traditional - Component-based)
- Routes defined in JSX inside components
- Classic approach (v5, v6)
- Manual data fetching with useEffect
- Maximum flexibility

```jsx
// main.jsx
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// App.jsx
import { Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}
```

#### RouterProvider (Modern - Data Router)
- Routes defined as JavaScript objects (config)
- New in v6.4+ (recommended for new projects)
- Built-in data loading (loaders) and form handling (actions)
- Per-route error boundaries
- Automatic pending states

```jsx
// main.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "about",
        element: <About />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);

// Root.jsx
import { Outlet, Link } from 'react-router-dom';

function Root() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Outlet />
    </div>
  );
}
```

---

### RouterProvider Superpowers

#### 1. Loaders - Pre-fetch data before rendering
```jsx
// Define loader
async function postLoader({ params }) {
  const res = await fetch(`/api/posts/${params.postId}`);
  if (!res.ok) throw new Response("Not Found", { status: 404 });
  return res.json();
}

// Add to route config
const router = createBrowserRouter([
  {
    path: "/posts/:postId",
    element: <Post />,
    loader: postLoader  // ✨ Data loads before component renders
  }
]);

// Component gets data automatically
import { useLoaderData } from 'react-router-dom';

function Post() {
  const post = useLoaderData();  // No useEffect needed!
  return <h1>{post.title}</h1>;
}
```

#### 2. Actions - Handle form submissions
```jsx
// Define action
async function createPostAction({ request }) {
  const formData = await request.formData();
  const response = await fetch('/api/posts', {
    method: 'POST',
    body: JSON.stringify({
      title: formData.get('title'),
      content: formData.get('content')
    })
  });
  return response.json();
}

// Add to route config
const router = createBrowserRouter([
  {
    path: "/posts/new",
    element: <NewPost />,
    action: createPostAction  // ✨ Handles form submission
  }
]);

// Component with form
import { Form, useActionData } from 'react-router-dom';

function NewPost() {
  const data = useActionData();
  
  return (
    <Form method="post">  {/* Special Form component */}
      <input name="title" />
      <textarea name="content" />
      <button type="submit">Create</button>
      {data?.success && <p>Created!</p>}
    </Form>
  );
}
```

#### 3. Per-route error boundaries
```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,  // Catches errors in this route tree
    children: [
      {
        path: "posts/:postId",
        element: <Post />,
        loader: postLoader,
        errorElement: <PostError />  // Different error for this route
      }
    ]
  }
]);

// Error component
import { useRouteError } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();
  return <div><h1>Oops!</h1><p>{error.message}</p></div>;
}
```

#### 4. Automatic navigation state
```jsx
import { useNavigation } from 'react-router-dom';

function Root() {
  const navigation = useNavigation();
  
  return (
    <div>
      {navigation.state === "loading" && <div>Loading...</div>}
      <Outlet />
    </div>
  );
}
```

---

### Comparison Table

| Feature | BrowserRouter | RouterProvider |
|---------|---------------|----------------|
| **React Router version** | v5, v6 | v6.4+ only |
| **Route definition** | JSX components | JS objects |
| **Data loading** | Manual (useEffect) | Built-in (loader) |
| **Form handling** | Manual | Built-in (action) |
| **Error boundaries** | Global | Per-route |
| **Pending states** | Manual | Automatic |
| **Use case** | Simple apps, legacy | New projects, complex data needs |

---

### When to Use Which

**Use BrowserRouter if:**
- Working on existing project using it
- Need maximum flexibility (conditional routes)
- Simple data needs
- Using React Router v5 or early v6

**Use RouterProvider if:**
- Starting new project (v6.4+)
- Want built-in data loading
- Want automatic form handling
- Need per-route error handling
- Want centralized route config

---

### Migration Example

**Before (BrowserRouter):**
```jsx
function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(`/api/posts/${postId}`)
      .then(res => res.json())
      .then(data => { setPost(data); setLoading(false); })
      .catch(err => { setError(err); setLoading(false); });
  }, [postId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  return <h1>{post.title}</h1>;
}
```

**After (RouterProvider):**
```jsx
// Loader
async function postLoader({ params }) {
  const res = await fetch(`/api/posts/${params.postId}`);
  if (!res.ok) throw new Response("Not Found", { status: 404 });
  return res.json();
}

// Route config
{ path: "/posts/:postId", element: <Post />, loader: postLoader }

// Component - much cleaner!
function Post() {
  const post = useLoaderData();
  return <h1>{post.title}</h1>;
}
```

---

### Quick Reference

```jsx
// BrowserRouter Setup
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

// Basic routing
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/user/:id" element={<User />} />
  <Route path="*" element={<NotFound />} />
</Routes>

// Navigation
<Link to="/about">About</Link>

// Programmatic navigation
const navigate = useNavigate();
navigate('/dashboard');

// Get URL params
const { id } = useParams();

// Get current location
const location = useLocation();
```

---

## Common Patterns

### Conditional Rendering
```jsx
{isLoggedIn ? <Dashboard /> : <Login />}
{isLoading && <Spinner />}
{error && <ErrorMessage text={error} />}
```

### Event Handling
```jsx
<button onClick={() => handleClick(id)}>Click</button>
<input onChange={(e) => setValue(e.target.value)} />
```

### Forms
```jsx
function Form() {
    const [value, setValue] = React.useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(value);
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input 
                value={value} 
                onChange={(e) => setValue(e.target.value)} 
            />
            <button type="submit">Submit</button>
        </form>
    );
}
```
