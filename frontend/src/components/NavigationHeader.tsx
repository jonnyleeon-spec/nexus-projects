import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import OnlineUsersDropdown from "./OnlineUsersDropdown";
import { Menu, X } from "lucide-react"; // Para menú hamburguesa (opcional)

const NavigationHeader: React.FC = () => {
  const { user, logout, isAuthenticated, onlineUsers, onlineUsersList } =
    useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnlineDropdownOpen, setIsOnlineDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Para móvil
  const menuRef = useRef<HTMLDivElement>(null);
  const onlineDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        onlineDropdownRef.current &&
        !onlineDropdownRef.current.contains(event.target as Node)
      ) {
        setIsOnlineDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = useCallback(() => {
    console.log("🔴🔴🔴 1. NAVIGATIONHEADER - LOGOUT INICIADO");
    setIsMenuOpen(false);
    setIsOnlineDropdownOpen(false);
    setIsMobileMenuOpen(false);

    localStorage.clear();
    sessionStorage.clear();
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");

    logout();

    setTimeout(() => {
      console.log("📍 REDIRECCIÓN FORZADA A HOME");
      window.location.replace("/");
    }, 100);
  }, [logout]);

  const menuItems = [
    {
      label: "Mi Perfil",
      action: () => navigate("/profile"),
      roles: ["customer", "provider", "user", "admin"],
    },
    {
      label: "Notificaciones",
      action: () => navigate("/notifications"),
      roles: ["customer", "provider", "user", "admin"],
    },
    {
      label: "Dashboard Admin",
      action: () => navigate("/admin-dashboard"),
      roles: ["admin"],
    },
    {
      label: "Cerrar Sesión",
      action: handleLogout,
      roles: ["customer", "provider", "user", "admin"],
    },
  ];

  const filteredMenuItems = isLoggingOut
    ? []
    : menuItems.filter((item) => item.roles.includes(user?.role || ""));

  const getRoleDisplay = (role: string) => {
    const roles: { [key: string]: string } = {
      admin: "Admin",
      user: "Usuario Interno",
      customer: "Cliente",
      provider: "Proveedor",
    };
    return roles[role] || role;
  };

  const shouldShowOnlineStatus =
    isAuthenticated &&
    !isLoggingOut &&
    (user?.role === "admin" || user?.role === "user");

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() =>
                navigate(user && !isLoggingOut ? "/dashboard" : "/")
              }
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#059669] to-[#0d7e5d] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-lg leading-none">
                  NexusProjects
                </span>
                <span className="text-xs text-gray-500 leading-none mt-1 hidden sm:block">
                  Gestión Inteligente
                </span>
              </div>
            </div>
          </div>

          {/* Zona derecha: online + menú usuario + botones (no autenticado) */}
          <div className="flex items-center space-x-2 sm:space-x-4" ref={menuRef}>
            {/* Estado Online (solo para admin/user) */}
            {shouldShowOnlineStatus && (
              <div className="relative" ref={onlineDropdownRef}>
                <button
                  onClick={() => {
                    if (!isLoggingOut) {
                      setIsOnlineDropdownOpen((prev) => !prev);
                    }
                  }}
                  className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 hover:bg-green-100 transition-colors text-sm"
                >
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-700">
                      {onlineUsers}
                    </span>
                  </div>
                  <span className="text-xs text-green-600 hidden sm:inline">
                    online
                  </span>
                </button>
                <OnlineUsersDropdown
                  isOpen={isOnlineDropdownOpen}
                  onClose={() => setIsOnlineDropdownOpen(false)}
                />
              </div>
            )}

            {/* Usuario autenticado */}
            {isAuthenticated && !isLoggingOut ? (
              <div className="relative">
                <button
                  onClick={() => !isLoggingOut && setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#059669] to-[#0d7e5d] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="text-left hidden md:block">
                      <div className="text-sm font-medium text-gray-900 leading-none">
                        {user?.name?.split(" ")[0] || "Usuario"}
                      </div>
                      <div className="text-xs text-gray-500 leading-none mt-1">
                        {getRoleDisplay(user?.role || "")}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Menú desplegable del usuario */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">
                        {user?.name}
                      </div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                    <div className="py-1">
                      {filteredMenuItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={item.action}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                        >
                          <span className="flex-1">{item.label}</span>
                          {item.label === "Dashboard Admin" && (
                            <span className="text-xs bg-[#059669] bg-opacity-10 text-[#059669] px-2 py-0.5 rounded-full">
                              Admin
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Usuario NO autenticado: botones de acceso */
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => !isLoggingOut && navigate("/login")}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-[#059669] border border-[#059669] rounded-lg hover:bg-[#059669] hover:text-white transition-colors"
                >
                  <span className="hidden sm:inline">Iniciar sesión</span>
                  <span className="sm:hidden">Ingresar</span>
                </button>
                <button
                  onClick={() => !isLoggingOut && navigate("/register")}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-white bg-[#059669] rounded-lg hover:bg-[#0d7e5d] transition-colors"
                >
                  <span className="hidden sm:inline">Registrarse</span>
                  <span className="sm:hidden">Registro</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;