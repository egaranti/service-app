import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Tabs,
} from "@egaranti/components";
import { ScrollArea } from "@egaranti/components";

import { useState } from "react";

import DynamicForm from "../dynamicForm";

export default function PreviewDialog({ open, onOpenChange, forms }) {
  const mainForm = forms[0];
  const followUpForm = forms[1];
  const [activeTab, setActiveTab] = useState("main");
  const hasFollowUpForm = followUpForm?.fields?.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Form Önizleme</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-200px)]">
          {hasFollowUpForm ? (
            <div className="mt-4">
              <Tabs
                tabs={[
                  {
                    id: "main",
                    title: forms[0].title,
                  },
                  {
                    id: "followUp",
                    title: forms[1].title,
                    onClick: () => setActiveTab("followUp"),
                  },
                ]}
                selectedTabId={activeTab}
                onTabChange={(id) => setActiveTab(id)}
              />
              {activeTab === "main" ? (
                <div className="mt-4">
                  <DynamicForm
                    fields={mainForm.fields}
                    isEditing={false}
                    className="space-y-4"
                  />
                </div>
              ) : (
                <div className="mt-4">
                  <DynamicForm
                    fields={followUpForm.fields}
                    isEditing={false}
                    className="space-y-4"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4">
              <DynamicForm
                fields={mainForm.fields}
                isEditing={false}
                className="space-y-4"
              />
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
