// import React, { useState, useEffect } from "react";
// import { cloneDeep } from 'lodash';
// import { TransactionBlock } from '@mysten/sui.js/transactions';

// import { useEvent, getColors } from "./util";
// import Swipe from "react-easy-swipe";
// import './game.css';
// import { init2 } from './move_logic'; // 相对路径根据你的项目结构调整
// import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';



// type Grid = {
//     row: number,
//     col:number,
//     value: number
// };
// //  type GridLi = Grid[]

// let checkissue = true
// function App() {
//     function createGridList(): Grid[]{
//         const grids:Grid[] = [];
      
//         for (let i = 0; i < 16; i++) {
//           grids.push({
//             row: Math.floor(i / 4),
//             col: i % 4,
//             value: 0,
//           });
//         }
      
//         return grids;
//       }

//   const UP = 38;
//   const DOWN = 40;
//   const LEFT = 37;
//   const RIGHT = 39;

//   const [grid, setGrid] = useState<Grid[]>(createGridList());

//   const [gameOver, setGameOver] = useState<boolean>(false);

//   const init = () => {
//     let newGrid = cloneDeep(grid);
//     addNumber(newGrid);
//     addNumber(newGrid);
//     setGrid(newGrid);
//   };
  
//   function ConnectedAccount() {
//     const account = useCurrentAccount();
  
//     if (!account) {
//       return null;
//     }
//     checkissue = false
//     // create_grid()
  
//     return <div>Connected to {account.address}</div>;
//   }

//   const addNumber = (newGrid: Grid[]) => {
//     let added = false;
//     let gridFull = false;
//     let attempts = 0;
//     while (!added) {
//       if (gridFull) {
//         break;
//       }
//       let rand = Math.floor(Math.random() * 16);
//       attempts++;
//       if (newGrid[rand].value === 0) {
//         newGrid[rand].value = Math.random() > 0.5 ? 2 : 4;
//         added = true;
//       }
//       if (attempts > 50) {
//         gridFull = true;
//         let gameOverr = checkIfGameOver();
//         if (gameOverr) {
//           alert("game over");
//         }
//       }
//     }
//   };
  

//   const doSwipe = (direction: number,l1: number,l2: number,l3: number,l4: number,dummy?: boolean): Grid[] | void => {
//     if(checkissue){
//       return
//     }
//     let oldGrid = grid;
//     let newGrid: Grid[];
//     let endnum: number,dif: number;
  
//     if(direction==0){
//         endnum = 3;
//         dif=1
//         newGrid = swipe_left_up(endnum,dif,l1,l2,l3,l4)
//     }else if(direction==1){
//         endnum=-3;
//         dif=1
//         newGrid = swipe_right_down(endnum,dif,l1,l2,l3,l4)
//     }else if(direction==2){
//         endnum=-12;
//         dif=4
//         newGrid = swipe_right_down(endnum,dif,l1,l2,l3,l4)
//     }else{
//         endnum=12;
//         dif=4
//         newGrid = swipe_left_up(endnum,dif,l1,l2,l3,l4)
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
//   const swipe_left_up=(endnum: number,dif:number,lay1: number,lay2: number,lay3: number,lay4: number): Grid[]=>{
//     function processLine(start: number, end: number, dif: number, grid: Grid[]) {
//         let cur = 0;
//         let last_index = 0;
//         let move_step = 0;
      
//         for (let i = start; i <= end; i += dif) {
//           if (grid[i].value === 0) {
//             move_step++;
//           } else {
//             if (cur !== 0 && cur === grid[i].value) {
//               grid[i].value = 0;
//               grid[last_index].value = cur * 2;
//               move_step++;
//               cur = 0;
//             } else {
//               cur = grid[i].value;
//             }
//             if (move_step > 0 && grid[i].value !== 0) {
//               last_index = i - (move_step * dif);
//               grid[last_index].value = grid[i].value;
//               grid[i].value = 0;
//             } else if (move_step === 0 && grid[i].value !== 0) {
//               last_index = i - (move_step * dif);
//             }
//           }
//         }
//       }
//       const newGrid = cloneDeep(grid);

//       processLine(lay1, lay1 + endnum, dif, newGrid);
//       processLine(lay2, lay2 + endnum, dif, newGrid);
//       processLine(lay3, lay3 + endnum, dif, newGrid);
//       processLine(lay4, lay4 + endnum, dif, newGrid);
      
  
// return newGrid;
//   }
//   const swipe_right_down=(endnum: number,dif:number,lay1: number,lay2: number,lay3: number,lay4: number):Grid[]=>{
//     function processLine(start: number, end: number, dif: number, grid: Grid[]) {
//         let cur = 0;
//         let last_index = 0;
//         let move_step = 0;
      
