import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import bgFlooring from '@/assets/bg-flooring.jpg';
import bgCleaning from '@/assets/bg-cleaning.jpg';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* Split Background */}
      <div className="absolute inset-0 flex">
        <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${bgFlooring})` }} />
        <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${bgCleaning})` }} />
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col overflow-y-auto">
        <div className="flex-1 flex flex-col px-6 sm:px-12 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 flex-shrink-0">
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
              <h1 className="text-4xl font-display font-bold text-white drop-shadow-lg">About JD Services</h1>
              <p className="text-yellow-300 font-medium mt-1">Professional Home Solutions</p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
            {/* Left Column */}
            <div className="space-y-6 text-base text-white leading-relaxed drop-shadow">
              <div>
                <h2 className="text-3xl font-display font-bold text-yellow-300 mb-4">Welcome</h2>
                <p>
                  Welcome to JD Flooring & Cleaning Services, your trusted partner for professional home improvement and maintenance solutions. With years of experience in the industry, we have built our reputation on delivering exceptional quality and outstanding customer service.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-display font-bold text-yellow-300 mb-3">Our Mission</h3>
                <p>
                  To make professional home services accessible, affordable, and hassle-free. We believe every homeowner deserves expert-quality work without hidden fees or complicated pricing structures.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-display font-bold text-yellow-300 mb-3">Our Story</h3>
                <p>
                  Founded with a passion for excellence, JD Services began as a small local operation dedicated to serving our community. Today, we're proud to serve hundreds of satisfied customers with a team of skilled professionals.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6 text-base text-white leading-relaxed drop-shadow">
              <div>
                <h3 className="text-2xl font-display font-bold text-yellow-300 mb-3">🏠 Flooring Services</h3>
                <p>
                  Professional installation of vinyl, tile, laminate, hardwood, and carpet flooring with premium materials and cutting-edge techniques for flawless results that last for years.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-display font-bold text-yellow-300 mb-3">✨ Cleaning Services</h3>
                <p>
                  From routine maintenance to deep cleaning, move-out cleanings, and Airbnb turnovers using eco-friendly products and proven methods for spotless, sanitized homes.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-display font-bold text-yellow-300 mb-3">Why Choose Us?</h3>
                <ul className="space-y-2 list-disc list-inside text-white">
                  <li><strong>Transparent Pricing</strong> - No hidden fees</li>
                  <li><strong>Expert Team</strong> - Trained professionals</li>
                  <li><strong>Quick Estimates</strong> - Free quote in minutes</li>
                  <li><strong>Licensed & Insured</strong> - Full coverage</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 mb-8 bg-white/5 backdrop-blur-sm p-8 rounded-lg border border-white/10 max-w-6xl">
            <h2 className="text-2xl font-display font-bold text-yellow-300 mb-4">Our Values</h2>
            <p className="text-white leading-relaxed drop-shadow">
              We operate with a commitment to honesty, quality, and respect. We believe in doing the right thing, treating your home as if it were our own, with the attention to detail and care it deserves.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
