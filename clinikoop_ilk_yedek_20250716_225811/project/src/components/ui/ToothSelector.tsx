"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface ToothSelectorProps {
  selectedTeeth: number[];
  onTeethChange: (teeth: number[]) => void;
  className?: string;
}

// FDI numaralandırması: 11-18 (üst sağ), 21-28 (üst sol), 31-38 (alt sol), 41-48 (alt sağ)
const TEETH_GRID = [
  // Üst çene (sağdan sola)
  [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  // Alt çene (sağdan sola) 
  [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
];

export const ToothSelector: React.FC<ToothSelectorProps> = ({
  selectedTeeth,
  onTeethChange,
  className,
}) => {
  const toggleTooth = (toothNumber: number) => {
    const newSelection = selectedTeeth.includes(toothNumber)
      ? selectedTeeth.filter(t => t !== toothNumber)
      : [...selectedTeeth, toothNumber].sort((a, b) => a - b);
    onTeethChange(newSelection);
  };

  const selectAll = () => {
    // FDI: 11-18, 21-28, 31-38, 41-48
    const allTeeth = [
      ...Array.from({ length: 8 }, (_, i) => 11 + i), // 11-18
      ...Array.from({ length: 8 }, (_, i) => 21 + i), // 21-28
      ...Array.from({ length: 8 }, (_, i) => 31 + i), // 31-38
      ...Array.from({ length: 8 }, (_, i) => 41 + i), // 41-48
    ];
    onTeethChange(allTeeth);
  };

  const clearAll = () => {
    onTeethChange([]);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Kontrol butonları */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={selectAll}
          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
        >
          Tümünü Seç
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          Temizle
        </button>
        <span className="text-xs text-gray-500 ml-auto">
          Seçilen: {selectedTeeth.length}
        </span>
      </div>

      {/* Diş haritası */}
      <div className="bg-white border rounded-lg p-4">
        <div className="text-center text-sm font-medium text-gray-600 mb-3">
          Üst Çene
        </div>
        
        {/* Üst çene */}
        <div className="grid grid-cols-16 gap-1 mb-4">
          {TEETH_GRID[0].map((toothNumber) => (
            <button
              key={toothNumber}
              type="button"
              onClick={() => toggleTooth(toothNumber)}
              className={cn(
                "w-8 h-8 rounded-full border-2 text-xs font-medium transition-all hover:scale-105",
                selectedTeeth.includes(toothNumber)
                  ? "bg-blue-500 border-blue-600 text-white shadow-md"
                  : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
              )}
            >
              {toothNumber}
            </button>
          ))}
        </div>

        <div className="text-center text-sm font-medium text-gray-600 mb-3">
          Alt Çene
        </div>
        
        {/* Alt çene */}
        <div className="grid grid-cols-16 gap-1">
          {TEETH_GRID[1].map((toothNumber) => (
            <button
              key={toothNumber}
              type="button"
              onClick={() => toggleTooth(toothNumber)}
              className={cn(
                "w-8 h-8 rounded-full border-2 text-xs font-medium transition-all hover:scale-105",
                selectedTeeth.includes(toothNumber)
                  ? "bg-blue-500 border-blue-600 text-white shadow-md"
                  : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
              )}
            >
              {toothNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Seçilen dişler listesi */}
      {selectedTeeth.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Seçilen Dişler:
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedTeeth.map((tooth) => (
              <span
                key={tooth}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tooth}
                <button
                  type="button"
                  onClick={() => toggleTooth(tooth)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 