import React from "react";
import { ListCheck, Users, CheckCircle, Package } from "lucide-react";

const ProcessSection: React.FC = () => {
  const steps = [
    {




      icon: ListCheck,
      title: "1. Cuéntanos tu necesidad",
      description:
        "Ya sea una reparación, construcción o asesoría, platícanos tu proyecto y te asignamos al profesional ideal.",
      color: "#059669",
    },
    {
      icon: Users,
      title: "2. Te conectamos con el experto",
      description:
        "Seleccionamos de nuestra red al profesional con la experiencia exacta que necesitas.",
      color: "#0d7e5d",
    },
    {
      icon: CheckCircle,
      title: "3. Ejecutamos y te acompañamos",
      description:
        "Seguimiento constante hasta la entrega final. Tú sólo te preocupas por el resultado.",
      color: "#065f46",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Así de <span className="text-[#059669]">simple</span> es trabajar con nosotros
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un proceso claro, sin vueltas, pensado para que tú te ocupes de lo importante.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Línea conectora decorativa */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-[#059669] bg-opacity-20 -translate-y-1/2" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center group">
                <div
                  className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-lg mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: step.color }}
                >
                  <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Marketplace en desarrollo */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full border border-gray-200 shadow-sm">
            <Package className="w-5 h-5 text-[#059669]" />
            <p className="text-gray-700">
              <span className="font-medium">Marketplace de insumos:</span> próximamente podrás encontrar materiales y productos directamente desde la plataforma.
            </p>
          </div>
        </div>

        {/* Ejemplo de proyecto reciente */}

      </div>
    </section>
  );
};

export default ProcessSection;