import React from "react";

const JwtLogin = () => {
  const token = new URLSearchParams(window.location.search).get("token");
  const redirect = new URLSearchParams(window.location.search).get("redirect");

  //   function getParamsAsObject() {
  //     const params = new URLSearchParams(window.location.search);
  //     let paramsObj = {};
  //     for (const [key, value] of params.entries()) {
  //       paramsObj[key] = value;
  //     }
  //     return paramsObj;
  //   }

  if (token) {
    localStorage.setItem("token", token);
    window.location.href = redirect || "/forms";
  }

  return <></>;
};

export default JwtLogin;
