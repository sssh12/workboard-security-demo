const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// 보안 개선된 회원가입 API
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    console.log("📝 회원가입 요청:", { name, email, department });

    // ✅ 입력값 검증 강화
    if (!name || !email || !password || !department) {
      return res.status(400).json({
        message: "모든 필드를 입력해주세요.",
      });
    }

    // ✅ 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "올바른 이메일 형식이 아닙니다.",
      });
    }

    // ✅ 비밀번호 강도 검증
    if (password.length < 8) {
      return res.status(400).json({
        message: "비밀번호는 최소 8자 이상이어야 합니다.",
      });
    }

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "이미 등록된 이메일입니다.",
      });
    }

    // ✅ 비밀번호 해싱 (보안 개선)
    console.log("🔐 비밀번호 해싱 처리 중...");
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 새 사용자 생성
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // 해싱된 비밀번호 저장
      department,
    });

    await newUser.save();

    console.log("✅ 사용자 생성 완료 (해싱된 비밀번호):", newUser.email);

    res.status(201).json({
      message: "회원가입이 완료되었습니다.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        department: newUser.department,
        role: newUser.role,
      },
      security: "🛡️ 비밀번호가 안전하게 암호화되어 저장되었습니다.",
    });
  } catch (error) {
    console.error("❌ 회원가입 오류:", error);
    res.status(500).json({
      message: "서버 오류가 발생했습니다.",
    });
  }
});

// 🛡️ 보안 개선된 로그인 API (NoSQL Injection 방어)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 로그인 시도:", email);

    // ✅ 입력값 검증
    if (!email || !password) {
      return res.status(400).json({
        message: "이메일과 비밀번호를 입력해주세요.",
      });
    }

    // ✅ 입력값 타입 검증 (NoSQL Injection 방어)
    if (typeof email !== "string" || typeof password !== "string") {
      console.log("🚫 NoSQL Injection 시도 차단: 입력값이 문자열이 아님");
      return res.status(400).json({
        message: "잘못된 입력 형식입니다.",
        security: "🛡️ NoSQL Injection 공격이 차단되었습니다.",
      });
    }

    // ✅ 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "올바른 이메일 형식이 아닙니다.",
      });
    }

    console.log("🛡️ 보안 쿼리 실행 중...");

    // ✅ 안전한 쿼리: 문자열만 허용
    const user = await User.findOne({ email: email });

    if (!user) {
      console.log("❌ 사용자를 찾을 수 없음:", email);
      return res.status(401).json({
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    // ✅ 해싱된 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("❌ 비밀번호 불일치");
      return res.status(401).json({
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    console.log("✅ 보안 로그인 성공:", user.email);

    // 성공 응답
    res.json({
      message: "로그인 성공",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
      },
      // ✅ 보안 정보 (디버그용)
      security: {
        message: "🛡️ 보안이 강화된 로그인입니다.",
        protections: [
          "NoSQL Injection 방어",
          "입력값 타입 검증",
          "비밀번호 해싱 검증",
          "이메일 형식 검증",
        ],
      },
    });
  } catch (error) {
    console.error("❌ 로그인 오류:", error);
    res.status(500).json({
      message: "서버 오류가 발생했습니다.",
    });
  }
});

// 개발용: 데이터베이스 초기화 API
router.delete("/reset-database", async (req, res) => {
  try {
    console.log("🗑️ 데이터베이스 초기화 요청");

    const result = await User.deleteMany({});

    console.log(`✅ ${result.deletedCount}명의 사용자 삭제 완료`);

    res.json({
      message: `데이터베이스 초기화 완료! ${result.deletedCount}명의 사용자가 삭제되었습니다.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("❌ 데이터베이스 초기화 오류:", error);
    res.status(500).json({
      message: "초기화 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

module.exports = router;
