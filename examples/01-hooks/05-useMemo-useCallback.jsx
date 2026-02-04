// useMemo & useCallback - Performance Optimization
import { useState, useMemo, useCallback, memo } from 'react';

// Example 1: useMemo - Expensive Calculation
function ExpensiveCalculation() {
  const [count, setCount] = useState(0);
  const [input, setInput] = useState('');

  // Without useMemo - runs on every render
  // const expensiveValue = fibonacci(count);

  // With useMemo - only recalculates when count changes
  const expensiveValue = useMemo(() => {
    console.log('Calculating fibonacci...');
    return fibonacci(count);
  }, [count]);

  function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }

  return (
    <div>
      <h3>Expensive Calculation with useMemo</h3>
      <p>Fibonacci({count}) = {expensiveValue}</p>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      
      <div style={{ marginTop: '10px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type here (doesn't recalculate)"
        />
        <p>Input: {input}</p>
      </div>
    </div>
  );
}

// Example 2: useMemo - Filtering Large List
function FilteredList() {
  const [filter, setFilter] = useState('');
  const [count, setCount] = useState(0);

  const items = useMemo(() => {
    const list = [];
    for (let i = 1; i <= 1000; i++) {
      list.push(`Item ${i}`);
    }
    return list;
  }, []);

  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    return items.filter(item => 
      item.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  return (
    <div>
      <h3>Filtered List (1000 items)</h3>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter items..."
      />
      <button onClick={() => setCount(count + 1)}>
        Re-render ({count})
      </button>
      <p>Showing {filteredItems.length} items</p>
      <div style={{ maxHeight: '200px', overflow: 'auto' }}>
        {filteredItems.slice(0, 20).map((item, idx) => (
          <div key={idx}>{item}</div>
        ))}
      </div>
    </div>
  );
}

// Example 3: useCallback - Preventing Child Re-renders
const ChildComponent = memo(({ onClick, name }) => {
  console.log(`${name} rendered`);
  return <button onClick={onClick}>{name}</button>;
});

function ParentWithCallback() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  // Without useCallback - new function on every render
  // const increment1 = () => setCount1(count1 + 1);

  // With useCallback - same function reference
  const increment1 = useCallback(() => {
    setCount1(prev => prev + 1);
  }, []);

  const increment2 = useCallback(() => {
    setCount2(prev => prev + 1);
  }, []);

  return (
    <div>
      <h3>useCallback with memo</h3>
      <p>Count 1: {count1}</p>
      <p>Count 2: {count2}</p>
      <ChildComponent onClick={increment1} name="Increment 1" />
      <ChildComponent onClick={increment2} name="Increment 2" />
      <p>Check console - only clicked button's child re-renders</p>
    </div>
  );
}

// Example 4: useCallback in useEffect Dependency
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const fetchResults = useCallback(async () => {
    if (!query) {
      setResults([]);
      return;
    }

    console.log('Fetching results for:', query);
    // Simulate API call
    const mockResults = Array.from({ length: 5 }, (_, i) => 
      `Result ${i + 1} for "${query}"`
    );
    setResults(mockResults);
  }, [query]);

  // fetchResults is stable, so useEffect won't run unnecessarily
  // useEffect(() => {
  //   fetchResults();
  // }, [fetchResults]);

  return (
    <div>
      <h3>Search with useCallback</h3>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <button onClick={fetchResults}>Search</button>
      <div>
        {results.map((result, idx) => (
          <div key={idx}>{result}</div>
        ))}
      </div>
    </div>
  );
}

