import { useEffect } from "react";

export const useEvent = (
  event: keyof WindowEventMap,
  handler: (e: Event) => void,
  passive: boolean = false
) => {
  useEffect(() => {
    window.addEventListener(event, handler, passive);

    return () => {
      window.removeEventListener(event, handler);
    };
  }, [event, handler, passive]);
};

export const getColors = (num: number): string => {
  switch (num) {
    // case 2:
    //   return "#C6e6e8";
    // case 4:
    //   return "#88ABDA";
    // case 8:
    //   return "#6F94CD";
    // case 16:
    //   return "#5976BA";
    // case 32:
    //   return "#2E59A7";
    // case 64:
    //   return "#DCC7E1";
    // case 128:
    //   return "#BBA1CB";
    // case 256:
    //   return "#A67EB7";
    // case 512:
    //   return "#7D5284";
    // case 1024:
    //   return "#A8BF8F";
    // case 2048:
    //   return "#4C8045";
    default:
      return "rgba(255, 255, 255, 0.35)";
  }
};
