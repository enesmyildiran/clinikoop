"use client"

import React, { useState } from "react";
import { Input } from "./Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import { Button } from "./Button";
import { Card, CardContent } from "./Card";
import { cn } from "@/lib/utils";

interface ToothPricing {
  toothNumber: number;
  price: number;
  currency: string;
  vatRate: number;
  vatAmount: number;
  totalPrice: number;
}

interface ToothPricingInputProps {
  selectedTeeth: number[];
  toothPricing: ToothPricing[];
  onToothPricingChange: (pricing: ToothPricing[]) => void;
  className?: string;
}

const VAT_RATES = [
  { value: 0, label: "KDV Yok (0%)" },
  { value: 1, label: "KDV %1" },
  { value: 8, label: "KDV %8" },
  { value: 18, label: "KDV %18" },
  { value: 20, label: "KDV %20" },
];

const CURRENCIES = [
  { value: "TRY", label: "TRY (₺)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
];

export const ToothPricingInput: React.FC<ToothPricingInputProps> = ({
  selectedTeeth,
  toothPricing,
  onToothPricingChange,
  className,
}) => {
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkCurrency, setBulkCurrency] = useState("TRY");
  const [bulkVatRate, setBulkVatRate] = useState(18);

  // KDV hesaplama fonksiyonu (fiyat her zaman KDV hariç olarak girilir)
  const calculateVAT = (price: number, vatRate: number) => {
    const vatAmount = (price * vatRate) / 100;
    return parseFloat(vatAmount.toFixed(2));
  };

  // Toplam fiyat hesaplama (KDV hariç + KDV tutarı)
  const calculateTotalPrice = (price: number, vatAmount: number) => {
    const total = price + vatAmount;
    return parseFloat(total.toFixed(2));
  };

  // Diş fiyatını güncelle
  const updateToothPrice = (toothNumber: number, field: keyof ToothPricing, value: any) => {
    const updatedPricing = toothPricing.map(tp => {
      if (tp.toothNumber === toothNumber) {
        const updated = { ...tp, [field]: value };
        
        // KDV hesaplamalarını güncelle
        if (field === 'price' || field === 'vatRate') {
          updated.vatAmount = calculateVAT(updated.price, updated.vatRate);
          updated.totalPrice = calculateTotalPrice(updated.price, updated.vatAmount);
        }
        
        return updated;
      }
      return tp;
    });
    
    onToothPricingChange(updatedPricing);
  };

  // Toplu fiyat uygula
  const applyBulkPrice = () => {
    const price = parseFloat(bulkPrice) || 0;
    if (price <= 0) return;

    const vatAmount = calculateVAT(price, bulkVatRate);
    const totalPrice = calculateTotalPrice(price, vatAmount);

    const updatedPricing = toothPricing.map(tp => ({
      ...tp,
      price,
      currency: bulkCurrency,
      vatRate: bulkVatRate,
      vatAmount,
      totalPrice,
    }));

    onToothPricingChange(updatedPricing);
    setBulkPrice(""); // Input'u temizle
  };

  // Seçilen dişler için fiyatlandırma oluştur
  React.useEffect(() => {
    const newPricing: ToothPricing[] = selectedTeeth.map(toothNumber => {
      const existing = toothPricing.find(tp => tp.toothNumber === toothNumber);
      if (existing) return existing;
      
      return {
        toothNumber,
        price: 0,
        currency: 'TRY',
        vatRate: 18,
        vatAmount: 0,
        totalPrice: 0,
      };
    });
    
    // Kaldırılan dişlerin fiyatlandırmasını sil
    const filteredPricing = toothPricing.filter(tp => selectedTeeth.includes(tp.toothNumber));
    
    if (newPricing.length !== filteredPricing.length) {
      onToothPricingChange(newPricing);
    }
  }, [selectedTeeth]);

  if (selectedTeeth.length === 0) {
    return (
      <div className={cn("text-center py-8 text-gray-500", className)}>
        Önce diş seçimi yapın
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">
          Diş Bazında Fiyatlandırma
        </h4>
        <span className="text-xs text-gray-500">
          {selectedTeeth.length} diş seçildi
        </span>
      </div>

      {/* Toplu Fiyat Ekleme */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <CardContent className="p-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-blue-900">Toplu Fiyat Ekle:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-blue-700 mb-1">
                Diş Başına Fiyat
              </label>
              <Input
                type="number"
                value={bulkPrice}
                onChange={(e) => setBulkPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-blue-700 mb-1">
                Para Birimi
              </label>
              <Select value={bulkCurrency} onValueChange={setBulkCurrency}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(currency => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium text-blue-700 mb-1">
                KDV Oranı
              </label>
              <Select value={bulkVatRate.toString()} onValueChange={(value) => setBulkVatRate(parseInt(value))}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VAT_RATES.map(rate => (
                    <SelectItem key={rate.value} value={rate.value.toString()}>
                      {rate.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={applyBulkPrice}
                disabled={!bulkPrice || parseFloat(bulkPrice) <= 0}
                className="w-full text-sm"
                size="sm"
              >
                Toplu Uygula
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diş Fiyatlandırma Listesi - Scroll ile sınırlı */}
      <div className="max-h-96 overflow-y-auto border rounded-lg">
        <div className="grid gap-2 p-2">
          {toothPricing.map((pricing) => (
            <Card key={pricing.toothNumber} className="p-3">
              <CardContent className="p-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">
                      {pricing.toothNumber}
                    </div>
                    <span className="font-medium">Diş {pricing.toothNumber}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">
                      {pricing.totalPrice.toFixed(2)} {pricing.currency}
                    </div>
                    {pricing.vatAmount > 0 && (
                      <div className="text-xs text-gray-500">
                        KDV: {pricing.vatAmount.toFixed(2)} {pricing.currency}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Fiyat */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Fiyat (KDV Hariç)
                    </label>
                    <Input
                      type="number"
                      value={pricing.price}
                      onChange={(e) => updateToothPrice(pricing.toothNumber, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="text-sm"
                    />
                  </div>

                  {/* Para Birimi */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Para Birimi
                    </label>
                    <Select
                      value={pricing.currency}
                      onValueChange={(value) => updateToothPrice(pricing.toothNumber, 'currency', value)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map(currency => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* KDV Oranı */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      KDV Oranı
                    </label>
                    <Select
                      value={pricing.vatRate.toString()}
                      onValueChange={(value) => updateToothPrice(pricing.toothNumber, 'vatRate', parseInt(value))}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VAT_RATES.map(rate => (
                          <SelectItem key={rate.value} value={rate.value.toString()}>
                            {rate.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Toplam Özeti */}
      {toothPricing.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-green-900">Toplam Tutar (KDV Dahil):</span>
              <span className="text-xl font-bold text-green-900">
                {parseFloat(toothPricing.reduce((sum, tp) => sum + tp.totalPrice, 0).toFixed(2))} {toothPricing[0]?.currency || 'TRY'}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-green-700">Toplam KDV:</span>
              <span className="text-sm font-medium text-green-700">
                {parseFloat(toothPricing.reduce((sum, tp) => sum + tp.vatAmount, 0).toFixed(2))} {toothPricing[0]?.currency || 'TRY'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 