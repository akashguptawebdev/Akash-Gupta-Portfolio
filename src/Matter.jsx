import React, { useEffect } from "react";
import Matter from "matter-js";
import "matter-wrap";
import "matter-attractors";

const MatterDemo = () => {
  useEffect(() => {
    // Get the canvas element
    const canvas = document.querySelector("#wrapper-canvas canvas");
    const dimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    Matter.use("matter-attractors");
    Matter.use("matter-wrap");

    function runMatter() {
      // Module aliases
      const {
        Engine,
        Events,
        Runner,
        Render,
        World,
        Body,
        Mouse,
        Common,
        Bodies,
      } = Matter;

      // Create engine
      const engine = Engine.create();

      engine.world.gravity.y = 0;
      engine.world.gravity.x = 0;
      engine.world.gravity.scale = 0.1;

      // Create renderer
      const render = Render.create({
        element: canvas.parentElement,
        engine: engine,
        options: {
          showVelocity: false,
          width: dimensions.width,
          height: dimensions.height,
          wireframes: false,
          background: "transparent",
        },
      });

      // Create runner
      const runner = Runner.create();

      // Create demo scene
      const world = engine.world;
      world.gravity.scale = 0;

      // Create a body with an attractor
      const attractiveBody = Bodies.circle(
        render.options.width / 2,
        render.options.height / 2,
        Math.max(dimensions.width / 25, dimensions.height / 25) / 2,
        {
          render: {
            fillStyle: "#000",
            strokeStyle: "#000",
            lineWidth: 0,
          },
          isStatic: true,
          plugin: {
            attractors: [
              (bodyA, bodyB) => ({
                x: (bodyA.position.x - bodyB.position.x) * 1e-6,
                y: (bodyA.position.y - bodyB.position.y) * 1e-6,
              }),
            ],
          },
        }
      );

      World.add(world, attractiveBody);

      // Add some bodies that to be attracted
      for (let i = 0; i < 60; i += 1) {
        const x = Common.random(0, render.options.width);
        const y = Common.random(0, render.options.height);
        const s =
          Common.random() > 0.6 ? Common.random(10, 80) : Common.random(4, 60);
        const polygonNumber = Common.random(3, 6);

        const body = Bodies.polygon(x, y, polygonNumber, s, {
          mass: s / 20,
          friction: 0,
          frictionAir: 0.02,
          angle: Math.round(Math.random() * 360),
          render: {
            fillStyle: "#222222",
            strokeStyle: "#000000",
            lineWidth: 2,
          },
        });

        World.add(world, body);

        const r = Common.random(0, 1);
        const circle1 = Bodies.circle(x, y, Common.random(2, 8), {
          mass: 0.1,
          friction: 0,
          frictionAir: 0.01,
          render: {
            fillStyle: r > 0.3 ? "#27292d" : "#444444",
            strokeStyle: "#000000",
            lineWidth: 2,
          },
        });

        World.add(world, circle1);

        const circle2 = Bodies.circle(x, y, Common.random(2, 20), {
          mass: 6,
          friction: 0,
          frictionAir: 0,
          render: {
            fillStyle: r > 0.3 ? "#334443" : "#222222",
            strokeStyle: "#111111",
            lineWidth: 4,
          },
        });

        World.add(world, circle2);

        const circle3 = Bodies.circle(x, y, Common.random(2, 30), {
          mass: 0.2,
          friction: 0.6,
          frictionAir: 0.8,
          render: {
            fillStyle: "#191919",
            strokeStyle: "#111111",
            lineWidth: 3,
          },
        });

        World.add(world, circle3);
      }

      // Add mouse control
      const mouse = Mouse.create(render.canvas);

      Events.on(engine, "afterUpdate", () => {
        if (!mouse.position.x) return;
        // Smoothly move the attractor body towards the mouse
        Body.translate(attractiveBody, {
          x: (mouse.position.x - attractiveBody.position.x) * 0.12,
          y: (mouse.position.y - attractiveBody.position.y) * 0.12,
        });
      });

      // Return a context for MatterDemo to control
      const data = {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function () {
          Matter.Render.stop(render);
          Matter.Runner.stop(runner);
        },
        play: function () {
          Matter.Runner.run(runner, engine);
          Matter.Render.run(render);
        },
      };

      // Initialize Matter.js
      Matter.Runner.run(runner, engine);
      Matter.Render.run(render);

      return data;
    }

    function debounce(func, wait, immediate) {
      let timeout;
      return function () {
        const context = this,
          args = arguments;
        const later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    }

    function setWindowSize() {
      dimensions.width = window.innerWidth;
      dimensions.height = window.innerHeight;

      m.render.canvas.width = dimensions.width;
      m.render.canvas.height = dimensions.height;
      return dimensions;
    }

    const m = runMatter();
    setWindowSize();

    // Update canvas size on window resize
    window.addEventListener("resize", debounce(setWindowSize, 250));

    // Cleanup on component unmount
    return () => {
      // Optionally stop Matter.js simulation or remove event listeners
      window.removeEventListener("resize", debounce(setWindowSize, 250));
    };
  }, []);

  return (
    <div
      id="wrapper-canvas"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <canvas ></canvas>
    </div>
  );
};

export default MatterDemo;
