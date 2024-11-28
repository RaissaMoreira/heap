import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import TreeNode from "../TreeNode";
import backgroundImg from '../../assets/bg_imge.png';
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

  // getLeftChildIndex(i: number) {
  //   return 2 * i + 1;
  // }

  // getRightChildIndex(i: number) {
  //   return 2 * i + 2;
  // }

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

  // depth() {
  //   return this.heap.length === 0 ? 0 : Math.floor(Math.log2(this.heap.length)) + 1;
  // }

  // size() {
  //   return this.heap.length;
  // }

  // static fromArray(array: number[]) {
  //   const newHeap = new Heap();
  //   for (const item of array) {
  //     newHeap.heap.push(item);
  //   }
  //   return newHeap;
  // }

  compare(a: number, b: number) {
    if (this.type === HEAP_TYPES.MAX) return a > b;
    else return a < b;
  }
}

function HeapV() {
  // OLD
  // const [heap, setHeap] = useState<number[]>([]);
  // const [newValue, setNewValue] = useState("");

  // Heap
  const [heapType, setHeapType] = useState(HEAP_TYPES.MAX);
  const [heap, setHeap] = useState(new Heap(HEAP_TYPES.MAX));

  // Form
  const [inputValue, setInputValue] = useState("");

  // Animations
  const [animationSteps, setAnimationSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Talvez use?
  // const [windowWidth, setWindowWidth] = useState(0);

  // Função para inserir no heap
  // const insertHeap = (value: number) => {
  //   const newHeap = [...heap, value];
  //   let i = newHeap.length - 1;

  //   // Ajuste para manter propriedade do heap
  //   while (i > 0) {
  //     const parent = Math.floor((i - 1) / 2);
  //     if (newHeap[parent] >= newHeap[i]) break;
  //     [newHeap[parent], newHeap[i]] = [newHeap[i], newHeap[parent]];
  //     i = parent;
  //   }

  //   setHeap(newHeap);
  // };

  //   const handleInsert = () => {
  //     if (newValue.trim() !== "") {
  //       insertHeap(parseInt(newValue));
  //       setNewValue("");
  //     }
  //   };

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

  return (
    <div className="heap-container"
      style={{
        backgroundImage: `url('${backgroundImg}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className='title'>Heap Visualization</h1>

      <div className="input-section">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
        />
        <button onClick={handleInsert}>Insert</button>
      </div>

      {/* Visualização do Heap como Array */}
      <div className="heap-array">
        {heap.heap.map((value, index) => (
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
      <div className="tree-visualization" id="arvore">
        {heap.heap.length > 0 && (
          <svg width="100%" height="100%">
            <TreeNode
              heap={heap.heap}
              index={0}
              x={document.getElementsByTagName("svg")[0]?.clientWidth / 2}
              y={50}
              stepX={150}
            />
          </svg>
        )}
      </div>

      <p className='footer'>Copyright © 2024 - Carlos Varela | Gabriel Becher | Matheus D'Avila | Raissa Moreira | Gabriel Fontes</p>
    </div>
  );
}

export default HeapV;
