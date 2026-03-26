import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader, Mail, Phone, Clock, ArrowRight, LayoutGrid, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import bgFlooring from '@/assets/bg-flooring.jpg';
import bgCleaning from '@/assets/bg-cleaning.jpg';

type ServiceType = 'flooring' | 'cleaning' | 'general';

const ContactPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serviceType, setServiceType] = useState<ServiceType>('general');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, serviceType }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      toast.success('Message sent! We\'ll get back to you within 2 hours.');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setServiceType('general');
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const messagePlaceholders: Record<ServiceType, string> = {
    flooring: 'E.g., I\'d like to install vinyl flooring in my living room and two bedrooms (~800 sq ft total). Looking for a durable, waterproof option on a mid-range budget.',
    cleaning: 'E.g., I need a deep cleaning for a 3-bedroom, 2-bathroom house before moving in. The property has been vacant for 3 months.',
    general: 'Tell us how we can help. Include any details about your property, timeline, or budget that might be useful.',
  };

  return (
    <div className="relative bg-background flex flex-col overflow-y-auto min-h-screen">
      {/* Split Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 hidden md:flex">
          <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${bgCleaning})` }} />
          <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${bgFlooring})` }} />
        </div>
        <div className="absolute inset-0 md:hidden bg-cover bg-center" style={{ backgroundImage: `url(${bgFlooring})` }} />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col">
        <div className="flex flex-col px-4 sm:px-6 md:px-12 py-4 sm:py-6 md:py-8 max-w-5xl mx-auto w-full">

          {/* Header */}
          <div className="flex items-start gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/')}
              aria-label="Go back"
              className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 flex-shrink-0 border-2"
            >
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white drop-shadow-lg">
                Let's Talk About Your Project
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-yellow-300 font-medium mt-1">
                Free consultation · Fast response · No commitment
              </p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">

            {/* Left — Info */}
            <div className="space-y-4 sm:space-y-5">

              {/* Intro */}
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-display font-bold text-white mb-1.5">
                  We're here to help
                </h2>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  Whether you're planning a full flooring renovation, need a one-time deep clean, or just have questions about our services — our team is ready to help you find the best solution for your home.
                </p>
              </div>

              {/* Services quick-links */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-yellow-300 uppercase tracking-wider">Prefer a free instant estimate?</p>
                <button
                  onClick={() => navigate('/flooring')}
                  className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-yellow-300/30 hover:border-yellow-300/60 rounded-lg p-3 transition-all group text-left"
                >
                  <LayoutGrid className="h-5 w-5 text-yellow-300 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">Flooring Estimate</p>
                    <p className="text-xs text-white/70">Vinyl, tile, hardwood, carpet & more</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </button>
                <button
                  onClick={() => navigate('/cleaning')}
                  className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-yellow-300/30 hover:border-yellow-300/60 rounded-lg p-3 transition-all group text-left"
                >
                  <Sparkles className="h-5 w-5 text-yellow-300 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">Cleaning Estimate</p>
                    <p className="text-xs text-white/70">Standard, deep clean, move-out & Airbnb</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </button>
              </div>

              {/* Contact details */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-yellow-300/15 border border-yellow-300/30 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Email</p>
                    <p className="text-xs text-white/80">contact@jdservices.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-yellow-300/15 border border-yellow-300/30 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Phone / WhatsApp</p>
                    <p className="text-xs text-white/80">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-yellow-300/15 border border-yellow-300/30 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Hours</p>
                    <p className="text-xs text-white/80">Mon–Fri 8 AM–6 PM · Sat 9 AM–4 PM</p>
                  </div>
                </div>
              </div>

              {/* Response time badge */}
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-300/20 rounded-lg p-3">
                <p className="text-xs text-white/80 leading-relaxed">
                  <span className="text-yellow-300 font-semibold">⚡ Fast response:</span> We typically reply within 2 hours during business hours. For urgent requests, call or WhatsApp us directly.
                </p>
              </div>
            </div>

            {/* Right — Form */}
            <div>
              <form
                onSubmit={handleSubmit}
                className="space-y-3 sm:space-y-4 bg-white/10 backdrop-blur-md p-3 sm:p-4 md:p-6 rounded-xl border border-yellow-300/30 shadow-2xl"
              >
                {/* Service type selector */}
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-white mb-2">What can we help you with?</p>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {([
                      { key: 'flooring', label: 'Flooring', icon: '🪵' },
                      { key: 'cleaning', label: 'Cleaning', icon: '✨' },
                      { key: 'general', label: 'General', icon: '💬' },
                    ] as { key: ServiceType; label: string; icon: string }[]).map(({ key, label, icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setServiceType(key)}
                        className={`flex flex-col items-center gap-0.5 py-2 rounded-lg border text-xs font-medium transition-all ${
                          serviceType === key
                            ? 'bg-yellow-300 border-yellow-300 text-black'
                            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                        }`}
                      >
                        <span className="text-base">{icon}</span>
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="name" className="text-xs sm:text-sm font-semibold text-white">Full Name</label>
                  <Input
                    id="name" name="name" type="text"
                    placeholder="John Smith"
                    value={formData.name} onChange={handleChange} required
                    className="bg-white/15 border-white/30 text-white placeholder:text-white/50 text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-xs sm:text-sm font-semibold text-white">Email</label>
                    <Input
                      id="email" name="email" type="email"
                      placeholder="you@email.com"
                      value={formData.email} onChange={handleChange} required
                      className="bg-white/15 border-white/30 text-white placeholder:text-white/50 text-xs sm:text-sm h-9 sm:h-10"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="phone" className="text-xs sm:text-sm font-semibold text-white">Phone</label>
                    <Input
                      id="phone" name="phone" type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone} onChange={handleChange} required
                      className="bg-white/15 border-white/30 text-white placeholder:text-white/50 text-xs sm:text-sm h-9 sm:h-10"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="message" className="text-xs sm:text-sm font-semibold text-white">
                    Tell us about your project
                  </label>
                  <Textarea
                    id="message" name="message"
                    placeholder={messagePlaceholders[serviceType]}
                    value={formData.message} onChange={handleChange} required
                    rows={4}
                    className="resize-none bg-white/15 border-white/30 text-white placeholder:text-white/50 text-xs sm:text-sm"
                  />
                  <p className="text-xs text-white/50">The more detail you share, the more accurate our response will be.</p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-semibold h-10 sm:h-11 text-sm sm:text-base"
                >
                  {loading ? (
                    <><Loader className="h-4 w-4 mr-2 animate-spin" />Sending...</>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
