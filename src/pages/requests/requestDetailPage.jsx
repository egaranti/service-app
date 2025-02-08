import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@egaranti/components";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import requestService from "@/services/requestService";

import Breadcrumb from "@/components/shared/breadcrumb";

export default function RequestDetailPage() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  const breadcrumbItems = [
    { label: "Talepler", path: "/requests" },
    { label: `Talep #${id}` },
  ];

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const { data } = await requestService.getRequestById(id);
        setRequest(data);
      } catch (error) {
        console.error("Error fetching request:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await requestService.updateRequest(id, { ...request, status: newStatus });
      setRequest((prev) => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      await requestService.updateRequest(id, {
        ...request,
        priority: newPriority,
      });
      setRequest((prev) => ({ ...prev, priority: newPriority }));
    } catch (error) {
      console.error("Error updating request priority:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!request) {
    return <div>Request not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#f9fafc] p-8">
      <div className="container mx-auto">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#111729]">
            Talep Detayı
          </h1>
          <div className="flex gap-4">
            <Select value={request.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px]" />
              <SelectContent>
                <SelectItem value="pending">Beklemede</SelectItem>
                <SelectItem value="in_progress">İşlemde</SelectItem>
                <SelectItem value="completed">Tamamlandı</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={request.priority}
              onValueChange={handlePriorityChange}
            >
              <SelectTrigger className="w-[180px]" />
              <SelectContent>
                <SelectItem value="low">Düşük</SelectItem>
                <SelectItem value="medium">Orta</SelectItem>
                <SelectItem value="high">Yüksek</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6">
          <div>
            <div>
              <h2 className="text-xl font-semibold text-[#111729]">
                Talep Bilgileri
              </h2>
            </div>
            <div>
              <div className="grid gap-4">
                <div>
                  <h3 className="font-medium text-[#111729]">Talep Adı</h3>
                  <p className="text-[#717680]">{request.name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-[#111729]">Açıklama</h3>
                  <p className="text-[#717680]">{request.description}</p>
                </div>
                <div>
                  <h3 className="font-medium text-[#111729]">
                    Oluşturulma Tarihi
                  </h3>
                  <p className="text-[#717680]">{request.createdAt}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional sections can be added here for comments, attachments, etc. */}
        </div>
      </div>
    </div>
  );
}
