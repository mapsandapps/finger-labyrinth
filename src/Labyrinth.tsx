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
  // needs to be a ref so it won't be stale in looped functions
  const isAnimatingRef = useRef(false);
  const hasWonRef = useRef(false);
  const activeTouchesRef = useRef<React.Touch[]>([]);
  const currentLocationRef = useRef<SVGCircleElement>(null);
  const centerCircleRef = useRef<SVGCircleElement>(null);
  const bridgeRefs = useRef<SVGPolygonElement[]>([]);
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
  }: Labyrinth = getLabyrinthForDate(date);

  const onWin = () => {
    hasWonRef.current = true;
    addDateToLocalStorage(date);
    window.history.pushState({}, "", "/");
    window.location.reload();
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
    if (hasWonRef.current) return;
    activeTouchesRef.current = Array.from(e.touches);

    if (e.touches.length > 0) {
      requestAnimationFrame(loop);
    }
  };

  const onCircleCrossingBridge = (i: number) => {
    // the circle crosses each bridge twice on the way in and twice on the way out
    // when the direction is "in", the bridges can stay transparent. the circle will go over & under each bridge, and the path will filled at the appropriate time
    // if the direction is "out" and the circle is about to cross a bridge for the 1st time, it will be going under the bridge. the bridge should be set to travelingColor
    // if the direction is "out" and the circle is about to cross a bridge for the 2nd time, it will be going over the bridge. the bridge should be transparent
    const bridge = document.getElementById(`bridge-${i}`)!;
    const bridges = document.getElementById("bridges")!;

    if (direction === "in") {
      // only relevant in debug mode, but doesn't hurt to do all the time:
      bridge.setAttribute("fill", "transparent");
    } else {
      if (bridge.getAttribute("fill") === "transparent") {
        // 1st crossing, going under the bridge
        bridge.setAttribute("fill", travelingColor);
        // push bridge to front so we can go under it
        const parent = bridges.parentNode;
        parent?.appendChild(bridge);
      } else {
        // 2nd crossing, going over the bridge
        bridge.setAttribute("fill", "transparent");
        // move bridge back so we can go over it
        bridges?.appendChild(bridge);
      }
    }
  };

  const isAlreadyTouching = bridges?.map(() => false);

  // TODO: we could change how this function works to calculate based on their bridge's position not its bounding box
  const getIsCircleTouchingBridge = (bridge: SVGPolygonElement) => {
    const BUFFER = 0;
    if (!currentLocationRef.current) return false;

    const circleRect = currentLocationRef.current.getBoundingClientRect();
    const bridgeRect = bridge.getBoundingClientRect();

    const cx = circleRect.left + circleRect.width / 2;
    const cy = circleRect.top + circleRect.height / 2;
    const radius = circleRect.width / 2 + BUFFER;

    const nearestX = Math.max(bridgeRect.left, Math.min(cx, bridgeRect.right));
    const nearestY = Math.max(bridgeRect.top, Math.min(cy, bridgeRect.bottom));

    const dx = cx - nearestX;
    const dy = cy - nearestY;
    return Math.sqrt(dx * dx + dy * dy) <= radius;
  };

  // this calls itself
  const checkForCircleCrossingBridges = () => {
    if (!isAnimatingRef.current || hasWonRef.current) return;

    // see if circle is about to cross over/under a bridge
    bridgeRefs.current.forEach((bridge, i) => {
      if (!isAlreadyTouching) return;

      const isTouching = getIsCircleTouchingBridge(bridge);

      if (isTouching && !isAlreadyTouching[i]) {
        onCircleCrossingBridge(i);
      }

      isAlreadyTouching[i] = isTouching;
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
    <>
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
          "--center-circle-r": `${centerCircle.r || pathWidth / 2}px`,
        }}
      >
        <g fill="none" fillRule="evenodd">
          <path stroke={pathColor} strokeWidth={pathWidth} d={path} />
          <path
            ref={initPath}
            stroke={travelingColor}
            strokeWidth={pathWidth}
            d={path}
          />
          {centerCircle && (
            <>
              <circle
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
            </>
          )}
          <g id="bridges">
            {bridges?.map((bridge, i) => (
              <polygon
                id={`bridge-${i}`}
                key={`bridge-${i}`}
                points={bridge.bridgePolygon}
                // fill is set in onCircleCrossingBridge()
                fill={IS_IN_DEBUG_MODE ? "#d0000050" : "transparent"}
                ref={(ref) => {
                  if (ref) {
                    bridgeRefs.current[i] = ref;
                  }
                }}
                pointerEvents="none"
              />
            ))}
          </g>
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

          {bridges?.map((bridge, i) => (
            <React.Fragment key={`bridge-sides-${i}`}>
              {bridge.sideAPolygon && (
                <polygon
                  points={bridge.sideAPolygon}
                  fill={backgroundColor}
                  stroke={IS_IN_DEBUG_MODE ? "green" : "none"}
                  strokeWidth={IS_IN_DEBUG_MODE ? "0.5" : 0}
                  pointerEvents="none"
                />
              )}
              {bridge.sideBPolygon && (
                <polygon
                  points={bridge.sideBPolygon}
                  fill={backgroundColor}
                  stroke={IS_IN_DEBUG_MODE ? "red" : "none"}
                  strokeWidth={IS_IN_DEBUG_MODE ? "0.5" : 0}
                  pointerEvents="none"
                />
              )}
            </React.Fragment>
          ))}
        </g>
      </svg>
    </>
  );
}
