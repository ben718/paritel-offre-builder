
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

const ErrorState = ({ 
  title = "Une erreur est survenue", 
  message, 
  onRetry 
}: ErrorStateProps) => {
  return (
    <div 
      className="flex flex-col items-center justify-center p-8 text-center space-y-4"
      role="alert"
      aria-live="assertive"
    >
      <XCircle className="h-12 w-12 text-destructive" />
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="mt-4"
        >
          Réessayer
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
