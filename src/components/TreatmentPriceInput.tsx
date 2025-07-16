"use client";
import { Input } from "@/components/ui/Input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/Select";
import { CURRENCIES } from "@/lib/currencies";
import { Controller, useFormContext } from "react-hook-form";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

interface TreatmentPriceInputProps {
  name: string; // ör: "treatments.0.price"
  currencyName: string; // ör: "treatments.0.currency"
  label?: string;
}

export const TreatmentPriceInput = ({ name, currencyName, label }: TreatmentPriceInputProps) => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-stretch">
      <div className="flex-1">
        {label && <label className="block text-sm font-medium mb-1">{label}</label>}
        <Controller
          name={name}
          control={control}
          defaultValue=""
          render={({ field }: { field: ControllerRenderProps<FieldValues, string> }) => (
            <Input
              {...field}
              type="number"
              min={0}
              step="0.01"
              placeholder="Fiyat"
              inputMode="decimal"
              className="w-full"
            />
          )}
        />
      </div>
      <div className="w-full sm:w-36">
        <label className="block text-sm font-medium mb-1 invisible sm:visible">Para Birimi</label>
        <Controller
          name={currencyName}
          control={control}
          defaultValue="EUR"
          render={({ field }: { field: ControllerRenderProps<FieldValues, string> }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  );
}; 