import seedrandom from "seedrandom";

export const getCartesianCoordinates = (radius, radian, offset = {x:0, y:0}) => {
    return {
      x: offset.x + Math.round(radius * Math.sin(radian)),
      y: offset.y - Math.round(radius * Math.cos(radian)),
    };
  };
  
export const coordinatesToString = (point) => point.x + "," + point.y;
  
export const getClassName = (o) => ((o.className ?? "") + " " + o.label).trim();
  
export const FULL_CIRCLE = 2 * Math.PI;

export function* randomNumberFactory(min, max) {
  let seed = 1;
  while (true) {
    yield min + seedrandom(seed).quick() * (max - min);
    seed++;
  }
}
