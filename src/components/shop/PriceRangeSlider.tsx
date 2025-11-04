import { Slider } from "@/components/ui/slider";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export default function PriceRangeSlider({ min, max, value, onChange }: PriceRangeSliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">KES {value[0].toLocaleString()}</span>
        <span className="text-muted-foreground">KES {value[1].toLocaleString()}</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={50}
        value={value}
        onValueChange={onChange}
        className="w-full"
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Min: KES {min}</span>
        <span>Max: KES {max}</span>
      </div>
    </div>
  );
}
