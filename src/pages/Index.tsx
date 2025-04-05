
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import PolaroidPreview from "@/components/PolaroidPreview";
import MusicSelector from "@/components/MusicSelector";
import ImageUploader from "@/components/ImageUploader";
import PaymentModal from "@/components/PaymentModal";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

const Index = () => {
  const [title, setTitle] = useState("ACEITA CASAR COMIGO");
  const [recipientName, setRecipientName] = useState("[NOME]");
  const [polaroidImages, setPolaroidImages] = useState([
    "https://i.ibb.co/0V2wzJBC/d7edbf5621314f4dbfe8bf599542d193-1713580331.jpg",
    "https://i.ibb.co/VWcch2c2/Picsart-25-04-04-19-51-57-095.jpg"
  ]);
  const [polaroidCaptions, setPolaroidCaptions] = useState([
    "Memória especial",
    "Memória especial"
  ]);
  const [musicUrl, setMusicUrl] = useState("https://firebasestorage.googleapis.com/v0/b/gamer-06.appspot.com/o/enrolados.mp3?alt=media&token=6a0df9ce-3cba-4a08-bce3-931b4cdffd19");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleImageChange = (index: number, newUrl: string) => {
    const newImages = [...polaroidImages];
    newImages[index] = newUrl;
    setPolaroidImages(newImages);
  };

  const handleCaptionChange = (index: number, newCaption: string) => {
    const newCaptions = [...polaroidCaptions];
    newCaptions[index] = newCaption;
    setPolaroidCaptions(newCaptions);
  };

  const handleSaveAndPay = () => {
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Crie sua Proposta Personalizada</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Personalize seu pedido especial com fotos, música e texto para criar um momento inesquecível.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Panel */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Heart className="mr-2 h-5 w-5" /> Personalizações
                </h2>
              </div>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título
                    </label>
                    <Input 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      placeholder="Digite o título"
                      className="border-red-200 focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome da pessoa
                    </label>
                    <Input 
                      value={recipientName} 
                      onChange={(e) => setRecipientName(e.target.value)} 
                      placeholder="Nome da pessoa especial"
                      className="border-red-200 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Polaroids
                    </label>
                    {polaroidImages.map((image, index) => (
                      <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Foto {index + 1}</h3>
                        <ImageUploader 
                          currentImage={image}
                          onImageChange={(url) => handleImageChange(index, url)}
                          index={index}
                        />
                        <Textarea 
                          value={polaroidCaptions[index]} 
                          onChange={(e) => handleCaptionChange(index, e.target.value)}
                          placeholder="Legenda da foto"
                          className="mt-3 border-red-200 focus:border-red-500"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Música
                    </label>
                    <MusicSelector 
                      currentMusic={musicUrl}
                      onMusicChange={setMusicUrl}
                    />
                  </div>

                  <Button 
                    onClick={handleSaveAndPay} 
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                  >
                    Salvar e Pagar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 overflow-hidden h-full">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4">
                <h2 className="text-2xl font-bold text-white">Preview</h2>
              </div>
              <CardContent className="p-0">
                <PolaroidPreview 
                  title={`${title} ${recipientName}`}
                  images={polaroidImages}
                  captions={polaroidCaptions}
                  musicUrl={musicUrl}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PaymentModal 
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        siteData={{
          title,
          recipientName,
          images: polaroidImages,
          captions: polaroidCaptions,
          musicUrl
        }}
      />
    </div>
  );
};

export default Index;
