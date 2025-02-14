import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@egaranti/components";

const LeftSidebar = ({
  draggedType,
  onDragStart,
  onDragEnd,
  fieldTypes: FIELD_TYPES,
}) => {
  return (
    <div className="flex w-64 flex-col gap-2 border-r bg-white p-4">
      <h2 className="mb-4 text-lg font-semibold">Form Elemanları</h2>
      <div className="space-y-2">
        {FIELD_TYPES.map(({ type, icon: Icon, label }) => (
          <TooltipProvider delayDuration={10} key={type}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  draggable
                  onDragStart={() => onDragStart(type)}
                  onDragEnd={onDragEnd}
                  className={`flex cursor-move items-center gap-3 rounded p-2 hover:bg-gray-100 ${
                    draggedType === type ? "bg-blue-100" : ""
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent align="right">
                {type === "TEXT" && "Metin girişi için bir alan ekler"}
                {type === "NUMBER" &&
                  "Sayısal değer girişi için bir alan ekler"}
                {type === "DROPDOWN" &&
                  "Açılır listeden seçim yapılmasını sağlar"}
                {type === "CHECKBOX" && "İşaretlenebilir onay kutusu ekler"}
                {type === "RADIO" && "Tek seçimlik radio düğmeleri ekler"}
                {type === "TEXTAREA" && "Çok satırlı metin girişi alanı ekler"}
                {type === "DATE" && "Tarih girişi için bir alan ekler"}
                {type === "ASSIGNEE" && "Personel seçimi için bir alan ekler"}
                {type === "STATUS" && "Durum seçimi için bir alan ekler"}
                {type === "FILE" && "Dosya girişi için bir alan ekler"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default LeftSidebar;
