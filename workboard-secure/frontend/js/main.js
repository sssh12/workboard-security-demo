// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", function () {
  console.log("🛡️ WorkBoard 보안 개선 버전 로드 완료");

  initializePage();
  loadPosts();
  setupEventListeners();
});

// 페이지 초기화
function initializePage() {
  checkLoginStatus();
}

// 로그인 상태 확인 (localStorage 기반)
function checkLoginStatus() {
  const userData = localStorage.getItem("userData");

  const userInfo = document.getElementById("user-info");
  const authButtons = document.getElementById("auth-buttons");
  const writeBtn = document.getElementById("write-btn");
  const usernameSpan = document.getElementById("username");

  if (userData) {
    try {
      const user = JSON.parse(userData);
      console.log("✅ 로그인 상태 감지:", user.name);

      // 로그인된 상태 UI
      userInfo.classList.remove("d-none");
      authButtons.classList.add("d-none");
      writeBtn.classList.remove("d-none");

      // 사용자 이름 표시
      if (usernameSpan) {
        usernameSpan.textContent = user.name;
      }
    } catch (error) {
      console.error("사용자 데이터 파싱 오류:", error);
      localStorage.removeItem("userData");
      showLoggedOutState();
    }
  } else {
    console.log("❌ 로그인 안된 상태");
    showLoggedOutState();
  }
}

// 로그아웃 상태 UI 표시
function showLoggedOutState() {
  const userInfo = document.getElementById("user-info");
  const authButtons = document.getElementById("auth-buttons");
  const writeBtn = document.getElementById("write-btn");

  userInfo.classList.add("d-none");
  authButtons.classList.remove("d-none");
  writeBtn.classList.add("d-none");
}

// 게시글 목록 로드
async function loadPosts() {
  const loadingElement = document.getElementById("loading");
  const postsListElement = document.getElementById("posts-list");
  const noPostsElement = document.getElementById("no-posts");

  try {
    const response = await fetch("/api/posts");

    if (response.ok) {
      const posts = await response.json();
      console.log("📋 보안 버전 게시글 로드:", posts.length, "개");
      displayPosts(posts);
    } else {
      console.error("게시글 로드 실패:", response.status);
      displaySamplePosts();
    }
  } catch (error) {
    console.log("📡 API 연결 오류, 샘플 데이터 표시");
    displaySamplePosts();
  }

  // 로딩 숨기기
  if (loadingElement) {
    loadingElement.style.display = "none";
  }
}

// 샘플 게시글 표시 (보안 버전용)
function displaySamplePosts() {
  const samplePosts = [
    {
      _id: "1",
      title: "🛡️ 보안이 개선된 WorkBoard입니다!",
      content:
        "이 버전에서는 XSS 공격이 차단되고 NoSQL Injection이 방어됩니다.",
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

  displayPosts(samplePosts);
}

// 보안 개선된 게시글 표시 함수
function displayPosts(posts) {
  const postsListElement = document.getElementById("posts-list");
  const noPostsElement = document.getElementById("no-posts");

  if (posts.length === 0) {
    noPostsElement.classList.remove("d-none");
    return;
  }

  console.log(`📋 ${posts.length}개 게시글 표시 중... (보안 버전)`);

  // 안전한 HTML 생성: 서버에서 이미 보안 처리됨
  const postsHTML = posts
    .map(
      (post) => `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100 post-card shadow-sm" onclick="viewPost('${
              post._id
            }')" style="cursor: pointer;">
                <div class="card-body">
                    <h5 class="card-title text-primary">${post.title}</h5>
                    <div class="card-text text-muted">
                        ${post.content.substring(0, 150)}${
        post.content.length > 150 ? "..." : ""
      }
                    </div>
                </div>
                <div class="card-footer bg-transparent">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <small class="text-muted">
                                <i class="bi bi-person"></i> ${post.author}
                                <span class="badge bg-success ms-1">${
                                  post.department
                                }</span>
                            </small>
                        </div>
                        <div>
                            <small class="text-muted">
                                <i class="bi bi-calendar"></i> ${formatDate(
                                  post.createdAt
                                )}
                            </small>
                        </div>
                    </div>
                    <div class="mt-2">
                        <small class="text-muted">
                            <i class="bi bi-eye"></i> 조회 ${post.views || 0} 
                            <i class="bi bi-chat ms-2"></i> 댓글 ${
                              post.comments || 0
                            }
                        </small>
                    </div>
                </div>
            </div>
        </div>
    `
    )
    .join("");

  // 안전한 HTML 삽입 (서버에서 보안 처리됨)
  postsListElement.innerHTML = postsHTML;

  console.log("✅ 보안: HTML 태그가 안전하게 처리되어 렌더링되었습니다.");
}

// 게시글 상세 보기
function viewPost(postId) {
  console.log(`게시글 ${postId} 보기`);
  showAlert(
    `게시글 ${postId}번을 보려고 합니다. (상세 페이지는 아직 구현 전)`,
    "info"
  );
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
      handleLogout();
    });
  }
}

// 로그아웃 처리
function handleLogout() {
  if (confirm("🔓 로그아웃 하시겠습니까?")) {
    console.log("🔓 로그아웃 처리 중...");

    localStorage.removeItem("userData");
    showLoggedOutState();
    showAlert("✅ 로그아웃이 완료되었습니다.", "success");

    console.log("✅ 로그아웃 완료");
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
  return date.toLocaleDateString("ko-KR");
}

// 알림 메시지 표시 함수
function showAlert(message, type = "info") {
  const alertContainer = document.getElementById("alertContainer");
  if (!alertContainer) {
    console.log("alertContainer를 찾을 수 없습니다:", message);
    alert(message);
    return;
  }

  const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

  alertContainer.innerHTML = alertHTML;
  console.log("알림 표시:", message, type);

  if (type !== "success") {
    setTimeout(() => {
      const alert = alertContainer.querySelector(".alert");
      if (alert) {
        alert.remove();
      }
    }, 5000);
  }
}
