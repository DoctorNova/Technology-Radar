import seedrandom from "seedrandom";
import { getBezierCurvePoints, drawBezierCurvePoints } from "./bezierCurve";

export const radianToDegrees = (rad) => rad * 180 / Math.PI;

export const getCartesianCoordinates = (
  radius,
  radian,
  offset = { x: 0, y: 0 }
) => {
  return {
    x: offset.x + Math.round(radius * Math.sin(radian)),
    y: offset.y - Math.round(radius * Math.cos(radian)),
  };
};

export const coordinatesToString = (point) => point.x + "," + point.y;

export const getClassName = (o, className = "") =>
  (
    (o.className ?? "") +
    " " +
    className +
    " " +
    o.label.replace(/\s/g, "-")
  ).trim();

export const FULL_CIRCLE = 2 * Math.PI;

export function* randomNumberFactory(min, max) {
  let seed = 1;
  while (true) {
    yield min + seedrandom(seed).quick() * (max - min);
    seed++;
  }
}

export const CurvedText = ({
  fontColor,
  text,
  offset,
  radius,
  radianToStart,
  radianToEnd,
}) => {
  const bezierCurvePoints = getBezierCurvePoints(
    offset,
    radius,
    radianToStart,
    radianToEnd
  );

  const id =
    text +
    coordinatesToString(bezierCurvePoints[1]) +
    coordinatesToString(bezierCurvePoints[3]);

  const d = drawBezierCurvePoints(bezierCurvePoints);

  return (
    <>
      <path id={id} d={d} fill="transparent"></path>
      <text fill={fontColor}>
        <textPath xlinkHref={`#${id}`} textAnchor="middle" startOffset="50%">
          {text}
        </textPath>
      </text>
    </>
  );
};
