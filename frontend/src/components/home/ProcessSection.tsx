import React from "react";

const ProcessSection: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Diagnóstico del Problema",
      description:
        "Identificamos tus desafíos específicos y definimos objetivos claros del proyecto",
      icon: "🔍",
      time: "1-2 días",
      highlight: "Análisis sin costo",
    },
    {
      number: "02",
      title: "Selección del Consultor",
      description:
        "Asignamos al profesional ideal con expertise comprobado en tu industria",
      icon: "🎯",
      time: "2-3 días",
      highlight: "Match por especialidad",
    },
    {
      number: "03",
      title: "Ejecución con Soporte",
      description:
        "El consultor trabaja en tu proyecto con seguimiento continuo de nuestro equipo",
      icon: "⚡",
      time: "Variable por proyecto",
      highlight: "Gestión dedicada",
    },
    {
      number: "04",
      title: "Entrega y Seguimiento",
      description:
        "Resultados implementados + acceso a marketplace de proveedores para continuidad",
      icon: "✅",
      time: "Seguimiento post-proyecto",
      highlight: "Ecosistema completo",
    },
  ];

  return (
    <section style={{ backgroundColor: "#f6fef9" }} className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "#111827" }}
          >
            Proceso de Consultoría{" "}
            <span style={{ color: "#059669" }}>Garantizado</span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: "#6b7280" }}>
            Metodología probada que asegura soluciones efectivas para cada
            desafío empresarial, con el plus de acceso a nuestro ecosistema de
            proveedores.
          </p>
        </div>

        <div className="relative">
          <div
            className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 transform -translate-y-1/2"
            style={{ backgroundColor: "rgba(5, 150, 105, 0.2)" }}
          ></div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div
                    className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-2xl transform group-hover:scale-110 transition-all duration-300 shadow-lg border-2"
                    style={{
                      backgroundColor: index === 1 ? "#059669" : "white",
                      color: index === 1 ? "#f6fef9" : "#059669",
                      borderColor: "#e8f7ef",
                    }}
                  >
                    {step.icon}
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 text-white"
                    style={{
                      backgroundColor: "#059669",
                      borderColor: "white",
                    }}
                  >
                    {step.number}
                  </div>
                </div>

                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: "#111827" }}
                >
                  {step.title}
                </h3>

                {/* Badge de tiempo */}
                <div className="inline-block bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full mb-2 border border-green-200">
                  {step.time}
                </div>

                <p
                  className="leading-relaxed mb-2"
                  style={{ color: "#6b7280" }}
                >
                  {step.description}
                </p>

                {/* Highlight del paso */}
                <div
                  className="text-sm font-semibold"
                  style={{ color: "#059669" }}
                >
                  {step.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nota sobre el Marketplace - Sutil pero informativa */}
        <div className="text-center mt-12 p-6 bg-white rounded-2xl border border-green-100 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            ¿Necesitas productos o materiales para tu proyecto?
          </h4>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Todos nuestros clientes de consultoría tienen acceso preferente a
            nuestro
            <span style={{ color: "#059669" }} className="font-medium">
              {" "}
              marketplace de proveedores verificados
            </span>
            . Encuentra todo lo necesario en un solo lugar.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
