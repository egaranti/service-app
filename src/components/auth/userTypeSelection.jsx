import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

// User type options
const userTypes = [
  {
    id: "personal",
    title: "Bireysel",
    description: "Bireysel kullanıcılar için giriş",
    icon: "👤",
  },
  {
    id: "technical-service",
    title: "Teknik Servis",
    description: "Yetkili teknik servis personeli için giriş",
    icon: "🔧",
  },
];

const UserTypeSelection = ({ onSelectUserType }) => {
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate();

  const handleSelection = (type) => {
    setSelectedType(type);
    localStorage.setItem("user", type);
    onSelectUserType(type);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <h1 className="mb-8 text-center text-2xl font-bold text-gray-800">
        Kullanıcı Tipini Seçin
      </h1>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
        {userTypes.map((type) => (
          <motion.div
            key={type.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-8 shadow-md transition-all duration-200 ${
              selectedType === type.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
            }`}
            onClick={() => handleSelection(type.id)}
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-4xl">
              {type.icon}
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-800">
              {type.title}
            </h2>
            <p className="text-center text-sm text-gray-600">
              {type.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UserTypeSelection;
