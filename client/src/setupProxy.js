// CORS 정책 때문에 백엔드 서버와 클라이언트 서버 데이터 전송 오류(포트 달라서)
// http-proxy-middleware 설치 후에 이 파일 생성
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',

    createProxyMiddleware({
      target: 'http://localhost:5000', // 요청코자 하는 노드 서버

      changeOrigin: true,
    })
  );
};

// What is proxy?
// 유저 - 프록시서버 - 인터넷
// 프록시서버에서 ip, 데이터를 임의로 변경할 수 있다.
// 방화벽 기능, 웹필터 기능, 캐시 데이터, 공유 데이터 제공 기능
// 캐쉬를 이용해 더 빠른 인터넷 이용, 더 나은 보안, 이용 제한된 사이트 접근 가능
