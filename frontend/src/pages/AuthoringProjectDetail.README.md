# AuthoringProjectDetail.tsx 리팩토링 가이드

## 현재 상태

- **파일 크기**: 2629 줄
- **주요 기능**: 문항 제작 프로젝트 상세 페이지
  - 지문 선택 및 관리
  - AI 문항 생성
  - 문항 편집 및 버전 관리
  - 프롬프트 템플릿 관리

## 완료된 모듈화

### ✅ 분리된 파일들

1. **`/constants/itemConfig.ts`**
   - 문항 유형 옵션
   - 상태 설정
   - 학년군 라벨
   - 루브릭 템플릿

2. **`/types/authoring.ts`**
   - AuthoringProject
   - Stimulus
   - AuthoringItem
   - PromptBaseTemplate
   - PromptAreaTemplate
   - UserFavoritePrompt
   - ItemEditData
   - NewStimulusData

3. **`/hooks/useAuthoringProject.ts`**
   - 프로젝트 데이터 로드
   - 지문 목록 관리
   - 문항 목록 관리
   - 에러/성공 메시지 관리

4. **`/hooks/useStimulusManagement.ts`**
   - 지문 선택 기능
   - 새 지문 생성
   - 프로젝트에 지문 저장

## 향후 리팩토링 계획

### Phase 2: 나머지 훅 분리

#### `/hooks/useAIGeneration.ts`
```typescript
export const useAIGeneration = (project, selectedStimulus) => {
  // AI 생성 다이얼로그 상태
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiItemType, setAiItemType] = useState("mcq_single");
  const [aiNumOptions, setAiNumOptions] = useState(5);
  const [aiCustomPrompt, setAiCustomPrompt] = useState("");
  const [aiItemCount, setAiItemCount] = useState(3);
  const [aiGeneratedItems, setAiGeneratedItems] = useState([]);

  // 핸들러
  const handleGenerateItems = async () => { ... };
  const handleSaveGeneratedItem = async (item, index) => { ... };

  return { ... };
};
```

**분리할 부분**:
- 라인 236-243: AI 다이얼로그 상태
- 라인 600-800: handleGenerateItems 함수
- 라인 810-950: handleSaveGeneratedItem 함수

---

#### `/hooks/useItemEditing.ts`
```typescript
export const useItemEditing = (refreshItems) => {
  const [itemEditDialogOpen, setItemEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingItemData, setEditingItemData] = useState({ ... });

  const handleEditItem = (item) => { ... };
  const handleSaveItem = async () => { ... };
  const handleDeleteItem = async (itemId) => { ... };
  const validateItem = (item) => { ... };

  return { ... };
};
```

**분리할 부분**:
- 라인 246-252: 편집 다이얼로그 상태
- 라인 950-1100: handleEditItem, handleSaveItem, handleDeleteItem
- 라인 1350-1450: validateItem 함수

---

#### `/hooks/usePromptTemplates.ts`
```typescript
export const usePromptTemplates = (project) => {
  // 프롬프트 템플릿 상태
  const [favoritePrompts, setFavoritePrompts] = useState([]);
  const [dbBaseTemplates, setDbBaseTemplates] = useState([]);
  const [dbAreaTemplates, setDbAreaTemplates] = useState([]);
  const [selectedBaseTemplate, setSelectedBaseTemplate] = useState(null);
  const [selectedAreaTemplate, setSelectedAreaTemplate] = useState(null);

  const fetchPromptTemplates = async () => { ... };
  const handleSaveCustomPrompt = async () => { ... };
  const handleLoadFavoritePrompt = (favorite) => { ... };

  return { ... };
};
```

**분리할 부분**:
- 라인 260-294: 프롬프트 템플릿 상태
- 라인 420-600: 템플릿 관련 핸들러

---

### Phase 3: 다이얼로그 컴포넌트 분리

#### `/components/dialogs/StimulusSelectionDialog.tsx`
```typescript
interface Props {
  open: boolean;
  stimuli: Stimulus[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSelect: (stimulus: Stimulus) => void;
  onClose: () => void;
}

export const StimulusSelectionDialog = ({ ... }: Props) => {
  return <Dialog>...</Dialog>;
};
```

**분리할 부분**:
- 라인 1745-1830: 지문 선택 다이얼로그 JSX

---

#### `/components/dialogs/AIGenerationDialog.tsx`
```typescript
interface Props {
  open: boolean;
  project: AuthoringProject;
  selectedStimulus: Stimulus | null;
  itemType: string;
  numOptions: number;
  customPrompt: string;
  itemCount: number;
  generating: boolean;
  onItemTypeChange: (type: string) => void;
  onNumOptionsChange: (num: number) => void;
  onCustomPromptChange: (prompt: string) => void;
  onItemCountChange: (count: number) => void;
  onGenerate: () => void;
  onClose: () => void;
}

export const AIGenerationDialog = ({ ... }: Props) => {
  return <Dialog>...</Dialog>;
};
```

