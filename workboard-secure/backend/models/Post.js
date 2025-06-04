const mongoose = require("mongoose");

// 게시글 스키마 정의
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: true,
    // 🚨 XSS 취약점: HTML 태그를 허용하기 위해 검증 없음
    // 실제로는 여기서 HTML 태그를 제한해야 함
  },
  author: {
    type: String,
    required: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Number,
    default: 0,
  },
});

// 업데이트 시 updatedAt 자동 갱신
postSchema.pre("findOneAndUpdate", function () {
  this.set({ updatedAt: Date.now() });
});

// 모델 생성 및 내보내기
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
