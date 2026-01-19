# Vercel에서 OpenAI가 작동하지 않는 이유 및 해결 방법

## 🔍 문제 진단

로컬에서는 작동하지만 Vercel에서 작동하지 않는 경우, 다음 원인들을 체크해야 합니다.

## 주요 원인 및 해결 방법

### 1. 환경 변수가 Vercel에 설정되지 않음 ⭐ (가장 흔한 원인)

**증상:**
- 로컬에서는 AI 문항 생성이 정상 작동
- Vercel에서는 시뮬레이션 모드로 작동 (더미 데이터)
- 브라우저 콘솔에서 `import.meta.env.VITE_OPENAI_API_KEY` 확인 시 `undefined`

**원인:**
- `.env` 파일은 Git에 커밋되지 않음 (`.gitignore`에 포함)
- Vercel은 로컬 `.env` 파일에 접근할 수 없음
- Vercel Dashboard에서 환경 변수를 별도로 설정해야 함

**해결 방법:**

#### Step 1: Vercel Dashboard에서 환경 변수 추가
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. **Settings** 탭 클릭
4. 왼쪽 메뉴에서 **Environment Variables** 선택
5. 다음 변수들을 **하나씩** 추가:

```plaintext
Name: VITE_OPENAI_API_KEY
Value: sk-proj-YOUR_OPENAI_API_KEY_HERE
Environments: ✅ Production, ✅ Preview, ✅ Development

Name: VITE_SUPABASE_URL
Value: https://aaxqoufnovhxargysfty.supabase.co
Environments: ✅ Production, ✅ Preview, ✅ Development

Name: VITE_SUPABASE_ANON_KEY
Value: your-supabase-anon-key-here
Environments: ✅ Production, ✅ Preview, ✅ Development
```

#### Step 2: 재배포
환경 변수 추가 후 **반드시 재배포**해야 합니다:

**방법 1: Vercel Dashboard에서**
1. **Deployments** 탭으로 이동
2. 최신 배포 찾기
3. 오른쪽 `···` 메뉴 클릭
4. **Redeploy** 선택
5. **Use existing Build Cache** 체크 해제 (중요!)
6. **Redeploy** 버튼 클릭

**방법 2: Git Push로**
```bash
git add .
git commit -m "Update environment variables"
git push
```

#### Step 3: 확인
1. 재배포 완료 후 사이트 접속
2. `/diagnostics` 페이지 방문
3. **진단 시작** 버튼 클릭
4. 모든 항목이 ✅ 녹색인지 확인

---

### 2. 환경 변수 이름 오타

**증상:**
- Vercel에 환경 변수를 추가했는데도 작동하지 않음

**원인:**
- `VITE_OPENAI_API_KEY` (올바름)
- `OPENAI_API_KEY` (잘못됨 - VITE_ 접두사 누락)
- `VITE_OPENAI_KEY` (잘못됨 - API 누락)

**해결 방법:**
- 정확한 이름: `VITE_OPENAI_API_KEY` (대소문자 정확히)
- Vite는 `VITE_` 접두사가 있는 변수만 클라이언트에 노출

---

### 3. 빌드 캐시 문제

**증상:**
- 환경 변수를 추가하고 재배포했는데도 작동하지 않음

**원인:**
- Vercel이 이전 빌드 캐시를 사용
- 새 환경 변수가 빌드에 포함되지 않음

**해결 방법:**
```bash
# Vercel CLI 사용
vercel --force

# 또는 Dashboard에서 Redeploy 시
# "Use existing Build Cache" 체크 해제
```

---

### 4. 환경 적용 범위 미설정

**증상:**
- Production에서는 작동하지만 Preview에서 작동하지 않음 (또는 그 반대)

**원인:**
- 환경 변수를 특정 환경에만 적용

**해결 방법:**
- 환경 변수 추가 시 **모든 환경 선택**:
  - ✅ Production
  - ✅ Preview
  - ✅ Development

---

### 5. API 키 오류

**증상:**
- 환경 변수는 설정되었으나 API 호출 실패
- 브라우저 콘솔에 "401 Unauthorized" 또는 "Invalid API Key"

**원인:**
- 잘못된 API 키
- 만료된 API 키
- API 키 복사 시 공백이나 줄바꿈 포함

