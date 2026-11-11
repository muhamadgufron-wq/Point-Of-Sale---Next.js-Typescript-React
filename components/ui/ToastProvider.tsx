"use client";

import { GooeyToaster } from "goey-toast";
import "goey-toast/styles.css";

export function ToastProvider() {
  return (
    <GooeyToaster
      theme="system"
      position="top-center"
      showProgress={false}
      closeButton={false}
      closeOnEscape={false}
    />
  );
}
