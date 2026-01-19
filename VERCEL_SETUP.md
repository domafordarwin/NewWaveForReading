# Vercel에서 OpenAI 작동 확인 가이드

## 1. Vercel 환경 변수 설정 확인

### 방법 1: Vercel 대시보드에서 확인
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. **Settings** → **Environment Variables** 이동
4. 다음 환경 변수가 설정되어 있는지 확인:

```
VITE_OPENAI_API_KEY=sk-proj-YOUR_OPENAI_API_KEY_HERE
VITE_SUPABASE_URL=https://aaxqoufnovhxargysfty.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
VITE_API_URL=https://your-backend-api-url/api
```

**중요**:
- 환경 변수는 `Production`, `Preview`, `Development` 모두에 적용되어야 합니다
- 변경 후 재배포(Redeploy)가 필요합니다

### 방법 2: Vercel CLI로 설정 (선택사항)
```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 디렉토리에서
cd frontend

# 환경 변수 추가
vercel env add VITE_OPENAI_API_KEY
# 값 입력: sk-proj-YOUR_OPENAI_API_KEY_HERE
# 적용 환경: Production, Preview, Development 모두 선택

# 재배포
vercel --prod
```

## 2. 배포된 앱에서 OpenAI 작동 테스트

### 테스트 방법:
1. 배포된 Vercel URL 접속
2. 프로젝트 생성 또는 선택
3. **문항 관리** 탭 이동
4. **AI 문항 생성** 버튼 클릭
5. 문항 생성 다이얼로그에서:
   - 지문 선택
   - 문항 유형 선택 (예: 단일 선택 객관식)
   - 생성 개수 설정
   - **문항 생성** 버튼 클릭

### 예상 결과:
✅ **API 키가 설정된 경우:**
- 로딩 표시 후 실제 AI가 생성한 문항이 표시됨
- 품질 높은 독서 평가 문항 생성
- 토큰 사용량 정보 표시 (콘솔)

❌ **API 키가 없는 경우:**
- 시뮬레이션 모드로 작동 (코드 참조: `openaiService.ts:179`)
- "[AI 생성 N] ..." 형식의 더미 문항 생성
- 실제 GPT-4가 아닌 하드코딩된 템플릿 사용

## 3. 브라우저 개발자 도구로 확인

배포된 앱에서 개발자 도구를 열고:

```javascript
// 콘솔에서 환경 변수 확인
console.log(import.meta.env.VITE_OPENAI_API_KEY ? '✅ API 키 있음' : '❌ API 키 없음');

// 네트워크 탭에서 확인
// AI 문항 생성 시 다음 URL로 요청이 가는지 확인:
// https://api.openai.com/v1/chat/completions
```

**예상 동작:**
- API 키 있음: OpenAI API로 직접 요청
- API 키 없음: 시뮬레이션 모드, API 요청 없음

## 4. 빌드 확인 (로컬에서 Vercel 환경 시뮬레이션)

```bash
cd frontend

# production 빌드
npm run build

# 빌드된 파일 미리보기
npm run preview

# 브라우저에서 http://localhost:4173 접속
# 위의 테스트 방법대로 확인
```

## 5. 문제 해결

### 문제: "API 요청 실패" 또는 에러 발생
**해결:**
1. Vercel 환경 변수에 `VITE_OPENAI_API_KEY`가 정확히 설정되었는지 확인
2. 재배포 실행
3. 브라우저 캐시 삭제 후 재접속

### 문제: 시뮬레이션 모드로 작동 (더미 데이터 생성)
**원인:** API 키가 없거나 잘못 설정됨
**해결:**
1. 환경 변수명이 정확한지 확인: `VITE_OPENAI_API_KEY` (VITE_ 접두사 필수)
2. Vercel에서 재배포
3. 브라우저에서 하드 리프레시 (Ctrl+Shift+R)

### 문제: CORS 에러
**원인:** Vercel에서 OpenAI API로 요청 시 발생할 수 있음
**해결:** 현재 코드는 클라이언트에서 직접 OpenAI API를 호출하므로 정상 작동해야 함
- OpenAI API는 CORS를 지원합니다
- 만약 발생하면 백엔드 API를 통한 프록시 필요

## 6. 보안 고려사항

⚠️ **중요:** 현재 OpenAI API 키가 클라이언트에 노출됩니다.

**현재 구조:**
- `VITE_` 접두사는 클라이언트 번들에 포함됨
- 브라우저에서 API 키 확인 가능
- 사용량 제한이 없으면 비용 문제 발생 가능

**권장 개선 방안:**
1. 백엔드 API를 통한 프록시 사용
2. API 키를 서버 측에서만 관리
3. Rate limiting 적용
4. 사용자별 사용량 제한

```
Client → Backend API → OpenAI API
         (API 키 숨김)
```

## 7. 현재 상태 요약

| 항목 | 로컬 | Vercel |
|------|------|--------|
| API 키 설정 | ✅ 완료 | ❓ 확인 필요 |
| API 연결 테스트 | ✅ 성공 | ❓ 테스트 필요 |
| 코드 구현 | ✅ 완료 | ✅ 완료 |
| 환경 변수 | ✅ .env | ❓ Vercel Dashboard |

## 다음 단계

1. **Vercel Dashboard**에서 환경 변수 설정 확인/추가
2. 재배포 실행
3. 배포된 URL에서 AI 문항 생성 테스트
4. 브라우저 개발자 도구로 API 호출 확인

---

**참고:**
- OpenAI 서비스 파일: `frontend/src/services/openaiService.ts`
- AI 생성 훅: `frontend/src/hooks/useAIGeneration.ts`
- 환경 변수 예시: `frontend/.env.example`
