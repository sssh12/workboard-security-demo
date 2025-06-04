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

// 라우트 연결
const authRoutes = require("./routes/auth");
const postsRoutes = require("./routes/posts");

app.use("/api", authRoutes);
app.use("/api", postsRoutes);

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

// 임시 게시글 목록 API
app.get("/api/posts", (req, res) => {
  const samplePosts = [
    {
      id: 1,
      title: "🎉 WorkBoard 게시판 오픈!",
      content:
        "안전한 사내 게시판 시스템을 구축했습니다. 많은 이용 부탁드립니다.",
      author: "관리자",
      createdAt: "2025-05-30T10:00:00Z",
      comments: 3,
    },
    {
      id: 2,
      title: "📢 보안 정책 안내",
      content: "모든 직원들은 강력한 비밀번호를 사용해주시기 바랍니다.",
      author: "보안팀",
      createdAt: "2025-05-30T09:30:00Z",
      comments: 1,
    },
    {
      id: 3,
      title: "🍕 점심 메뉴 추천",
      content: "오늘 점심으로 맛있는 피자 어떠세요?",
      author: "김철수",
      createdAt: "2025-05-30T09:00:00Z",
      comments: 5,
    },
  ];

  console.log("📡 게시글 목록 API 호출됨");
  res.json(samplePosts);
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행중입니다.`);
  console.log(`📱 테스트: http://localhost:${PORT}/api/test`);
});
