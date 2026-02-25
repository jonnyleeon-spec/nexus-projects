import React from "react";
import {
  Building2,
  HardHat,
  Ruler,
  SearchCheck,
  Code2,
  BarChart3,
  Palette,
  Wrench,
} from "lucide-react";

const SpecialtiesSection: React.FC = () => {
  const specialties = [
    {
      icon: Building2,
      title: "Ingenieros",
      description: "Civil, Mecánica, Industrial, Sistemas",
      iconColor: "text-trust-primary",
      hoverColor: "text-white",
      bgColor: "bg-gray-900",
      hoverBgColor: "bg-trust-primary",
      strokeWidth: 2,
      animation: "animate-pulse",
      hoverAnimation: "group-hover:animate-shake",
    },
    {
      icon: HardHat,
      title: "Constructores",
      description: "Obras civiles y proyectos inmobiliarios",
      iconColor: "text-orange-500",
      hoverColor: "text-white",
      bgColor: "bg-gray-900",
      hoverBgColor: "bg-orange-500",
      strokeWidth: 2,
      animation: "animate-pulse",
      hoverAnimation: "group-hover:animate-shake",
    },
    {
      icon: Ruler,
      title: "Arquitectos",
      description: "Diseño y planificación arquitectónica",
      iconColor: "text-purple-500",
      hoverColor: "text-white",
      bgColor: "bg-gray-900",
      hoverBgColor: "bg-purple-500",
      strokeWidth: 2,
      animation: "animate-pulse",
      hoverAnimation: "group-hover:animate-shake",
    },
    {
      icon: SearchCheck,
      title: "Supervisores",
      description: "Control de calidad y avance de obra",
      iconColor: "text-green-500",
      hoverColor: "text-white",
      bgColor: "bg-gray-900",
      hoverBgColor: "bg-green-500",
      strokeWidth: 2,
      animation: "animate-pulse",
      hoverAnimation: "group-hover:animate-shake",
    },
    {
      icon: Code2,
      title: "Desarrolladores",
      description: "Software, apps y soluciones digitales",
      iconColor: "text-indigo-500",
      hoverColor: "text-white",
      bgColor: "bg-gray-900",
      hoverBgColor: "bg-indigo-500",
      strokeWidth: 2,
      animation: "animate-pulse",
      hoverAnimation: "group-hover:animate-shake",
    },
    {
      icon: BarChart3,
      title: "Consultores",
      description: "Estrategia de negocio y optimización",
      iconColor: "text-cyan-500",
      hoverColor: "text-white",
      bgColor: "bg-gray-900",
      hoverBgColor: "bg-cyan-500",
      strokeWidth: 2,
      animation: "animate-pulse",
      hoverAnimation: "group-hover:animate-shake",
    },
    {
      icon: Palette,
      title: "Diseñadores",
      description: "UX/UI, gráfico y experiencia de usuario",
      iconColor: "text-pink-500",
      hoverColor: "text-white",
      bgColor: "bg-gray-900",
      hoverBgColor: "bg-pink-500",
      strokeWidth: 2,
      animation: "animate-pulse",
      hoverAnimation: "group-hover:animate-shake",
    },
    {
      icon: Wrench,
      title: "Técnicos",
      description: "Instalación, mantenimiento y reparación",
      iconColor: "text-gray-500",
      hoverColor: "text-white",
      bgColor: "bg-gray-900",
      hoverBgColor: "bg-gray-500",
      strokeWidth: 2,
      animation: "animate-pulse",
      hoverAnimation: "group-hover:animate-shake",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Nuestras <span className="text-trust-primary">Especialidades</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Profesionales verificados en cada área de expertise con experiencia
            comprobada
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialties.map((specialty, index) => {
            const IconComponent = specialty.icon;

            return (
              // ✅ EFECTO ORIGINAL RESTAURADO - Borde, sombra y animación
              <div
                key={index}
                className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-trust-primary transition-all duration-300 hover:-translate-y-2 cursor-pointer shadow-sm hover:shadow-xl"
              >
                {/* CONTENEDOR DEL ICONO */}
                <div
                  className={`
                    w-12 h-12 rounded-xl 
                    flex items-center justify-center mb-4 mx-auto 
                    transition-all duration-300 
                    group-hover:scale-110
                    ${specialty.bgColor}
                    group-hover:${specialty.hoverBgColor}
                    ${specialty.hoverAnimation}
                  `}
                >
                  <IconComponent
                    className={`
                      w-6 h-6 transition-colors duration-300
                      ${specialty.iconColor}
                      group-hover:${specialty.hoverColor}
                      ${specialty.animation}
                    `}
                    strokeWidth={specialty.strokeWidth}
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.9}
                    aria-hidden="true"
                    focusable="false"
                  />
                </div>

                {/* CONTENIDO TEXTUAL */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center group-hover:text-trust-primary transition-colors">
                  {specialty.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed text-center">
                  {specialty.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SpecialtiesSection;
