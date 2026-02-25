import React from "react";
import { Link } from "react-router-dom";
import { Users, ShoppingCart, Briefcase, Package } from "lucide-react";

const CTASection: React.FC = () => {
  return (
    <section className="py-20" style={{ backgroundColor: "#111827" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Principal */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            ¿Cómo quieres <span style={{ color: "#059669" }}>colaborar</span>?
          </h2>
          <p
            className="text-xl mb-8 max-w-2xl mx-auto"
            style={{ color: "#e8f7ef" }}
          >
            Elige tu rol en nuestro ecosistema de consultoría y marketplace
          </p>
        </div>

        {/* Grid de Opciones */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Columna 1: Servicios de Consultoría */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#059669] rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Servicios de Consultoría
              </h3>
            </div>
            <p className="text-gray-300 mb-6">
              Asignación directa de profesionales verificados para tus proyectos
              específicos
            </p>
            <div className="space-y-4">
              <Link
                to="/register?type=client"
                className="w-full flex items-center justify-between p-4 rounded-lg border border-[#059669] hover:bg-[#059669] transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-[#059669] group-hover:text-white" />
                  <span className="text-white font-semibold">
                    Necesito un Profesional
                  </span>
                </div>
                <span className="text-[#059669] group-hover:text-white">→</span>
              </Link>

              <Link
                to="/register?type=professional"
                className="w-full flex items-center justify-between p-4 rounded-lg border border-[#0d7e5d] hover:bg-[#0d7e5d] transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#0d7e5d] group-hover:text-white" />
                  <span className="text-white font-semibold">
                    Soy Profesional
                  </span>
                </div>
                <span className="text-[#0d7e5d] group-hover:text-white">→</span>
              </Link>
            </div>
          </div>

          {/* Columna 2: Marketplace */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#0d7e5d] rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Marketplace</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Productos y materiales de proveedores verificados para tus
              proyectos
            </p>
            <div className="space-y-4">
              <Link
                to="/products"
                className="w-full flex items-center justify-between p-4 rounded-lg border border-[#0d7e5d] hover:bg-[#0d7e5d] transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-[#0d7e5d] group-hover:text-white" />
                  <span className="text-white font-semibold">
                    Ver Catálogo de Productos
                  </span>
                </div>
                <span className="text-[#0d7e5d] group-hover:text-white">→</span>
              </Link>

              <Link
                to="/register?type=provider"
                className="w-full flex items-center justify-between p-4 rounded-lg border border-[#065f46] hover:bg-[#065f46] transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-[#065f46] group-hover:text-white" />
                  <span className="text-white font-semibold">
                    Soy Proveedor
                  </span>
                </div>
                <span className="text-[#065f46] group-hover:text-white">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer del CTA */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            ¿No estás seguro?{" "}
            <Link to="/contact" className="text-[#059669] hover:underline">
              Contáctanos
            </Link>{" "}
            y te ayudamos
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