//         for (let i = start; i >= end; i -= dif) {
//           if (grid[i].value === 0) {
//             move_step++;
//           } else {
//             if (cur !== 0 && cur === grid[i].value) {
//               grid[i].value = 0;
//               grid[last_index].value = cur * 2;
//               move_step++;
//               cur = 0;
//             } else {
//               cur = grid[i].value;
//             }
//             if (move_step > 0 && grid[i].value !== 0) {
//               last_index = i + (move_step * dif);
//               grid[last_index].value = grid[i].value;
//               grid[i].value = 0;
//             } else if (move_step === 0 && grid[i].value !== 0) {
//               last_index = i + (move_step * dif);
//             }
//           }
//         }
//       }
//       const newGrid = cloneDeep(grid);

//       processLine(lay1, lay1 + endnum, dif, newGrid);
//       processLine(lay2, lay2 + endnum, dif, newGrid);
//       processLine(lay3, lay3 + endnum, dif, newGrid);
//       processLine(lay4, lay4 + endnum, dif, newGrid);
      
  
// return newGrid;
//   }
//   const checkIfGameOver = (): boolean => {
//     let checker = doSwipe(0,0,4,8,12,true);
//     if (JSON.stringify(grid) !== JSON.stringify(checker)) {
//       return false;
//     }

//     let checker2 = doSwipe(2,12,13,14,15,true);
//     if (JSON.stringify(grid) !== JSON.stringify(checker2)) {
//       return false;
//     }

//     let checker3 = doSwipe(1,3,7,11,15,true);
//     if (JSON.stringify(grid) !== JSON.stringify(checker3)) {
//       return false;
//     }

//     let checker4 = doSwipe(3,0,1,2,3,true);
//     if (JSON.stringify(grid) !== JSON.stringify(checker4)) {
//       return false;
//     }

//     return true;
//   };
//   const resetGame = () => {
//     setGameOver(false);
//     const emptyGrid: Grid[] = 
//       createGridList();
//     addNumber(emptyGrid);
//     addNumber(emptyGrid);
//     setGrid(emptyGrid);
//   };
//   const start = () =>{
//     if(!ConnectedAccount()){
//       const result = confirm('You need connect your wallet first!');
//     }else{
      
//     }
//   }

//   const handleKeyDown = (e: Event) => {
//     const event = e as KeyboardEvent;
//     if (gameOver) {
//       return;
//     }
//     switch (event.keyCode) {
//       case UP:
//         doSwipe(3,0,1,2,3);
//         break;
//       case DOWN:
//         doSwipe(2,12,13,14,15);
//         break;
//       case LEFT:
//         doSwipe(0,0,4,8,12);
//         break;
//       case RIGHT:
//         doSwipe(1,3,7,11,15);
//         break;
//       default:
//         break;
//     }

//     let gameOverr = checkIfGameOver();
//     if (gameOverr) {
//       setGameOver(true);
//     }
//   };

//   useEffect(() => {
//     init();
//   }, []);

