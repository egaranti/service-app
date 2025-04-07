import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@egaranti/components";

import React, { useEffect, useState } from "react";

import { useTechnicalServiceStore } from "@/stores/useTechnicalServiceStore";

import AddTechnicalServiceDialog from "@/components/technical-service/addTechnicalServiceDialog";
import BulkUploadDialog from "@/components/technical-service/bulkUploadDialog";
import TechnicalServiceFilters from "@/components/technical-service/technicalServiceFilters";
import TechnicalServiceTable from "@/components/technical-service/technicalServiceTable";
import BulkImportWizard from "@/components/ui/BulkImportWizard";

import { Plus, Upload } from "lucide-react";

const TechnicalServicePage = () => {
  const { users, fetchUsers } = useTechnicalServiceStore();
  const [filters, setFilters] = useState({});
  const [openBulkUpload, setOpenBulkUpload] = useState(false);
  const [openAddUser, setOpenAddUser] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-[#f9fafc]">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 flex flex-col sm:mb-0 md:gap-4">
            <h1 className="text-2xl font-semibold text-[#111729]">
              Teknik Servisler
            </h1>
            <p className="text-[#717680]">
              Bu sayfada teknik servisleri oluşturabilir, düzenleyebilirsiniz.
            </p>
          </div>
          <div className="flex w-full gap-2 md:w-auto">
            <Button
              variant="secondaryColor"
              className="flex items-center gap-2"
              onClick={() => setOpenBulkUpload(true)}
            >
              <Upload className="h-4 w-4" />
              Toplu Yükle
            </Button>

            <Button
              className="flex items-center gap-2"
              onClick={() => setOpenAddUser(true)}
            >
              <Plus className="h-4 w-4" />
              Yeni Teknik Servis
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondaryColor">
                  <Plus className="h-4 w-4" />
                  Yeni Teknik Servis
                </Button>
              </DialogTrigger>
              <DialogContent
                // full size dialog
                className="h-full min-w-full bg-white"
              >
                <DialogHeader>
                  <BulkImportWizard
                    expectedColumns={[
                      { key: "name", label: "İsim", required: true },
                      { key: "email", label: "E-posta", required: true },
                      { key: "phone", label: "Telefon", required: false },
                    ]}
                    onComplete={(data) => {
                      console.log(data);
                    }}
                  />
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondaryColor">Kapat</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <TechnicalServiceFilters filters={filters} setFilters={setFilters} />
        {users?.length > 0 ? (
          <TechnicalServiceTable users={users} />
        ) : (
          <div className="rounded-lg border bg-white">
            <p className="block py-4 text-center text-gray-500">
              Gösterilecek veri bulunamadı
            </p>
          </div>
        )}
      </main>
      <BulkUploadDialog
        onOpenChange={setOpenBulkUpload}
        open={openBulkUpload}
      />
      <AddTechnicalServiceDialog
        onOpenChange={setOpenAddUser}
        open={openAddUser}
      />
    </div>
  );
};

export default TechnicalServicePage;
