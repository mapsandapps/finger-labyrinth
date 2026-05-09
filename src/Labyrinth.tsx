import { useCallback, useRef, useState } from "react";
import "./Labyrinth.css";

type Direction = "in" | "out";

const PATH =
  "M 512,64 a 192,192 0 0,1 192,192 a 192,192 0 0,1 -192,192 a 256,256 0 0,0 256,-256 a 320,320 0 0,1 -320,320 a 192,192 0 0,1 -192,-192 a 128,128 0 0,0 128,128 a 64,64 0 0,0 64,-64 a 64,64 0 0,1 64,-64 a 64,64 0 0,0 64,-64 a 64,64 0 0,0 -64,-64 a 64,64 0 0,0 -64,64 a 64,64 0 0,1 -64,64 a 128,128 0 0,1 -128,-128";
const SPEED = 3.5;

function Labyrinth() {
  const [direction, setDirection] = useState<Direction>("in");
  const [pathAnimation, setPathAnimation] = useState<Animation>();
  const [circleAnimation, setCircleAnimation] = useState<Animation>();
  const currentLocationRef = useRef<SVGCircleElement>(null);

  const getAnimationOptions = (): KeyframeAnimationOptions => {
    const pathLength = (
      document.querySelector("path") as SVGPathElement
    ).getTotalLength();
    const duration = pathLength ? pathLength * SPEED : 10000;

    return {
      duration,
      easing: "linear",
      fill: "both",
    };
  };

  const setIconVisible = () => {
    if (currentLocationRef.current) {
      currentLocationRef.current.setAttribute("fill", "steelblue");
      currentLocationRef.current.style.stroke = "white";
    }
  };

  const setIconInvisible = () => {
    if (currentLocationRef.current) {
      currentLocationRef.current.setAttribute("fill", "transparent");
      currentLocationRef.current.style.stroke = "transparent";
    }
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
        el.style.offsetPath = `path("${PATH}")`;
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
        width="500"
        height="500"
        viewBox="0 0 960 960"
      >
        <g fill="none" fillRule="evenodd" transform="translate(12 13)">
          <path stroke="lightgray" strokeWidth="40" d={PATH} />
          <path ref={initPath} stroke="#b58a47" strokeWidth="20" d={PATH} />
          <g
            ref={initCircle}
            r="96"
            fill="transparent"
            onMouseDown={onHoldButton}
            onMouseUp={onReleaseButton}
            onMouseEnter={onHoldButton}
            onMouseLeave={onReleaseButton}
            onTouchStart={onHoldButton}
            onTouchEnd={onReleaseButton}
          >
            <circle r="96" />
            <circle
              ref={currentLocationRef}
              className="visible-circle"
              r="20"
              fill="steelblue"
            />
          </g>
        </g>
      </svg>
    </>
  );
}

export default Labyrinth;
