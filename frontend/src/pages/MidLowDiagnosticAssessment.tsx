import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Checkbox,
  FormGroup,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  Send,
  Timer,
  MenuBook,
  Quiz,
  Description,
  School,
  ExpandMore,
  ExpandLess,
  Flag,
  Bookmark,
  BookmarkBorder,
} from "@mui/icons-material";

// 문항 데이터 타입
interface AssessmentItem {
  item_code: string;
  item_type: "mcq_single" | "mcq_multi" | "essay";
  stem: string;
  max_score: number;
  options: string[];
  stimulus_id: number;
}

interface Stimulus {
  id: number;
  title: string;
  content: string;
}

// 학생 응답 타입
interface StudentResponse {
  item_code: string;
  selected_options?: number[];
  essay_text?: string;
  flagged?: boolean;
}

// 중등 저학년 지문 데이터
const MIDLOW_STIMULI: Stimulus[] = [
  {
    id: 1,
    title: "휴대용 물 정화 필터",
    content: `생존 전문가 베어 그릴스가 개발에 참여한 휴대용 물 정화 필터가 주목받고 있다. 이 필터는 아웃도어 활동가와 재난 대비용으로 설계되었다.

작동 원리:
이 필터는 세라믹, 활성탄, 그리고 특수 중공사막 필터를 사용한다. 물속의 박테리아, 기생충을 제거하고 화학 물질의 농도를 줄인다. 필터 하나로 약 4,000리터의 물을 정수할 수 있다.

사용 방법:
1. 필터를 물에 담근다
2. 빨대처럼 빨아들여 바로 마신다
3. 또는 용기에 연결하여 정수된 물을 저장한다

주의 사항:
- 바닷물이나 화학 폐수는 정화 불가
- 필터 수명(4,000L) 확인 필요
- 영하 환경에서 동파 주의`,
  },
  {
    id: 2,
    title: "R=VD 공식",
    content: `독서에서 가장 중요한 공식이 있다면 R=VD이다.

R은 Reading(독서), V는 Visualization(시각화), D는 Decoding(해독)을 의미한다.

즉, 진정한 독서(R)는 글자를 해독(D)하는 것을 넘어 머릿속으로 내용을 그려보는 시각화(V)가 더해질 때 완성된다는 뜻이다.

텍스트를 읽을 때 우리 뇌는 단어를 인식하고 의미를 파악한다(Decoding). 하지만 여기서 그치면 정보는 단기 기억에만 머문다.

반면, 읽은 내용을 이미지로 상상하면(Visualization) 뇌의 여러 영역이 활성화되고, 정보가 장기 기억으로 저장된다. 소설을 읽을 때 장면이 머릿속에 그려지는 것, 설명문을 읽을 때 도식이나 그림으로 정리해 보는 것이 시각화의 예이다.

R=VD 공식을 기억하고 읽은 내용을 적극적으로 상상해 보자. 독서의 질이 달라질 것이다.`,
  },
  {
    id: 3,
    title: "동물농장",
    content: `[동물농장 / 조지 오웰 / 발췌]

"동지들!" 하고 나폴레온이 소리쳤다. "스노볼은 배신자입니다! 그는 처음부터 존스와 내통하고 있었습니다!"

동물들은 충격에 빠졌다. 스노볼은 동물농장의 영웅 아니었던가? 풍차를 설계하고, 존스를 몰아낸 외양간 전투에서 가장 용감하게 싸우지 않았던가?

"증거를 보여 드리겠습니다." 나폴레온이 말했다. 스퀄러가 앞으로 나왔다.

"동지들, 제가 비밀 문서를 발견했습니다. 스노볼은 존스의 스파이였습니다. 외양간 전투에서 스노볼이 영웅처럼 싸웠다고요? 그것은 착각입니다. 사실 그는 도망치려 했고, 나폴레온 동지가 진정한 영웅이었습니다."

"하지만…" 복서가 말하려 했다. "저는 스노볼이 싸우는 것을 직접 봤습니다…"

"동지의 기억이 잘못된 것입니다." 스퀄러가 단호하게 말했다. "나폴레온 동지가 그렇게 말씀하셨습니다."

복서는 고개를 끄덕였다. "나폴레온 동지는 항상 옳다."

돼지들은 고개를 끄덕였고, 개들이 으르렁거렸다.`,
  },
  {
    id: 4,
    title: "인공지능과 일자리",
    content: `인공지능(AI) 기술의 발전이 노동 시장에 미치는 영향에 대해 두 가지 상반된 전망이 있다.

[낙관론]
AI는 새로운 일자리를 창출할 것이다. 역사적으로 기술 혁명은 단기적 일자리 감소에도 불구하고 장기적으로 더 많은 일자리를 만들어왔다. 산업혁명 당시 기계가 일자리를 뺏을 것이라는 우려가 있었지만, 오히려 공장 노동자, 관리자, 엔지니어 등 새로운 직업이 생겨났다. AI 시대에도 AI 학습 데이터 전문가, AI 윤리 담당자, 인간-AI 협업 코디네이터 같은 새로운 직업이 등장할 것이다.

[비관론]
AI는 인간의 일자리를 대규모로 대체할 것이다. 과거 기술 혁명과 달리 AI는 육체노동뿐 아니라 인지 노동까지 대체한다. 법률 문서 검토, 의료 영상 분석, 기사 작성 등 전문직 영역에서도 AI가 인간을 능가하고 있다. 자동화로 인한 실업은 저임금 노동자에게 더 큰 타격을 주며, 부의 불평등을 심화시킬 것이다.

이 논쟁은 현재 진행형이다. 중요한 것은 AI 시대에 적응할 수 있는 역량을 키우는 것이다. 창의성, 공감 능력, 복잡한 문제 해결력, 그리고 AI를 도구로 활용하는 능력이 더욱 중요해질 것이다.`,
  },
  {
    id: 5,
    title: "탈무드 - 혀 이야기",
    content: `어느 날, 랍비가 하인에게 명령했다.

"시장에 가서 가장 좋은 것을 사 오너라."

하인은 시장에서 소의 혀를 사 왔다.

다음 날, 랍비가 다시 명령했다.

"시장에 가서 가장 나쁜 것을 사 오너라."

하인은 또다시 소의 혀를 사 왔다.

랍비가 물었다.
"어째서 좋은 것도 혀, 나쁜 것도 혀인가?"

하인이 대답했다.
"혀보다 좋은 것은 없습니다. 혀로 지혜를 전하고, 사랑을 고백하고, 상처받은 마음을 위로하니까요. 그러나 혀보다 나쁜 것도 없습니다. 혀로 거짓말을 하고, 남을 비방하고, 분열을 일으키니까요."

랍비는 감탄하며 말했다.
"옳은 말이다. 혀는 축복도 되고 저주도 된다. 우리가 어떻게 쓰느냐에 달려 있다."

[탈무드에서]`,
  },
];

