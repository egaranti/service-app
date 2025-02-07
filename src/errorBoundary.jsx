// GlobalError.js
import React from "react";
import { useTranslation } from "react-i18next";
import { useRouteError } from "react-router-dom";

function GlobalError() {
  const error = useRouteError();
  const { t } = useTranslation();
  console.error(error);

  const handleRefresh = () => {
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
    localStorage.clear();
    window.location.reload(true);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        gap: "20px",
      }}
    >
      <h1
        style={{
          color: "red",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        {t("errorBoundry.mainTitle")}
      </h1>
      <p
        style={{
          fontSize: "18px",
          color: "#333",
        }}
      >
        {t("errorBoundry.subTitle")}
      </p>
      <p
        style={{
          fontSize: "16px",
          color: "#333",
        }}
      >
        <pre>{error?.statusText || error?.message}</pre>
      </p>
      <button
        onClick={handleRefresh}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Sayfayı Yenile
      </button>
    </div>
  );
}

export default GlobalError;
