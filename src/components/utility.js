export const getCartesianCoordinates = (offset, radius, radian) => {
    return {
      x: offset.x + Math.round(radius * Math.sin(radian)),
      y: offset.y - Math.round(radius * Math.cos(radian)),
    };
  };
  
export const coordinatesToString = (point) => point.x + "," + point.y;
  
export const getClassName = (o) => ((o.className ?? "") + " " + o.label).trim();
  
export const FULL_CIRCLE = 2 * Math.PI;