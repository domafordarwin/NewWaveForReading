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

// 초등 저학년 지문 데이터 (PDF 원본 기준)
const ELEMLOW_STIMULI: Stimulus[] = [
  {
    id: 1,
    title: "안전한 과학 실험",
    content: `과학 실험은 재미있고 신나는 활동입니다. 직접 실험을 하면서 새로운 사실을 발견할 수 있지만, 무엇보다 안전이 중요합니다. 안전하게 실험하는 방법을 알면 더 즐겁게 과학을 배울 수 있습니다.

실험을 시작하기 전에 준비물을 확인합니다. 필요한 도구들이 모두 있는지, 위험한 것은 없는지 살펴봅니다. 가위나 칼처럼 날카로운 물건은 조심히 다루고, 사용법을 미리 배워야 합니다.

실험복, 고글, 장갑을 착용하면 좋습니다. 실험 도중 액체가 튀거나 뜨거운 물체를 만질 수 있기 때문에 몸을 보호해야 합니다. 실험복은 옷을 보호하고, 고글은 눈을 보호하며, 장갑은 손을 안전하게 지켜줍니다.

실험 전에는 책상 위를 깨끗하게 정리합니다. 쓰지 않는 물건이 있으면 실수로 떨어뜨리거나 실험 도구가 섞일 수 있습니다. 필요한 것만 꺼내 놓고 정리된 상태에서 실험을 하면 집중할 수 있고, 사고를 예방할 수 있습니다.`,
  },
  {
    id: 2,
    title: "흙덩이와 민들레",
    content: `길가 돌 틈 사이에 작은 흙덩이가 하나 굴러와 있었어요. 지나가는 사람들은 그 흙덩이를 보며 얼굴을 찡그렸어요.

"저건 뭐야? 지저분하게 왜 저기 있는 거야?"
"이상한 데서 굴러다니네. 쓸모도 없겠지."

흙덩이는 조용히 고개를 숙였어요.
"나는 왜 태어났을까. 나는 왜 여기 있는 걸까…"

그 말에 바람도 살짝 멈췄고, 햇살도 조용히 흙덩이를 비췄어요. 그때였어요. 노란 민들레 싹이 옆에서 소곤소곤 말을 걸었어요.

"안녕? 혹시, 네가 나를 도와줄 수 있을까?"
"나… 나 같은 게? 왜?"

흙덩이는 깜짝 놀랐어요. 아무도 자기를 필요로 했던 적이 없었거든요. 민들레는 웃으며 말했어요.

"나는 곧 꽃을 피워야 해. 그런데 이곳은 너무 메말라. 네가 나에게 물과 힘을 나눠주면, 나는 세상에서 가장 예쁜 꽃이 될 수 있어."

흙덩이는 한참을 망설이다가, 조용히 말했어요.
"그래… 네가 정말 나를 원한다면, 내가 한번 해볼게."

며칠이 지났어요. 바람은 따뜻했고, 햇살은 부드러웠어요. 흙덩이는 점점 작아졌지만, 민들레는 점점 더 커졌어요. 그리고 어느 날 아침, 민들레는 해처럼 환하게 웃으며 꽃을 피웠어요. 흙덩이는 작고 조용한 목소리로 말했어요.

"내가 쓸모 있는 존재였구나. ㉠나도 누군가에게 도움이 될 수 있었어…"`,
  },
  {
    id: 3,
    title: "우리 동네 이름에 숨어 있는 비밀",
    content: `"얘야, 너희 동네 이름이 왜 그런지 궁금해본 적 있니?"
할아버지는 마루에 앉아 귤을 까시며 웃으셨다.

"옛날 옛적, 이 동네는 '밤나무골'이라고 불렸단다. 왜 그런지 아니? 이 근처에 밤나무가 정말 많아서, 가을이면 마당에 밤이 굴러다녔지!"

"그럼 지금은 왜 이름이 바뀌었어요?"
내가 묻자, 할머니가 이야기를 이어주셨다.

"사람들이 많아지고, 아파트도 생기면서 밤나무는 점점 사라졌지. 그래서 동네 이름도 바뀌었단다. 하지만 어르신들은 아직도 '밤나무골'이라고 부르곤 하신단다. 그 이름 속에는 옛날 모습이 남아 있는 거야."

"그럼 다른 동네도 그런 이야기가 있어요?"
내가 묻자, 할아버지가 고개를 끄덕이셨다.

"그렇지! '도깨비골', '장터마을', '우물터' 같은 이름들도 다 이유가 있단다. 옛날엔 도깨비 이야기가 전해지던 곳도 있고, 큰 시장이 열리던 마을도 있었지. 이름 하나에도 그 동네의 이야기가 숨어 있는 거야."

"우와, 이름에도 이야기가 있다니 신기해요!"
할머니는 웃으며 말씀하셨다.

"그래서 말이지, 어디를 가든 동네 이름을 잘 들어보렴. 그 안에 사람들의 추억이 담겨 있을지도 모르니까."`,
  },
  {
    id: 4,
    title: "스마트폰 공익 광고",
    content: `[공익광고]

밥 한 번, 스마트폰 한 번

가족과의 식사 시간, 친구와의 대화 시간
사랑하는 사람을 앞에 두고
스마트폰에 시선을 빼앗긴 사람들

당신도 스마트폰을 보고 있지는 않나요?

스마트폰 사용량 전 세계 1위 대한민국
스마트폰 사용 만큼은 ( ㉠ )

【출처: kobaco, 한국방송공익광고진흥공사 공익광고협의회】`,
  },
];

