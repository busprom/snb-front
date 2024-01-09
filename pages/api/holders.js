import { getStakingAccounts } from "../../rust/staking/parse";

export default async (req, res) => {
  
  const accs = await getStakingAccounts();

  const arr = {};

  for(let i = 0; i < accs.length; i++) {
    let one = accs[i].owner;

    if(arr[accs[i].owner]) arr[accs[i].owner].push(accs[i].mint);
    else arr[accs[i].owner] = [accs[i].mint];

  }

  return res.status(200).json(arr);
}
