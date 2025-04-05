
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { getSiteData } from "@/mockApi";
import { Copy, ExternalLink, Check, Share2 } from "lucide-react";

const PaymentSuccess = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const [siteUrl, setSiteUrl] = useState<string>(`${window.location.origin}/view/${siteId}`);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate QR code for the site URL
    if (siteId) {
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(siteUrl)}&size=200x200`);
      setLoading(false);
    }
  }, [siteId, siteUrl]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(siteUrl).then(
      () => {
        setCopied(true);
        toast({
          title: "Link copiado!",
          description: "O link foi copiado para sua área de transferência"
        });
        
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      },
      (err) => {
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o link",
          variant: "destructive"
        });
      }
    );
  };

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "Minha proposta especial",
        text: "Veja minha proposta personalizada!",
        url: siteUrl
      })
      .then(() => {
        toast({
          title: "Compartilhado com sucesso!",
          description: "Proposta compartilhada em seu dispositivo"
        });
      })
      .catch((error) => {
        console.error("Erro ao compartilhar:", error);
      });
    } else {
      copyToClipboard();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800">
        <div className="text-white text-2xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800 p-4">
      <Card className="max-w-md w-full border-0 shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
          <CardTitle className="flex items-center">
            <Check className="mr-2 h-6 w-6" /> Pagamento concluído com sucesso!
          </CardTitle>
          <CardDescription className="text-white/80">
            Seu pedido personalizado está pronto para ser compartilhado!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="flex justify-center bg-white p-4 rounded-lg">
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              className="w-48 h-48"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="site-url" className="text-sm font-medium">
              Link do seu site personalizado:
            </label>
            <div className="flex space-x-2">
              <Input 
                id="site-url"
                value={siteUrl} 
                readOnly 
                className="flex-1"
              />
              <Button onClick={copyToClipboard} size="icon" variant="outline" className="w-10 h-10">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md text-sm">
            <p className="font-medium mb-2">Instruções:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Compartilhe o link ou QR code com a pessoa especial</li>
              <li>Ao abrir o site, clique para iniciar a música</li>
              <li>Clique no texto "clique aqui" para animar o modelo 3D</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between bg-gray-50 p-6">
          <Link to="/">
            <Button variant="outline">Voltar ao início</Button>
          </Link>
          <div className="flex space-x-2">
            <Button onClick={shareLink} className="flex items-center">
              <Share2 className="mr-1 h-4 w-4" /> Compartilhar
            </Button>
            <Link to={`/view/${siteId}`} target="_blank">
              <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 flex items-center">
                <ExternalLink className="mr-1 h-4 w-4" /> Visualizar
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
