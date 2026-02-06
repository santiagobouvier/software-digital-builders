import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DollarSign, Loader2, Check } from "lucide-react";

interface ExchangeRateEditorProps {
  rate: number;
  onUpdate: (newRate: number) => Promise<boolean>;
}

export const ExchangeRateEditor = ({ rate, onUpdate }: ExchangeRateEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newRate, setNewRate] = useState(rate.toString());
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const parsed = parseFloat(newRate);
    if (isNaN(parsed) || parsed <= 0) return;
    
    setIsSaving(true);
    const success = await onUpdate(parsed);
    setIsSaving(false);
    
    if (success) {
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 font-mono">
          <DollarSign className="h-4 w-4" />
          1 USD = {rate} UYU
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="exchange-rate">Cotización USD → UYU</Label>
            <p className="text-xs text-muted-foreground">
              Usada para convertir precios entre monedas
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              id="exchange-rate"
              type="number"
              min="1"
              step="0.01"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              className="font-mono"
            />
            <Button 
              size="icon" 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
