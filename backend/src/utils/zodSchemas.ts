import { z } from "zod";

// Esquema base para todos los usuarios
const baseUserSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),

  email: z
    .string()
    .email("Email inválido")
    .min(5, "El email debe tener al menos 5 caracteres"),

  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres"),

  phone: z.string().optional().or(z.literal("")),

  role: z.enum(["customer", "provider", "user", "admin"]),

  notifications: z
    .object({
      email: z.boolean().default(true),
      whatsapp: z.boolean().default(false),
    })
    .default({
      email: true,
      whatsapp: false,
    }),
});

// Esquemas específicos por rol
const customerFields = z.object({
  customerType: z.string().optional().default("individual"),
  industry: z.string().optional().default("General"),
  productType: z.string().optional().default("Servicios"),
  company: z.string().optional().default(""),
});

const providerFields = z.object({
  company: z.string().optional().default("Empresa"),
  productType: z.string().optional().default("Productos/Servicios"),
  website: z.string().url().optional().or(z.literal("")).default(""),
});

const userFields = z.object({
  company: z.string().optional().default("Empresa"),
  industry: z.string().optional().default("General"),
  position: z.string().optional().default("Empleado"),
  employeeId: z.string().optional().default("temp-id-123"),
});

// Esquema de ubicación
const locationSchema = z.object({
  address: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(200, "La dirección no puede exceder 200 caracteres"),

  coordinates: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
});

// Campos opcionales comunes
const optionalFields = z.object({
  location: locationSchema.optional(),
  adminMessage: z
    .string()
    .max(500, "El mensaje no puede exceder 500 caracteres")
    .optional()
    .or(z.literal("")),
});

// Esquema de registro completo usando discriminated union
export const registerSchema = z.discriminatedUnion("role", [
  // Customer
  baseUserSchema
    .merge(customerFields)
    .merge(optionalFields)
    .extend({
      role: z.literal("customer"),
    }),

  // Provider
  baseUserSchema
    .merge(providerFields)
    .merge(optionalFields)
    .extend({
      role: z.literal("provider"),
    }),

  // User
  baseUserSchema
    .merge(userFields)
    .merge(optionalFields)
    .extend({
      role: z.literal("user"),
    }),

  // Admin
  baseUserSchema.merge(optionalFields).extend({
    role: z.literal("admin"),
  }),
]);

// Esquema de login
export const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "El email es requerido"),

  password: z.string().min(1, "La contraseña es requerida"),
});

// Tipos TypeScript
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
