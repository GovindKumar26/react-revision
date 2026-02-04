# React Mental Model & Core Concepts

## 🧠 The Core Mental Model

### React is a Function of State → UI

```
UI = f(state)
```

React's fundamental idea: **Given the same state, always produce the same UI.**

```jsx
// Your component is just a function
function App(props) {
  // state + props → JSX (UI description)
  return <div>{props.name}</div>
}
```

### Key Insight: Declarative, Not Imperative

**Imperative (jQuery way):**
```js
// You tell HOW to do it
$('#counter').text(count)
$('#button').on('click', () => {
  count++
  $('#counter').text(count)
})
```

**Declarative (React way):**
```jsx
// You tell WHAT you want
function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}
```

---

## 🔄 The Render Cycle

### Three Phases of React

```
┌─────────────────────────────────────────────────────────┐
│                    REACT LIFECYCLE                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   1. TRIGGER          2. RENDER           3. COMMIT     │
│   ─────────          ────────            ──────         │
│   • Initial mount    • Call component   • Update DOM    │
│   • State change     • Calculate diff   • Run effects   │
│   • Parent re-render • Create VDOM      • Paint screen  │
│                                                          │
│   setState() ──────► React decides ────► Browser shows  │
│                      what changed        new UI          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Phase 1: Trigger

A render is triggered by:
1. **Initial render** - `createRoot().render(<App />)`
2. **State update** - `setState()`, `dispatch()`, etc.
3. **Parent re-render** - When parent renders, children render too

### Phase 2: Render (Pure Calculation)

```jsx
function MyComponent() {
  // React CALLS this function
  // This is the "render" phase
  
  const result = <div>Hello</div>  // Create Virtual DOM
  
  return result  // Return UI description
}
```

**Important:** Rendering is just CALLING your function. No DOM changes yet!

### Phase 3: Commit (DOM Updates)

React compares new Virtual DOM with previous, then:
- Updates only what changed in real DOM
- Runs `useLayoutEffect` (synchronously)
- Browser paints
- Runs `useEffect` (asynchronously)

---

## 🌳 Virtual DOM & Reconciliation

### What is Virtual DOM?

```jsx
// Your JSX
<div className="card">
  <h1>Title</h1>
  <p>Content</p>
</div>

// Becomes this object (Virtual DOM)
{
  type: 'div',
  props: {
    className: 'card',
    children: [
      { type: 'h1', props: { children: 'Title' } },
      { type: 'p', props: { children: 'Content' } }
    ]
  }
}
```

### Reconciliation: The Diffing Algorithm

```
Previous VDOM          New VDOM              DOM Operations
─────────────          ────────              ──────────────

    div                   div                   
   /   \                 /   \                
  h1    p               h1    p               
  │     │               │     │               
"Hello" "World"      "Hello" "React"   →   Update p text only
                                             (minimal change)
```

### Key Rules:

1. **Different types = destroy & rebuild**
   ```jsx
   // Before: <div><Counter /></div>
   // After:  <span><Counter /></span>
   // Result: Counter is UNMOUNTED and remounted (state lost!)
   ```

2. **Same type = update props**
   ```jsx
   // Before: <div className="old" />
   // After:  <div className="new" />
   // Result: Just update className attribute
   ```

3. **Keys help with lists**
   ```jsx
   // Without keys: React doesn't know which item is which
   // With keys: React can track items across re-renders
   {items.map(item => <li key={item.id}>{item.name}</li>)}
   ```

---

## 📊 Component Lifecycle (Hooks Era)

```
┌────────────────────────────────────────────────────────────────┐
│                    COMPONENT LIFECYCLE                          │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌──────────┐ │
│  │ MOUNT   │────►│ UPDATE  │────►│ UPDATE  │────►│ UNMOUNT  │ │
│  └─────────┘     └─────────┘     └─────────┘     └──────────┘ │
│       │               │               │               │        │
│       ▼               ▼               ▼               ▼        │
│   Component       State or        State or        Component   │
│   first render    props change    props change    removed     │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                         HOOKS MAPPING                           │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  useState:      Initialize ──► Persists ──► Persists ──► Gone  │
│                                                                 │
│  useEffect:     Setup runs ──► Cleanup+Setup ──► ... ──► Cleanup│
│  (with deps)                   (if deps change)                 │
│                                                                 │
│  useRef:        Initialize ──► Persists ──► Persists ──► Gone  │
│                 (no re-render on change)                        │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### useEffect Lifecycle

```jsx
useEffect(() => {
  // SETUP: Runs after component mounts
  //        Runs after every re-render (if deps change)
  
  console.log('Effect runs')
  
  return () => {
    // CLEANUP: Runs before next effect
    //          Runs when component unmounts
    console.log('Cleanup runs')
  }
}, [dependencies])
```

**Timeline:**
```
Mount:    Component renders → DOM updates → Effect SETUP runs

Update:   Component renders → DOM updates → CLEANUP runs → SETUP runs

Unmount:  CLEANUP runs → Component removed
```

---

## 🔀 Data Flow

### One-Way Data Flow (Unidirectional)

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                         PARENT                               │
│                      ┌──────────┐                           │
│                      │  state   │                           │
│                      └────┬─────┘                           │
│                           │                                  │
│              ┌────────────┼────────────┐                    │
│              │            │            │                     │
│              ▼            ▼            ▼                     │
│         ┌────────┐  ┌────────┐  ┌────────┐                  │
│         │ Child  │  │ Child  │  │ Child  │                  │
│         │ (props)│  │ (props)│  │ (props)│                  │
│         └────────┘  └────────┘  └────────┘                  │
│                                                              │
│   Props flow DOWN ↓                                          │
│   Events flow UP ↑ (via callbacks)                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Lifting State Up

