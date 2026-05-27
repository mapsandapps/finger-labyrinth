import React, { type TouchEvent, useCallback, useRef, useState } from "react";
import "./Labyrinth.css";
import "animate.css";
import { type Labyrinth } from "./labyrinths";
import { getLabyrinthForDate, isTouchOverCircle } from "./helpers";
import { addDateToLocalStorage } from "./localstorage";

type Direction = "in" | "out";

const SPEED = 30; // 0 - 100 (technically 0-600)
const ANIMATION_CLASSES = ["animate__heartBeat", "animate__slower"];
const IS_IN_DEBUG_MODE = false;

interface LabyrinthProps {
  puzzleDate?: Date;
}

export default function Labyrinth(props: LabyrinthProps) {
  const { puzzleDate } = props;

  const [direction, setDirection] = useState<Direction>("in");
  const [pathAnimation, setPathAnimation] = useState<Animation>();
  const [circleAnimation, setCircleAnimation] = useState<Animation>();
  const [circleEl, setCircleEl] = useState<SVGCircleElement | null>(null);
  const isAnimatingRef = useRef(false); // needs to be a ref so it won't be stale in looped functions
  const hasWonRef = useRef(false); // needs to be a ref so it won't be stale in looped functions
  const [hasWon, setHasWon] = useState(false); // also need it in state
  const activeTouchesRef = useRef<React.Touch[]>([]);
  const currentLocationRef = useRef<SVGCircleElement>(null);
  const centerCircleRef = useRef<SVGCircleElement>(null);
  const bridgeRefs = useRef<SVGPathElement[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const date = puzzleDate || new Date();

  const {
    path,
    pathColor,
    travelingColor,
    backgroundColor,
    pathWidth,
    viewBoxWidth,
    viewBoxHeight,
    bridges,
    centerCircle,
    startCircle,
  }: Labyrinth = getLabyrinthForDate(date, true);

  const onWin = () => {
    hasWonRef.current = true;
    setHasWon(true);
    addDateToLocalStorage(date);
  };

  const onExit = () => {
    window.history.pushState({}, "", "/");
    window.location.reload();
  };

  const getAnimationOptions = (): KeyframeAnimationOptions => {
    const pathLength = (
      document.querySelector("#path-floor") as SVGPathElement
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
    if (hasWonRef.current) return;
    activeTouchesRef.current = Array.from(e.touches);

    if (e.touches.length > 0) {
      requestAnimationFrame(loop);
    }
  };

  // this should trigger after the circle has crossed over the bridge, while it's on its way to the middle of the labyrinth
  const afterCrossingOverBridgeIn = (i: number) => {
    const bridge = document.getElementById(`bridge-${i}`)!;
    const highBridges = document.getElementById("high-bridges")!;
    const bridgePath = document.querySelector(`#bridge-${i} .bridge-path`)!;
    bridgePath.setAttribute("stroke", travelingColor);
    // move bridge to the front so we can go under it
    highBridges.appendChild(bridge);
  };

  // this should trigger after the circle has crossed under the bridge, while it's on its way out from middle of the labyrinth
  const afterCrossingUnderBridgeOut = (i: number) => {
    const bridge = document.getElementById(`bridge-${i}`)!;
    const lowBridges = document.getElementById("low-bridges")!;
    const bridgePath = document.querySelector(`#bridge-${i} .bridge-path`)!;

    // move bridge back so we can go over it
    lowBridges.appendChild(bridge);
    bridgePath.setAttribute("stroke", pathColor);
  };

  const checkForCircleCrossingBridges = () => {
    if (!isAnimatingRef.current || hasWonRef.current) return;
    // the distance between BUFFER & FINISHED_BUFFER is where the circle will trigger as being about to go over/under a bridge or as having finished going over/under a bridge
    const BUFFER = 6;
    const FINISHED_BUFFER = 20;

    const percent = pathAnimation?.overallProgress || 0;
    const pathLength = pathRef.current!.getTotalLength();
    const distanceAlongPath =
      direction === "in" ? percent * pathLength : (1 - percent) * pathLength;

    bridges?.forEach((bridge, i) => {
      if (
        direction === "in" &&
        distanceAlongPath >= bridge.offsetOver + FINISHED_BUFFER &&
        distanceAlongPath <= bridge.offsetOver + FINISHED_BUFFER + BUFFER
      ) {
        afterCrossingOverBridgeIn(i);
      }
      if (
        direction === "out" &&
        distanceAlongPath <= bridge.offsetUnder - FINISHED_BUFFER &&
        distanceAlongPath >= bridge.offsetUnder - FINISHED_BUFFER - BUFFER
      ) {
        afterCrossingUnderBridgeOut(i);
      }
    });

    requestAnimationFrame(checkForCircleCrossingBridges);
  };

  // there's no easy way to track if a touch leaves an element, so this is needed (unlike the simpler mouse case)
  const loop = () => {
    if (
      !circleAnimation ||
      !isAnimatingRef.current ||
      !circleEl ||
      hasWonRef.current
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
    if (!pathAnimation || !circleAnimation || hasWonRef.current) return;

    if (isAnimatingRef.current) {
      // no-op: if already animating, do nothing
    } else {
      // play/unpause path animation
      isAnimatingRef.current = true;
      checkForCircleCrossingBridges();
      pathAnimation.play();
      circleAnimation.play();
      currentLocationRef.current?.classList.remove(...ANIMATION_CLASSES);
      if (direction === "out" && centerCircleRef.current) {
        centerCircleRef.current.classList.remove("expand");
        centerCircleRef.current.classList.add("contract");
      }
    }
  };

  const onReleaseButton = () => {
    if (!pathAnimation || !circleAnimation || hasWonRef.current) return;

    // pause path animation
    isAnimatingRef.current = false;
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
          isAnimatingRef.current = false;
          const newDirection = direction === "in" ? "out" : "in";

          if (newDirection === "out") {
            setDirection(newDirection);
            swapCircleColor(newDirection);
            if (centerCircleRef.current) {
              centerCircleRef.current.classList.remove("contract");
              centerCircleRef.current.classList.add("expand");
            }
          } else {
            onWin();
          }
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
    <div className="labyrinth">
      <svg
        className="labyrinth-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
        onTouchStart={updateActiveTouches}
        onTouchMove={updateActiveTouches}
        onTouchEnd={updateActiveTouches}
        style={{
          backgroundColor,
          // @ts-ignore
          "--center-circle-r": `${centerCircle?.r || pathWidth / 2}px`,
        }}
      >
        <g fill="none" fillRule="evenodd">
          <path
            id="path-floor"
            ref={pathRef}
            stroke={pathColor}
            strokeWidth={pathWidth}
            d={path}
          />
          <circle
            className="start-circle"
            cx={startCircle.cx}
            cy={startCircle.cy}
            r={startCircle.r}
            fill={travelingColor}
          />
          <circle
            className="center-circle"
            cx={centerCircle.cx}
            cy={centerCircle.cy}
            r={centerCircle.r || pathWidth / 2}
            fill={pathColor}
          />
          <circle
            className="center-circle-animated"
            ref={centerCircleRef}
            cx={centerCircle.cx}
            cy={centerCircle.cy}
            r={0}
            fill={travelingColor}
          />
          <g id="low-bridges">
            {bridges?.map((bridge, i) => (
              <g id={`bridge-${i}`} key={`bridge-${i}`}>
                <path
                  className="bridge-bridge"
                  stroke={IS_IN_DEBUG_MODE ? "red" : backgroundColor}
                  strokeWidth={pathWidth + 4}
                  d={bridge.path}
                  ref={(ref) => {
                    if (ref) {
                      bridgeRefs.current[i] = ref;
                    }
                  }}
                  pointerEvents="none"
                />
                <path
                  className="bridge-path"
                  stroke={pathColor} // NOTE: changed via JS
                  strokeWidth={pathWidth}
                  d={bridge.path}
                  pointerEvents="none"
                />
              </g>
            ))}
          </g>
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
          {/* NOTE: bridges move between here and #low-bridges as a sort of z-indexing */}
          <g id="high-bridges" />
        </g>
      </svg>
      {hasWon && (
        <button
          className="close-button"
          onClick={onExit}
          style={{ color: travelingColor }}
        >
          ⬅
        </button>
      )}
    </div>
  );
}
