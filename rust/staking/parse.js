import { PublicKey } from "@solana/web3.js";
import { STAKE_PROGRAM_ID, TOKEN_PROGRAM_ID, connection } from "../const";
import { desStaking } from "./classes";
import { robots } from "../../components/robots.js";


export const getMySNB = async me => {

  const accounts = await connection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID,
    { filters: [ { dataSize: 165 } , { memcmp: { offset: 32, bytes: new PublicKey(me) }}]}
  );

  const arr = [];
  for(let i = 0; i < accounts.length; i++) {
    let k = accounts[i];
    const qt = parseInt(k.account.data.parsed.info.tokenAmount.amount);
    if(qt !== 1) continue;
    let key = k.account.data.parsed.info.mint;
    if(!robots[key]) continue;
    arr.push({...robots[key], mint: key});
  }

  return arr;
}

export const getStakingAccounts = async () => {
  const accounts = await connection.getParsedProgramAccounts(
    STAKE_PROGRAM_ID
  );

  const arr = [];
  for(let i = 0; i < accounts.length; i++) {
    if(accounts[i].account.data.length < 20) continue;
    try{
      const data = Array.from(accounts[i].account.data);
      data.unshift(0);
      const res = desStaking(Buffer.from(data));
      ['start', 'end'].forEach(k => res[k] = parseInt(res[k]));
      res.img = robots[res.mint].img;
      res.name = robots[res.mint].name;
      arr.push(res);
    }catch(e) {}
  }
  return arr;
}

export const getOneStaking = async id => {
  const acc = await connection.getAccountInfo(new PublicKey(id));

  if(acc && acc.data) {
    try{
      const data = Array.from(acc.data);
      data.unshift(0);
      const res = desStaking(Buffer.from(data));
      res.start = parseInt(res.start);
      res.end = parseInt(res.end);
      return res;
    }catch(e) {
      return null;
    }
  }
}