
// import{Grid} from './game'

// export const doSwipe = ( direction: number,
//   grid: Grid[],
//   setGrid: (g: Grid[]) => void,
//   setScore: (s: number | ((prev: number) => number)) => void,
//   setmoveStep: (n: number | ((prev: number) => number)) => void,
//   checkissue: boolean,
//   account: any,
//   dummy?: boolean): Grid[] | void => {
//     if(checkissue){
//       return
//     }
//     let oldGrid = grid;
//     let newGrid: Grid[];
//     let endnum: number,dif: number;
  
//     if(direction==0){
//         endnum = 3;
//         dif=1
//         newGrid = swipe_left_up(endnum,dif,0,4,8,12,dummy)
//     }else if(direction==1){
//         endnum=-3;
//         dif=1
//         newGrid = swipe_right_down(endnum,dif,3,7,11,15,dummy)
//     }else if(direction==2){
//         endnum=-12;
//         dif=4
//         newGrid = swipe_right_down(endnum,dif,12,13,14,15,dummy)
//     }else{
//         endnum=12;
//         dif=4
//         newGrid = swipe_left_up(endnum,dif,0,1,2,3,dummy)
//     }
//     if (JSON.stringify(oldGrid) !== JSON.stringify(newGrid)) {
//       addNumber(newGrid);
//     }
//     if (dummy) {
//       return newGrid;
//     } else {
//       setGrid(newGrid);
//     }
//   };



//   const swipe_left_up=(endnum: number,dif:number,lay1: number,lay2: number,lay3: number,lay4: number,dummy?: boolean): Grid[]=>{
//       let scoreToAdd = 0;
//       function processLine(start: number, end: number, dif: number, grid: Grid[]) {
//           let cur = 0;
//           let last_index = 0;
//           let move_step = 0;
//           for (let i = start; i <= end; i += dif) {
//             if (grid[i].value === 0) {
//               move_step++;
//             } else {
//               if (cur !== 0 && cur === grid[i].value) {
//                 grid[i].value = 0;
//                 grid[last_index].value = cur * 2;
//                 scoreToAdd += cur * 2;
//                 move_step++;
//                 cur = 0;
//               } else {
//                 cur = grid[i].value;
//               }
//               if (move_step > 0 && grid[i].value !== 0) {
//                 last_index = i - (move_step * dif);
//                 grid[last_index].value = grid[i].value;
//                 grid[i].value = 0;
//               } else if (move_step === 0 && grid[i].value !== 0) {
//                 last_index = i - (move_step * dif);
//               }
//             }
//           }
//         }
//         const newGrid = cloneDeep(grid);
  
//         processLine(lay1, lay1 + endnum, dif, newGrid);
//         processLine(lay2, lay2 + endnum, dif, newGrid);
//         processLine(lay3, lay3 + endnum, dif, newGrid);
//         processLine(lay4, lay4 + endnum, dif, newGrid);
//         if (!dummy) {setScore(prev => prev + scoreToAdd)
//           if(JSON.stringify(grid) != JSON.stringify(newGrid)){
//             setmoveStep(pr=>pr+1)
//           }
//         };
    
//   return newGrid;
//     }
//     const swipe_right_down=(endnum: number,dif:number,lay1: number,lay2: number,lay3: number,lay4: number,dummy?: boolean):Grid[]=>{
//       let scoreToAdd = 0;
//       function processLine(start: number, end: number, dif: number, grid: Grid[]) {
//           let cur = 0;
//           let last_index = 0;
//           let move_step = 0;
        
//           for (let i = start; i >= end; i -= dif) {
//             if (grid[i].value === 0) {
//               move_step++;
//             } else {
//               if (cur !== 0 && cur === grid[i].value) {
//                 grid[i].value = 0;
//                 grid[last_index].value = cur * 2;
//                 scoreToAdd += cur * 2;
//                 move_step++;
//                 cur = 0;
//               } else {
//                 cur = grid[i].value;
//               }
//               if (move_step > 0 && grid[i].value !== 0) {
//                 last_index = i + (move_step * dif);
//                 grid[last_index].value = grid[i].value;
//                 grid[i].value = 0;
//               } else if (move_step === 0 && grid[i].value !== 0) {
//                 last_index = i + (move_step * dif);
//               }
//             }
//           }
//         }
//         const newGrid = cloneDeep(grid);
  
//         processLine(lay1, lay1 + endnum, dif, newGrid);
//         processLine(lay2, lay2 + endnum, dif, newGrid);
//         processLine(lay3, lay3 + endnum, dif, newGrid);
//         processLine(lay4, lay4 + endnum, dif, newGrid);
//         if (!dummy) {setScore(prev => prev + scoreToAdd)
//           if(JSON.stringify(grid) != JSON.stringify(newGrid)){
//             setmoveStep(pr=>pr+1)
//           }
         
//         };
    
//   return newGrid;
//     }




//     export const addNumber = (newGrid: Grid[]) => {
//         if(account){
//           let added = false;
//         let gridFull = false;
//         let attempts = 0;
//         while (!added) {
//           if (gridFull) {
//             break;
//           }
//           let rand = Math.floor(Math.random() * 16);
//           attempts++;
//           if (newGrid[rand].value === 0) {
//             newGrid[rand].value = Math.random() > 0.5 ? 2 : 4;
//             added = true;
//           }
//           if (attempts > 50) {
//             gridFull = true;
//             let gameOverr = checkIfGameOver();
//             if (gameOverr) {
//               alert("game over");
//             }
//           }
//         }
//         }else{
//           console.log('connect your wallet first')
//         }
        
//       };