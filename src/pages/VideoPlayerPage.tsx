import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { Play, Pause, Volume2, VolumeX, Maximize, ChevronRight, Star, Eye } from 'lucide-react';

const VideoPlayerPage: React.FC = () => {
  const { courseId, videoId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [comment, setComment] = useState('');

  // Mock data - In a real app, this would come from an API
  const mockVideo = {
    title: "Introducción a React Hooks",
    description: "Aprende los conceptos básicos de React Hooks",
    url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    rating: 4.8,
    totalRatings: 256,
    views: 1250
  };

  const mockLessons = [
    { id: '1', title: 'Introducción', duration: '5:00', current: true },
    { id: '2', title: 'useState Hook', duration: '10:00', current: false },
    { id: '3', title: 'useEffect Hook', duration: '12:00', current: false },
    { id: '4', title: 'Custom Hooks', duration: '15:00', current: false },
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
    setIsMuted(Number(e.target.value) === 0);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value));
  };

  const handleRating = (value: number) => {
    setRating(value);
    setHasRated(true);
  };

  const handleSubmitRating = async () => {
    // Here we would make an API call to submit the rating
    console.log('Submitting rating:', { rating, comment });
    // Reset form
    setComment('');
    // Show success message
    alert('¡Gracias por tu calificación!');
  };

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Video Player Section */}
        <div className="lg:w-3/4">
          <div className="bg-[#282A36] rounded-lg overflow-hidden">
            <div className="relative aspect-video bg-black">
              <video
                className="w-full h-full"
                src={mockVideo.url}
                poster="https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg"
              />
              
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {/* Progress Bar */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleProgressChange}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handlePlayPause}
                      className="text-white hover:text-green-500 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-white hover:text-green-500 transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX className="w-6 h-6" />
                        ) : (
                          <Volume2 className="w-6 h-6" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    <span className="text-white text-sm">0:00 / 42:00</span>
                  </div>
                  
                  <button className="text-white hover:text-green-500 transition-colors">
                    <Maximize className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-white">{mockVideo.title}</h1>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-semibold">{mockVideo.rating}</span>
                    <span className="text-gray-400">({mockVideo.totalRatings})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-semibold">{mockVideo.views}</span>
                    <span className="text-gray-400">visualizaciones</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 mb-6">{mockVideo.description}</p>

              {/* Rating Section */}
              <div className="border-t border-gray-700 pt-6">
                <h2 className="text-xl font-semibold text-white mb-4">Califica este curso</h2>
                
                {/* Star Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => handleRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoveredRating || rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-400'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                  <span className="text-gray-400 ml-2">
                    {rating > 0 ? `${rating} de 5 estrellas` : 'Sin calificar'}
                  </span>
                </div>

                {/* Comment Section */}
                {hasRated && (
                  <div className="space-y-4">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="¿Qué te pareció el curso? (opcional)"
                      className="w-full h-24 px-4 py-2 bg-[#1E2029] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                    />
                    <button
                      onClick={handleSubmitRating}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Enviar Calificación
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Lessons Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-[#282A36] rounded-lg p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Contenido del Curso</h2>
            <div className="space-y-2">
              {mockLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    lesson.current
                      ? 'bg-green-500/10 text-green-500'
                      : 'text-gray-400 hover:bg-[#343746]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {lesson.current && <Play className="w-4 h-4" />}
                    <span>{lesson.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{lesson.duration}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VideoPlayerPage;