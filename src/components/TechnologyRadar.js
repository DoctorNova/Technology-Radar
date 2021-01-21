import React from "react";
import PropTypes from "prop-types";
import Ring from "./Ring";
import Entries, { EntryShape } from "./Entry";
import { getClassName } from "./utility";

const DEFAULTS = {
  SEGMENT: {
    fontColor: "#fff",
    color: "#6011D9",
  },
  RING: {
    color: "#6011D9",
  },
  ENTRY: {
    isNew: false,
    moved: 0,
  },
};

const TECHNOLOGY_RADAR = (() => {
  const technologyRadarRadius = 500;

  return Object.freeze({
    radian: 2 * Math.PI,
    radius: technologyRadarRadius,
    diameter: technologyRadarRadius * 2,
    area: Math.PI * technologyRadarRadius ** 2,
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

  const previousRingArea = index * ringsArea;
  const previousRingRadius = Math.sqrt(previousRingArea / Math.PI);
  const space = {
    radius: radius - previousRingRadius,
  };
  const radiusInTheCenter = radius - space.radius / 2;

  const filterByRing = (entry) => entry.ring === ring.label;

  return {
    ...DEFAULTS.RING,
    ...ring,
    space,
    radius,
    radiusInTheCenter,
    entries: entries.filter(filterByRing),
  };
};

const TechnologyRadar = ({ entryRadius, entries, rings, segments }) => {
  const radar = segments
    .map(getSegmentConfig.bind(this, entries, rings))
    .map((segment) => (
      <g className={getClassName(segment)} key={segment.label}>
        {segment.rings
          .map((ring) => (
            <Ring
              key={segment.label + ring.label}
              offset={TECHNOLOGY_RADAR}
              ring={ring}
              segment={segment}
              entryRadius={entryRadius}
            />
          ))
          // Reverse the array to make the rings closer to the center
          // lie on top of the rings further away from the center.
          .reverse()}
      </g>
    ));

  return (
    <svg viewBox="-5 -5 1010 1010" xmlns="http://www.w3.org/2000/svg">
      {radar}
    </svg>
  );
};

TechnologyRadar.propTypes = {
  entryRadius: PropTypes.number,
  segments: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      className: PropTypes.string,
    })
  ),
  rings: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string,
      stroke: PropTypes.string,
      className: PropTypes.string,
    })
  ),
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      title: PropTypes.string,
      ring: PropTypes.string.isRequired,
      segment: PropTypes.string.isRequired,
      isNew: PropTypes.bool,
      moved: PropTypes.bool,
    })
  ).isRequired,
};

TechnologyRadar.defaultProps = {
  entryRadius: 10,
  segments: [
    { label: "Techniques", color: "#3DB5BE" },
    { label: "Tools", color: "#83AD78" },
    { label: "Platforms", color: "#E88744" },
    { label: "Languages & Frameworks", color: "#8D2145" },
  ],
  rings: [
    { label: "Adopt", color: "#808080" },
    { label: "Trial", color: "#B3B3B3" },
    { label: "Assess", color: "#CCCCCC" },
    { label: "Hold", color: "#F2F2F2" },
  ],
};

export default TechnologyRadar;
