import { useLayoutEffect, useState } from "react";
import { useAppStore } from "../store";

export function CursorHandler() {
  const { currentTool, isHovered, isDragging } = useAppStore();
  const [isPointerDown, setisPointerDown] = useState(false);
  useLayoutEffect(() => {
    const handlePointerDown = () => {
      setisPointerDown(true);
    };
    const handlePointerUp = () => {
      setisPointerDown(false);
    };
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);
  useLayoutEffect(() => {
    const canvasEl =
      document.querySelector<HTMLCanvasElement>("#canvas canvas");
    if (!canvasEl) {
      return;
    }
    if (currentTool === "select") {
      canvasEl.style.cursor = isDragging ? "grabbing" : isHovered ? "grab" : "";
    } else if (currentTool === "move") {
      canvasEl.style.cursor = isPointerDown ? "grabbing" : "grab";
    } else {
      canvasEl.style.cursor = "";
    }
  }, [isHovered, isDragging, currentTool, isPointerDown]);
  return null;
}
