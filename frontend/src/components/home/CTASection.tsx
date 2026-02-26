import React from "react";
import { Link } from "react-router-dom";
import { Users, ShoppingCart, Briefcase, Package } from "lucide-react";

const CTASection: React.FC = () => {
  return (
    <section className="py-20" style={{ backgroundColor: "#111827" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            ¿Cómo quieres <span style={{ color: "#059669" }}>participar</span>?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-[#e8f7ef]">
            Elige tu rol y comienza a construir con nosotros.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Columna Consultoría */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#059669] rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Consultoría</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Te conectamos con profesionales verificados para proyectos de construcción, tecnología y logística.
            </p>
            <div className="space-y-4">
              <Link
                to="/register?type=client"
                className="w-full flex items-center justify-between p-4 rounded-lg border border-[#059669] hover:bg-[#059669] transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-[#059669] group-hover:text-white" />
                  <span className="text-white font-semibold">Necesito un profesional</span>
                </div>
                <span className="text-[#059669] group-hover:text-white">→</span>
              </Link>

              <Link
                to="/register?type=professional"
                className="w-full flex items-center justify-between p-4 rounded-lg border border-[#0d7e5d] hover:bg-[#0d7e5d] transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#0d7e5d] group-hover:text-white" />
                  <span className="text-white font-semibold">Soy profesional y quiero unirme</span>
                </div>
                <span className="text-[#0d7e5d] group-hover:text-white">→</span>
              </Link>
            </div>
          </div>

          {/* Columna Marketplace (próximamente) */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 opacity-90">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#0d7e5d] rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Marketplace <span className="text-sm font-normal text-gray-400 ml-2">(próximamente)</span>
              </h3>
            </div>
            <p className="text-gray-300 mb-6">
              Un espacio donde proveedores ofrecerán materiales y productos para tus proyectos. Actualmente estamos construyendo esta sección.
            </p>
            <div className="space-y-4">
              <div className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-600 opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400 font-semibold">Ver catálogo (próximamente)</span>
                </div>
                <span className="text-gray-400">→</span>
              </div>

              <Link
                to="/register?type=provider"
                className="w-full flex items-center justify-between p-4 rounded-lg border border-[#065f46] hover:bg-[#065f46] transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-[#065f46] group-hover:text-white" />
                  <span className="text-white font-semibold">Soy proveedor, quiero registrarme</span>
                </div>
                <span className="text-[#065f46] group-hover:text-white">→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm">
            ¿Dudas?{" "}
            <Link to="/contact" className="text-[#059669] hover:underline">
              Contáctanos
            </Link>{" "}
            y te ayudamos.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;