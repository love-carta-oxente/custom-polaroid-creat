
// This is a mock API for demonstration purposes
// In production, this would be replaced by actual server endpoints

import { toast } from "@/components/ui/use-toast";

// Mock database to store created sites
const createdSites = new Map();

export const generateUniqueId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const saveSiteData = (data: any) => {
  const siteId = generateUniqueId();
  createdSites.set(siteId, data);
  return siteId;
};

export const getSiteData = (siteId: string) => {
  return createdSites.get(siteId);
};

export const createMockPayment = (email: string, siteData: any) => {
  return new Promise<{ status: string; siteId: string; qrCode: string }>((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      try {
        const siteId = saveSiteData(siteData);
        // For a real implementation, you would generate this on the backend
        const qrCode = `https://api.qrserver.com/v1/create-qr-code/?data=https://your-app.com/view/${siteId}&size=200x200`;
        
        resolve({
          status: "approved",
          siteId,
          qrCode
        });
        
        toast({
          title: "Pagamento processado com sucesso!",
          description: "Seu site personalizado foi criado.",
        });
      } catch (error) {
        toast({
          title: "Erro ao processar pagamento",
          description: "Ocorreu um erro ao processar seu pagamento.",
          variant: "destructive",
        });
        
        resolve({
          status: "failed",
          siteId: "",
          qrCode: ""
        });
      }
    }, 2000);
  });
};
