/*
 * Copyright (c) Erin Catto
 * Licensed under the MIT license
 */

import { World, Body, Edge, Circle, Testbed } from "planck";

const world = new World({ x: 0, y: -10 });

const testbed = Testbed.mount();
testbed.start(world);

const COUNT = 10;
const bodies: Body[] = [];

const ground = world.createBody();
ground.createFixture(new Edge({ x: -40.0, y: 0.0 }, { x: 40.0, y: 0.0 }), 0.0);

const circle = new Circle(1.0);

for (let i = 0; i < COUNT; ++i) {
  bodies[i] = world.createDynamicBody({ x: 0.0, y: 4.0 + 3.0 * i });
  bodies[i].createFixture(circle, 1.0);
  bodies[i].setLinearVelocity({ x: 0.0, y: -50.0 });
}