// 초등 저학년 문항 데이터 (PDF 원본 기준 - 12문항 객관식 + 3문항 서술형)
const ELEMLOW_ITEMS: AssessmentItem[] = [
  // 지문 1: 안전한 과학 실험 [1~3, 서술형 1]
  {
    item_code: "ELEMLOW_Q01",
    item_type: "mcq_single",
    stem: "과학 실험을 하기 전에 꼭 해야 하는 일은 무엇인가요?",
    max_score: 1,
    options: [
      "① 실험복을 세탁한다.",
      "② 실험 결과를 미리 예측해본다.",
      "③ 실험 준비물이 안전한지 확인한다.",
      "④ 실험 준비물이 많이 있는지 살펴본다.",
      "⑤ 실험을 재미있게 할 수 있는 방법을 생각해본다.",
    ],
    stimulus_id: 1,
  },
  {
    item_code: "ELEMLOW_Q02",
    item_type: "mcq_single",
    stem: "실험 전 책상 위를 깨끗하게 정리해야 하는 가장 중요한 이유는 무엇인가요?",
    max_score: 1,
    options: [
      "① 실험이 끝난 후 청소하기 쉽게 하려고",
      "② 다른 사람이 보기에 깔끔하게 보이려고",
      "③ 실험 결과를 적는 공책을 놓을 자리가 없기 때문에",
      "④ 물건을 실수로 넘어뜨려 사고가 날 수 있기 때문에",
      "⑤ 책상 위가 너무 좁으면 실험이 잘 안될 수도 있기 때문에",
    ],
    stimulus_id: 1,
  },
  {
    item_code: "ELEMLOW_Q03",
    item_type: "mcq_single",
    stem: "위 글을 읽고 알게 된 점을 바르게 설명한 친구를 고르세요.",
    max_score: 1,
    options: [
      "① 유리: 이미 사용법을 알고 있는 실험 도구는 시간 절약을 위해 설명을 듣지 않아도 괜찮아.",
      "② 슬기: 책상 위에는 실험에 필요한 모든 도구를 한눈에 볼 수 있게 꺼내 놓는 것이 좋아.",
      "③ 정호: 실험할 때 고글, 장갑을 착용하면 불편하니까 벗는 것이 좋겠어.",
      "④ 수찬: 실험을 빨리 끝내기 위해 준비물 확인은 나중에 해도 돼.",
      "⑤ 민지: 안전하게 실험을 하면 과학 수업이 더 재미있어질 거야.",
    ],
    stimulus_id: 1,
  },
  {
    item_code: "ELEMLOW_E01",
    item_type: "essay",
    stem: "과학 실험을 하던 중, 친구가 실험복과 고글을 착용하지 않고 있습니다. 이때 친구에게 왜 안전 장비를 꼭 착용해야 하는지 설명하고, 함께 안전하게 실험할 수 있도록 대화를 나누는 모습을 써 보세요.\n\n나:\n친구:\n나:\n친구:",
    max_score: 5,
    options: [],
    stimulus_id: 1,
  },
  // 지문 2: 흙덩이와 민들레 [4~6, 서술형 2]
  {
    item_code: "ELEMLOW_Q04",
    item_type: "mcq_single",
    stem: '다음 중 흙덩이가 "㉠나도 누군가에게 도움이 될 수 있었어…"라고 말한 이유로 가장 알맞은 것은 무엇인가요?',
    max_score: 1,
    options: [
      "① 사람들에게 칭찬을 받았기 때문에",
      "② 흙덩이가 스스로 꽃을 피웠기 때문에",
      "③ 햇살이 흙덩이를 따뜻하게 비춰 주었기 때문에",
      "④ 민들레가 흙덩이를 꼭 필요로 한다고 말했기 때문에",
      "⑤ 흙덩이가 민들레와 함께 놀며 하루를 즐겁게 보냈기 때문에",
    ],
    stimulus_id: 2,
  },
  {
    item_code: "ELEMLOW_Q05",
    item_type: "mcq_single",
    stem: "다음 중 '민들레는 해처럼 환하게 웃으며 꽃을 피웠어요.'라는 표현을 가장 잘 설명한 것은 무엇인가요?",
    max_score: 1,
    options: [
      "① 민들레가 해 옆에서 자랐음을 보여준다.",
      "② 민들레가 해를 보고 인사했음을 나타낸다.",
      "③ 민들레가 정말 사람처럼 웃었음을 뜻한다.",
      "④ 민들레가 웃는 소리를 크게 냈음을 보여준다.",
      "⑤ 민들레의 꽃이 해처럼 밝고 환하게 보였음을 나타낸다.",
    ],
    stimulus_id: 2,
  },
  {
    item_code: "ELEMLOW_Q06",
    item_type: "mcq_single",
    stem: "다음 중 이 글의 주제를 가장 잘 나타낸 것은 무엇인가요?",
    max_score: 1,
    options: [
      "① 작고 보잘것없는 것도 누군가에게는 소중한 존재일 수 있다.",
      "② 서로 돕는 마음이 있으면 어려울 일도 이겨낼 수 있다.",
      "③ 꽃은 혼자서도 아름답게 피어날 수 있다.",
      "④ 도움을 주면 반드시 보상을 받아야 한다.",
      "⑤ 흙은 늘 깨끗하고 예뻐야 한다.",
    ],
    stimulus_id: 2,
  },
  {
    item_code: "ELEMLOW_E02",
    item_type: "essay",
    stem: '글 속의 다음 문장을 읽고 흙덩이가 느꼈을 감정과 그 이유를 글 내용을 바탕으로 써 보세요.\n\n"햇살도 조용히 흙덩이를 비췄어요."',
    max_score: 5,
    options: [],
    stimulus_id: 2,
  },
  // 지문 3: 우리 동네 이름에 숨어 있는 비밀 [7~9, 서술형 3]
  {
    item_code: "ELEMLOW_Q07",
    item_type: "mcq_single",
    stem: '할머니께서 "그 이름 속에는 옛날 모습이 남아 있는 거야."라고 말씀하셨을 때 할머니의 마음은 어떠셨을까요?',
    max_score: 1,
    options: [
      "① 옛날을 그리워하며 소중하게 생각하셨다.",
      "② 옛날 일이 재미없다고 생각하셨다.",
      "③ 옛날을 잊어버리고 싶어 하셨다.",
      "④ 옛날이 불편해서 싫어하셨다.",
      "⑤ 옛날 일을 무서워하셨다.",
    ],
    stimulus_id: 3,
  },
  {
    item_code: "ELEMLOW_Q08",
    item_type: "mcq_single",
    stem: "할머니와 할아버지께서 동네 이름에 대해 이야기해 주신 이유는 무엇이라고 생각하나요?",
    max_score: 1,
    options: [
      "① 동네 이름을 바꾸기 위해서",
      "② 옛날 이야기를 잊지 않고 전하려고",
      "③ 밤나무가 사라지는 것이 속상해서",
      "④ 동네 이름이 재미없다는 것을 알려주려고",
      "⑤ 밤나무를 다시 심으려는 계획을 알려주려고",
    ],
    stimulus_id: 3,
  },
  {
    item_code: "ELEMLOW_Q09",
    item_type: "mcq_single",
    stem: "다음 중 동네 이름을 바꾸는 것에 대해 가장 알맞은 생각은 무엇인가요?",
    max_score: 1,
    options: [
      "① 옛날 이름은 모두 없애고 새로운 이름으로 바꿔야 한다.",
      "② 동네 이름은 재미있게 지어야 하므로 전설이나 괴담이 좋다.",
      "③ 이름은 별로 중요하지 않으니 사람들이 부르기 쉬운 게 최고다.",
      "④ 동네 이름에는 그 지역의 역사와 이야기가 담겨 있으므로 소중히 여겨야 한다.",
      "⑤ 외국인과 같이 사는 시대이기 때문에 외국인도 부르기 쉽게 영어 이름으로 바꾸는 것이 좋다.",
    ],
    stimulus_id: 3,
  },
  {
    item_code: "ELEMLOW_E03",
    item_type: "essay",
    stem: "만약 우리 동네 이름이 바뀐다면, 어떤 이름이 좋을지 생각해서 이유와 함께 써 보세요.\n\n(예시 답변: 우리 동네에 예쁜 꽃이 많으면 '꽃동네'라고 이름을 지으면 좋겠어요. 사람들이 꽃향기를 맡으며 행복하게 살 수 있을 것 같아요.)",
    max_score: 5,
    options: [],
    stimulus_id: 3,
  },
  // 지문 4: 스마트폰 공익 광고 [10~12]
  {
    item_code: "ELEMLOW_Q10",
    item_type: "mcq_single",
    stem: "위 광고를 본 친구들이 한 다짐 중에 어울리지 않는 말을 한 친구를 고르세요.",
    max_score: 1,
    options: [
      "① 현우: 스마트폰 알림이 오면 중요한 내용일 수 있으니 바로 확인해야겠어.",
      "② 민수: 친구랑 이야기할 땐 스마트폰을 두고 친구 눈을 보며 말해야겠어.",
      "③ 수진: 식사할 땐 스마트폰을 가지고 식탁에 앉지 말아야겠어.",
      "④ 지아: 스마트폰 없이 재미있게 놀 수 있는 방법을 찾아보겠어.",
      "⑤ 지훈: 스마트폰 사용 시간을 조금 더 줄여야겠어.",
    ],
    stimulus_id: 4,
  },
  {
    item_code: "ELEMLOW_Q11",
    item_type: "mcq_single",
    stem: "위 광고의 전체적인 표현 분위기를 생각했을 때 ( ㉠ )에 가장 적절한 문장은 무엇인가요?\n\n스마트폰 사용 만큼은 (㉠                       )",
    max_score: 1,
    options: [
      "① 스마트폰 사용 만큼은 참을성을 키우면 좋습니다.",
      "② 스마트폰 사용 만큼은 절약왕이 되어도 좋습니다.",
      "③ 스마트폰 사용 만큼은 구두쇠가 되어도 좋습니다.",
      "④ 스마트폰 사용 만큼은 자물쇠를 채워도 좋습니다.",
      "⑤ 스마트폰 사용 만큼은 느림보가 되어도 좋습니다.",
    ],
    stimulus_id: 4,
  },
  {
    item_code: "ELEMLOW_Q12",
    item_type: "mcq_single",
    stem: "아래의 토론 주제 중에 위 광고와 관련성이 가장 적은 것을 고르세요.",
    max_score: 1,
    options: [
      "① 친구와 소통하는 것은 스마트폰보다 직접 만나는 것이 좋다.",
      "② 스마트폰 사용 시간을 줄이면 가정이 더 행복해진다.",
      "③ 스마트폰은 친구 사이를 더 가깝게 만들어 준다.",
      "④ 스마트폰의 사용은 건강에 나쁘다.",
      "⑤ 스마트폰은 공부에 도움이 된다.",
    ],
    stimulus_id: 4,
  },
];

