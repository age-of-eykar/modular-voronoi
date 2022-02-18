import Delaunator from "delaunator";

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
 * @returns {number} the
 */
function find_cell(data, clickCoordinates) {

}

export { precalculate, find_cell };