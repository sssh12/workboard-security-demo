// 🛡️ 보안 관련 유틸리티 함수들

/**
 * HTML 태그를 안전하게 이스케이프
 * XSS 공격 방어
 */
function escapeHtml(text) {
  if (typeof text !== "string") {
    return text;
  }

  const htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return text.replace(/[&<>"'/]/g, function (match) {
    return htmlEscapes[match];
  });
}

/**
 * 위험한 HTML 태그 제거
 */
function sanitizeHtml(html) {
  if (typeof html !== "string") {
    return html;
  }

  // 위험한 태그들 제거
  const dangerousTags = [
    "script",
    "iframe",
    "object",
    "embed",
    "link",
    "meta",
    "style",
    "form",
    "input",
    "button",
    "textarea",
  ];

  let sanitized = html;

  dangerousTags.forEach((tag) => {
    const regex = new RegExp(`<${tag}[^>]*>.*?<\\/${tag}>`, "gis");
    sanitized = sanitized.replace(regex, "");

    // 자체 닫힌 태그도 제거
    const selfClosingRegex = new RegExp(`<${tag}[^>]*\\/>`, "gis");
    sanitized = sanitized.replace(selfClosingRegex, "");

    // 닫히지 않은 태그도 제거
    const unclosedRegex = new RegExp(`<${tag}[^>]*>`, "gis");
    sanitized = sanitized.replace(unclosedRegex, "");
  });

  // 위험한 이벤트 핸들러 제거
  const dangerousEvents = [
    "onload",
    "onclick",
    "onmouseover",
    "onerror",
    "onsubmit",
    "onfocus",
    "onblur",
    "onchange",
    "onkeyup",
    "onkeydown",
  ];

  dangerousEvents.forEach((event) => {
    const regex = new RegExp(`${event}\\s*=\\s*["'][^"']*["']`, "gis");
    sanitized = sanitized.replace(regex, "");
  });

  // javascript: 프로토콜 제거
  sanitized = sanitized.replace(/javascript:/gi, "");

  return sanitized.trim();
}

/**
 * 입력값 길이 제한
 */
function limitLength(text, maxLength = 1000) {
  if (typeof text !== "string") {
    return text;
  }

  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }

  return text;
}

/**
 * 문자열 입력값 검증
 */
function validateStringInput(input, fieldName = "field") {
  if (typeof input !== "string") {
    throw new Error(`${fieldName}은(는) 문자열이어야 합니다.`);
  }

  if (input.trim().length === 0) {
    throw new Error(`${fieldName}을(를) 입력해주세요.`);
  }

  return input.trim();
}

/**
 * 보안 로그 기록
 */
function logSecurityEvent(event, details) {
  const timestamp = new Date().toISOString();
  console.log(`🛡️ [${timestamp}] 보안 이벤트: ${event}`);
  if (details) {
    console.log(`   상세: ${JSON.stringify(details)}`);
  }
}

module.exports = {
  escapeHtml,
  sanitizeHtml,
  limitLength,
  validateStringInput,
  logSecurityEvent,
};
