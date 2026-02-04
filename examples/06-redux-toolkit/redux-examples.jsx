// Redux Toolkit - Complete Examples
import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';

// ========================================
// 1. SIMPLE COUNTER SLICE
// ========================================

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
});

export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h3>Counter: {count}</h3>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
    </div>
  );
}

// ========================================
// 2. TODO LIST SLICE
// ========================================

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    filter: 'all',
  },
  reducers: {
    addTodo: (state, action) => {
      state.items.push({
        id: Date.now(),
        text: action.payload,
        completed: false,
      });
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    clearCompleted: (state) => {
      state.items = state.items.filter(t => !t.completed);
    },
  },
});

export const { addTodo, toggleTodo, deleteTodo, setFilter, clearCompleted } = todoSlice.actions;

// Selectors
export const selectFilteredTodos = (state) => {
  const { items, filter } = state.todos;
  if (filter === 'active') return items.filter(t => !t.completed);
  if (filter === 'completed') return items.filter(t => t.completed);
  return items;
};

function TodoList() {
  const [input, setInput] = useState('');
  const todos = useSelector(selectFilteredTodos);
  const filter = useSelector((state) => state.todos.filter);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      dispatch(addTodo(input));
      setInput('');
    }
  };

  return (
    <div>
      <h3>Todo List</h3>
      
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add todo..."
        />
        <button type="submit">Add</button>
      </form>

      <div>
        <button onClick={() => dispatch(setFilter('all'))}>All</button>
        <button onClick={() => dispatch(setFilter('active'))}>Active</button>
        <button onClick={() => dispatch(setFilter('completed'))}>Completed</button>
        <button onClick={() => dispatch(clearCompleted())}>Clear Completed</button>
      </div>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch(toggleTodo(todo.id))}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
            <button onClick={() => dispatch(deleteTodo(todo.id))}>Delete</button>
          </li>
        ))}
      </ul>

      <p>Current filter: {filter} | Items: {todos.length}</p>
    </div>
  );
}

// ========================================
// 3. SHOPPING CART SLICE
// ========================================

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
  },
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      state.total += action.payload.price;
    },
    removeItem: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      
      if (item) {
        state.total -= item.price * item.quantity;
        state.items = state.items.filter(item => item.id !== action.payload);
      }
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload.id);
      
      if (item) {
        state.total -= item.price * item.quantity;
        item.quantity = action.payload.quantity;
        state.total += item.price * action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItemCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

const products = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Mouse', price: 29 },
  { id: 3, name: 'Keyboard', price: 79 },
  { id: 4, name: 'Monitor', price: 299 },
];

function ShoppingCart() {
  const items = useSelector((state) => state.cart.items);
  const total = useSelector((state) => state.cart.total);
  const itemCount = useSelector(selectCartItemCount);
  const dispatch = useDispatch();

  return (
    <div>
      <h3>Shopping Cart</h3>
      
      <div>
        <h4>Products</h4>
        {products.map(product => (
          <div key={product.id} style={{ marginBottom: '10px' }}>
            <span>{product.name} - ${product.price}</span>
            <button onClick={() => dispatch(addItem(product))}>Add to Cart</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h4>Cart ({itemCount} items)</h4>
        {items.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          <>
            {items.map(item => (
              <div key={item.id} style={{ marginBottom: '10px' }}>
                <span>{item.name} x </span>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  style={{ width: '50px' }}
                  onChange={(e) =>
                    dispatch(updateQuantity({ id: item.id, quantity: Number(e.target.value) }))
                  }
                />
                <span> = ${item.price * item.quantity}</span>
                <button onClick={() => dispatch(removeItem(item.id))}>Remove</button>
              </div>
            ))}
            <h4>Total: ${total.toFixed(2)}</h4>
            <button onClick={() => dispatch(clearCart())}>Clear Cart</button>
          </>
        )}
      </div>
    </div>
  );
}

// ========================================
// 4. ASYNC THUNK - FETCH USERS
// ========================================

// Async thunk
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  return response.json();
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch';
      });
  },
});

function UserList() {
  const users = useSelector((state) => state.users.items);
  const status = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);
  const dispatch = useDispatch();

  const handleFetch = () => {
    dispatch(fetchUsers());
  };

  return (
    <div>
      <h3>User List (Async Thunk)</h3>
      <button onClick={handleFetch} disabled={status === 'loading'}>
        {status === 'loading' ? 'Loading...' : 'Fetch Users'}
      </button>

      {status === 'failed' && <p style={{ color: 'red' }}>Error: {error}</p>}

      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ========================================
// 5. ASYNC THUNK WITH PARAMETERS
// ========================================

export const fetchPostsByUser = createAsyncThunk(
  'posts/fetchByUser',
  async (userId) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    return response.json();
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsByUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPostsByUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPostsByUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch';
      });
  },
});

function PostsByUser() {
  const [userId, setUserId] = useState(1);
  const posts = useSelector((state) => state.posts.items);
  const status = useSelector((state) => state.posts.status);
  const dispatch = useDispatch();

  const handleFetch = () => {
    dispatch(fetchPostsByUser(userId));
  };

  return (
    <div>
      <h3>Posts by User (Async Thunk with Params)</h3>
      <div>
        <button onClick={() => setUserId(1)}>User 1</button>
        <button onClick={() => setUserId(2)}>User 2</button>
        <button onClick={() => setUserId(3)}>User 3</button>
      </div>
      <button onClick={handleFetch}>Fetch Posts for User {userId}</button>

      {status === 'loading' && <p>Loading...</p>}

      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

// ========================================
// STORE CONFIGURATION
// ========================================

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    todos: todoSlice.reducer,
    cart: cartSlice.reducer,
    users: userSlice.reducer,
    posts: postSlice.reducer,
  },
});

// ========================================
// MAIN APP
// ========================================

function ReduxContent() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Redux Toolkit Examples</h1>

      <section>
        <h2>1. Simple Counter</h2>
        <Counter />
      </section>

      <section>
        <h2>2. Todo List</h2>
        <TodoList />
      </section>

      <section>
        <h2>3. Shopping Cart</h2>
        <ShoppingCart />
      </section>

      <section>
        <h2>4. Async Thunk - Fetch Users</h2>
        <UserList />
      </section>

      <section>
        <h2>5. Async Thunk with Parameters</h2>
        <PostsByUser />
      </section>
    </div>
  );
}

export default function ReduxToolkitExamples() {
  return (
    <Provider store={store}>
      <ReduxContent />
    </Provider>
  );
}

/*
INSTALLATION:
npm install @reduxjs/toolkit react-redux

FOLDER STRUCTURE:
src/
├── app/
│   └── store.js          // Configure store
├── features/
│   ├── counter/
│   │   └── counterSlice.js
│   ├── todos/
│   │   └── todoSlice.js
│   └── cart/
│       └── cartSlice.js
└── App.jsx

KEY CONCEPTS:
- createSlice: Creates reducer + actions
- configureStore: Sets up store with good defaults
- createAsyncThunk: Handles async operations
- useSelector: Read state
- useDispatch: Dispatch actions
- Immer: Built-in (allows "mutation" syntax)
*/
