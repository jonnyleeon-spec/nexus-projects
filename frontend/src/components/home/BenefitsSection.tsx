import React from "react";
import {
  Briefcase,
  Building,
  CreditCard,
  TrendingUp,
  CheckCircle,
  Users,
  ShieldCheck,
  Zap,
  Package,
  Truck,
  BadgeCheck,
  Star,
} from "lucide-react";

const BenefitsSection: React.FC = () => {
  const benefitsData = [
    {
      role: "Para Clientes",
      color: "#059669",
      description: "Encuentra el talento perfecto para tus proyectos",
      icon: Building,
      items: [
        {
          icon: CheckCircle,
          title: "Talento Verificado",
          description:
            "Profesionales con calidad garantizada y experiencia comprobada",
        },
        {
          icon: Users,
          title: "Un Solo Contacto",
          description: "Simplificamos toda la gestión y coordinación",
        },
        {
          icon: ShieldCheck,
          title: "Calidad Garantizada",
          description:
            "Supervisión constante y control de calidad en cada proyecto",
        },
        {
          icon: Zap,
          title: "Flexibilidad Total",
          description: "Escalable según tus necesidades y presupuesto",
        },
      ],
    },
    {
      role: "Para Profesionales",
      color: "#0d7e5d",
      description: "Desarrolla tu carrera con proyectos desafiantes",
      icon: Briefcase,
      items: [
        {
          icon: TrendingUp,
          title: "Trabajo Constante",
          description:
            "Flujo continuo de proyectos verificados y bien remunerados",
        },
        {
          icon: Star,
          title: "Respaldo Institucional",
          description: "Trabaja con el respaldo de una consultoría reconocida",
        },
        {
          icon: CreditCard,
          title: "Pagos Garantizados",
          description:
            "Sin preocuparte por cobranzas o procesos administrativos",
        },
        {
          icon: BadgeCheck,
          title: "Crecimiento Profesional",
          description: "Accede a proyectos diversos que impulsan tu carrera",
        },
      ],
    },
    {
      role: "Para Proveedores",
      color: "#065f46",
      description: "Comercializa tus productos en nuestro marketplace",
      icon: Package,
      items: [
        {
          icon: Truck,
          title: "Nuevo Canal de Ventas",
          description:
            "Accede a una base de clientes y profesionales verificados",
        },
        {
          icon: Users,
          title: "Audiencia Cualificada",
          description: "Clientes y profesionales que necesitan tus productos",
        },
        {
          icon: ShieldCheck,
          title: "Certificación Nexus",
          description: "Sello de calidad que genera confianza en tus productos",
        },
        {
          icon: TrendingUp,
          title: "Crecimiento de Marca",
          description:
            "Visibilidad en proyectos de alto impacto y reconocimiento",
        },
      ],
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Beneficios para <span className="text-[#059669]">Todos</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un ecosistema completo donde clientes, profesionales y proveedores
            crecen juntos
          </p>
        </div>

        {/* Benefits Grid - 3 Columnas */}
        <div className="grid lg:grid-cols-3 gap-8">
          {benefitsData.map((benefitCategory, categoryIndex) => {
            const RoleIcon = benefitCategory.icon;
            return (
              <div key={categoryIndex} className="flex flex-col h-full">
                {/* Category Header */}
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

                {/* Benefits List */}
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
