import {
  randomNumberFactory,
  getCartesianCoordinates,
  coordinatesToString,
} from "./utility";
import PropTypes from "prop-types";

const Entries = ({ offset, ring, segment, entryRadius }) => {
  // If this is the ring in the center we don't want the point to be in the center
  const spaceRadius =
    ring.space.radius === ring.radius ? ring.radius - 150 : ring.space.radius;
  // at leat one point away from last the ring
  const minRadius = ring.radius - spaceRadius + entryRadius;
  // at most one point from the end of the ring
  const maxRadius = ring.radius - entryRadius;
  const radiusGenerator = randomNumberFactory(minRadius, maxRadius);
  const availableRadian = segment.radian / ring.entries.length;

  return ring.entries.map((entry, index) => {
    const radius = radiusGenerator.next().value;
    const radian =
      availableRadian * index + availableRadian / 2 + segment.radianToStart;
    const point = getCartesianCoordinates(radius, radian, offset);
    const bindEntryToFunc = (callback) => typeof callback === "function" ? callback.bind(this, entry) : undefined;

    return (
      <g
        key={entry.label + coordinatesToString(point)}
        className="entry"
        transform={`translate(${point.x} ${point.y})`}
        onMouseEnter={bindEntryToFunc(entry.onMouseEnter)}
        onMouseLeave={bindEntryToFunc(entry.onMouseLeave)}
        onClick={bindEntryToFunc(entry.onClick)}
        style={{
          cursor: typeof entry.onClick === "function" ? "pointer" : "default",
        }}
      >
        <EntryShape
          {...{
            ...entry,
            radius: entryRadius,
            color: segment.color,
          }}
        />
        <text
          fontSize={entryRadius}
          fill={segment.fontColor}
          y={entryRadius - 1 - entryRadius / 2}
          textAnchor="middle"
        >
          {entry.label}
        </text>
        <title>{entry.title ?? ""}</title>
      </g>
    );
  });
};

Entries.defaultProps = {
  offset: {
    x: 0,
    y: 0,
  },
  entryRadius: 10,
};

Entries.propTypes = {
  offset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  ring: PropTypes.shape({
    radius: PropTypes.number.isRequired,
    space: PropTypes.shape({ radius: PropTypes.number.isRequired }).isRequired,
    entries: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        title: PropTypes.string,
        moved: PropTypes.bool,
        isNew: PropTypes.bool,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        onClick: PropTypes.func,
      })
    ),
  }).isRequired,
  segment: PropTypes.shape({
    color: PropTypes.string.isRequired,
    fontColor: PropTypes.string.isRequired,
    radian: PropTypes.number.isRequired,
    radianToStart: PropTypes.number.isRequired,
  }).isRequired,
  entryRadius: PropTypes.number,
};

const EntryShape = ({ color, radius, moved, isNew }) => {
  let isNewBorder;
  if (isNew) {
    const borderRadius = radius + radius / 2;
    isNewBorder = (
      <>
        <circle r={borderRadius} fill="#fff" />
        <circle r={borderRadius} fill={color} opacity="0.5" />
      </>
    );
  }

  let movedBorder;
  if (moved) {
    const transform = `scale(${isNew ? 3 : 2})`;

    movedBorder = (
      <>
        <path
          fill="#fff"
          transform={transform}
          d="M6,.53A5.75,5.75,0,0,1,4.24,4.24,5.75,5.75,0,0,1,.51,6C0,6,0,6.31,0,6.47A.5.5,0,0,0,.53,7,7,7,0,0,0,7,.53a.5.5,0,1,0-1,0Z"
        />
        <path
          fill={color}
          opacity="0.5"
          transform={transform}
          d="M6,.53A5.75,5.75,0,0,1,4.24,4.24,5.75,5.75,0,0,1,.51,6C0,6,0,6.31,0,6.47A.5.5,0,0,0,.53,7,7,7,0,0,0,7,.53a.5.5,0,1,0-1,0Z"
        />
      </>
    );
  }

  return (
    <>
      {isNewBorder}
      <circle r={radius} fill={color} />
      {movedBorder}
    </>
  );
};

EntryShape.propTypes = {
  color: PropTypes.string,
  radius: PropTypes.number.isRequired,
  moved: PropTypes.bool,
  isNew: PropTypes.bool,
};

export default Entries;
export { EntryShape };
