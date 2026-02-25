import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Conexión a MongoDB Atlas
const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Atlas Conectado: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    return;
  } catch (error: any) {
    console.error("❌ Error conectando a MongoDB Atlas:", error.message);
    process.exit(1);
  }
};

// Ruta de salud
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  let dbMessage = "Desconectado";

  switch (dbStatus) {
    case 0:
      dbMessage = "Desconectado";
      break;
    case 1:
      dbMessage = "Conectado";
      break;
    case 2:
      dbMessage = "Conectando";
      break;
    case 3:
      dbMessage = "Desconectando";
      break;
  }

  res.json({
    success: true,
    message: "🚀 NexusProjects Backend funcionando",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: dbMessage,
    databaseStatus: dbStatus,
  });
});

// Ruta principal API
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "🎉 ¡Bienvenido a NexusProjects API!",
    version: "1.0.0",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        profile: "GET /api/auth/profile",
      },
      health: "/api/health",
      testDb: "/api/test-db",
    },
  });
});

// Ruta de prueba de MongoDB
app.get("/api/test-db", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "⏳ Base de datos no conectada",
        status: mongoose.connection.readyState,
      });
    }

    const adminDb = mongoose.connection.db?.admin();
    if (!adminDb) {
      return res.status(503).json({
        success: false,
        message: "❌ Admin DB no disponible",
      });
    }

    const result = await adminDb.ping();

    res.json({
      success: true,
      message: "✅ MongoDB responde correctamente",
      ping: result,
      database: mongoose.connection.name,
      host: mongoose.connection.host,
    });
  } catch (error: any) {
    console.error("❌ Error en test-db:", error);
    res.status(500).json({
      success: false,
      message: "❌ Error conectando a MongoDB",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Error de base de datos",
    });
  }
});

// Manejo de errores global
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("❌ Error del servidor:", err);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
);

// RUTA 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "🔍 Ruta no encontrada",
    path: req.originalUrl,
    method: req.method,
  });
});

// Función principal para iniciar servidor
const startServer = async (): Promise<void> => {
  try {
    console.log("🔄 Conectando a MongoDB Atlas...");

    // Conectar a la base de datos primero
    await connectDB();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log("====================================");
      console.log("🚀 NEXUSPROJECTS BACKEND INICIADO");
      console.log("====================================");
      console.log(`📍 Servidor: http://localhost:${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
      console.log(`📊 MongoDB: ${process.env.MONGODB_URI ? "Atlas" : "Local"}`);
      console.log("   PORT:", process.env.PORT);
      console.log(
        "   JWT_SECRET:",
        process.env.JWT_SECRET ? "✅ DEFINIDO" : "❌ NO DEFINIDO"
      );
      console.log(
        `💾 DB Estado: ${
          mongoose.connection.readyState === 1
            ? "✅ Conectado"
            : "❌ Desconectado"
        }`
      );
      console.log("====================================");
      console.log("✅ Rutas disponibles:");
      console.log("   GET /api          - Información API");
      console.log("   GET /api/health   - Salud del servidor");
      console.log("   GET /api/test-db  - Test MongoDB");
      console.log("   POST /api/auth/register - Registrar usuario");
      console.log("   POST /api/auth/login    - Iniciar sesión");
      console.log("   GET /api/auth/profile   - Perfil usuario");
      console.log("====================================");
    });
  } catch (error) {
    console.error("❌ Error crítico al iniciar el servidor:", error);
    process.exit(1);
  }
};

// Manejadores de eventos de MongoDB
mongoose.connection.on("connected", () => {
  console.log("✅ Mongoose conectado a MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Error de Mongoose:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️  Mongoose desconectado");
});

// Manejador de cierre graceful
process.on("SIGINT", async () => {
  console.log("🔄 Cerrando conexiones...");
  await mongoose.connection.close();
  console.log("✅ Conexiones cerradas");
  process.exit(0);
});

// Iniciar la aplicación
startServer();
