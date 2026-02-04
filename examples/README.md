# React Examples - Complete Guide

This folder contains **complete, working examples** for every major React concept. Each example is self-contained and demonstrates real-world usage patterns.

## 📁 Folder Structure

```
examples/
├── 01-hooks/              # React Hooks Examples
├── 02-typescript/         # TypeScript with React
├── 03-react-hook-form/    # Form Management
├── 04-tanstack-query/     # Data Fetching & Caching
├── 05-react-router/       # Routing & Navigation
├── 06-redux-toolkit/      # State Management
└── README.md             # This file
```

---

## 🎯 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Basic Setup

1. **Create a new React project with Vite:**
```bash
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
```

2. **Copy any example file** into your `src` folder

3. **Install required dependencies** (see each section below)

4. **Import the example** in your `App.tsx`:
```tsx
import ExampleComponent from './example-file';

function App() {
  return <ExampleComponent />;
}

export default App;
```

5. **Run the dev server:**
```bash
npm run dev
```

---

## 📚 Examples Guide

### 01 - React Hooks

**Files:**
- `01-useState.jsx` - State management
- `02-useEffect.jsx` - Side effects & lifecycle
- `03-useRef.jsx` - DOM refs & persistent values
- `04-useContext.jsx` - Context API
- `05-useMemo-useCallback.jsx` - Performance optimization
- `06-useReducer.jsx` - Complex state logic
- `07-customHooks.jsx` - Reusable hooks

**No installation required** - uses only React built-ins.

**Key Concepts:**
- State management with `useState`
- Side effects with `useEffect`
- DOM manipulation with `useRef`
- Sharing data with `useContext`
- Performance with `useMemo` and `useCallback`
- Complex state with `useReducer`
- Building custom hooks

---

### 02 - TypeScript with React

**Files:**
- `typescript-examples.tsx` - Complete TypeScript guide

**Installation:**
```bash
npm install typescript @types/react @types/react-dom
```

**Key Concepts:**
- Props typing (interfaces, types)
- State typing (primitives, objects, arrays)
- Event handlers (ChangeEvent, FormEvent, MouseEvent)
- Function props and callbacks
- Generic components
- Custom hooks with TypeScript
- Utility types (Partial, Pick, Omit, etc.)
- Context with TypeScript
- Refs with TypeScript

---

### 03 - React Hook Form

**Files:**
- `form-examples.tsx` - Form management with validation

**Installation:**
```bash
npm install react-hook-form zod @hookform/resolvers
```

**Key Concepts:**
- Basic form setup
- Validation rules (required, pattern, min/max)
- Schema validation with Zod
- Controlled components with Controller
- Dynamic form fields
- Form state management
- Error handling
- Reset and default values

---

### 04 - TanStack Query

**Files:**
- `query-examples.tsx` - Data fetching & caching

**Installation:**
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

**Setup in `main.tsx`:**
```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
```

**Key Concepts:**
- Basic queries with `useQuery`
- Mutations (create, update, delete)
- Query keys and caching
- Optimistic updates
- Polling (refetch intervals)
- Infinite queries (pagination)
- Dependent queries
- Query invalidation
- Loading and error states

---

### 05 - React Router

**Files:**
- `router-examples.tsx` - Routing & navigation

**Installation:**
```bash
npm install react-router-dom
```

**Key Concepts:**
- Traditional routing with `BrowserRouter`
- Modern routing with `createBrowserRouter`
- Dynamic routes with `useParams`
- Nested routes with `Outlet`
- `Link` vs `NavLink`
- Programmatic navigation with `useNavigate`
- Protected routes
- 404 pages
- Route layouts

---

### 06 - Redux Toolkit

**Files:**
- `redux-examples.tsx` - State management

**Installation:**
```bash
npm install @reduxjs/toolkit react-redux
```

