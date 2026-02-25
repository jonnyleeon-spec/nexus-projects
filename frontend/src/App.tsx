import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import { useOnlineStatus } from "./hooks/useOnlineStatus";

// ✅ MOVER useOnlineStatus AQUÍ para que solo se monte una vez
function AppContent() {
  // ✅ SOLO UNA VEZ en el componente raíz, fuera de las rutas
  useOnlineStatus();

  return (
    <Router>
      <Routes>
        {/* RUTAS PÚBLICAS (todos pueden acceder SIEMPRE) */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />

        {/* RUTAS DE AUTENTICACIÓN (solo para no autenticados) */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <Login defaultTab="register" />
            </AuthRoute>
          }
        />

        {/* RUTAS PROTEGIDAS (pueden acceder todos, pero el contenido cambia según autenticación) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="p-8">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <DashboardContent />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div className="p-8">
                <h1 className="text-2xl font-bold">Mi Perfil</h1>
                <ProfileContent />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Ruta por defecto - SIEMPRE a HOME */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Componente para rutas protegidas (solo para usuarios autenticados)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // SI NO está autenticado, mostrar children igualmente (NO REDIRIGIR)
  // Cada página se encargará de su propia lógica de acceso
  return <>{children}</>;
};

// Componente para rutas de autenticación (login/register)
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si YA está autenticado, redirigir a HOME
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Componentes que manejan su propio acceso
const DashboardContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">
          🔒 Debes iniciar sesión para acceder al Dashboard
        </p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="bg-[#350a06] text-white px-6 py-2 rounded-lg hover:bg-[#4a0e08] transition-colors"
        >
          Iniciar Sesión
        </button>
      </div>
    );
  }

  return <p>Bienvenido al Dashboard - Contenido para usuarios autenticados</p>;
};

const ProfileContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">
          🔒 Debes iniciar sesión para ver tu perfil
        </p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="bg-[#350a06] text-white px-6 py-2 rounded-lg hover:bg-[#4a0e08] transition-colors"
        >
          Iniciar Sesión
        </button>
      </div>
    );
  }

  return <p>Esta es tu página de perfil - solo usuarios autenticados</p>;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
