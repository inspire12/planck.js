/*
 * Copyright (c) Erin Catto
 *
 * This source code is licensed under the MIT license.
 */

const { Vec2, World, Circle, Box, Edge, RevoluteJoint, PrismaticJoint, GearJoint, Testbed } = planck;

let world = new World(new Vec2(0, -10));

const testbed = Testbed.mount();
testbed.start(world);

let ground = world.createBody();
ground.createFixture(new Edge(new Vec2(50.0, 0.0), new Vec2(-50.0, 0.0)));

let radius1 = 1.0;
let radius2 = 2.0;

let gearA1 = world.createBody(new Vec2(10.0, 9.0));
gearA1.createFixture(new Circle(radius1), 5.0);

let plankA1 = world.createDynamicBody(new Vec2(10.0, 8.0));
plankA1.createFixture(new Box(0.5, 5.0), 5.0);

let gearA2 = world.createDynamicBody(new Vec2(10.0, 6.0));
gearA2.createFixture(new Circle(radius2), 5.0);

let jointA1 = world.createJoint(new RevoluteJoint({}, plankA1, gearA1, gearA1.getPosition()));
let jointA2 = world.createJoint(new RevoluteJoint({}, plankA1, gearA2, gearA2.getPosition()));

world.createJoint(new GearJoint({}, gearA1, gearA2, jointA1, jointA2, radius2 / radius1));

let gearB1 = world.createDynamicBody(new Vec2(-3.0, 12.0));
gearB1.createFixture(new Circle(1.0), 5.0);

let jointB1 = world.createJoint(new RevoluteJoint({}, ground, gearB1, gearB1.getPosition()));

let gearB2 = world.createDynamicBody(new Vec2(0.0, 12.0));
gearB2.createFixture(new Circle(2.0), 5.0);

let jointB2 = world.createJoint(new RevoluteJoint({}, ground, gearB2, gearB2.getPosition()));

let plankB1 = world.createDynamicBody(new Vec2(2.5, 12.0));
plankB1.createFixture(new Box(0.5, 5.0), 5.0);

let jointB3 = world.createJoint(new PrismaticJoint({
  lowerTranslation: -5.0,
  upperTranslation: 5.0,
  enableLimit: true,
}, ground, plankB1, plankB1.getPosition(), new Vec2(0.0, 1.0)));

let jointB4 = world.createJoint(new GearJoint({}, gearB1, gearB2, jointB1, jointB2, radius2 / radius1));
let jointB5 = world.createJoint(new GearJoint({}, gearB2, plankB1, jointB2, jointB3, -1.0 / radius2));

testbed.step = function() {
  let ratio, value;

  ratio = jointB4.getRatio();
  value = jointB1.getJointAngle() + ratio * jointB2.getJointAngle();
  testbed.status('ratio1', ratio);
  testbed.status('theta1 + ratio * delta', value);

  ratio = jointB5.getRatio();
  value = jointB2.getJointAngle() + ratio * jointB3.getJointTranslation();

  testbed.status('ratio2', ratio);
  testbed.status('theta2 + ratio * delta', value);
};
