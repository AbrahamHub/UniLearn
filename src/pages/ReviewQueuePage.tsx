import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Check, X, Clock } from 'lucide-react';
import type { Course } from '../types';
import { fetchCourses } from '../services/api';

const ReviewQueuePage: React.FC = () => {
  const [pendingCourses, setPendingCourses] = useState<Course[]>([]);

  useEffect(() => {
    const loadPendingCourses = async () => {
      const courses = await fetchCourses();
      setPendingCourses(courses.filter(course => course.status === 'pending'));
    };
    loadPendingCourses();
  }, []);

  const handleReview = async (courseId: string, status: 'approved' | 'rejected') => {
    // Here we would make an API call to update the course status
    console.log(`Course ${courseId} ${status}`);
    setPendingCourses(courses => courses.filter(course => course.id !== courseId));
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-6">Cola de Revisión</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pendingCourses.map((course) => (
            <div
              key={course.id}
              className="bg-[#282A36] rounded-lg p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full md:w-48 h-48 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                  <p className="text-gray-400 mt-2 line-clamp-3">{course.description}</p>
                  <div className="flex items-center space-x-2 mt-3 text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>Pendiente de revisión</span>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleReview(course.id, 'approved')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="h-5 w-5" />
                      <span>Aprobar</span>
                    </button>
                    <button
                      onClick={() => handleReview(course.id, 'rejected')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="h-5 w-5" />
                      <span>Rechazar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {pendingCourses.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              No hay cursos pendientes de revisión
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ReviewQueuePage;