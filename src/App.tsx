import React, { useCallback, useRef, useState } from 'react';
import './App.css';
import produce from 'immer';

const numRows = 50;
const numColumns = 50;

//to clear grid
const generateEmptyGrid = () => {
  const rows = [];
  for (let i =0; i< numRows; ++i){
    rows.push(Array.from(Array(numColumns),() => 0));
  }
  return rows  
}

const App :React.FC = ()=>{
  
  //grid layout
  const [grid,setGrid] = useState(()=>generateEmptyGrid())
  
  //array of operations
  const operations = [[0,1],[0,-1],[1,1],[1,-1],[1,0],[-1,1],[-1,-1],[-1,0]]

    

  //game status
  const [running, setRunning] = useState(false)

  //to store the value in ref
  const runningRef = useRef(running)

  //handling the patterns
  const handleBoxClick = (i:number,k:number) =>{
    const newGrid = produce(grid,gridCopy=>{
      gridCopy[i][k] = grid[i][k] ? 0 : 1;
    })
    setGrid(newGrid)
  }

  //simulation
  const runSimulation = useCallback(() => {
    if(!runningRef.current){
      return;
    }
    setGrid((g)=>{
      return produce(g,(gridCopy)=>{
        for(let i =0;i<numRows;i++){
          for(let k=0;k<numColumns;k++){
            let neighbors = 0;
            //compute the neighbours
            operations.forEach(([x,y])=> {
              const newI = i+x;
              const newK = k+y;
              if(newI >= 0 && newI < numRows && newK >= 0 && newK < numColumns){
                neighbors += g[newI][newK]
              }
            })
            if(neighbors < 2 || neighbors > 3){
              gridCopy[i][k] = 0            
            } else if (g[i][k] === 0 && neighbors === 3) {
              // if it as 3 neighbours usually in the corner
              gridCopy[i][k] = 1;
            }

          }
        } 
      })
    })

    setTimeout(runSimulation,200)
  },[operations])


  
  return (
    <>
    <button onClick={()=>{
      setRunning(!running)
      if(!running){
        runningRef.current = true
        runSimulation()
      } else {
        runningRef.current = false
      }
    }}>{running? 'stop':'start'}</button>
    <button onClick={()=>setGrid(generateEmptyGrid())}>clear</button>
    <button onClick= {()=> {
      const rows = [];
      for(let i=0; i< numRows; ++i){
        rows.push(Array.from(Array(numColumns),()=>Math.random() > 0.1? 0 :1))
      }
      setGrid(rows)
    }}>random</button>
    <div className="App">
      {grid.map(
        ((rows,i) => rows.map(
          (col,k) => 
          <div 
          onClick={()=>handleBoxClick(i,k)}
          key={`${i}-${k}`}
          style={
            {width:10,
              height:10,
              backgroundColor:
              grid[i][k]? 'pink':undefined,border:'1px solid gray'}}>

              </div>)))}
    </div>
    </>
  );
}

export default App;
