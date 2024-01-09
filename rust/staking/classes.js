import { PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { deserialize, serialize } from "../borsh";
import { ASSOCIATED_TOKEN_PROGRAM_ID, METADATA_PROGRAM_ID, RENT_PROGRAM, STAKE_PROGRAM_ID, TOKEN_AUTH_RULES_ACC, TOKEN_AUTH_RULES_ID, TOKEN_PROGRAM_ID, connection, findStakeAccount, findTokenAccount, getEditionAccount, getInstruction, getMetadataAccount, getTokenRecordAcc, getWallet, instruction } from "../const";
import { timer } from "../send";

export const addToStaking = async (arr, setStatus, end = 0) => {
  if(!arr[0]) return;
  const wallet = await getWallet();
  const owner = wallet.publicKey.toBase58();
  const block = await connection.getRecentBlockhash('singleGossip');

  let items = [];
  for (let i = 0; i < arr.length; i++) {
    let mint = arr[i];
    let data = Buffer.from(serialize(schema_staking, new Staking({
      start: 0,
      end,
      owner,
      mint
    })));

    let stake_acc = findStakeAccount(new PublicKey(owner), new PublicKey(mint));
    let from_token_accaunt = findTokenAccount(new PublicKey(owner), new PublicKey(mint));
    let to_token_accaunt = findTokenAccount(new PublicKey(stake_acc), new PublicKey(mint));

    let metadataAccount = getMetadataAccount(new PublicKey(mint));
    let edition = getEditionAccount(mint);
    let from_record_accaunt = getTokenRecordAcc(new PublicKey(from_token_accaunt), new PublicKey(mint));
    let to_record_accaunt = getTokenRecordAcc(new PublicKey(to_token_accaunt), new PublicKey(mint));

    const tx = new Transaction();
    tx.add(
      new TransactionInstruction({
        keys: [
          { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
          { pubkey: new PublicKey(stake_acc), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(mint), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(to_token_accaunt), isSigner: false, isWritable: true },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: RENT_PROGRAM, isSigner: false, isWritable: false },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }
        ],
        programId: STAKE_PROGRAM_ID,
        data: getInstruction('CreateTokenAcc')
      })
    );

    tx.add(
      new TransactionInstruction({
        keys: [
          { pubkey: new PublicKey(owner), isSigner: true, isWritable: true },
          { pubkey: new PublicKey(stake_acc), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(mint), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(from_token_accaunt), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(to_token_accaunt), isSigner: false, isWritable: true },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
          { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },

          { pubkey: RENT_PROGRAM, isSigner: false, isWritable: false },
          { pubkey: METADATA_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: new PublicKey(metadataAccount), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(edition), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(from_record_accaunt), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(to_record_accaunt), isSigner: false, isWritable: true },
          { pubkey: TOKEN_AUTH_RULES_ID, isSigner: false, isWritable: false },
          { pubkey: TOKEN_AUTH_RULES_ACC, isSigner: false, isWritable: false },
        ],
        programId: STAKE_PROGRAM_ID,
        data
      })
    );

    tx.recentBlockhash = block.blockhash;
    tx.feePayer = wallet.publicKey;

    items.push(tx);
  }

  items = await wallet.signAllTransactions(items);

  for (let i = 0; i < items.length; i++) {
    let k = items[i].serialize();
    let txId = await connection.sendRawTransaction(k, { skipPreflight: true });

    if (setStatus) setStatus('Stake NFT - ' + (i + 1));

    let conf;
    const confirm = async id => {
      conf = await connection.getTransaction(id);

      if (!conf) {
        await timer(1000);
        await confirm(txId);
      }
    }
    await confirm(txId);
  }

}

export const desStaking = buffer => deserialize(schema_staking, Staking, buffer);
class Staking {
  instruction = instruction.Stake;
  constructor(obj) {
    Object.assign(this, obj)
  }
}
const schema_staking = new Map([[Staking, {
  kind: 'struct',
  fields: [
    ['instruction', 'u8'],
    ['start', 'u64'],
    ['end', 'u64'],
    ['owner', 'pubkeyAsString'],
    ['mint', 'pubkeyAsString']
  ]
}]]);
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export const unstakeNft = async (arr, setStatus) => {
  if(!arr[0]) return;
  const wallet = await getWallet();
  const owner = wallet.publicKey.toBase58();
  const block = await connection.getRecentBlockhash('singleGossip');

  let items = [];
  for (let i = 0; i < arr.length; i++) {
    let mint = arr[i];

    let stake_acc = findStakeAccount(new PublicKey(owner), new PublicKey(mint));
    let from_token_accaunt = findTokenAccount(new PublicKey(stake_acc), new PublicKey(mint));
    let to_token_accaunt = findTokenAccount(new PublicKey(owner), new PublicKey(mint));

    const metadataAccount = getMetadataAccount(new PublicKey(mint));
    const edition = getEditionAccount(mint);
    const from_record_accaunt = getTokenRecordAcc(new PublicKey(from_token_accaunt), new PublicKey(mint));
    const to_record_accaunt = getTokenRecordAcc(new PublicKey(to_token_accaunt), new PublicKey(mint));

    let tx = new Transaction();
    tx.add(
      new TransactionInstruction({
        keys: [
          { pubkey: new PublicKey(owner), isSigner: true, isWritable: true },
          { pubkey: new PublicKey(owner), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(mint), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(to_token_accaunt), isSigner: false, isWritable: true },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: RENT_PROGRAM, isSigner: false, isWritable: false },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }
        ],
        programId: STAKE_PROGRAM_ID,
        data: getInstruction('CreateTokenAcc')
      })
    );

    tx.add(
      new TransactionInstruction({
        keys: [
          { pubkey: new PublicKey(owner), isSigner: true, isWritable: true },
          { pubkey: new PublicKey(stake_acc), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(mint), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(from_token_accaunt), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(to_token_accaunt), isSigner: false, isWritable: true },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: RENT_PROGRAM, isSigner: false, isWritable: false },
          { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },

          { pubkey: METADATA_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: new PublicKey(metadataAccount), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(edition), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(from_record_accaunt), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(to_record_accaunt), isSigner: false, isWritable: true },
          { pubkey: TOKEN_AUTH_RULES_ID, isSigner: false, isWritable: false },
          { pubkey: TOKEN_AUTH_RULES_ACC, isSigner: false, isWritable: false }
        ],
        programId: STAKE_PROGRAM_ID,
        data: getInstruction('Unstake')
      })
    );

    tx.recentBlockhash = block.blockhash;
    tx.feePayer = wallet.publicKey;

    items.push(tx);
  }

  items = await wallet.signAllTransactions(items);

  for (let i = 0; i < items.length; i++) {
    let k = items[i].serialize();
    let txId = await connection.sendRawTransaction(k, { skipPreflight: true });

    if (setStatus) setStatus('Unstake NFT - ' + (i + 1));

    let conf;
    const confirm = async id => {
      conf = await connection.getTransaction(id);

      if (!conf) {
        await timer(1000);
        await confirm(txId);
      }
    }
    await confirm(txId);
  }
}