export default function ElemLowDiagnosticAssessment() {
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [responses, setResponses] = useState<Map<string, StudentResponse>>(
    new Map(),
  );
  const [timeLeft, setTimeLeft] = useState(40 * 60); // 40분
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

  const currentItem = ELEMLOW_ITEMS[currentItemIndex];
  const currentStimulus = ELEMLOW_STIMULI.find(
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
    if (currentItemIndex < ELEMLOW_ITEMS.length - 1) {
      const nextItem = ELEMLOW_ITEMS[currentItemIndex + 1];
      setShowStimulusExpanded(nextItem.stimulus_id !== currentItem.stimulus_id);
      setCurrentItemIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentItemIndex > 0) {
      const prevItem = ELEMLOW_ITEMS[currentItemIndex - 1];
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
    const answered = ELEMLOW_ITEMS.filter((item) => {
      const resp = responses.get(item.item_code);
      if (item.item_type === "essay") {
        return resp?.essay_text && resp.essay_text.trim().length > 0;
      }
      return resp?.selected_options && resp.selected_options.length > 0;
    }).length;

    const flagged = ELEMLOW_ITEMS.filter(
      (item) => responses.get(item.item_code)?.flagged,
    ).length;

    return { answered, flagged, total: ELEMLOW_ITEMS.length };
  };

  const stats = getResponseStats();

  // 시작 전 화면
  if (!started) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        <Paper sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <School sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              2025학년도 초등 저학년 문해력 진단 평가
            </Typography>
            <Chip
              label="초등 1~2학년"
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
                      <ListItemText primary="총 문항 수" secondary="15문항" />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="문항 구성"
                        secondary="객관식 12문항 + 서술형 3문항"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="제한 시간" secondary="40분" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="총점" secondary="27점" />
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
                    {ELEMLOW_STIMULI.map((stimulus, idx) => (
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
          <Typography variant="h6">초등 저학년 문해력 진단 평가</Typography>
          <Chip
            icon={<Quiz />}
            label={`문항 ${currentItemIndex + 1} / ${ELEMLOW_ITEMS.length}`}
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
              {ELEMLOW_ITEMS.map((item, idx) => {
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
          disabled={currentItemIndex === ELEMLOW_ITEMS.length - 1}
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
