import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export const shardStatus = {
	0: 'Ready',
	1: 'Connecting',
	2: 'Reconnecting',
	3: 'Idle',
	4: 'Nearly',
	5: 'Disconnected',
	6: 'Waiting for guilds',
	7: 'Identifying',
	8: 'Resuming'
};

export const shardColors = {
    0: 'green',
    1: 'yellow',
    2: 'yellow',
    3: 'yellow',
    4: 'yellow',
    5: 'red',
    6: 'grey',
    7: 'grey',
    8: 'grey'
}

export const shardNames = {
	0: 'Wacapev',
	1: 'Atlas',
	2: 'Metis',
	3: 'Tethys'
};

export interface Shard {
  id: number;
  status: number;
  guilds: number;
  ping: number;
}

export interface Props {
  data: Shard[]
}

const Home: NextPage = () => {
  const createShard = (shard: Shard) => {
    if (document.getElementById(`shardPing-${shard.id}`)) {
      // @ts-expect-error
      document.getElementById(`shardPing-${shard.id}`)?.textContent = `Ping: ${shard.ping}ms`;
      // @ts-expect-error
      document.getElementById(`shardGuilds-${shard.id}`)?.textContent = `Guilds: ${shard.guilds}`;
      // @ts-expect-error
      document.getElementById(`shardStatus-${shard.id}`)?.className = styles[shardColors[shard.status]];
      // @ts-expect-error
      document.getElementById(`shardStatus-${shard.id}`)?.textContent = shardStatus[shard.status];

      return;
    }

    const section = document.getElementsByTagName('section')[0];
    const dropDir = document.createElement('div');
    dropDir.className = styles.dropdown;

    const shardInfo = document.createElement('div');
    shardInfo.className = styles['shard-info'];

    const h3 = document.createElement('h3');
    h3.textContent = `Shard ${shard.id}`;

    const p = document.createElement('p');
    p.id = `shardStatus-${shard.id}`;
    // @ts-expect-error
    p.className = styles[shardColors[shard.status]];
    // @ts-expect-error
    p.textContent = shardStatus[shard.status];

    const dropContentDiv = document.createElement('div');
    dropContentDiv.className = styles['dropdown-content'];
    const a1 = document.createElement('a');
    const a2 = document.createElement('a');
    const a3 = document.createElement('a');
    a1.id = `shardName-${shard.id}`;
    a2.id = `shardPing-${shard.id}`;
    a3.id = `shardGuilds-${shard.id}`;

    // @ts-expect-error
    a1.textContent = `Name: ${shardNames[shard.id]}`;
    a2.textContent = `Ping: ${shard.ping}ms`;
    a3.textContent = `Guilds: ${shard.guilds}`;

    shardInfo.appendChild(h3);
    shardInfo.appendChild(p);
    dropDir.appendChild(shardInfo);
    dropContentDiv.appendChild(a1);
    dropContentDiv.appendChild(a2);
    dropContentDiv.appendChild(a3);
    dropDir.appendChild(dropContentDiv);
    section.appendChild(dropDir);
  }

  const checkEveryX = () => {
    if (typeof window === 'undefined') return;
    
    (async() => {
      const res = await fetch('https://api-infinity.hyrousek.tk/shards/list').catch(() => {});
      const data: Shard[] = await (res as Response)?.json().catch(() => {});

      if (!data?.[0] || !data?.[1] || !data?.[2]) {
        if (!data?.[0]) createShard({
          id: 0,
          status: 5,
          guilds: 0,
          ping: 0
        })

        if (!data?.[1]) createShard({
          id: 1,
          status: 5,
          guilds: 0,
          ping: 0
        })

        if (!data?.[2]) createShard({
          id: 2,
          status: 5,
          guilds: 0,
          ping: 0
        })
      }

      if (!data) return;

      for (const shard of data) {
        createShard(shard);
      }
    })();

    setTimeout(() => {
      checkEveryX();
    }, 10000)
  }

  return (
    <div>
      <Head>
        <title>Mr. Infinity - Status</title>
        <link rel='icon' href='https://cdn.discordapp.com/avatars/720321585625694239/a58c1c3f00ae92070ecb4d8045476d02.png' />

        { checkEveryX() }
      </Head>

      <div className={styles['yellow-line']}><p>Yellow Line</p></div> 
      <div className='center'>
        <div className={styles['top-text']}>
          <h1>Mr. Infinity&apos;s Status</h1>
          <p>Check bot status.</p>
        </div>

        <section>
        </section>
      </div>
    </div>
  )
}

export default Home
