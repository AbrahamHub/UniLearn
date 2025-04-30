import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Users, BookOpen, UserCheck, AlertTriangle, ArrowUp, ArrowDown, GraduationCap, Book } from 'lucide-react';
import type { Career, LearningUnit } from '../types';
import { fetchCareers, fetchLearningUnits } from '../services/api';

const AdminDashboard: React.FC = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [learningUnits, setLearningUnits] = useState<LearningUnit[]>([]);
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const careersData = await fetchCareers();
      const unitsData = await fetchLearningUnits();
      setCareers(careersData);
      setLearningUnits(unitsData);
    };
    loadData();
  }, []);

  const stats = {
    totalUsers: 1250,
    totalExperts: 45,
    totalCourses: 320,
    pendingReviews: 15,
    recentActivity: [
      { type: 'user_joined', user: 'María García', timestamp: '2024-02-15T10:30:00Z' },
      { type: 'course_approved', course: 'Introducción a Python', expert: 'Juan Pérez', timestamp: '2024-02-15T09:15:00Z' },
      { type: 'expert_assigned', expert: 'Ana Martínez', course: 'JavaScript Avanzado', timestamp: '2024-02-15T08:45:00Z' },
    ],
    trends: {
      users: { value: 25, trend: 'up' },
      courses: { value: 15, trend: 'up' },
      completionRate: { value: -5, trend: 'down' },
    },
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-white">Panel de Administración</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Existing stats cards */}
          <div className="bg-[#282A36] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Usuarios</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stats.totalUsers}</h3>
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">{stats.trends.users.value}%</span>
              <span className="text-gray-400 ml-2">vs mes anterior</span>
            </div>
          </div>

          {/* New stats for Careers and Learning Units */}
          <div className="bg-[#282A36] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Carreras</p>
                <h3 className="text-2xl font-bold text-white mt-1">{careers.length}</h3>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <GraduationCap className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="bg-[#282A36] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Unidades de Aprendizaje</p>
                <h3 className="text-2xl font-bold text-white mt-1">{learningUnits.length}</h3>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <Book className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Career Management Section */}
        <div className="bg-[#282A36] rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Gestión de Carreras</h2>
            <button
              onClick={() => setShowCareerModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Nueva Carrera
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {careers.map(career => (
              <div key={career.id} className="bg-[#1E2029] p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2">{career.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{career.description}</p>
                <div className="flex justify-end">
                  <button className="text-green-500 hover:text-green-600 transition-colors">
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Units Management Section */}
        <div className="bg-[#282A36] rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Gestión de Unidades de Aprendizaje</h2>
            <button
              onClick={() => setShowUnitModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Nueva Unidad
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningUnits.map(unit => (
              <div key={unit.id} className="bg-[#1E2029] p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2">{unit.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{unit.description}</p>
                <div className="flex justify-end">
                  <button className="text-green-500 hover:text-green-600 transition-colors">
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;