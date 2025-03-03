import React from "react";

import { CheckCircle, Clock, FileText } from "lucide-react";

const RequestStats = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-md border bg-white p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium">Toplam Talep</div>
          <FileText className="h-4 w-4 text-gray-700" />
        </div>
        <div>
          <div className="text-2xl font-bold">{stats?.total || 0}</div>
          <p className="text-xs text-gray-700">Tüm zamanlar</p>
        </div>
      </div>

      <div className="rounded-md border bg-white p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium">Bekleyen Talepler</div>
          <Clock className="h-4 w-4 text-gray-700" />
        </div>
        <div>
          <div className="text-2xl font-bold">{stats?.pending || 0}</div>
          <p className="text-xs text-gray-700">İşlem bekleyen talepler</p>
        </div>
      </div>

      <div className="rounded-md border bg-white p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium">Tamamlanan Talepler</div>
          <CheckCircle className="h-4 w-4 text-gray-700" />
        </div>
        <div>
          <div className="text-2xl font-bold">{stats?.completed || 0}</div>
          <p className="text-xs text-gray-700">Son 30 gün</p>
        </div>
      </div>
    </div>
  );
};

export default RequestStats;
