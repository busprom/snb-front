import { useEffect, useState } from 'react';
import { disconnect, getAddr, getStakeAccount, getWallet } from '../../rust/const';
import styles from './staking.module.sass';
import { getMySNB, getStakingAccounts } from '../../rust/staking/parse';
import { addToStaking, unstakeNft } from '../../rust/staking/classes';

const footerLinks = [
  { img: 'X', link: 'https://www.twitter.com/SolanaNBS' },
  { img: 'MagicEden', link: 'https://magiceden.io/marketplace/solananbs' },
  { img: 'Tensor', link: 'https://www.tensor.trade/trade/snb' },
  { img: 'Discord', link: 'https://www.discord.gg/snb' },
];


const buttonStaking = ['STAKE', 'STAKE ALL'];

export const Staking = ({ info, err }) => {
  const [user, setUser] = useState(false);
  const [aval, setAval] = useState([]);
  const [staked, setStaked] = useState([]);
  const [toStake, setToStake] = useState([]);
  const [toUnstake, setToUnstake] = useState([]);
  const [process, setProcess] = useState();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('wallet');
    if (user) {
      setUser(user);
      init(user);
    }
  }, []);

  const init = async wallet => {
    setToStake([]);
    setToUnstake([]);
    const my = await getMySNB(wallet);
    setAval(my || []);
    const s = await getStakingAccounts();
    setStaked(s);
  }

  const setWallet = async () => {
    if (user) {
      setUser(false);
      disconnect();
      setAval([]);
      return;
    }
    try {
      const user = await getWallet();
      setUser(user.publicKey.toBase58());
      init(user.publicKey);
    } catch (e) {
      setUser(false)
    }
  }

  const getStake = async type => {
    if (loader !== false) return;

    const arr = [];
    if(type === 'STAKE ALL') arr = aval.map(k => k.mint);
    else arr = [...toStake];

    if(!arr[0]) {
      err('Error Stake', 'Please select an NFT to stake');
      return;
    }
    
    try {
      setLoader(true);
      await addToStaking(arr, setProcess);
      await init(user);
      setLoader(false);
    } catch (e) {
      await init(user);
      setLoader(false);
    }
  }

  const getUnstake = async type => {
    if (loader !== false) return;

    const arr = [];
    if(type === 'STAKE ALL') {
      for(let i = 0; i < staked.length; i++) {
        if(staked[i].owner !== user) continue;
        if((parseInt(Date.now() / 1000) - staked[i].end) < 0) continue;
        arr.push(staked[i].mint);
      }
    }
    else arr = [...toUnstake];

    if(!arr[0]) {
      err('Error Unstake', 'Please select an NFT to unstake');
      return;
    }
    
    try {
      setLoader(true);
      await unstakeNft(arr, setProcess);
      await init(user);
      setLoader(false);
    } catch (e) {
      await init(user);
      setLoader(false);
    }
  }

  const claim = () => {
    err('Token Claiming Error', 'You do not have available tokens')
  }

  const stakingInfo = [
    { title: 'Staked:', text: staked.length },
    { title: 'Tokens avalible:', text: 0 },
    { title: 'Available for Staking:', text: aval.length },
    { title: 'Available for Unstaking:', text: 0 },
  ];

  return (
    <div className={styles.index}>
      <div className={styles.indexMenu}>
        <img className={styles.indexMenuLogo} src="/img/logo.svg" alt="logo" />
        <div className={styles.indexMenuLink}>
          Home
        </div>
        <div className={styles.indexMenuConnect} onClick={setWallet}>
          {user ? getAddr(user) : <>
            <img src="/img/phantom.svg" alt="phantom" />
            connect
          </>}
        </div>
        <img className={styles.indexMenuMob} src="/img/mobMenu.svg" alt="mobMenu" />
      </div>
      <div className={styles.indexStaking}>
        <div className={styles.indexStakingTopInfo}>
          {stakingInfo.map((k, i) => (
            <div className={styles.infoStakingWrap} key={i}>
              <div className={styles.infoStakingTitle}>
                {k.title}
              </div>
              {k.text}
            </div>
          ))}
          <div className={styles.indexButtonClaim} onClick={claim}>
            <img src="/img/Arrow.svg" alt="arrov" />
            Claim
            <img style={{ transform: 'rotate(180deg)' }} src="/img/Arrow.svg" alt="arrov" />
          </div>
        </div>

        <div className={styles.stakingWindowWrap}>
          <div className={styles.stakingWindow}>
            <div className={styles.stakingWindowHeader}>
              <div className={styles.stakingWindowHeaderTitle}>
                {toStake.length ? 'Selected ' + toStake.length + ' BUG' + (toStake.length > 1 ? 's' : '') : 'Select for Staking'}
              </div>
              {buttonStaking.map((k, i) => (
                <div key={i} className={styles.stakingWindowHeaderButton}>
                  <div className={styles.stakingButton}
                    onClick={getStake.bind(null, k)}
                  >
                    <img src="/img/Arrow.svg" alt="arrov" />
                    {k}
                    <img style={{ transform: 'rotate(180deg)' }} src="/img/Arrow.svg" alt="arrov" />
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.nftWrap}>
              {aval.map((k, i) => {
                const selected = toStake.indexOf(k.mint) === -1;
                return (
                  <div key={i} className={selected ? styles.nft : styles.nftActive}
                    onClick={() => setToStake(prev => {
                      prev = [...prev];
                      const index = prev.findIndex(key => key === k.mint);
                      if (index === -1) prev.push(k.mint);
                      else prev.splice(index, 1);
                      return prev;
                    })}
                  >
                    <img src={k.img} alt="" />
                    <div className={selected ? styles.nftName : styles.nftNameActive}>
                      {k.name}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className={styles.stakingWindow}>
            <div className={styles.stakingWindowHeader}>
              <div className={styles.stakingWindowHeaderTitle}>
                {toUnstake.length ? 'Selected ' + toUnstake.length + ' BUG' + (toUnstake.length > 1 ? 's' : '') : 'Select for Unstaking'}
              </div>
              {buttonStaking.map((k, i) => (
                <div key={i} className={styles.stakingWindowHeaderButton}>
                  <div className={styles.stakingButton} onClick={getUnstake.bind(null, k)}>
                    <img src="/img/Arrow.svg" alt="arrov" />
                    {k.replace('S', 'Uns')}
                    <img style={{ transform: 'rotate(180deg)' }} src="/img/Arrow.svg" alt="arrov" />
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.nftWrap}>
              {staked.map((k, i) => {
                if(k.owner !== user) return null;
                const selected = toUnstake.indexOf(k.mint) === -1;
                const end = (parseInt(Date.now() / 1000) - k.end) > 0;
                return (
                  end ? <div key={i} className={selected ? styles.nft : styles.nftActive}
                    onClick={() => setToUnstake(prev => {
                      prev = [...prev];
                      const index = prev.findIndex(key => key === k.mint);
                      if (index === -1) prev.push(k.mint);
                      else prev.splice(index, 1);
                      return prev;
                    })}
                  >
                    <img src={k.img} alt="" />
                    <div className={selected ? styles.nftName : styles.nftNameActive}>
                      {k.name}
                    </div>
                  </div>
                  : <div key={i} className={styles.nft}>
                    <img src={k.img} alt="" />
                    <div className={styles.nftName}>
                      {k.name}
                    </div>
                    <div className={styles.nftNotAvailable}>
                      Not available now
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
      <div className={styles.indexFooter}>
        <div className={styles.indexFooterLiks}>
          {footerLinks.map((k, i) => (
            <a target="_blank" rel="noopener noreferrer" key={i} href={k.link}>
              <img src={'/img/' + k.img + '.svg'} alt="link" />
            </a>
          ))}
        </div>
        <div>Solana Node Business.</div>
        <div>All Rights Reserved.</div>
        <div className={styles.indexFooterTextBottom}>©SNB 2024</div>

      </div>

    </div>
  )
}