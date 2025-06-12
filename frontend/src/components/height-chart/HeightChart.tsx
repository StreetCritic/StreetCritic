import { useEffect, useRef } from "react";
import styles from "./HeightChart.module.css";
import chroma from "chroma-js";

type Props = {
  /** Positions with [distance, height] */
  positions: [number, number][];
};

/**
 * Displayas a height chart for the given positions.
 */
export default function HeightChart({ positions }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx || positions.length === 0) {
      return;
    }

    canvas.width = 963 * 2;
    canvas.height = 98 * 2;

    const topPadding = 20;
    const bottomPadding = 10;
    const padding = topPadding + bottomPadding;

    const width = canvas.width;
    const height = canvas.height - padding;

    // Find max distance and max height for scaling
    const maxDistance = Math.max(...positions.map((p) => p[0]));
    const maxHeight = Math.max(...positions.map((p) => p[1]));
    const minHeight = Math.min(...positions.map((p) => p[1]));

    // Scaling factors
    const xScale = width / maxDistance;
    const yScale = height / (maxHeight - minHeight);

    ctx.clearRect(0, 0, width, height);

    const scale = chroma.scale([
      "d73027",
      "fc8d59",
      "fee090",
      "ffffbf",
      "e0f3f8",
      "91bfdb",
      "4575b4",
    ]);
    let lastDist = positions[0][0];
    let lastHeight = positions[0][1];
    positions.forEach(([dist, hgt]) => {
      ctx.beginPath();
      ctx.moveTo(lastDist * xScale, height + padding);
      ctx.lineTo(
        lastDist * xScale,
        height - (lastHeight - minHeight) * yScale + topPadding,
      );
      ctx.lineTo(
        dist * xScale,
        height - (hgt - minHeight) * yScale + topPadding,
      );
      ctx.lineTo(dist * xScale, height + padding);
      ctx.closePath();
      const grade = (hgt - lastHeight) / (dist - lastDist);
      ctx.fillStyle = scale(1 - ((grade / 6) * 10 + 0.5)).hex();
      ctx.fill();
      lastDist = dist;
      lastHeight = hgt;
    });
  }, [positions]);

  return (
    <div className={styles.root}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
