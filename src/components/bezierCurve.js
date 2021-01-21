import { getCartesianCoordinates, coordinatesToString, FULL_CIRCLE } from "./utility";

const getBezierCurveControlPointsConfig = (numberOfSegments, radius) => {
  // source: https://stackoverflow.com/questions/1734745
  // Each segment has a start and end point. For each point we need a control point to make it form a circle.
  // So we devide PI by the number of segment multiplied by two.
  // The magic number 1.317 is more accurate than the 4/3 from the stackoverlow question
  const bezierCurveOffsetFactor =
    1.317 * Math.tan(Math.PI / (numberOfSegments * 2));
  const controlPointOffset = bezierCurveOffsetFactor * radius;

  /**
   *
   *        bezierCurveOffset
   *   point ______________ controlPoint
   *         |            /
   *         |           /
   *         |          /
   *         |         /
   *         |        /
   *         |       /
   *  radius |      / controlPointRadius
   *         |–––––/
   *         |    /
   *         | * /
   *         |  /
   *         | /    * = controlPointRadian
   *         |/
   *
   */
  const controlPointRadius = Math.sqrt(controlPointOffset ** 2 + radius ** 2);
  const controlPointRadian = Math.tan(controlPointOffset / controlPointRadius);

  return {
    radius: controlPointRadius,
    radian: controlPointRadian,
  };
};

export const getBezierCurvePoints = (offset, radius, radianToStart, radianToEnd) => {
  const numberOfSegments = FULL_CIRCLE / (radianToEnd - radianToStart);
  const controlPointsConfig = getBezierCurveControlPointsConfig(
    numberOfSegments,
    radius
  );

  const startPoint = getCartesianCoordinates(radius, radianToStart, offset);
  const startPointCurve = getCartesianCoordinates(
    controlPointsConfig.radius,
    controlPointsConfig.radian + radianToStart,
    offset
  );

  const endPoint = getCartesianCoordinates(radius, radianToEnd, offset);
  const endPointCurve = getCartesianCoordinates(
    controlPointsConfig.radius,
    radianToEnd - controlPointsConfig.radian,
    offset
  );

  return [startPoint, startPointCurve, endPointCurve, endPoint];
};

export const drawBezierCurvePoints = (points) =>
  [
    "M",
    coordinatesToString(points[0]),
    "C",
    coordinatesToString(points[1]),
    coordinatesToString(points[2]),
    coordinatesToString(points[3]),
  ].join(" ");
