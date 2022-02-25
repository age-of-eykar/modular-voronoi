import { assert } from 'chai';
import { precalculate, find_cell } from "../src/voronoi.js";
import { Delaunay } from "d3-delaunay";
import { circumcenter, createCircumcenterTab } from '../src/utils.js';

it("precalculate(points) should return a valid Map<number, (number, number)[]>", () => {
  const points = [[0.950099732338725, 0.2725575431902938], [0.36450625746189247, 0.8302913568299969],
  [0.9017993121359049, 0.07306533945650173], [0.01812935818217143, 0.30858601429506094],
  [0.2678116192139912, 0.9056383931372407], [0.32371171405513877, 0.270139487615614],
  [0.6870909422359167, 0.1867566710912385], [0.35429148242683683, 0.6787461575006426],
  [0.08199385221735411, 0.8107734151443923], [0.4672234222248105, 0.3333654842306618],
  [0.08278925570952456, 0.7169591673568568], [0.07393918186934278, 0.07628901659309206],
  [0.15308839946063635, 0.6395719099436538], [0.5868256989092903, 0.43097369338725355],
  [0.20233732594672393, 0.6168042953286968], [0.24168137547190527, 0.7789859548186759],
  [0.4383809390742728, 0.15769870750964832], [0.17073848069455178, 0.4044509704025028],
  [0.7701727874280495, 0.15603904381147626], [0.855094218694758, 0.03937000692669179]];

  let data = precalculate(points);

  const delaunay = Delaunay.from(points).voronoi([0, 0, 1, 1]);

  const circumcenterTab = createCircumcenterTab(data);

  console.log('out data:', circumcenterTab);
  console.log('delaunay:', delaunay._circumcenters);

  assert.equal(circumcenterTab, delaunay._circumcenters);
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