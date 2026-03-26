import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, CalendarCheck, Copy, Home, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { estimateId?: string; type?: 'schedule' } | null;
  const estimateId = state?.estimateId || `EST-${Date.now()}`;
  const isSchedule = state?.type === 'schedule';
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(estimateId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/LogoJD.JPG"
            alt="JD Logo"
            className="h-12 sm:h-16 w-auto cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
            title="Back to Home"
            style={{ borderRadius: 999 }}
          />
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            {isSchedule ? (
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-full scale-150 animate-ping opacity-30" />
                <CalendarCheck className="w-14 h-14 sm:w-20 sm:h-20 text-primary relative z-10" />
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-green-400/20 rounded-full scale-150 animate-ping opacity-30" />
                <CheckCircle className="w-14 h-14 sm:w-20 sm:h-20 text-green-500 relative z-10" />
              </div>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
            {isSchedule ? 'Visita Agendada!' : 'Orçamento Enviado!'}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {isSchedule
              ? 'Entraremos em contato para confirmar o horário da visita.'
              : 'Seu orçamento foi registrado com sucesso.'}
          </p>
        </div>

        {/* Confirmation ID */}
        <Card className="p-4 sm:p-5 mb-4 border-2 border-secondary/30 bg-card">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">
            Número de Confirmação
          </p>
          <div className="flex items-center gap-2 bg-secondary/10 px-3 py-2.5 rounded-lg border border-secondary/20">
            <code className="text-sm sm:text-base font-mono font-bold text-secondary flex-1 tracking-wide">
              {estimateId}
            </code>
            <button
              onClick={copyToClipboard}
              className="p-2 hover:bg-secondary/20 rounded-md transition-colors flex-shrink-0"
              title="Copiar ID"
              aria-label="Copiar ID de confirmação"
            >
              <Copy className="w-4 h-4 text-secondary" />
            </button>
          </div>
          {copied && (
            <p className="text-xs text-green-600 mt-1.5 font-medium">✓ Copiado para a área de transferência!</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Guarde este número para acompanhar seu pedido.
          </p>
        </Card>

        {/* Next Steps */}
        <Card className="p-4 sm:p-5 mb-4 bg-card">
          <h3 className="font-display font-semibold text-foreground mb-3 text-sm sm:text-base">
            {isSchedule ? 'O que acontece agora?' : 'Próximos Passos'}
          </h3>
          <ul className="space-y-2.5">
            {isSchedule ? (
              <>
                <li className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span className="text-primary font-bold mt-0.5 flex-shrink-0">1.</span>
                  Nossa equipe analisará seu pedido e entrará em contato em até 2 horas.
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span className="text-primary font-bold mt-0.5 flex-shrink-0">2.</span>
                  Agendaremos a visita técnica no horário mais conveniente para você.
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span className="text-primary font-bold mt-0.5 flex-shrink-0">3.</span>
                  Após medir os ambientes, enviaremos seu orçamento detalhado.
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Orçamento registrado com sucesso.
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Nossa equipe analisará sua solicitação em breve.
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Um consultor entrará em contato para confirmar detalhes e agendar a visita.
                </li>
              </>
            )}
          </ul>
        </Card>

        {/* Response time notice */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/10 border border-secondary/20 mb-6">
          <span className="text-secondary text-base flex-shrink-0">⏱️</span>
          <p className="text-xs text-foreground/70">
            Respondemos em até <strong className="text-foreground">2 horas</strong> durante o horário comercial
            (Seg–Sex 8h–18h, Sáb 9h–16h).
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/')}
            className="w-full gap-2 text-sm sm:text-base"
            size="lg"
          >
            <Home className="w-4 h-4" />
            Voltar para o Início
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/contact')}
            className="w-full gap-2 text-sm sm:text-base border-2"
            size="lg"
          >
            Falar com a Equipe
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} JD Flooring & Cleaning Service
        </p>
      </div>
    </div>
  );
}
