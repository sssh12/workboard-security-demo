// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const passwordMatchDiv = document.getElementById("passwordMatch");

  // 이미 로그인된 상태인지 확인
  checkExistingLogin();

  // 비밀번호 확인 실시간 검증
  confirmPasswordInput.addEventListener("input", checkPasswordMatch);
  passwordInput.addEventListener("input", checkPasswordMatch);

  // 폼 제출 이벤트
  form.addEventListener("submit", handleSubmit);
});

// 기존 로그인 상태 확인
function checkExistingLogin() {
  const userData = localStorage.getItem("userData");
  if (userData) {
    try {
      const user = JSON.parse(userData);
      showAlert(
        `이미 ${user.name}님으로 로그인되어 있습니다. 메인 페이지로 이동합니다.`,
        "info"
      );
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } catch (error) {
      // 잘못된 데이터는 삭제
      localStorage.removeItem("userData");
    }
  }
}

// 비밀번호 일치 확인
function checkPasswordMatch() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const matchDiv = document.getElementById("passwordMatch");

  if (confirmPassword === "") {
    matchDiv.textContent = "";
    matchDiv.className = "form-text";
    return;
  }

  if (password === confirmPassword) {
    matchDiv.textContent = "✅ 비밀번호가 일치합니다.";
    matchDiv.className = "form-text text-success";
    return true;
  } else {
    matchDiv.textContent = "❌ 비밀번호가 일치하지 않습니다.";
    matchDiv.className = "form-text text-danger";
    return false;
  }
}

// 폼 제출 처리
async function handleSubmit(event) {
  event.preventDefault();

  // 비밀번호 일치 확인
  if (!checkPasswordMatch()) {
    showAlert("비밀번호가 일치하지 않습니다.", "danger");
    return;
  }

  // 버튼 상태 변경 (로딩 표시)
  setLoadingState(true);

  // 폼 데이터 수집
  const formData = new FormData(event.target);
  const userData = {
    name: formData.get("name").trim(),
    email: formData.get("email").trim().toLowerCase(),
    password: formData.get("password"),
    department: formData.get("department"),
  };

  try {
    // API 호출
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (response.ok) {
      // 성공
      showAlert(
        "🎉 회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.",
        "success"
      );

      // 2초 후 로그인 페이지로 이동
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } else {
      // 서버 오류
      showAlert(`❌ ${result.message || "회원가입에 실패했습니다."}`, "danger");
    }
  } catch (error) {
    console.error("회원가입 오류:", error);
    showAlert(
      "❌ 서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.",
      "danger"
    );
  } finally {
    // 버튼 상태 복원
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
    submitText.textContent = "처리중...";
    loadingSpinner.classList.remove("d-none");
  } else {
    submitBtn.disabled = false;
    submitText.textContent = "🚀 회원가입";
    loadingSpinner.classList.add("d-none");
  }
}

// 알림 메시지 표시
function showAlert(message, type = "info") {
  const alertContainer = document.getElementById("alertContainer");

  const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

  alertContainer.innerHTML = alertHTML;

  // 5초 후 자동 제거
  setTimeout(() => {
    const alert = alertContainer.querySelector(".alert");
    if (alert) {
      alert.remove();
    }
  }, 5000);
}
