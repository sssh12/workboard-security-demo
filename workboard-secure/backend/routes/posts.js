const express = require("express");
const Post = require("../models/Post");

const router = express.Router();

// 게시글 목록 조회 API
router.get("/posts", async (req, res) => {
  try {
    console.log("📋 게시글 목록 요청");

    // 최신 순으로 게시글 조회
    const posts = await Post.find({}).sort({ createdAt: -1 }).limit(20); // 최대 20개만

    console.log(`✅ ${posts.length}개의 게시글 반환`);

    res.json(posts);
  } catch (error) {
    console.error("❌ 게시글 목록 조회 오류:", error);
    res.status(500).json({
      message: "게시글을 불러오는 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

// 게시글 작성 API
router.post("/posts", async (req, res) => {
  try {
    const { title, content, author, authorId, department } = req.body;

    console.log("📝 게시글 작성 요청:", {
      title,
      contentLength: content?.length,
      author,
    });

    // 입력값 검증
    if (!title || !content || !author || !authorId || !department) {
      return res.status(400).json({
        message: "모든 필드를 입력해주세요.",
      });
    }

    // 🚨 XSS 취약점: HTML 태그를 그대로 저장
    console.log("⚠️ 경고: HTML 태그 필터링 없이 저장 중...");
    console.log("⚠️ 입력된 내용:", content);

    // 새 게시글 생성
    const newPost = new Post({
      title,
      content, // 🚨 여기서 XSS 취약점 발생!
      author,
      authorId,
      department,
    });

    // 데이터베이스에 저장
    const savedPost = await newPost.save();

    console.log("✅ 게시글 저장 완료:", savedPost._id);

    res.status(201).json({
      message: "게시글이 성공적으로 등록되었습니다.",
      post: {
        id: savedPost._id,
        title: savedPost.title,
        author: savedPost.author,
        department: savedPost.department,
        createdAt: savedPost.createdAt,
      },
      // 🚨 취약점: 저장된 내용을 그대로 반환 (디버그 정보)
      debug: {
        savedContent: savedPost.content,
        warning: "⚠️ HTML 태그가 필터링 없이 저장되었습니다!",
        xssRisk:
          "이 내용이 다른 사용자에게 표시될 때 XSS 공격이 실행될 수 있습니다.",
      },
    });
  } catch (error) {
    console.error("❌ 게시글 작성 오류:", error);
    res.status(500).json({
      message: "서버 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

// 개별 게시글 조회 API
router.get("/posts/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    console.log("📄 게시글 상세 조회:", postId);

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "게시글을 찾을 수 없습니다.",
      });
    }

    // 조회수 증가
    post.views += 1;
    await post.save();

    console.log("✅ 게시글 조회 완료:", post.title);

    res.json(post);
  } catch (error) {
    console.error("❌ 게시글 조회 오류:", error);
    res.status(500).json({
      message: "게시글을 불러오는 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

module.exports = router;
