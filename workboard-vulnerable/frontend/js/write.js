// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", function () {
  // 로그인 상태 확인
  checkLoginStatus();

  // 폼 제출 이벤트
  const form = document.getElementById("writeForm");
  form.addEventListener("submit", handleSubmit);

  // 로그아웃 버튼 이벤트
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
});

// 로그인 상태 확인
function checkLoginStatus() {
  const userData = localStorage.getItem("userData");
  const logoutBtn = document.getElementById("logout-btn");

  if (!userData) {
    // 로그인하지 않은 경우 메인 페이지로 리다이렉트
    showAlert("로그인이 필요합니다. 로그인 페이지로 이동합니다.", "warning");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
    return;
  }

  try {
    const user = JSON.parse(userData);
    console.log("✅ 로그인 사용자:", user.name);

    // 로그아웃 버튼 표시
    if (logoutBtn) {
      logoutBtn.style.display = "inline-block";
    }
  } catch (error) {
    console.error("사용자 데이터 파싱 오류:", error);
    localStorage.removeItem("userData");
    window.location.href = "login.html";
  }
}

// 게시글 작성 처리
async function handleSubmit(event) {
  event.preventDefault();

  // 로딩 상태 시작
  setLoadingState(true);

  // 사용자 정보 가져오기
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData) {
    showAlert("로그인이 만료되었습니다. 다시 로그인해주세요.", "danger");
    setTimeout(() => (window.location.href = "login.html"), 2000);
    return;
  }

  // 폼 데이터 수집
  const formData = new FormData(event.target);
  const postData = {
    title: formData.get("title").trim(),
    content: formData.get("content").trim(), // 🚨 XSS: HTML 태그 그대로 전송
    author: userData.name,
    authorId: userData.id,
    department: userData.department,
  };

  console.log("📝 게시글 작성 요청:", {
    title: postData.title,
    contentLength: postData.content.length,
    author: postData.author,
  });

  try {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("✅ 게시글 작성 성공:", result);
      showAlert(
        "🎉 게시글이 성공적으로 등록되었습니다! 메인 페이지로 이동합니다.",
        "success"
      );

      // 2초 후 메인 페이지로 이동
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } else {
      console.log("❌ 게시글 작성 실패:", result);
      showAlert(
        `❌ ${result.message || "게시글 등록에 실패했습니다."}`,
        "danger"
      );
    }
  } catch (error) {
    console.error("게시글 작성 오류:", error);
    showAlert(
      "❌ 서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.",
      "danger"
    );
  } finally {
    setLoadingState(false);
  }
}

// 로딩 상태 설정
function setLoadingState(isLoading) {
  const submitBtn = document.getElementById("submitBtn");
  const submitText = document.getElementById("submitText");
  const loadingSpinner = document.getElementById("loadingSpinner");

  if (isLoading) {
    submitBtn.disabled = true;
    submitText.textContent = "등록 중...";
    loadingSpinner.classList.remove("d-none");
  } else {
    submitBtn.disabled = false;
    submitText.textContent = "📝 게시글 등록";
    loadingSpinner.classList.add("d-none");
  }
}

// 로그아웃 처리
function handleLogout() {
  if (confirm("🔓 로그아웃 하시겠습니까?")) {
    localStorage.removeItem("userData");
    showAlert("✅ 로그아웃이 완료되었습니다.", "success");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  }
}

// XSS 코드 복사 기능
window.copyXSS = function (button) {
  const xssCode = button.getAttribute("data-xss");
  navigator.clipboard
    .writeText(xssCode)
    .then(() => {
      const originalText = button.textContent;
      button.textContent = "복사됨!";
      button.classList.add("btn-success");
      button.classList.remove("btn-outline-secondary");

      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("btn-success");
        button.classList.add("btn-outline-secondary");
      }, 2000);
    })
    .catch(() => {
      alert("복사 실패. 수동으로 복사해주세요: " + xssCode);
    });
};

// 알림 메시지 표시
function showAlert(message, type = "info") {
  const alertContainer = document.getElementById("alertContainer");
  if (!alertContainer) return;

  const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

  alertContainer.innerHTML = alertHTML;

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
