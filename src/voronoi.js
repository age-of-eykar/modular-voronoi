import Delaunator from "delaunator";
import { inside, circumcenter } from "./utils.js";

/**
 * Computes the circumcenters of the given triangles
 * @param {(number, number)[]} neighbors
 * @param {Delaunator} delaunay
 * @returns {(number, number)[]}
 */
function getCircumcenters(neighbors, delaunay, points) {
    const result = [];
    for (let i = 0; i < neighbors.length; i++) {
        let e = neighbors[i];
        let a = points[delaunay.triangles[e]];
        let b = points[delaunay.triangles[nextHalfedge(e)]];
        let c = points[delaunay.triangles[prevHalfedge(e)]];
        result.push(circumcenter(a, b, c))
    }
    return result;
}

/**
 * Returns the triangulized polygon
 * @param {(number, number)[]} neighbors
 * @param {Delaunator} delaunay
 * @param {int[]} points
 * @returns {(number, number)[]}
 */
function getTriangulation(neighbors, delaunay, points) {
    const circumcenters = getCircumcenters(neighbors, delaunay, points);
    const output = new Float32Array(6 * (circumcenters.length - 2));
    for (let i = 0; i < circumcenters.length - 2; i++) {
        output[6 * i] = circumcenters[0][0];
        output[6 * i + 1] = circumcenters[0][1];
        output[6 * i + 2] = circumcenters[i + 1][0];
        output[6 * i + 3] = circumcenters[i + 1][1];
        output[6 * i + 4] = circumcenters[i + 2][0];
        output[6 * i + 5] = circumcenters[i + 2][1];
    }
    return output;
}

function prevHalfedge(e) { return (e % 3 === 0) ? e + 2 : e - 1; }

function nextHalfedge(e) { return (e % 3 === 2) ? e - 2 : e + 1; }

/**
 * Computes the neighbors points of the given point
 * @param {(number, number)} point
 * @param {Delaunator} delaunay 
 * @returns {(number, number)[]}
 */
function getNeighbors(delaunay, start) {
    const result = [];
    let incoming = start;
    do {
        result.push(incoming);
        const outgoing = nextHalfedge(incoming);
        incoming = delaunay.halfedges[outgoing];
    } while (incoming !== -1 && incoming !== start);

    return result;
}

/**
 * Creates a map from a point to its leftmost incoming halfedge
 * @param {(number, number)} points
 * @param {Delaunator} delaunay
 * @returns {Map<(number, number), number>}
 */
function createPointToHalfedgeMap(delaunay) {
    const index = new Map();
    for (let i = 0; i < delaunay.triangles.length; i++) {
        const endpoint = delaunay.triangles[nextHalfedge(i)];
        if (!index.has(endpoint) || delaunay.halfedges[i] === -1)
            index.set(endpoint, i);
    }
    return index;
}

/**
 * Precalculates a triangulized voronoi cell for each point of the provided array.
 * @warning points coordinates should be given between 0 and 1.
 * @param {(number, number)[]} points
 * @returns {Float32Array[]} output
 */
function precalculate(points, gridWidth, gridHeight) {
    const delaunay = Delaunator.from(points);
    const mappedHalfedges = createPointToHalfedgeMap(delaunay);
    const data = [];
    for (let i = 1; i < gridWidth - 1; i++) {
        for (let j = 1; j < gridHeight - 1; j++) {
            const index = i * gridWidth + j;
            let neighbors = getNeighbors(delaunay, mappedHalfedges.get(index));
            data.push(getTriangulation(neighbors, delaunay, points));
        }
    }
    return data;
}

/* todo: adapt to triangles

 * Find the id of the cell containing the given point
 * @warning points coordinates must be given between 0 and 1.
 * @param {Map<number, (number, number)[]>} data precalculated
 * @param {(number, number)[]} points are expected to be a square grid
 * @param {(number, number)} start coordinates of the click (in [0, 1]ˆ2)
 * @returns {number} the id of the polygon containing the point
 
function findCell(data, points, clickCoordinates) {
    const sideLength = Math.sqrt(points.length); // should be an integer
    const x = Math.min(Math.floor(clickCoordinates[0] * sideLength), sideLength - 1);
    const y = Math.min(Math.floor(clickCoordinates[1] * sideLength), sideLength - 1);
    const guessedIndex = x + y * sideLength;

    if (inside(points[guessedIndex], data.get(guessedIndex))) {
        return guessedIndex;
    } else for (let i = x - 1; i <= x + 1; i++)
        for (let j = y - 1; j <= y + 1; j++)
            if ((i != x || j != y)
                && i >= 0 && j >= 0 && i < sideLength && j < sideLength) {
                const index = i + j * sideLength;
                if (inside(points[index], data.get(index)))
                    return index;
            }

    return -1;
}
*/

export { precalculate };