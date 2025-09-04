import { useEffect, useState } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

interface InventoryAlertProps {
  productName: string;
  remaining: number;
  threshold?: number;
}

export default function InventoryAlert({ 
  productName, 
  remaining, 
  threshold = 5 
}: InventoryAlertProps) {
  const { isEnabled } = useFeatureFlag('bit_2_fomo');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isEnabled && remaining <= threshold) {
      setVisible(true);
    }
  }, [isEnabled, remaining, threshold]);

  if (!isEnabled || !visible || remaining > threshold) return null;

  const urgencyLevel = remaining <= 2 ? 'critical' : remaining <= threshold ? 'low' : 'normal';
  const bgColor = urgencyLevel === 'critical' ? 'bg-red-500' : 'bg-orange-500';

  return (
    <div className={`${bgColor} text-white px-3 py-2 rounded-md flex items-center gap-2 animate-pulse-glow`}>
      <AlertTriangle className="h-4 w-4" />
      <span className="text-sm font-medium">
        Only {remaining} left in stock!
      </span>
      <Clock className="h-4 w-4 animate-urgent-bounce" />
    </div>
  );
}