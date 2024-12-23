/*
 * Copyright (c) Erin Catto
 * Licensed under the MIT license
 */

import { World, Circle, Box, Edge, Testbed } from "planck";

const world = new World({ x: 0, y: -10 });

const testbed = Testbed.mount();
testbed.start(world);

const ground = world.createBody();

const v1 = { x: -10.0, y: 0.0 };
const v2 = { x: -7.0, y: -2.0 };
const v3 = { x: -4.0, y: 0.0 };
const v4 = { x: 0.0, y: 0.0 };
const v5 = { x: 4.0, y: 0.0 };
const v6 = { x: 7.0, y: 2.0 };
const v7 = { x: 10.0, y: 0.0 };

const shape1 = new Edge(v1, v2);
shape1.setNextVertex(v3);
ground.createFixture(shape1, 0.0);

const shape2 = new Edge(v2, v3);
shape2.setPrevVertex(v1);
shape2.setNextVertex(v4);
ground.createFixture(shape2, 0.0);

const shape3 = new Edge(v3, v4);
shape3.setPrevVertex(v2);
shape3.setNextVertex(v5);
ground.createFixture(shape3, 0.0);

const shape4 = new Edge(v4, v5);
shape4.setPrevVertex(v3);
shape4.setNextVertex(v6);
ground.createFixture(shape4, 0.0);

const shape5 = new Edge(v5, v6);
shape5.setPrevVertex(v4);
shape5.setNextVertex(v7);
ground.createFixture(shape5, 0.0);

const shape6 = new Edge(v6, v7);
shape6.setPrevVertex(v5);
ground.createFixture(shape6, 0.0);

world
  .createBody({
    type: "dynamic",
    position: { x: -0.5, y: 0.6 },
    allowSleep: false,
  })
  .createFixture(new Circle(0.5), 1.0);

world
  .createBody({
    type: "dynamic",
    position: { x: 1.0, y: 0.6 },
    allowSleep: false,
  })
  .createFixture(new Box(0.5, 0.5), 1.0);
