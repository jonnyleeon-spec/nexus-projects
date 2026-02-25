import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { onlineService } from "../services/onlineService";

export const useOnlineStatus = () => {
  const { user, isAuthenticated, updateOnlineUsers } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [lastHeartbeat, setLastHeartbeat] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionHealth, setConnectionHealth] = useState<
    "healthy" | "degraded" | "offline"
  >("healthy");

  const userRef = useRef(user);
  const retryCountRef = useRef(retryCount);
  const isAuthenticatedRef = useRef(isAuthenticated);
  const isInitializedRef = useRef(false);

  // Actualizar refs cuando cambien los valores
  useEffect(() => {
    userRef.current = user;
    retryCountRef.current = retryCount;
    isAuthenticatedRef.current = isAuthenticated;
  }, [user, retryCount, isAuthenticated]);

  useEffect(() => {
    // ✅ EVITAR MÚLTIPLAS INICIALIZACIONES
    if (isInitializedRef.current) {
      return;
    }

    if (!isAuthenticated || !user) {
      console.log("👤 No user - skipping online status initialization");
      return;
    }

    let heartbeatInterval: number;
    let healthCheckInterval: number;
    let usersUpdateInterval: number;
    let isMounted = true;

    console.log("🟢 Starting online status monitoring for user:", user.name);
    isInitializedRef.current = true;

    const sendHeartbeat = async (isRetry = false): Promise<void> => {
      if (!isMounted || !userRef.current) return;

      try {
        await onlineService.sendHeartbeat();

        if (isMounted) {
          setIsOnline(true);
          setLastHeartbeat(new Date());
          setRetryCount(0);
          setConnectionHealth("healthy");

          if (isRetry) {
            console.log("✅ Heartbeat restaurado después de reconexión");
          }
        }
      } catch (error: any) {
        if (isMounted) {
          console.warn("❌ Error en heartbeat:", error.message);
          setConnectionHealth("degraded");

          const currentRetryCount = retryCountRef.current;
          const nextRetry = Math.min(
            1000 * Math.pow(2, currentRetryCount),
            30000
          );

          console.log(
            `🔄 Reintento en ${nextRetry}ms (intento ${currentRetryCount + 1})`
          );

          setRetryCount((prev) => prev + 1);

          setTimeout(() => {
            if (isMounted && userRef.current) {
              sendHeartbeat(true);
            }
          }, nextRetry);
        }
      }
    };

    const checkConnectionHealth = () => {
      if (!lastHeartbeat) return;

      const timeSinceLastHeartbeat = Date.now() - lastHeartbeat.getTime();
      const currentUser = userRef.current;

      if (!currentUser) {
        setConnectionHealth("offline");
        setIsOnline(false);
        return;
      }

      if (timeSinceLastHeartbeat > 90000) {
        setConnectionHealth("offline");
        setIsOnline(false);
        console.warn(
          "🔴 Conexión perdida - último heartbeat hace",
          Math.round(timeSinceLastHeartbeat / 1000),
          "segundos"
        );
      } else if (timeSinceLastHeartbeat > 60000) {
        setConnectionHealth("degraded");
        console.log("🟡 Conexión degradada");
      }
    };

    const updateOnlineUsersList = async () => {
      if (!isMounted || !userRef.current) return;

      try {
        const result = await onlineService.getOnlineUsers();

        if (isMounted && result.success) {
          // ✅ EVITAR ACTUALIZACIONES DUPLICADAS
          updateOnlineUsers(result.count, result.users);
        }
      } catch (error) {
        console.warn("⚠️ Error actualizando lista de usuarios online:", error);
      }
    };

    // Inicializar servicio
    const initialize = async () => {
      try {
        await onlineService.initialize();
        await sendHeartbeat();
        await updateOnlineUsersList();
      } catch (error) {
        console.error("❌ Error inicializando online service:", error);
      }
    };

    initialize();

    // Configurar intervalos
    heartbeatInterval = window.setInterval(() => {
      if (isMounted && userRef.current) {
        sendHeartbeat();
      }
    }, 45000);

    healthCheckInterval = window.setInterval(() => {
      if (isMounted && userRef.current) {
        checkConnectionHealth();
      }
    }, 30000);

    usersUpdateInterval = window.setInterval(() => {
      if (isMounted && userRef.current) {
        updateOnlineUsersList();
      }
    }, 60000);

    // Cleanup optimizado
    return () => {
      console.log("🧹 Cleaning up online status monitoring");
      isMounted = false;
      isInitializedRef.current = false;
      window.clearInterval(heartbeatInterval);
      window.clearInterval(healthCheckInterval);
      window.clearInterval(usersUpdateInterval);

      if (userRef.current) {
        onlineService.setOffline().catch((error) => {
          console.warn("⚠️ Error setting offline on cleanup:", error);
        });
      }
    };
  }, [isAuthenticated, user?.id, updateOnlineUsers]); // ✅ DEPENDENCIAS MÍNIMAS

  return {
    isOnline,
    lastHeartbeat,
    connectionHealth,
    retryCount,
  };
};
