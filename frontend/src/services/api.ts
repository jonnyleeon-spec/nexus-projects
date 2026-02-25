import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Variable para controlar redirecciones
let shouldRedirectOnAuthError = true;

// Función para deshabilitar redirecciones temporalmente
export const disableAuthRedirect = () => {
  shouldRedirectOnAuthError = false;
  setTimeout(() => {
    shouldRedirectOnAuthError = true;
  }, 2000); // Re-activar después de 2 segundos
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("🔐 Interceptor 401 - Token inválido/expirado");

      // Limpiar storage siempre
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      // Solo redirigir a login en casos específicos
      const currentPath = window.location.pathname;

      // NO redirigir si ya estamos en login/register/home
      const publicRoutes = ["/login", "register", "/", "/home"];
      const isPublicRoute = publicRoutes.includes(currentPath);

      // NO redirigir si la petición fallida es de online-service
      const isOnlineServiceRequest =
        error.config?.url?.includes("/auth/online");

      if (!isPublicRoute && !isOnlineServiceRequest) {
        console.log("🔄 Redirigiendo a login desde página protegida");
        window.location.href = "/login";
      } else {
        console.log("🚫 No redirigir - Ruta pública o proceso de logout");
      }
    }
    return Promise.reject(error);
  }
);
