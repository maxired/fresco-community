import { Application, Graphics, Ticker, utils } from "pixi.js";
import Tween, { Quad } from "gsap";
import { useRef, useEffect, useState, RefObject } from "react";

const duration = 1;
const radius = 20;
const lineWidth = 10;
const margin = lineWidth / 2;
const ease = Quad.easeIn;

export const useRoundedRectangleProgress = (
  progress: number,
  color: string
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pixi, setPixi] = useState<Application>();
  const currentPositionRef = useRef<number>(0);

  useEffect(() => {
    if (pixi) {
      const { perimeter } = getPerimeter(pixi);
      const endPosition = perimeter * progress;

      const tween = Tween.to(currentPositionRef, {
        current: endPosition,
        duration,
        ease,
      });

      return () => {
        tween.kill();
      };
    }
  }, [progress, pixi]);

  useEffect(() => {
    const app = new Application({
      backgroundAlpha: 0,
      antialias: true,
      resizeTo: ref.current?.parentElement!,
      sharedTicker: true,
    });

    setPixi(app);

    const onTick = () => {
      drawRoundedRectangleProgress(app, currentPositionRef.current, color);
    };

    Ticker.shared.add(onTick);

    if (ref.current) {
      ref.current.appendChild(app.view);
      app.stage.addChild(new Graphics());
    }

    return () => {
      Ticker.shared.remove(onTick);
      app.destroy(true, true);
    };
  }, []);

  return ref;
};

const drawRoundedRectangleProgress = (
  app: Application,
  current: number,
  color: string
) => {
  const {
    width,
    height,
    topLeftStart,
    top,
    topRight,
    right,
    bottomRight,
    bottom,
    bottomLeft,
    left,
    topLeftEnd,
  } = getPerimeter(app);

  const g = app.stage.children[0] as Graphics;
  g.clear().lineStyle({ color: utils.string2hex(color), width: lineWidth });

  // topLeftStart
  if (current > topLeftStart) {
    g.arc(
      radius + margin,
      radius + margin,
      radius,
      -Math.PI + Math.PI / 4,
      -Math.PI / 2
    );
  } else {
    g.arc(
      radius + margin,
      radius + margin,
      radius,
      -Math.PI + Math.PI / 4,
      -Math.PI + Math.PI / 4 + ((current / topLeftStart) * Math.PI) / 4
    );
    return;
  }

  // top
  if (current > top) {
    g.lineTo(radius + width + margin, margin);
  } else {
    g.lineTo(radius + current + margin, margin);
    return;
  }

  // top right
  if (current > topRight) {
    g.arc(radius + width + margin, radius + margin, radius, -Math.PI / 2, 0);
  } else {
    g.arc(
      radius + width + margin,
      radius + margin,
      radius,
      -Math.PI / 2,
      -Math.PI / 2 + (current - top) / radius
    );
    return;
  }

  // right
  if (current > right) {
    g.lineTo(radius * 2 + width + margin, radius + height + margin);
  } else {
    g.lineTo(radius * 2 + width + margin, radius + margin + current - topRight);
    return;
  }

  // bottomRight
  if (current > bottomRight) {
    g.arc(
      radius + width + margin,
      radius + height + margin,
      radius,
      0,
      Math.PI / 2
    );
  } else {
    g.arc(
      radius + width + margin,
      radius + height + margin,
      radius,
      0,
      (current - right) / radius
    );
    return;
  }

  // bottom
  if (current > bottom) {
    g.lineTo(margin + radius, radius * 2 + margin + height);
  } else {
    g.lineTo(
      margin + radius + width - (current - bottomRight),
      radius * 2 + margin + height
    );
    return;
  }

  // bottomLeft
  if (current > bottomLeft) {
    g.arc(
      margin + radius,
      radius + height + margin,
      radius,
      Math.PI / 2,
      Math.PI
    );
  } else {
    g.arc(
      margin + radius,
      radius + height + margin,
      radius,
      Math.PI / 2,
      Math.PI / 2 + (current - bottom) / radius
    );
    return;
  }

  // left
  if (current > left) {
    g.lineTo(margin, margin + radius);
  } else {
    g.lineTo(margin, margin + radius + height - (current - bottomLeft));
    return;
  }

  // topLeftEnd
  if (current >= topLeftEnd) {
    g.arc(
      radius + margin,
      radius + margin,
      radius,
      -Math.PI,
      -Math.PI + Math.PI / 4
    );
  } else {
    g.arc(
      radius + margin,
      radius + margin,
      radius,
      -Math.PI,
      -Math.PI + Math.PI / 4
    );
    -Math.PI + ((current - left / topLeftStart) * Math.PI) / 4;
    return;
  }
};
const getPerimeter = (app: Application) => {
  try {
    const width = app.screen.width - 2 * radius - 2 * margin;
    const height = app.screen.height - 2 * radius - 2 * margin;

    const topLeftStart = (Math.PI / 4) * radius;
    const top = topLeftStart + width;
    const topRight = top + (Math.PI / 2) * radius;
    const right = topRight + height;
    const bottomRight = right + (Math.PI / 2) * radius;
    const bottom = bottomRight + width;
    const bottomLeft = bottom + (Math.PI / 2) * radius;
    const left = bottomLeft + height;
    const topLeftEnd = left + (Math.PI / 4) * radius;
    const perimeter = left;
    return {
      width,
      height,
      topLeftStart,
      top,
      topRight,
      right,
      bottomRight,
      bottom,
      bottomLeft,
      left,
      topLeftEnd,
      perimeter,
    };
  } catch (e) {
    console.error(e);
    console.log("app", app);
    throw e;
  }
};
