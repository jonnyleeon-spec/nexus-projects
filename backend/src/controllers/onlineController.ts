import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";

// 🆕 INTERFACES MEJORADAS
interface OnlineUser {
  userId: string;
  role: string;
  name: string;
  email: string;
  lastSeen: Date;
  socketId?: string;
}

interface OnlineStats {
  total: number;
  byRole: Record<string, number>;
  lastCleanup: number;
  memoryUsage: number;
}

// 🆕 CLASE OPTIMIZADA PARA GESTIÓN DE MEMORIA
class OnlineUserManager {
  private users: Map<string, OnlineUser>;
  private lastCleanup: number;
  private cleanupInterval: NodeJS.Timeout;
  private readonly CLEANUP_INTERVAL = 60000; // 1 minuto
  private readonly USER_TIMEOUT = 120000; // 2 minutos sin heartbeat

  constructor() {
    this.users = new Map();
    this.lastCleanup = Date.now();
    this.cleanupInterval = setInterval(
      () => this.cleanup(),
      this.CLEANUP_INTERVAL
    );
    console.log(
      "🟢 OnlineUserManager inicializado - Cleanup automático activado"
    );
  }

  // Agregar/actualizar usuario online
  updateUser(userData: Omit<OnlineUser, "lastSeen">): void {
    this.users.set(userData.userId, {
      ...userData,
      lastSeen: new Date(),
    });

    console.log(
      `🟢 Usuario actualizado: ${userData.name} (Total: ${this.users.size})`
    );
  }

  // Eliminar usuario específico
  removeUser(userId: string): void {
    const user = this.users.get(userId);
    if (user) {
      this.users.delete(userId);
      console.log(
        `🔴 Usuario removido: ${user.name} (Total: ${this.users.size})`
      );
    }
  }

  // Limpieza automática de usuarios inactivos
  private cleanup(): void {
    const now = Date.now();
    let removedCount = 0;

    for (const [userId, user] of this.users.entries()) {
      const timeSinceLastSeen = now - user.lastSeen.getTime();

      if (timeSinceLastSeen > this.USER_TIMEOUT) {
        this.users.delete(userId);
        removedCount++;
        console.log(
          `🧹 Usuario limpiado por inactividad: ${user.name} (${Math.round(
            timeSinceLastSeen / 1000
          )}s)`
        );
      }
    }

    if (removedCount > 0) {
      console.log(
        `📊 Cleanup: ${removedCount} usuarios removidos. Total activos: ${this.users.size}`
      );
    }

    this.lastCleanup = now;
  }

  // Obtener usuarios online (según permisos)
  getOnlineUsers(requesterRole: string): OnlineUser[] {
    const users = Array.from(this.users.values());

    // Filtrar según permisos de rol
    if (requesterRole === "admin" || requesterRole === "user") {
      return users.map((user) => ({
        ...user,
        lastSeen: new Date(user.lastSeen), // Clonar para evitar mutaciones
      }));
    } else {
      // provider y customer solo ven estadísticas, no lista completa
      return [];
    }
  }

  // Obtener estadísticas (disponible para todos)
  getStats(): OnlineStats {
    const users = Array.from(this.users.values());
    const roleCount = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: users.length,
      byRole: roleCount,
      lastCleanup: this.lastCleanup,
      memoryUsage:
        Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100, // MB con 2 decimales
    };
  }

  // Obtener datos para debug (solo desarrollo/admin)
  getDebugInfo() {
    const users = Array.from(this.users.values());
    return {
      users: users.map((user) => ({
        ...user,
        lastSeen: user.lastSeen.toISOString(),
        inactiveFor: Date.now() - user.lastSeen.getTime(),
      })),
      total: users.length,
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    };
  }

  // Destructor para limpieza
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.users.clear();
    console.log("🛑 OnlineUserManager destruido");
  }
}

// 🆕 INSTANCIA GLOBAL OPTIMIZADA
export const onlineUserManager = new OnlineUserManager();

// 🎯 CONTROLADORES ACTUALIZADOS

// Actualizar estado online
export const updateOnlineStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { action } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    if (action === "online" || action === "heartbeat") {
      onlineUserManager.updateUser({
        userId: user._id.toString(),
        role: user.role,
        name: user.name,
        email: user.email,
      });
    } else if (action === "offline") {
      onlineUserManager.removeUser(user._id.toString());
    }

    res.json({
      success: true,
      message: `Estado ${action} actualizado`,
      totalOnline: onlineUserManager.getStats().total,
    });
  } catch (error) {
    console.error("❌ Error en updateOnlineStatus:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Obtener usuarios online (con filtros de permisos)
export const getOnlineUsers = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const onlineUsers = onlineUserManager.getOnlineUsers(user.role);

    res.json({
      success: true,
      data: onlineUsers,
      total: onlineUsers.length,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("❌ Error en getOnlineUsers:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Obtener estadísticas (disponible para todos los roles)
export const getOnlineStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = onlineUserManager.getStats();

    res.json({
      success: true,
      data: {
        ...stats,
        serverTime: new Date(),
        uptime: process.uptime(),
        nodeVersion: process.version,
      },
    });
  } catch (error) {
    console.error("❌ Error en getOnlineStats:", error);
    res.status(500).json({
      success: false,
      message: "Error obteniendo estadísticas",
    });
  }
};

// 🆕 ENDPOINT DE DEBUG (solo desarrollo/admin)
export const debugOnlineUsers = async (req: AuthRequest, res: Response) => {
  try {
    // Solo para admin en desarrollo
    if (process.env.NODE_ENV !== "development" && req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado",
      });
    }

    const debugInfo = onlineUserManager.getDebugInfo();

    res.json({
      success: true,
      data: debugInfo,
    });
  } catch (error) {
    console.error("❌ Error en debugOnlineUsers:", error);
    res.status(500).json({
      success: false,
      message: "Error en debug",
    });
  }
};