**분리할 부분**:
- 라인 1832-1976: AI 생성 다이얼로그 JSX

---

#### `/components/dialogs/ItemEditDialog.tsx`
```typescript
interface Props {
  open: boolean;
  item: AuthoringItem | null;
  editData: ItemEditData;
  onEditDataChange: (data: ItemEditData) => void;
  onSave: () => void;
  onClose: () => void;
}

export const ItemEditDialog = ({ ... }: Props) => {
  return <Dialog>...</Dialog>;
};
```

**분리할 부분**:
- 라인 2357-2566: 문항 편집 다이얼로그 JSX

---

### Phase 4: 패널 컴포넌트 분리

#### `/components/panels/StimulusPanel.tsx`
```typescript
interface Props {
  stimulus: Stimulus | null;
  onSelectStimulus: () => void;
  onCreateStimulus: () => void;
  onSave: () => void;
  saving: boolean;
  isSaved: boolean;
}

export const StimulusPanel = ({ ... }: Props) => {
  return (
    <Paper>
      {/* 지문 선택 버튼 */}
      {/* 선택된 지문 표시 */}
      {/* 저장 버튼 */}
    </Paper>
  );
};
```

**분리할 부분**:
- 라인 1200-1400: 지문 패널 JSX

---

#### `/components/panels/ItemsPanel.tsx`
```typescript
interface Props {
  items: AuthoringItem[];
  generatedItems: any[];
  onEditItem: (item: AuthoringItem) => void;
  onDeleteItem: (itemId: number) => void;
  onSaveGenerated: (item: any, index: number) => void;
}

export const ItemsPanel = ({ ... }: Props) => {
  return (
    <Paper>
      {/* 생성된 문항 미리보기 */}
      {/* 저장된 문항 테이블 */}
      {/* 상태 통계 */}
    </Paper>
  );
};
```

**분리할 부분**:
- 라인 1400-1740: 문항 패널 JSX

---

### Phase 5: 헤더 컴포넌트

#### `/components/AuthoringHeader.tsx`
```typescript
interface Props {
  project: AuthoringProject;
  onVersionHistory: () => void;
  onAiGenerate: () => void;
}

export const AuthoringHeader = ({ ... }: Props) => {
  return (
    <Paper>
      {/* 프로젝트 제목 */}
      {/* 상태, 학년군, 난이도 칩 */}
      {/* 액션 버튼들 */}
    </Paper>
  );
};
```

**분리할 부분**:
- 라인 1100-1200: 헤더 JSX

---

## 리팩토링 체크리스트

### 즉시 가능한 개선사항

- [x] 타입 정의 분리 (`/types/authoring.ts`)
- [x] 상수 설정 분리 (`/constants/itemConfig.ts`)
- [x] 프로젝트 데이터 훅 분리 (`/hooks/useAuthoringProject.ts`)
- [x] 지문 관리 훅 분리 (`/hooks/useStimulusManagement.ts`)

### 다음 단계 (우선순위 순)

- [ ] AI 생성 훅 분리 (`/hooks/useAIGeneration.ts`)
- [ ] 문항 편집 훅 분리 (`/hooks/useItemEditing.ts`)
- [ ] 프롬프트 템플릿 훅 분리 (`/hooks/usePromptTemplates.ts`)
- [ ] 다이얼로그 컴포넌트 분리
- [ ] 패널 컴포넌트 분리

### 향후 고려사항

- [ ] 상태 관리 라이브러리 도입 (Zustand, Jotai 등)
- [ ] React Query 도입 (서버 상태 관리)
- [ ] 컴포넌트 lazy loading
- [ ] Storybook 도입 (컴포넌트 문서화)

## 리팩토링 시 주의사항

1. **테스트 우선**: 각 단계마다 기능 동작 확인
2. **점진적 마이그레이션**: 한 번에 하나씩 분리
3. **타입 안정성**: TypeScript strict mode 유지
4. **백워드 호환성**: 기존 API 인터페이스 유지
5. **성능 모니터링**: 리렌더링 최소화

## 참고 자료

- [React Hooks Best Practices](https://react.dev/reference/react)
- [Component Composition Patterns](https://kentcdodds.com/blog/compound-components-with-react-hooks)
- [Clean Code React](https://github.com/ryanmcdermott/clean-code-javascript)