**Setup in `main.tsx`:**
```tsx
import { Provider } from 'react-redux';
import { store } from './store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

**Key Concepts:**
- Creating slices with `createSlice`
- Configuring store with `configureStore`
- Reading state with `useSelector`
- Dispatching actions with `useDispatch`
- Async operations with `createAsyncThunk`
- Selectors for derived state
- Multiple slices
- TypeScript integration

---

## 🛠️ Common Setup - Full React App

If you want to use **all examples** in a single project:

### 1. Create Project
```bash
npm create vite@latest react-complete -- --template react-ts
cd react-complete
```

### 2. Install All Dependencies
```bash
npm install
npm install react-hook-form zod @hookform/resolvers
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install react-router-dom
npm install @reduxjs/toolkit react-redux
```

### 3. Setup Providers in `main.tsx`
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Redux
import { Provider } from 'react-redux';
import { store } from './store';

// TanStack Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// React Router
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
```

### 4. Create Navigation in `App.tsx`
```tsx
import { Routes, Route, Link } from 'react-router-dom';
import UseStateExamples from './examples/01-hooks/01-useState';
import TypeScriptExamples from './examples/02-typescript/typescript-examples';
// ... import other examples

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/hooks">Hooks</Link>
        <Link to="/typescript">TypeScript</Link>
        {/* ... other links */}
      </nav>

      <Routes>
        <Route path="/" element={<h1>Welcome to React Examples</h1>} />
        <Route path="/hooks" element={<UseStateExamples />} />
        <Route path="/typescript" element={<TypeScriptExamples />} />
        {/* ... other routes */}
      </Routes>
    </div>
  );
}

export default App;
```

---

## 📖 Learning Path

**Recommended order for beginners:**

1. **React Hooks** (01-hooks)
   - Start with `useState` and `useEffect`
   - Master `useRef` for DOM manipulation
   - Learn `useContext` for sharing data
   - Understand `useMemo` and `useCallback` for performance
   - Practice with `useReducer` for complex state
   - Build custom hooks

2. **TypeScript** (02-typescript)
   - Add type safety to your React code
   - Learn proper typing patterns

3. **Forms** (03-react-hook-form)
   - Handle user input efficiently
   - Validate data with schemas

4. **Data Fetching** (04-tanstack-query)
   - Fetch and cache data properly
   - Handle loading and error states

5. **Routing** (05-react-router)
   - Create multi-page applications
   - Navigate between views

6. **State Management** (06-redux-toolkit)
   - Manage complex global state
   - Handle async operations

---

## 🎓 Tips

- **Start Small:** Don't try to learn everything at once
- **Type Everything:** Use TypeScript from the beginning
- **Read the Code:** Each example includes comments explaining key concepts
- **Experiment:** Modify examples to understand how they work
- **Build Projects:** Apply concepts in your own projects
- **Check Console:** Many examples log to the browser console

---

## 🔗 Resources

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [React Hook Form](https://react-hook-form.com/)
- [TanStack Query](https://tanstack.com/query)
- [React Router](https://reactrouter.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

---

## 🐛 Troubleshooting

**Issue:** Type errors with TypeScript
- **Solution:** Make sure to use `.tsx` extension for files with JSX

**Issue:** Module not found errors
- **Solution:** Run `npm install` to install all dependencies

**Issue:** React hooks errors
- **Solution:** Make sure you're using React 18+ (`npm install react@latest react-dom@latest`)

**Issue:** Vite build errors
- **Solution:** Clear cache and reinstall: `rm -rf node_modules package-lock.json && npm install`

---

## 📝 Notes

- All examples use **React 18** features
- Examples are written in **TypeScript** for better type safety
- Code follows **modern React best practices**
- Each example is **self-contained** and can be used independently
- **Mock APIs** (jsonplaceholder.typicode.com) are used for data fetching examples

---

## 🚀 Next Steps

After mastering these examples:

1. Build a **complete project** combining all concepts
2. Learn **testing** with Jest and React Testing Library
3. Explore **Next.js** for server-side rendering
4. Study **performance optimization** techniques
5. Learn **state management patterns** (Context vs Redux)
6. Master **advanced TypeScript** patterns
7. Build **production-ready** applications

---

**Happy Coding! 🎉**

For questions or issues, refer to the official documentation linked above or check the code comments in each example file.
