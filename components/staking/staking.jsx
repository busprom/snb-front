import { useEffect, useState } from 'react';
import { disconnect, getAddr, getStakeAccount, getWallet } from '../../rust/const';
import styles from './staking.module.sass';
import { getMySNB, getStakingAccounts } from '../../rust/staking/parse';
import { addToStaking, unstakeNft } from '../../rust/staking/classes';

const footerLinks = [
  { img: 'X', link: '/' },
  { img: 'MagicEden', link: '/' },
  { img: 'Tensor', link: '/' },
  { img: 'Discord', link: '/' },
];

const stakingInfo = [
  { title: 'Staked:', text: '5555' },
  { title: 'Unstaked:', text: '5555' },
  { title: 'Available for Staking:', text: '5555' },
  { title: 'Available for Unstaking:', text: '5555' },
];

const buttonStaking = ['STAKE', 'STAKE ALL'];

export const Staking = ({ }) => {
  const [user, setUser] = useState(false);
  const [aval, setAval] = useState([]);
  const [staked, setStaked] = useState([]);
  const [toStake, setToStake] = useState([]);
  const [toUnstake, setToUnstake] = useState([]);
  const [process, setProcess] = useState();

  useEffect(() => {
    const user = localStorage.getItem('wallet');
    if (user) {
      setUser(user);
      init(user);
    }

  }, []);

  const init = async wallet => {
    const my = await getMySNB(wallet);
    setAval(my || []);
    const s = await getStakingAccounts();
    console.log(s);
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

  const getStake = async () => {
    if (loader !== false) return;
    setLoader(true);
    try {
      await addToStaking(toStake, setProcess);
      await init();
    } catch (e) {
      await init();
    }
  }

  const getUnstake = async () => {
    if (loader !== false) return;
    setLoader(true);
    try {
      await unstakeNft(toUnstake, setProcess);
      await init();
    } catch (e) {
      await init();
    }
  }

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
          <div className={styles.indexButtonClaim}>
            <img src="/img/Arrow.svg" alt="arrov" />
            Claim
            <img style={{ transform: 'rotate(180deg)' }} src="/img/Arrow.svg" alt="arrov" />
          </div>
        </div>

        <div className={styles.stakingWindowWrap}>
          <div className={styles.stakingWindow}>
            <div className={styles.stakingWindowHeader}>
              <div className={styles.stakingWindowHeaderTitle}>
                {toStake.length ? 'Selected '+toStake.length+' BUG' + (toStake.length > 1 ? 's' : '') : 'Select for Staking'}
              </div>
              {buttonStaking.map((k, i) => (
                <div key={i} className={styles.stakingWindowHeaderButton}>
                  <div className={styles.stakingButton}>
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
              <div className={styles.stakingWindowHeaderTitle}>Select for Staking</div>
              {buttonStaking.map((k, i) => (
                <div key={i} className={styles.stakingWindowHeaderButton}>
                  <div className={styles.stakingButton}>
                    <img src="/img/Arrow.svg" alt="arrov" />
                    {k}
                    <img style={{ transform: 'rotate(180deg)' }} src="/img/Arrow.svg" alt="arrov" />
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.nftWrap}>
              <div className={styles.nft}>
                <div className={styles.nftName}>
                  SNB #111
                </div>
              </div>
              <div className={styles.nftActive}>
                <div className={styles.nftNameActive}>
                  SNB #111
                </div>
              </div>
              <div className={styles.nft}>
                <div className={styles.nftName}>
                  SNB #111
                </div>
                <div className={styles.nftNotAvailable}>
                  Not available now
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
      <div className={styles.indexFooter}>
        <div className={styles.indexFooterLiks}>
          {footerLinks.map((k, i) => (
            <a key={i} href={k.link}>
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