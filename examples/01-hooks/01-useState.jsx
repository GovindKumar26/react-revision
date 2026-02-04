// useState - Managing Component State
import { useState } from 'react';

// Example 1: Simple Counter
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Example 2: Input Field
function InputExample() {
  const [text, setText] = useState('');

  return (
    <div>
      <input 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
      />
      <p>You typed: {text}</p>
    </div>
  );
}

// Example 3: Multiple State Variables
function MultipleState() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [isStudent, setIsStudent] = useState(false);

  return (
    <div>
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
      <label>
        <input 
          type="checkbox"
          checked={isStudent}
          onChange={(e) => setIsStudent(e.target.checked)}
        />
        Student?
      </label>
      <p>Name: {name}, Age: {age}, Student: {isStudent ? 'Yes' : 'No'}</p>
    </div>
  );
}

// Example 4: State with Objects
function ObjectState() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });

  const handleChange = (field, value) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div>
      <input 
        value={user.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Name"
      />
      <input 
        value={user.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="Email"
      />
      <input 
        type="number"
        value={user.age}
        onChange={(e) => handleChange('age', e.target.value)}
        placeholder="Age"
      />
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

// Example 5: State with Arrays
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div>
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        placeholder="Add todo..."
      />
      <button onClick={addTodo}>Add</button>
      
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input 
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Example 6: Functional Updates
function FunctionalUpdate() {
  const [count, setCount] = useState(0);

  const incrementAsync = () => {
    // Wrong: uses stale state
    // setTimeout(() => setCount(count + 1), 1000);
    
    // Correct: uses functional update
    setTimeout(() => setCount(prev => prev + 1), 1000);
  };

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
      <button onClick={incrementAsync}>Increment After 1s</button>
    </div>
  );
}

export default function UseStateExamples() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>useState Examples</h1>
      
      <section>
        <h2>1. Simple Counter</h2>
        <Counter />
      </section>
      
      <section>
        <h2>2. Input Field</h2>
        <InputExample />
      </section>
      
      <section>
        <h2>3. Multiple State Variables</h2>
        <MultipleState />
      </section>
      
      <section>
        <h2>4. State with Objects</h2>
        <ObjectState />
      </section>
      
      <section>
        <h2>5. Todo List (Arrays)</h2>
        <TodoList />
      </section>
      
      <section>
        <h2>6. Functional Updates</h2>
        <FunctionalUpdate />
      </section>
    </div>
  );
}
