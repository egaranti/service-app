import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@egaranti/components";

import React, { useEffect, useState } from "react";

import AddUserDialog from "../../components/users/AddUserDialog";
import BulkUploadDialog from "../../components/users/BulkUploadDialog";

import { useUserStore } from "@/stores/useUserStore";

import UserFilters from "@/components/users/UserFilters";
import UserTable from "@/components/users/UserTable";

import { Plus, Upload } from "lucide-react";

const UsersPage = () => {
  const { users, fetchUsers } = useUserStore();
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
              Kullanıcılar
            </h1>
            <p className="text-[#717680]">
              Bu sayfada kullanıcılarınızı oluşturabilir, duzenleyebilirsiniz.
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
              Yeni Kullanıcı
            </Button>
          </div>
        </div>

        <BulkUploadDialog
          onOpenChange={setOpenBulkUpload}
          open={openBulkUpload}
        />

        <AddUserDialog onOpenChange={setOpenAddUser} open={openAddUser} />

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <UserFilters filters={filters} setFilters={setFilters} />
          <UserTable users={users} />
        </div>
      </main>
    </div>
  );
};

export default UsersPage;