//   useEvent("keydown", handleKeyDown);
//   return (
//     <div className="App" 
//     style={{
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       height: "100vh",
//       width: "100vw",
//       background: "#D2E3F1",
//       //whole bg
//     }}>
//       <div
//         style={{
//           width: 345,
//           margin: "auto",
//           marginTop: 30,
//         }}
//       >
//         <div style={{ display: "flex" }}>
//           <div
//             style={{
//               fontFamily: "sans-serif",
//               flex: 1,
//               fontWeight: "700",
//               fontSize: 40,
//               marginLeft: 113,
//               color: "#2775b6",
//             }}
//           >
//             SwSui
//           </div>
//           <div className="App" id = 'ewallet'>
//               <header className="App-header">
//               <div className={ConnectedAccount() ? "wallet-wrapper connected" : "wallet-wrapper"}>
//                   <ConnectButton />
//                   <img src='/ewallet.jpg' alt="Connect" className={ConnectedAccount() ? "ywallet-img" : "nwallet-img"} />
//                 </div>
//               </header>
//             </div>
//         </div>
//         <div
//           style={{
//             background: "#A3BBDB",
//             //grid background
//             width: "max-content",
//             height: "max-content",
//             margin: "auto",
//             padding: 5,
//             borderRadius: 25,
//             marginTop: 10,
//             position: "relative",
//           }}
//         >
//           {gameOver && (
//             <div style={style.gameOverOverlay as React.CSSProperties}>
//               <div>
//                 <div
//                   style={{
//                     fontSize: 30,
//                     fontFamily: "sans-serif",
//                     fontWeight: "900",
//                     color: "#776E65",
//                   }}
//                 >
//                   Game Over
//                 </div>
//                 <div>
//                   <div
//                     style={{
//                       flex: 1,
//                       marginTop: "auto",
//                     }}
//                   >
//                     <div onClick={resetGame} style={style.tryAgainButton}>
//                       Try Again
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//              {!ConnectedAccount() && (
//             <div style={style.gameOverOverlay as React.CSSProperties}>
//               <div>
//                 <div>
//                   <div
//                     style={{
//                       flex: 1,
//                       marginTop: "auto",
//                     }}
//                   >
//                     <div style={style.startButton}>
//                       Sign to unlock
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//           <Swipe
//             onSwipeDown={() => {
//             doSwipe(2,12,13,14,15);
//             }}
//             onSwipeLeft={() => doSwipe(0,0,4,8,12)}
//             onSwipeRight={() =>  doSwipe(1,3,7,11,15)}
//             onSwipeUp={() => doSwipe(3,0,1,2,3)}
//             style={{ overflowY: "hidden" }}
//           >
//             {grid.map((row, oneIndex) => {
//               return (
//                 <div style={{ position: "relative", width: 400, height: 400 }}>
//                 {grid.map(({ row, col, value }, index) => (
//                   <div
//                     key={index}
//                     style={{
//                       position: "absolute",
//                       top: row * 100,
//                       left: col * 100,
//                       width: 100,
//                       height: 100
//                     }}
//                   >
//                     <Block num={value} />
//                   </div>
//                 ))}
//               </div>
              
//               );
//             })}
//           </Swipe>
//         </div>
//       </div>
//     </div>
//   );
   
// }

// const Block = ({ num }:any) => {
//   const { blockStyle } = style;
//   const lvimage: Record<string, string> = {
//     2: '/lv1.jpg',
//     4: '/lv2.jpg',
//     8: '/lv3.jpg',
//     16: '/lv4.jpg',
//     32: '/lv5.jpg',
//     64: '/lv6.jpg',
//     128: '/lv7.jpg',
//     256: '/lv8.jpg',
//     512: '/lv9.jpg',
//     1024: '/lv10.jpg',
//     2048: '/lv11.jpg',
//     4096: '/lv12.jpg',
//     8192: '/lv13.jpg',
//   };
// //set grid 
//   return (
//     <div
//       style={{
//         ...blockStyle,
//         background: getColors(num),
//         color: num === 2 || num === 4 ? "#645B52" : "#F7F4EF",
//       }}
//     >
//       {num !== 0 ? <img
//     src={lvimage[num]}
//     alt={num.toString()}
//     style={{ width: "100%", height: "100%" }}
//   /> : ""}
      
//       {/* <img
//     src={`/assets/${num}.jpg`}
//     alt={num.toString()}
//     style={{ width: "100%", height: "100%" }}
//   /> */}
  
//     </div>
//   );
// };

// const style = {
//   blockStyle: {
//     height: 80,
//     width: 80,
//     background: "lightgray",
//     margin: 3,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     fontSize: 45,
//     fontWeight: "800",
//     color: "white",
//   },
//   tryAgainButton: {
//     padding: 10,
//     background: "#2774b6",
//     color: "#F8F5F0",
//     width: 80,
//     borderRadius: 7,
//     fontWeight: "900",
//     cursor: "pointer",
//     margin: "auto",
//     marginTop: 20,
//   },
//   startButton: {
//     padding: 20,
//     background: 'linear-gradient(to right, #225fc8, #6695dd, #225fc8)',
//   backgroundSize: '200% 100%',
//   animation: 'gradientMove 5s ease infinite',
//     color: "#F8F5F0",
//     borderRadius: 30,
//     fontWeight: "700",
//     cursor: "pointer",
//     margin: "auto",
//     marginTop: 20,
    
//   },
//   gameOverOverlay: {
//     position: "absolute",
//     height: "100%",
//     width: "100%",
//     left: 0,
//     top: 0,
//     borderRadius: 5,
//     background: "rgba(238,228,218,.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
// };

// export default App;
