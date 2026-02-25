import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { authService } from "../services/authService";
import { onlineService } from "../services/onlineService";
import type {
  UserProfile,
  LoginData,
  RegisterData,
} from "../services/authService";
import type { OnlineUser } from "../services/onlineService";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  onlineUsers: number;
  onlineUsersList: OnlineUser[];
  updateOnlineUsers: (count: number, users?: OnlineUser[]) => void;
  userStatus: "online" | "offline";
  updateUserStatus: (status: "online" | "offline") => void;
  fetchOnlineUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [onlineUsersList, setOnlineUsersList] = useState<OnlineUser[]>([]);
  const [userStatus, setUserStatus] = useState<"online" | "offline">("offline");

  // ✅ FUNCIÓN ACTUALIZADA: Obtener usuarios online
  const fetchOnlineUsers = useCallback(async () => {
    if (!user) return;

    try {
      console.log("🔄 Actualizando lista de usuarios online...");

      // ✅ PERMITIR SOLO A admin Y user ver lista completa
      if (user.role === "admin" || user.role === "user") {
        // Admin y usuarios: obtener lista completa
        const result = await onlineService.getOnlineUsers();
        if (result.success) {
          console.log(
            `✅ ${result.users.length} usuarios online obtenidos para rol: ${user.role}`
          );
          updateOnlineUsers(result.count, result.users);
        }
      } else {
        // Clientes y proveedores: solo obtener estadísticas
        const result = await onlineService.getOnlineStats();
        if (result.success) {
          console.log(
            `📊 Estadísticas online para ${user.role}: ${result.stats.total} usuarios`
          );
          updateOnlineUsers(result.stats.total, []);
        }
      }
    } catch (error) {
      console.error("❌ Error obteniendo usuarios online:", error);
    }
  }, [user]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const profileResponse = await authService.getProfile();
          const userData = profileResponse.data.user;

          if (userData) {
            setUser(userData);
            console.log(
              "✅ Usuario autenticado:",
              userData.email,
              "Estado:",
              userData.status
            );
          } else {
            console.log("❌ No se recibió datos de usuario en checkAuth");
            authService.logout();
            setUser(null);
          }
        } catch (error) {
          console.error("Error verificando autenticación:", error);
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // ✅ EFECTO SIMPLIFICADO: Actualizar usuarios online periódicamente
  useEffect(() => {
    if (!user) return;

    // Obtener inmediatamente al cargar
    fetchOnlineUsers();

    // Actualizar cada 60 segundos (menos carga en el servidor)
    const interval = window.setInterval(fetchOnlineUsers, 60000);
    return () => window.clearInterval(interval);
  }, [user, fetchOnlineUsers]);

  // ✅ EFECTO ELIMINADO: El heartbeat ahora lo maneja useOnlineStatus hook
  // ❌ SE ELIMINÓ el efecto duplicado de heartbeat que causaba conflictos

  const login = async (loginData: LoginData) => {
    try {
      setLoading(true);
      setError("");

      console.log("🔄 Iniciando login en AuthContext...");
      const response = await authService.login(loginData);

      if (response.success) {
        console.log("✅ Login exitoso en AuthContext:", response);

        if (response.data.user) {
          setUser(response.data.user);
          console.log(
            "✅ Usuario establecido en estado:",
            response.data.user.email
          );
        } else {
          console.log("❌ No se recibió datos de usuario");
          throw new Error("Error en los datos del usuario");
        }
      } else {
        const errorMessage = response.message || "Error en el login";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("❌ Error en AuthContext login:", error);

      let errorMessage = "Error al iniciar sesión";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      setLoading(true);
      setError("");

      console.log("Iniciando registro en AuthContext...");
      const response = await authService.register(registerData);

      console.log("Registro exitoso en AuthContext:", response);

      console.log("Usuario registrado como pending - debe esperar aprobación");
    } catch (error: any) {
      console.error("Error en AuthContext register:", error.message);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("🔴 LOGOUT INICIADO - Limpieza completa");

    // 1. Limpiar estado de React INMEDIATAMENTE
    setUser(null);
    setOnlineUsers(0);
    setOnlineUsersList([]);
    setUserStatus("offline");
    setError("");
    setLoading(false);

    // 2. Limpiar storage completamente
    authService.logout();

    console.log("✅ LOGOUT COMPLETADO - Estado limpiado correctamente");
  };

  const updateOnlineUsers = useCallback(
    (count: number, users?: OnlineUser[]) => {
      setOnlineUsers((prevCount) => {
        if (prevCount === count) return prevCount;
        console.log(`🔄 Actualizando onlineUsers: ${prevCount} -> ${count}`);
        return count;
      });

      if (users) {
        setOnlineUsersList((prevList) => {
          // ✅ COMPARACIÓN MÁS EFICIENTE PARA EVITAR RENDERIZADOS DUPLICADOS
          if (prevList.length === users.length) {
            const isSame = prevList.every(
              (user, index) =>
                user.userId === users[index]?.userId &&
                user.lastSeen === users[index]?.lastSeen
            );
            if (isSame) {
              return prevList; // No actualizar si es la misma lista
            }
          }

          console.log(
            `🔄 Actualizando onlineUsersList: ${prevList.length} -> ${users.length} usuarios`
          );
          return users;
        });
      }
    },
    []
  );

  const updateUserStatus = (status: "online" | "offline") => {
    setUserStatus(status);
    // ❌ ELIMINADA la llamada directa a onlineService - ahora lo maneja el hook useOnlineStatus
    console.log(`🔄 Estado de usuario actualizado a: ${status}`);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: user !== null,
    onlineUsers,
    onlineUsersList,
    updateOnlineUsers,
    userStatus,
    updateUserStatus,
    fetchOnlineUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
