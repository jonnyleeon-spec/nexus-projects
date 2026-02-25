import { api } from "./api";

export interface OnlineUser {
  userId: string;
  role: string;
  name: string;
  email: string;
  lastSeen: string;
}

export interface OnlineStats {
  total: number;
  byRole: Record<string, number>;
  lastCleanup: number;
  memoryUsage: number;
  serverTime: string;
  uptime: number;
  nodeVersion: string;
}

// 🆕 SERVICIO MEJORADO CON RECONEXIÓN INTELIGENTE
class OnlineService {
  private isInitialized = false;
  private requestQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue = false;
  private initializationPromise: Promise<void> | null = null;

  // 🆕 INICIALIZACIÓN CON GESTIÓN DE CONCURRENCIA
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Evitar múltiples inicializaciones simultáneas
    if (!this.initializationPromise) {
      this.initializationPromise = this._initialize();
    }

    return this.initializationPromise;
  }

  private async _initialize(): Promise<void> {
    try {
      await this.setOnline();
      this.isInitialized = true;
      this.initializationPromise = null;
      console.log("✅ Online service inicializado");
    } catch (error) {
      this.initializationPromise = null;
      console.error("❌ Error inicializando online service:", error);
      throw error;
    }
  }

  // 🆕 ESTABLECER ESTADO ONLINE CON REINTENTOS
  async setOnline(): Promise<void> {
    try {
      await api.post("/auth/online", {
        action: "online",
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      // No lanzar error para evitar interrumpir flujo principal
      if (error.response?.status !== 401) {
        // Ignorar errores de auth
        console.warn("⚠️ No se pudo establecer estado online:", error.message);
        this.queueRequest(() => this.setOnline());
      }
    }
  }

  // 🆕 ESTABLECER OFFLINE CON TOLERANCIA A ERRORES
  async setOffline(): Promise<void> {
    try {
      await api.post("/auth/online", {
        action: "offline",
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      // Log informativo pero no crítico
      if (error.response?.status !== 401) {
        console.warn("⚠️ No se pudo establecer estado offline:", error.message);
      }
    } finally {
      this.isInitialized = false;
      this.initializationPromise = null;
    }
  }

  // 🆕 HEARTBEAT CON MANEJO MEJORADO DE ERRORES
  async sendHeartbeat(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
      return;
    }

    try {
      await api.post("/auth/online/heartbeat", {
        action: "heartbeat",
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent.substring(0, 100), // Limitar longitud
      });
    } catch (error: any) {
      console.warn("⚠️ Error en heartbeat:", error.message);
      this.isInitialized = false; // Forzar reinicialización en próximo heartbeat
      throw error; // Propagar para que el hook maneje el reintento
    }
  }

  // 🆕 OBTENER USUARIOS ONLINE CON FALLBACK
  async getOnlineUsers(): Promise<{
    success: boolean;
    count: number;
    users: OnlineUser[];
  }> {
    try {
      const response = await api.get("/auth/online-users");
      return {
        success: true,
        count: response.data.data?.length || 0,
        users: response.data.data || [],
      };
    } catch (error: any) {
      console.error("❌ Error obteniendo usuarios online:", error.message);
      return {
        success: false,
        count: 0,
        users: [],
      };
    }
  }

  // 🆕 OBTENER ESTADÍSTICAS
  async getOnlineStats(): Promise<{ success: boolean; stats: OnlineStats }> {
    try {
      const response = await api.get("/auth/online-stats");
      return {
        success: true,
        stats: response.data.data,
      };
    } catch (error: any) {
      console.error("❌ Error obteniendo estadísticas:", error.message);
      throw error;
    }
  }

  // 🆕 DEBUG (solo desarrollo)
  async getDebugInfo(): Promise<any> {
    // Usar window para verificar entorno en lugar de process
    if (
      typeof window !== "undefined" &&
      window.location.hostname !== "localhost"
    ) {
      console.warn("⚠️ Debug info solo disponible en desarrollo");
      return null;
    }

    try {
      const response = await api.get("/auth/online/debug");
      return response.data.data;
    } catch (error: any) {
      console.error("❌ Error obteniendo debug info:", error.message);
      return null;
    }
  }

  // 🆕 COLA DE REQUEST PARA REINTENTOS
  private queueRequest(request: () => Promise<void>): void {
    this.requestQueue.push(request);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    try {
      while (this.requestQueue.length > 0) {
        const request = this.requestQueue.shift();
        if (request) {
          try {
            await request();
          } catch (error) {
            console.warn("⚠️ Error procesando request encolada:", error);
          }
        }
      }
    } finally {
      this.isProcessingQueue = false;
    }
  }

  // 🆕 ESTADO ACTUAL DEL SERVICIO
  getStatus(): { isInitialized: boolean; queueLength: number } {
    return {
      isInitialized: this.isInitialized,
      queueLength: this.requestQueue.length,
    };
  }
}

export const onlineService = new OnlineService();
