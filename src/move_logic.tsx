import { Transaction } from '@mysten/sui/transactions';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import './game.css';
import { bcs } from '@mysten/sui/bcs';
const PACKAGE_ID = '0x2500b95293d2ba3e5e92ac59dec50f2453d72bb2bbe76acd852a1aeec476f71a';
const MODULE_NAME = 'swsui_nft';
import {useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useSuiClientInfiniteQuery } from "@mysten/dapp-kit";
// export function check_grid_board(){
//   const account = useCurrentAccount();
//    const { data } = useSuiClientInfiniteQuery(
//         "getOwnedObjects",
//         {
//           owner: account?.address!,
//           filter: { StructType: `${PACKAGE_ID}::${MODULE_NAME}::GridLi` },
//           options: {
//             showContent: true, 
//           },
//         },
//         {
//           enabled: !!account,
//         }
//       );
//       data?.pages?.flatMap(page => page.data).forEach((obj) => {
//         console.log("Object ID:", obj.data?.objectId);
//         if (obj.data?.content?.dataType === "moveObject") 
//           {console.log("Struct Fields:", obj.data?.content?.fields);}
//         else{
//           console.log("not match")
//         }
//       });

//   }s
export function async_grid_board(signAndExecuteTransaction: any,object_id: any,col: number[],row:number[],value:number[],gameover:boolean,score: number,move_step:number){  
  // const [digest, setDigest] = useState('');
  const tx = new Transaction();
  console.log('开始调用: ' + object_id)
  console.log('检查传gameover: ' + gameover)
  tx.moveCall({
  target: `${PACKAGE_ID}::swsui::async_grid_list`,
  arguments: [tx.object(object_id), // &mut GridLi
    tx.pure(bcs.vector(bcs.U8).serialize(col)),   // 不用 .toBytes()
    tx.pure(bcs.vector(bcs.U8).serialize(row)),
    tx.pure(bcs.vector(bcs.U64).serialize(value)),
    tx.pure(bcs.bool().serialize(gameover)),
    tx.pure(bcs.u64().serialize(score)),
    tx.pure(bcs.u64().serialize(move_step)),
  ],
});
signAndExecuteTransaction(
  {
    transaction: tx,
    chain: 'sui:testnet',
  },
  {
    onSuccess: (result: any) => {
      console.log('grid board created', result);
    },
  },
);

}

export function create_grid_board(signAndExecuteTransaction: any) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::swsui::create_grid_list`,
    arguments: [],
  });

  // 返回一个 Promise，resolve 新 objectId
  return new Promise((resolve, reject) => {
    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: 'sui:testnet',
      },
      {
        onSuccess: (result: any) => {
          // 从 result.objectChanges 里找到新创建的对象
          let newObjectId = null;
          if (result.objectChanges) {
            for (const obj of result.objectChanges) {
              if (
                obj.type === "created" &&
                obj.objectType &&
                obj.objectType.includes("::swsui::GridLi")
              ) {
                newObjectId = obj.objectId;
                break;
              }
            }
          }
          if (newObjectId) {
            resolve(newObjectId);
          } else {
            reject(new Error("No new GridLi objectId found"));
          }
        },
        onError: (err: any) => {
          reject(err);
        },
      }
    );
  });
}


export function init2(signAndExecuteTransaction: any){  
  const name = new TextEncoder().encode('OkaTtal'); // vector<u8>
  const description = new TextEncoder().encode('First NFT');
  const newDescription = new TextEncoder().encode('First NFT Fixed');
  const url = new TextEncoder().encode('ipfs://bafkreiakul5pov7ajwuf3ubunhx62vqiivsty2jkyzaai3xhcjotee3fcu');
  
 
    // const [digest, setDigest] = useState('');
    console.log("发送2048奖励")
   
    const tx = new Transaction();
    const nft = tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::mint_to_sender`,
    arguments: [
      tx.pure(bcs.vector(bcs.U8).serialize(name)),        
      tx.pure(bcs.vector(bcs.U8).serialize(description)), 
      tx.pure(bcs.vector(bcs.U8).serialize(url)),   
      tx.pure(bcs.vector(bcs.U8).serialize(url)),          
    ],
  });
  // tx.moveCall({
  //   target: `${PACKAGE_ID}::${MODULE_NAME}::update_description`,
  //   arguments: [
  //     nft,
  //     tx.pure(bcs.vector(bcs.U8).serialize(newDescription)), 
  //   ],
  // });
  
  // tx.moveCall({
  //   target: `${PACKAGE_ID}::${MODULE_NAME}::burn`,
  //   arguments: [nft],
  // });
  signAndExecuteTransaction(
    {
      transaction: tx,
      chain: 'sui:testnet',
    },
    {
      onSuccess: (result: any) => {
        console.log('executed transaction', result);
      },
    },
  );
  
}

  
