// [file name]: authController.ts
import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// ✅ FUNCIONES PARA OBTENER VARIABLES EN TIEMPO DE EJECUCIÓN
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error(
      "❌ ERROR CRÍTICO: JWT_SECRET no está definido en las variables de entorno"
    );
    throw new Error("JWT_SECRET no configurado");
  }
  return secret;
};

const getJwtExpiresIn = (): string => {
  return process.env.JWT_EXPIRES_IN || "7d";
};

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, company, phone } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "El usuario ya existe",
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear nuevo usuario con estado "pending"
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
      status: "pending",
      company: company || "",
      phone: phone || "",
      lastLogin: null,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message:
        "Usuario registrado exitosamente. Esperando aprobación del administrador.",
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
          company: newUser.company,
        },
      },
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Intentando login para:", email);

    // ✅ OBTENER SECRET EN TIEMPO DE EJECUCIÓN
    const JWT_SECRET = getJwtSecret();
    const JWT_EXPIRES_IN = getJwtExpiresIn();

    console.log("✅ JWT_SECRET cargado correctamente");

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ Usuario no encontrado:", email);
      return res.status(400).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("❌ Contraseña inválida para:", email);
      return res.status(400).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Verificar si el usuario está aprobado
    if (user.status !== "active") {
      console.log("❌ Usuario no activo:", email, "Estado:", user.status);
      return res.status(403).json({
        success: false,
        message: "Tu cuenta está pendiente de aprobación por el administrador",
      });
    }

    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();

    console.log("✅ Credenciales válidas, generando token...");

    // ✅ GENERAR TOKEN
    const payload: JwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    console.log("✅ Token generado exitosamente para:", email);

    res.json({
      success: true,
      message: "Login exitoso",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          company: user.company,
          phone: user.phone,
          lastLogin: user.lastLogin,
        },
      },
    });
  } catch (error: any) {
    console.error("❌ Error en login:", error);

    // Manejar error específico de JWT_SECRET
    if (error.message === "JWT_SECRET no configurado") {
      return res.status(500).json({
        success: false,
        message: "Error de configuración del servidor - JWT_SECRET faltante",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          company: user.company,
          phone: user.phone,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const getPendingUsers = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para realizar esta acción",
      });
    }

    const pendingUsers = await User.find(
      { status: "pending" },
      { password: 0 }
    ).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        pendingUsers,
        total: pendingUsers.length,
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

export const approveUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { userId } = req.params;

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para realizar esta acción",
      });
    }

    const userToApprove = await User.findById(userId);
    if (!userToApprove) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    userToApprove.status = "active";
    userToApprove.isActive = true;
    userToApprove.approvedBy = user._id;
    userToApprove.approvedAt = new Date();
    await userToApprove.save();

    res.json({
      success: true,
      message: "Usuario aprobado exitosamente",
      data: {
        user: {
          id: userToApprove._id,
          name: userToApprove.name,
          email: userToApprove.email,
          role: userToApprove.role,
          status: userToApprove.status,
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

export const rejectUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { userId } = req.params;

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para realizar esta acción",
      });
    }

    const userToReject = await User.findById(userId);
    if (!userToReject) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    userToReject.status = "rejected";
    userToReject.isActive = false;
    await userToReject.save();

    res.json({
      success: true,
      message: "Usuario rechazado exitosamente",
    });
  } catch (error) {
    console.error("Error rechazando usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};
