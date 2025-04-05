
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";

interface ImageUploaderProps {
  currentImage: string;
  onImageChange: (url: string) => void;
  index: number;
}

const ImageUploader = ({ currentImage, onImageChange, index }: ImageUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState(currentImage);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione apenas arquivos de imagem",
        variant: "destructive"
      });
      return;
    }

    // Verificar tamanho do arquivo (limite de 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB",
        variant: "destructive"
      });
      return;
    }

    // Criar URL para preview
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    onImageChange(fileUrl);
    
    toast({
      title: "Imagem carregada",
      description: `A imagem ${index + 1} foi atualizada com sucesso!`
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg shadow-md">
        <img 
          src={previewUrl} 
          alt={`Polaroid ${index + 1}`} 
          className="w-full h-40 object-cover rounded-md shadow-sm mb-3"
        />
        
        <div className="flex items-center justify-center w-full">
          <label htmlFor={`image-upload-${index}`} className="w-full cursor-pointer">
            <div className="flex flex-col items-center justify-center pt-3 pb-2">
              <Upload className="w-6 h-6 text-red-600 mb-1" />
              <p className="text-xs font-medium text-red-600">Selecionar imagem</p>
            </div>
            <input 
              id={`image-upload-${index}`} 
              type="file"
              className="hidden"
              accept="image/*" 
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
