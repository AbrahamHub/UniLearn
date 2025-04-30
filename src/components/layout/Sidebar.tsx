import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Upload, ClipboardList, BarChart, Users, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="w-64 bg-[#1E2029] text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-4 flex-1">
        <Link to="/mis-cursos" className="flex items-center space-x-2 mb-8">
          <span className="text-2xl font-bold">Uni.Learn</span>
        </Link>
        
        <div className="space-y-2">
          <p className="text-gray-400 uppercase text-xs font-semibold mb-4">Menú</p>
          
          <Link
            to="/mis-cursos"
            className={`flex items-center space-x-3 p-3 rounded-lg ${
              isActive('/mis-cursos') ? 'bg-green-600' : 'hover:bg-gray-700'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Mis Cursos</span>
          </Link>

          <Link
            to="/cursos"
            className={`flex items-center space-x-3 p-3 rounded-lg ${
              isActive('/cursos') ? 'bg-green-600' : 'hover:bg-gray-700'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Todos los Cursos</span>
          </Link>

          {(user?.role === 'expert' || user?.role === 'admin') && (
            <>
              <Link
                to="/upload"
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  isActive('/upload') ? 'bg-green-600' : 'hover:bg-gray-700'
                }`}
              >
                <Upload className="w-5 h-5" />
                <span>Subir Curso</span>
              </Link>

              <Link
                to="/review"
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  isActive('/review') ? 'bg-green-600' : 'hover:bg-gray-700'
                }`}
              >
                <ClipboardList className="w-5 h-5" />
                <span>Revisar Cursos</span>
              </Link>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <p className="text-gray-400 uppercase text-xs font-semibold mt-8 mb-4">Administración</p>
              
              <Link
                to="/admin"
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  isActive('/admin') ? 'bg-green-600' : 'hover:bg-gray-700'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/experts"
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  isActive('/experts') ? 'bg-green-600' : 'hover:bg-gray-700'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Expertos</span>
              </Link>

              <Link
                to="/metrics"
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  isActive('/metrics') ? 'bg-green-600' : 'hover:bg-gray-700'
                }`}
              >
                <BarChart className="w-5 h-5" />
                <span>Métricas</span>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 p-3 rounded-lg w-full text-red-400 hover:bg-gray-700 transition-colors"
        >
          <LogOut className="w-5 w-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;