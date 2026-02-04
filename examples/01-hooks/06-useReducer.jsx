// useReducer - Complex State Management
import { useReducer, useState } from 'react';

// Example 1: Counter with useReducer
function CounterReducer() {
  const initialState = { count: 0 };

  function reducer(state, action) {
    switch (action.type) {
      case 'INCREMENT':
        return { count: state.count + 1 };
      case 'DECREMENT':
        return { count: state.count - 1 };
      case 'RESET':
        return { count: 0 };
      case 'SET':
        return { count: action.payload };
      default:
        throw new Error(`Unknown action: ${action.type}`);
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <h3>Count: {state.count}</h3>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'SET', payload: 10 })}>Set to 10</button>
    </div>
  );
}

// Example 2: Todo List with useReducer
function TodoReducer() {
  const initialState = {
    todos: [],
    filter: 'all'
  };

  function reducer(state, action) {
    switch (action.type) {
      case 'ADD_TODO':
        return {
          ...state,
          todos: [...state.todos, {
            id: Date.now(),
            text: action.payload,
            completed: false
          }]
        };
      case 'TOGGLE_TODO':
        return {
          ...state,
          todos: state.todos.map(todo =>
            todo.id === action.payload
              ? { ...todo, completed: !todo.completed }
              : todo
          )
        };
      case 'DELETE_TODO':
        return {
          ...state,
          todos: state.todos.filter(todo => todo.id !== action.payload)
        };
      case 'SET_FILTER':
        return {
          ...state,
          filter: action.payload
        };
      case 'CLEAR_COMPLETED':
        return {
          ...state,
          todos: state.todos.filter(todo => !todo.completed)
        };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const [input, setInput] = useState('');

  const filteredTodos = state.todos.filter(todo => {
    if (state.filter === 'active') return !todo.completed;
    if (state.filter === 'completed') return todo.completed;
    return true;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      dispatch({ type: 'ADD_TODO', payload: input });
      setInput('');
    }
  };

  return (
    <div>
      <h3>Todo List with useReducer</h3>
      
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add todo..."
        />
        <button type="submit">Add</button>
      </form>

      <div>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}>
          All
        </button>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'active' })}>
          Active
        </button>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'completed' })}>
          Completed
        </button>
        <button onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}>
          Clear Completed
        </button>
      </div>

      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
            <button onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <p>{filteredTodos.length} items</p>
    </div>
  );
}

// Example 3: Form with useReducer
function FormReducer() {
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    errors: {}
  };

  function reducer(state, action) {
    switch (action.type) {
      case 'UPDATE_FIELD':
        return {
          ...state,
          [action.field]: action.value,
          errors: { ...state.errors, [action.field]: '' }
        };
      case 'SET_ERROR':
        return {
          ...state,
          errors: { ...state.errors, [action.field]: action.error }
        };
      case 'RESET':
        return initialState;
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    let hasErrors = false;
    
    if (!state.firstName) {
      dispatch({ type: 'SET_ERROR', field: 'firstName', error: 'First name is required' });
      hasErrors = true;
    }
    
    if (!state.email.includes('@')) {
      dispatch({ type: 'SET_ERROR', field: 'email', error: 'Invalid email' });
      hasErrors = true;
    }
    
    if (hasErrors) return;
    
    alert(`Form submitted: ${JSON.stringify(state, null, 2)}`);
    dispatch({ type: 'RESET' });
  };

  return (
    <div>
      <h3>Form with useReducer</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            value={state.firstName}
            onChange={(e) => dispatch({ 
              type: 'UPDATE_FIELD', 
              field: 'firstName', 
              value: e.target.value 
            })}
            placeholder="First Name"
          />
          {state.errors.firstName && <span style={{ color: 'red' }}>{state.errors.firstName}</span>}
        </div>

        <div>
          <input
            value={state.lastName}
            onChange={(e) => dispatch({ 
              type: 'UPDATE_FIELD', 
              field: 'lastName', 
              value: e.target.value 
            })}
            placeholder="Last Name"
          />
        </div>

        <div>
          <input
            value={state.email}
            onChange={(e) => dispatch({ 
              type: 'UPDATE_FIELD', 
              field: 'email', 
              value: e.target.value 
            })}
            placeholder="Email"
          />
          {state.errors.email && <span style={{ color: 'red' }}>{state.errors.email}</span>}
        </div>

        <div>
          <input
            type="number"
            value={state.age}
            onChange={(e) => dispatch({ 
              type: 'UPDATE_FIELD', 
              field: 'age', 
              value: e.target.value 
            })}
            placeholder="Age"
          />
        </div>

        <button type="submit">Submit</button>
        <button type="button" onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      </form>
    </div>
  );
}

