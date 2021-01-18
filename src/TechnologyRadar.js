import React from "react";
import PropTypes from "prop-types";

const DEFAULTS = {
  SEGMENT: {
    fontColor: "#fff",
    color: "#6011D9",
  },
  RING: {
    color: "#6011D9",
    stroke: "#666666"
  },
  ENTRY: {
    isNew: false,
    moved: 0
  },
};

const TECHNOLOGY_RADAR = (() => {
  const technologyRadarRadius = 500;

  return Object.freeze({
    radian: (2 * Math.PI),
    radius: technologyRadarRadius,
    diameter: technologyRadarRadius * 2,
    area: Math.PI * (technologyRadarRadius ** 2),
    x: technologyRadarRadius,
    y: technologyRadarRadius,
  });
})();

const getSegmentConfig = (entries, rings, segment, index, segments) => {
  // divide the radian of the technology radar by the number of segments to get the radian each segment has
  const radian = TECHNOLOGY_RADAR.radian / segments.length;
  // the radianToEnd is the radian to the last point of the segment
  const radianToEnd = radian * (index + 1);
  // the radianToStart is the radian to the first point of the segment
  const radianToStart = radianToEnd - radian;

  const filterBySegment = (entry) => entry.segment === segment.label;

  return {
    ...DEFAULTS.SEGMENT,
    ...segment,
    radian,
    radianToEnd,
    radianToStart,
    rings: rings.map(getRingConfig.bind(this, entries.filter(filterBySegment))),
  };
};

const getRingConfig = (entries, ring, index, rings) => {
  const ringsArea = TECHNOLOGY_RADAR.area / rings.length;
  const area = (index + 1) * ringsArea;
  const radius = Math.sqrt(area / Math.PI);

  const filterByRing = (entry) => entry.ring === ring.label;

  return {
    ...DEFAULTS.RING,
    ...ring,
    radius,
    entries: entries.filter(filterByRing),
  };
};

const getBezierCurveControlPointsConfig = (numberOfSegments, ring) => {
  // source: https://stackoverflow.com/questions/1734745
  // Each segment has a start and end point. For each point we need a control point to make it form a circle.
  // So we devide PI by the number of segment multiplied by two.
  // The magic number 1.317 is more accurate than the 4/3 from the stackoverlow question
  const bezierCurveOffsetFactor =
    (1.317) * Math.tan(Math.PI / (numberOfSegments * 2));
  const controlPointOffset = bezierCurveOffsetFactor * ring.radius;

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
  const controlPointRadius = Math.sqrt(
    controlPointOffset ** 2 + ring.radius ** 2
  );
  const controlPointRadian = Math.tan(controlPointOffset / controlPointRadius);

  return {
    radius: controlPointRadius,
    radian: controlPointRadian,
  };
};

const drawSegment = (segment, index, segments) => {
  return (
    <g key={segment.label}>
      {segment.rings.map((ring) => {
        const controlPointsConfig = getBezierCurveControlPointsConfig(
          segments.length,
          ring
        );

        const startPoint = getCartesianCoordinates(
          ring.radius,
          segment.radianToStart
        );
        const startPointCurve = getCartesianCoordinates(
          controlPointsConfig.radius,
          controlPointsConfig.radian + segment.radianToStart
        );

        const endPoint = getCartesianCoordinates(
          ring.radius,
          segment.radianToEnd
        );
        const endPointCurve = getCartesianCoordinates(
          controlPointsConfig.radius,
          segment.radianToEnd - controlPointsConfig.radian
        );

        const d = [
          "M",
          coordinatesToString(startPoint),
          "C",
          coordinatesToString(startPointCurve),
          coordinatesToString(endPointCurve),
          coordinatesToString(endPoint),
          "L",
          coordinatesToString(TECHNOLOGY_RADAR),
          "Z",
        ].join(" ");

        return (
          <path key={ring.label} fill={ring.color} stroke={ring.stroke} d={d} >
            <title>{ring.label}</title>
          </path>
        );
      }).reverse()}
    </g>
  );
};

const getCartesianCoordinates = (radius, radian) => {
  return {
    x: TECHNOLOGY_RADAR.x + Math.round(radius * Math.sin(radian)),
    y: TECHNOLOGY_RADAR.y - Math.round(radius * Math.cos(radian)),
  };
};

const coordinatesToString = (point) => point.x + "," + point.y;

const TechnologyRadar = ({ entries, rings, segments  }) => {
  return (
    <svg viewBox="-5 -5 1010 1010" xmlns="http://www.w3.org/2000/svg">
      
      {segments.map(getSegmentConfig.bind(this, entries, rings)).map(drawSegment)}

    </svg>
  );
};

TechnologyRadar.propTypes = {
  segments: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ),
  rings: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string,
    })
  ),
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      ring: PropTypes.string.isRequired,
      segment: PropTypes.string.isRequired,
      isNew: PropTypes.bool,
      moved: PropTypes.oneOf([1, 0, -1]),
    })
  ).isRequired,
};

TechnologyRadar.defaultProps = {
  segments: [
    { label: "Techniques", color: "#6011D9" },
    { label: "Tools", color: "#F87937" },
    { label: "Platforms", color: "#37D9F0" },
    { label: "Languages & Frameworks", color: "#F03A27" },
  ],
  rings: [
    { label: "Adopt", color: "#808080" },
    { label: "Trial", color: "#B3B3B3" },
    { label: "Assess", color: "#CCCCCC" },
    { label: "Hold", color: "#F2F2F2" },
  ],
};

export default TechnologyRadar;
