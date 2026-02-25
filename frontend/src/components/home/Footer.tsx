import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-trust-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-2xl font-bold">Nexus Consultoría</span>
          </div>
          <p className="text-gray-400 mb-4 max-w-2xl mx-auto">
            Conectando talento especializado con oportunidades de crecimiento.
            La plataforma líder en consultoría profesional verificada.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <span>© 2024 Nexus Consultoría</span>
            <span>•</span>
            <span>Todos los derechos reservados</span>
            <span>•</span>
            <span>info@nexusconsultoria.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
