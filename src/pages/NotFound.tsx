
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800">
      <div className="text-center bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
          <span className="text-5xl">🤔</span>
        </div>
        <h1 className="text-5xl font-bold mb-4 text-red-600">404</h1>
        <p className="text-xl text-gray-700 mb-6">
          Página não encontrada
        </p>
        <p className="text-gray-500 mb-8">
          A página que você está procurando pode ter sido removida ou está temporariamente indisponível.
        </p>
        <Link to="/">
          <Button variant="default" className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Voltar à página inicial
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
