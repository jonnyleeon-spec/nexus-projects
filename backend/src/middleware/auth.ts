// [file name]: auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: any;
}

// ✅ FUNCIÓN PARA OBTENER SECRET EN TIEMPO DE EJECUCIÓN
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET no configurado");
  }
  return secret;
};

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token de acceso requerido",
      });
    }

    // ✅ OBTENER SECRET EN TIEMPO DE EJECUCIÓN
    const JWT_SECRET = getJwtSecret();

    console.log("🔐 Verificando token...");

    // ✅ VERIFICAR TOKEN
    const decoded: any = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token decodificado:", {
      userId: decoded.userId,
      email: decoded.email,
    });

    // ✅ BUSCAR USUARIO
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.error("❌ Usuario no encontrado para ID:", decoded.userId);
      return res.status(403).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // ✅ AGREGAR USUARIO COMPLETO A LA REQUEST
    req.user = {
      _id: user._id,
      id: user._id.toString(),
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      company: user.company,
      phone: user.phone,
      lastLogin: user.lastLogin,
    };

    console.log("✅ Usuario autenticado:", user.email);
    next();
  } catch (error: any) {
    console.error("❌ Error en autenticación:", error);

    if (error.message === "JWT_SECRET no configurado") {
      return res.status(500).json({
        success: false,
        message: "Error de configuración del servidor",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({
        success: false,
        message: "Token JWT inválido",
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).json({
        success: false,
        message: "Token expirado",
      });
    }

    return res.status(403).json({
      success: false,
      message: "Error de autenticación",
    });
  }
};

// Middleware para verificar roles específicos
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "No tiene permisos para realizar esta acción",
      });
    }
    next();
  };
};

export const authenticateToken = authenticate;
