import Delaunator from "delaunator";
import { inside } from "./utils.js";

/**
 * Precalculate a voronoi cell for each point of the provided array.
 * @warning points coordinates should be given between 0 and 1.
 * @param {(number, number)[]} points
 * @returns {Map<number, (number, number)[]>}
 */
function precalculate(points) {

}

/**
 * Find the id of the cell containing the given point
 * @warning points coordinates must be given between 0 and 1.
 * @param {Map<number, (number, number)[]>} data precalculated
 * @param {(number, number)[]} points are expected to be a square grid
 * @param {(number, number)} start coordinates of the click (in [0, 1]ˆ2)
 * @returns {number} the id of the polygon containing the point
 */
function find_cell(data, points, clickCoordinates) {
    const sideLength = Math.sqrt(points.length); // should be an integer
    const x = Math.floor(clickCoordinates[0] * (sideLength - 1));
    const y = Math.floor(clickCoordinates[1] * (sideLength - 1));

    const guessedIndex = points[x + y * sideLength];
    if (inside(points[guessedIndex], data.get(guessedIndex)))
        return guessedIndex;

    else for (let i = x - 1; i <= x + 1; i++)
        for (let j = y - 1; j <= y + 1; j++)
            if ((i != x || j != y)
                && i >= 0 && j >= 0 && i < sideLength && j < sideLength) {
                const index = points[i + j * sideLength];
                if (inside(points[index], data.get(index)))
                    return index;
            }

    return -1;
}

export { precalculate, find_cell };