import React from "react";
import PropTypes from "prop-types";

const Quadrants = ({label, radius, color}) => {

}

export default function TechnologyRadar({ rings, entries }) {
  return (
    <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        
    </svg>
  );
}

TechnologyRadar.propTypes = {
  rings: PropTypes.arrayOf(PropTypes.string),
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      ring: PropTypes.string.isRequired,
    })
  ).isRequired,
};
