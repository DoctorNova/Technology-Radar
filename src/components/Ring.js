import {
  coordinatesToString,
  getCartesianCoordinates,
  getClassName,
  FULL_CIRCLE,
} from "./utility";
import PropTypes from "prop-types";
import Entries from "./Entry";

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

const getBezierCurvePoints = (offset, radius, radianToStart, radianToEnd) => {
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

const drawBezierCurvePoints = (points) =>
  [
    "M",
    coordinatesToString(points[0]),
    "C",
    coordinatesToString(points[1]),
    coordinatesToString(points[2]),
    coordinatesToString(points[3]),
  ].join(" ");

const Ring = ({ offset, ring, segment, entryRadius }) => {
  const bezierCurvePoints = getBezierCurvePoints(
    offset,
    ring.radius,
    segment.radianToStart,
    segment.radianToEnd
  );

  const ringD =
    drawBezierCurvePoints(bezierCurvePoints) +
    " L " +
    coordinatesToString(offset) +
    " Z ";

  return (
    <g className={getClassName(ring)} key={ring.label}>
      <path fill={ring.color} d={ringD}>
        <title>{ring.label}</title>
      </path>
      <RingLabel offset={offset} ring={ring} segment={segment} />
      <Entries offset={offset} ring={ring} segment={segment} entryRadius={entryRadius}/>
    </g>
  );
};

Ring.defaultProps = {
  offset: {
    x: 0,
    y: 0,
  },
};

Ring.propTypes = {
  offset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  segment: PropTypes.shape({
    label: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    className: PropTypes.string,
    radian: PropTypes.number.isRequired,
    radianToEnd: PropTypes.number.isRequired,
    radianToStart: PropTypes.number.isRequired,
  }).isRequired,
  ring: PropTypes.shape({
    label: PropTypes.string.isRequired,
    color: PropTypes.string,
    stroke: PropTypes.string,
    className: PropTypes.string,
    space: PropTypes.shape({ radius: PropTypes.number.isRequired }).isRequired,
    radius: PropTypes.number.isRequired,
    radiusInTheCenter: PropTypes.number.isRequired,
    entries: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        ring: PropTypes.string.isRequired,
        segment: PropTypes.string.isRequired,
        isNew: PropTypes.bool,
        moved: PropTypes.bool,
      })
    ),
  }).isRequired,
};

const RingLabel = ({ offset, ring, segment }) => {
  const bezierCurvePoints = getBezierCurvePoints(
    offset,
    ring.radiusInTheCenter,
    segment.radianToStart,
    segment.radianToEnd
  );

  const id =
    segment.label +
    ring.label +
    coordinatesToString(bezierCurvePoints[1]) +
    coordinatesToString(bezierCurvePoints[3]);
  const d = drawBezierCurvePoints(bezierCurvePoints);

  return (
    <>
      <path id={id} d={d} fill="transparent"></path>
      <text>
        <textPath xlinkHref={`#${id}`} textAnchor="middle" startOffset="50%">
          {ring.label}
        </textPath>
      </text>
    </>
  );
};

RingLabel.defaultProps = {
  offset: {
    x: 0,
    y: 0,
  },
};

RingLabel.propTypes = {
  offset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  segment: PropTypes.shape({
    label: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    className: PropTypes.string,
    radian: PropTypes.number.isRequired,
    radianToEnd: PropTypes.number.isRequired,
    radianToStart: PropTypes.number.isRequired,
  }).isRequired,
  ring: PropTypes.shape({
    label: PropTypes.string.isRequired,
    color: PropTypes.string,
    stroke: PropTypes.string,
    className: PropTypes.string,
    space: PropTypes.shape({ radius: PropTypes.number.isRequired }).isRequired,
    radius: PropTypes.number.isRequired,
    radiusInTheCenter: PropTypes.number.isRequired,
    entries: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        ring: PropTypes.string.isRequired,
        segment: PropTypes.string.isRequired,
        isNew: PropTypes.bool,
        moved: PropTypes.bool,
      })
    ),
  }).isRequired,
};

export default Ring;
export { RingLabel };