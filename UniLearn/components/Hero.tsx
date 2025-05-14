import { FaBook, FaUsers, FaTools, FaStar } from "react-icons/fa";

export default function Hero() {
  return (
    <div className="relative h-screen w-full bg-transparent pt-28 pb-16">
      <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/55 dark:from-white/15 dark:to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-background via-white/90 dark:via-background/80 to-white/30 dark:to-background/20" />
      {/* Ajuste de colores para mejor contraste */}

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center text-center">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          <span className="block">Aprende de tus compañeros.</span>
          <span className="block text-green-600 dark:text-green-500">Comparte tu conocimiento.</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-700 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          La primera plataforma de aprendizaje colaborativo creada por y para estudiantes. Comparte tus conocimientos y aprende de otros expertos en tu área.
        </p>
        {/* Eliminado el botón "Comenzar Ahora" */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <FaBook className="text-green-600 dark:text-green-500 text-3xl mx-auto mb-4" />,
              title: "Cursos de Calidad",
              description: "Contenido revisado por expertos para garantizar la mejor calidad educativa.",
            },
            {
              icon: <FaUsers className="text-green-600 dark:text-green-500 text-3xl mx-auto mb-4" />,
              title: "Comunidad Activa",
              description: "Aprende y comparte con una comunidad de estudiantes comprometidos.",
            },
            {
              icon: <FaTools className="text-green-600 dark:text-green-500 text-3xl mx-auto mb-4" />,
              title: "Experiencia Práctica",
              description: "Contenido práctico y relevante para tu desarrollo académico y profesional.",
            },
            {
              icon: <FaStar className="text-green-600 dark:text-green-500 text-3xl mx-auto mb-4" />,
              title: "Sistema de Puntuación",
              description: "Califica y valora los cursos para ayudar a otros estudiantes a encontrar el mejor contenido.",
            },
          ].map((card, index) => (
            <div key={index} className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              {card.icon}
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-500">{card.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
