
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { MERCADO_PAGO_PUBLIC_KEY, initializeMercadoPago, createPreference, saveSiteData } from "@/lib/mercadoPago";
import { Wallet } from "@mercadopago/sdk-react";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteData: {
    title: string;
    recipientName: string;
    images: string[];
    captions: string[];
    musicUrl: string;
  };
}

const PaymentModal = ({ open, onOpenChange, siteData }: PaymentModalProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      // Inicializar Mercado Pago quando o modal for aberto
      initializeMercadoPago();
    }
  }, [open]);

  const handleCreatePreference = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Cria a preferência de pagamento no Mercado Pago
      const title = `Site personalizado: ${siteData.title} ${siteData.recipientName}`;
      const price = 49.90;
      
      const id = await createPreference(title, price, email);
      setPreferenceId(id);
    } catch (error) {
      console.error("Erro ao criar preferência:", error);
      toast({
        title: "Erro ao processar pagamento",
        description: "Não foi possível criar a preferência de pagamento",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Gerar um ID único para o site
      const siteId = crypto.randomUUID().replace(/-/g, '');
      
      // Salvar os dados do site no banco de dados
      await saveSiteData({
        ...siteData,
        email,
        siteId,
        createdAt: new Date().toISOString()
      }, siteId);
      
      // Redirecionar para a página de sucesso
      navigate(`/payment-success/${siteId}`);
    } catch (error) {
      console.error("Erro ao processar pagamento bem-sucedido:", error);
      toast({
        title: "Erro ao finalizar pagamento",
        description: "Ocorreu um erro ao processar seu pagamento. Entre em contato com o suporte.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar pedido</DialogTitle>
          <DialogDescription>
            Complete o pagamento para salvar e compartilhar seu site personalizado.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">
              Você receberá o link do site personalizado neste email.
            </p>
          </div>
          
          <div className="border rounded p-3">
            <div className="flex justify-between mb-1">
              <span className="font-medium">Produto</span>
              <span className="font-medium">Valor</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Site de proposta personalizado</span>
              <span>R$ 49,90</span>
            </div>
            <div className="mt-3 pt-3 border-t flex justify-between font-bold">
              <span>Total</span>
              <span>R$ 49,90</span>
            </div>
          </div>
          
          {preferenceId ? (
            <div className="flex justify-center w-full mt-4">
              <Wallet 
                initialization={{ preferenceId: preferenceId }}
                onReady={() => {}} 
                onError={() => toast({ 
                  title: "Erro no processamento", 
                  description: "Ocorreu um erro ao carregar as opções de pagamento", 
                  variant: "destructive" 
                })}
                onSubmit={handlePaymentSuccess}
              />
            </div>
          ) : null}
        </div>
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          {!preferenceId && (
            <Button
              type="button"
              disabled={isProcessing}
              onClick={handleCreatePreference}
            >
              {isProcessing ? "Processando..." : "Continuar para pagamento"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
