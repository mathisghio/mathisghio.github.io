import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ background: '#08090E' }}>
      <Card className="w-full max-w-lg mx-4 shadow-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(14,165,233,0.15)' }}>
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <AlertCircle className="h-16 w-16" style={{ color: '#0EA5E9' }} />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#F1F5F9' }}>404</h1>
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#94A3B8' }}>
            Page Not Found
          </h2>
          <p className="mb-8" style={{ color: '#94A3B8' }}>
            Sorry, the page you are looking for doesn't exist.
          </p>
          <Button
            onClick={handleGoHome}
            style={{ background: 'linear-gradient(135deg, #0EA5E9, #0284C7)', color: 'white' }}
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
