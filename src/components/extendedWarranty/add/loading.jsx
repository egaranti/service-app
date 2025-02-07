import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import React from "react";
import ReactDOM from "react-dom";

import Animation from "@/assets/lottie/animation-loading.lottie";

const Loading = ({ title }) => {
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[51] flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-[#0037AD] to-[#6692F0]"
      role="alert"
      aria-live="assertive"
    >
      <h1 className="text-2xl font-bold text-white">
        {title ? title : "Loading..."}
      </h1>
      <DotLottieReact
        className="md:w-1/2"
        src={Animation}
        loop
        autoplay
        aria-label="Loading animation"
      />
    </div>,
    document.body, // Bileşeni DOM'un body kısmına yerleştiriyoruz
  );
};

export default Loading;
