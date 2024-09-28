import express from 'express';
import { createClient } from 'redis';
import { createRequire } from 'module';

// 추후 require가 필요한 경우 사용
const require = createRequire(import.meta.url);

// Express 애플리케이션 생성
const app = express();
const port = 80;

// 기본 라우트 설정
app.get('/', async (req, res) => {
    await client.set('testkey', '거기에 들어가는 값');
    const value = await client.get('testkey');
    res.send(`결과 : ${value}`);
});

app.get('/login', async (req, res) => {
    const value = await client.get(req.query.userid);
    res.send(`사용자 정보 : ${value}`);
});

app.get('/test', async (req, res) => {
    let userInfo = {
        userid: 'testid',
        level: 1,
        nickname: '사대천왕',
        email: 'scjeglobal@gmail.com',
        phone: '01055671285'
    }
    await client.set(userInfo.userid, JSON.stringify(userInfo));

    userInfo = {
        userid: 'testid1',
        level: 10,
        nickname: '사대천왕111111',
        email: 'scjegloba111l@gmail.com',
        phone: '01055671285'
    }
    await client.set(userInfo.userid, JSON.stringify(userInfo));

    userInfo = {
        userid: 'testid2',
        level: 22,
        nickname: '사대천왕22222',
        email: 'scjegloba222l@gmail.com',
        phone: '01055671285'
    }
    await client.set(userInfo.userid, JSON.stringify(userInfo));

    userInfo = {
        userid: 'testid3',
        level: 1312,
        nickname: '사대천왕3333333',
        email: 'scjegl333obal@gmail.com',
        phone: '01055671285'
    }
    await client.set(userInfo.userid, JSON.stringify(userInfo));
});

app.get('/userinfo', async (req, res) => {
    const userInfo = {
        userid: 'testid',
        level: 1,
        nickname: '사대천왕',
        email: 'scjeglobal@gmail.com',
        phone: '01055671285'
    }
    await client.set('testid', JSON.stringify(userInfo));
    const value = await client.get('testid');
    res.send(`사용자 정보 : ${value}`);
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});

// await -> 기다려라 -> 동기
const client = await createClient()
  .on('error', err => console.log('Redis Client Error', err))
  .connect();

// 서버 종료 시 Redis 연결 종료
process.on('SIGINT', async () => {
  await client.quit();
  console.log('Redis 연결 종료.');
  process.exit(0);
});