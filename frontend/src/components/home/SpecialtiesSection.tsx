import React from "react";
import {
  Drill,
  Cpu,
  Waypoints,
  Wrench,
  PlugZap,
  Droplets,
  Scale,
  Truck,
  Car,
} from "lucide-react";

const SpecialtiesSection: React.FC = () => {
  // Especialidades actuales (con profesionales disponibles hoy)
  const currentSpecialties = [
    {
      icon: Drill,
      title: "Construcción",
      description: "Drywall, acabados, obra civil, remodelaciones",
      iconColor: "text-orange-500",
      hoverColor: "text-white",
      bgColor: "bg-gray-900",
      hoverBgColor: "bg-orange-500",
    },
    {
      icon: Cpu,
      title: "Tecnología",
      description: "Reparación de equipos, desarrollo web, programación de memorias",
      iconColor: "text-indigo-500",
      hoverColor: "text-white",
      bgColor: "bg-gray-900",
      hoverBgColor: "bg-indigo-500",
    },
    {
      icon: Waypoints,
      title: "Logística",
      description: "Supervisión de procesos, optimización, asesoría para pymes",
      iconColor: "text-[#98F527]",
      hoverColor: "text-white",
      bgColor: "bg-gray-900",
      hoverBgColor: "bg-cyan-500",
    },
    {
      icon: Wrench,
      title: "Técnicos especializados",
      description: "Instalación de equipos, mantenimiento preventivo",
      iconColor: "text-[#C8C509]",
      hoverColor: "text-white",
      bgColor: "bg-gray-900",
      hoverBgColor: "bg-gray-500",
    },
  ];

  // Especialidades futuras (próximamente)
  const futureSpecialties = [
    { name: "Electricidad", icon: PlugZap },
    { name: "Plomería", icon: Droplets },
    { name: "Abogados", icon: Scale },
    { name: "Transportistas", icon: Truck },
    { name: "Mecánico", icon: Car },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Especialidades <span className="text-[#059669]">actuales</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estas son las áreas en las que contamos con profesionales verificados hoy.
          </p>
        </div>

        {/* Grid de especialidades actuales (4 columnas en escritorio) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentSpecialties.map((specialty, index) => {
            const IconComponent = specialty.icon;
            return (
              <div
                key={index}
                className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-[#059669] transition-all duration-300 hover:-translate-y-2 cursor-default shadow-sm hover:shadow-xl"
              >
                <div
                  className={`
                    w-12 h-12 rounded-xl 
                    flex items-center justify-center mb-4 mx-auto 
                    transition-all duration-300 
                    group-hover:scale-110
                    ${specialty.bgColor}
                    group-hover:${specialty.hoverBgColor}
                  `}
                >
                  <IconComponent
                    className={`
                      w-6 h-6 transition-colors duration-300
                      ${specialty.iconColor}
                      group-hover:${specialty.hoverColor}
                    `}
                    strokeWidth={1.8}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center group-hover:text-[#059669] transition-colors">
                  {specialty.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed text-center">
                  {specialty.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Separador visual */}
        <div className="relative my-16">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-6 py-2 text-sm font-medium text-gray-500 rounded-full border border-gray-200 shadow-sm">
              Nuevas soluciones en desarrollo
            </span>
          </div>
        </div>

        {/* Especialidades futuras (próximamente) */}
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm mb-6">
            Estamos sumando profesionales en estas áreas. ¿Eres experto en alguna?
            <a href="/register?type=professional" className="text-[#059669] font-medium hover:underline ml-1">
              Regístrate aquí
            </a>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {futureSpecialties.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200 opacity-70"
              >
                <IconComponent className="w-6 h-6 mx-auto mb-1 text-gray-500" />
                <span className="text-sm text-gray-500 block">{item.name}</span>
                <span className="block text-xs text-[#059669] mt-1">próximamente</span>
              </div>
            );
          })}
        </div>

        {/* Nota adicional para profesionales */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            ¿Tu especialidad no está en la lista?{" "}
            <a href="/contact" className="text-[#059669] hover:underline">
              Escríbenos
            </a> y platícanos cómo puedes sumarte.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SpecialtiesSection;