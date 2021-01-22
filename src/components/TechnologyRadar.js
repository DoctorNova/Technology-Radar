import React, { useState } from "react";
import PropTypes from "prop-types";
import Ring from "./Ring";
import { EntryShape } from "./Entry";
import { CurvedText, getClassName, radianToDegrees } from "./utility";

const DEFAULTS = {
  SEGMENT: {
    fontColor: "#fff",
    color: "#3DB5BE",
  },
  RING: {
    color: "#CCCCCC",
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

const onMouseEnterEntry = (onMouseEnter, entry, event) => {
  event.currentTarget
    .closest(".segment")
    .querySelectorAll(".entry")
    .forEach((node) => node.setAttribute("opacity", "0.2"));
  event.currentTarget.setAttribute("opacity", "1");
  if (typeof onMouseEnter === "function") {
    onMouseEnter(entry, event);
  }
};

const onMouseLeaveEntry = (onMouseLeave, entry, event) => {
  event.currentTarget
    .closest(".segment")
    .querySelectorAll(".entry")
    .forEach((node) => node.setAttribute("opacity", "1"));
  if (typeof onMouseLeave === "function") {
    onMouseLeave(entry, event);
  }
};

const getSegmentConfig = (entries, rings, segment, index, segments) => {
  // divide the radian of the technology radar by the number of segments to get the radian each segment has
  const radian = TECHNOLOGY_RADAR.radian / segments.length;
  // the radianToEnd is the radian to the last point of the segment
  const radianToEnd = radian * (index + 1);
  // the radianToStart is the radian to the first point of the segment
  const radianToStart = radianToEnd - radian;

  const filterBySegment = (entry) => entry.segment === segment.label;
  const entriesConfig = entries.filter(filterBySegment).map((e) => ({
    ...e,
    onMouseEnter: onMouseEnterEntry.bind(this, e.onMouseEnter),
    onMouseLeave: onMouseLeaveEntry.bind(this, e.onMouseLeave),
  }));

  return {
    ...DEFAULTS.SEGMENT,
    ...segment,
    radian,
    radianToEnd,
    radianToStart,
    rings: rings.map(getRingConfig.bind(this, entriesConfig)),
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

const drawSegmentLabel = (segment) => {
  const outerRing = segment.rings[segment.rings.length - 1];

  if (outerRing) {
    return (
      <CurvedText
        fontColor={segment.color}
        text={segment.label}
        offset={TECHNOLOGY_RADAR}
        radius={outerRing.radius + 10}
        radianToStart={segment.radianToStart}
        radianToEnd={segment.radianToEnd}
      />
    );
  }
};

const Description = ({ entryRadius, description }) => {
  const descriptions = [
    description.normal,
    description.isNew,
    description.moved,
  ];

  return (
    <g className="description">
      {descriptions.map((label, index) => (
        <g
          key={label}
          transform={`translate(0, ${(entryRadius * 2 + 10) * index})`}
          fill={description.color}
        >
          <EntryShape
            radius={entryRadius}
            isNew={index === 1}
            moved={index === 2}
          />
          <text y={entryRadius / 2} x={entryRadius * 2 + 5}>
            {label}
          </text>
        </g>
      ))}
    </g>
  );
};

const Segment = ({ segment, entryRadius }) => {
  const onMouseEnter = (event) => {
    event.currentTarget
      .closest("svg")
      .querySelectorAll(".segment")
      .forEach((node) => node.setAttribute("opacity", "0.8"));
    event.currentTarget.setAttribute("opacity", "1");
    if (typeof segment.onMouseEnter === "function") {
      segment.onMouseEnter(segment, event);
    }
  };

  const onMouseLeave = (event) => {
    event.currentTarget
      .closest("svg")
      .querySelectorAll(".segment")
      .forEach((node) => node.setAttribute("opacity", "1"));
    if (typeof segment.onMouseLeave === "function") {
      segment.onMouseLeave(segment, event);
    }
  };

  return (
    <g
      className={getClassName(segment, "segment")}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={
        typeof segment.onClick === "function"
          ? segment.onClick.bind(this, segment)
          : undefined
      }
    >
      {drawSegmentLabel(segment)}
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
  );
};

const TechnologyRadar = ({
  entryRadius,
  entries,
  rings,
  segments,
  description,
}) => {
  const radar = segments
    .map(getSegmentConfig.bind(this, entries, rings))
    .map((segment) => <Segment key={segment.label} segment={segment} entryRadius={entryRadius} />);

  return (
    <svg viewBox="-20 -20 1040 1040" xmlns="http://www.w3.org/2000/svg">
      {radar}
      <Description description={description} entryRadius={entryRadius / 2} />
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
      onMouseEnter: PropTypes.func,
      onMouseLeave: PropTypes.func,
      onClick: PropTypes.func
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
      onMouseLeave: PropTypes.func,
      onMouseEnter: PropTypes.func,
      onClick: PropTypes.func,
    })
  ).isRequired,
  description: PropTypes.shape({
    color: PropTypes.string,
    normal: PropTypes.string.isRequired,
    isNew: PropTypes.string.isRequired,
    moved: PropTypes.string.isRequired,
  }),
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
  description: {
    color: "#808184",
    normal: "No change",
    isNew: "New",
    moved: "Moved in/out",
  },
};

export default TechnologyRadar;
