import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { User, Star, BookOpen, Shield } from 'lucide-react';
import type { User as UserType } from '../types';
import { fetchUsers } from '../services/api';

const ExpertListPage: React.FC = () => {
  const [experts, setExperts] = useState<UserType[]>([]);

  useEffect(() => {
    const loadExperts = async () => {
      const users = await fetchUsers();
      setExperts(users.filter(user => user.role === 'expert'));
    };
    loadExperts();
  }, []);

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-6">Expertos Temáticos</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((expert) => (
            <div key={expert.id} className="bg-[#282A36] rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-green-500 rounded-full p-3">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{expert.name}</h3>
                  <p className="text-gray-400">{expert.email}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <Shield className="h-5 w-5 mr-2 text-green-500" />
                  <span>Experto Verificado</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <BookOpen className="h-5 w-5 mr-2 text-green-500" />
                  <span>12 cursos revisados</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Star className="h-5 w-5 mr-2 text-yellow-400" />
                  <span>4.8 calificación promedio</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default ExpertListPage;