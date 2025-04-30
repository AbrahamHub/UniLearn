import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Star, Eye, GraduationCap } from 'lucide-react';
import type { Course, LearningUnit } from '../types';
import { fetchLearningUnits } from '../services/api';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();
  const [learningUnits, setLearningUnits] = useState<LearningUnit[]>([]);

  useEffect(() => {
    const loadLearningUnits = async () => {
      const units = await fetchLearningUnits();
      setLearningUnits(units.filter(unit => course.learningUnitIds.includes(unit.id)));
    };
    loadLearningUnits();
  }, [course.learningUnitIds]);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/curso/${course.id}/video/1`);
  };

  return (
    <Link to={`/curso/${course.id}`} className="block">
      <div className="bg-[#282A36] rounded-lg overflow-hidden transition-transform hover:transform hover:scale-105">
        <div className="relative">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
          >
            <div className="bg-green-500 rounded-full p-4">
              <Play className="w-8 h-8 text-white" />
            </div>
          </button>
          {learningUnits.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-2">
              {learningUnits.map((unit) => (
                <div 
                  key={unit.id}
                  className="bg-green-500/90 text-white px-2 py-1 rounded-lg text-sm flex items-center"
                >
                  <GraduationCap className="w-4 h-4 mr-1" />
                  {unit.name}
                </div>
              ))}
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white">{course.rating}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-white" />
                <span className="text-white">{course.views}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
          <p className="text-gray-400 text-sm line-clamp-3">{course.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;