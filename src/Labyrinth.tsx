import { useCallback, useState } from "react";
import "./Labyrinth.css";

const PATH =
  "M 512,64 a 192,192 0 0,1 192,192 a 192,192 0 0,1 -192,192 a 256,256 0 0,0 256,-256 a 320,320 0 0,1 -320,320 a 192,192 0 0,1 -192,-192 a 128,128 0 0,0 128,128 a 64,64 0 0,0 64,-64 a 64,64 0 0,1 64,-64 a 64,64 0 0,0 64,-64 a 64,64 0 0,0 -64,-64 a 64,64 0 0,0 -64,64 a 64,64 0 0,1 -64,64 a 128,128 0 0,1 -128,-128";

const ANIMATION_OPTIONS = {
  duration: 10000,
  easing: "linear",
  fill: "both" as FillMode,
};

function Labyrinth() {
  const [pathAnimation, setPathAnimation] = useState<Animation>();
  const [circleAnimation, setCircleAnimation] = useState<Animation>();

  const onHoldButton = () => {
    if (!pathAnimation || !circleAnimation) return;

    const isAnimating = pathAnimation?.playState === "running";

    if (isAnimating) {
      // no-op: if already animating, do nothing
    } else {
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

  const initPath = useCallback((el: SVGPathElement) => {
    if (el !== null) {
      // get the length of the path and set up the dash so it starts 'empty'
      const lineLength = el.getTotalLength();
      el.style.strokeDasharray = lineLength + " " + lineLength;
      el.style.strokeDashoffset = "0";

      const pathAnim = el.animate(
        [{ strokeDashoffset: `${lineLength}` }, { strokeDashoffset: "0" }],
        ANIMATION_OPTIONS,
      );
      pathAnim.currentTime = 0; // prevent a flash of the finished animation
      pathAnim.pause(); // will start playing on load if not paused

      // when animation ends, prep everything to be restarted
      pathAnim.onfinish = () => {
        // may want to advance here
      };

      setPathAnimation(pathAnim);
    }
  }, []);

  const initCircle = useCallback((el: SVGCircleElement) => {
    if (el !== null) {
      el.style.offsetPath = `path("${PATH}")`;

      const circleAnim = el.animate(
        [{ offsetDistance: "0%" }, { offsetDistance: "100%" }],
        ANIMATION_OPTIONS,
      );
      circleAnim.currentTime = 0; // prevent a flash of the finished animation
      circleAnim.pause(); // will start playing on load if not paused

      setCircleAnimation(circleAnim);
    }
  }, []);

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="500"
        height="500"
        viewBox="0 0 960 960"
      >
        <g fill="none" fillRule="evenodd" transform="translate(12 13)">
          <path ref={initPath} stroke="#b58a47" strokeWidth="20" d={PATH} />
          <circle ref={initCircle} r="20" fill="steelblue"></circle>
        </g>
      </svg>

      <button
        onMouseDown={onHoldButton}
        onMouseUp={onReleaseButton}
        onMouseLeave={onReleaseButton}
        onTouchStart={onHoldButton}
        onTouchEnd={onReleaseButton}
        type="button"
      >
        Click & hold button to animate
      </button>
    </>
  );
}

export default Labyrinth;
