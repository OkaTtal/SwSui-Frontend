import React, { useState, useEffect,useRef, forwardRef  } from "react";
import { cloneDeep, first } from 'lodash';

import { useEvent, getColors } from "./util";
import Swipe from "react-easy-swipe";
import './game.css';
import WaterWave from "react-water-wave";

import { init2,create_grid_board,async_grid_board } from './move_logic'; 
import { useSuiClientInfiniteQuery } from "@mysten/dapp-kit";
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
// import { TransactionBlock } from '@mysten/sui.js/transactions';
// import { useWallets } from '@mysten/dapp-kit';
const PACKAGE_ID = '0x2500b95293d2ba3e5e92ac59dec50f2453d72bb2bbe76acd852a1aeec476f71a';
const MODULE_NAME = 'swsui';
let minted = false;
let first2 = true
let total_move_step = 0
type Grid = {
    row: number,
    col:number,
    value: number
};
//  type GridLi = Grid[]

let checkissue = true
function App() {
  // resetMilestones()
  
  const [score, setScore] = useState(0);
  const [objectId, setObjectId] = useState<string | undefined>(undefined);
  const SCORE_MILESTONES = [500,1000,2000,4000,6000];
  const account = useCurrentAccount();    

  const [grid, setGrid] = useState<Grid[]>(createGridList());
  const [moveStep, setmoveStep] = useState(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const scoreRef = useRef(score);
  const moveStepRef = useRef(moveStep);
  const gameOverRef = useRef(gameOver);
  console.log('对比01:' + gameOver)
  console.log('对比02:' +  gameOverRef.current)
  const {
    data,
    refetch
  } = useSuiClientInfiniteQuery(
    "getOwnedObjects",
    {
      owner: account?.address!,
      filter: { StructType: `${PACKAGE_ID}::${MODULE_NAME}::GridLi` },
      options: { showContent: true },
    },
    { enabled: !!account }
  );
  
  const exist = (): any| null => {
    const allObjs = data?.pages?.flatMap(page => page.data) || [];
    for (const obj of allObjs) {
      if (obj.data?.content?.dataType === "moveObject") {
        // console.log("测试发现: " + obj.data?.content?.fields)
        type GridLiFields = {
          id: { id: string };
          grids: any[];
          keys: any[];
          gameover: boolean;
          // minted: boolean;
          score: string;     
          move_step: string;  
        };
        
        const fields = obj.data?.content?.fields as GridLiFields;
        if (!fields.gameover) {
          setObjectId(obj.data?.objectId);
          console.log('发现object_id: ' + obj.data?.objectId); 
          console.log("Struct Fields:", obj.data?.content?.fields);        
          console.log("链上grids: " ,fields.grids)  
          console.log("链上gameover: ", fields.gameover)  
          const id = fields.id.id; // UID
          const keys = fields.keys.map(k => k.fields);   // KeyConfirm[]
          // minted = fields.minted;
          const gameover = fields.gameover;
          const score = Number(fields.score);
          const move_step = Number(fields.move_step);
          const grids = fields.grids.map((g: any) => ({
            row: Number(g.fields.row),
            col: Number(g.fields.col),
            value: Number(g.fields.value),
          }));
          console.log(grids)
          return {
            id,
            keys,
            gameover,
            score,
            move_step,
            grids,
          };
        }
      }
    }
    return null;
  };
 
  
 
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    function createGridList(): Grid[]{
        const grids:Grid[] = [];
      
        for (let i = 0; i < 16; i++) {
          grids.push({
            row: Math.floor(i / 4),
            col: i % 4,

            value: 0,
          });
        }
      
        return grids;
      }
      //创建

  const UP = 38;
  const DOWN = 40;
  const LEFT = 37;
  const RIGHT = 39;


  const init = async () => {
    
    console.log('数据: ' + data)
          
          const returned = exist()
          let grids;
          if(returned && returned.gameover === false){
            grids = returned.grids;
            console.log('返回得分: ' + returned.score)
            console.log('返回步数: ' + returned.move_step)
            setScore(returned.score)
            scoreRef.current = returned.score; 
            setmoveStep(returned.move_step)
            moveStepRef.current = returned.move_step;
          }else{
            console.log('链上暂无grid')
            grids = null
          }
          if (grids) {
            console.log('object_id:', objectId); 
            // addNumber(grids);
            // addNumber(grids);
            setGrid(grids);
            addNumber(grids)
          } else {
            resetMilestones()
            // const cols = grid.map(grid => grid.col);
            // const rows = grid.map(grid => grid.row);
            // const values = grid.map(grid => grid.value);
            // console.log('游戏结束: ' + gameOver)
            // await async_grid_board(signAndExecuteTransaction,objectId,cols,rows,values,gameOverRef.current,scoreRef.current,moveStepRef.current);
            
            console.log("create new grid board");
            await create_grid_board(signAndExecuteTransaction)
            console.log('游戏开始')
            const result = await refetch();
            if(result){await exist()}
            const emptyGrid: Grid[] = 
      createGridList();
        addNumber(emptyGrid);
        addNumber(emptyGrid);
        setGrid(emptyGrid);
      
   }

  };
  
  function ConnectedAccount() {
    const account = useCurrentAccount();
  
    if (!account) {
      return null;
    }
    checkissue = false
  
    return <div>Connected to {account.address}</div>;
  }
function checkAndTriggerMilestones(objectid: any,col: number[],row:number[],value:number[],gameover:boolean,score: number,move_step:number) {
  if(gameover){
    return
  }
  console.log("实时分数", score)
  if(!minted&&score>=1024){
    init2(signAndExecuteTransaction)
    minted = true;
  }
  SCORE_MILESTONES.forEach(milestone => {
    const key = `milestone_${milestone}`;
    const triggered = localStorage.getItem(key);

    if (score >= milestone && !triggered) {
      console.log('调用之前: ' + objectid)
      async_grid_board(signAndExecuteTransaction,objectid,col,row,value,gameover,score,move_step);
      console.log("到达一次")
      localStorage.setItem(key, '1');
    }
  });
}
function resetMilestones() {
  SCORE_MILESTONES.forEach(milestone => {
    const key = `milestone_${milestone}`;
    localStorage.removeItem(key);
  });
}
  const addNumber = async (newGrid: Grid[]) => {
    if(account){
      let added = false;
    let gridFull = false;
    let attempts = 0;
    while (!added) {
      if (gridFull) {
        break;
      }
      let rand = Math.floor(Math.random() * 16);
      attempts++;
      if (newGrid[rand].value === 0) {
        newGrid[rand].value = Math.random() > 0.5 ? 2 : 4;
        added = true;
      }
      if (attempts > 50) {
        gridFull = true;
        let gameOverr = checkIfGameOver();
        if (gameOverr) {
          setGameOver(true);
          gameOverRef.current = true
          alert("game over");
          console.log('游戏结束?: ',gameOverRef.current)
          const cols = grid.map(grid => grid.col);
          const rows = grid.map(grid => grid.row);
          const values = grid.map(grid => grid.value);
          console.log('游戏结束: ' + gameOverRef.current)
          await async_grid_board(signAndExecuteTransaction,objectId,cols,rows,values,gameOverRef.current,scoreRef.current,moveStepRef.current);
        }
        
      }
    }
    }else{
      console.log('connect your wallet first')
    }
    
  };
  

  const doSwipe = (direction: number,dummy?: boolean): Grid[] | void => {
    if(checkissue){
      return
    }
    let oldGrid = grid;
    let newGrid: Grid[];
    let endnum: number,dif: number;
  
    if(direction==0){
        endnum = 3;
        dif=1
        newGrid = swipe_left_up(endnum,dif,0,4,8,12,dummy)
    }else if(direction==1){
        endnum=-3;
        dif=1
        newGrid = swipe_right_down(endnum,dif,3,7,11,15,dummy)
    }else if(direction==2){
        endnum=-12;
        dif=4
        newGrid = swipe_right_down(endnum,dif,12,13,14,15,dummy)
    }else{
        endnum=12;
        dif=4
        newGrid = swipe_left_up(endnum,dif,0,1,2,3,dummy)
    }
    if (JSON.stringify(oldGrid) !== JSON.stringify(newGrid)) {
      addNumber(newGrid);
    }
    if (dummy) {
      return newGrid;
    } else {
      setGrid(newGrid);
    }
  };
  const swipe_left_up=(endnum: number,dif:number,lay1: number,lay2: number,lay3: number,lay4: number,dummy?: boolean): Grid[]=>{
    let scoreToAdd = 0;
    function processLine(start: number, end: number, dif: number, grid: Grid[]) {
        let cur = 0;
        let last_index = 0;
        let move_step = 0;
        for (let i = start; i <= end; i += dif) {
          if (grid[i].value === 0) {
            move_step++;
          } else {
            if (cur !== 0 && cur === grid[i].value) {
              grid[i].value = 0;
              grid[last_index].value = cur * 2;
              scoreToAdd += cur * 2;
              move_step++;
              cur = 0;
            } else {
              cur = grid[i].value;
            }
            if (move_step > 0 && grid[i].value !== 0) {
              last_index = i - (move_step * dif);
              grid[last_index].value = grid[i].value;
              grid[i].value = 0;
            } else if (move_step === 0 && grid[i].value !== 0) {
              last_index = i - (move_step * dif);
            }
          }
        }
      }
      const newGrid = cloneDeep(grid);

      processLine(lay1, lay1 + endnum, dif, newGrid);
      processLine(lay2, lay2 + endnum, dif, newGrid);
      processLine(lay3, lay3 + endnum, dif, newGrid);
      processLine(lay4, lay4 + endnum, dif, newGrid);
      if (!dummy) {setScore(prev => prev + scoreToAdd)
        scoreRef.current = scoreRef.current+scoreToAdd;
        if(JSON.stringify(grid) != JSON.stringify(newGrid)){
          setmoveStep(pr=>pr+1)
          moveStepRef.current = moveStepRef.current+1;
        }
      };
  
return newGrid;
  }
  const swipe_right_down=(endnum: number,dif:number,lay1: number,lay2: number,lay3: number,lay4: number,dummy?: boolean):Grid[]=>{
    let scoreToAdd = 0;
    function processLine(start: number, end: number, dif: number, grid: Grid[]) {
        let cur = 0;
        let last_index = 0;
        let move_step = 0;
      
        for (let i = start; i >= end; i -= dif) {
          if (grid[i].value === 0) {
            move_step++;
          } else {
            if (cur !== 0 && cur === grid[i].value) {
              grid[i].value = 0;
              grid[last_index].value = cur * 2;
              scoreToAdd += cur * 2;
              move_step++;
              cur = 0;
            } else {
              cur = grid[i].value;
            }
            if (move_step > 0 && grid[i].value !== 0) {
              last_index = i + (move_step * dif);
              grid[last_index].value = grid[i].value;
              grid[i].value = 0;
            } else if (move_step === 0 && grid[i].value !== 0) {
              last_index = i + (move_step * dif);
            }
          }
        }
      }
      const newGrid = cloneDeep(grid);

      processLine(lay1, lay1 + endnum, dif, newGrid);
      processLine(lay2, lay2 + endnum, dif, newGrid);
      processLine(lay3, lay3 + endnum, dif, newGrid);
      processLine(lay4, lay4 + endnum, dif, newGrid);
      if (!dummy) {setScore(prev => prev + scoreToAdd)
        scoreRef.current = scoreRef.current+scoreToAdd; 
        if(JSON.stringify(grid) != JSON.stringify(newGrid)){
          setmoveStep(pr=>pr+1)
          moveStepRef.current = moveStepRef.current+1
        }
       
      };
  
return newGrid;
  }
  const checkIfGameOver = (): boolean => {
    let checker = doSwipe(0,true);
    if (JSON.stringify(grid) !== JSON.stringify(checker)) {
      return false;
    }

    let checker2 = doSwipe(2,true);
    if (JSON.stringify(grid) !== JSON.stringify(checker2)) {
      return false;
    }

    let checker3 = doSwipe(1,true);
    if (JSON.stringify(grid) !== JSON.stringify(checker3)) {
      return false;
    }

    let checker4 = doSwipe(3,true);
    if (JSON.stringify(grid) !== JSON.stringify(checker4)) {
      return false;
    }

    return true;
  };
  const resetGame = async () => {
    setScore(0);
    scoreRef.current = 0;
    setmoveStep(0)
    moveStepRef.current = 0
    console.log('初始化得分: score',score)
    console.log('初始化步数: step',moveStep)
    resetMilestones()
    await create_grid_board(signAndExecuteTransaction)
    console.log('游戏开始',gameOver, gameOverRef.current)
    const result = await refetch();

    if(result){await exist()}
    setGameOver(false);
    gameOverRef.current = false
   
    const emptyGrid: Grid[] = createGridList();
    addNumber(emptyGrid);
    addNumber(emptyGrid);
    setGrid(emptyGrid);
  };
  // const start = () =>{
  //   if(!ConnectedAccount()){
  //     const result = confirm('You need connect your wallet first!');
  //   }else{
      
  //   }
  // }

  const handleKeyDown = async (e: Event) => {
    const event = e as KeyboardEvent;
    if (gameOver) {
      return;
    }
    switch (event.keyCode) {
      case UP:
        doSwipe(3);
        break;
      case DOWN:
        doSwipe(2);
        break;
      case LEFT:
        doSwipe(0);
        break;
      case RIGHT:
        doSwipe(1);
        break;
      default:
        break;
    }

    let gameOverr = checkIfGameOver();
    if (gameOverr) {
      setGameOver(true);
      gameOverRef.current = true
      alert("game over");
      console.log('游戏结束?: ',gameOverRef.current)
      const cols = grid.map(grid => grid.col);
      const rows = grid.map(grid => grid.row);
      const values = grid.map(grid => grid.value);
      console.log('游戏结束: ' + gameOverRef.current)
      await async_grid_board(signAndExecuteTransaction,objectId,cols,rows,values,gameOverRef.current,scoreRef.current,moveStepRef.current);
      console.log('游戏结束，同步状态')
      resetMilestones()
    }
  };

  useEffect(() => {
    if (data&&account) {
      console.log("已有grid board")
    // resetMilestones()
    
    init();
    
  }else{
    console.log('链上暂无数据')
    console.log('新grid board')
    setGameOver(false);
    gameOverRef.current = false
    // console.log('对比111:' + gameOver)
    // console.log('对比222:' +  gameOverRef.current)
    setScore(0);
    scoreRef.current = 0; 
    setmoveStep(0)
    moveStepRef.current = 0
    create_grid_board(signAndExecuteTransaction);
    refetch();
    exist()
    
    const emptyGrid: Grid[] = createGridList();
    addNumber(emptyGrid)
    addNumber(emptyGrid)
      setGrid(emptyGrid)
  }
  }, [data,account,objectId]);
  useEffect(() => {
    const cols = grid.map(grid => grid.col);
    const rows = grid.map(grid => grid.row);
    const values = grid.map(grid => grid.value);
    checkAndTriggerMilestones(objectId,cols,rows,values,gameOverRef.current,scoreRef.current,moveStepRef.current);
  }, [score]);  
  useEvent("keydown", handleKeyDown);
  
  return (
    <WaterWave
    imageUrl={'https://t3.ftcdn.net/jpg/05/16/85/12/360_F_516851283_dfzIU1eoEvPE4h0ISpbF4ADa7ZVde1mO.jpg'}
    perturbance={0.03}
    resolution={512}
    dropRadius={30}
    style={{
      width: '100vw',
      height: '100vh',
      backgroundSize: 'cover',  
      backgroundPosition: 'center center'
    }}
  >{({})=>
    <div className="App" 
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
      // background: "#D2E3F1",
      //whole bg
    }}>
      <div
        style={{
          width: 345,
          margin: "auto",
          marginTop: 30,
        }}
      >
        <div style={{ display: "flex" }}>
          <div
            style={{
              fontSize: 40
            }}
             className="titleLine"
          >
            SwSui
          </div>
          <div className="App" id = 'ewallet' style={{
    position: 'absolute',
    top: 10,
    right: 100,
    zIndex: 1000,
  }}> 
              <header className="App-header">
              <div className={ConnectedAccount() ? "wallet-wrapper connected" : "wallet-wrapper"}>
                  <ConnectButton />
                  <img src='/ewallet.jpg' alt="Connect" className={ConnectedAccount() ? "ywallet-img" : "nwallet-img"} />
                </div>
              </header>
            </div>
            <div
            style={{
              fontSize: 22,
              marginTop: 10,
              marginRight: -23,
            }}
            className="titleLine"
          >
           Score: <span style={{ fontSize: 17 }}>{score}</span>
          </div>
          <div
            style={{
              fontSize: 22,
              marginTop: 10,
              marginRight: -103,
            }}
              className="titleLine"
          >
            Move: <span style={{ fontSize: 17}}>{moveStep}</span>
          </div>
            
        </div>
        <div
          style={{
            // background: "#A3BBDB",
            //grid background
            background: 'rgba(255, 255, 255, 0.2)',
            // backdropFilter: 'blur(10px)',
            // border: '1px solid rgba(255, 255, 255, 0.3)',

            width: "max-content",
            height: "max-content",
            margin: "auto",
            padding: 5,
            borderRadius: 25,
            marginTop: 10,
            position: "relative",
          }}
        >
          {gameOver && (
  <div className="gameOverOverlay">
    <div>
      <img
        src="gameover.jpg"
        alt="Game Over"
        style={{ width: 200, height: "auto", marginBottom: 20 }}
      />
      <div onClick={resetGame} className="tryAgain">
                      Try Again
                    </div>
    </div>
  </div>
)}

             {!ConnectedAccount() && (
            <div className="gameOverOverlay">
              <div>
                <div>
                  <div
                    style={{
                      flex: 1,
                      marginTop: "auto",
                    }}
                  >
                    <div className="startButton">
                      Sign to unlock
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Swipe
            onSwipeDown={() => {
            doSwipe(2);
            }}
            onSwipeLeft={() => doSwipe(0)}
            onSwipeRight={() =>  doSwipe(1)}
            onSwipeUp={() => doSwipe(3)}
            style={{ overflowY: "hidden" }}
          >

                <div style={{ position: "relative", width: 400, height: 400 }}>
                {grid.map(({ row, col, value }, index) => (
                  <div
                    key={index}
                    style={{
                      position: "absolute",
                      top: row * 100,
                      left: col * 100,
                      width: 100,
                      height: 100
                    }}
                  >
                    <Block num={value} />
                  </div>
                ))}
              </div>
           
          </Swipe>
        </div>
      </div>
    </div>
}</WaterWave>
  );
   
}

const Block = ({ num}: { num: number}) => {
  const [animate, setAnimate] = React.useState(false);

  const lvimage: Record<number, string> = {
    2: "/lv1.jpg",
    4: "/lv2.jpg",
    8: "/lv3.jpg",
    16: "/lv4.jpg",
    32: "/lv5.jpg",
    64: "/lv6.jpg",
    128: "/lv7.jpg",
    256: "/lv8.jpg",
    512: "/lv9.jpg",
    1024: "/lv10.jpg",
    2048: "/lv11.jpg",
    4096: "/lv12.jpg",
    8192: "/lv13.jpg",
  };

  React.useEffect(() => {
    if (num === 0) return; 
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(timer);
  }, [num]);

  return (
    <div
      className={`block ${animate ? "splash" : ""}`}
      style={{
        background: getColors(num),
        borderRadius: "10px", 
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)", 
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)", 
    border: "1px solid rgba(255, 255, 255, 0.2)" 

        // color: num === 2 || num === 4 ? "#645B52" : "#F7F4EF",
      }}
    >
      {num !== 0 ? (
        <img
          src={lvimage[num]}
          alt={num.toString()}
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        ""
      )}
    </div>
  );
};
export default App;
