// [file name]: OnlineStatusBadge.tsx
// [file content begin]
import React from "react";
import { useAuth } from "../contexts/AuthContext";

const OnlineStatusBadge: React.FC = () => {
  const { onlineUsers, onlineUsersList } = useAuth();

  // Contar usuarios por rol
  const countByRole = onlineUsersList.reduce((acc, onlineUser) => {
    const role = onlineUser.role || "user";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const adminCount = countByRole["admin"] || 0;
  const userCount = countByRole["user"] || 0;
  const providerCount = countByRole["provider"] || 0;
  const customerCount = countByRole["customer"] || 0;

  return (
    <div className="flex items-center space-x-4 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Total */}
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">{onlineUsers}</div>
        <div className="text-xs text-gray-500">Total</div>
      </div>

      {/* Separador */}
      <div className="h-8 w-px bg-gray-300"></div>

      {/* Por roles */}
      <div className="flex space-x-4">
        {adminCount > 0 && (
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600">
              {adminCount}
            </div>
            <div className="text-xs text-gray-500">Admins</div>
          </div>
        )}

        {userCount > 0 && (
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {userCount}
            </div>
            <div className="text-xs text-gray-500">Internos</div>
          </div>
        )}

        {providerCount > 0 && (
          <div className="text-center">
            <div className="text-lg font-semibold text-purple-600">
              {providerCount}
            </div>
            <div className="text-xs text-gray-500">Proveedores</div>
          </div>
        )}

        {customerCount > 0 && (
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {customerCount}
            </div>
            <div className="text-xs text-gray-500">Clientes</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineStatusBadge;
// [file content end]
