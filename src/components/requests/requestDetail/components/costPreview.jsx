import { Handshake } from "lucide-react";

const CostPreview = () => {
  return (
    <div className="mb-6 rounded-lg border border-green-200 bg-green-100 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Hakediş Değerleri</h3>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-green-500 bg-green-500">
          <Handshake className="h-5 w-5 text-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default CostPreview;
