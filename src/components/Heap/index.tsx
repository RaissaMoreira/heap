import { useState } from 'react';
import { motion } from 'framer-motion';
import TreeNode from '../TreeNode';
import "./Heap.scss"

function Heap() {
  const [heap, setHeap] = useState<number[]>([]);
  const [newValue, setNewValue] = useState("");

  // Função para inserir no heap
  const insertHeap = (value: number) => {
    const newHeap = [...heap, value];
    let i = newHeap.length - 1;

    // Ajuste para manter propriedade do heap
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (newHeap[parent] >= newHeap[i]) break;
      [newHeap[parent], newHeap[i]] = [newHeap[i], newHeap[parent]];
      i = parent;
    }

    setHeap(newHeap);
  };

  const handleInsert = () => {
    if (newValue.trim() !== "") {
      insertHeap(parseInt(newValue));
      setNewValue("");
    }
  };

  return (
    <div className="heap-container">
      <div className="input-section">
        <input
          type="number"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Enter value"
        />
        <button onClick={handleInsert}>Insert</button>
      </div>

      {/* Visualização do Heap como Array */}
      <div className="heap-array">
        {heap.map((value, index) => (
          <motion.div
            key={index}
            className="heap-node"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            {value}
          </motion.div>
        ))}
      </div>

      {/* Visualização da Árvore */}
      <div className="tree-visualization">
        {heap.length > 0 && (
          <svg width="100%" height="300">
            <TreeNode heap={heap} index={0} x={300} y={50} stepX={150} />
          </svg>
        )}
      </div>
    </div>
  );
};
export default Heap
