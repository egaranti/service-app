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
  Textarea,
} from "@egaranti/components";

import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { createField } from "../fields";

import { Loader2 } from "lucide-react";

const AIFormGeneratorDialog = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setValue } = useFormContext();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Lütfen bir açıklama girin.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Structured output prompt for Ollama
      const structuredPrompt = `
<task>
Formun amacı: ${prompt}

Lütfen bu forma uygun alanlar üret.
</task>

<output_format>
{
  "fields": [
    {
      "type": "TEXT", // Olası değerler: TEXT, TEXTAREA, DROPDOWN, NUMBER, CHECKBOX, DATE, RADIO_BUTTON, SPARE_PART
      "label": "Alan Adı", // Örnek: Müşteri Adı, Telefon Numarası, vb.
      "required": true, // veya false
      "placeholder": "Placeholder metni", // Opsiyonel
      "options": ["Seçenek1", "Seçenek2"] // DROPDOWN, CHECKBOX ve RADIO_BUTTON için gerekli
    }
  ]
}
</output_format>

Sadece JSON formatında olmalı, ekstra metin yazma.`;

      const response = await fetch("http://127.0.0.1:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "growthwtf/hermes2pro7b:latest",
          prompt: structuredPrompt,
          format: "json", // Ollama'ya JSON formatında çıktı almak istediğimizi belirtiyoruz
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error("API yanıt vermedi");
      }

      const data = await response.json();
      const formFields = parseFormFields(data.response);

      if (formFields.length > 0) {
        // Mevcut formları temizle ve yeni form alanlarını ekle
        setValue("forms.0.fields", formFields);
        setOpen(false);
        setPrompt("");
      } else {
        setError("Form yapısı oluşturulamadı. Lütfen tekrar deneyin.");
      }
    } catch (err) {
      console.error("Form oluşturma hatası:", err);
      setError("Form oluşturulurken hata oluştu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // LLM yanıtını parse et ve form alanlarına dönüştür
  const parseFormFields = (response) => {
    try {
      // Yanıttan JSON bölümünü çıkar
      let jsonText = response;

      // JSON olarak parse etmeyi dene
      try {
        // Direkt JSON parse
        const parsedFields = JSON.parse(jsonText);
        return createFormFields(parsedFields.fields);
      } catch (jsonError) {
        // JSON parse başarısız olduysa, markdown kod bloğundan çıkarmayı dene
        const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonText = jsonMatch[1];
          const parsedFields = JSON.parse(jsonText);
          return createFormFields(parsedFields.fields);
        }

        // Son çare olarak regex ile doğrudan JSON benzeri yapıyı çıkarmaya çalış
        const jsonArrayMatch = response.match(/\[\s*{[\s\S]*}\s*\]/);
        if (jsonArrayMatch) {
          const parsedFields = JSON.parse(jsonArrayMatch[0]);
          return createFormFields(parsedFields.fields);
        }

        throw new Error("JSON formatında bir yanıt alınamadı");
      }
    } catch (err) {
      console.error("JSON parse hatası:", err, response);
      return [];
    }
  };

  // JSON verilerini form alanlarına dönüştür
  const createFormFields = (parsedFields) => {
    if (!Array.isArray(parsedFields)) {
      console.error("Geçersiz form alanları formatı:", parsedFields);
      return [];
    }

    return parsedFields.map((field, index) => {
      // Geçersiz alan tiplerini kontrol et ve düzelt
      const validTypes = [
        "TEXT",
        "TEXTAREA",
        "DROPDOWN",
        "NUMBER",
        "CHECKBOX",
        "DATE",
        "RADIO_BUTTON",
        "SPARE_PART",
      ];
      if (!validTypes.includes(field.type)) {
        field.type = "TEXT"; // Varsayılan alan tipi
      }

      const baseField = createField(field.type);
      return {
        ...baseField,
        label: field.label || baseField.label,
        required:
          field.required !== undefined ? field.required : baseField.required,
        placeholder: field.placeholder || baseField.placeholder,
        options: field.options || baseField.options || [],
        order: index,
      };
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>AI ile Form Oluştur</DialogTitle>
          <DialogDescription>
            Oluşturmak istediğiniz formun amacını açıklayın, yapay zeka sizin
            için uygun form alanlarını oluştursun.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Örnek: Servis talebi oluşturma formu, müşteri adı, telefon, ürün bilgisi ve arıza açıklaması içermeli"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-40"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondaryGray">İptal</Button>
          </DialogClose>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                Oluşturuluyor...
              </>
            ) : (
              "Form Oluştur"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIFormGeneratorDialog;
