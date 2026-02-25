import React from "react";
import { useLocation, Link } from "react-router-dom";

const RegistrationSuccess: React.FC = () => {
  const location = useLocation();
  const { email, name, phone, notificationPreference, hasWhatsApp } =
    location.state || {
      email: "No proporcionado",
      name: "Usuario",
      phone: "No proporcionado",
      notificationPreference: "email",
      hasWhatsApp: false,
    };

  // Función para determinar el mensaje de notificación
  const getNotificationText = () => {
    switch (notificationPreference) {
      case "whatsapp":
        return "WhatsApp";
      case "email":
        return "Correo Electrónico";
      case "both":
        return "WhatsApp y Correo Electrónico";
      default:
        return "Correo Electrónico";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-gray-200">
        <div className="text-center">
          {/* Título principal */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Listo! ✅</h1>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            ¡Solicitud Enviada con Éxito!
          </h2>

          {/* Mensaje de agradecimiento */}
          <div className="text-gray-600 mb-8">
            <p className="mb-4">
              Gracias, <strong>{name}</strong>. Hemos recibido tu información y
              está en proceso de revisión.
            </p>
          </div>

          {/* Sección de Próximos Pasos */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200 text-left">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">⏳</span>
              Próximos Pasos
            </h3>
            <ul className="text-gray-600 space-y-2 text-sm">
              <li>• Revisaremos tu información.</li>
              <li>• Te notificaremos la aprobación en 24-48 horas.</li>
              <li>
                • Recibirás la notificación por:{" "}
                <strong>{getNotificationText()}</strong>
              </li>
            </ul>
          </div>

          {/* Sección de Resumen */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200 text-left">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">📋</span>
              Resumen de tu Registro
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Nombre:</span>
                <span>{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{email}</span>
              </div>
              {phone !== "No proporcionado" && (
                <div className="flex justify-between">
                  <span className="font-medium">Teléfono:</span>
                  <span>{phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <Link
              to="/"
              className="block w-full bg-[#350a06] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4a0e08] transition-colors text-center"
            >
              Volver al Inicio
            </Link>
            <button
              onClick={() =>
                (window.location.href = "mailto:soporte@nexusprojects.com")
              }
              className="block w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
            >
              Contactar Soporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
