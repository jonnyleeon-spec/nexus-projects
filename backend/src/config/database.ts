import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// INSTRUCCIÓN: Configuración de conexión a MongoDB Atlas
export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!, {
      // Opciones recomendadas para MongoDB Atlas
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Atlas Conectado: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
  } catch (error: any) {
    console.error("❌ Error conectando a MongoDB Atlas:", error.message);
    process.exit(1);
  }
};
