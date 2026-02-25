import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const HeroSection: React.FC = () => {
  const { user } = useAuth();

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-black">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover"
      >
        <source src="/videos/hero-timelapse.mp4" type="video/mp4" />
      </video>

      {/* Overlay más sutil */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(17, 24, 39, 0.7), rgba(6, 95, 70, 0.4))",
        }}
      ></div>

      <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4 h-full flex flex-col justify-center">
        <div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {user ? (
              <>
                Bienvenido,{" "}
                <span style={{ color: "#e8f7ef" }}>{user.name}</span>
              </>
            ) : (
              <>
                Consultoría que{" "}
                <span style={{ color: "#e8f7ef" }}>Resuelve</span>{" "}
                <span style={{ color: "#059669" }}>Problemas</span>
              </>
            )}
          </h1>

          <p className="text-xl md:text-2xl mb-8" style={{ color: "#f6fef9" }}>
            {user
              ? `Accede a tu ${
                  user.role === "professional"
                    ? "próximos proyectos"
                    : "panel de gestión"
                }`
              : "Conectamos empresas con consultores especializados para optimizar procesos, mejorar rendimiento y resolver desafíos empresariales."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <Link
                to="/dashboard"
                className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg border-2"
                style={{
                  backgroundColor: "transparent",
                  color: "#f6fef9",
                  borderColor: "#059669",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#059669";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {user.role === "professional"
                  ? "Ver Mis Proyectos"
                  : "Ir al Dashboard"}
              </Link>
            ) : (
              <>
                <Link
                  to="/register?type=client"
                  className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  style={{
                    backgroundColor: "#059669",
                    color: "#f6fef9",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#0d7e5d";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#059669";
                  }}
                >
                  Solicitar Consultoría
                </Link>
                <Link
                  to="/register?type=professional"
                  className="px-8 py-4 rounded-lg font-semibold text-lg border-2 transition-all duration-300 backdrop-blur-sm"
                  style={{
                    backgroundColor: "transparent",
                    color: "#f6fef9",
                    borderColor: "#f6fef9",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f6fef9";
                    e.currentTarget.style.color = "#111827";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#f6fef9";
                  }}
                >
                  Ser Consultor
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Áreas de especialidad */}
        {!user && (
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8"
            style={{ borderTop: "1px solid rgba(248, 254, 249, 0.2)" }}
          >
            <div>
              <div
                className="text-lg font-semibold"
                style={{ color: "#e8f7ef" }}
              >
                Ingeniería
              </div>
              <div className="text-sm" style={{ color: "#f6fef9" }}>
                Especializada
              </div>
            </div>
            <div>
              <div
                className="text-lg font-semibold"
                style={{ color: "#059669" }}
              >
                Estrategia
              </div>
              <div className="text-sm" style={{ color: "#f6fef9" }}>
                Empresarial
              </div>
            </div>
            <div>
              <div
                className="text-lg font-semibold"
                style={{ color: "#e8f7ef" }}
              >
                Tecnología
              </div>
              <div className="text-sm" style={{ color: "#f6fef9" }}>
                & Digital
              </div>
            </div>
            <div>
              <div
                className="text-lg font-semibold"
                style={{ color: "#059669" }}
              >
                Operaciones
              </div>
              <div className="text-sm" style={{ color: "#f6fef9" }}>
                & Procesos
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
