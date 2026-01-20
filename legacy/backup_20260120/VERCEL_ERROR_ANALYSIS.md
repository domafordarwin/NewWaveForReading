# Vercel 에러 분석: "No API key found in request"

## 🔴 발생한 에러

```json
{
  "message": "No API key found in request",
  "hint": "No `apikey` request header or url param was found."
}
```

**에러 발생 URL:**
```
https://aaxqoufnovhxargysfty.supabase.co/rest/v1/authoring_projects?project_id=eq.3
```

---

## 🔍 에러 원인 분석

### 1. 이것은 Supabase API 에러입니다

- **OpenAI 에러가 아님**
- Supabase 데이터베이스에 접근하려고 할 때 발생
- `authoring_projects` 테이블 조회 시도 중 발생

### 2. 왜 발생하는가?

**로컬 환경:**
```javascript
// .env 파일
VITE_SUPABASE_URL=https://aaxqoufnovhxargysfty.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here.

// supabaseClient.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
//                                    ✅ 키 있음    ✅ 키 있음
```

**Vercel 환경:**
```javascript
// ❌ .env 파일은 Git에 커밋되지 않음
// ❌ Vercel은 .env 파일을 읽을 수 없음

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;     // ❌ undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;  // ❌ undefined

export const supabase = createClient(undefined, undefined);
//                                    ❌ 없음      ❌ 없음

// Supabase 요청 시
fetch('https://...supabase.co/rest/v1/authoring_projects', {
  headers: {
    apikey: undefined  // ❌ API 키 없음!
  }
})
// → "No API key found in request" 에러 발생
```

### 3. 영향 범위

**작동하지 않는 기능:**
- ❌ 프로젝트 목록 조회
- ❌ 문항 데이터 로드
- ❌ 지문(Stimulus) 조회
- ❌ 사용자 데이터 접근
- ❌ 모든 데이터베이스 작업

**OpenAI는 별개 문제:**
- OpenAI도 같은 원인으로 작동 안 함 (환경 변수 없음)
- 하지만 Supabase 에러가 먼저 발생하여 페이지 로드 자체가 실패

---

## ✅ 해결 방법

### 필수: 3개의 환경 변수 모두 설정

Vercel Dashboard에서 **반드시 다음 3개를 모두** 설정해야 합니다:

```plaintext
1. VITE_SUPABASE_URL
   Value: https://aaxqoufnovhxargysfty.supabase.co

2. VITE_SUPABASE_ANON_KEY
   Value: your-supabase-anon-key-here

3. VITE_OPENAI_API_KEY (선택사항 - AI 문항 생성용)
   Value: sk-proj-YOUR_OPENAI_API_KEY_HERE
```

**각 변수마다:**
- Environments: ✅ Production, ✅ Preview, ✅ Development

---

## 📋 단계별 해결 가이드

### Step 1: Vercel Dashboard 접속
```
https://vercel.com/dashboard
```

### Step 2: 프로젝트 선택
- NewWaveForReading 프로젝트 클릭

### Step 3: Settings → Environment Variables
- 왼쪽 메뉴에서 "Environment Variables" 선택

### Step 4: 변수 추가 (3개)

**첫 번째 변수:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://aaxqoufnovhxargysfty.supabase.co`
- Environments: Production, Preview, Development 모두 체크
- **Add** 버튼 클릭

**두 번째 변수:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: (로컬 .env 파일에서 복사)
- Environments: Production, Preview, Development 모두 체크
- **Add** 버튼 클릭

**세 번째 변수:**
- Name: `VITE_OPENAI_API_KEY`
- Value: (로컬 .env 파일에서 복사)
- Environments: Production, Preview, Development 모두 체크
- **Add** 버튼 클릭

### Step 5: 재배포 (매우 중요!)

**Deployments 탭으로 이동:**
1. 최신 배포 찾기
2. 오른쪽 `···` 메뉴 클릭
3. **Redeploy** 선택
4. ⚠️ **"Use existing Build Cache" 체크 해제!**
5. **Redeploy** 버튼 클릭
6. 배포 완료 대기 (1-3분)

### Step 6: 확인

