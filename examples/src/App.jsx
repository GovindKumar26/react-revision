import './App.css'

// Import examples (uncomment the one you want to run)
// import UseStateExamples from '../01-hooks/01-useState'
// import UseEffectExamples from '../01-hooks/02-useEffect'
// import UseRefExamples from '../01-hooks/03-useRef'
// import UseContextExamples from '../01-hooks/04-useContext'
// import UseMemoCallbackExamples from '../01-hooks/05-useMemo-useCallback'
// import UseReducerExamples from '../01-hooks/06-useReducer'
// import CustomHooksExamples from '../01-hooks/07-customHooks'
// import TypeScriptExamples from '../02-typescript/typescript-examples'
// import ReactHookFormExamples from '../03-react-hook-form/form-examples'
// import TanStackQueryExamples from '../04-tanstack-query/query-examples'
// import RouterExamples from '../05-react-router/router-examples'
// import ReduxToolkitExamples from '../06-redux-toolkit/redux-examples'

function App() {
  const examples = [
    { id: 'hooks-state', name: '01: useState', path: '01-hooks/01-useState.jsx' },
    { id: 'hooks-effect', name: '02: useEffect', path: '01-hooks/02-useEffect.jsx' },
    { id: 'hooks-ref', name: '03: useRef', path: '01-hooks/03-useRef.jsx' },
    { id: 'hooks-context', name: '04: useContext', path: '01-hooks/04-useContext.jsx' },
    { id: 'hooks-memo', name: '05: useMemo/useCallback', path: '01-hooks/05-useMemo-useCallback.jsx' },
    { id: 'hooks-reducer', name: '06: useReducer', path: '01-hooks/06-useReducer.jsx' },
    { id: 'hooks-custom', name: '07: Custom Hooks', path: '01-hooks/07-customHooks.jsx' },
    { id: 'typescript', name: 'TypeScript', path: '02-typescript/typescript-examples.jsx' },
    { id: 'forms', name: 'React Hook Form', path: '03-react-hook-form/form-examples.jsx' },
    { id: 'query', name: 'TanStack Query', path: '04-tanstack-query/query-examples.jsx' },
    { id: 'router', name: 'React Router', path: '05-react-router/router-examples.jsx' },
    { id: 'redux', name: 'Redux Toolkit', path: '06-redux-toolkit/redux-examples.jsx' },
  ]

  return (
    <div className="App">
      <h1>React Examples Collection</h1>
      
      <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>📚 How to Use</h2>
        <ol style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li>First, install dependencies: <code>npm install</code></li>
          <li>Then run: <code>npm run dev</code></li>
          <li>Open <code>src/App.jsx</code></li>
          <li>Uncomment the import and component you want to run</li>
          <li>Save and see the example in action!</li>
        </ol>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Available Examples:</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {examples.map(example => (
            <li key={example.id} style={{ margin: '10px 0' }}>
              <strong>{example.name}</strong>
              <br />
              <code style={{ fontSize: '12px', color: '#666' }}>
                Import from: {example.path}
              </code>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: '#fff3cd', borderRadius: '8px' }}>
        <h3>⚠️ Quick Start</h3>
        <p>Run these commands in the terminal:</p>
        <pre style={{ background: '#333', color: '#fff', padding: '15px', borderRadius: '4px', textAlign: 'left' }}>
          cd examples{'\n'}
          npm install{'\n'}
          npm run dev
        </pre>
      </div>

      {/* Uncomment ONE of these to run that example */}
      {/* <UseStateExamples /> */}
      {/* <UseEffectExamples /> */}
      {/* <UseRefExamples /> */}
      {/* <UseContextExamples /> */}
      {/* <UseMemoCallbackExamples /> */}
      {/* <UseReducerExamples /> */}
      {/* <CustomHooksExamples /> */}
      {/* <TypeScriptExamples /> */}
      {/* <ReactHookFormExamples /> */}
      {/* <TanStackQueryExamples /> */}
      {/* <RouterExamples /> */}
      {/* <ReduxToolkitExamples /> */}
    </div>
  )
}

export default App
