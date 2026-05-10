import { useCallback, useRef, useState } from "react";
import "./Labyrinth.css";
import { labyrinths, defaultLabyrinth, type Labyrinth } from "./labyrinths";

type Direction = "in" | "out";

const currentLabyrinth = labyrinths[0];
const SPEED = 70; // 0 - 100 (technically 0-600)

export default function Labyrinth() {
  const [direction, setDirection] = useState<Direction>("in");
  const [pathAnimation, setPathAnimation] = useState<Animation>();
  const [circleAnimation, setCircleAnimation] = useState<Animation>();
  const currentLocationRef = useRef<SVGCircleElement>(null);

  const labyrinthSetup: Labyrinth = {
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

  const setIconVisible = () => {
    if (currentLocationRef.current) {
      currentLocationRef.current.setAttribute("fill", labyrinthSetup.pathColor);
    }
  };

  const setIconInvisible = () => {
    // if (currentLocationRef.current) {
    //   currentLocationRef.current.setAttribute("fill", "transparent");
    //   currentLocationRef.current.style.stroke = "transparent";
    // }
  };

  const onHoldButton = () => {
    if (!pathAnimation || !circleAnimation) return;

    const isAnimating = pathAnimation?.playState === "running";

    if (isAnimating) {
      // no-op: if already animating, do nothing
    } else {
      setIconInvisible();
      // play/unpause path animation
      pathAnimation.play();
      circleAnimation.play();
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
          console.log("onfinish: TODO: reverse animation to leave labyrinth");
          setDirection(direction === "in" ? "out" : "in");
          setIconVisible();
        };

        setPathAnimation(pathAnim);
      }
    },
    [direction],
  );

  const initCircle = useCallback(
    (el: SVGCircleElement) => {
      if (el !== null) {
        el.style.offsetPath = `path("${labyrinthSetup.path}")`;
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
        viewBox="0 0 240 240"
        preserveAspectRatio="xMidYMid meet"
      >
        <g fill="none" fillRule="evenodd">
          <path
            stroke={labyrinthSetup.pathColor}
            strokeWidth={labyrinthSetup.pathWidth}
            d={labyrinthSetup.path}
          />
          <path
            ref={initPath}
            stroke={labyrinthSetup.travelingColor}
            strokeWidth={labyrinthSetup.pathWidth}
            d={labyrinthSetup.path}
          />
          <g
            ref={initCircle}
            r="24"
            fill="transparent"
            onMouseDown={onHoldButton}
            onMouseUp={onReleaseButton}
            onMouseEnter={onHoldButton}
            onMouseLeave={onReleaseButton}
            onTouchStart={onHoldButton}
            onTouchEnd={onReleaseButton}
          >
            <circle r="24" />
            <circle
              ref={currentLocationRef}
              r={labyrinthSetup.pathWidth / 2}
              fill={labyrinthSetup.travelingColor}
            />
          </g>
        </g>
      </svg>
    </>
  );
}
