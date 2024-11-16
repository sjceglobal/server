# server
[서버의 기본 뼈대 생성]
- Nodejs 설치
- 설명은 모두 모듈화에 기반
- 어떤 시스템이든 서버의 기반한 모듈을 만든다.

- 서버 base 모듈 생성
<br>express 모듈 로드

- Database 커넥터 모듈 생성
<br>redis 모듈 로드
<br>mongoDB 모듈 로드

- 상속 받아 커스텀 라이브러리 생성
<br>redis getter / setter

- 에러 코드 처리
<br>20x 40x 50x

<br><br>
==================================
<br><br>

[서버의 코딩의 기본]

- web filter 체크
<br>(보안) xss 공격 방어
<br>request webfilter
<br>response webfilter

- invalidate 체크
<br>입력값에 대한 공백체크
<br>throw 처리

- 논리 로직 처리
<br>DB 커넥션 생성
<br>커넥션의 끝맺음 
<br>DB와의 통신 방식
<br>트랜잭션 처리
<br>rollback에 대한 개념
<br>throw 처리
<br>Data load & Save

- 에러코드 처리
<br>에러코드 정의(200, 403 등)

<br><br>
==================================
<br>
<br>
[개념]
- 동기처리와 비동기처리 개념
<br>Sync / Async

- 데이터 암호화
<br>단방향 암호화(SHA)
<br>대칭 양방향 암호화(AES)
<br>비대칭 양방향 암호화(RSA)

- 데이터 통신 방식
<br>SSL 개념
<br>JWT 개념

- CPU & Memory 역할
<br>클라이언트 기준
<br>서버 기준

- 캐싱 시스템
<br>클라이언트 캐시 용도
<br>서버의 캐시 용도
<br>캐시서버의 용도

- 서버개발자가 OS 공부를 해야하는 이유
<br>은행원 알고리즘(deadlock)
<br>전역변수와 지역변수의 사용법
<br>동시처리성의 중요성

- 패턴
<br>Singleton 패턴(메모리 적재시기와 사용법)
