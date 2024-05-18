import modifyColor from './modifyColor';

const calculateBackgroundColor = (
  color: string,
  hoverAmount: number,
  activeAmount: number,
) =>
  [
    color,
    modifyColor(color, hoverAmount),
    modifyColor(color, activeAmount),
  ] as const;

export default calculateBackgroundColor;
