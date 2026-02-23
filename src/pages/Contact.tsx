import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader, Mail, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import bgFlooring from '@/assets/bg-flooring.jpg';
import bgCleaning from '@/assets/bg-cleaning.jpg';

const ContactPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast.success('Message sent successfully! We will contact you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* Split Background */}
      <div className="absolute inset-0 flex hidden md:flex">
        <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${bgCleaning})` }} />
        <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${bgFlooring})` }} />
      </div>
      {/* Mobile background */}
      <div className="absolute inset-0 md:hidden bg-cover bg-center" style={{ backgroundImage: `url(${bgFlooring})` }} />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" />
      
      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col overflow-y-auto">
        <div className="flex-1 flex flex-col px-3 sm:px-6 md:px-12 py-4 sm:py-6 md:py-8 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-12 flex-shrink-0">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/')} 
              aria-label="Go back" 
              className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 flex-shrink-0 flex items-center justify-center border-2"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white drop-shadow-lg break-words">Get in Touch</h1>
              <p className="text-xs sm:text-sm md:text-base text-yellow-300 font-medium mt-1">We'd love to hear from you</p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            {/* Left - Info */}
            <div className="space-y-6 md:space-y-8">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-white mb-2 sm:mb-3 md:mb-4">Contact Information</h2>
                <p className="text-xs sm:text-sm md:text-base text-white leading-relaxed drop-shadow">
                  Have questions or ready to get started? Reach out to us and our team will get back to you within 24 hours.
                </p>
              </div>

              <div className="space-y-4 md:space-y-6">
                <div className="flex gap-3 md:gap-4">
                  <div className="flex-shrink-0">
                    <Mail className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-yellow-300 mt-0.5 md:mt-1" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1 drop-shadow">Email</h3>
                    <p className="text-xs sm:text-sm text-white/90 drop-shadow break-words">contact@jdservices.com</p>
                  </div>
                </div>

                <div className="flex gap-3 md:gap-4">
                  <div className="flex-shrink-0">
                    <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-yellow-300 mt-0.5 md:mt-1" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1 drop-shadow">WhatsApp</h3>
                    <p className="text-xs sm:text-sm text-white/90 drop-shadow">(555) 123-4567</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-lg border border-yellow-300/20">
                <p className="text-xs sm:text-sm md:text-base text-white leading-relaxed drop-shadow">
                  <strong className="text-yellow-300">Service Hours:</strong><br />
                  Monday - Friday: 8:00 AM - 6:00 PM<br />
                  Saturday: 9:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            {/* Right - Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6 bg-white/10 backdrop-blur-md p-4 sm:p-5 md:p-8 rounded-lg border border-yellow-300/30 shadow-2xl">
                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="name" className="text-xs sm:text-sm md:text-base font-semibold text-white">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/15 border-white/30 text-white placeholder:text-white/50 text-xs sm:text-sm md:text-base"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="email" className="text-xs sm:text-sm md:text-base font-semibold text-white">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/15 border-white/30 text-white placeholder:text-white/50 text-xs sm:text-sm md:text-base"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="phone" className="text-xs sm:text-sm md:text-base font-semibold text-white">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/15 border-white/30 text-white placeholder:text-white/50 text-xs sm:text-sm md:text-base"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="message" className="text-xs sm:text-sm md:text-base font-semibold text-white">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your project..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full resize-none bg-white/15 border-white/30 text-white placeholder:text-white/50 text-xs sm:text-sm md:text-base"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-semibold py-3 text-base"
                >
                  {loading ? (
                    <>
                      <Loader className="h-5 w-5 mr-2 animate-spin" />
                      Sending...
                    </>
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
