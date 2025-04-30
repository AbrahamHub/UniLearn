import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import CourseCard from '../components/CourseCard';
import { Search, Filter } from 'lucide-react';
import { fetchCourses } from '../services/api';
import type { Course } from '../types';

const CourseListPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'popular' | 'rated'>('all');

  useEffect(() => {
    const loadCourses = async () => {
      const data = await fetchCourses();
      // Only show approved courses
      setCourses(data.filter(course => course.status === 'approved'));
    };
    loadCourses();
  }, []);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-white">Todos los Cursos</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar cursos"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#282A36] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={() => setFilter(filter === 'all' ? 'popular' : 'all')}
              className="flex items-center space-x-2 px-4 py-2 bg-[#282A36] text-white rounded-lg hover:bg-[#343746]"
            >
              <Filter className="h-5 w-5" />
              <span>Filtrar</span>
            </button>
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

export default CourseListPage;