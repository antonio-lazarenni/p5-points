import React, { useCallback, useState } from "react";
import Sketch from "react-p5";
import P5 from "p5";
import "./styles.css";

class Point extends P5.Vector {
  x: number;
  y: number;
  color: string;
  _nearestPoint!: Point;

  constructor(x: number, y: number, color: string) {
    super();
    this.x = x;
    this.y = y;
    this.color = color;
    this._nearestPoint = null;
  }

  set nearestPoint(point: Point) {
    this._nearestPoint = point;
  }

  update(): void {
    const acc = this.sub(this.nearestPoint);

    acc.setMag(1);

    this.add(acc);
  }

  render(renderer: (point: Point) => void): void {
    renderer(this);
  }
}

const App = () => {
  const [points, setPoints] = useState<Point[]>([]);

  const setup = useCallback((p5: P5, canvasParentRef: Element) => {
    const getPoints = (n: number): Point[] =>
      Array.from({ length: n }, () => {
        const x = p5.random(p5.width);
        const y = p5.random(p5.height);
        const vec = p5.createVector(x, y);
        return new Point(vec.x, vec.y, "salmon");
      });

    p5.frameRate(60);
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef
    );

    const lol = getPoints(3).map((p, _idx, original) => {
      original.forEach((op) => {
        if (p.dist(op) === 0) {
          return;
        }
        if (!p.nearestPoint) {
          p.nearestPoint = op;
        } else {
          p.nearestPoint =
            p.dist(p.nearestPoint) > p.dist(op) ? op : p.nearestPoint;
        }
      });
      return p;
    });

    setPoints(lol);
  }, []);

  const draw = useCallback(
    (p5: P5) => {
      p5.background("DimGrey");

      const renderer = (obj: Point) => {
        p5.stroke(obj.color);
        p5.strokeWeight(10);
        p5.point(obj.x, obj.y);
        obj.update();
      };

      if (points.length) {
        points.forEach((point) => point.render(renderer));
      }
    },
    [points]
  );

  return <Sketch setup={setup} draw={draw} />;
};

export { App };
