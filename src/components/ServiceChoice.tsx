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

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="text-center py-12 px-4">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-primary-foreground mb-3 drop-shadow-lg">
            JD Flooring & Cleaning
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-md mx-auto drop-shadow mb-6">
            Professional home services with transparent pricing. Get your free estimate in minutes.
          </p>
          <img src="/LogoJD.JPG" alt="JD Logo" className="h-60 w-auto mx-auto drop-shadow-lg mb-0" style={{ borderRadius: 999 }} />
        </header>

        <main className="flex-1 flex items-center justify-stretch px-4 pb-16">
          <div className="flex gap-0 w-full">
            {services.map(({ key, title, description, icon: Icon, path }) => (
              <div key={key} className="flex-1 flex items-center justify-center">
                <Card
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/90 backdrop-blur-sm w-full max-w-sm"
                  onClick={() => handleChoose(key, path)}
                  onMouseEnter={() => setHovered(key)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <CardHeader className="text-center space-y-4 p-8">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                      <Icon className="h-8 w-8 text-primary group-hover:text-secondary transition-colors" />
                    </div>
                    <CardTitle className="font-display text-xl">{title}</CardTitle>
                    <CardDescription className="text-sm">{description}</CardDescription>
                    <Button variant="ghost" className="gap-2">
                      Get Estimate <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </main>

        <footer className="text-center py-6 text-xs text-primary-foreground/60 border-t border-primary-foreground/10">
          © {new Date().getFullYear()} JD Flooring & Cleaning Service. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default ServiceChoice;
