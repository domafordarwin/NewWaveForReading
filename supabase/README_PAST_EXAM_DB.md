# 기출 문항 DB 시스템

## 개요

리딩 PRO 문해력 진단 시스템의 기출 문항 데이터베이스입니다.  
문항, 지문(자극), 채점 기준(루브릭), 정답 키를 통합 관리하고 조회할 수 있습니다.

## 데이터 출처

- [25-문해력진단-최종-중등 고학년-문항개발 1020.pdf](../docs/25-문해력진단-최종-중등%20고학년-문항개발%201020.pdf)
- [25-문해력진단-최종-중학교 저학년-문항개발 (1020).pdf](<../docs/25-문해력진단-최종-중학교%20저학년-문항개발%20(1020).pdf>)
- [25-문해력진단-최종-초고-문항개발 (1020).pdf](<../docs/25-문해력진단-최종-초고-문항개발%20(1020).pdf>)
- [25-문해력진단-최종-초고-교사용 정답및루브릭 (1020).pdf](<../docs/25-문해력진단-최종-초고-교사용%20정답및루브릭%20(1020).pdf>)
- [25-문해력진단-최종-초저-교사용 정답&루브릭 0810.pdf](../docs/25-문해력진단-최종-초저-교사용%20정답&루브릭%200810.pdf)

## 데이터베이스 스키마

### 핵심 테이블 구조

```
item_bank (문항 은행)
├── stimuli (지문/자료)
├── item_options (객관식 보기)
│   └── item_option_scoring (보기별 채점 정보)
├── item_keys (정답 키)
├── rubrics (채점 루브릭)
│   ├── rubric_criteria (채점 기준)
│   └── rubric_levels (수준별 기술)
└── item_domain_map (평가 영역 매핑)
```

### SQL 뷰 (Views)

기출 문항 조회를 위한 통합 뷰가 제공됩니다:

| 뷰 이름                       | 설명                              |
| ----------------------------- | --------------------------------- |
| `v_past_exam_items`           | 기출문항 종합 뷰 (문항+지문 통합) |
| `v_item_options_with_scoring` | 객관식 보기와 채점 정보 통합      |
| `v_rubric_details`            | 루브릭 상세 정보                  |
| `v_rubric_criteria_levels`    | 루브릭 채점 기준과 수준 통합      |
| `v_item_answer_keys`          | 정답 키 정보                      |
| `v_item_domains`              | 문항별 평가 영역 매핑             |
| `v_past_exam_statistics`      | 학년군별 통계                     |

## 설치 및 설정

### 1. 스키마 실행

```bash
# 문항 은행 스키마 실행 (필수)
psql -d your_database -f supabase/item_bank_schema.sql

# 기출 문항 뷰 생성
psql -d your_database -f supabase/past_exam_items_view.sql
```

### 2. 시드 데이터 적재

```bash
# 영역(Domain) 시드
psql -d your_database -f supabase/domains_extended_seed.sql

# 학년군별 문항 시드
psql -d your_database -f supabase/elemhigh_items_seed.sql      # 초등 고학년
psql -d your_database -f supabase/midhigh_items_seed.sql       # 중등 고학년
psql -d your_database -f supabase/midlow_items_seed_corrected.sql  # 중등 저학년

# 정답 키 시드
psql -d your_database -f supabase/elementary_high_item_keys_seed.sql
psql -d your_database -f supabase/midhigh_item_keys_seed.sql
psql -d your_database -f supabase/midlow_item_keys_seed.sql

# 루브릭 시드
psql -d your_database -f supabase/elemhigh_rubrics_seed.sql
psql -d your_database -f supabase/midhigh_rubrics_seed.sql
psql -d your_database -f supabase/midlow_rubrics_seed.sql
```

## 웹 페이지 접속

프론트엔드 실행 후 다음 경로로 접속합니다:

```
http://localhost:5173/question-dev/past-exam
```

### 기능

1. **문항 목록 조회**
   - 학년군별 탭 필터링 (초저/초고/중저/중고)
   - 문항 유형 필터 (객관식/서술형)
   - 난이도 필터
   - 검색 기능
   - 지문별 그룹화 보기

2. **문항 상세 조회**
   - 지문(자극) 미리보기
   - 객관식 보기 및 정답 표시
   - 루브릭(채점 기준) 조회
   - 평가 영역 분석

