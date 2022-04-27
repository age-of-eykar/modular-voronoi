import Delaunator from "delaunator";
import { circumcenter } from "./utils.js";

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
 * @param {(number, number)[]} circumcenters
 * @returns {(number, number)[]}
 */
function getTriangulation(circumcenters) {
    const output = new Array(6 * (circumcenters.length - 2));
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
    const output = [];
    const stops = [];
    let lastStop = 0;
    for (let i = 1; i < gridWidth - 1; i++) {
        for (let j = 1; j < gridHeight - 1; j++) {
            const index = i * gridWidth + j;
            let neighbors = getNeighbors(delaunay, mappedHalfedges.get(index));

            const triangulized = getTriangulation(getCircumcenters(neighbors, delaunay, points));
            output.push(...triangulized);
            lastStop += triangulized.length/2;
            stops.push(lastStop);
        }
    }
    return { points: new Float32Array(output), stops: stops };
}

export { precalculate };