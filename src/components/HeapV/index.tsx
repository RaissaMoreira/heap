import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import TreeNode from "../TreeNode";
import backgroundImg from "../../assets/bg_imge.png";
import "./HeapV.scss";

enum HEAP_TYPES {
  MAX,
  MIN,
}

type Step = {
  heap: number[];
  highlight: number[];
  newNode: number;
};

class Heap {
  public heap: number[];
  public type: HEAP_TYPES;

  constructor(type = HEAP_TYPES.MAX) {
    this.heap = [];
    this.type = type;
  }

  getParentIndex(i: number) {
    return Math.floor((i - 1) / 2);
  }

  swap(i1: number, i2: number) {
    [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]];
  }

  insertWithSteps(key: number) {
    const steps = [];
    this.heap.push(key);
    let i = this.heap.length - 1;
    steps.push({ heap: [...this.heap], highlight: [i], newNode: i });

    while (i > 0) {
      const parentIndex = this.getParentIndex(i);
      if (!this.compare(this.heap[i], this.heap[parentIndex])) break;
      this.swap(i, parentIndex);
      steps.push({
        heap: [...this.heap],
        highlight: [i, parentIndex],
        newNode: parentIndex,
      });
      i = parentIndex;
    }

    return steps;
  }


  compare(a: number, b: number) {
    if (this.type === HEAP_TYPES.MAX) return a > b;
    else return a < b;
  }
}

function HeapV() {

  // Heap
  const [heapType, setHeapType] = useState(HEAP_TYPES.MAX);
  const [heap, setHeap] = useState(new Heap(HEAP_TYPES.MAX));

  // Form
  const [inputValue, setInputValue] = useState("");

  // Animations
  const [animationSteps, setAnimationSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleInsert = useCallback(() => {
    const value = parseInt(inputValue);
    if (!isNaN(value) && !isAnimating) {
      const newHeap = new Heap(heap.type);
      newHeap.heap = [...heap.heap];

      const steps = newHeap.insertWithSteps(value);
      setHeap(newHeap);
      setAnimationSteps(steps);
      setCurrentStep(0);
      setIsAnimating(true);
      setInputValue("");
    }
  }, [inputValue, heap, isAnimating]);

  const handleClear = () => {
    setHeap(new Heap(heapType));
    setAnimationSteps([]);
    setCurrentStep(0);
    setIsAnimating(false);
    setInputValue("");
  };

  useEffect(() => {
    if (isAnimating && currentStep < animationSteps.length) {
      const currentStepData = animationSteps[currentStep];
      const newHeap = new Heap(heap.type);
      newHeap.heap = [...currentStepData.heap];
      setHeap(newHeap);

      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
        if (currentStep >= animationSteps.length - 1) {
          setIsAnimating(false);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAnimating, currentStep, animationSteps, heap.type]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInsert();
    }
  };

  return (
    <div
      className="heap-container"
      style={{
        backgroundImage: `url('${backgroundImg}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="title">Heap Visualization</h1>

      <div className="input-section">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter value"
        />
        <button onClick={handleInsert} disabled={isAnimating}>Insert</button>
        <button onClick={handleClear}>Clear</button>
      </div>

      {/* Visualização do Heap como Array */}
      <div className="heap-array">
        {heap.heap.map((value, index) => (
          <motion.div
            key={index}
            className={`heap-node ${
              animationSteps[currentStep]?.highlight.includes(index)
                ? "highlight"
                : ""
            }`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            {value}
          </motion.div>
        ))}
      </div>

      {/* Visualização da Árvore */}
      <div className="tree-visualization" id="arvore">
        {heap.heap.length > 0 && (
          <svg width="100%" height="100%">
            <TreeNode
              heap={heap.heap}
              highlight={animationSteps[currentStep]?.highlight}
              index={0}
              x={document.getElementsByTagName("svg")[0]?.clientWidth / 2}
              y={50}
              stepX={150}
            />
          </svg>
        )}
      </div>

      <p className="footer">
        Copyright © 2024 - Carlos Varela | Gabriel Becher | Matheus D'Avila |
        Raissa Moreira | Gabriel Fontes
      </p>
    </div>
  );
}

export default HeapV;
