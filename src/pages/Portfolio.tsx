import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Star, X, ChevronLeft, ChevronRight } from 'lucide-react';
import bgFlooring from '@/assets/bg-flooring.jpg';
import bgCleaning from '@/assets/bg-cleaning.jpg';

const Portfolio = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [rightImagePage, setRightImagePage] = useState(0);

  // Portfolio items - primeiro é o featured grande na esquerda
  const portfolioItems = [
    { id: 1, title: 'Premium Hardwood', category: 'Flooring', featured: true, isMainFeatured: true },
    { id: 2, title: 'Elegant Tile', category: 'Flooring', featured: false },
    { id: 3, title: 'Modern Vinyl', category: 'Flooring', featured: false },
    { id: 4, title: 'Deep Cleaning', category: 'Cleaning', featured: false },
    { id: 5, title: 'Carpet Installation', category: 'Flooring', featured: true, isMainFeatured: false },
    { id: 6, title: 'Office Shine', category: 'Cleaning', featured: false },
  ];

  // Separar items
  const mainFeatured = portfolioItems.find(item => item.isMainFeatured);
  const smallItems = portfolioItems.filter(item => !item.isMainFeatured);

  return (
    <div className="relative bg-background flex flex-col overflow-y-auto">
      {/* Dual Background - fixed */}
      <div className="fixed inset-0 flex pointer-events-none">
        <div className="absolute inset-0 flex hidden md:flex">
          <div 
            className="w-1/2 bg-cover bg-center" 
            style={{ backgroundImage: `url(${bgFlooring})` }} 
          />
          <div 
            className="w-1/2 bg-cover bg-center" 
            style={{ backgroundImage: `url(${bgCleaning})` }} 
          />
        </div>
        {/* Mobile background */}
        <div className="absolute inset-0 md:hidden bg-cover bg-center" style={{ backgroundImage: `url(${bgFlooring})` }} />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/45 to-black/50" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full flex flex-col">
        <div className="flex flex-col px-3 sm:px-6 lg:px-12 py-4 sm:py-6">
          {/* Header */}
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-shrink-0">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/')} 
              aria-label="Go back" 
              className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 flex-shrink-0 flex items-center justify-center border-2"
            >
              <ArrowLeft className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5" />
            </Button>
            <div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-display font-bold text-white drop-shadow-lg">Our Portfolio</h1>
              <p className="text-yellow-300 font-semibold text-xs sm:text-sm">Transformations & Excellence</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/95 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 max-w-4xl flex-shrink-0">
            Explore our diverse collection of completed projects showcasing our expertise in flooring installations and professional cleaning services.
          </p>

          {/* Main Portfolio Layout - 50/50 Split */}
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 pb-4 min-h-0 lg:min-h-[650px]">
            {/* Left - Large Featured Image - Occupies full height on desktop */}
            {mainFeatured && (
              <div className="w-full lg:w-1/2 h-32 sm:h-40 md:h-56 lg:h-full">
                <div 
                  className="group relative overflow-hidden rounded-xl shadow-2xl transition-all duration-500 hover:shadow-yellow-300/50 cursor-pointer w-full h-full"
                  onClick={() => setSelectedImage(mainFeatured.id)}
                >
                  <img
                    src="/image.png"
                    alt={mainFeatured.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {mainFeatured.featured && (
                    <div className="absolute top-2 right-2 z-20">
                      <div className="flex items-center gap-1 bg-yellow-300 text-black px-2 py-1 rounded-full font-semibold text-xs">
                        <Star className="h-3 w-3 fill-current" />
                        Featured
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mb-1">
                      <Eye className="h-4 w-4 text-yellow-300 flex-shrink-0" />
                      <span className="text-yellow-300 text-xs font-bold uppercase">View</span>
                    </div>
                    <h3 className="text-white font-bold text-sm md:text-base">{mainFeatured.title}</h3>
                    <p className="text-yellow-300 text-xs font-semibold uppercase">{mainFeatured.category}</p>
                  </div>
                  <div className="absolute inset-0 border-2 border-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                </div>
              </div>
            )}

            {/* Right - Images with Carousel */}
            <div className="w-full lg:w-1/2 flex flex-col gap-2 min-h-0 lg:h-full overflow-hidden">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1">
                {smallItems.slice(rightImagePage * 4, rightImagePage * 4 + 4).map((item) => (
                  <div key={item.id} className="h-20 sm:h-28 md:h-32 lg:h-full">
                    <div 
                      className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:shadow-yellow-300/50 cursor-pointer w-full h-full"
                      onClick={() => setSelectedImage(item.id)}
                    >
                      <img
                        src="/image.png"
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {item.featured && (
                        <div className="absolute top-1 right-1 z-20">
                          <div className="flex items-center gap-0.5 bg-yellow-300 text-black px-1 py-0.5 rounded-full font-semibold text-xs">
                            <Star className="h-2 w-2 fill-current" />
                            Featured
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-1 sm:p-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <h3 className="text-white font-bold text-xs sm:text-sm">{item.title}</h3>
                        <p className="text-yellow-300 text-xs font-semibold uppercase">{item.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Controls for Right Images */}
              {smallItems.length > 4 && (
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-1 flex-shrink-0">
                  <button
                    onClick={() => setRightImagePage(Math.max(0, rightImagePage - 1))}
                    disabled={rightImagePage === 0}
                    className="flex-shrink-0 p-1.5 sm:p-2 bg-yellow-300/20 hover:bg-yellow-300/40 disabled:opacity-30 disabled:cursor-not-allowed text-yellow-300 rounded-lg transition-all"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.ceil(smallItems.length / 4) }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setRightImagePage(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          rightImagePage === idx ? 'bg-yellow-300 w-6' : 'bg-yellow-300/40 hover:bg-yellow-300/60'
                        }`}
                        aria-label={`Go to page ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setRightImagePage(Math.min(Math.ceil(smallItems.length / 4) - 1, rightImagePage + 1))}
                    disabled={rightImagePage >= Math.ceil(smallItems.length / 4) - 1}
                    className="flex-shrink-0 p-1.5 sm:p-2 bg-yellow-300/20 hover:bg-yellow-300/40 disabled:opacity-30 disabled:cursor-not-allowed text-yellow-300 rounded-lg transition-all"
                    aria-label="Next"
                  >
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-screen w-full h-full md:w-auto md:h-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-yellow-300 hover:bg-yellow-400 text-black p-2 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Image */}
            <img
              src="/image.png"
              alt={portfolioItems.find(item => item.id === selectedImage)?.title || 'Portfolio item'}
              className="w-full h-full object-contain rounded-xl shadow-2xl"
            />

            {/* Item Info */}
            {portfolioItems.find(item => item.id === selectedImage) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 rounded-b-xl">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {portfolioItems.find(item => item.id === selectedImage)?.title}
                </h2>
                <p className="text-yellow-300 font-semibold">
                  {portfolioItems.find(item => item.id === selectedImage)?.category}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
