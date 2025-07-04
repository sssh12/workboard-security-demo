# 🛡️ WorkBoard - OWASP 취약점 분석 및 보안 개선 프로젝트

**웹 애플리케이션 보안 취약점 실습을 통한 시큐어 코딩 학습**

## 📖 프로젝트 개요

본 프로젝트는 사내 게시판 시스템 개발을 통해 OWASP Top 10에 해당하는 주요 웹 보안 취약점을 의도적으로 구현하고, 이를 체계적으로 분석한 후 보안이 강화된 코드로 개선하는 실습 프로젝트입니다.

취약점이 포함된 초기 버전과 보안이 개선된 최종 버전을 비교 분석함으로써 실무에서 적용 가능한 보안 개발 방법론을 습득하는 것을 목표로 합니다.

## 🎯 학습 목표

### **기술적 역량**

- OWASP Top 10 취약점에 대한 실질적 이해
- Node.js 기반 풀스택 웹 애플리케이션 개발 역량 향상
- MongoDB를 활용한 NoSQL 데이터베이스 설계 및 구현
- 시큐어 코딩 원칙 및 실무 적용 방법 습득

### **보안 분석 역량**

- 취약점 식별 및 위험도 평가 능력
- 공격 시나리오 분석 및 대응 방안 수립
- 코드 레벨에서의 보안 검토 역량

## 🚨 구현 대상 취약점

| 취약점 분류                    | 상세 설명                                                        | 위험도          |
| ------------------------------ | ---------------------------------------------------------------- | --------------- |
| **SQL Injection**              | 사용자 입력값 검증 부재로 인한 데이터베이스 조작 공격            | 🔴 High (9.0)   |
| **Cross-Site Scripting (XSS)** | 입력 데이터 필터링 미흡으로 인한 클라이언트 사이드 스크립트 실행 | 🟡 Medium (6.5) |

## 🛠️ 기술 스택

**Frontend**

- HTML5, CSS3, Vanilla JavaScript
- RESTful API

**Backend**

- Node.js
- Express.js
- Mongoose ODM

**Database**

- MongoDB Atlas (Cloud Database)

## 📋 개발 단계

1. **취약점 포함 시스템 구현** - 의도적 보안 취약점 포함한 기본 기능 개발
2. **취약점 분석 및 검증** - 실제 공격 시나리오를 통한 취약점 검증
3. **보안 강화 및 수정** - 각 취약점별 보안 대책 구현
4. **비교 분석 및 문서화** - 개선 전후 비교 분석 및 결과 문서화

## 📊 기대 성과

- **보안 취약점에 대한 실무적 이해도 향상**
- **방어적 프로그래밍 사고방식 정립**
- **웹 애플리케이션 보안 검토 역량 확보**
- **실제 개발 환경에서 적용 가능한 보안 코딩 스킬 습득**

# Development Period: 2025-05-30 ~ 2025-06-05
