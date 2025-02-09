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
      <div className="text-muted-foreground mb-4 text-sm font-medium">
        Form Elemanları
      </div>
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
                {type === "text" && "Metin girişi için bir alan ekler"}
                {type === "number" &&
                  "Sayısal değer girişi için bir alan ekler"}
                {type === "select" &&
                  "Açılır listeden seçim yapılmasını sağlar"}
                {type === "checkbox" && "İşaretlenebilir onay kutusu ekler"}
                {type === "radio" && "Tek seçimlik radio düğmeleri ekler"}
                {type === "textarea" && "Çok satırlı metin girişi alanı ekler"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default LeftSidebar;
