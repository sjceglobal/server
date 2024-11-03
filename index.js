import express from 'express';
import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

import crypto from 'crypto';



import pg from 'pg'
const { Client } = pg

// 추후 require가 필요한 경우 사용
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);


// __dirname 대체 방법
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
const port = 80;

// 기본 라우트 설정
// app.get('/', async (req, res) => {
//     await client.set('testkey', '거기에 들어가는 값');
//     const value = await client.get('testkey');
//     res.send(`결과 : ${value}`);
// });

// app.get('/login', async (req, res) => {
//     try {
//         try {
//             if (!req.query.userid) throw 'error';
//             if (!req.query.userpwd) throw 'error';
//         } catch (error) {
//             throw 'invalidate error';            
//         }
        
//         let userInfo = {};
//         let sessionId;

//         try {
//             const res = await pgClient.query(`select * from users where userid = '${req.query.userid}';`);
//             console.log('user info:', res.rows[0]);
//             userInfo = res.rows[0];
//         } catch (error) {
//             console.error('오류 발생:', error);
//             throw 'database(postgres) error';
//         } 

//         try {
//             sessionId = uuidv4(); 
//             await client.set(sessionId, JSON.stringify(userInfo), 'EX', 1800);
//         } catch (error) {
//             console.error('Redis 저장 실패:', error);
//             throw 'database(redis) error';
//         } 

//         res.status(200).json({ sessionId });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: '서버 에러' });
//     }
// });

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

app.get('/score', async (req, res) => {
    try {
        try {
            if (!req.query.sessionid) throw 'error';
        } catch (error) {
            throw 'invalidate error';            
        }
        
        let userInfo = {};
        let scoreInfo = {};
        const sessionId = req.query.sessionid;

        try {
            userInfo = JSON.parse(await client.get(sessionId));
        } catch (error) {
            console.error('Redis 로드 실패:', error);
            throw 'database(redis) error';
        } 

        try {
            const res = await pgClient.query(`select * from scores where userid = '${userInfo.userid}';`);
            console.log('score info:', res.rows[0]);
            scoreInfo = res.rows[0];
        } catch (error) {
            console.error('오류 발생:', error);
            throw 'database(postgres) error';
        } 

        res.status(200).json(scoreInfo.score);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '서버 에러' });
    }
});

app.post('/register', async(req, res) => {

    const encryptedData = req.body.data;
    console.log(encryptedData);
    const { username, password } = decrypt(encryptedData);
    console.log(username, password);
    return;
    try {
        try {
            if (!req.body.data.username) throw 'error';
            if (!req.body.data.password) throw 'error';
        } catch (error) {
            throw 'invalidate error';            
        }

        const registInfo = req.body.data;

        try {
            const res = await pgClient.query(`select * from users where userid = '${registInfo.username}';`);
            console.log(res.rows.length);

            if (res.rows.length > 0) {
                // 이미 존재하는 계정
                throw 'exist username';
            } else {
                // 회원 가입
                //const salt = crypto.randomBytes(16).toString('hex');
                const salt = `sjce${registInfo.username}`;
                const hashedPassword = hashPassword(registInfo.password, salt);
                const res = await pgClient.query(`INSERT INTO users (userid, password, level, nickname, email, phone) VALUES ('${registInfo.username}', '${hashedPassword}', 1, '${registInfo.username}', '${registInfo.username}@gmail.com', '');`);
                
            }
        } catch (error) {
            console.error('오류 발생:', error);
            throw 'database(postgres) error';
        } 

        res.status(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '서버 에러' });
    }
    // try {
    //     const encryptedData = req.body.data;
    //     const { username, password } = decrypt(encryptedData);

    //     if (users[username]) {
    //         return res.status(400).send('User already exists');
    //     }

    //     const salt = crypto.randomBytes(16).toString('hex');
    //     const hashedPassword = hashPassword(password, salt);

    //     users[username] = { salt, hashedPassword };
    //     res.send('User registered successfully');
    // } catch (error) {
    //     res.status(400).send('Error in decryption');
    // }
});

app.post('/login', async (req, res) => {
    try {
        try {
            if (!req.body.data.username) throw 'error';
            if (!req.body.data.password) throw 'error';
        } catch (error) {
            throw 'invalidate error';            
        }

        let sessionId = '';
        try {
            const loginInfo = req.body.data;

            const salt = `sjce${loginInfo.username}`;
            const hashedPassword = hashPassword(loginInfo.password, salt);
            const res = await pgClient.query(`select userid, level, nickname, email from users where userid = '${loginInfo.username}' and password = '${hashedPassword}';`);

            if (res.rows.length != 1) {
                throw 'login error!';
            } 
            
            console.log(`${loginInfo.username}님, 반갑습니다.`);

            sessionId = uuidv4(); 
            await client.set(sessionId, JSON.stringify(res.rows[0]), 'EX', 1800);
        } catch (error) {
            console.error('오류 발생:', error);
            throw 'database(postgres) error';
        } 

        res.status(200).json({ sessionId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '서버 에러' });
    }
    // try {
    //     const encryptedData = req.body.data;
    //     const { username, password } = decrypt(encryptedData);

    //     const user = users[username];
    //     if (!user) {
    //         return res.status(400).send('User not found');
    //     }

    //     const hashedPassword = hashPassword(password, user.salt);
    //     if (hashedPassword === user.hashedPassword) {
    //         res.send('Login successful');
    //     } else {
    //         res.status(400).send('Invalid password');
    //     }
    // } catch (error) {
    //     res.status(400).send('Error in decryption');
    // }
});

// 비밀번호 해싱 함수
const hashPassword = (password, salt) => {
    return crypto.createHmac('sha256', salt).update(password).digest('hex');
};

// AES-256 복호화 함수
function decrypt(encryptedData) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from('my_secret_key_32_chars_long!'), null);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
}

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});

// await -> 기다려라 -> 동기
const client = await createClient()
  .on('error', err => console.log('Redis Client Error', err))
  .connect();

const pgClient = new Client({
    host: '127.0.0.1',       // 데이터베이스 호스트
    port: 5432,              // PostgreSQL 포트 (기본값: 5432)
    user: 'postgres',          // 데이터베이스 사용자
    password: '123qwe1@qW', // 사용자 비밀번호
    database: 'postgres',  // 데이터베이스 이름
})
await pgClient.connect()

// 서버 종료 시 Redis 연결 종료
process.on('SIGINT', async () => {
  await client.quit();
  await pgClient.end();

  console.log('Redis 연결 종료.');
  process.exit(0);
});