// 중등 저학년 문항 데이터
const MIDLOW_ITEMS: AssessmentItem[] = [
  // 지문 1: 휴대용 물 정화 필터
  {
    item_code: "MIDLOW_Q01",
    item_type: "mcq_single",
    stem: "이 필터가 정화할 수 없는 것은?",
    max_score: 1,
    options: ["강물", "빗물", "바닷물", "호수의 물", "웅덩이 물"],
    stimulus_id: 1,
  },
  {
    item_code: "MIDLOW_Q02",
    item_type: "mcq_single",
    stem: "이 필터의 특징으로 적절하지 않은 것은?",
    max_score: 2,
    options: [
      "휴대가 가능하다",
      "재난 상황에서 활용할 수 있다",
      "박테리아를 제거한다",
      "약 4,000리터의 물을 정수할 수 있다",
      "영하의 온도에서도 사용할 수 있다",
    ],
    stimulus_id: 1,
  },
  {
    item_code: "MIDLOW_E01",
    item_type: "essay",
    stem: "이 필터가 유용하게 사용될 수 있는 구체적인 상황을 한 가지 제시하고, 그 이유를 설명하시오.",
    max_score: 5,
    options: [],
    stimulus_id: 1,
  },
  // 지문 2: R=VD 공식
  {
    item_code: "MIDLOW_Q03",
    item_type: "mcq_single",
    stem: "R=VD 공식에서 V(시각화)의 역할로 가장 적절한 것은?",
    max_score: 2,
    options: [
      "글자를 빠르게 읽게 한다",
      "단어의 뜻을 파악하게 한다",
      "정보를 장기 기억에 저장하게 한다",
      "문법 오류를 찾게 한다",
      "독서 속도를 높인다",
    ],
    stimulus_id: 2,
  },
  {
    item_code: "MIDLOW_E02",
    item_type: "essay",
    stem: "R=VD 공식을 활용하여 효과적으로 독서하는 방법을 자신의 경험을 들어 설명하시오.",
    max_score: 6,
    options: [],
    stimulus_id: 2,
  },
  // 지문 3: 동물농장
  {
    item_code: "MIDLOW_Q04",
    item_type: "mcq_single",
    stem: "나폴레온이 스노볼을 배신자로 몰아가는 방법으로 사용하지 않은 것은?",
    max_score: 1,
    options: [
      "스퀄러의 거짓 증언",
      "비밀 문서 제시",
      "과거 역사 왜곡",
      "다른 동물들과의 투표",
      "개들의 위협",
    ],
    stimulus_id: 3,
  },
  {
    item_code: "MIDLOW_Q05",
    item_type: "mcq_single",
    stem: "'나폴레온 동지는 항상 옳다'는 복서의 말이 보여주는 것은?",
    max_score: 2,
    options: [
      "나폴레온의 현명한 지도력",
      "복서의 비판적 사고력",
      "동물들의 맹목적 복종",
      "스노볼의 배신",
      "동물농장의 성공",
    ],
    stimulus_id: 3,
  },
  {
    item_code: "MIDLOW_Q06",
    item_type: "mcq_single",
    stem: "이 글에서 알 수 있는 전체주의의 특징으로 적절하지 않은 것은?",
    max_score: 2,
    options: [
      "역사 왜곡",
      "공포 조성",
      "선전 활동",
      "자유로운 토론",
      "반대자 탄압",
    ],
    stimulus_id: 3,
  },
  {
    item_code: "MIDLOW_E03",
    item_type: "essay",
    stem: "이 글에서 나폴레온과 스퀄러가 사용하는 권력 유지 방법을 분석하고, 현대 사회에서 비슷한 사례를 찾아 비교하시오.",
    max_score: 7,
    options: [],
    stimulus_id: 3,
  },
  // 지문 4: 인공지능과 일자리
  {
    item_code: "MIDLOW_Q07",
    item_type: "mcq_single",
    stem: "낙관론의 근거로 제시된 것은?",
    max_score: 1,
    options: [
      "AI가 인간보다 효율적이다",
      "역사적으로 기술 혁명이 새로운 일자리를 만들었다",
      "AI가 전문직을 대체한다",
      "자동화가 부의 불평등을 심화시킨다",
      "인지 노동이 대체된다",
    ],
    stimulus_id: 4,
  },
  {
    item_code: "MIDLOW_Q08",
    item_type: "mcq_single",
    stem: "비관론에서 AI가 과거 기술 혁명과 다르다고 주장하는 이유는?",
    max_score: 2,
    options: [
      "AI가 더 비싸기 때문에",
      "AI가 육체노동만 대체하기 때문에",
      "AI가 육체노동과 인지 노동을 모두 대체하기 때문에",
      "AI가 일자리를 만들기 때문에",
      "AI가 느리게 발전하기 때문에",
    ],
    stimulus_id: 4,
  },
  {
    item_code: "MIDLOW_Q09",
    item_type: "mcq_multi",
    stem: "글에서 AI 시대에 중요해질 역량으로 언급된 것을 모두 고르시오. (2개)",
    max_score: 2,
    options: [
      "단순 반복 작업 능력",
      "창의성",
      "암기력",
      "공감 능력",
      "빠른 타자 속도",
    ],
    stimulus_id: 4,
  },
  {
    item_code: "MIDLOW_Q10",
    item_type: "mcq_single",
    stem: "이 글의 서술 방식으로 가장 적절한 것은?",
    max_score: 2,
    options: [
      "시간순으로 사건을 나열하고 있다",
      "두 가지 상반된 관점을 비교하고 있다",
      "실험 결과를 제시하고 있다",
      "개인의 경험을 소개하고 있다",
      "문제의 해결 방안만 제시하고 있다",
    ],
    stimulus_id: 4,
  },
  {
    item_code: "MIDLOW_Q11",
    item_type: "mcq_single",
    stem: "글쓴이의 태도로 가장 적절한 것은?",
    max_score: 2,
    options: [
      "낙관론을 강하게 지지한다",
      "비관론을 강하게 지지한다",
      "중립적으로 양쪽 의견을 소개한다",
      "AI 기술 자체를 비판한다",
      "독자의 판단을 유도하지 않는다",
    ],
    stimulus_id: 4,
  },
  {
    item_code: "MIDLOW_Q12",
    item_type: "mcq_single",
    stem: "비관론에서 우려하는 사회 문제는?",
    max_score: 1,
    options: [
      "환경 오염",
      "부의 불평등 심화",
      "인구 감소",
      "에너지 부족",
      "국가 간 갈등",
    ],
    stimulus_id: 4,
  },
  {
    item_code: "MIDLOW_E04",
    item_type: "essay",
    stem: "AI가 대체하기 어려운 직업의 특징은 무엇이라고 생각하나요? 구체적인 직업 예시와 함께 설명하시오.",
    max_score: 6,
    options: [],
    stimulus_id: 4,
  },
  {
    item_code: "MIDLOW_E05",
    item_type: "essay",
    stem: "AI 기술의 발전에 대해 낙관론과 비관론 중 어느 입장에 더 동의하나요? 자신의 입장을 밝히고 근거를 제시하시오.",
    max_score: 7,
    options: [],
    stimulus_id: 4,
  },
  // 지문 5: 탈무드 - 혀 이야기
  {
    item_code: "MIDLOW_Q13",
    item_type: "mcq_single",
    stem: "하인이 혀를 가장 좋은 것이라고 생각한 이유로 적절하지 않은 것은?",
    max_score: 1,
    options: [
      "지혜를 전할 수 있다",
      "사랑을 고백할 수 있다",
      "상처받은 마음을 위로할 수 있다",
      "맛있는 음식이다",
      "축복이 될 수 있다",
    ],
    stimulus_id: 5,
  },
  {
    item_code: "MIDLOW_Q14",
    item_type: "mcq_single",
    stem: "이 글의 중심 교훈은?",
    max_score: 2,
    options: [
      "음식은 신선한 것이 좋다",
      "말은 사용하기 나름이다",
      "시장에서 좋은 물건을 사야 한다",
      "하인은 주인의 말을 잘 들어야 한다",
      "랍비는 현명해야 한다",
    ],
    stimulus_id: 5,
  },
  {
    item_code: "MIDLOW_Q15",
    item_type: "mcq_single",
    stem: "하인이 혀를 가장 나쁜 것으로도 생각한 이유로 언급된 것이 아닌 것은?",
    max_score: 1,
    options: [
      "거짓말을 할 수 있다",
      "남을 비방할 수 있다",
      "분열을 일으킬 수 있다",
      "침묵할 수 있다",
      "저주가 될 수 있다",
    ],
    stimulus_id: 5,
  },
  {
    item_code: "MIDLOW_Q16",
    item_type: "mcq_single",
    stem: "이 이야기에서 '혀'가 상징하는 것은?",
    max_score: 2,
    options: ["음식", "지혜", "말(언어)", "힘", "돈"],
    stimulus_id: 5,
  },
  {
    item_code: "MIDLOW_Q17",
    item_type: "mcq_single",
    stem: "이 글의 형식적 특징으로 가장 적절한 것은?",
    max_score: 1,
    options: ["논설문", "설명문", "우화(교훈적 이야기)", "일기", "편지"],
    stimulus_id: 5,
  },
  {
    item_code: "MIDLOW_Q18",
    item_type: "mcq_single",
    stem: "랍비가 감탄한 이유로 가장 적절한 것은?",
    max_score: 2,
    options: [
      "하인이 맛있는 음식을 샀기 때문에",
      "하인이 빠르게 심부름했기 때문에",
      "하인이 깊은 지혜를 보여주었기 때문에",
      "하인이 저렴하게 물건을 샀기 때문에",
      "하인이 두 번이나 같은 것을 샀기 때문에",
    ],
    stimulus_id: 5,
  },
  {
    item_code: "MIDLOW_E06",
    item_type: "essay",
    stem: "말이 '축복'이 된 경험 또는 '저주'가 된 경험을 구체적으로 서술하시오.",
    max_score: 5,
    options: [],
    stimulus_id: 5,
  },
  {
    item_code: "MIDLOW_E07",
    item_type: "essay",
    stem: "현대 사회에서 말의 힘이 특히 중요해진 이유를 SNS, 인터넷 등과 연결 지어 설명하시오.",
    max_score: 6,
    options: [],
    stimulus_id: 5,
  },
];