**방법 1: 브라우저 개발자 도구**
```javascript
// F12 → Console 탭에서 실행
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ 있음' : '❌ 없음');
console.log('OpenAI Key:', import.meta.env.VITE_OPENAI_API_KEY ? '✅ 있음' : '❌ 없음');
```

**방법 2: 진단 페이지**
```
https://your-app.vercel.app/diagnostics
```
- "진단 시작" 버튼 클릭
- 모든 항목이 ✅ 녹색인지 확인

**방법 3: 실제 기능 테스트**
- 프로젝트 목록 페이지 접속
- 데이터가 정상 로드되는지 확인
- 브라우저 콘솔에 에러가 없는지 확인

---

## 🎯 우선순위

**1순위: Supabase 환경 변수 (필수)**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- 이것이 없으면 앱이 아예 작동하지 않음

**2순위: OpenAI 환경 변수 (선택)**
- `VITE_OPENAI_API_KEY`
- 없어도 앱은 작동하지만 AI 문항 생성은 시뮬레이션 모드

---

## 🔧 빠른 체크

### Vercel에서 환경 변수가 제대로 설정되었는지 확인:

1. **Vercel Dashboard** → 프로젝트 → **Settings** → **Environment Variables**
2. 다음 3개가 있는지 확인:
   - ✅ VITE_SUPABASE_URL
   - ✅ VITE_SUPABASE_ANON_KEY
   - ✅ VITE_OPENAI_API_KEY
3. 각 변수의 "Environments" 열에 "Production, Preview, Development" 표시 확인

### 없다면:
- 위의 Step 4부터 다시 진행

### 있다면:
- Step 5 (재배포) 진행
- 재배포 시 빌드 캐시를 사용하지 않았는지 확인

---

## 🐛 여전히 같은 에러가 발생한다면

### 1. 브라우저 캐시 클리어
```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

### 2. 시크릿 모드에서 테스트
- 새 시크릿 창에서 Vercel URL 접속
- 캐시 없이 새로 로드

### 3. 배포 로그 확인
- Vercel Dashboard → Deployments → 최신 배포 클릭
- "Building" 섹션 펼치기
- 다음 내용이 있는지 확인:
```
✓ Collecting build environment variables
VITE_SUPABASE_URL: https://aaxqoufnovhxargysfty.supabase.co
VITE_SUPABASE_ANON_KEY: [REDACTED]
VITE_OPENAI_API_KEY: [REDACTED]
```

### 4. 환경 변수 이름 재확인
- 오타가 없는지 확인
- 정확한 이름:
  - `VITE_SUPABASE_URL` (VITE_ 접두사 필수)
  - `VITE_SUPABASE_ANON_KEY` (ANON 철자 확인)
  - `VITE_OPENAI_API_KEY` (API 단어 확인)

---

## 💡 왜 로컬에서는 작동하는가?

**로컬 개발 환경:**
```
프로젝트 폴더/frontend/.env 파일
    ↓
Vite가 파일 시스템에서 직접 읽음
    ↓
환경 변수 사용 가능 ✅
```

**Vercel 배포 환경:**
```
GitHub Repository (no .env file)
    ↓
Vercel Build (환경 변수 없음)
    ↓
Vercel Dashboard에서 설정 필요 ⚠️
    ↓
설정 후 재배포
    ↓
환경 변수 사용 가능 ✅
```

---

## 📌 핵심 요약

1. **에러 원인**: Vercel에 Supabase 환경 변수가 설정되지 않음
2. **영향**: 데이터베이스 접근 불가 → 앱 작동 불가
3. **해결**: Vercel Dashboard에서 환경 변수 3개 추가 후 재배포
4. **확인**: `/diagnostics` 페이지 또는 브라우저 콘솔

**환경 변수 설정 없이는 Vercel에서 절대 작동하지 않습니다!**

---

## 📚 관련 문서

- [README_OPENAI_VERCEL.md](./README_OPENAI_VERCEL.md) - 전체 가이드
- [VERCEL_TROUBLESHOOTING.md](./VERCEL_TROUBLESHOOTING.md) - 트러블슈팅
- [VERCEL_SETUP.md](./VERCEL_SETUP.md) - 초기 설정 가이드
