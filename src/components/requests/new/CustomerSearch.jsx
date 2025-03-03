import { Button, Input } from "@egaranti/components";

import { useState } from "react";

const CustomerSearch = ({ onSubmit, loading }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!phoneNumber || phoneNumber.length < 10) {
      setPhoneError("Lütfen geçerli bir telefon numarası giriniz");
      return;
    }

    onSubmit(phoneNumber);
  };

  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="mb-2 text-lg font-medium">Müşteri Seçimi</h3>
        <p className="mb-4 text-gray-600">
          Lütfen müşteri telefon numarası girin.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Telefon Numarası"
              placeholder="5XX XXX XX XX"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setPhoneError("");
              }}
              error={phoneError}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <p>loading...</p> : null}
            Müşteri Ara
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CustomerSearch;
