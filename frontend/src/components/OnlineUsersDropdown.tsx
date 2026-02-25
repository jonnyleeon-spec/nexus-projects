// [file name]: OnlineUsersDropdown.tsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";

interface OnlineUsersDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnlineUsersDropdown: React.FC<OnlineUsersDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const { onlineUsersList, user } = useAuth();

  if (!isOpen) return null;

  const safeOnlineUsersList = onlineUsersList || [];

  // ✅ FILTRAR USUARIOS POR ROL (SOLO admin Y user)
  const adminUsers = safeOnlineUsersList.filter(
    (user) => user.role === "admin"
  );
  const userUsers = safeOnlineUsersList.filter((user) => user.role === "user");
  const customerUsers = safeOnlineUsersList.filter(
    (user) => user.role === "customer"
  );
  const providerUsers = safeOnlineUsersList.filter(
    (user) => user.role === "provider"
  );

  // Excluir usuario actual de las listas visibles
  const filteredAdmins = adminUsers.filter((u) => u.userId !== user?.id);
  const filteredUsers = userUsers.filter((u) => u.userId !== user?.id);
  const filteredCustomers = customerUsers.filter((u) => u.userId !== user?.id);
  const filteredProviders = providerUsers.filter((u) => u.userId !== user?.id);

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      admin: "text-red-600",
      user: "text-blue-600",
      customer: "text-green-600",
      provider: "text-purple-600",
    };
    return colors[role] || "text-gray-600";
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      {/* Header simple */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            Usuarios en línea
          </h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-500">
              {safeOnlineUsersList.length}
            </span>
          </div>
        </div>
      </div>

      {/* Contenido - SOLO admin Y user ven lista completa */}
      <div className="max-h-72 overflow-y-auto">
        {/* Administradores - Lista completa */}
        {adminUsers.length > 0 && (
          <div className="p-3 border-b border-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">
                Administradores
              </span>
              <span
                className={`text-xs font-semibold ${getRoleColor("admin")}`}
              >
                {adminUsers.length}
              </span>
            </div>
            <div className="space-y-2">
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map((user, index) => (
                  <div
                    key={user.userId || index}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-800 flex-1 truncate">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-500">en línea</span>
                  </div>
                ))
              ) : (
                // ✅ CAMBIADO: "Solo tú" → Mostrar usuario actual
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-800 flex-1 truncate">
                    {user?.name} <span className="text-blue-600">(tú)</span>
                  </span>
                  <span className="text-xs text-gray-500">en línea</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Usuarios Internos - Lista completa */}
        {userUsers.length > 0 && (
          <div className="p-3 border-b border-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">
                Usuarios Internos
              </span>
              <span className={`text-xs font-semibold ${getRoleColor("user")}`}>
                {userUsers.length}
              </span>
            </div>
            <div className="space-y-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <div
                    key={user.userId || index}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-800 flex-1 truncate">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-500">en línea</span>
                  </div>
                ))
              ) : (
                // ✅ CAMBIADO: "Solo tú" → Mostrar usuario actual
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-800 flex-1 truncate">
                    {user?.name} <span className="text-blue-600">(tú)</span>
                  </span>
                  <span className="text-xs text-gray-500">en línea</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Clientes - Lista completa */}
        {customerUsers.length > 0 && (
          <div className="p-3 border-b border-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">
                Clientes
              </span>
              <span
                className={`text-xs font-semibold ${getRoleColor("customer")}`}
              >
                {customerUsers.length}
              </span>
            </div>
            <div className="space-y-2">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((user, index) => (
                  <div
                    key={user.userId || index}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-800 flex-1 truncate">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-500">en línea</span>
                  </div>
                ))
              ) : (
                // ✅ CAMBIADO: "Solo tú" → Mostrar usuario actual
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-800 flex-1 truncate">
                    {user?.name} <span className="text-blue-600">(tú)</span>
                  </span>
                  <span className="text-xs text-gray-500">en línea</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Proveedores - Lista completa */}
        {providerUsers.length > 0 && (
          <div className="p-3 border-b border-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">
                Proveedores
              </span>
              <span
                className={`text-xs font-semibold ${getRoleColor("provider")}`}
              >
                {providerUsers.length}
              </span>
            </div>
            <div className="space-y-2">
              {filteredProviders.length > 0 ? (
                filteredProviders.map((user, index) => (
                  <div
                    key={user.userId || index}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-800 flex-1 truncate">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-500">en línea</span>
                  </div>
                ))
              ) : (
                // ✅ CAMBIADO: "Solo tú" → Mostrar usuario actual
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-800 flex-1 truncate">
                    {user?.name} <span className="text-blue-600">(tú)</span>
                  </span>
                  <span className="text-xs text-gray-500">en línea</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {safeOnlineUsersList.length === 0 && (
          <div className="p-6 text-center">
            <div className="text-gray-400 text-2xl mb-2">👥</div>
            <p className="text-sm text-gray-500">No hay usuarios en línea</p>
          </div>
        )}
      </div>

      {/* Footer minimalista */}
      <div className="p-3 bg-gray-50 rounded-b-lg">
        <div className="text-xs text-gray-500 text-center">
          Tiempo real • Todos los roles
        </div>
      </div>
    </div>
  );
};

export default OnlineUsersDropdown;
