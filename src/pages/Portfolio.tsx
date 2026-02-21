import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Star, X } from 'lucide-react';
import bgFlooring from '@/assets/bg-flooring.jpg';
import bgCleaning from '@/assets/bg-cleaning.jpg';

const Portfolio = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

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

  const PortfolioCard = ({ item, isLarge = false }) => (
    <div 
      className={`group relative overflow-hidden rounded-xl shadow-2xl transition-all duration-500 hover:shadow-yellow-300/50 cursor-pointer w-full h-full`}
      onClick={() => setSelectedImage(item.id)}
    >
      {/* Image with Parallax Effect */}
      <img
        src="/image.png"
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125"
      />
      
      {/* Featured Badge */}
      {item.featured && (
        <div className="absolute top-3 right-3 z-20">
          <div className="flex items-center gap-1 bg-yellow-300 text-black px-3 py-1 rounded-full font-semibold text-xs">
            <Star className="h-3.5 w-3.5 fill-current" />
            Featured
          </div>
        </div>
      )}
      
      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
      
      {/* Content - Always visible at bottom, enhanced on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mb-3">
          <Eye className="h-6 w-6 text-yellow-300 flex-shrink-0" />
          <span className="text-yellow-300 text-xs md:text-sm font-bold uppercase tracking-widest">View</span>
        </div>
        <h3 className="text-white font-bold text-lg md:text-xl mb-2 leading-tight">{item.title}</h3>
        <p className="text-yellow-300 text-xs md:text-sm font-semibold uppercase tracking-wider">{item.category}</p>
      </div>

      {/* Border Accent on Hover */}
      <div className="absolute inset-0 border-2 border-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
    </div>
  );

  return (
    <div className="relative h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* Dual Background */}
      <div className="absolute inset-0 flex">
        <div 
          className="w-1/2 bg-cover bg-center" 
          style={{ backgroundImage: `url(${bgFlooring})` }} 
        />
        <div 
          className="w-1/2 bg-cover bg-center" 
          style={{ backgroundImage: `url(${bgCleaning})` }} 
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/45 to-black/50" />
      
      {/* Content */}
      <div className="relative z-10 w-full h-screen flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col px-4 sm:px-8 lg:px-12 py-6 min-h-0 max-h-screen">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6 flex-shrink-0">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/')} 
              aria-label="Go back" 
              className="h-12 w-12 flex-shrink-0 flex items-center justify-center border-2"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white drop-shadow-lg">Our Portfolio</h1>
              <p className="text-yellow-300 font-semibold mt-1 text-sm md:text-base">Transformations & Excellence</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/95 text-sm md:text-base leading-relaxed mb-6 max-w-4xl flex-shrink-0">
            Explore our diverse collection of completed projects showcasing our expertise in flooring installations and professional cleaning services.
          </p>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
            {/* Left Column - Large Featured Item */}
            {mainFeatured && (
              <div className="h-full min-h-0">
                <PortfolioCard item={mainFeatured} isLarge={true} />
              </div>
            )}

            {/* Right Column - Grid of Small Items */}
            <div className="grid grid-cols-2 grid-rows-3 gap-4 h-full">
              {smallItems.map((item) => (
                <div key={item.id} className="h-full min-h-0">
                  <PortfolioCard item={item} isLarge={false} />
                </div>
              ))}
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
