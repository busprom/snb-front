import { PublicKey, Connection } from '@solana/web3.js';
import { serialize } from './borsh';


export const getAddr = key => key.substr(0, 5) + '...' + key.substr(38);
export const getTx = key => key.substr(0, 5) + '...' + key.substr(83);
export const solApi = process.env.solanaApi;
export const delay = ms => new Promise(resolve => setTimeout(() => resolve(), ms));


export const connection = new Connection(solApi, 'confirmed');

export const disconnect = () => {
  localStorage.removeItem('wallet');
}
export const getWallet = async () => {
  if ("solana" in window) {
    await window.solana.connect();
    localStorage.setItem('wallet', window.solana.publicKey.toBase58());
    return window.solana;
  } else {
    window.open("https://www.phantom.app/", "_blank");
  }
}

export const instruction = {
  CreateTokenAcc: 0,
  Stake: 1,
  Unstake: 2,
  Claim: 3
}
class Instruction {
  instruction;
  constructor(obj) {
    this.instruction = obj;
  }
}
const schema = new Map([[Instruction, {
  kind: 'struct',
  fields: [
    ['instruction', 'u8']
  ]
}]]);
export const getInstruction = val => {
  const st = new Instruction(instruction[val]);
  return serialize(schema, st);
}


export const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
export const RENT_PROGRAM = new PublicKey('Sysvar1nstructions1111111111111111111111111');
export const SNB_TOKEN = new PublicKey('C8k9yXXz2tESBHNYiuargjtsPm8NVMitH15fmtJbV5oY');


export const STAKE_PROGRAM_ID = new PublicKey("74A7MPJkpAnDcMwyDfNYoZ8JprGS65y4kb1phQdy4nfT");
export const findStakeAccount = (owner, mint) => {
  const result = PublicKey.findProgramAddressSync(
    [owner.toBuffer(), STAKE_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    STAKE_PROGRAM_ID
  );
  return result[0].toBase58();
}


export const findTokenAccount = (owner, mint) => {
  const result = PublicKey.findProgramAddressSync(
    [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  return result[0].toBase58();
}


///////////////////////METADATA PROGRAM/////////////////////////////////////////
export const USER_ACCOUNT_SEED = 'user_accounty';
export const ADMIN_ACCOUNT_SEED = 'admin_accounty';
export const COLLECTION_AUTHORITY = 'collection_authority';
export const METADATA_PREFIX = 'metadata';
export const EDITION = 'edition';
const TOKEN_RECORD_SEED = "token_record";

export const getMetadataAccount = mint => {
  const seed = [
    Buffer.from(METADATA_PREFIX),
    new PublicKey(METADATA_PROGRAM_ID).toBuffer(),
    new PublicKey(new PublicKey(mint)).toBuffer()
  ];
  const result = PublicKey.findProgramAddressSync(seed, new PublicKey(METADATA_PROGRAM_ID));
  return result[0].toBase58();
}

export const getEditionAccount = mint => {
  const seed = [
    Buffer.from(METADATA_PREFIX),
    new PublicKey(METADATA_PROGRAM_ID).toBuffer(),
    new PublicKey(new PublicKey(mint)).toBuffer(),
    Buffer.from(EDITION)
  ];
  const result = PublicKey.findProgramAddressSync(seed, new PublicKey(METADATA_PROGRAM_ID));
  return result[0].toBase58();
}

export const getCollectionAccount = (mint, authority) => {
  const seed = [
    Buffer.from(METADATA_PREFIX),
    new PublicKey(METADATA_PROGRAM_ID).toBuffer(),
    new PublicKey(new PublicKey(mint)).toBuffer(),
    Buffer.from(COLLECTION_AUTHORITY),
    new PublicKey(new PublicKey(authority)).toBuffer()
  ];
  const result = PublicKey.findProgramAddressSync(seed, new PublicKey(METADATA_PROGRAM_ID));
  return result[0].toBase58();
}

export const getTokenRecordAcc = (token, mint) => {
  const seed = [
    Buffer.from(METADATA_PREFIX),
    new PublicKey(METADATA_PROGRAM_ID).toBuffer(),
    new PublicKey(new PublicKey(mint)).toBuffer(),
    Buffer.from(TOKEN_RECORD_SEED),
    new PublicKey(new PublicKey(token)).toBuffer()
  ];
  const result = PublicKey.findProgramAddressSync(seed, new PublicKey(METADATA_PROGRAM_ID));
  return result[0].toBase58();
}

export const TOKEN_AUTH_RULES_ID = new PublicKey('auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg');
export const TOKEN_AUTH_RULES_ACC = new PublicKey('AdH2Utn6Fus15ZhtenW4hZBQnvtLgM1YCW2MfVp7pYS5');