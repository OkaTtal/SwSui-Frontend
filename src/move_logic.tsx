import { Transaction } from '@mysten/sui/transactions';
import './game.css';
import { bcs } from '@mysten/sui/bcs';
const PACKAGE_ID = '0x96b0315bd40612c3c0bab82e30e0f9235cbe3ba3bac7071ca436f876ac38c661';
const MODULE_NAME = 'swsui_nft';
// import {useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
// import { useSuiClientInfiniteQuery } from "@mysten/dapp-kit";
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
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export function async_grid_board(signAndExecuteTransaction: any,object_id: any,col: number[],row:number[],value:number[],gameover:boolean,score: number,move_step:number, setLoading: any){  
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
    onSuccess: async (result: any) => {
      console.log('grid board updated', result);
      await sleep(1500)
      setLoading(false)
    },
    onError: async (error: any) => {
      console.error('transaction failed', error);
      await sleep(1500)
      setLoading(false); // 解锁
    }
  },
);

}


  export function create_grid_board(signAndExecuteTransaction: any,setLoading: any){  
    
   
      // const [digest, setDigest] = useState('');
     
      const tx = new Transaction();
      tx.moveCall({
      target: `${PACKAGE_ID}::swsui::create_grid_list`,
      arguments: [],
    });
    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: 'sui:testnet',
      },
      {
        onSuccess: async (result: any) => {
          console.log('grid board created', result);
          await sleep(1500)
          setLoading(false); // 
        },
        onError: async (error: any) => {
          console.error('transaction failed', error);
          await sleep(1500)
          setLoading(false); // 解锁
        }
      },
    );
    
    
  }

export function send_nft(signAndExecuteTransaction: any,setLoading: any){  
  const name = new TextEncoder().encode('Waves'); // vector<u8>
  const description = new TextEncoder().encode('SwSui NFT');
  const creator = new TextEncoder().encode('First NFT Fixed');
  const url = new TextEncoder().encode('ipfs://bafybeighr4vxio3ibq56caivcfcck6vdngydexx6xylip26ksch7gmcvpa');
  
 
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
      onSuccess: async (result: any) => {
        console.log('executed transaction', result);
        await sleep(1500)
        
        setLoading(false)
      },
      onError: async (error: any) => {
        console.error('transaction failed', error);
        await sleep(1500)
        setLoading(false); // 解锁
      }
      
    },
  );
  
}

  
