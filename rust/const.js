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
  MintTicket: 0,
  Verify: 1,
  CreateAdminAcc: 2,
  BuyNftRaffle: 1,
  Burn: 4,
  BurnAll: 6,
  DeletaAcc: 5,
  CreateWlAcc: 7,
  GetBox: 8,
  CreateTokenAcc: 8,
  Unstake: 1,
  GetSpin: 2,
  UnstakeOwner: 4,
  PlaceBet: 5,
  GetWin: 6,
  DeleteGame: 7,
  OpenBox: 8,
  CreateTPTacc: 3,
  SetTPTbet: 4,
  WdTPTbet: 10
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

export const TOTTORI_PROGRAM_ID = new PublicKey('DTnfGz9ot46844rsqo5EL5hf2t8P8UAdCFKcDS5jFLPE');
export const UPDATER_ID = new PublicKey('8TdbucrBeXGS9tzBADthsZdgmyZ55dAaNk7G5d7nTmHG');

export const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
export const RENT_PROGRAM = new PublicKey('Sysvar1nstructions1111111111111111111111111');
export const PROFIT_ID = new PublicKey('H8Mikasq4etwV3kwx4S2DFwJqCPjL3QbSsRyQsmx7EuX');
export const BOX_SEED = 'box_seed';

export const TPT_ACC = '3GzRzWTnnLZzbdumgQCJJE1kBy7f9vDWwrEMoPDCsy9W';

export const STAKE_PROGRAM_ID = new PublicKey("74A7MPJkpAnDcMwyDfNYoZ8JprGS65y4kb1phQdy4nfT");
export const findStakeAccount = (owner, mint) => {
  const result = PublicKey.findProgramAddressSync(
    [owner.toBuffer(), STAKE_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    STAKE_PROGRAM_ID
  );
  return result[0].toBase58();
}
export const getGameAccount = id => {
  const result = PublicKey.findProgramAddressSync(
    [Buffer.from('GAME'), STAKE_PROGRAM_ID.toBuffer(), Buffer.from(id+'')],
    STAKE_PROGRAM_ID
  );
  return result[0].toBase58();
}

export const getStakeAccount = admin => {
  const result = PublicKey.findProgramAddressSync(
    [Buffer.from('TPT'), STAKE_PROGRAM_ID.toBuffer(), admin.toBuffer()],
    STAKE_PROGRAM_ID
  );
  return result[0].toBase58();
}

export const getTottoriProgramAccount = (key, seed) => {
  const result = PublicKey.findProgramAddressSync(
    [Buffer.from(seed), TOTTORI_PROGRAM_ID.toBuffer(), key.toBuffer()],
    TOTTORI_PROGRAM_ID
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


export const FIRE_PROGRAM_ID = new PublicKey('5JfE7WqvDy2EZELuQ4R1m5NKDRoDmksqEunixVXgFUQQ');
export const getFireProgramAccount = (key, seed) => {
  const result = PublicKey.findProgramAddressSync(
    [Buffer.from(seed), FIRE_PROGRAM_ID.toBuffer(), key.toBuffer()],
    FIRE_PROGRAM_ID
  );
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
export const TOKEN_AUTH_RULES_ACC = new PublicKey('8n8TeLkYfuKd5zhyT8R8uHy7asJ2QSeqAVsdAhU2UYQ5');