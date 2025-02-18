# Form Sistemi Dokümantasyonu

## Genel Bakış

Form sistemi, dinamik form oluşturma ve yönetme imkanı sağlayan güçlü bir bileşen kütüphanesidir. Sistem, sürükle-bırak özelliği ile kolay form oluşturma imkanı sunar ve çeşitli form alanı tipleri destekler.

## Form Builder Bileşenleri

### Ana Bileşenler

1. **FormBuilder**

   - Form oluşturma arayüzünün ana bileşeni
   - Sürükle-bırak işlemlerini yönetir
   - Form alanlarının eklenmesi, silinmesi ve düzenlenmesi işlemlerini kontrol eder

2. **LeftSidebar**

   - Kullanılabilir form alanı tiplerini listeler
   - Sürüklenebilir alan tiplerini gösterir

3. **FieldEditorDialog**
   - Form alanlarının özelliklerini düzenleme modalı
   - Her alan tipi için özel düzenleme seçenekleri sunar
4. **RightSidebar**
   - Form alanlarının preview eder.
   - Form Adlarını ve kaydetme işlemlerini yönetir.

### Alan Tipleri

1. **Text Field**

   - Tek satır metin girişi
   - Placeholder ve validation özellikleri

2. **Textarea Field**

   - Çok satırlı metin girişi
   - Boyutlandırılabilir giriş alanı

3. **Number Field**

   - Sayısal değer girişi
   - Min/max değer kontrolü

4. **Select Field**

   - Açılır liste seçenekleri
   - Çoklu seçenek tanımlama

5. **Checkbox Field**

   - Evet/Hayır seçimi
   - Özel etiket tanımlama

6. **Radio Field**

   - Tek seçimlik seçenek grubu
   - Özel seçenek listesi

7. **Status Field**

   - Durum seçimi
   - Renkli durum göstergeleri

8. **File Field**
   - Dosya yükleme alanı
   - Dosya tipi kısıtlamaları

## Kullanım

### Form Oluşturma

1. Yeni form oluşturmak için `/forms/new` sayfasına gidin
2. Sol menüden istediğiniz form alanını sürükleyerek forma ekleyin
3. Her alanı düzenlemek için alan üzerindeki düzenleme ikonuna tıklayın
4. Form alanlarının sırasını sürükle-bırak ile değiştirebilirsiniz

### Alan Düzenleme

Her alan tipi için özel düzenleme seçenekleri mevcuttur:

- Label (Etiket)
- Placeholder (Yer tutucu metin)
- Required (Zorunlu alan)
- Validation (Doğrulama kuralları)
- Özel seçenekler (Select, Radio, Status alanları için)

## Form Kaydetme ve Görüntüleme

- Formlar otomatik olarak kaydedilir
- Kaydedilen formları `/forms` sayfasından görüntüleyebilirsiniz
- Her form için önizleme ve düzenleme seçenekleri mevcuttur

## Teknik Detaylar

### Form Veri Yapısı

```javascript
{
  id: string,
  title: string,
  fields: [
    {
      id: string,
      type: string,
      label: string,
      required: boolean,
      // Alan tipine özel diğer özellikler
    }
  ]
}
```

### Alan Tipleri Registry

Form alanları merkezi bir registry üzerinden yönetilir ve yeni alan tipleri eklenebilir yapıdadır.

## Best Practices

1. Her form alanı için açıklayıcı etiketler kullanın
2. Zorunlu alanları belirgin şekilde işaretleyin
3. Form alanlarını mantıksal gruplara ayırın
4. Kullanıcı dostu hata mesajları tanımlayın
5. Form önizlemesini kullanarak son kullanıcı deneyimini test edin
