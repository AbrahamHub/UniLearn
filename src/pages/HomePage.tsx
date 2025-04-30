import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import CourseCard from '../components/CourseCard';
import { Search } from 'lucide-react';
import { fetchCourses } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Course } from '../types';

const HomePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const loadCourses = async () => {
      const allCourses = await fetchCourses();
      // If user is an expert, filter courses to show only their own
      if (user?.role === 'expert') {
        setCourses(allCourses.filter(course => course.authorId === user.id));
      } else {
        setCourses(allCourses);
      }
    };
    loadCourses();
  }, [user]);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-white">Mis Cursos</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Busca un curso"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#282A36] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
          {filteredCourses.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-400">
              No se encontraron cursos
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;