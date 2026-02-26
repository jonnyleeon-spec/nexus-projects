import React from "react";
import {
  Briefcase,
  Building,
  CircleDollarSign,
  TrendingUp,
  BadgeCheck,
  Users,
  HeartHandshake,
  Timer,
  Package,
  Store,
  Medal,
  Eye,
  UserRound,
  Target,
  FileBadge,
} from "lucide-react";

const BenefitsSection: React.FC = () => {
  const benefitsData = [
    {
      role: "Para Clientes",
      color: "#059669",
      description: "Profesionales verificados, cotizaciones rápidas",
      icon: Building,
      items: [
        {
          icon: BadgeCheck,
          title: "Profesionales verificados",
          description: "Cada consultor pasa por un proceso de validación.",
        },
        {
          icon: UserRound,
          title: "Un solo contacto",
          description: "Nosotros coordinamos, tú solo disfrutas el resultado.",
        },
        {
          icon: HeartHandshake,
          title: "Acompañamiento",
          description: "Seguimiento durante todo el proyecto.",
        },
        {
          icon: Timer,
          title: "Cotización rápida",
          description: "Recibe propuestas en poco tiempo.",
        },
      ],
    },
    {
      role: "Para Profesionales",
      color: "#0d7e5d",
      description: "Oportunidades de trabajo y respaldo",
      icon: Briefcase,
      items: [
        {
          icon: Briefcase,
          title: "Proyectos constantes",
          description: "Accede a clientes que buscan tu expertise.",
        },
        {
          icon: FileBadge,
          title: "Respaldo administrativo",
          description: "Te apoyamos en cobranza y gestión.",
        },
        {
          icon: CircleDollarSign,
          title: "Pagos garantizados",
          description: "Nos encargamos de la cobranza, tú solo trabajas.",
        },
        {
          icon: Eye,
          title: "Visibilidad",
          description: "Formas parte de una red en crecimiento.",
        },
      ],
    },
    {
      role: "Para Proveedores",
      color: "#065f46",
      description: "Prepárate para nuestro marketplace",
      icon: Package,
      items: [
        {
          icon: Store,
          title: "Canal de ventas futuro",
          description: "Sé de los primeros en ofrecer productos.",
        },
        {
          icon: Target,
          title: "Audiencia cualificada",
          description: "Clientes y profesionales que necesitan insumos.",
        },
        {
          icon: Medal,
          title: "Certificación",
          description: "Destaca como proveedor confiable.",
        },
        {
          icon: TrendingUp,
          title: "Crecimiento",
          description: "Conecta con proyectos de alto impacto.",
        },
      ],
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Beneficios para <span className="text-[#059669]">todos</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Construimos un ecosistema donde clientes, profesionales y proveedores crecen juntos.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {benefitsData.map((benefitCategory, categoryIndex) => {
            const RoleIcon = benefitCategory.icon;
            return (
              <div key={categoryIndex} className="flex flex-col h-full">
                <div className="text-center mb-8">
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${benefitCategory.color}15` }}
                  >
                    <RoleIcon
                      className="w-8 h-8"
                      style={{ color: benefitCategory.color }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {benefitCategory.role}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {benefitCategory.description}
                  </p>
                </div>

                <div className="space-y-4 flex-1">
                  {benefitCategory.items.map((benefit, benefitIndex) => {
                    const BenefitIcon = benefit.icon;
                    return (
                      <div
                        key={benefitIndex}
                        className="group p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 bg-white"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                            style={{
                              backgroundColor: `${benefitCategory.color}15`,
                              color: benefitCategory.color,
                            }}
                          >
                            <BenefitIcon className="w-5 h-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1 text-sm group-hover:text-[#059669] transition-colors">
                              {benefit.title}
                            </h4>
                            <p className="text-gray-600 text-xs leading-relaxed">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;