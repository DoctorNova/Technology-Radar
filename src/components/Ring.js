import { coordinatesToString, getClassName, CurvedText } from "./utility";
import PropTypes from "prop-types";
import Entries from "./Entry";
import { getBezierCurvePoints, drawBezierCurvePoints } from "./bezierCurve";

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
      <Entries
        offset={offset}
        ring={ring}
        segment={segment}
        entryRadius={entryRadius}
      />
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
  return (
    <CurvedText
      text={ring.label}
      offset={offset}
      radius={ring.radiusInTheCenter}
      radianToStart={segment.radianToStart}
      radianToEnd={segment.radianToEnd}
    />
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
