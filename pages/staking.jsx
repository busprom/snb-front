import styles from '../styles/staking.module.sass';
import { useEffect, useState } from 'react';
import { addToStaking, unstakeNft } from '../rust/staking/classes';
import { getMyTottori, stakingAccounts } from '../rust/staking/parse';
import { hash } from '../rust/staking/hash';
import { Roulette, rou } from '../components/roulet/roulette';
import { toEnd } from '../lib/timer';
import { xhr } from '../lib/xhr';
import { sortTbody } from '../lib/sortTbody';
import { RouletteWheel } from '../components/roulet/lib';


export default function Staking({ user = '', err, conf, info }) {
  const [arr, setArr] = useState([]);
  const [loader, setLoader] = useState(false);
  const [staked, setStaked] = useState([]);
  const [stake, setStake] = useState([]);
  const [unstake, setUnstake] = useState([]);
  const [proc, setProc] = useState();
  const [dl, setDl] = useState();
  const [aval, setAval] = useState([]);
  const [block, setBlock] = useState(false);
  const [codes, setCodes] = useState();

  const start = async () => {
    if (!user) {
      setArr([]);
      setStaked([]);
      setStake([]);
      setUnstake([]);
      setAval([]);
      return;
    }

    setBlock(true);

    const my = await getMyTottori(user);
    setArr(my || []);

    const accs = await stakingAccounts();
    setStaked(accs || []);

    const arr = [], time = parseInt(Date.now() / 1000);
    for (let i = 0; i < accs.length; i++) {
      let one = accs[i];
      if (one.owner !== user) continue;
      if (time < one.end) continue;
      arr.push(one);
    }
    setAval(arr);

    setStake([]);
    setUnstake([]);
    setLoader(false);
    setProc();

    setBlock(false);
  }
  useEffect(() => start(), [user]);

  const getStake = async () => {
    if (loader !== false) return;
    setLoader(true);
    try {
      await addToStaking(stake, setProc);
      await start();
    } catch (e) {
      await start();
    }
  }

  const getUnstake = async (k, i) => {
    if (loader !== false) return;
    setLoader(true);
    try {
      await unstakeNft(unstake, setProc);
      await start();
    } catch (e) {
      await start();
    }
  }

  const getEnd = k => {
    const res = toEnd(k.end * 1000);
    if (!res) return <span>Avalible</span>;
    return <>
      <div className={styles.title}>Staking ending in</div>
      <span>
        {res.days ? 'D' + res.days + ' ' : ''}
        {res.hours ? 'H' + res.hours + ' ' : ''}
        {res.minutes ? 'M' + res.minutes : ''}
      </span>
    </>;
  }

  const getBanner = async (mint, e) => {
    e.stopPropagation();
    if (dl) return;
    setDl(mint);
    const res = await xhr('/get-banner', { mint }, 'POST');
    const downloadLink = document.createElement("a");
    downloadLink.href = res.img;
    downloadLink.download = 'Banner';
    downloadLink.click();
    setDl(false);
  }

  const showCodes = () => {
    const codes = localStorage.getItem('codes');
    if(!codes) info("You have no winnings", "You can win at roulette");
    else setCodes(JSON.parse(codes));
  }

  const manual = () => {
    rou.play()
  }

  return (
    <div className={styles.staking}>
      {block && <div className={styles.block} />}

      {codes && <div className={styles.codes}>
        <img src="/img/disconnect.png" alt="" onClick={setCodes.bind(null, false)} />
        {codes.map((k, i) => (
          <div key={i}>
            <b>{k[0]}</b>
            <span>{k[1]}</span>
          </div>
        ))}
      </div>}

      <div className={styles.nftWrap}>

        <div className={styles.selTop}>
          <div className={styles.navi}>
            <h1>Select NFTs for staking</h1>
            {stake[0] && <div className={styles.stakingButton} onClick={getStake}>
              {
                proc ? <span style={{ display: 'flex', alignItems: 'center' }}>
                  <img style={{ height: '20px', marginRight: '10px' }} src='/img/loader.gif' alt="" />{proc}</span> : <span>Stake {stake.length} NFT{stake.length > 1 ? 's' : ''} for 7 days</span>
              }
            </div>}
          </div>

          <div className={styles.naviRight}>
            <div style={{background: 'none'}} className={styles.stakingButton} onClick={showCodes}>Show my winnings</div>
            <a href="https://magiceden.io/ru/marketplace/box-555" target="_blank" rel="noopener noreferrer">
              <img src="/img/me.png" alt="" />
            </a>
          </div>
          
        </div>

        <div className={styles.stakingWindow}>
          <div>
            {arr.map((k, i) => (
              <div key={i} className={styles.stakingWindowNft}
                style={{
                  boxShadow: stake.indexOf(k.mint) === -1 ? 'none' : '0px 0px 0px 5px #717579',
                  opacity: stake.indexOf(k.mint) === -1 ? .9 : 1
                }}
                onClick={() => {
                  setStake(prev => {
                    prev = [...prev];
                    const index = prev.indexOf(k.mint);
                    if (index === -1) prev.push(k.mint);
                    else prev.splice(index, 1);
                    return prev;
                  });
                }}
              >

                <div className={styles.stakingWindowPop}>
                  <h4>{k.name}</h4>
                  <img src={k.img} alt="" />
                </div>

              </div>
            ))}
          </div>
        </div>

        <div className={styles.navi}>
          <h1>Select NFTs for unstaking</h1>
          {unstake[0] && <div className={styles.stakingButton} onClick={getUnstake}>
            {
              proc ? <span style={{ display: 'flex', alignItems: 'center' }}>
                <img style={{ height: '20px', marginRight: '10px' }} src='/img/loader.gif' alt="" />{proc}</span> : <span>Unstake {unstake.length} NFT{unstake.length > 1 ? 's' : ''}</span>
            }
          </div>}
        </div>

        <div className={styles.stakingWindow}>
          <div>
            {sortTbody('start', staked).map((k, i) => (k.owner === user &&
              <div key={i} className={styles.stakingWindowNft}
                style={{
                  boxShadow: unstake.indexOf(k.mint) === -1 ? 'none' : '0px 0px 0px 5px #717579',
                  opacity: unstake.indexOf(k.mint) === -1 ? .9 : 1
                }}
                onClick={() => {
                  setUnstake(prev => {
                    prev = [...prev];
                    const index = prev.indexOf(k.mint);
                    if (index === -1) prev.push(k.mint);
                    else prev.splice(index, 1);
                    return prev;
                  });
                }}
              >

                <div className={styles.end}>{getEnd(k)}</div>

                <div className={styles.stakingWindowPop}>
                  <h4>{hash[k.mint]?.name}</h4>
                  <img src={hash[k.mint]?.img} alt="" />
                </div>

                <div className={styles.getBanner}>
                  <div onClick={getBanner.bind(this, k.mint)}>
                    {dl === k.mint ? <img style={{ height: '25px' }} src="/img/loader.gif" alt="" /> : 'Get Banner'}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

      <div className={styles.stakingTotalWrap}>

        {aval.length > 0 && <div className={styles.title}>
          <div>Claim your Rewards</div>
          <span><b>{aval.length}</b>spins avalible!</span>
        </div>}

        {aval.length > 0 && <Roulette conf={conf} acc={aval[0]} err={err} info={info} init={start} setBlock={setBlock} />}

        <div className={styles.info}>
          <div>Available for Staking: <span>{arr.length}</span></div>
          <div>Staked: <span>{staked.filter(k => k.owner === user)?.length}</span></div>
          <div className={styles.total}>Total Staked: <span>{staked.length}</span></div>
        </div>

        {aval.length > 0 && <div className={styles.spinButton}>
          <div onClick={manual}>Spin</div> 
        </div>}

      </div>

    </div>
  )
}