// Example 5: Sorting with useMemo
function SortableList() {
  const [items] = useState([
    { id: 1, name: 'Banana', price: 2 },
    { id: 2, name: 'Apple', price: 3 },
    { id: 3, name: 'Orange', price: 1 },
    { id: 4, name: 'Mango', price: 4 }
  ]);
  const [sortBy, setSortBy] = useState('name');
  const [count, setCount] = useState(0);

  const sortedItems = useMemo(() => {
    console.log('Sorting items...');
    return [...items].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return a.price - b.price;
    });
  }, [items, sortBy]);

  return (
    <div>
      <h3>Sortable List with useMemo</h3>
      <button onClick={() => setSortBy('name')}>Sort by Name</button>
      <button onClick={() => setSortBy('price')}>Sort by Price</button>
      <button onClick={() => setCount(count + 1)}>Re-render ({count})</button>
      <p>Currently sorted by: {sortBy}</p>
      <ul>
        {sortedItems.map(item => (
          <li key={item.id}>{item.name} - ${item.price}</li>
        ))}
      </ul>
    </div>
  );
}

// Example 6: Complex Object with useMemo
function ComplexObjectMemo() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('John');

  // Without useMemo - new object every render
  // const user = { name, createdAt: new Date() };

  // With useMemo - stable object reference
  const user = useMemo(() => ({
    name,
    createdAt: new Date(),
    id: Math.random()
  }), [name]);

  return (
    <div>
      <h3>Complex Object with useMemo</h3>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <button onClick={() => setCount(count + 1)}>Re-render ({count})</button>
      <ChildWithObject user={user} />
    </div>
  );
}

const ChildWithObject = memo(({ user }) => {
  console.log('ChildWithObject rendered');
  return (
    <div>
      <p>User: {user.name}</p>
      <p>ID: {user.id}</p>
    </div>
  );
});

// Example 7: When NOT to use useMemo/useCallback
function DontOverOptimize() {
  const [count, setCount] = useState(0);

  // ❌ DON'T: Simple calculation - useMemo overhead not worth it
  const badUseMemo = useMemo(() => count * 2, [count]);

  // ✅ DO: Simple calculation - just calculate it
  const goodCalc = count * 2;

  // ❌ DON'T: Simple function - useCallback overhead not worth it
  const badCallback = useCallback(() => {
    console.log('clicked');
  }, []);

  // ✅ DO: If not passing to memo'd child, just define it
  const goodHandler = () => {
    console.log('clicked');
  };

  return (
    <div>
      <h3>Don't Over-Optimize</h3>
      <p>Count: {count}</p>
      <p>Double: {goodCalc}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>Only use useMemo/useCallback when you actually need them!</p>
    </div>
  );
}

// Example 8: Comparison
function Comparison() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build app', completed: false }
  ]);
  const [filter, setFilter] = useState('all');

  // useMemo - memoize VALUES (results of calculations)
  const filteredTodos = useMemo(() => {
    console.log('Filtering todos...');
    if (filter === 'completed') return todos.filter(t => t.completed);
    if (filter === 'active') return todos.filter(t => !t.completed);
    return todos;
  }, [todos, filter]);

  // useCallback - memoize FUNCTIONS (event handlers)
  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  return (
    <div>
      <h3>useMemo vs useCallback</h3>
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
      <ul>
        {filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} />
        ))}
      </ul>
    </div>
  );
}

const TodoItem = memo(({ todo, onToggle }) => {
  console.log(`TodoItem ${todo.id} rendered`);
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      {todo.text}
    </li>
  );
});

export default function UseMemoCallbackExamples() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>useMemo & useCallback Examples</h1>
      
      <section>
        <h2>1. useMemo - Expensive Calculation</h2>
        <ExpensiveCalculation />
      </section>
      
      <section>
        <h2>2. useMemo - Filtering Large List</h2>
        <FilteredList />
      </section>
      
      <section>
        <h2>3. useCallback - Preventing Re-renders</h2>
        <ParentWithCallback />
      </section>
      
      <section>
        <h2>4. useCallback in useEffect</h2>
        <SearchComponent />
      </section>
      
      <section>
        <h2>5. useMemo - Sorting</h2>
        <SortableList />
      </section>
      
      <section>
        <h2>6. useMemo - Complex Objects</h2>
        <ComplexObjectMemo />
      </section>
      
      <section>
        <h2>7. Don't Over-Optimize</h2>
        <DontOverOptimize />
      </section>
      
      <section>
        <h2>8. useMemo vs useCallback</h2>
        <Comparison />
      </section>
    </div>
  );
}
