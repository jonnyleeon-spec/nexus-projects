import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const HeroSection: React.FC = () => {
  const { user } = useAuth();

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-black">
      {/* Video de fondo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover"
      >
        <source src="/videos/hero-timelapse.mp4" type="video/mp4" />
      </video>

      {/* Overlay verde degradado */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(17, 24, 39, 0.7), rgba(6, 95, 70, 0.4))",
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white max-w-6xl mx-auto">
        {user ? (
          <>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Bienvenido de nuevo, <span className="text-[#e8f7ef]">{user.name}</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-[#f6fef9]">
              {user.role === "professional"
                ? "Tus próximos proyectos te esperan."
                : "Gestiona tus solicitudes y da seguimiento a tus proyectos."}
            </p>
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-[#059669] hover:bg-[#0d7e5d] rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Ir a mi panel
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Soluciones técnicas <br className="hidden sm:block" />
              <span className="text-[#e8f7ef]">a la medida</span> de cada proyecto
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl text-[#f6fef9]">
              Conectamos tu necesidad con el profesional indicado: desde reparar una PC hasta construir un muro. Un solo punto de contacto.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register?type=client"
                className="px-8 py-4 bg-[#059669] hover:bg-[#0d7e5d] rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Cotizar proyecto
              </Link>
              <Link
                to="/register?type=professional"
                className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 backdrop-blur-sm"
              >
                Soy profesional
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-white/20 text-sm md:text-base">
              <div>
                <div className="font-semibold text-[#e8f7ef]">Construcción</div>
                <div className="text-[#f6fef9]">Drywall, acabados</div>
              </div>
              <div>
                <div className="font-semibold text-[#059669]">Tecnología</div>
                <div className="text-[#f6fef9]">Reparación, desarrollo</div>
              </div>
              <div>
                <div className="font-semibold text-[#e8f7ef]">Logística</div>
                <div className="text-[#f6fef9]">Supervisión, procesos</div>
              </div>
              <div>
                <div className="font-semibold text-[#059669]">Asesoría</div>
                <div className="text-[#f6fef9]">Remota, preventiva</div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroSection;