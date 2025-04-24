
import { Loader } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner = ({ size = "md", className = "" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div 
      role="status" 
      className={`flex justify-center items-center ${className}`}
      aria-label="Chargement en cours"
    >
      <Loader 
        className={`animate-spin ${sizeClasses[size]} text-paritel-primary`} 
      />
    </div>
  );
};

export default LoadingSpinner;
