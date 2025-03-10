import React from "react";

import PartItem from "./part-item";

const PartTreeView = ({ parts, onAddSubpart, onEdit, onDelete }) => {
  return (
    <div className="rounded-md border bg-white">
      <div>
        {parts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Gösterilecek parça bulunamadı
          </div>
        ) : (
          parts.map((part) => (
            <PartItem
              key={part.id}
              part={part}
              onAddSubpart={onAddSubpart}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PartTreeView;
