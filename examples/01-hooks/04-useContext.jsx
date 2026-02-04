// useContext - Sharing Data Without Props Drilling
import { createContext, useContext, useState } from 'react';

// Example 1: Theme Context
const ThemeContext = createContext();

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

function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#000' : '#fff',
        padding: '10px 20px',
        border: '1px solid #ccc'
      }}
    >
      Toggle Theme (Current: {theme})
    </button>
  );
}

function ThemedPanel() {
  const { theme } = useContext(ThemeContext);

  return (
    <div style={{
      background: theme === 'light' ? '#f0f0f0' : '#222',
      color: theme === 'light' ? '#000' : '#fff',
      padding: '20px',
      marginTop: '10px'
    }}>
      <p>This panel uses the {theme} theme</p>
    </div>
  );
}

function ThemeExample() {
  return (
    <ThemeProvider>
      <ThemedButton />
      <ThemedPanel />
    </ThemeProvider>
  );
}

// Example 2: User Authentication Context
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    // Simulate login
    if (username && password) {
      setUser({ username, id: Date.now() });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function LoginForm() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
    setUsername('');
    setPassword('');
  };

  return (
    <form onSubmit={handleSubmit}>
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

function UserProfile() {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div>
      <h3>Welcome, {user.username}!</h3>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

function AuthExample() {
  return (
    <AuthProvider>
      <UserProfile />
    </AuthProvider>
  );
}

// Example 3: Shopping Cart Context
const CartContext = createContext();

function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = (product) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      getTotal,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

function ProductList() {
  const { addToCart } = useContext(CartContext);

  const products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 29 },
    { id: 3, name: 'Keyboard', price: 79 }
  ];

  return (
    <div>
      <h3>Products</h3>
      {products.map(product => (
        <div key={product.id} style={{ marginBottom: '10px' }}>
          <span>{product.name} - ${product.price}</span>
          <button onClick={() => addToCart(product)} style={{ marginLeft: '10px' }}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

function Cart() {
  const { items, removeFromCart, getTotal, getItemCount } = useContext(CartContext);

  return (
    <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
      <h3>Cart ({getItemCount()} items)</h3>
      {items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {items.map(item => (
            <div key={item.id} style={{ marginBottom: '10px' }}>
              <span>{item.name} x {item.quantity} = ${item.price * item.quantity}</span>
              <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: '10px' }}>
                Remove
              </button>
            </div>
          ))}
          <h4>Total: ${getTotal()}</h4>
        </>
      )}
    </div>
  );
}

function CartExample() {
  return (
    <CartProvider>
      <ProductList />
      <Cart />
    </CartProvider>
  );
}

// Example 4: Multiple Contexts
const LanguageContext = createContext();
const NotificationContext = createContext();

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  const translations = {
    en: { greeting: 'Hello', goodbye: 'Goodbye' },
    es: { greeting: 'Hola', goodbye: 'Adiós' },
    fr: { greeting: 'Bonjour', goodbye: 'Au revoir' }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

function MultiContextComponent() {
  const { language, setLanguage, translations } = useContext(LanguageContext);
  const { addNotification } = useContext(NotificationContext);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    addNotification(`Language changed to ${lang}`);
  };

  return (
    <div>
      <h3>{translations.greeting}!</h3>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('es')}>Español</button>
      <button onClick={() => changeLanguage('fr')}>Français</button>
    </div>
  );
}

function NotificationDisplay() {
  const { notifications } = useContext(NotificationContext);

  return (
    <div style={{ position: 'fixed', top: '10px', right: '10px' }}>
      {notifications.map(notif => (
        <div key={notif.id} style={{
          background: '#4CAF50',
          color: 'white',
          padding: '10px',
          marginBottom: '5px',
          borderRadius: '4px'
        }}>
          {notif.message}
        </div>
      ))}
    </div>
  );
}

function MultiContextExample() {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <MultiContextComponent />
        <NotificationDisplay />
      </NotificationProvider>
    </LanguageProvider>
  );
}

export default function UseContextExamples() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>useContext Examples</h1>
      
      <section>
        <h2>1. Theme Context</h2>
        <ThemeExample />
      </section>
      
      <section>
        <h2>2. Authentication Context</h2>
        <AuthExample />
      </section>
      
      <section>
        <h2>3. Shopping Cart Context</h2>
        <CartExample />
      </section>
      
      <section>
        <h2>4. Multiple Contexts</h2>
        <MultiContextExample />
      </section>
    </div>
  );
}
