import { connection, getWallet } from "./const";

export const send = async tx => {
  const wallet = await getWallet();
  const block = await connection.getRecentBlockhash('singleGossip');
  tx.recentBlockhash = block.blockhash;
  tx.feePayer = wallet.publicKey;
  tx = await wallet.signTransaction(tx);
  const rawTransaction = tx.serialize();
  const txId = await connection.sendRawTransaction(
    rawTransaction,
    { skipPreflight: true }
  );
 
  let conf;
  const confirm = async txId => {
    conf = await connection.getTransaction(txId);
    if(!conf) {
      await timer(800);
      await confirm(txId);
    }
  }
  await confirm(txId);
  return {...conf.meta, id: txId};
}

export const timer = ms => new Promise(res => setTimeout(res, ms))