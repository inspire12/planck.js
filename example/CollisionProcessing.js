/*
 * Copyright (c) Erin Catto
 * Licensed under the MIT license
 */

import { World, Vec2, Edge, Polygon, Box, Circle, Math, Testbed } from "planck";

// This test shows collision processing and tests
// deferred body destruction.
let world = new World(new Vec2(0, -10));

const testbed = Testbed.mount();
testbed.start(world);

// Ground body
world.createBody().createFixture(new Edge(new Vec2(-50.0, 0.0), new Vec2(50.0, 0.0)));

let xLo = -5.0;
let xHi = 5.0;
let yLo = 2.0;
let yHi = 35.0;

// Small triangle
let body1 = world.createDynamicBody(new Vec2(Math.random(xLo, xHi), Math.random(yLo, yHi)));
body1.createFixture(
  new Polygon([new Vec2(-1.0, 0.0), new Vec2(1.0, 0.0), new Vec2(0.0, 2.0)]),
  1.0,
);

// Large triangle (recycle definitions)
let body2 = world.createDynamicBody(new Vec2(Math.random(xLo, xHi), Math.random(yLo, yHi)));
body2.createFixture(
  new Polygon([new Vec2(-1.0, 0.0), new Vec2(1.0, 0.0), new Vec2(0.0, 2.0)]),
  1.0,
);

// Small box
let body3 = world.createDynamicBody(new Vec2(Math.random(xLo, xHi), Math.random(yLo, yHi)));
body3.createFixture(new Box(1.0, 0.5), 1.0);

// Large box (recycle definitions)
let body4 = world.createDynamicBody(new Vec2(Math.random(xLo, xHi), Math.random(yLo, yHi)));
body4.createFixture(new Box(2.0, 1.0), 1.0);

// Small circle
let body5 = world.createDynamicBody(new Vec2(Math.random(xLo, xHi), Math.random(yLo, yHi)));
body5.createFixture(new Circle(1.0), 1.0);

// Large circle
let body6 = world.createDynamicBody(new Vec2(Math.random(xLo, xHi), Math.random(yLo, yHi)));
body6.createFixture(new Circle(2.0), 1.0);

let points = [];

world.on("pre-solve", function (contact, oldManifold) {
  let manifold = contact.getManifold();

  if (manifold.pointCount == 0) {
    return;
  }

  let fixtureA = contact.getFixtureA();
  let fixtureB = contact.getFixtureB();

  let worldManifold = contact.getWorldManifold();

  for (let i = 0; i < manifold.pointCount; ++i) {
    let cp = {};
    cp.fixtureA = fixtureA;
    cp.fixtureB = fixtureB;
    cp.position = worldManifold.points[i];
    cp.normal = worldManifold.normal;
    // cp.state = state2[i];
    cp.normalImpulse = manifold.points[i].normalImpulse;
    cp.tangentImpulse = manifold.points[i].tangentImpulse;
    cp.separation = worldManifold.separations[i];
    points.push(cp);
  }
});

let bomb = null;
let MAX_NUKE = 6;

testbed.step = function () {
  // We are going to destroy some bodies according to contact
  // points. We must buffer the bodies that should be destroyed
  // because they may belong to multiple contact points.
  let nuke = [];

  // Traverse the contact results. Destroy bodies that
  // are touching heavier bodies.
  for (let i = 0; i < points.length && nuke.length < MAX_NUKE; ++i) {
    let point = points[i];

    let body1 = point.fixtureA.getBody();
    let body2 = point.fixtureB.getBody();
    let mass1 = body1.getMass();
    let mass2 = body2.getMass();

    if (mass1 > 0.0 && mass2 > 0.0) {
      if (mass2 > mass1) {
        nuke.push(body1);
      } else {
        nuke.push(body2);
      }
    }
  }

  for (let i = 0; i < nuke.length; i++) {
    let b = nuke[i];
    if (b != bomb) {
      world.destroyBody(b);
    }
  }

  points.length = 0;
};
