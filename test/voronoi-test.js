import { assert } from 'chai';
import { precalculate, find_cell } from "../src/voronoi.js";

it("precalculate(points) should return a valid Map<number, (number, number)[]>", () => {
  let data = precalculate([[0, 0], [1, 0], [0, 1]]);
});

it("find_cell(data, points, clickCoordinates) should find 'clicked' cell id", () => {
  const points = [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]];
  const data = new Map([[0, [[0.2, 0.2], [0.2, 0.3], [0.3, 0.2], [0.3, 0.3]]],
  [1, [[0.7, 0.2], [0.7, 0.3], [0.8, 0.2], [0.8, 0.3]]],
  [2, [[0.2, 0.7], [0.2, 0.8], [0.3, 0.7], [0.3, 0.8]]],
  [3, [[0.7, 0.7], [0.7, 0.8], [0.8, 0.7], [0.8, 0.8]]]]);

  assert.equal(find_cell(data, points, [0.25, 0.25]), 0);
  assert.equal(find_cell(data, points, [0.26, 0.24]), 0);
  assert.equal(find_cell(data, points, [0.7, 0.2]), 1);
  assert.equal(find_cell(data, points, [0.73, 0.23]), 1);
  assert.equal(find_cell(data, points, [0.75, 0.75]), 3);
});