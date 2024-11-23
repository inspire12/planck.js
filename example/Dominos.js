/*
 * Copyright (c) Erin Catto
 *
 * This source code is licensed under the MIT license.
 */

const { Vec2, World, Edge, Box, RevoluteJoint, DistanceJoint, Circle, Testbed } = planck;

let world = new World(new Vec2(0, -10));

const testbed = Testbed.mount();
testbed.width = 50;
testbed.height = 50;
testbed.start(world);

let ground = world.createBody();
ground.createFixture(new Edge(new Vec2(-40, 0), new Vec2(40, 0)), 0);

world
  .createBody(new Vec2(-1.5, 10))
  .createFixture(new Box(6, 0.25), 0);

let columnShape = new Box(0.1, 1);

for (let i = 0; i < 10; ++i) {
  world
    .createDynamicBody(new Vec2(-6 + 1 * i, 11.25))
    .createFixture(columnShape, {
      density: 20,
      friction: 0.1,
    });
}

world
  .createBody(new Vec2(1, 6))
  .createFixture(new Box(7, 0.25, new Vec2(), 0.3), 0);

let b2 = world.createBody(new Vec2(-7, 4));
b2.createFixture(new Box(0.25, 1.5), 0);

let b3 = world.createDynamicBody(new Vec2(-0.9, 1), -0.15);
b3.createFixture(new Box(6, 0.125), 10);

let jd = {
  collideConnected: true,
};

world.createJoint(new RevoluteJoint(jd, ground, b3, new Vec2(-2, 1)));

let b4 = world.createDynamicBody(new Vec2(-10, 15));
b4.createFixture(new Box(0.25, 0.25), 10);

world.createJoint(new RevoluteJoint(jd, b2, b4, new Vec2(-7, 15)));

let b5 = world.createDynamicBody(new Vec2(6.5, 3));

{
  let fd = {
    density: 10,
    friction: 0.1,
  };

  b5.createFixture(new Box(1, 0.1, new Vec2(0, -0.9), 0), fd);
  b5.createFixture(new Box(0.1, 1, new Vec2(-0.9, 0), 0), fd);
  b5.createFixture(new Box(0.1, 1, new Vec2(0.9, 0), 0), fd);
}

world.createJoint(new RevoluteJoint(jd, ground, b5, new Vec2(6, 2)));

let b6 = world.createDynamicBody(new Vec2(6.5, 4.1));
b6.createFixture(new Box(1, 0.1), 30);

world.createJoint(new RevoluteJoint(jd, b5, b6, new Vec2(7.5, 4)));

let b7 = world.createDynamicBody(new Vec2(7.4, 1));
b7.createFixture(new Box(0.1, 1), 10);

world.createJoint(new DistanceJoint({
  bodyA: b3,
  localAnchorA: new Vec2(6, 0),
  bodyB: b7,
  localAnchorB: new Vec2(0, -1)
}));

{
  let radius = 0.2;
  let circleShape = new Circle(radius);
  for (let i = 0; i < 4; ++i) {
    let body = world.createDynamicBody(new Vec2(5.9 + 2 * radius * i, 2.4));
    body.createFixture(circleShape, 10);
  }
}
