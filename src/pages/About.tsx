import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import bgFlooring from '@/assets/bg-flooring.jpg';
import bgCleaning from '@/assets/bg-cleaning.jpg';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-background flex flex-col overflow-y-auto">
      {/* Split Background - fixed and scrollable with content */}
      <div className="fixed inset-0 flex pointer-events-none">
        <div className="absolute inset-0 flex hidden md:flex">
          <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${bgFlooring})` }} />
          <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${bgCleaning})` }} />
        </div>
        {/* Mobile background */}
        <div className="absolute inset-0 md:hidden bg-cover bg-center" style={{ backgroundImage: `url(${bgFlooring})` }} />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full flex flex-col">
        <div className="flex flex-col px-4 sm:px-6 md:px-12 py-4 sm:py-6 md:py-8">
          {/* Header */}
          <div className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/')} 
              aria-label="Go back" 
              className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 flex-shrink-0 flex items-center justify-center border-2"
            >
              <ArrowLeft className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white drop-shadow-lg break-words">About JD Services</h1>
              <p className="text-xs sm:text-sm md:text-base text-yellow-300 font-medium mt-1">Professional Home Solutions</p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-6xl">
            {/* Left Column */}
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-white leading-relaxed drop-shadow">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-yellow-300 mb-1.5 sm:mb-2">Welcome</h2>
                <p className="text-xs sm:text-sm md:text-base">
                  Welcome to JD Flooring & Cleaning Services, your trusted partner for professional home improvement and maintenance solutions. With years of experience in the industry, we have built our reputation on delivering exceptional quality and outstanding customer service.
                </p>
              </div>

              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-display font-bold text-yellow-300 mb-1.5 sm:mb-2">Our Mission</h3>
                <p className="text-xs sm:text-sm md:text-base">
                  To make professional home services accessible, affordable, and hassle-free. We believe every homeowner deserves expert-quality work without hidden fees or complicated pricing structures.
                </p>
              </div>

              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-display font-bold text-yellow-300 mb-1.5 sm:mb-2">Our Story</h3>
                <p className="text-xs sm:text-sm md:text-base">
                  Founded with a passion for excellence, JD Services began as a small local operation dedicated to serving our community. Today, we're proud to serve hundreds of satisfied customers with a team of skilled professionals.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-white leading-relaxed drop-shadow">
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-display font-bold text-yellow-300 mb-1.5 sm:mb-2">🏠 Flooring Services</h3>
                <p className="text-xs sm:text-sm md:text-base">
                  Professional installation of vinyl, tile, laminate, hardwood, and carpet flooring with premium materials and cutting-edge techniques for flawless results that last for years.
                </p>
              </div>

              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-display font-bold text-yellow-300 mb-1.5 sm:mb-2">✨ Cleaning Services</h3>
                <p className="text-xs sm:text-sm md:text-base">
                  From routine maintenance to deep cleaning, move-out cleanings, and Airbnb turnovers using eco-friendly products and proven methods for spotless, sanitized homes.
                </p>
              </div>

              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-display font-bold text-yellow-300 mb-1.5 sm:mb-2">Why Choose Us?</h3>
                <ul className="space-y-1 list-disc list-inside text-white text-xs sm:text-sm md:text-base">
                  <li><strong>Transparent Pricing</strong> - No hidden fees</li>
                  <li><strong>Expert Team</strong> - Trained professionals</li>
                  <li><strong>Quick Estimates</strong> - Free quote in minutes</li>
                  <li><strong>Licensed & Insured</strong> - Full coverage</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-6 sm:mt-8 md:mt-10 mb-4 sm:mb-6 bg-white/5 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-lg border border-white/10 max-w-6xl">
            <h2 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-yellow-300 mb-1.5 sm:mb-2">Our Values</h2>
            <p className="text-xs sm:text-sm md:text-base text-white leading-relaxed drop-shadow">
              We operate with a commitment to honesty, quality, and respect. We believe in doing the right thing, treating your home as if it were our own, with the attention to detail and care it deserves.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
