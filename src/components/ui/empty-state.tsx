
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import getText from "@/utils/i18n";

interface EmptyStateProps {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

const EmptyState = ({ 
  title = getText("ui.emptyState.title"), 
  message = getText("ui.emptyState.message"),
  action,
  icon
}: EmptyStateProps) => {
  return (
    <div 
      className="flex flex-col items-center justify-center p-8 text-center space-y-4"
      role="alert"
      aria-label={title}
    >
      <div className="h-12 w-12 text-gray-400">
        {icon || <AlertTriangle className="h-full w-full" />}
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {message}
        </p>
      </div>
      {action && (
        <Button 
          onClick={action.onClick}
          className="mt-4"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
