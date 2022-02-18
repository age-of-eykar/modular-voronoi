import Delaunator from "delaunator";
import { inside } from "./utils.js";

function circumcenter(a, b, c) {
    const ad = a[0] * a[0] + a[1] * a[1];
    const bd = b[0] * b[0] + b[1] * b[1];
    const cd = c[0] * c[0] + c[1] * c[1];
    const D = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]));
    return [
        1 / D * (ad * (b[1] - c[1]) + bd * (c[1] - a[1]) + cd * (a[1] - b[1])),
        1 / D * (ad * (c[0] - b[0]) + bd * (a[0] - c[0]) + cd * (b[0] - a[0])),
    ];
}

/**
 * Computes the circumcenters of the given triangles
 * @param {(number, number)[]} neighbors
 * @param {Delaunator} delaunay
 * @returns {(number, number)[]}
 */
function getCircumcenters(neighbors, delaunay) {}

function edgesOfTriangle(t) { return [3 * t, 3 * t + 1, 3 * t + 2]; }

function pointsOfTriangle(delaunay, t) {
    return edgesOfTriangle(t).map(e => delaunay.triangles[e]);
}

function triangleCenter(points, delaunay, t) {
    const vertices = pointsOfTriangle(delaunay, t).map(p => points[p]);
    return circumcenter(vertices[0], vertices[1], vertices[2]);
}

/**
 * Computes the neighbors points of the given point
 * @param {(number, number)} point
 * @param {Delaunator} delaunay 
 * @returns {(number, number)[]}
 */
function getNeighbors(delaunay, point) {}

/**
 * Precalculates a voronoi cell for each point of the provided array.
 * @warning points coordinates should be given between 0 and 1.
 * @param {(number, number)[]} points
 * @returns {Map<(number, number), (number, number)[]>}
 */
function precalculate(points) {
    let delaunay = Delaunator.from(points);
    let data = new Map();

    for (let i = 0; i < points.length; i++) {
        let point = points[i];
        let neighbors = getNeighbors(delaunay, point);
        let circumcenters = getCircumcenters(neighbors, delaunay);
        data.set(point, circumcenters)
    }

    return data;
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

export { precalculate, find_cell };