export default function MidLowDiagnosticAssessment() {
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [responses, setResponses] = useState<Map<string, StudentResponse>>(
    new Map(),
  );
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60분
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showStimulusExpanded, setShowStimulusExpanded] = useState(true);
  const [showNavigator, setShowNavigator] = useState(false);

  const handleSubmitRef = useRef<() => void>(() => {});

  const handleSubmit = useCallback(() => {
    console.log("제출된 응답:", Object.fromEntries(responses));
    alert("평가가 제출되었습니다.");
    navigate("/student/dashboard");
  }, [navigate, responses]);

  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  useEffect(() => {
    if (!started) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started]);

  const currentItem = MIDLOW_ITEMS[currentItemIndex];
  const currentStimulus = MIDLOW_STIMULI.find(
    (s) => s.id === currentItem?.stimulus_id,
  );
  const currentResponse = responses.get(currentItem?.item_code);

  const handleMcqChange = useCallback(
    (optionIndex: number) => {
      const newResponses = new Map(responses);
      const existing = newResponses.get(currentItem.item_code) || {
        item_code: currentItem.item_code,
      };

      if (currentItem.item_type === "mcq_multi") {
        const current = existing.selected_options || [];
        const updated = current.includes(optionIndex)
          ? current.filter((i) => i !== optionIndex)
          : [...current, optionIndex];
        newResponses.set(currentItem.item_code, {
          ...existing,
          selected_options: updated,
        });
      } else {
        newResponses.set(currentItem.item_code, {
          ...existing,
          selected_options: [optionIndex],
        });
      }
      setResponses(newResponses);
    },
    [currentItem, responses],
  );

  const handleEssayChange = useCallback(
    (text: string) => {
      const newResponses = new Map(responses);
      newResponses.set(currentItem.item_code, {
        item_code: currentItem.item_code,
        essay_text: text,
        flagged: currentResponse?.flagged,
      });
      setResponses(newResponses);
    },
    [currentItem, currentResponse, responses],
  );

  const toggleFlag = useCallback(() => {
    const newResponses = new Map(responses);
    const existing = newResponses.get(currentItem.item_code) || {
      item_code: currentItem.item_code,
    };
    newResponses.set(currentItem.item_code, {
      ...existing,
      flagged: !existing.flagged,
    });
    setResponses(newResponses);
  }, [currentItem, responses]);

  const goToItem = (index: number) => {
    setCurrentItemIndex(index);
    setShowStimulusExpanded(true);
  };

  const goNext = () => {
    if (currentItemIndex < MIDLOW_ITEMS.length - 1) {
      const nextItem = MIDLOW_ITEMS[currentItemIndex + 1];
      setShowStimulusExpanded(nextItem.stimulus_id !== currentItem.stimulus_id);
      setCurrentItemIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentItemIndex > 0) {
      const prevItem = MIDLOW_ITEMS[currentItemIndex - 1];
      setShowStimulusExpanded(prevItem.stimulus_id !== currentItem.stimulus_id);
      setCurrentItemIndex((prev) => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getResponseStats = () => {
    const answered = MIDLOW_ITEMS.filter((item) => {
      const resp = responses.get(item.item_code);
      if (item.item_type === "essay") {
        return resp?.essay_text && resp.essay_text.trim().length > 0;
      }
      return resp?.selected_options && resp.selected_options.length > 0;
    }).length;

    const flagged = MIDLOW_ITEMS.filter(
      (item) => responses.get(item.item_code)?.flagged,
    ).length;

    return { answered, flagged, total: MIDLOW_ITEMS.length };
  };

  const stats = getResponseStats();
  const totalScore = MIDLOW_ITEMS.reduce(
    (sum, item) => sum + item.max_score,
    0,
  );

  // 시작 전 화면
  if (!started) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        <Paper sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <School sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              2025학년도 중등 저학년 문해력 진단 평가
            </Typography>
            <Chip
              label="중학교 1~2학년"
              color="primary"
              sx={{ fontSize: "1rem", py: 2, px: 1 }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    📋 평가 정보
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="총 문항 수"
                        secondary={`${MIDLOW_ITEMS.length}문항`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="문항 구성"
                        secondary={`객관식 ${MIDLOW_ITEMS.filter((i) => i.item_type !== "essay").length}문항 + 서술형 ${MIDLOW_ITEMS.filter((i) => i.item_type === "essay").length}문항`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="제한 시간" secondary="60분" />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="총점"
                        secondary={`${totalScore}점`}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="secondary">
                    📖 지문 구성
                  </Typography>
                  <List dense>
                    {MIDLOW_STIMULI.map((stimulus, idx) => (
                      <ListItem key={stimulus.id}>
                        <ListItemText
                          primary={`지문 ${idx + 1}`}
                          secondary={stimulus.title}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>안내사항</strong>
              <br />• 평가 시작 후 타이머가 작동합니다.
              <br />• 문항 이동은 자유롭게 할 수 있습니다.
              <br />• '나중에 보기' 표시를 활용하여 어려운 문항을 표시할 수
              있습니다.
              <br />• 제한 시간이 종료되면 자동으로 제출됩니다.
            </Typography>
          </Alert>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => setStarted(true)}
              sx={{ px: 6, py: 1.5, fontSize: "1.1rem" }}
            >
              평가 시작하기
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  // 평가 진행 화면
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* 상단 헤더 */}
      <Paper
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 0,
        }}
        elevation={2}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6">중등 저학년 문해력 진단 평가</Typography>
          <Chip
            icon={<Quiz />}
            label={`문항 ${currentItemIndex + 1} / ${MIDLOW_ITEMS.length}`}
            color="primary"
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            label={`응답: ${stats.answered}/${stats.total}`}
            color={stats.answered === stats.total ? "success" : "default"}
            variant="outlined"
          />
          {stats.flagged > 0 && (
            <Chip
              icon={<Flag />}
              label={`${stats.flagged}개 표시`}
              color="warning"
              variant="outlined"
            />
          )}
          <Chip
            icon={<Timer />}
            label={formatTime(timeLeft)}
            color={timeLeft < 300 ? "error" : "default"}
            sx={{ fontWeight: "bold", fontSize: "1rem" }}
          />
          <Button
            variant="outlined"
            onClick={() => setShowNavigator(!showNavigator)}
          >
            문항 목록
          </Button>
        </Box>
      </Paper>

      <LinearProgress
        variant="determinate"
        value={(stats.answered / stats.total) * 100}
        sx={{ height: 4 }}
      />

      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <Collapse in={showNavigator} orientation="horizontal">
          <Paper
            sx={{
              width: 280,
              p: 2,
              borderRadius: 0,
              height: "100%",
              overflow: "auto",
            }}
          >
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              문항 목록
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {MIDLOW_ITEMS.map((item, idx) => {
                const resp = responses.get(item.item_code);
                const isAnswered =
                  item.item_type === "essay"
                    ? resp?.essay_text && resp.essay_text.trim().length > 0
                    : resp?.selected_options &&
                      resp.selected_options.length > 0;
                const isFlagged = resp?.flagged;
                const isCurrent = idx === currentItemIndex;

                return (
                  <Tooltip
                    key={item.item_code}
                    title={`${item.item_code} (${item.item_type === "essay" ? "서술형" : "객관식"})`}
                  >
                    <Button
                      variant={isCurrent ? "contained" : "outlined"}
                      size="small"
                      onClick={() => goToItem(idx)}
                      sx={{
                        minWidth: 40,
                        height: 40,
                        bgcolor: isAnswered
                          ? isCurrent
                            ? "primary.main"
                            : "success.light"
                          : undefined,
                        borderColor: isFlagged ? "warning.main" : undefined,
                        borderWidth: isFlagged ? 2 : 1,
                      }}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <Flag
                          sx={{
                            fontSize: 12,
                            position: "absolute",
                            top: 2,
                            right: 2,
                          }}
                        />
                      )}
                    </Button>
                  </Tooltip>
                );
              })}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="caption" color="text.secondary">
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    bgcolor: "success.light",
                    borderRadius: 0.5,
                  }}
                />
                응답 완료
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    border: 2,
                    borderColor: "warning.main",
                    borderRadius: 0.5,
                  }}
                />
                나중에 보기
              </Box>
            </Typography>
          </Paper>
        </Collapse>

        <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
          {currentStimulus && (
            <Paper
              sx={{
                p: 3,
                mb: 3,
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "grey.300",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
                onClick={() => setShowStimulusExpanded(!showStimulusExpanded)}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <MenuBook color="primary" />
                  <Typography variant="h6" color="primary">
                    {currentStimulus.title}
                  </Typography>
                </Box>
                <IconButton size="small">
                  {showStimulusExpanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>

              <Collapse in={showStimulusExpanded}>
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.9,
                    fontFamily: "serif",
                    fontSize: "1.1rem",
                  }}
                >
                  {currentStimulus.content}
                </Typography>
              </Collapse>
            </Paper>
          )}

          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {currentItem.item_type === "essay" ? (
                  <Description color="success" />
                ) : (
                  <Quiz color="info" />
                )}
                <Chip
                  label={`문항 ${currentItemIndex + 1}`}
                  color="primary"
                  size="small"
                />
                <Chip
                  label={
                    currentItem.item_type === "essay"
                      ? "서술형"
                      : currentItem.item_type === "mcq_multi"
                        ? "복수선택"
                        : "객관식"
                  }
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={`${currentItem.max_score}점`}
                  color="secondary"
                  variant="outlined"
                  size="small"
                />
              </Box>

              <Tooltip
                title={currentResponse?.flagged ? "표시 해제" : "나중에 보기"}
              >
                <IconButton onClick={toggleFlag} color="warning">
                  {currentResponse?.flagged ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
              </Tooltip>
            </Box>

            <Typography
              variant="h6"
              sx={{
                mb: 3,
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 2,
                lineHeight: 1.8,
                whiteSpace: "pre-wrap",
              }}
            >
              {currentItem.stem}
            </Typography>

            {(currentItem.item_type === "mcq_single" ||
              currentItem.item_type === "mcq_multi") && (
              <>
                {currentItem.item_type === "mcq_multi" && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    복수 선택이 가능합니다.
                  </Alert>
                )}
                {currentItem.item_type === "mcq_single" ? (
                  <RadioGroup
                    value={currentResponse?.selected_options?.[0] ?? ""}
                    onChange={(e) => handleMcqChange(parseInt(e.target.value))}
                  >
                    {currentItem.options.map((option, idx) => (
                      <FormControlLabel
                        key={idx}
                        value={idx}
                        control={<Radio />}
                        label={
                          <Typography
                            sx={{ py: 1 }}
                          >{`${["①", "②", "③", "④", "⑤"][idx]} ${option}`}</Typography>
                        }
                        sx={{
                          border: 1,
                          borderColor:
                            currentResponse?.selected_options?.[0] === idx
                              ? "primary.main"
                              : "divider",
                          borderRadius: 1,
                          mb: 1,
                          mx: 0,
                          p: 1,
                          bgcolor:
                            currentResponse?.selected_options?.[0] === idx
                              ? "primary.50"
                              : "transparent",
                          "&:hover": {
                            bgcolor: "grey.100",
                          },
                        }}
                      />
                    ))}
                  </RadioGroup>
                ) : (
                  <FormGroup>
                    {currentItem.options.map((option, idx) => (
                      <FormControlLabel
                        key={idx}
                        control={
                          <Checkbox
                            checked={
                              currentResponse?.selected_options?.includes(
                                idx,
                              ) ?? false
                            }
                            onChange={() => handleMcqChange(idx)}
                          />
                        }
                        label={
                          <Typography
                            sx={{ py: 1 }}
                          >{`${["①", "②", "③", "④", "⑤"][idx]} ${option}`}</Typography>
                        }
                        sx={{
                          border: 1,
                          borderColor:
                            currentResponse?.selected_options?.includes(idx)
                              ? "primary.main"
                              : "divider",
                          borderRadius: 1,
                          mb: 1,
                          mx: 0,
                          p: 1,
                          bgcolor: currentResponse?.selected_options?.includes(
                            idx,
                          )
                            ? "primary.50"
                            : "transparent",
                          "&:hover": {
                            bgcolor: "grey.100",
                          },
                        }}
                      />
                    ))}
                  </FormGroup>
                )}
              </>
            )}

            {currentItem.item_type === "essay" && (
              <TextField
                fullWidth
                multiline
                rows={8}
                placeholder="답안을 작성하세요..."
                value={currentResponse?.essay_text || ""}
                onChange={(e) => handleEssayChange(e.target.value)}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: "1rem",
                    lineHeight: 1.8,
                  },
                }}
              />
            )}
          </Paper>
        </Box>
      </Box>

      <Paper
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          borderRadius: 0,
        }}
        elevation={3}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={goPrev}
          disabled={currentItemIndex === 0}
          variant="outlined"
        >
          이전 문항
        </Button>

        <Button
          variant="contained"
          color="success"
          startIcon={<Send />}
          onClick={() => setShowSubmitDialog(true)}
        >
          평가 제출
        </Button>

        <Button
          endIcon={<ArrowForward />}
          onClick={goNext}
          disabled={currentItemIndex === MIDLOW_ITEMS.length - 1}
          variant="contained"
        >
          다음 문항
        </Button>
      </Paper>

      <Dialog
        open={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>평가 제출 확인</DialogTitle>
        <DialogContent>
          <Alert
            severity={stats.answered === stats.total ? "success" : "warning"}
            sx={{ mb: 2 }}
          >
            {stats.answered === stats.total
              ? "모든 문항에 응답하셨습니다."
              : `${stats.total - stats.answered}개의 문항이 응답되지 않았습니다.`}
          </Alert>

          <Typography variant="body1" gutterBottom>
            응답 현황:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: "center", py: 1 }}>
                  <Typography variant="h4" color="primary">
                    {stats.answered}
                  </Typography>
                  <Typography variant="caption">응답 완료</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: "center", py: 1 }}>
                  <Typography variant="h4" color="text.secondary">
                    {stats.total - stats.answered}
                  </Typography>
                  <Typography variant="caption">미응답</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: "center", py: 1 }}>
                  <Typography variant="h4" color="warning.main">
                    {stats.flagged}
                  </Typography>
                  <Typography variant="caption">나중에 보기</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            제출 후에는 수정할 수 없습니다. 정말 제출하시겠습니까?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)}>계속 풀기</Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            startIcon={<Send />}
          >
            제출하기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
