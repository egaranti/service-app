import { Toaster } from "@egaranti/components";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RouterProvider } from "react-router-dom";

import routes from "./routes";

import { getUserCountry } from "@/services/country";

import { useRegisterSW } from "virtual:pwa-register/react";

const App = () => {
  // 15 minutes
  const intervalMS = 900000;

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (!r) return;

      setInterval(async () => {
        try {
          if (!navigator.onLine) return;

          const response = await fetch(swUrl, {
            cache: "no-store",
            headers: { "cache-control": "no-cache" },
          });

          if (response?.status === 200) {
            await r.update();
            setNeedRefresh(true);
          }
        } catch (error) {
          console.error("SW Update Error:", error);
        }
      }, intervalMS);
    },
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log("SW Registered: " + r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  useEffect(() => {
    getUserCountry();
  }, []);

  const { t } = useTranslation();

  return (
    <>
      <Toaster />
      <RouterProvider router={routes} />
      <div className="fixed bottom-4 right-4">
        {needRefresh && (
          <div className="flex items-center space-x-4 rounded-lg bg-white p-4 shadow-lg">
            <div className="flex-1">
              <span>
                {t(
                  "needReflesh.reload",
                  "Yeni içerik mevcut, güncellemek için yeniden yükle düğmesine tıklayın.",
                )}
              </span>
            </div>
            {needRefresh && (
              <button
                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                onClick={() => {
                  updateServiceWorker(true);
                  close();
                  window.location.reload(true);
                }}
              >
                {t("common.reload", "Yenile")}
              </button>
            )}
            <button
              className="rounded-lg bg-gray-500 px-4 py-2 text-white"
              onClick={() => close()}
            >
              {t("common.close", "Kapat")}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
