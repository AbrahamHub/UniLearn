import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import MainLayout from '../components/layout/MainLayout';
import { Upload, FileVideo, FileText, Image as ImageIcon } from 'lucide-react';

const courseSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().min(20, 'La descripción debe tener al menos 20 caracteres'),
  thumbnail: z.string().url('Debe ser una URL válida'),
  category: z.string().min(1, 'Selecciona una categoría'),
  videoUrl: z.string().url('Debe ser una URL válida del video'),
  materials: z.array(z.string()).optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

const UploadPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      materials: [],
    },
  });

  const onSubmit = async (data: CourseFormData) => {
    try {
      console.log('Form data:', data);
      // Here we would submit the course data to the backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      reset();
      alert('Curso enviado para revisión');
    } catch (error) {
      console.error('Error submitting course:', error);
      alert('Error al enviar el curso');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Subir Nuevo Curso</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Título del Curso
            </label>
            <input
              type="text"
              id="title"
              {...register('title')}
              className="mt-1 block w-full rounded-md bg-[#282A36] border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
              placeholder="Ej: Introducción a React"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Descripción
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className="mt-1 block w-full rounded-md bg-[#282A36] border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
              placeholder="Describe el contenido y objetivos del curso..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-300">
              URL de la Imagen de Portada
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-[#1E2029] text-gray-400">
                <ImageIcon className="h-5 w-5" />
              </span>
              <input
                type="url"
                id="thumbnail"
                {...register('thumbnail')}
                className="flex-1 block w-full rounded-none rounded-r-md bg-[#282A36] border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            {errors.thumbnail && (
              <p className="mt-1 text-sm text-red-500">{errors.thumbnail.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-300">
              URL del Video Principal
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-[#1E2029] text-gray-400">
                <FileVideo className="h-5 w-5" />
              </span>
              <input
                type="url"
                id="videoUrl"
                {...register('videoUrl')}
                className="flex-1 block w-full rounded-none rounded-r-md bg-[#282A36] border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
                placeholder="https://ejemplo.com/video.mp4"
              />
            </div>
            {errors.videoUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.videoUrl.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300">
              Categoría
            </label>
            <select
              id="category"
              {...register('category')}
              className="mt-1 block w-full rounded-md bg-[#282A36] border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
            >
              <option value="">Selecciona una categoría</option>
              <option value="programming">Programación</option>
              <option value="design">Diseño</option>
              <option value="business">Negocios</option>
              <option value="marketing">Marketing</option>
              <option value="mathematics">Matemáticas</option>
              <option value="science">Ciencias</option>
              <option value="languages">Idiomas</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="h-5 w-5" />
            <span>{isSubmitting ? 'Subiendo...' : 'Subir Curso'}</span>
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default UploadPage;