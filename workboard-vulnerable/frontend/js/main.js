// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 WorkBoard 메인 페이지 로드 완료");

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
      // 잘못된 데이터는 삭제
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
      displayPosts(posts);
    } else {
      displaySamplePosts();
    }
  } catch (error) {
    console.log("📡 API 연결 안됨, 샘플 데이터 표시");
    displaySamplePosts();
  }

  // 로딩 숨기기
  loadingElement.style.display = "none";
}

// 샘플 게시글 표시
function displaySamplePosts() {
  const samplePosts = [
    {
      id: 1,
      title: "🎉 WorkBoard 게시판 오픈!",
      content:
        "안전한 사내 게시판 시스템을 구축했습니다. 많은 이용 부탁드립니다. 새로운 기능들을 계속 추가할 예정이니 많은 관심 부탁드려요.",
      author: "관리자",
      createdAt: "2025-05-30T10:00:00Z",
      comments: 3,
      department: "개발팀",
    },
    {
      id: 2,
      title: "📢 보안 정책 안내",
      content:
        "모든 직원들은 강력한 비밀번호를 사용해주시기 바랍니다. 정기적인 비밀번호 변경도 권장합니다.",
      author: "보안팀",
      createdAt: "2025-05-30T09:30:00Z",
      comments: 1,
      department: "보안팀",
    },
    {
      id: 3,
      title: "🍕 점심 메뉴 추천",
      content:
        "오늘 점심으로 맛있는 피자 어떠세요? 근처에 새로 생긴 피자집이 정말 맛있다고 하네요!",
      author: "김철수",
      createdAt: "2025-05-30T09:00:00Z",
      comments: 5,
      department: "기획팀",
    },
  ];

  displayPosts(samplePosts);
}

// 게시글 목록 화면에 표시 (Bootstrap 카드 형태)
function displayPosts(posts) {
  const postsListElement = document.getElementById("posts-list");
  const noPostsElement = document.getElementById("no-posts");

  if (posts.length === 0) {
    noPostsElement.classList.remove("d-none");
    return;
  }

  // Bootstrap 카드 형태로 게시글 HTML 생성
  const postsHTML = posts
    .map(
      (post) => `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100 post-card shadow-sm" onclick="viewPost(${
              post.id
            })" style="cursor: pointer;">
                <div class="card-body">
                    <h5 class="card-title text-primary">${escapeHtml(
                      post.title
                    )}</h5>
                    <p class="card-text text-muted">${escapeHtml(
                      post.content.substring(0, 100)
                    )}${post.content.length > 100 ? "..." : ""}</p>
                </div>
                <div class="card-footer bg-transparent">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <small class="text-muted">
                                <i class="bi bi-person"></i> ${escapeHtml(
                                  post.author
                                )}
                                ${
                                  post.department
                                    ? `<span class="badge bg-secondary ms-1">${escapeHtml(
                                        post.department
                                      )}</span>`
                                    : ""
                                }
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
                            <i class="bi bi-chat"></i> 댓글 ${post.comments}개
                        </small>
                    </div>
                </div>
            </div>
        </div>
    `
    )
    .join("");

  postsListElement.innerHTML = postsHTML;
}

// 게시글 상세 보기 (임시)
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

    // localStorage에서 사용자 데이터 제거
    localStorage.removeItem("userData");

    // UI 상태 업데이트
    showLoggedOutState();

    // 성공 메시지 (상단 알림으로 표시)
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

// 날짜 포맷 (유틸리티)
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR");
}

// 알림 메시지 표시 함수
function showAlert(message, type = "info") {
  const alertContainer = document.getElementById("alertContainer");
  if (!alertContainer) {
    console.log("alertContainer를 찾을 수 없습니다:", message);
    // alertContainer가 없으면 기본 alert 사용
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

  // 자동 제거 (성공 메시지가 아닌 경우에만)
  if (type !== "success") {
    setTimeout(() => {
      const alert = alertContainer.querySelector(".alert");
      if (alert) {
        alert.remove();
      }
    }, 5000);
  }
}
