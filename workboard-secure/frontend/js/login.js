// 데이터베이스 초기화 (개발용)
window.resetDatabase = async function () {
  if (
    !confirm("⚠️ 모든 사용자 데이터가 삭제됩니다. 정말 초기화하시겠습니까?")
  ) {
    return;
  }

  try {
    showAlert("🗑️ 데이터베이스 초기화 중...", "warning");

    const response = await fetch("/api/reset-database", {
      method: "DELETE",
    });

    const result = await response.json();

    if (response.ok) {
      showAlert(`✅ ${result.message}`, "success");
      console.log("데이터베이스 초기화 완료:", result);
    } else {
      showAlert(`❌ 초기화 실패: ${result.message}`, "danger");
    }
  } catch (error) {
    console.error("초기화 오류:", error);
    showAlert("❌ 초기화 중 오류가 발생했습니다.", "danger");
  }
};

// NoSQL Injection 테스트 함수
window.testNoSQLInjection = async function () {
  if (!confirm("⚠️ NoSQL Injection 공격을 시도합니다. 계속하시겠습니까?")) {
    return;
  }

  showAlert("🚨 NoSQL Injection 공격 실행 중...", "warning");

  try {
    // NoSQL Injection 페이로드
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@company.com",
        password: { $ne: null }, // 핵심: $ne 연산자로 우회
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("🚨 NoSQL Injection 성공!", result);
      showAlert(
        "🚨 NoSQL Injection 공격 성공! 비밀번호 없이 로그인되었습니다.",
        "danger"
      );

      // 사용자 정보 저장
      localStorage.setItem("userData", JSON.stringify(result.user));

      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    } else {
      console.log("❌ NoSQL Injection 실패:", result);
      showAlert(`❌ 공격 실패: ${result.message}`, "warning");
    }
  } catch (error) {
    console.error("NoSQL Injection 오류:", error);
    showAlert("❌ 공격 실행 중 오류가 발생했습니다.", "danger");
  }
};

// 로그인 상태 초기화 (개발용)
window.clearLogin = function () {
  localStorage.removeItem("userData");
  showAlert("🔄 로그인 상태가 초기화되었습니다.", "info");
  setTimeout(() => {
    window.location.reload();
  }, 1000);
};

// 코드 복사 기능 (수정된 버전)
window.copyCode = function () {
  // 공백 제거해서 코드 가져오기
  const codeElement = document.getElementById("nosql-code");
  const code = codeElement.textContent.trim().replace(/\s+/g, " ");

  navigator.clipboard
    .writeText(code)
    .then(() => {
      console.log("✅ 코드 복사 성공");
      // 버튼 찾기
      const btn = document.querySelector('button[onclick="copyCode()"]');
      if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = "✅ 복사됨!";
        btn.classList.add("btn-success");
        btn.classList.remove("btn-outline-light");

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove("btn-success");
          btn.classList.add("btn-outline-light");
        }, 2000);
      }
    })
    .catch((error) => {
      console.error("복사 실패:", error);
      // 수동 복사 안내
      const code = codeElement.textContent.trim();
      prompt("수동으로 복사해주세요:", code);
    });
};

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", handleLogin);

  // 이미 로그인된 상태인지 확인
  checkExistingLogin();
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

// 로그인 처리
async function handleLogin(event) {
  event.preventDefault();

  // 로딩 상태 시작
  setLoadingState(true);

  // 폼 데이터 수집
  const formData = new FormData(event.target);
  const loginData = {
    email: formData.get("email").trim(),
    password: formData.get("password"),
  };

  console.log("🔐 로그인 시도:", loginData.email);

  try {
    // 로그인 API 호출
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const result = await response.json();

    if (response.ok) {
      // 로그인 성공
      console.log("✅ 로그인 성공:", result.user);

      // 사용자 정보 저장 (로컬 스토리지)
      localStorage.setItem("userData", JSON.stringify(result.user));

      // 성공 메시지
      showAlert("🎉 로그인 성공! 메인 페이지로 이동합니다.", "success");

      // 메인 페이지로 이동
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } else {
      // 로그인 실패
      console.log("❌ 로그인 실패:", result.message);
      showAlert(`❌ ${result.message}`, "danger");
    }
  } catch (error) {
    console.error("로그인 오류:", error);
    showAlert(
      "❌ 서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.",
      "danger"
    );
  } finally {
    // 로딩 상태 종료
    setLoadingState(false);
  }
}

// 로딩 상태 설정
function setLoadingState(isLoading) {
  const loginBtn = document.getElementById("loginBtn");
  const loginText = document.getElementById("loginText");
  const loadingSpinner = document.getElementById("loadingSpinner");

  if (isLoading) {
    loginBtn.disabled = true;
    loginText.textContent = "처리중...";
    loadingSpinner.classList.remove("d-none");
  } else {
    loginBtn.disabled = false;
    loginText.textContent = "🚀 로그인";
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

function copySecurityTest() {
  const codeElement = document.getElementById("security-test-code");
  const textToCopy = codeElement.textContent || codeElement.innerText;

  // 클립보드에 복사
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      // 성공 시 버튼 텍스트 임시 변경
      const copyBtn = document.querySelector(
        'button[onclick="copySecurityTest()"]'
      );
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check me-2"></i>복사됨!';
      copyBtn.classList.remove("btn-outline-secondary");
      copyBtn.classList.add("btn-success");

      // 2초 후 원래 상태로 복원
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.classList.remove("btn-success");
        copyBtn.classList.add("btn-outline-secondary");
      }, 2000);

      console.log("✅ 보안 테스트 코드가 클립보드에 복사되었습니다!");
    })
    .catch((err) => {
      console.error("❌ 복사 실패:", err);
      alert("복사에 실패했습니다. 수동으로 코드를 복사해주세요.");
    });
}

// 보안 차단 테스트 함수
function testSecurityBlocking() {
  console.log("🛡️ 보안 차단 테스트 시작...");

  // NoSQL Injection 공격 시도
  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "admin@company.com",
      password: { $ne: null }, // NoSQL Injection 시도
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("🔍 보안 테스트 결과:", result);

      // 결과에 따른 알림
      if (result.success) {
        // 보안이 뚫린 경우 (이론적으로는 발생하지 않아야 함)
        alert(
          "❌ 경고: 보안 시스템이 우회되었습니다!\n이는 심각한 보안 취약점입니다."
        );
        console.error("❌ 보안 실패: NoSQL Injection 공격 성공");
      } else {
        // 보안이 제대로 작동한 경우
        alert(
          "✅ 보안 테스트 완료!\n\nNoSQL Injection 공격이 성공적으로 차단되었습니다.\n보안 시스템이 정상적으로 작동하고 있습니다."
        );
        console.log("✅ 보안 성공: 공격 차단됨");
      }

      // 에러 메시지가 있다면 표시
      if (result.error) {
        console.log("🛡️ 보안 메시지:", result.error);
      }
    })
    .catch((error) => {
      console.error("🚨 테스트 중 오류 발생:", error);
      alert("테스트 중 오류가 발생했습니다.\n콘솔을 확인해주세요.");
    });
}
