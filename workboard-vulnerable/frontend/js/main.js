// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 WorkBoard 메인 페이지 로드 완료");

  // 기본 초기화
  initializePage();
  loadPosts();
  setupEventListeners();
});

// 페이지 초기화
function initializePage() {
  // 로그인 상태 확인 (나중에 구현)
  checkLoginStatus();

  // 현재 사용자 정보 표시 (나중에 구현)
  displayUserInfo();
}

// 로그인 상태 확인 (임시 함수 - 나중에 실제 구현)
function checkLoginStatus() {
  // 임시로 로그인 안 된 상태로 설정
  const isLoggedIn = false;

  const userInfo = document.getElementById("user-info");
  const authButtons = document.getElementById("auth-buttons");
  const writeBtn = document.getElementById("write-btn");

  if (isLoggedIn) {
    userInfo.style.display = "flex";
    authButtons.style.display = "none";
    writeBtn.style.display = "inline-block";
  } else {
    userInfo.style.display = "none";
    authButtons.style.display = "flex";
    writeBtn.style.display = "none";
  }
}

// 사용자 정보 표시 (임시 함수)
function displayUserInfo() {
  // 나중에 실제 사용자 정보로 교체
  const username = document.getElementById("username");
  if (username) {
    username.textContent = "테스트 사용자";
  }
}

// 게시글 목록 로드
async function loadPosts() {
  const loadingElement = document.getElementById("loading");
  const postsListElement = document.getElementById("posts-list");
  const noPostsElement = document.getElementById("no-posts");

  try {
    // API 호출 (나중에 실제 API로 교체)
    const response = await fetch("/api/posts");

    if (response.ok) {
      const posts = await response.json();
      displayPosts(posts);
    } else {
      // 아직 API가 없으므로 샘플 데이터 표시
      dispalySamplePosts();
    }
  } catch (error) {
    console.log("📡 API 연결 안됨, 샘플 데이터 표시");
    dispalySamplePosts();
  }

  // 로딩 표시 숨기기
  loadingElement.style.display = "none";
}

// 샘플 게시글 표시 (개발 중 확인용)
function dispalySamplePosts() {
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
      title: "점심 메뉴 추천",
      content: "오늘 점심으로 맛있는 피자 어떠세요?",
      author: "김철수",
      createdAt: "2025-05-30T09:00:00Z",
      comments: 5,
    },
  ];

  displayPosts(samplePosts);
}

// 게시글 목록 화면에 표시
function displayPosts(posts) {
  const postsListElement = document.getElementById("posts-list");
  const noPostsElement = document.getElementById("no-posts");

  if (posts.length === 0) {
    noPostsElement.style.display = "block";
    return;
  }

  // 게시글 HTML 생성
  const postsHTML = posts
    .map(
      (post) => `
      <div class="post-item" onclick="viewPost(${post.id})">
          <div class="post-title">${escapeHtml(post.title)}</div>
          <div class="post-meta">
              <span>👤 ${escapeHtml(post.author)}</span>
              <span>📅 ${formatDate(post.createdAt)}</span>
              <span>💬 댓글 ${post.comments}개</span>
          </div>
          <div class="post-content">${escapeHtml(post.content)}</div>
      </div>
    `
    )
    .join("");

  postsListElement.innerHTML = postsHTML;
}

// 게시글 상세 보기 (나중에 구현)
function viewPost(postId) {
  console.log(`게시글 ${postId} 보기`);
  // 나중에 post.html로 이동하는 코드 추가
  alert(`게시글 ${postId}번을 보려고 합니다. (아직 구현 전)`);
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 새 글 작성 버튼
  const writeBtn = document.getElementById("write-btn");
  if (writeBtn) {
    writeBtn.addEventListener("click", function () {
      window.location.href = "write.html";
    });
  }

  // 로그아웃 버튼
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      // 나중에 실제 로그아웃 기능 구현
      alert("로그아웃 기능은 아직 구현 안 됨.");
    });
  }
}

// 유틸리티 함수들
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("ko-KR") +
    " " +
    date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
  );
}
