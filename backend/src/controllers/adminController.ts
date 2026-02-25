import { Request, Response } from "express";
import User from "../models/User";
import mongoose from "mongoose";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const getPendingUsers = async (req: AuthRequest, res: Response) => {
  try {
    // Verificar que el usuario es admin
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No autorizado. Se requiere rol de administrador.",
      });
    }

    const pendingUsers = await User.find({ status: "pending" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        users: pendingUsers,
        count: pendingUsers.length,
      },
    });
  } catch (error) {
    console.error("Error obteniendo usuarios pendientes:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const approveUser = async (req: AuthRequest, res: Response) => {
  try {
    // Verificar que el usuario es admin
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No autorizado. Se requiere rol de administrador.",
      });
    }

    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Actualizar usuario
    user.status = "active";
    user.isActive = true;
    user.approvedBy = new mongoose.Types.ObjectId(req.user.userId);
    user.approvedAt = new Date();

    await user.save();

    res.json({
      success: true,
      message: "Usuario aprobado exitosamente",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          approvedBy: user.approvedBy,
          approvedAt: user.approvedAt,
        },
      },
    });
  } catch (error) {
    console.error("Error aprobando usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const rejectUser = async (req: AuthRequest, res: Response) => {
  try {
    // Verificar que el usuario es admin
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No autorizado. Se requiere rol de administrador.",
      });
    }

    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Marcar como rechazado
    user.status = "rejected";
    user.isActive = false;

    await user.save();

    res.json({
      success: true,
      message: "Usuario rechazado",
    });
  } catch (error) {
    console.error("Error rechazando usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const getUsersStats = async (req: AuthRequest, res: Response) => {
  try {
    // Verificar que el usuario es admin
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No autorizado. Se requiere rol de administrador.",
      });
    }

    const stats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          total: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
        },
      },
    ]);

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const pendingUsers = await User.countDocuments({ status: "pending" });

    res.json({
      success: true,
      data: {
        stats,
        summary: {
          totalUsers,
          activeUsers,
          pendingUsers,
          inactiveUsers: totalUsers - activeUsers,
        },
      },
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};
