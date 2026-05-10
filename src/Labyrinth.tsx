import { type TouchEvent, useCallback, useRef, useState } from "react";
import "./Labyrinth.css";
import "animate.css";
import { labyrinths, defaultLabyrinth, type Labyrinth } from "./labyrinths";
import { isTouchOverCircle } from "./helpers";

type Direction = "in" | "out";

const currentLabyrinth = labyrinths[0];
const SPEED = 30; // 0 - 100 (technically 0-600)
const ANIMATION_CLASSES = ["animate__heartBeat", "animate__slower"];

export default function Labyrinth() {
  const [direction, setDirection] = useState<Direction>("in");
  const [pathAnimation, setPathAnimation] = useState<Animation>();
  const [circleAnimation, setCircleAnimation] = useState<Animation>();
  const [circleEl, setCircleEl] = useState<SVGCircleElement | null>(null);
  const activeTouchesRef = useRef<React.Touch[]>([]);
  const currentLocationRef = useRef<SVGCircleElement>(null);

  const {
    path,
    pathColor,
    travelingColor,
    backgroundColor,
    pathWidth,
    viewBoxWidth,
    viewBoxHeight,
  }: Labyrinth = {
    ...defaultLabyrinth,
    ...currentLabyrinth,
  };

  const getAnimationOptions = (): KeyframeAnimationOptions => {
    const pathLength = (
      document.querySelector("path") as SVGPathElement
    ).getTotalLength();
    const duration = pathLength ? pathLength * (600 / SPEED) : 10000;

    return {
      duration,
      easing: "linear",
      fill: "both",
    };
  };

  const swapCircleColor = (direction: Direction) => {
    if (currentLocationRef.current) {
      currentLocationRef.current?.classList.add(...ANIMATION_CLASSES);

      if (direction === "in") {
        currentLocationRef.current.setAttribute("fill", travelingColor);
      } else {
        currentLocationRef.current.setAttribute("fill", pathColor);
      }
    }
  };

  const updateActiveTouches = (e: TouchEvent<SVGSVGElement>) => {
    activeTouchesRef.current = Array.from(e.touches);

    if (e.touches.length > 0) {
      requestAnimationFrame(loop);
    }
  };

  // there's no easy way to track if a touch leaves an element, so this is needed (unlike the simpler mouse case)
  const loop = () => {
    if (
      !circleAnimation ||
      circleAnimation.playState !== "running" ||
      !circleEl
    )
      return; // stop checking when paused/finished

    if (activeTouchesRef.current.length === 0) {
      onReleaseButton();
    }

    if (
      activeTouchesRef.current.length > 0 &&
      !isTouchOverCircle(activeTouchesRef.current[0], circleEl)
    ) {
      // no longer overlapping
      onReleaseButton();
    }

    requestAnimationFrame(loop);
  };

  const onHoldButton = () => {
    if (!pathAnimation || !circleAnimation) return;

    const isAnimating = pathAnimation?.playState === "running";

    if (isAnimating) {
      // no-op: if already animating, do nothing
    } else {
      // play/unpause path animation
      pathAnimation.play();
      circleAnimation.play();
      currentLocationRef.current?.classList.remove(...ANIMATION_CLASSES);
    }
  };

  const onReleaseButton = () => {
    if (!pathAnimation || !circleAnimation) return;

    // pause path animation
    pathAnimation.pause();
    circleAnimation.pause();
  };

  const initPath = useCallback(
    (el: SVGPathElement) => {
      if (el !== null) {
        // get the length of the path and set up the dash so it starts 'empty'
        const lineLength = el.getTotalLength();
        el.style.strokeDasharray = lineLength + " " + lineLength;
        el.style.strokeDashoffset = "0";

        const keyframes =
          direction === "in"
            ? [{ strokeDashoffset: `${lineLength}` }, { strokeDashoffset: "0" }]
            : [
                { strokeDashoffset: "0" },
                { strokeDashoffset: `${lineLength}` },
              ];

        const pathAnim = el.animate(keyframes, getAnimationOptions());
        pathAnim.currentTime = 0; // prevent a flash of the finished animation
        pathAnim.pause(); // will start playing on load if not paused

        // when animation ends, prep everything to be restarted
        pathAnim.onfinish = () => {
          const newDirection = direction === "in" ? "out" : "in";
          setDirection(newDirection);
          swapCircleColor(newDirection);
        };

        setPathAnimation(pathAnim);
      }
    },
    [direction],
  );

  const initCircle = useCallback(
    (el: SVGCircleElement) => {
      if (el !== null) {
        setCircleEl(el);
        el.style.offsetPath = `path("${path}")`;
        // NOTE: could set offsetRotate here to `0deg` but not needed for a circle

        const keyframes =
          direction === "in"
            ? [{ offsetDistance: "0%" }, { offsetDistance: "100%" }]
            : [{ offsetDistance: "100%" }, { offsetDistance: "0%" }];

        const circleAnim = el.animate(keyframes, getAnimationOptions());
        circleAnim.currentTime = 0; // prevent a flash of the finished animation
        circleAnim.pause(); // will start playing on load if not paused

        setCircleAnimation(circleAnim);
      }
    },
    [direction],
  );

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
        onTouchStart={updateActiveTouches}
        onTouchMove={updateActiveTouches}
        onTouchEnd={updateActiveTouches}
        style={{ backgroundColor }}
      >
        <g fill="none" fillRule="evenodd">
          <path stroke={pathColor} strokeWidth={pathWidth} d={path} />
          <path
            ref={initPath}
            stroke={travelingColor}
            strokeWidth={pathWidth}
            d={path}
          />
          <g
            ref={initCircle}
            r="36"
            fill="transparent"
            onMouseEnter={onHoldButton}
            onMouseLeave={onReleaseButton}
            onTouchStart={onHoldButton}
          >
            <circle r="36" />
            <circle
              className={`animate__animated animate__infinite ${ANIMATION_CLASSES.join(" ")}`}
              ref={currentLocationRef}
              r={pathWidth / 2}
              fill={travelingColor}
            />
          </g>
        </g>
      </svg>
    </>
  );
}
