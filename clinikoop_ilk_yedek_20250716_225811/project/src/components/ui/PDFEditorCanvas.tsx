// PDFEditorCanvas: PDF şablonunun seçili sayfasını ve elementlerini gösteren canvas alanı.
// Eğer currentPage undefined/null ise kullanıcıya açıklama gösterir.
import React from 'react';

const PDFEditorCanvas = ({
  currentPage,
  selectedElement,
  onElementSelect,
  updateElementProperty,
  updateElementContent,
  onDeleteElement,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleCanvasClick,
  setIsDragging,
  setDragStart,
  setDragElement
}: any) => {
  if (!currentPage) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        Sayfa yüklenemedi
      </div>
    );
  }

  // Element içeriğini render et
  const renderElementContent = (element: any) => {
    switch (element.type) {
      case 'text':
        return <div className="w-full h-full flex items-center">{element.content}</div>;
      
      case 'image':
      case 'logo':
        return (
          <img 
            src={element.content} 
            alt={element.type}
            className="w-full h-full object-contain"
            draggable={false}
          />
        );
      
      case 'patient-info':
        return (
          <div className="w-full h-full p-3">
            <h4 
              className="font-bold mb-3"
              style={{
                fontSize: element.titleFontSize || 16,
                fontFamily: element.titleFontFamily || 'Arial',
                color: element.titleColor || '#1f2937',
                textAlign: element.titleAlignment || 'left'
              }}
            >
              {element.titleText || 'Hasta Bilgileri'}
            </h4>
            {element.patientData && (
              <div className="space-y-2">
                {element.patientFieldsVisibility?.name && (
                  <div className="flex">
                    <span 
                      className="font-medium mr-2"
                      style={{
                        fontSize: element.labelFontSize || 11,
                        fontFamily: element.labelFontFamily || 'Arial',
                        color: element.labelColor || '#6b7280'
                      }}
                    >
                      Ad:
                    </span>
                    <span 
                      style={{
                        fontSize: element.contentFontSize || 12,
                        fontFamily: element.contentFontFamily || 'Arial',
                        color: element.contentColor || '#374151'
                      }}
                    >
                      {element.patientData.name}
                    </span>
                  </div>
                )}
                {element.patientFieldsVisibility?.phone && (
                  <div className="flex">
                    <span 
                      className="font-medium mr-2"
                      style={{
                        fontSize: element.labelFontSize || 11,
                        fontFamily: element.labelFontFamily || 'Arial',
                        color: element.labelColor || '#6b7280'
                      }}
                    >
                      Telefon:
                    </span>
                    <span 
                      style={{
                        fontSize: element.contentFontSize || 12,
                        fontFamily: element.contentFontFamily || 'Arial',
                        color: element.contentColor || '#374151'
                      }}
                    >
                      {element.patientData.phone}
                    </span>
                  </div>
                )}
                {element.patientFieldsVisibility?.email && (
                  <div className="flex">
                    <span 
                      className="font-medium mr-2"
                      style={{
                        fontSize: element.labelFontSize || 11,
                        fontFamily: element.labelFontFamily || 'Arial',
                        color: element.labelColor || '#6b7280'
                      }}
                    >
                      E-posta:
                    </span>
                    <span 
                      style={{
                        fontSize: element.contentFontSize || 12,
                        fontFamily: element.contentFontFamily || 'Arial',
                        color: element.contentColor || '#374151'
                      }}
                    >
                      {element.patientData.email}
                    </span>
                  </div>
                )}
                {element.patientFieldsVisibility?.socialMedia && (
                  <div className="flex">
                    <span 
                      className="font-medium mr-2"
                      style={{
                        fontSize: element.labelFontSize || 11,
                        fontFamily: element.labelFontFamily || 'Arial',
                        color: element.labelColor || '#6b7280'
                      }}
                    >
                      Sosyal Medya:
                    </span>
                    <span 
                      style={{
                        fontSize: element.contentFontSize || 12,
                        fontFamily: element.contentFontFamily || 'Arial',
                        color: element.contentColor || '#374151'
                      }}
                    >
                      {element.patientData.socialMedia}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      
      case 'treatment-info':
        return (
          <div className="w-full h-full p-3">
            <h4 
              className="font-bold mb-3"
              style={{
                fontSize: element.titleFontSize || 16,
                fontFamily: element.titleFontFamily || 'Arial',
                color: element.titleColor || '#1f2937',
                textAlign: element.titleAlignment || 'left'
              }}
            >
              {element.titleText || 'Tedavi Bilgileri'}
            </h4>
            {element.treatmentData && (
              <div className="space-y-2">
                {element.treatmentFieldsVisibility?.doctor && (
                  <div className="flex">
                    <span 
                      className="font-medium mr-2"
                      style={{
                        fontSize: element.labelFontSize || 11,
                        fontFamily: element.labelFontFamily || 'Arial',
                        color: element.labelColor || '#6b7280'
                      }}
                    >
                      Doktor:
                    </span>
                    <span 
                      style={{
                        fontSize: element.contentFontSize || 12,
                        fontFamily: element.contentFontFamily || 'Arial',
                        color: element.contentColor || '#374151'
                      }}
                    >
                      {element.treatmentData.doctor}
                    </span>
                  </div>
                )}
                {element.treatmentFieldsVisibility?.treatments && (
                  <div className="flex">
                    <span 
                      className="font-medium mr-2"
                      style={{
                        fontSize: element.labelFontSize || 11,
                        fontFamily: element.labelFontFamily || 'Arial',
                        color: element.labelColor || '#6b7280'
                      }}
                    >
                      Tedaviler:
                    </span>
                    <span 
                      style={{
                        fontSize: element.contentFontSize || 12,
                        fontFamily: element.contentFontFamily || 'Arial',
                        color: element.contentColor || '#374151'
                      }}
                    >
                      {element.treatmentData.treatments?.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      
      case 'price-table':
        return (
          <div className="w-full h-full p-3">
            <h4 
              className="font-bold mb-3"
              style={{
                fontSize: element.titleFontSize || 18,
                fontFamily: element.titleFontFamily || 'Arial',
                color: element.titleColor || '#1f2937',
                textAlign: element.titleAlignment || 'center'
              }}
            >
              {element.titleText || 'Fiyat Tablosu'}
            </h4>
            {element.priceTableData && (
              <div className="space-y-2">
                {/* Tablo Başlığı */}
                <div 
                  className="flex font-medium text-xs"
                  style={{
                    backgroundColor: element.tableHeaderColor || '#f3f4f6',
                    borderBottom: `1px solid ${element.tableBorderColor || '#d1d5db'}`
                  }}
                >
                  {element.showTreatmentColumn && (
                    <div className="flex-1 p-1">Tedavi</div>
                  )}
                  {element.showDescriptionColumn && (
                    <div className="flex-1 p-1">Açıklama</div>
                  )}
                  {element.showPriceColumn && (
                    <div className="w-16 p-1 text-right">Fiyat</div>
                  )}
                  {element.showQuantityColumn && (
                    <div className="w-12 p-1 text-center">Adet</div>
                  )}
                  {element.showTotalColumn && (
                    <div className="w-16 p-1 text-right">Toplam</div>
                  )}
                </div>
                
                {/* Tablo İçeriği */}
                {element.priceTableData.map((item: any) => (
                  <div 
                    key={item.id} 
                    className="flex text-xs border-b"
                    style={{
                      borderColor: element.tableBorderColor || '#d1d5db'
                    }}
                  >
                    {element.showTreatmentColumn && (
                      <div 
                        className="flex-1 p-1"
                        style={{
                          fontSize: element.contentFontSize || 12,
                          fontFamily: element.contentFontFamily || 'Arial',
                          color: element.contentColor || '#374151'
                        }}
                      >
                        {item.treatment}
                      </div>
                    )}
                    {element.showDescriptionColumn && (
                      <div 
                        className="flex-1 p-1"
                        style={{
                          fontSize: element.contentFontSize || 12,
                          fontFamily: element.contentFontFamily || 'Arial',
                          color: element.contentColor || '#374151'
                        }}
                      >
                        {item.description}
                      </div>
                    )}
                    {element.showPriceColumn && (
                      <div 
                        className="w-16 p-1 text-right"
                        style={{
                          fontSize: element.contentFontSize || 12,
                          fontFamily: element.contentFontFamily || 'Arial',
                          color: element.contentColor || '#374151'
                        }}
                      >
                        {item.price} ₺
                      </div>
                    )}
                    {element.showQuantityColumn && (
                      <div 
                        className="w-12 p-1 text-center"
                        style={{
                          fontSize: element.contentFontSize || 12,
                          fontFamily: element.contentFontFamily || 'Arial',
                          color: element.contentColor || '#374151'
                        }}
                      >
                        {item.quantity}
                      </div>
                    )}
                    {element.showTotalColumn && (
                      <div 
                        className="w-16 p-1 text-right font-medium"
                        style={{
                          fontSize: element.contentFontSize || 12,
                          fontFamily: element.contentFontFamily || 'Arial',
                          color: element.contentColor || '#374151'
                        }}
                      >
                        {item.total} ₺
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Toplam ve KDV */}
                {element.showVAT && (
                  <div className="mt-3 pt-2 border-t">
                    <div className="flex justify-between text-xs">
                      <span>Ara Toplam:</span>
                      <span>{element.priceTableData.reduce((sum: number, item: any) => sum + item.total, 0)} ₺</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>KDV (%{element.vatRate}):</span>
                      <span>{Math.round(element.priceTableData.reduce((sum: number, item: any) => sum + item.total, 0) * (element.vatRate || 18) / 100)} ₺</span>
                    </div>
                    <div className="flex justify-between font-medium text-xs mt-1 pt-1 border-t">
                      <span>Genel Toplam:</span>
                      <span>{Math.round(element.priceTableData.reduce((sum: number, item: any) => sum + item.total, 0) * (1 + (element.vatRate || 18) / 100))} ₺</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      
      default:
        return <div className="w-full h-full flex items-center">{element.content}</div>;
    }
  };

  return (
    <div 
      className="relative bg-white shadow-lg mx-auto my-4" 
      style={{ width: currentPage.width || 1400, height: currentPage.height || 1000 }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleCanvasClick}
    >
      {currentPage.elements.map((element: any) => (
        <div
          key={element.id}
          className={`absolute cursor-move select-none ${
            selectedElement?.id === element.id
              ? 'ring-2 ring-blue-500 ring-offset-1' 
              : 'ring-1 ring-gray-300 hover:ring-2 hover:ring-blue-300'
          }`}
          style={{
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            fontSize: element.fontSize,
            fontFamily: element.fontFamily,
            color: element.color,
            opacity: element.opacity,
            transform: `rotate(${element.rotation}deg)`,
            zIndex: element.zIndex,
            textAlign: element.alignment,
            backgroundColor: element.backgroundColor || 'transparent',
            padding: '8px',
            borderRadius: '4px',
            userSelect: 'none',
            touchAction: 'none'
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            if (handleMouseDown) handleMouseDown(e, element);
          }}
          onClick={(e) => {
            e.stopPropagation();
            onElementSelect(element);
          }}
        >
          {renderElementContent(element)}
        </div>
      ))}
    </div>
  );
};

export default PDFEditorCanvas; 