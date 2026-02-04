// JavaScript with React - Complete Examples (Converted from TypeScript)
import React, { useState } from 'react';

// ========================================
// 1. BASIC PROPS
// ========================================

function Greeting({ name, age }) {
  return (
    <div>
      <h3>Hello, {name}!</h3>
      {age && <p>Age: {age}</p>}
    </div>
  );
}

// ========================================
// 2. COMPONENT WITH CHILDREN
// ========================================

function Card({ title, children }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
      <h4>{title}</h4>
      {children}
    </div>
  );
}

// ========================================
// 3. STATE EXAMPLES
// ========================================

function StateExample() {
  // Primitive state
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [isActive, setIsActive] = useState(false);

  // Object state
  const [user, setUser] = useState({
    id: 1,
    name: 'John',
    email: 'john@example.com'
  });

  // Array state
  const [users, setUsers] = useState([]);

  // Nullable state
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div>
      <h3>State Examples</h3>
      <p>Count: {count}</p>
      <p>Text: {text}</p>
      <p>Active: {isActive.toString()}</p>
      <p>User: {user.name}</p>
    </div>
  );
}

// ========================================
// 4. EVENT HANDLERS
// ========================================

function EventHandlersExample() {
  const [value, setValue] = useState('');

  // Input change event
  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  // Form submit event
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', value);
  };

  // Button click event
  const handleClick = (e) => {
    console.log('Clicked at', e.clientX, e.clientY);
  };

  // Select change event
  const handleSelectChange = (e) => {
    console.log('Selected:', e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={value} onChange={handleInputChange} />
      <button type="submit" onClick={handleClick}>Submit</button>
      <select onChange={handleSelectChange}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </select>
    </form>
  );
}

// ========================================
// 5. FUNCTION AS PROP
// ========================================

function Button({ label, onClick, variant = 'primary' }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: variant === 'primary' ? 'blue' : 'gray',
        color: 'white',
        padding: '8px 16px'
      }}
    >
      {label}
    </button>
  );
}

// ========================================
// 6. GENERIC-LIKE LIST PATTERN
// ========================================

function List({ items, renderItem }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

function GenericListExample() {
  const numbers = [1, 2, 3, 4, 5];
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ];

  return (
    <div>
      <h3>Generic List</h3>
      <List items={numbers} renderItem={(num) => <span>Number: {num}</span>} />
      <List items={users} renderItem={(user) => <span>{user.name}</span>} />
    </div>
  );
}

// ========================================
// 7. CUSTOM HOOKS
// ========================================

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useState(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  });

  return { data, loading, error };
}

// ========================================
// 8. FORM EXAMPLE
// ========================================

function TypedForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: 0,
    country: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.username) newErrors.username = 'Username required';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email';
    if (formData.age < 18) newErrors.age = 18;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form submitted:', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        {errors.username && <span>{errors.username}</span>}
      </div>
      
      <div>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <span>{errors.email}</span>}
      </div>
      
      <div>
        <input
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
        />
        {errors.age && <span>Must be {errors.age}+</span>}
      </div>
      
      <button type="submit">Submit</button>
    </form>
  );
}

// ========================================
// 9. ENUM-LIKE AND UNION PATTERNS
// ========================================

const Status = {
  Pending: 'PENDING',
  Success: 'SUCCESS',
  Error: 'ERROR'
};

function StatusBadge({ status, theme }) {
  const colors = {
    [Status.Pending]: 'yellow',
    [Status.Success]: 'green',
    [Status.Error]: 'red'
  };

  return (
    <span style={{
      background: colors[status],
      padding: '4px 8px',
      borderRadius: '4px',
      color: theme === 'dark' ? 'white' : 'black'
    }}>
      {status}
    </span>
  );
}

// ========================================
// 10. UTILITY PATTERNS (JavaScript equivalent)
// ========================================

function UtilityPatternsExample() {
  // In JavaScript, we don't have utility types, but we use patterns
  const partial = { title: 'Learn JS' };
  const preview = { id: 1, title: 'Preview' };
  const withoutDate = { id: 2, title: 'No date', completed: false };
  
  return (
    <div>
      <h3>Utility Patterns Example</h3>
      <p>In JavaScript, we use object patterns instead of utility types</p>
    </div>
  );
}

// ========================================
// 11. CONTEXT PATTERN
// ========================================

const AuthContext = React.createContext(undefined);

function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// ========================================
// 12. REF EXAMPLE
// ========================================

function RefExample() {
  const inputRef = React.useRef(null);
  const divRef = React.useRef(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div ref={divRef}>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}

// ========================================
// MAIN COMPONENT
// ========================================

export default function TypeScriptExamples() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>React Examples (JavaScript)</h1>
      <p><em>Note: This file was converted from TypeScript to JavaScript</em></p>
      
      <section>
        <h2>1. Basic Props</h2>
        <Greeting name="Alice" age={25} />
        <Greeting name="Bob" />
      </section>
      
      <section>
        <h2>2. Children Props</h2>
        <Card title="My Card">
          <p>This is card content</p>
        </Card>
      </section>
      
      <section>
        <h2>3. State Examples</h2>
        <StateExample />
      </section>
      
      <section>
        <h2>4. Event Handlers</h2>
        <EventHandlersExample />
      </section>
      
      <section>
        <h2>5. Function Props</h2>
        <Button label="Primary" onClick={() => alert('Clicked!')} />
        <Button label="Secondary" onClick={() => alert('Clicked!')} variant="secondary" />
      </section>
      
      <section>
        <h2>6. Generic Components</h2>
        <GenericListExample />
      </section>
      
      <section>
        <h2>8. Form Example</h2>
        <TypedForm />
      </section>
      
      <section>
        <h2>9. Enum and Union Patterns</h2>
        <StatusBadge status={Status.Success} theme="light" />
        <StatusBadge status={Status.Error} theme="dark" />
      </section>
      
      <section>
        <h2>10. Utility Patterns</h2>
        <UtilityPatternsExample />
      </section>
      
      <section>
        <h2>12. Refs</h2>
        <RefExample />
      </section>
    </div>
  );
}
