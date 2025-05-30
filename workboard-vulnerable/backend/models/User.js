const mongoose = require("mongoose");

// 사용자 스키마 정의 (사용자 정보 틀)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // 공백 자동 제거거
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true, // 이메일 중복 방지
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"], // 사용자 또는 관리자
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 모델 생성 및 내보내기
const User = mongoose.model("User", userSchema);
module.exports = User;
