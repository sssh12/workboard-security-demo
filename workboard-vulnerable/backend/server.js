// 필요한 라이브러리들 불러오기
require("dotenv").config(); // 환경 변수 사용을 위해
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const { time, timeStamp } = require("console");

// Express 앱 생성
const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors()); // 프론트엔드와 백엔드 간 통신 허용
app.use(express.json()); // JSON 데이터 파싱
app.use(express.urlencoded({ extended: true })); // 폼 데이터 파싱

// 정적 파일 제공 (HTML, CSS, JS 파일들)
app.use(express.static(path.join(__dirname, "../frontend")));

// MongoDB 연결
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB 연결 성공");
  })
  .catch((error) => {
    console.error("❌ MongoDB 연결 실패:", error);
  });

// 기본 라우트 (메인 페이지)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// 테스트용 API 엔드포인트
app.get("/api/test", (req, res) => {
  res.json({
    message: "서버가 정상적으로 작동 중입니다.",
    timestamp: new Date().toISOString(),
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행중입니다.`);
  console.log(`📱 테스트: http://localhost:${PORT}/api/test`);
});
