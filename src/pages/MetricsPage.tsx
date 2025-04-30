import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { BarChart, Users, BookOpen, Star } from 'lucide-react';

const MetricsPage: React.FC = () => {
  const metrics = {
    totalStudents: 20000,
    totalCourses: 500,
    totalInstructors: 250,
    averageRating: 4.5,
    popularCourses: [
      { id: '1', title: 'Introducción a HTML5', views: 1200, rating: 4.5 },
      { id: '2', title: 'JavaScript Moderno', views: 850, rating: 4.8 },
      { id: '3', title: 'React para Principiantes', views: 750, rating: 4.3 },
    ],
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-6">Métricas de la Plataforma</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#282A36] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-blue-500" />
              <span className="text-3xl font-bold text-white">{metrics.totalStudents}</span>
            </div>
            <h3 className="text-gray-400">Estudiantes Totales</h3>
          </div>

          <div className="bg-[#282A36] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="h-8 w-8 text-green-500" />
              <span className="text-3xl font-bold text-white">{metrics.totalCourses}</span>
            </div>
            <h3 className="text-gray-400">Cursos Publicados</h3>
          </div>

          <div className="bg-[#282A36] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-purple-500" />
              <span className="text-3xl font-bold text-white">{metrics.totalInstructors}</span>
            </div>
            <h3 className="text-gray-400">Instructores</h3>
          </div>

          <div className="bg-[#282A36] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Star className="h-8 w-8 text-yellow-500" />
              <span className="text-3xl font-bold text-white">{metrics.averageRating}</span>
            </div>
            <h3 className="text-gray-400">Calificación Promedio</h3>
          </div>
        </div>

        <div className="bg-[#282A36] rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Cursos Más Populares</h2>
          <div className="space-y-4">
            {metrics.popularCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between py-4 border-b border-gray-700 last:border-0"
              >
                <div>
                  <h3 className="text-white font-semibold">{course.title}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-gray-400">{course.views} visualizaciones</span>
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-4 w-4 mr-1" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                </div>
                <BarChart className="h-6 w-6 text-blue-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MetricsPage;