import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const UserProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    onLogout();
    toast({
      title: "Logout realizado",
      description: "Até a próxima!",
    });
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsOpen(false);
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
    setIsOpen(false);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="relative">
        {/* Botão do Avatar */}
        <button
          onClick={toggleDropdown}
          className="relative h-8 w-8 rounded-full hover:ring-2 hover:ring-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </button>

        {/* Menu Dropdown */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50 animate-in fade-in-0 zoom-in-95">
            {/* Header do usuário */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>

            {/* Itens do menu */}
            <div className="py-1">
              <button
                onClick={handleProfileClick}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <User className="mr-3 h-4 w-4" />
                Meu Perfil
              </button>

              {/* Opção de Dashboard para funcionários */}
              {(user.userType === 'funcionario' || user.userType === 'admin') && (
                <>
                  <button
                    onClick={handleDashboardClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LayoutDashboard className="mr-3 h-4 w-4" />
                    Dashboard da Loja
                  </button>
                  <hr className="border-gray-100" />
                </>
              )}

              {!user.userType || user.userType === 'cliente' ? (
                <hr className="border-gray-100" />
              ) : null}

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlay para fechar dropdown ao clicar fora */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default UserProfileDropdown;
