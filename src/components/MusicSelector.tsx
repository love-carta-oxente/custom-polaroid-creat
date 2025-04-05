
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface MusicSelectorProps {
  currentMusic: string;
  onMusicChange: (url: string) => void;
}

const MusicSelector = ({ currentMusic, onMusicChange }: MusicSelectorProps) => {
  const [musicUrl, setMusicUrl] = useState(currentMusic);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMusicUrl(e.target.value);
  };

  const handleApply = () => {
    if (!musicUrl.trim()) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida para o áudio",
        variant: "destructive"
      });
      return;
    }
    
    onMusicChange(musicUrl);
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
    
    toast({
      title: "Música atualizada",
      description: "A música foi atualizada com sucesso!"
    });
  };

  const togglePlay = () => {
    if (!audio) {
      const newAudio = new Audio(currentMusic);
      setAudio(newAudio);
      newAudio.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        toast({
          title: "Erro ao reproduzir",
          description: "Não foi possível reproduzir este áudio",
          variant: "destructive"
        });
      });
    } else {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Input
          value={musicUrl}
          onChange={handleUrlChange}
          placeholder="URL da música (formato MP3)"
          className="flex-1"
        />
        <Button onClick={handleApply} size="sm">
          Aplicar
        </Button>
      </div>
      
      <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
        <span className="text-sm truncate max-w-[200px]">
          {currentMusic.split('/').pop()?.split('?')[0] || "Música selecionada"}
        </span>
        <Button onClick={togglePlay} size="sm" variant="outline">
          {isPlaying ? "Pausar" : "Tocar"}
        </Button>
      </div>
    </div>
  );
};

export default MusicSelector;