3. **채점 기준 조회**
   - 분석적 루브릭 (채점 기준별 수준 기술)
   - 정답 근접도 점수
   - 오답 피드백

## API 사용 예시

### TypeScript (프론트엔드)

```typescript
import {
  fetchPastExamItems,
  fetchPastExamItemComplete,
  fetchPastExamStatistics,
} from "../services/pastExamService";

// 전체 문항 조회
const items = await fetchPastExamItems();

// 필터 적용 조회
const filteredItems = await fetchPastExamItems({
  gradeBand: "중고",
  itemType: "essay",
  searchTerm: "AI",
});

// 문항 상세 조회 (문항+보기+루브릭+정답키+영역 통합)
const itemData = await fetchPastExamItemComplete(itemId);

// 통계 조회
const stats = await fetchPastExamStatistics();
```

### SQL (직접 쿼리)

```sql
-- 기출 문항 조회
SELECT * FROM v_past_exam_items
WHERE grade_band = '중고'
  AND item_type = 'essay'
ORDER BY item_code;

-- 문항별 채점 기준 조회
SELECT rcl.*
FROM v_rubric_criteria_levels rcl
JOIN v_rubric_details rd ON rd.rubric_id = rcl.rubric_id
WHERE rd.item_id = 123
ORDER BY rcl.criterion_order, rcl.level_value DESC;

-- 학년군별 통계
SELECT * FROM v_past_exam_statistics;
```

## 파일 구조

```
supabase/
├── item_bank_schema.sql           # 문항 은행 핵심 스키마
├── past_exam_items_view.sql       # 기출 문항 뷰 (NEW)
├── elemhigh_items_seed.sql        # 초등 고학년 문항
├── elemhigh_rubrics_seed.sql      # 초등 고학년 루브릭
├── elementary_high_item_keys_seed.sql  # 초등 고학년 정답 키
├── midhigh_items_seed.sql         # 중등 고학년 문항
├── midhigh_rubrics_seed.sql       # 중등 고학년 루브릭
├── midhigh_item_keys_seed.sql     # 중등 고학년 정답 키
├── midlow_items_seed_corrected.sql # 중등 저학년 문항
├── midlow_rubrics_seed.sql        # 중등 저학년 루브릭
└── midlow_item_keys_seed.sql      # 중등 저학년 정답 키

frontend/src/
├── types/
│   └── pastExam.ts               # 기출 문항 타입 정의
├── services/
│   └── pastExamService.ts        # 기출 문항 API 서비스
└── pages/
    ├── PastExamList.tsx          # 기출 문항 목록 페이지
    └── PastExamDetail.tsx        # 기출 문항 상세 페이지
```

## 문항 유형

| 코드         | 설명               | 배점  |
| ------------ | ------------------ | ----- |
| `mcq_single` | 객관식 (단일 선택) | 1점   |
| `mcq_multi`  | 객관식 (복수 선택) | 1-2점 |
| `essay`      | 서술형             | 5점   |
| `short_text` | 단답형             | 1-2점 |
| `composite`  | 복합문항           | 다양  |

## 학년군

| 코드   | 설명        | 대상 학년   |
| ------ | ----------- | ----------- |
| `초저` | 초등 저학년 | 1-2학년     |
| `초고` | 초등 고학년 | 3-6학년     |
| `중저` | 중등 저학년 | 중1-2학년   |
| `중고` | 중등 고학년 | 중3-고1학년 |

## 루브릭 구조

### 분석적 채점 (analytic)

```json
{
  "title": "서술형 1 채점 기준",
  "description": "아이작/시몬 선택 및 이유 서술",
  "total_points": 5,
  "criteria": [
    {
      "name": "선택의 명확성",
      "weight": 40,
      "max_points": 2,
      "levels": [
        { "level": 2, "descriptor": "한 명을 명확히 선택하고...", "points": 2 },
        { "level": 1, "descriptor": "선택은 했으나...", "points": 1 },
        { "level": 0, "descriptor": "선택이 불명확하거나...", "points": 0 }
      ]
    }
  ]
}
```

## 라이선스

이 프로젝트는 교육 목적으로 사용됩니다.  
문항 저작권은 원 출처에 있습니다.
