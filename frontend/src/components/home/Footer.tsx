import React from "react";
import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Sección 1: Marca */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#059669] to-[#065f46] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-white font-bold text-2xl">NexusProjects</span>
            </div>
            <p className="text-sm text-gray-500 italic">“Analiza. Ejecuta. Avanza.”</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Construimos la red de profesionales más confiable de México. Comenzamos con tecnología, construcción y logística.
            </p>
          </div>

          {/* Sección 2: Enlaces rápidos */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Explora</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/about" className="hover:text-[#059669] transition flex items-center gap-2"><span className="w-1 h-1 bg-[#059669] rounded-full"></span>Sobre nosotros</a></li>
              <li><a href="/services" className="hover:text-[#059669] transition flex items-center gap-2"><span className="w-1 h-1 bg-[#059669] rounded-full"></span>Servicios</a></li>
              <li><a href="/professionals" className="hover:text-[#059669] transition flex items-center gap-2"><span className="w-1 h-1 bg-[#059669] rounded-full"></span>Profesionales</a></li>
              <li><a href="/contact" className="hover:text-[#059669] transition flex items-center gap-2"><span className="w-1 h-1 bg-[#059669] rounded-full"></span>Contacto</a></li>
              <li><a href="/marketplace" className="hover:text-[#059669] transition flex items-center gap-2"><span className="w-1 h-1 bg-[#059669] rounded-full"></span>Marketplace <span className="text-xs bg-[#059669] text-white px-2 py-0.5 rounded-full">pronto</span></a></li>
            </ul>
          </div>

          {/* Sección 3: Contacto y redes */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Contacto</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#059669] mt-0.5" />
                <span>CDMX / EdoMex<br />(servicios remotos)</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#059669]" />
                <a href="tel:+525512345678" className="hover:text-white transition">55 1234 5678</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#059669]" />
                <a href="mailto:contacto@nexusprojects.com" className="hover:text-white transition">contacto@nexusprojects.com</a>
              </li>
            </ul>
            <div className="flex gap-5 mt-8">
              <a href="#" className="text-gray-500 hover:text-[#059669] transition"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-500 hover:text-[#059669] transition"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-gray-500 hover:text-[#059669] transition"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        {/* Línea inferior con copyright */}
        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-xs text-gray-600">
          <p>© {new Date().getFullYear()} NexusProjects. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;