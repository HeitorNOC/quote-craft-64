import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Sparkles, ArrowRight } from 'lucide-react';
import { useServiceStore } from '@/store/useServiceStore';
import bgFlooring from '@/assets/bg-flooring.jpg';
import bgCleaning from '@/assets/bg-cleaning.jpg';

const services = [
  {
    key: 'flooring' as const,
    title: 'Flooring Services',
    description: 'Vinyl, tile, laminate, hardwood, carpet — get a quick estimate for your project.',
    icon: LayoutGrid,
    path: '/flooring',
  },
  {
    key: 'cleaning' as const,
    title: 'Cleaning Services',
    description: 'Standard, deep clean, move-out, or Airbnb turnovers — transparent pricing.',
    icon: Sparkles,
    path: '/cleaning',
  },
];

const ServiceChoice = () => {
  const navigate = useNavigate();
  const setService = useServiceStore(s => s.setService);
  const [hovered, setHovered] = useState<'flooring' | 'cleaning' | null>(null);

  const handleChoose = (key: 'flooring' | 'cleaning', path: string) => {
    setService(key);
    navigate(path);
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Split background */}
      <div className="absolute inset-0 flex">
        <div
          className="transition-all duration-700 ease-in-out bg-cover bg-center"
          style={{
            backgroundImage: `url(${bgFlooring})`,
            width: hovered === 'cleaning' ? '0%' : hovered === 'flooring' ? '100%' : '50%',
            opacity: hovered === 'cleaning' ? 0 : 1,
          }}
        />
        <div
          className="transition-all duration-700 ease-in-out bg-cover bg-center"
          style={{
            backgroundImage: `url(${bgCleaning})`,
            width: hovered === 'flooring' ? '0%' : hovered === 'cleaning' ? '100%' : '50%',
            opacity: hovered === 'flooring' ? 0 : 1,
          }}
        />
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-foreground/60" />

      {/* Top Navigation Links */}
      <div className="relative z-20 px-2 sm:px-4 py-3 sm:py-4 flex justify-between gap-2 sm:gap-4 flex-wrap">
        <Button variant="ghost" onClick={() => navigate('/about')} className="text-sm sm:text-base md:text-lg text-primary-foreground hover:bg-primary-foreground/20 font-semibold px-2 sm:px-4">
          About
        </Button>
        <Button variant="ghost" onClick={() => navigate('/portfolio')} className="text-sm sm:text-base md:text-lg text-primary-foreground hover:bg-primary-foreground/20 font-semibold px-2 sm:px-4">
          Portfolio
        </Button>
        <Button variant="ghost" onClick={() => navigate('/contact')} className="text-sm sm:text-base md:text-lg text-primary-foreground hover:bg-primary-foreground/20 font-semibold px-2 sm:px-4">
          Contact
        </Button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="text-center py-6 sm:py-8 md:py-12 px-3 sm:px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-2 sm:mb-3 drop-shadow-lg">
            JD Flooring & Cleaning
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-primary-foreground/80 max-w-md mx-auto drop-shadow mb-4 sm:mb-6 px-2">
            Professional home services with transparent pricing. Get your free estimate in minutes.
          </p>
          <img src="/LogoJD.JPG" alt="JD Logo" className="h-40 sm:h-48 md:h-60 w-auto mx-auto drop-shadow-lg mb-0" style={{ borderRadius: 999 }} />
        </header>

        <main className="flex-1 flex items-center justify-stretch px-3 sm:px-4 pb-8 sm:pb-12 md:pb-16">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 w-full">
            {services.map(({ key, title, description, icon: Icon, path }) => (
              <div key={key} className="flex-1 flex items-center justify-center px-1 sm:px-0.5">
                <Card
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/90 backdrop-blur-sm w-full max-w-sm"
                  onClick={() => handleChoose(key, path)}
                  onMouseEnter={() => setHovered(key)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <CardHeader className="text-center space-y-3 sm:space-y-4 p-4 sm:p-6 md:p-8">
                    <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-secondary/20 transition-colors flex-shrink-0">
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary group-hover:text-secondary transition-colors" />
                    </div>
                    <CardTitle className="font-display text-lg sm:text-xl">{title}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">{description}</CardDescription>
                    <Button variant="ghost" className="gap-2 text-sm sm:text-base">
                      Get Estimate <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </main>

        <footer className="text-center py-4 sm:py-6 text-xs text-primary-foreground/60 border-t border-primary-foreground/10 px-3">
          © {new Date().getFullYear()} JD Flooring & Cleaning Service. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default ServiceChoice;
