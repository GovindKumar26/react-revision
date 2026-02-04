// React Router - Complete Examples
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Link, 
  NavLink,
  useParams, 
  useNavigate,
  Navigate,
  Outlet,
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import { useState } from 'react';

// ========================================
// PAGES
// ========================================

function Home() {
  return (
    <div>
      <h2>Home Page</h2>
      <p>Welcome to the home page!</p>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About Page</h2>
      <p>This is the about page.</p>
    </div>
  );
}

function Contact() {
  return (
    <div>
      <h2>Contact Page</h2>
      <p>Get in touch with us!</p>
    </div>
  );
}

function NotFound() {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">Go Home</Link>
    </div>
  );
}

// ========================================
// DYNAMIC ROUTES WITH useParams
// ========================================

const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'Manager' },
];

function Users() {
  return (
    <div>
      <h2>Users List</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UserDetail() {
  const { userId } = useParams();
  const user = users.find(u => u.id === Number(userId));
  const navigate = useNavigate();

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h2>User Details</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <button onClick={() => navigate('/users')}>Back to Users</button>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}

// ========================================
// NESTED ROUTES WITH OUTLET
// ========================================

function Dashboard() {
  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <nav style={{ borderRight: '1px solid #ccc', paddingRight: '20px' }}>
        <h3>Dashboard</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link to="/dashboard/overview">Overview</Link></li>
          <li><Link to="/dashboard/analytics">Analytics</Link></li>
          <li><Link to="/dashboard/settings">Settings</Link></li>
        </ul>
      </nav>
      <div style={{ flex: 1 }}>
        <Outlet /> {/* Child routes render here */}
      </div>
    </div>
  );
}

function Overview() {
  return <div><h3>Dashboard Overview</h3><p>Overview content here</p></div>;
}

function Analytics() {
  return <div><h3>Analytics</h3><p>Analytics data here</p></div>;
}

function Settings() {
  return <div><h3>Settings</h3><p>Settings panel here</p></div>;
}

// ========================================
// PROTECTED ROUTES
// ========================================

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated] = useState(false); // Simulate auth

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    alert('Logged in!');
    navigate('/dashboard');
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function Admin() {
  return (
    <div>
      <h2>Admin Panel</h2>
      <p>Protected content for authenticated users only.</p>
    </div>
  );
}

// ========================================
// LINK VS NAVLINK
// ========================================

function Navigation() {
  return (
    <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
      <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', margin: 0, padding: 0 }}>
        <li>
          <NavLink 
            to="/" 
            style={({ isActive }) => ({
              color: isActive ? 'red' : 'blue',
              fontWeight: isActive ? 'bold' : 'normal'
            })}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/about"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact">Contact</NavLink>
        </li>
        <li>
          <NavLink to="/users">Users</NavLink>
        </li>
        <li>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
      </ul>
    </nav>
  );
}

// ========================================
// TRADITIONAL ROUTING (BrowserRouter)
// ========================================

export function TraditionalRouting() {
  return (
    <BrowserRouter>
      <div style={{ padding: '20px' }}>
        <h1>React Router - Traditional Routing</h1>
        <Navigation />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          
          {/* Dynamic routes */}
          <Route path="/users" element={<Users />} />
          <Route path="/users/:userId" element={<UserDetail />} />
          
          {/* Nested routes */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Overview />} />
            <Route path="overview" element={<Overview />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Protected route */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// ========================================
// MODERN ROUTING (createBrowserRouter)
// ========================================

// Layout component
function RootLayout() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>React Router - Modern Routing</h1>
      <Navigation />
      <Outlet />
    </div>
  );
}

// Create router object
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'users',
        children: [
          {
            index: true,
            element: <Users />,
          },
          {
            path: ':userId',
            element: <UserDetail />,
          },
        ],
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
        children: [
          {
            index: true,
            element: <Overview />,
          },
          {
            path: 'overview',
            element: <Overview />,
          },
          {
            path: 'analytics',
            element: <Analytics />,
          },
          {
            path: 'settings',
            element: <Settings />,
          },
        ],
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export function ModernRouting() {
  return <RouterProvider router={router} />;
}

// ========================================
// PROGRAMMATIC NAVIGATION
// ========================================

function ProgrammaticNav() {
  const navigate = useNavigate();

  return (
    <div>
      <h3>Programmatic Navigation</h3>
      <button onClick={() => navigate('/')}>Go Home</button>
      <button onClick={() => navigate('/about')}>Go to About</button>
      <button onClick={() => navigate(-1)}>Go Back</button>
      <button onClick={() => navigate(1)}>Go Forward</button>
      <button onClick={() => navigate('/users/1', { replace: true })}>
        Go to User 1 (replace)
      </button>
    </div>
  );
}

// ========================================
// EXPORT DEFAULT - CHOOSE ONE
// ========================================

// Use TraditionalRouting OR ModernRouting
export default TraditionalRouting;
// export default ModernRouting;

/*
INSTALLATION:
npm install react-router-dom

MODERN ROUTING (createBrowserRouter) - Benefits:
✅ Data loading with loaders
✅ Actions for forms
✅ Better error handling
✅ Automatic loading states
✅ Type-safe routes
*/
