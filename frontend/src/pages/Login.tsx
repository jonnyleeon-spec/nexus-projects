import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  defaultTab?: "login" | "register";
}

const Login: React.FC<LoginProps> = ({ defaultTab = "login" }) => {
  // ==== POR ESTE CÓDIGO NUEVO ====
  const [isLogin, setIsLogin] = useState(() => {
    // Estado inicial basado en el prop o parámetro URL
    const initialTab =
      defaultTab || (tab === "register" ? "register" : "login");
    return initialTab === "login";
  });
  const { login, register } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { tab } = useParams();
  const navigate = useNavigate();
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Prioridad: 1. Prop defaultTab, 2. Parámetro URL, 3. Default login
    const initialTab =
      defaultTab || (tab === "register" ? "register" : "login");
    setIsLogin(initialTab === "login");
  }, [tab, defaultTab]);

  const [registerData, setRegisterData] = useState({
    // Campos base
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "customer" as "customer" | "provider" | "user",
    requestMessage: "",
    hasWhatsApp: false,
    notificationPreference: "email" as "email" | "whatsapp" | "both",
    // INSTRUCCIÓN: Ubicación removida del registro normal - solo estará en roles específicos
    location: "",

    // Campos específicos por rol (opcionales en registro)
    company: "",
    customerType: "individual" as "individual" | "business",
    industry: "",
    productType: "",
    website: "",
    position: "",
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    setError("");

    try {
      await login(loginData);
      console.log("✅ Login exitoso, redirigiendo a home público...");
      navigate("/"); // ← Redirigir a home público (/)
    } catch (error: any) {
      console.error("❌ Error en login:", error);

      const errorMessage = error.message || "Error al iniciar sesión";

      if (errorMessage.includes("Credenciales inválidas")) {
        setError("❌ Email o contraseña incorrectos");
      } else if (errorMessage.includes("pendiente de aprobación")) {
        setError(
          "⏳ Tu cuenta está pendiente de aprobación. Contacta al administrador."
        );
      } else if (errorMessage.includes("Cuenta pendiente")) {
        setError(
          "⏳ Tu cuenta está pendiente de aprobación. Contacta al administrador."
        );
      } else if (
        errorMessage.includes("no existe") ||
        errorMessage.includes("no encontrado")
      ) {
        setError("❌ Usuario no registrado");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLocalLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // INICIO CÓDIGO NUEVO - Validación antes de enviar
    if (!validateRegisterForm()) {
      setError("Por favor corrige los errores en el formulario");
      return;
    }
    // FIN CÓDIGO NUEVO

    setLoading(true);
    setError("");

    try {
      console.log("🔄 handleRegisterSubmit iniciado...");

      // Preparar datos para el backend
      // Preparar datos para el backend
      const dataToSend = {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        phone: registerData.phone,
        role: registerData.role,
        notifications: {
          email:
            registerData.notificationPreference === "email" ||
            registerData.notificationPreference === "both",
          whatsapp:
            registerData.hasWhatsApp &&
            (registerData.notificationPreference === "whatsapp" ||
              registerData.notificationPreference === "both"),
        },
        // Campos específicos por rol CON VALORES POR DEFECTO
        ...(registerData.role === "customer" && {
          customerType: registerData.customerType || "individual",
          industry: registerData.industry || "General",
          productType: registerData.productType || "Servicios",
          company: registerData.company || "",
        }),
        ...(registerData.role === "provider" && {
          company: registerData.company || "Empresa",
          productType: registerData.productType || "Productos/Servicios",
          website: registerData.website || "",
        }),
        ...(registerData.role === "user" && {
          company: registerData.company || "Empresa",
          industry: registerData.industry || "General",
          position: registerData.position || "Empleado",
          employeeId: "temp-id-123", // Temporal
        }),
        adminMessage: registerData.requestMessage,
      };

      console.log("📤 Datos a enviar al backend:", dataToSend);

      await register(dataToSend);
      console.log("✅ Registro completado exitosamente en Login.tsx");

      // Redirigir a página de éxito (pública)
      navigate("/registration-success", {
        state: {
          email: registerData.email,
          name: registerData.name,
          phone: registerData.phone,
          notificationPreference: registerData.notificationPreference,
          hasWhatsApp: registerData.hasWhatsApp,
        },
      });
    } catch (error: any) {
      console.error("❌ Error en handleRegisterSubmit:", error.message);

      // MEJOR MANEJO DE ERRORES ESPECÍFICOS
      if (error.message.includes("El usuario ya existe")) {
        setError("❌ Este correo electrónico ya está registrado. Por favor:");
        // Opcional: agregar sugerencias
        setTimeout(() => {
          setError(
            "❌ Este correo electrónico ya está registrado. Por favor:\n• Usa otro correo electrónico\n• Inicia sesión si ya tienes cuenta\n• Recupera tu contraseña si la olvidaste"
          );
        }, 100);
      } else if (error.message.includes("Datos de registro inválidos")) {
        setError(
          "📝 Por favor completa todos los campos requeridos correctamente."
        );
      } else if (error.message.includes("Error de conexión")) {
        setError(
          "🔌 Error de conexión con el servidor. Intenta de nuevo en unos momentos."
        );
      } else {
        setError(
          error.message || "Error al registrar usuario. Intenta de nuevo."
        );
      }
    } finally {
      setLoading(false);
    }
  };
  // INICIO CÓDIGO NUEVO - Funciones de Validación
  const validateRegisterForm = () => {
    const errors: Record<string, string> = {};

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!registerData.email) {
      errors.email = "El email es requerido";
    } else if (!emailRegex.test(registerData.email)) {
      errors.email = "Formato de email inválido";
    }

    // Validación de contraseña
    if (!registerData.password) {
      errors.password = "La contraseña es requerida";
    } else if (registerData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    // Confirmación de contraseña
    if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    // Validación de teléfono
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!registerData.phone) {
      errors.phone = "El teléfono es requerido";
    } else if (!phoneRegex.test(registerData.phone)) {
      errors.phone = "Formato de teléfono inválido";
    }

    // Validación de nombre
    if (!registerData.name.trim()) {
      errors.name = "El nombre es requerido";
    }

    // Validaciones avanzadas por rol
    if (showAdvanced) {
      switch (registerData.role) {
        case "provider":
          if (!registerData.company?.trim()) {
            errors.company =
              "El nombre de la empresa es requerido para proveedores";
          }
          if (!registerData.productType?.trim()) {
            errors.productType = "El tipo de producto/servicio es requerido";
          }
          break;
        case "customer":
          if (!registerData.industry?.trim()) {
            errors.industry = "La industria/rubro es requerido para clientes";
          }
          break;
        case "user":
          if (!registerData.position?.trim()) {
            errors.position =
              "El cargo/puesto es requerido para usuarios internos";
          }
          break;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegisterChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setRegisterData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));

    // Limpiar error individual al escribir
    if (validationErrors[e.target.name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name];
        return newErrors;
      });
    }
  };

  // INICIO CÓDIGO CORREGIDO - Funciones FUERA de handleRegisterChange
  const handleFieldBlur = (fieldName: string) => {
    console.log(`Campo ${fieldName} perdió el foco`);
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
    validateSingleField(fieldName);
  };

  const validateSingleField = (fieldName: string) => {
    const errors: Record<string, string> = { ...validationErrors };

    switch (fieldName) {
      case "name":
        if (!registerData.name.trim()) {
          errors.name = "El nombre es requerido";
        } else {
          delete errors.name;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!registerData.email) {
          errors.email = "El email es requerido";
        } else if (!emailRegex.test(registerData.email)) {
          errors.email = "Formato de email inválido";
        } else {
          delete errors.email;
        }
        break;

      case "phone":
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        if (!registerData.phone) {
          errors.phone = "El teléfono es requerido";
        } else if (!phoneRegex.test(registerData.phone)) {
          errors.phone = "Formato de teléfono inválido";
        } else {
          delete errors.phone;
        }
        break;

      case "password":
        if (!registerData.password) {
          errors.password = "La contraseña es requerida";
        } else if (registerData.password.length < 6) {
          errors.password = "La contraseña debe tener al menos 6 caracteres";
        } else {
          delete errors.password;
        }
        break;

      case "confirmPassword":
        if (registerData.password !== registerData.confirmPassword) {
          errors.confirmPassword = "Las contraseñas no coinciden";
        } else {
          delete errors.confirmPassword;
        }
        break;

      default:
        break;
    }

    setValidationErrors(errors);
  };
  // FIN CÓDIGO CORREGIDO

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // INSTRUCCIÓN: Campos avanzados por rol
  const renderAdvancedFields = () => {
    switch (registerData.role) {
      case "customer":
        return (
          <div className="space-y-4 animate-fade-in">
            <h4 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
              🛍️ Información del Cliente
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="customerType"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Tipo de Cliente
                </label>
                <select
                  id="customerType"
                  name="customerType"
                  value={registerData.customerType}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#350a06] focus:border-[#350a06] transition-all text-slate-900 bg-white"
                >
                  <option value="individual">Individual</option>
                  <option value="business">Empresa</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="industry"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Industria/Rubro
                </label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={registerData.industry}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#350a06] focus:border-[#350a06] transition-all text-slate-900 bg-white"
                  placeholder="Tu industria o rubro"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Empresa
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={registerData.company}
                onChange={handleRegisterChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#350a06] focus:border-[#350a06] transition-all text-slate-900 bg-white"
                placeholder="Nombre de tu empresa"
              />
            </div>

            {/* INSTRUCCIÓN: Botón de Ubicación con Google para Clientes - MANTENIDO */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                📍 Ubicación con Google Maps
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={registerData.location}
                  onChange={handleRegisterChange}
                  name="location"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#350a06] focus:border-[#350a06] transition-all text-slate-900 bg-white"
                  placeholder="Selecciona tu ubicación..."
                  readOnly
                />
                <button
                  type="button"
                  onClick={() =>
                    alert("Función de Google Maps se implementará después")
                  }
                  className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium flex items-center space-x-2"
                >
                  <span>🗺️</span>
                  <span>Google Maps</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Usa Google Maps para seleccionar tu ubicación exacta
              </p>
            </div>
          </div>
        );

      case "provider":
        return (
          <div className="space-y-4 animate-fade-in">
            <h4 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
              🏢 Información del Proveedor
            </h4>
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Empresa
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={registerData.company}
                onChange={handleRegisterChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#350a06] focus:border-[#350a06] transition-all text-slate-900 bg-white"
                placeholder="Nombre de tu empresa"
              />
            </div>
            <div>
              <label
                htmlFor="productType"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Tipo de Productos/Servicios
              </label>
              <input
                type="text"
                id="productType"
                name="productType"
                value={registerData.productType}
                onChange={handleRegisterChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#350a06] focus:border-[#350a06] transition-all text-slate-900 bg-white"
                placeholder="Qué productos o servicios ofreces"
              />
            </div>
            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={registerData.website}
                onChange={handleRegisterChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#350a06] focus:border-[#350a06] transition-all text-slate-900 bg-white"
                placeholder="https://tudominio.com"
              />
            </div>

            {/* INSTRUCCIÓN: Botón de Ubicación con Google para Proveedores - MANTENIDO */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                📍 Ubicación con Google Maps
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={registerData.location}
                  onChange={handleRegisterChange}
                  name="location"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#350a06] focus:border-[#350a06] transition-all text-slate-900 bg-white"
                  placeholder="Ubicación de tu empresa..."
                  readOnly
                />
                <button
                  type="button"
                  onClick={() =>
                    alert("Función de Google Maps se implementará después")
                  }
                  className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium flex items-center space-x-2"
                >
                  <span>🗺️</span>
                  <span>Google Maps</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Selecciona la ubicación de tu empresa o sede principal
              </p>
            </div>
          </div>
        );

      case "user":
        return (
          <div className="space-y-4 animate-fade-in">
            <h4 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
              👥 Información de Usuario Interno
            </h4>

            {/* INSTRUCCIÓN: Solo estos 3 campos para Usuario Interno */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={registerData.company}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#350a06] focus:border-[#350a06] transition-all text-slate-900 bg-white"
                  placeholder="Tu nombre de usuario único"
                />
              </div>
              <div>
                <label
                  htmlFor="industry"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Industria/Rubro
                </label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={registerData.industry}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#350a06] focus:border-[#350a06] transition-all text-slate-900 bg-white"
                  placeholder="Industria de tu empresa"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Cargo/Puesto
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={registerData.position}
                onChange={handleRegisterChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#350a06] focus:border-[#350a06] transition-all text-slate-900 bg-white"
                placeholder="Tu cargo en la empresa"
              />
            </div>

            {/* INSTRUCCIÓN: Botón de Ubicación con Google para Usuarios Internos - MANTENIDO */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                📍 Ubicación con Google Maps
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={registerData.location}
                  onChange={handleRegisterChange}
                  name="location"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#350a06] focus:border-[#350a06] transition-all text-slate-900 bg-white"
                  placeholder="Tu ubicación de trabajo..."
                  readOnly
                />
                <button
                  type="button"
                  onClick={() =>
                    alert("Función de Google Maps se implementará después")
                  }
                  className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium flex items-center space-x-2"
                >
                  <span>🗺️</span>
                  <span>Google Maps</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Selecciona tu ubicación principal de trabajo
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Moderno - COLOR PRIMARIO: Azul corporativo 
          CAMBIAR: from-blue-600 por otro color primario */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#350a06] to-[#4a0e08] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-[#350a06] bg-clip-text text-transparent">
                  NexusProjects
                </h1>
                <p className="text-xs text-slate-500">Gestión Inteligente</p>
              </div>
            </Link>
            <Link
              to="/"
              className="text-slate-600 hover:text-blue-600 transition-colors flex items-center space-x-1"
            >
              <span>←</span>
              <span>Volver al inicio</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/60 p-6 sm:p-10">
          {/* Encabezado con pestañas - BOTONES: Azul profesional 
              CAMBIAR: text-blue-600 por otro color primario */}
          <div className="text-center mb-8">
            <div className="inline-flex bg-slate-100 rounded-2xl p-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  isLogin
                    ? "bg-white text-[#350a06] shadow-lg"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  !isLogin
                    ? "bg-white text-[#350a06] shadow-lg"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Solicitar Acceso
              </button>
            </div>

            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-[#350a06] bg-clip-text text-transparent mb-3">
              {isLogin ? "Bienvenido de nuevo" : "Únete a nosotros"}
            </h2>
            <p className="text-slate-600 text-lg">
              {isLogin
                ? "Accede a tu cuenta para continuar"
                : "Comienza tu journey con NexusProjects"}
            </p>
          </div>

          {/* FORMULARIO DE LOGIN - BOTÓN PRIMARIO: Azul corporativo
              CAMBIAR: bg-blue-600 por otro color primario */}
          {/* Mensaje de Error */}
          {error && (
            <div className="max-w-md mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl animate-fade-in">
              <div className="flex items-start space-x-3">
                <span className="text-lg">⚠️</span>
                <div className="flex-1">
                  <p className="font-semibold">Error en el registro</p>
                  <p className="text-sm mt-1 whitespace-pre-line">{error}</p>
                </div>
                <button
                  onClick={() => setError("")}
                  className="text-red-500 hover:text-red-700 text-lg"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          {isLogin ? (
            <form
              onSubmit={handleLoginSubmit}
              className="space-y-6 max-w-md mx-auto"
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="loginEmail"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="loginEmail"
                    name="email"
                    required
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#350a06] focus:border-[#350a06] transition-all duration-200 text-slate-900 bg-white"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="loginPassword"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="loginPassword"
                    name="password"
                    required
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#350a06] focus:border-[#350a06] transition-all duration-200 text-slate-900 bg-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={localLoading}
                className="w-full bg-[#350a06] text-white py-4 hover:bg-[#4a0e08] rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {localLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </button>
            </form>
          ) : (
            /* FORMULARIO DE REGISTRO - COLORES CONSISTENTES */
            <form onSubmit={handleRegisterSubmit} className="space-y-8">
              {/* Sección 1: Información Básica */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna Izquierda - Información Personal */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-slate-900 border-l-4 border-[#350a06] pl-4">
                    👤 Información Personal
                  </h3>

                  {/* Upload de Imagen */}
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div
                        className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                        onClick={triggerFileInput}
                      >
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <div className="text-2xl mb-1">📷</div>
                            <div className="text-xs text-slate-500">Foto</div>
                          </div>
                        )}
                      </div>
                      {profileImage && (
                        <button
                          type="button"
                          onClick={removeProfileImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <p className="text-xs text-slate-500 mt-2">Foto opcional</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={registerData.name}
                        onChange={handleRegisterChange}
                        onBlur={() => handleFieldBlur("name")}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#350a06] focus:border-[#350a06] transition-all text-slate-900 bg-white ${
                          validationErrors.name
                            ? "border-red-500"
                            : "border-slate-300"
                        }`}
                        placeholder="Tu nombre completo"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        onBlur={() => handleFieldBlur("email")}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#350a06] focus:border-[#350a06] transition-all text-slate-900 bg-white ${
                          validationErrors.email
                            ? "border-red-500"
                            : "border-slate-300"
                        }`}
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={registerData.phone}
                        onChange={handleRegisterChange}
                        onBlur={() => handleFieldBlur("phone")}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#350a06] focus:border-[#350a06] transition-all text-slate-900 bg-white ${
                          validationErrors.phone
                            ? "border-red-500"
                            : "border-slate-300"
                        }`}
                        placeholder="+1 234 567 8900"
                      />
                    </div>

                    {/* INSTRUCCIÓN: Sección de Ubicación ELIMINADA del registro normal 
                        Ahora solo aparece en los roles específicos (registro avanzado) */}
                  </div>
                </div>

                {/* Columna Derecha - Seguridad y Rol */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-slate-900 border-l-4 border-[#350a06] pl-4">
                    🔐 Seguridad y Rol
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Contraseña *
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        onBlur={() => handleFieldBlur("password")}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#350a06] focus:border-[#350a06] transition-all text-slate-900 bg-white ${
                          validationErrors.password
                            ? "border-red-500"
                            : "border-slate-300"
                        }`}
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Confirmar Contraseña *
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        onBlur={() => handleFieldBlur("confirmPassword")}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#350a06] focus:border-[#350a06] transition-all text-slate-900 bg-white ${
                          validationErrors.confirmPassword
                            ? "border-red-500"
                            : "border-slate-300"
                        }`}
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="role"
                        className="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Tipo de Cuenta *
                      </label>
                      <select
                        id="role"
                        name="role"
                        required
                        value={registerData.role}
                        onChange={handleRegisterChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#350a06] focus:border-[#350a06] transition-all text-slate-900 bg-white"
                      >
                        <option value="customer">👤 Cliente</option>
                        <option value="provider">🏢 Proveedor</option>
                        <option value="user">👥 Usuario Interno</option>
                      </select>
                    </div>

                    {/* INSTRUCCIÓN: Enlace de Registro Avanzado */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center space-x-1 mx-auto"
                      >
                        <span>{showAdvanced ? "▲" : "▼"}</span>
                        <span>
                          {showAdvanced ? "Ocultar" : "Registro Avanzado"}
                        </span>
                      </button>
                      <p className="text-xs text-slate-500 mt-1">
                        {showAdvanced
                          ? "Información específica según tu cuenta"
                          : "Incluye ubicación y detalles específicos de tu cuenta"}
                      </p>
                    </div>
                  </div>

                  {/* Configuración de Notificaciones */}
                  <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200/50">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id="hasWhatsApp"
                        name="hasWhatsApp"
                        checked={registerData.hasWhatsApp}
                        onChange={handleRegisterChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                      <label
                        htmlFor="hasWhatsApp"
                        className="ml-2 block text-sm text-slate-700"
                      >
                        📱 Mi número tiene WhatsApp
                      </label>
                    </div>

                    {registerData.hasWhatsApp && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Preferencia de notificación:
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="notificationPreference"
                              value="email"
                              checked={
                                registerData.notificationPreference === "email"
                              }
                              onChange={handleRegisterChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                            />
                            <span className="ml-2 text-sm text-slate-700">
                              📧 Solo Email
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="notificationPreference"
                              value="whatsapp"
                              checked={
                                registerData.notificationPreference ===
                                "whatsapp"
                              }
                              onChange={handleRegisterChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                            />
                            <span className="ml-2 text-sm text-slate-700">
                              💬 Solo WhatsApp
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="notificationPreference"
                              value="both"
                              checked={
                                registerData.notificationPreference === "both"
                              }
                              onChange={handleRegisterChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                            />
                            <span className="ml-2 text-sm text-slate-700">
                              📧💬 Ambos
                            </span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* INSTRUCCIÓN: Sección de Registro Avanzado 
                  Aquí aparecerá la ubicación específica para cada rol */}
              {showAdvanced && (
                <div className="border-t border-slate-200 pt-8">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
                    {renderAdvancedFields()}
                  </div>
                </div>
              )}

              {/* Mensaje para Administrador */}
              <div>
                <label
                  htmlFor="requestMessage"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  💬 Mensaje para el Administrador (Opcional)
                </label>
                <textarea
                  id="requestMessage"
                  name="requestMessage"
                  rows={3}
                  value={registerData.requestMessage}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#350a06] focus:border-[#350a06] transition-all text-slate-900 bg-white"
                  placeholder="Cuéntanos sobre tu interés en la plataforma o cualquier información adicional que consideres importante..."
                />
              </div>

              {/*Mensajes de error consolidados */}
              {Object.keys(validationErrors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in">
                  <div className="flex items-start space-x-3">
                    <span className="text-red-500 text-lg">⚠️</span>
                    <div className="flex-1">
                      <p className="font-semibold text-red-800 mb-2">
                        Por favor corrige los siguientes errores:
                      </p>
                      <ul className="text-sm text-red-700 space-y-1">
                        {validationErrors.name && (
                          <li>• {validationErrors.name}</li>
                        )}
                        {validationErrors.email && (
                          <li>• {validationErrors.email}</li>
                        )}
                        {validationErrors.phone && (
                          <li>• {validationErrors.phone}</li>
                        )}
                        {validationErrors.password && (
                          <li>• {validationErrors.password}</li>
                        )}
                        {validationErrors.confirmPassword && (
                          <li>• {validationErrors.confirmPassword}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón de Envío - COLOR PRIMARIO: Azul corporativo 
                  CAMBIAR: bg-blue-600 por otro color primario */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#350a06] text-white py-4 hover:bg-[#4a0e08] rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creando cuenta..." : "Solicitar Cuenta"}
              </button>
            </form>
          )}

          {/* Información Adicional - COLORES DE ESTADO: Verde éxito 
              CAMBIAR: from-green-50 por otros colores de estado */}
          {!isLogin && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200 text-center">
              <p className="text-sm text-slate-700">
                🚀 <strong>Registro Flexible:</strong> Completa solo la
                información básica ahora. Podrás agregar más detalles en tu
                perfil después de la aprobación.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Login;
