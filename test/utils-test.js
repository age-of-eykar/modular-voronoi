import { assert } from 'chai';
import { inside } from "../src/utils.js";

it("inside(point, vs) should check if a point is in a polygon", () => {
    const polygon = [[1, 1], [1, 2], [2, 2], [2, 1]];
    assert.ok(inside([1.5, 1.5], polygon));
    assert.ok(inside([1.2, 1.9], polygon));
    assert.ok(!inside([0, 1.9], polygon));
    assert.ok(!inside([1.5, 2], polygon));
    assert.ok(!inside([1.5, 2.2], polygon));
    assert.ok(!inside([3, 5], polygon));
});