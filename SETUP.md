# Setup Guide - React Examples

## Current Situation

The `examples/` folder contains **standalone example files** that need to be copied into a proper React project to work. These files currently show errors because React and dependencies aren't installed.

## Option 1: Quick Setup (Recommended)

Initialize a React project in the examples folder:

```powershell
# Navigate to the examples folder
cd examples

# Create a new Vite React TypeScript project
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install

# Install additional libraries
npm install react-hook-form zod @hookform/resolvers
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install react-router-dom
npm install @reduxjs/toolkit react-redux

# Run development server
npm run dev
```

## Option 2: Create New Project and Copy Examples

```powershell
# Create new project
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app

# Install all dependencies
npm install
npm install react-hook-form zod @hookform/resolvers
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install react-router-dom
npm install @reduxjs/toolkit react-redux

# Copy example files from ../examples/ into src/
# Then run the dev server
npm run dev
```

## Option 3: Use Examples as Reference Only

Keep the examples as **reference code** in this folder and copy specific examples into your own React projects as needed. This is useful if you want to keep your notes organized separately from working projects.

## What Each Folder Needs

### 01-hooks/
- ✅ No installation needed (uses only React built-ins)
- Just needs React + ReactDOM

### 02-typescript/
- ✅ No extra installation
- Needs React + TypeScript

### 03-react-hook-form/
- 📦 `npm install react-hook-form zod @hookform/resolvers`

### 04-tanstack-query/
- 📦 `npm install @tanstack/react-query @tanstack/react-query-devtools`

### 05-react-router/
- 📦 `npm install react-router-dom`

### 06-redux-toolkit/
- 📦 `npm install @reduxjs/toolkit react-redux`

## File Extensions

- `.jsx` files → Use in JavaScript React projects
- `.tsx` files → Use in TypeScript React projects (recommended)

## Next Steps

Choose one of the options above and run the commands. Once complete, the errors will disappear and you can run the examples!
