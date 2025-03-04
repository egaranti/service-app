const LeftSidebar = ({
  draggedType,
  onDragStart,
  onDragEnd,
  fieldTypes: FIELD_TYPES,
}) => {
  const getDescription = (type) => {
    switch (type) {
      case "TEXT":
        return "Metin girişi için bir alan ekler";
      case "NUMBER":
        return "Sayısal değer girişi için bir alan ekler";
      case "DROPDOWN":
        return "Açılır listeden seçim yapılmasını sağlar";
      case "CHECKBOX":
        return "İşaretlenebilir onay kutusu ekler";
      case "RADIO":
        return "Tek seçimlik radio düğmeleri ekler";
      case "TEXTAREA":
        return "Çok satırlı metin girişi alanı ekler";
      case "DATE":
        return "Tarih girişi için bir alan ekler";
      case "ASSIGNEE":
        return "Personel seçimi için bir alan ekler";
      case "FILE":
        return "Dosya girişi için bir alan ekler";
      case "SPARE_PART":
        return "Yedek parça seçimi için bir alan";
      default:
        return "";
    }
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <h2 className="p-4 text-lg font-semibold">Form Elemanları</h2>
      <p className="px-3 text-sm text-gray-600">
        Sürükle ve bırak ile alan ekleyin
      </p>
      <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto p-3">
        {FIELD_TYPES.map(({ type, icon: Icon, label }) => (
          <div
            key={type}
            draggable
            onDragStart={() => onDragStart(type)}
            onDragEnd={onDragEnd}
            className={`flex cursor-move flex-col gap-1 rounded-lg border p-3 hover:bg-gray-50 ${
              draggedType === type ? "bg-blue-50" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-gray-500" />
              <span className="font-medium">{label}</span>
            </div>
            <p className="text-sm text-gray-500">{getDescription(type)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftSidebar;