**해결 방법:**
1. [OpenAI Dashboard](https://platform.openai.com/api-keys)에서 키 확인
2. 새 키 생성 (기존 키가 의심되는 경우)
3. 공백 없이 정확히 복사
4. Vercel에서 환경 변수 업데이트
5. 재배포

---

### 6. CORS 또는 네트워크 정책 문제

**증상:**
- 브라우저 콘솔에 "CORS error" 또는 "Network error"
- API 요청이 차단됨

**원인:**
- 드물지만, Vercel의 네트워크 정책이나 방화벽
- 브라우저 확장 프로그램 (광고 차단 등)

**해결 방법:**
1. 브라우저 개발자 도구 → Network 탭 확인
2. OpenAI API 요청 (`api.openai.com`) 확인
3. 실패 시 응답 상태 코드 확인
4. 다른 브라우저나 시크릿 모드에서 테스트

**임시 해결책: 백엔드 프록시 사용**
```typescript
// 백엔드 API를 통해 OpenAI 호출
// 클라이언트 → 백엔드 → OpenAI
// 이렇게 하면 CORS 문제 해결 + API 키 보안 향상
```

---

### 7. Vite 빌드 시점 문제

**증상:**
- 환경 변수가 빌드에 포함되지 않음

**원인:**
- Vite는 빌드 시점에 환경 변수를 번들에 포함
- 런타임에는 변경 불가

**확인 방법:**
```javascript
// 브라우저 콘솔에서
console.log(import.meta.env.VITE_OPENAI_API_KEY);
```

**해결 방법:**
- 환경 변수 추가/변경 후 **반드시 재배포**
- 빌드 캐시 클리어 후 재배포

---

## 🔧 단계별 체크리스트

Vercel에서 OpenAI가 작동하지 않을 때 순서대로 확인:

### ✅ 1단계: 환경 변수 확인
- [ ] Vercel Dashboard → Settings → Environment Variables 접속
- [ ] `VITE_OPENAI_API_KEY`가 존재하는가?
- [ ] 값이 `sk-proj-YOUR_OPENAI_API_KEY_HERE`로 시작하는가?
- [ ] Production, Preview, Development 모두 선택되었는가?

### ✅ 2단계: 재배포
- [ ] Deployments 탭에서 Redeploy 실행
- [ ] "Use existing Build Cache" 체크 해제했는가?
- [ ] 배포 완료까지 대기 (보통 1-3분)

### ✅ 3단계: 브라우저 확인
- [ ] 배포된 URL 접속
- [ ] 브라우저 캐시 클리어 (Ctrl+Shift+R)
- [ ] `/diagnostics` 페이지 접속
- [ ] 진단 시작 버튼 클릭

### ✅ 4단계: 개발자 도구 확인
- [ ] F12로 개발자 도구 열기
- [ ] Console 탭에서 에러 확인
- [ ] 다음 명령어 실행:
```javascript
console.log('OpenAI Key:', import.meta.env.VITE_OPENAI_API_KEY ? '✅ 있음' : '❌ 없음');
```

### ✅ 5단계: Network 탭 확인
- [ ] AI 문항 생성 시도
- [ ] Network 탭에서 `api.openai.com` 요청 확인
- [ ] 요청이 있는가? 응답 코드는?
  - 200: ✅ 성공
  - 401: ❌ 잘못된 API 키
  - 없음: ❌ 환경 변수 누락

---

## 🎯 가장 빠른 해결 방법

**90%의 경우 이것만으로 해결됩니다:**

1. **Vercel Dashboard → Settings → Environment Variables**
2. **Add 버튼 클릭**
3. **이름**: `VITE_OPENAI_API_KEY`
4. **값**: 프로젝트 `.env` 파일에서 복사
5. **환경**: Production, Preview, Development 모두 선택
6. **Deployments → 최신 배포 → Redeploy** (캐시 사용 안 함)
7. **1-2분 대기 후 `/diagnostics` 접속하여 확인**

---

## 🛠️ 고급 디버깅

### Vercel 빌드 로그 확인

1. Vercel Dashboard → Deployments 탭
2. 최신 배포 클릭
3. "Building" 섹션 펼치기
4. 다음 내용 확인:
```
✓ Collecting build environment variables
VITE_OPENAI_API_KEY: [REDACTED]
```

### 배포된 빌드 파일 확인

브라우저에서:
```javascript
// 빌드된 JS 파일에 API 키가 포함되었는지 확인
// (개발자 도구 → Sources 탭 → _next/static/...)
// "VITE_OPENAI_API_KEY" 검색
```

### Vercel CLI로 로컬 테스트

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 디렉토리에서
cd frontend

# Vercel 환경과 동일하게 로컬 테스트
vercel dev

# 브라우저에서 http://localhost:3000/diagnostics 접속
```

---

## 📞 추가 지원

모든 방법을 시도했는데도 작동하지 않는다면:

1. **Vercel 지원팀 문의**:
   - Dashboard → Help 버튼
   - 환경 변수 스크린샷 첨부

2. **OpenAI 상태 확인**:
   - [OpenAI Status](https://status.openai.com/)
   - API 서비스 정상 작동 확인

3. **프로젝트 진단 정보 수집**:
```bash
# 로컬에서 실행
cd frontend
npm run build
# 빌드 성공 여부 확인

# 환경 변수 확인
node -e "console.log(process.env.VITE_OPENAI_API_KEY)"
```

---

## 🔐 보안 권장사항

**현재 구조의 보안 이슈:**
- `VITE_` 접두사 변수는 클라이언트 번들에 포함됨
- 브라우저에서 API 키 확인 가능
- 악의적 사용자가 API 키를 탈취하여 사용할 수 있음

**프로덕션 권장 구조:**
```
Client → Backend API (Node.js/Express) → OpenAI API
                ↓
          API 키는 서버에만 저장
          환경 변수는 VITE_ 접두사 없이
```

**개선 방안:**
1. 백엔드 API 엔드포인트 생성 (`/api/generate-items`)
2. 서버에서만 OpenAI API 호출
3. Rate limiting 및 인증 추가
4. 사용량 모니터링

---

## 요약

**문제:** Vercel에서 OpenAI 작동 안 함
**가장 흔한 원인:** 환경 변수 미설정
**해결:** Vercel Dashboard에서 환경 변수 추가 후 재배포
**확인:** `/diagnostics` 페이지에서 테스트

**여전히 안 되면:** 이 문서의 체크리스트를 순서대로 따라가세요.
