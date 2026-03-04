import { useState } from "react";
import { X } from "lucide-react";

interface AnnouncementBarProps {
  message: string;
  onClose?: () => void;
}

export function AnnouncementBar({ message, onClose }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-primary text-primary-foreground py-3 px-4 relative overflow-hidden border-b border-border/20">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex-1 min-w-0 mr-4">
          <div className="animate-marquee whitespace-nowrap">
            <span className="text-sm font-medium">{message}</span>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20 cursor-pointer"
          aria-label="Close announcement"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}