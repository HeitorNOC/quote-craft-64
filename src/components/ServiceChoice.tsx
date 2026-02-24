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
    <div className="relative h-screen flex flex-col overflow-hidden">
      {/* Split background - fixed to viewport */}
      <div className="absolute inset-0 flex pointer-events-none">
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
      <div className="absolute inset-0 bg-foreground/60 pointer-events-none" />

      {/* Container - flex layout that fills exactly 100vh */}
      <div className="relative z-10 flex flex-col h-full overflow-hidden">
        {/* Top Navigation Links - fixed height */}
        <nav className="flex-shrink-0 px-2 sm:px-4 py-2 sm:py-3 flex justify-between gap-2 sm:gap-4 flex-wrap">
          <Button variant="ghost" onClick={() => navigate('/about')} className="text-xs sm:text-sm md:text-base text-primary-foreground hover:bg-primary-foreground/20 font-semibold px-2 sm:px-3">
            About
          </Button>
          <Button variant="ghost" onClick={() => navigate('/portfolio')} className="text-xs sm:text-sm md:text-base text-primary-foreground hover:bg-primary-foreground/20 font-semibold px-2 sm:px-3">
            Portfolio
          </Button>
          <Button variant="ghost" onClick={() => navigate('/contact')} className="text-xs sm:text-sm md:text-base text-primary-foreground hover:bg-primary-foreground/20 font-semibold px-2 sm:px-3">
            Contact
          </Button>
        </nav>

        {/* Header/Logo - flex-shrink-0 with compressed spacing */}
        <header className="flex-shrink-0 text-center px-3 sm:px-4 py-1.5 sm:py-2 md:py-3">
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground drop-shadow-lg" style={{ lineHeight: '1.1' }}>
            JD Flooring & Cleaning
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-primary-foreground/80 drop-shadow max-w-md mx-auto px-1 mt-0.5 sm:mt-1" style={{ lineHeight: '1.3' }}>
            Professional home services. Free estimate in minutes.
          </p>
          <img src="/LogoJD.JPG" alt="JD Logo" className="h-16 sm:h-20 md:h-28 w-auto mx-auto drop-shadow-lg mt-1.5 sm:mt-2" style={{ borderRadius: 999 }} />
        </header>

        {/* Main content - flex-1 grows to fill available space */}
        <main className="flex-1 flex items-center justify-center px-2 sm:px-3 md:px-4 py-2 sm:py-3 min-h-0">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-10 w-full max-w-6xl h-full sm:h-auto">
            {services.map(({ key, title, description, icon: Icon, path }) => (
              <div key={key} className="flex-1 flex items-center justify-center min-h-0">
                <Card
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border/50 bg-card/90 backdrop-blur-sm w-full flex flex-col h-auto min-h-40 sm:min-h-56 md:min-h-64"
                  onClick={() => handleChoose(key, path)}
                  onMouseEnter={() => setHovered(key)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <CardHeader className="text-center space-y-2 sm:space-y-3 p-3 sm:p-4 md:p-6 flex-1 flex flex-col justify-between">
                    <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-secondary/20 transition-colors flex-shrink-0">
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary group-hover:text-secondary transition-colors" />
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <CardTitle className="font-display text-base sm:text-lg md:text-xl">{title}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm md:text-base">{description}</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2 text-xs sm:text-sm w-fit mx-auto hover:bg-primary/10">
                      Get Estimate <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </main>

        {/* Footer - fixed height */}
        <footer className="flex-shrink-0 text-center py-1.5 sm:py-2 text-xs text-primary-foreground/60 border-t border-primary-foreground/10 px-3">
          © {new Date().getFullYear()} JD Flooring & Cleaning Service.
        </footer>
      </div>
    </div>
  );
};

export default ServiceChoice;
