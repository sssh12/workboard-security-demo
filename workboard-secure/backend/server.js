require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// 보안 유틸리티 import
const {
  escapeHtml,
  sanitizeHtml,
  limitLength,
  validateStringInput,
  logSecurityEvent,
} = require("./utils/security");

// Express 앱 생성
const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공
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

// 🛡️ 보안 게시글 저장을 위한 배열
let posts = [
  {
    _id: "1",
    title: "🛡️ 보안이 개선된 WorkBoard입니다!",
    content: "이 버전에서는 XSS 공격이 차단되고 NoSQL Injection이 방어됩니다.",
    author: "보안팀",
    createdAt: "2025-05-30T10:00:00Z",
    views: 25,
    comments: 5,
    department: "보안팀",
  },
  {
    _id: "2",
    title: "✅ 보안 개선 사항 안내",
    content:
      "HTML 태그 필터링, 입력값 검증, 비밀번호 해싱 등이 적용되었습니다.",
    author: "개발팀",
    createdAt: "2025-05-30T09:30:00Z",
    views: 18,
    comments: 2,
    department: "개발팀",
  },
];

// 기본 라우트
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// 🛡️ 보안 개선된 게시글 목록 API
app.get("/api/posts", (req, res) => {
  console.log("📡 보안 게시글 목록 API 호출됨");
  res.json(posts);
});

// 🛡️ 보안 개선된 게시글 작성 API
app.post("/api/posts", (req, res) => {
  try {
    const { title, content, author, authorId, department } = req.body;

    console.log("📝 보안 게시글 작성 요청:", { title, author });

    // ✅ 입력값 검증 강화
    if (!title || !content || !author) {
      return res.status(400).json({ message: "필수 필드가 누락되었습니다." });
    }

    // ✅ 문자열 타입 검증
    try {
      validateStringInput(title, "제목");
      validateStringInput(content, "내용");
      validateStringInput(author, "작성자");
    } catch (error) {
      logSecurityEvent("입력값 검증 실패", { error: error.message });
      return res.status(400).json({ message: error.message });
    }

    // ✅ XSS 공격 탐지
    const originalContent = content;
    const dangerousPatterns = [
      /<script/i,
      /<iframe/i,
      /javascript:/i,
      /onload=/i,
      /onerror=/i,
      /onclick=/i,
      /onmouseover=/i,
      /<object/i,
      /<embed/i,
    ];

    const hasXSS = dangerousPatterns.some(
      (pattern) => pattern.test(content) || pattern.test(title)
    );

    if (hasXSS) {
      logSecurityEvent("XSS 공격 시도 차단", {
        title,
        contentPreview: content.substring(0, 100),
        author,
      });
      console.log("🚫 XSS 공격 시도가 차단되었습니다!");
    }

    // ✅ 보안 처리: HTML 태그 제거 및 이스케이프
    const secureTitle = escapeHtml(limitLength(title, 200));
    const secureContent = sanitizeHtml(limitLength(content, 5000));

    console.log("🛡️ 보안 처리 완료:");
    console.log("  원본 길이:", originalContent.length);
    console.log("  처리 후 길이:", secureContent.length);
    console.log(
      "  제거된 태그:",
      originalContent !== secureContent ? "있음" : "없음"
    );

    // 새 게시글 생성 (보안 처리된 내용으로)
    const newPost = {
      _id: String(Date.now()),
      title: secureTitle,
      content: secureContent, // ✅ 보안 처리된 내용
      author: escapeHtml(author),
      authorId,
      department: escapeHtml(department || ""),
      createdAt: new Date().toISOString(),
      views: 0,
      comments: 0,
    };

    // 배열 맨 앞에 추가
    posts.unshift(newPost);

    console.log("✅ 보안 게시글 저장 완료:", newPost._id);

    res.status(201).json({
      message: "게시글이 안전하게 등록되었습니다.",
      post: newPost,
      security: {
        message: "🛡️ XSS 공격이 차단되고 안전하게 저장되었습니다.",
        protections: [
          "HTML 태그 제거",
          "위험한 이벤트 핸들러 제거",
          "입력값 길이 제한",
          "특수 문자 이스케이프",
        ],
        originalLength: originalContent.length,
        secureLength: secureContent.length,
        xssBlocked: hasXSS,
      },
    });
  } catch (error) {
    console.error("❌ 게시글 작성 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

// 라우트 연결
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

// 서버 시작
app.listen(PORT, () => {
  console.log(
    `🛡️ 보안 개선 서버가 http://localhost:${PORT} 에서 실행중입니다.`
  );
  console.log(`🔒 이 버전은 XSS와 NoSQL Injection이 방어됩니다.`);
});
