import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@egaranti/components";

import { useTranslation } from "react-i18next";

//import EnglishFlag from "../../assets/icons/enFlag.svg?react";
//import RussianFlag from "../../assets/icons/ruFlag.svg?react";
//import TurkishFlag from "../../assets/icons/turkishFlag.svg?react";

const LangSwitch = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="mt-2 max-w-sm rounded-lg bg-white">
      <Select onValueChange={(e) => changeLanguage(e)} value={i18n.language}>
        <SelectTrigger>
          <SelectValue>
            <span
              className="text-sm"
              title={
                i18n.language === "tr"
                  ? "Türkçe"
                  : i18n.language === "ru"
                    ? "Русский"
                    : "English"
              }
            >
              {i18n.language === "tr" ? (
                <div className="text-md flex gap-2">
                  {/* <TurkishFlag /> Türkçe */}
                </div>
              ) : i18n.language === "ru" ? (
                <div className="text-md flex gap-2">
                  {/* <RussianFlag /> Русский */}
                </div>
              ) : (
                <div className="text-md flex gap-2">
                  {/* <EnglishFlag /> English */}
                </div>
              )}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tr">Türkçe</SelectItem>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="ru">Русский</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LangSwitch;
