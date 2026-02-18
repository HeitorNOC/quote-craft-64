import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Copy, Mail } from 'lucide-react';
import { useState } from 'react';

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { estimateId?: string } | null;
  const estimateId = state?.estimateId || `EST-${Date.now()}`;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(estimateId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/LogoJD.JPG" alt="JD Logo" className="h-16 w-auto" />
        </div>

        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-20 h-20 text-green-500 animate-bounce" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Orçamento Enviado!
          </h1>
          <p className="text-gray-600">
            Seu orçamento foi confirmado com sucesso
          </p>
        </div>

        {/* Confirmation Card */}
        <Card className="p-6 mb-6 border-2 border-green-200 bg-white">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">ID de Confirmação</p>
              <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg border border-green-200">
                <code className="text-sm font-mono font-bold text-green-700 flex-1">
                  {estimateId}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 hover:bg-green-200 rounded transition-colors"
                  title="Copiar ID"
                >
                  <Copy className="w-4 h-4 text-green-600" />
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-600 mt-1">✓ Copiado!</p>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Confirme seu Email
                  </p>
                  <p className="text-xs text-blue-800 mt-1">
                    Você receberá um link de confirmação por email. Faça login para acompanhar seu orçamento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="space-y-3 mb-6">
          <Card className="p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-2">Próximos Passos</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ Seu orçamento foi registrado</li>
              <li>✓ Você receberá um email de confirmação</li>
              <li>✓ Um consultor entrará em contato em breve</li>
            </ul>
          </Card>

          <Card className="p-4 bg-yellow-50 border border-yellow-200">
            <p className="text-xs text-yellow-800">
              ⏱️ Geralmente respondemos em até 2 horas durante o horário comercial.
            </p>
          </Card>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/')}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            ← Voltar para Início
          </Button>

          <a
            href={`mailto:?subject=Orçamento%20Quote%20Craft&body=Meu%20ID%20de%20confirmação:%20${estimateId}`}
            className="block"
          >
            <Button variant="outline" className="w-full">
              <Mail className="w-4 h-4 mr-2" />
              Compartilhar por Email
            </Button>
          </a>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            Dúvidas? Contate suporte em{' '}
            <a
              href="mailto:support@quotecraft.com"
              className="text-blue-600 hover:underline"
            >
              support@quotecraft.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
