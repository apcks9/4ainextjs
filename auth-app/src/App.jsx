import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HorizontalLayout from './pages/HorizontalLayout';
import RowLayout from './pages/RowLayout';
import GridLayout from './pages/GridLayout';
import GridOnly from './pages/GridOnly';
import GridWithHistory from './pages/GridWithHistory';
import Subscription from './pages/Subscription';
import Payment from './pages/Payment';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscription"
            element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/horizontal-layout"
            element={
              <ProtectedRoute>
                <HorizontalLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/row-layout"
            element={
              <ProtectedRoute>
                <RowLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grid-layout"
            element={
              <ProtectedRoute>
                <GridLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grid-only"
            element={
              <ProtectedRoute>
                <GridOnly />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grid-with-history"
            element={
              <ProtectedRoute>
                <GridWithHistory />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
