// [file name]: User.ts
// [file content begin]
import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "customer" | "provider" | "user" | "admin";
  status: "active" | "inactive" | "pending" | "rejected";

  // ✅ NUEVO CAMPO: lastLogin agregado
  lastLogin?: Date;

  // NUEVOS CAMPOS PARA APROBACIÓN
  isOnline: boolean;
  isActive: boolean;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;

  // Campos específicos por rol
  customerType?: string;
  industry?: string;
  productType?: string;

  company?: string;
  website?: string;

  position?: string;
  employeeId?: string;

  // Configuración de notificaciones
  notifications: {
    email: boolean;
    whatsapp: boolean;
  };

  // Ubicación
  location?: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  // Mensaje opcional para admin
  adminMessage?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["customer", "provider", "user", "admin"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "rejected"],
      default: "pending",
    },

    // ✅ NUEVO CAMPO: lastLogin agregado al schema
    lastLogin: {
      type: Date,
      default: null,
    },

    // NUEVOS CAMPOS
    isOnline: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },

    // Campos para customer
    customerType: String,
    industry: String,
    productType: String,

    // Campos para provider y user
    company: String,
    website: String,

    // Campos específicos para user
    position: String,
    employeeId: String,

    // Configuración de notificaciones
    notifications: {
      email: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: false },
    },

    // Ubicación
    location: {
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },

    // Mensaje para admin
    adminMessage: String,
  },
  {
    timestamps: true,
  }
);

// Índices para mejor performance
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ lastLogin: 1 }); // ✅ NUEVO ÍNDICE para lastLogin

export default mongoose.model<IUser>("User", userSchema);
// [file content end]