// Example 4: Shopping Cart with useReducer
function ShoppingCartReducer() {
  const initialState = {
    items: [],
    total: 0
  };

  function reducer(state, action) {
    switch (action.type) {
      case 'ADD_ITEM': {
        const existingItem = state.items.find(item => item.id === action.payload.id);
        
        if (existingItem) {
          return {
            ...state,
            items: state.items.map(item =>
              item.id === action.payload.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            total: state.total + action.payload.price
          };
        }
        
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
          total: state.total + action.payload.price
        };
      }
      
      case 'REMOVE_ITEM': {
        const item = state.items.find(item => item.id === action.payload);
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload),
          total: state.total - (item.price * item.quantity)
        };
      }
      
      case 'UPDATE_QUANTITY': {
        const item = state.items.find(item => item.id === action.payload.id);
        const oldTotal = item.price * item.quantity;
        const newTotal = item.price * action.payload.quantity;
        
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item
          ),
          total: state.total - oldTotal + newTotal
        };
      }
      
      case 'CLEAR_CART':
        return initialState;
      
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 29 },
    { id: 3, name: 'Keyboard', price: 79 },
    { id: 4, name: 'Monitor', price: 299 }
  ];

  return (
    <div>
      <h3>Shopping Cart</h3>
      
      <div>
        <h4>Products</h4>
        {products.map(product => (
          <div key={product.id}>
            <span>{product.name} - ${product.price}</span>
            <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h4>Cart ({state.items.reduce((sum, item) => sum + item.quantity, 0)} items)</h4>
        {state.items.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          <>
            {state.items.map(item => (
              <div key={item.id} style={{ marginBottom: '10px' }}>
                <span>{item.name} x </span>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  style={{ width: '50px' }}
                  onChange={(e) => dispatch({
                    type: 'UPDATE_QUANTITY',
                    payload: { id: item.id, quantity: Number(e.target.value) }
                  })}
                />
                <span> = ${item.price * item.quantity}</span>
                <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}>
                  Remove
                </button>
              </div>
            ))}
            <h4>Total: ${state.total}</h4>
            <button onClick={() => dispatch({ type: 'CLEAR_CART' })}>Clear Cart</button>
          </>
        )}
      </div>
    </div>
  );
}

// Example 5: Async Actions with useReducer
function AsyncReducer() {
  const initialState = {
    data: null,
    loading: false,
    error: null
  };

  function reducer(state, action) {
    switch (action.type) {
      case 'FETCH_START':
        return { ...state, loading: true, error: null };
      case 'FETCH_SUCCESS':
        return { ...state, loading: false, data: action.payload };
      case 'FETCH_ERROR':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchUser = async () => {
    dispatch({ type: 'FETCH_START' });
    
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
      const data = await response.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  };

  return (
    <div>
      <h3>Async with useReducer</h3>
      <button onClick={fetchUser}>Fetch User</button>
      
      {state.loading && <p>Loading...</p>}
      {state.error && <p style={{ color: 'red' }}>Error: {state.error}</p>}
      {state.data && (
        <div>
          <h4>{state.data.name}</h4>
          <p>Email: {state.data.email}</p>
          <p>Phone: {state.data.phone}</p>
        </div>
      )}
    </div>
  );
}

// Example 6: useState vs useReducer Comparison
function Comparison() {
  return (
    <div>
      <h3>When to use useState vs useReducer?</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          <h4>✅ Use useState when:</h4>
          <ul>
            <li>Simple state (string, number, boolean)</li>
            <li>Independent state updates</li>
            <li>State doesn't depend on previous state</li>
            <li>Few state variables</li>
          </ul>
          <pre style={{ background: '#f5f5f5', padding: '10px' }}>
{`const [count, setCount] = useState(0);
const [name, setName] = useState('');`}
          </pre>
        </div>

        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          <h4>✅ Use useReducer when:</h4>
          <ul>
            <li>Complex state (nested objects/arrays)</li>
            <li>Multiple related state updates</li>
            <li>Next state depends on previous</li>
            <li>Complex update logic</li>
          </ul>
          <pre style={{ background: '#f5f5f5', padding: '10px' }}>
{`const [state, dispatch] = useReducer(
  reducer,
  { items: [], total: 0 }
);`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default function UseReducerExamples() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>useReducer Examples</h1>
      
      <section>
        <h2>1. Counter with useReducer</h2>
        <CounterReducer />
      </section>
      
      <section>
        <h2>2. Todo List</h2>
        <TodoReducer />
      </section>
      
      <section>
        <h2>3. Form Management</h2>
        <FormReducer />
      </section>
      
      <section>
        <h2>4. Shopping Cart</h2>
        <ShoppingCartReducer />
      </section>
      
      <section>
        <h2>5. Async Actions</h2>
        <AsyncReducer />
      </section>
      
      <section>
        <h2>6. useState vs useReducer</h2>
        <Comparison />
      </section>
    </div>
  );
}
