import { type Touch } from "react";

const getCircleCenter = (el: SVGCircleElement) => {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    radius: rect.width / 2,
  };
};

export const isTouchOverCircle = (touch: Touch, el: SVGCircleElement) => {
  const { x, y, radius } = getCircleCenter(el);
  const dx = touch.clientX - x;
  const dy = touch.clientY - y;
  console.log({ x, y, dx, dy });
  return Math.sqrt(dx * dx + dy * dy) <= radius;
};
