import { precalculate, find_cell } from "../src/voronoi.js";

it("precalculate(points) should return a valid Map<number, (number, number)[]>", () => {
  let data = precalculate([[0, 0], [1, 0], [0, 1]]);
});