When siblings need to share data:

```jsx
// ❌ Wrong: Siblings can't communicate directly
function App() {
  return (
    <>
      <SearchInput />      {/* Has search text */}
      <SearchResults />    {/* Needs search text */}
    </>
  )
}

// ✅ Correct: Lift state to common parent
function App() {
  const [search, setSearch] = useState('')
  
  return (
    <>
      <SearchInput value={search} onChange={setSearch} />
      <SearchResults query={search} />
    </>
  )
}
```

---

## ⚡ State Update Batching

### React Batches Updates

```jsx
function handleClick() {
  setCount(count + 1)    // Doesn't trigger render yet
  setName('Alice')       // Doesn't trigger render yet
  setAge(25)             // Doesn't trigger render yet
  // → ONE single re-render at the end
}
```

### State Updates are Asynchronous

```jsx
function handleClick() {
  setCount(count + 1)
  console.log(count)  // Still OLD value! (stale closure)
}
```

### Functional Updates for Sequential Changes

```jsx
// ❌ Wrong: All use same stale `count`
function handleClick() {
  setCount(count + 1)
  setCount(count + 1)
  setCount(count + 1)
  // Result: count + 1 (not +3)
}

// ✅ Correct: Use functional updates
function handleClick() {
  setCount(c => c + 1)
  setCount(c => c + 1)
  setCount(c => c + 1)
  // Result: count + 3
}
```

---

## 🎯 When Does React Re-render?

### A Component Re-renders When:

1. **Its state changes** via `setState`
2. **Its parent re-renders** (props may or may not change)
3. **Context it consumes changes**

### Common Misconception

```jsx
// Parent re-renders = Child re-renders
// Even if props don't change!

function Parent() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      <Child />  {/* Re-renders every time Parent does! */}
    </div>
  )
}
```

### Preventing Unnecessary Re-renders

```jsx
// Option 1: React.memo (memoize component)
const Child = React.memo(function Child({ name }) {
  return <div>{name}</div>
})

// Option 2: useMemo (memoize value)
const expensiveValue = useMemo(() => {
  return computeExpensive(data)
}, [data])

// Option 3: useCallback (memoize function)
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])
```

---

## 🧩 Component Composition Mental Model

### Think in Components

```
┌──────────────────────────────────────────────────────────────┐
│                          App                                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                       Header                            │  │
│  │   ┌─────────┐  ┌─────────────────┐  ┌───────────────┐ │  │
│  │   │  Logo   │  │   Navigation    │  │   UserMenu    │ │  │
│  │   └─────────┘  └─────────────────┘  └───────────────┘ │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                       Main                              │  │
│  │   ┌─────────────────────────────────────────────────┐ │  │
│  │   │                  ProductList                     │ │  │
│  │   │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │ │  │
│  │   │  │ProductCard│  │ProductCard│  │ProductCard│      │ │  │
│  │   │  └──────────┘  └──────────┘  └──────────┘      │ │  │
│  │   └─────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                       Footer                            │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Composition Patterns

```jsx
// 1. Container/Presentational
function UserListContainer() {
  const users = useUsers()  // Logic here
  return <UserList users={users} />  // Just renders
}

// 2. Compound Components
<Select>
  <Select.Option value="1">One</Select.Option>
  <Select.Option value="2">Two</Select.Option>
</Select>

// 3. Render Props
<DataFetcher url="/api/users">
  {(data) => <UserList users={data} />}
</DataFetcher>

// 4. Custom Hooks (preferred)
function UserList() {
  const { users, loading, error } = useUsers()
  // ...
}
```

---

## 📋 Quick Reference: Hooks Rules

1. **Only call hooks at the top level** (not in loops, conditions, or nested functions)
2. **Only call hooks from React functions** (components or custom hooks)
3. **Custom hooks must start with "use"**

```jsx
// ❌ Wrong
function Component() {
  if (condition) {
    const [state, setState] = useState()  // Breaks hook order!
  }
}

// ✅ Correct
function Component() {
  const [state, setState] = useState()
  
  if (condition) {
    // Use state here instead
  }
}
```

---

## 🎓 Summary: The React Way of Thinking

1. **UI is a function of state** - Change state, UI updates automatically
2. **Think declaratively** - Describe WHAT, not HOW
3. **Components are pure functions** - Same input → Same output
4. **Data flows down** - Parent to child via props
5. **Events flow up** - Child to parent via callbacks
6. **State is isolated** - Each component instance has its own state
7. **Effects synchronize** - Keep external systems in sync with React

```jsx
// The React Mental Model in one component
function Counter() {
  // 1. State - the source of truth
  const [count, setCount] = useState(0)
  
  // 2. Derived values - computed from state
  const doubled = count * 2
  
  // 3. Effects - sync with outside world
  useEffect(() => {
    document.title = `Count: ${count}`
  }, [count])
  
  // 4. Event handlers - update state
  const increment = () => setCount(c => c + 1)
  
  // 5. UI - pure function of state
  return (
    <div>
      <p>Count: {count}</p>
      <p>Doubled: {doubled}</p>
      <button onClick={increment}>+</button>
    </div>
  )
}
```
