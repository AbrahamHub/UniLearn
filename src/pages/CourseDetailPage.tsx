import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { Star, Users, Clock, BookOpen, FileText, Video, CheckCircle, Play } from 'lucide-react';
import { fetchCourseById } from '../services/api';
import type { Course } from '../types';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'content'>('overview');

  useEffect(() => {
    const loadCourse = async () => {
      if (id) {
        const data = await fetchCourseById(id);
        setCourse(data);
      }
    };
    loadCourse();
  }, [id]);

  if (!course) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white">Cargando...</div>
        </div>
      </MainLayout>
    );
  }

  const mockContent = {
    sections: [
      {
        id: '1',
        title: 'Introducción',
        duration: '45 min',
        completed: true,
        lessons: [
          { id: '1.1', title: 'Bienvenida al curso', duration: '5 min', completed: true },
          { id: '1.2', title: 'Configuración del entorno', duration: '20 min', completed: true },
          { id: '1.3', title: 'Conceptos básicos', duration: '20 min', completed: true },
        ],
      },
      {
        id: '2',
        title: 'Fundamentos',
        duration: '1h 30min',
        completed: false,
        lessons: [
          { id: '2.1', title: 'Sintaxis básica', duration: '30 min', completed: false },
          { id: '2.2', title: 'Estructuras de control', duration: '30 min', completed: false },
          { id: '2.3', title: 'Funciones y métodos', duration: '30 min', completed: false },
        ],
      },
    ],
  };

  const handleVideoClick = (lessonId: string) => {
    navigate(`/curso/${course.id}/video/${lessonId}`);
  };

  return (
    <MainLayout>
      <div className="bg-[#282A36] rounded-lg overflow-hidden">
        <div className="relative h-64">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#282A36] to-transparent" />
        </div>
        
        <div className="p-8">
          <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>
          
          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center text-yellow-400">
              <Star className="h-5 w-5 mr-1" />
              <span>{course.rating}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Users className="h-5 w-5 mr-1" />
              <span>{course.views} estudiantes</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Clock className="h-5 w-5 mr-1" />
              <span>2h 15min</span>
            </div>
          </div>

          <div className="border-b border-gray-700 mb-6">
            <div className="flex space-x-8">
              <button
                className={`py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-green-500 text-green-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Vista General
              </button>
              <button
                className={`py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'content'
                    ? 'border-green-500 text-green-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('content')}
              >
                Contenido del Curso
              </button>
            </div>
          </div>

          {activeTab === 'overview' ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Descripción del Curso</h2>
                <p className="text-gray-300">{course.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Lo que aprenderás</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Fundamentos básicos', 'Técnicas avanzadas', 'Mejores prácticas', 'Casos de uso reales'].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Recursos Incluidos</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Video className="h-5 w-5 text-green-500" />
                    <span>2.5 horas de video</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <FileText className="h-5 w-5 text-green-500" />
                    <span>12 recursos descargables</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <BookOpen className="h-5 w-5 text-green-500" />
                    <span>Acceso de por vida</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {mockContent.sections.map(section => (
                <div key={section.id} className="bg-[#1E2029] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-white">{section.title}</h3>
                      <span className="text-sm text-gray-400">{section.duration}</span>
                    </div>
                    {section.completed && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="space-y-2">
                    {section.lessons.map(lesson => (
                      <button
                        key={lesson.id}
                        onClick={() => handleVideoClick(lesson.id)}
                        className="w-full flex items-center justify-between p-2 hover:bg-[#282A36] rounded-lg transition-colors group"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="relative">
                            <Video className="h-4 w-4 text-gray-400 group-hover:hidden" />
                            <Play className="h-4 w-4 text-green-500 hidden group-hover:block" />
                          </div>
                          <span className="text-gray-300 group-hover:text-green-500">{lesson.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">{lesson.duration}</span>
                          {lesson.completed && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CourseDetailPage;