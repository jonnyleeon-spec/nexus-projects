import { api } from "./api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "customer" | "provider" | "user" | "admin";
  customerType?: string;
  industry?: string;
  productType?: string;
  company?: string;
  website?: string;
  position?: string;
  employeeId?: string;
  notifications?: {
    email: boolean;
    whatsapp: boolean;
  };
  location?: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  adminMessage?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string; // "pending", "active", "inactive", "rejected"
  isActive: boolean; // true/false
  phone?: string;
  customerType?: string;
  industry?: string;
  productType?: string;
  company?: string;
  website?: string;
  position?: string;
  employeeId?: string;
  // Campos de aprobación
  approvedBy?: string;
  approvedAt?: string;
  isOnline?: boolean;
}

class AuthService {
  async login(loginData: LoginData) {
    try {
      const response = await api.post("/auth/login", loginData);
      if (response.data.success) {
        this.setAuthData(response.data.data);
      }
      return response.data;
    } catch (error: any) {
      console.error("❌ Error en authService.login:", error);

      // ✅ CORRECCIÓN: Propagar el error del backend correctamente
      if (error.response?.data) {
        // Si el backend devuelve un mensaje específico, usarlo
        throw new Error(error.response.data.message || "Error en el login");
      }
      throw error; // Re-lanzar otros errores (red, etc.)
    }
  }

  async register(registerData: RegisterData) {
    try {
      console.log("📤 Enviando datos de registro:", registerData);
      const response = await api.post("/auth/register", registerData);

      if (response.data.success) {
        this.setAuthData(response.data.data);
        return response.data;
      } else {
        throw new Error(response.data.message || "Error en el registro");
      }
    } catch (error: any) {
      console.error("❌ Error completo en authService:", error);

      // MOSTRAR DETALLES ESPECÍFICOS DE VALIDACIÓN ZOD
      if (error.response?.data?.errors) {
        console.error(
          "🔍 Errores de validación Zod:",
          error.response.data.errors
        );

        // Crear mensaje detallado con todos los errores
        const detailedErrors = error.response.data.errors
          .map((err: any) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");

        console.error("📋 Errores detallados:", detailedErrors);
        throw new Error(`Errores de validación: ${detailedErrors}`);
      }

      // Extraer el mensaje específico del backend
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error desconocido en el registro";

      console.error("📝 Mensaje de error:", errorMessage);
      throw new Error(errorMessage);
    }
  }

  async getProfile() {
    const response = await api.get("/auth/profile");
    return response.data;
  }

  private setAuthData(authData: any) {
    if (authData.token) {
      localStorage.setItem("authToken", authData.token);
    }
    if (authData.user) {
      localStorage.setItem("user", JSON.stringify(authData.user));
    }
  }

  logout() {
    console.log("🔴🔴🔴 3. AUTHSERVICE - LOGOUT INICIADO");

    // Limpiar localStorage COMPLETAMENTE
    localStorage.clear();

    // Limpiar sessionStorage
    sessionStorage.clear();

    // Limpiar cookies de auth
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    console.log("✅ Auth service: Todo el almacenamiento limpiado");
  }

  private clearAuthCookies() {
    // Limpiar cookies de autenticación
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  private clearAllAuthItems() {
    // Limpiar todos los items que puedan estar relacionados con auth
    const authKeys = [
      "authToken",
      "user",
      "token",
      "auth",
      "userData",
      "userProfile",
      "session",
    ];

    authKeys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  isAuthenticated() {
    const token = this.getToken();
    const hasToken = !!token;
    console.log("🔍 Verificando autenticación - Token existe:", hasToken);
    return hasToken;
  }

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      console.log("🔍 Usuario actual en storage:", user ? user.email : "null");
      return user;
    } catch (error) {
      console.error("❌ Error obteniendo usuario actual:", error);
      return null;
    }
  }

  getToken() {
    const token = localStorage.getItem("authToken");
    console.log("🔍 Token obtenido:", token ? "EXISTE" : "NO EXISTE");
    return token;
  }

  // ✅ NUEVO MÉTODO: Verificar estado completo de autenticación
  getAuthStatus() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    const isAuthenticated = this.isAuthenticated();

    return {
      token: token,
      user: user,
      isAuthenticated: isAuthenticated,
      hasToken: !!token,
      hasUser: !!user,
    };
  }
}

export const authService = new AuthService();
