const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// 회원가입 API (취약점 테스트를 위해 평문 저장)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    console.log("📝 회원가입 요청:", { name, email, department });

    // 입력값 검증
    if (!name || !email || !password || !department) {
      return res.status(400).json({
        message: "모든 필드를 입력해주세요.",
      });
    }

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "이미 등록된 이메일입니다.",
      });
    }

    // 🚨 취약점: 비밀번호를 평문으로 저장 (NoSQL Injection 테스트용)
    console.log("⚠️ 경고: 비밀번호를 평문으로 저장합니다! (취약점 테스트용)");

    // 새 사용자 생성 (평문 비밀번호)
    const newUser = new User({
      name,
      email,
      password, // 해싱 없이 평문으로 저장
      department,
    });

    // 데이터베이스에 저장
    await newUser.save();

    console.log("✅ 사용자 생성 완료 (평문 비밀번호):", newUser.email);

    // 성공 응답
    res.status(201).json({
      message: "회원가입이 완료되었습니다.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        department: newUser.department,
        role: newUser.role,
      },
      warning:
        "⚠️ 이 시스템은 비밀번호를 평문으로 저장합니다. (취약점 테스트용)",
    });
  } catch (error) {
    console.error("❌ 회원가입 오류:", error);
    res.status(500).json({
      message: "서버 오류가 발생했습니다.",
    });
  }
});

// 🚨 취약한 로그인 API (NoSQL Injection 포함)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 로그인 시도:", email);
    console.log("🔐 입력된 비밀번호 타입:", typeof password);
    console.log("🔐 입력된 비밀번호 값:", password);

    // 입력값 검증
    if (!email || !password) {
      return res.status(400).json({
        message: "이메일과 비밀번호를 입력해주세요.",
      });
    }

    // 🚨 치명적 취약점: 사용자 입력을 직접 MongoDB 쿼리에 사용
    console.log("⚠️ 취약한 NoSQL 쿼리 실행 중...");
    console.log("⚠️ 쿼리 조건:", { email, password });

    // 위험한 쿼리: 사용자 입력을 그대로 사용
    const user = await User.findOne({
      email: email,
      password: password, // 🚨 여기가 핵심 취약점!
    });

    if (user) {
      console.log("✅ 로그인 성공:", user.email);
      console.log("🚨 주의: 비밀번호 해싱 없이 평문 비교!");

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
        // 🚨 취약점: 디버그 정보 노출
        debug: {
          queryUsed: { email, password },
          vulnerability:
            typeof password === "object"
              ? "NoSQL Injection 공격 감지됨!"
              : "평문 비밀번호 비교",
          warning: "이 시스템은 의도적으로 취약합니다!",
        },
      });
    } else {
      console.log("❌ 로그인 실패");
      res.status(401).json({
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        debug: {
          queryUsed: { email, password },
          hint: 'NoSQL Injection을 시도해보세요: {"$ne": null}',
        },
      });
    }
  } catch (error) {
    console.error("❌ 로그인 오류:", error);
    res.status(500).json({
      message: "서버 오류가 발생했습니다.",
      // 🚨 취약점: 에러 정보 노출
      error: error.message,
      stack: error.stack,
    });
  }
});

// 개발용: 데이터베이스 초기화 API
router.delete("/reset-database", async (req, res) => {
  try {
    console.log("🗑️ 데이터베이스 초기화 요청");

    // 모든 사용자 삭제
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
