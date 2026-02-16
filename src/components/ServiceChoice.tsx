import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Sparkles, ArrowRight } from 'lucide-react';
import { useServiceStore } from '@/store/useServiceStore';

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

  const handleChoose = (key: 'flooring' | 'cleaning', path: string) => {
    setService(key);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <header className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-3">
          JD Flooring & Cleaning
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Professional home services with transparent pricing. Get your free estimate in minutes.
        </p>
      </header>

      {/* Service Cards */}
      <main className="flex-1 flex items-start justify-center px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full">
          {services.map(({ key, title, description, icon: Icon, path }) => (
            <Card
              key={key}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50"
              onClick={() => handleChoose(key, path)}
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
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} JD Flooring & Cleaning Service. All rights reserved.
      </footer>
    </div>
  );
};

export default ServiceChoice;
