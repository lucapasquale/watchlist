import React from "react";

const THUMB_SIZE = 20;

type Props = {
  value: number;
  min: number;
  max: number;
  formatValue: (value: number) => React.ReactNode;
};

export function Mark({ value, min, max, formatValue }: Props) {
  const offset = React.useMemo(() => {
    return calcStepMarkOffset(value, [min, max]);
  }, [value, min, max]);

  return (
    <p className="absolute -translate-x-1/2" style={{ left: offset }}>
      {formatValue(value)}
    </p>
  );
}

function calcStepMarkOffset(index: number, [min, max]: [number, number]) {
  const percent = convertValueToPercentage(index, min, max);
  const thumbInBoundsOffset = getThumbInBoundsOffset(THUMB_SIZE, percent, 1);
  return `calc(${percent}% + ${thumbInBoundsOffset}px)`;
}

function convertValueToPercentage(value: number, min: number, max: number) {
  const maxSteps = max - min;
  const percentPerStep = 100 / maxSteps;
  const percentage = percentPerStep * (value - min);
  return Math.max(0, Math.min(100, percentage));
}

function getThumbInBoundsOffset(width: number, left: number, direction: number) {
  const halfWidth = width / 2;
  const halfPercent = 50;
  const offset = linearScale([0, halfPercent], [0, halfWidth]);
  return (halfWidth - offset(left) * direction) * direction;
}

function linearScale(input: readonly [number, number], output: readonly [number, number]) {
  return (value: number) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
