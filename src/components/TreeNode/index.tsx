interface IProps {
  heap: number[];
  index: number;
  x: number;
  y: number;
  stepX: number;
}
const TreeNode = ({ heap, index, x, y, stepX }: IProps) => {
  if (index >= heap.length) return null;

  const leftChild = 2 * index + 1;
  const rightChild = 2 * index + 2;

  return (
    <>
      {/* Linha para o filho esquerdo */}
      {leftChild < heap.length && (
        <line
          x1={x}
          y1={y}
          x2={x - stepX}
          y2={y + 70}
          stroke="white"
          strokeWidth="2"
        />
      )}

      {/* Linha para o filho direito */}
      {rightChild < heap.length && (
        <line
          x1={x}
          y1={y}
          x2={x + stepX}
          y2={y + 70}
          stroke="white"
          strokeWidth="2"
        />
      )}

      {/* Nó atual */}
      <circle cx={x} cy={y} r="20" fill="#8a59fd" />
      <text
        x={x}
        y={y}
        fill="white"
        fontSize="14"
        fontWeight="bold"
        textAnchor="middle"
        dy=".3em"
      >
        {heap[index]}
      </text>

      {/* Renderização recursiva para filhos */}
      <TreeNode heap={heap} index={leftChild} x={x - stepX} y={y + 70} stepX={stepX / 2} />
      <TreeNode heap={heap} index={rightChild} x={x + stepX} y={y + 70} stepX={stepX / 2} />
    </>
  );
};

export default TreeNode;
