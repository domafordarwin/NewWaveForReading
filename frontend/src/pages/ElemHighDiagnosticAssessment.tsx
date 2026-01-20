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

// 초등 고학년 지문 데이터
const ELEMHIGH_STIMULI: Stimulus[] = [
  {
    id: 1,
    title: "외식하러 가는 길 (시)",
    content: `외식하러 가는 길
멈춘 신호등 앞에서
아이가 부른다.

"아빠, 저 새 좀 봐. 전깃줄에 앉아 있어.
저녁 먹으러 가는 거야?"

아버지가 대답한다.
"그럴 거야. 가족이랑 외식하러 나왔을 거야.
이따가 집에 가서 밥 먹지 않을까?"

"새들은 뭐 먹어?"
"지렁이, 곡식, 열매……."
"난 지렁이 안 먹을 거야."

파란 불이 켜진다.
아이의 손이 따뜻하다.`,
  },
  {
    id: 2,
    title: "인공지능(AI)과 우리의 삶",
    content: `인공지능(AI)은 컴퓨터가 사람처럼 생각하고 배우는 기술입니다. 요즘 많은 곳에서 인공지능이 활용됩니다.

스마트폰에는 AI 비서가 있습니다. "오늘 날씨 어때?"라고 물으면 대답해 줍니다. 집에서는 AI 스피커가 음악을 틀어 주고, 불을 켜기도 합니다.

병원에서도 AI가 쓰입니다. 사진을 분석해 병을 찾아내고, 의사 선생님을 도와줍니다. 공장에서는 로봇이 물건을 만들고, 자동차는 스스로 운전합니다.

하지만 문제도 있습니다. AI가 사람의 일자리를 빼앗을 수 있고, 개인 정보가 새어나갈 수도 있습니다. 무기에 사용되면 위험합니다.

AI를 잘 활용하면 편리하지만, 문제도 함께 생각해야 합니다. 여러분이 AI와 함께 살아갈 미래를 멋지게 만들어 주세요.`,
  },
  {
    id: 3,
    title: "신석기 시대, 농사의 시작",
    content: `아주 오래전, 사람들은 짐승을 사냥하고 열매를 따며 살았습니다. 먹을 것을 찾아 이곳저곳 떠돌아다녔지요. 이 시대를 구석기 시대라고 합니다.

시간이 흐르고 날씨가 따뜻해지면서 커다란 짐승들이 줄어들었습니다. 대신 작은 동물과 물고기가 많아졌고, 사람들은 강가나 바닷가에 머물기 시작했습니다. 이때 아주 중요한 발견이 있었습니다. 바로 농사입니다!

사람들은 땅에 씨앗을 뿌리면 식물이 자란다는 것을 알게 되었습니다. 밀, 보리, 조 같은 곡식을 키웠습니다. 돼지, 소, 양을 길러 고기와 젖을 얻었습니다. 이제 더 이상 먹이를 찾아 떠돌지 않아도 되었습니다. 한곳에 정착해 마을을 이루었습니다.

농사를 짓게 되면서 도구도 발전했습니다. 간석기라고 부르는 돌을 갈아 만든 도구가 등장했습니다. 흙으로 빚어 구운 토기도 만들어 음식을 저장했습니다. 이 시대를 신석기 시대라고 합니다.

신석기 시대는 인류 역사의 큰 전환점이었습니다. 농사 덕분에 사람들의 생활이 크게 달라졌기 때문입니다.`,
  },
  {
    id: 4,
    title: "일회용품 줄이기 공익광고",
    content: `[공익광고 장면 설명]

화면에는 아름다운 바다가 펼쳐집니다. 파란 물결이 반짝입니다.
그런데 갑자기 플라스틱 빨대, 비닐봉지, 스티로폼이 둥둥 떠다닙니다.

"이 쓰레기, 어디서 왔을까요?"

장면이 바뀌어 한 아이가 편의점에서 음료를 삽니다.
플라스틱 컵에 빨대를 꽂고 마십니다.
다 마신 컵을 아무 곳에나 버립니다.

"우리가 버린 일회용품이 바다로 갑니다."

다시 바다 장면. 거북이 한 마리가 비닐봉지를 먹으려 합니다. 해파리인 줄 알고요.

"바다 생물들이 고통받고 있어요."

화면이 밝아집니다. 아이가 이번에는 텀블러를 꺼냅니다.
"오늘부터 일회용품 대신 이걸 쓸래요!"

마지막 자막: "작은 실천이 바다를 살립니다. 일회용품 없는 하루, 시작해 보세요."`,
  },
];

// 초등 고학년 문항 데이터
const ELEMHIGH_ITEMS: AssessmentItem[] = [
  // 지문 1: 외식하러 가는 길
  {
    item_code: "ELEMHIGH_Q01",
    item_type: "mcq_single",
    stem: "시에서 아이와 아버지는 어디로 가는 중인가요?",
    max_score: 1,
    options: ["학교", "공원", "외식하러", "마트", "병원"],
    stimulus_id: 1,
  },
  {
    item_code: "ELEMHIGH_Q02",
    item_type: "mcq_single",
    stem: "아이가 새에 대해 궁금해한 것은 무엇인가요?",
    max_score: 1,
    options: [
      "새가 어디 사는지",
      "새가 무엇을 먹는지",
      "새가 얼마나 빠른지",
      "새가 몇 마리인지",
      "새가 어디서 자는지",
    ],
    stimulus_id: 1,
  },
  {
    item_code: "ELEMHIGH_Q03",
    item_type: "mcq_single",
    stem: "시의 마지막 부분 '아이의 손이 따뜻하다'가 표현하는 것은 무엇인가요?",
    max_score: 2,
    options: [
      "날씨가 더운 것",
      "손난로를 잡고 있는 것",
      "아버지와 손잡고 있는 정다운 느낌",
      "운동을 해서 손이 뜨거운 것",
      "열이 나는 것",
    ],
    stimulus_id: 1,
  },
  {
    item_code: "ELEMHIGH_Q04",
    item_type: "mcq_single",
    stem: "이 시에서 느껴지는 분위기로 알맞은 것은?",
    max_score: 1,
    options: [
      "무섭고 어두운",
      "슬프고 외로운",
      "따뜻하고 정겨운",
      "시끄럽고 혼란스러운",
      "긴장되고 불안한",
    ],
    stimulus_id: 1,
  },
  {
    item_code: "ELEMHIGH_E01",
    item_type: "essay",
    stem: "시에서 아이와 아버지는 새에 대해 상상하며 이야기합니다. 여러분이 아이라면 새에게 어떤 질문을 하고 싶나요? 질문과 그 이유를 써 보세요.",
    max_score: 5,
    options: [],
    stimulus_id: 1,
  },
  // 지문 2: 인공지능
  {
    item_code: "ELEMHIGH_Q05",
    item_type: "mcq_single",
    stem: "글에서 설명하는 인공지능(AI)의 정의는 무엇인가요?",
    max_score: 1,
    options: [
      "로봇을 만드는 기술",
      "컴퓨터가 사람처럼 생각하고 배우는 기술",
      "스마트폰을 만드는 기술",
      "인터넷을 연결하는 기술",
      "전기를 만드는 기술",
    ],
    stimulus_id: 2,
  },
  {
    item_code: "ELEMHIGH_Q06",
    item_type: "mcq_multi",
    stem: "글에서 말한 인공지능의 문제점을 모두 고르세요. (2개)",
    max_score: 2,
    options: [
      "음악을 틀어 준다",
      "사람의 일자리를 빼앗을 수 있다",
      "병을 찾아낸다",
      "개인 정보가 새어나갈 수 있다",
      "자동차를 운전한다",
    ],
    stimulus_id: 2,
  },
  {
    item_code: "ELEMHIGH_Q07",
    item_type: "mcq_single",
    stem: "글쓴이가 마지막에 당부하는 것은 무엇인가요?",
    max_score: 1,
    options: [
      "인공지능을 사용하지 말자",
      "인공지능 개발을 멈추자",
      "인공지능의 문제도 함께 생각하자",
      "로봇을 많이 만들자",
      "스마트폰을 쓰지 말자",
    ],
    stimulus_id: 2,
  },
  {
    item_code: "ELEMHIGH_E02",
    item_type: "essay",
    stem: "인공지능이 여러분의 학교생활을 도와준다면, 어떤 도움을 받고 싶나요? 구체적으로 써 보세요.",
    max_score: 5,
    options: [],
    stimulus_id: 2,
  },
  {
    item_code: "ELEMHIGH_E03",
    item_type: "essay",
    stem: "인공지능이 널리 쓰이면 생길 수 있는 문제와 그 해결 방법을 한 가지씩 써 보세요.",
    max_score: 6,
    options: [],
    stimulus_id: 2,
  },
  // 지문 3: 신석기 시대
  {
    item_code: "ELEMHIGH_Q08",
    item_type: "mcq_single",
    stem: "구석기 시대 사람들의 생활 방식으로 알맞은 것은?",
    max_score: 1,
    options: [
      "한곳에 마을을 만들어 살았다",
      "농사를 지었다",
      "먹을 것을 찾아 떠돌아다녔다",
      "토기를 만들어 사용했다",
      "가축을 길렀다",
    ],
    stimulus_id: 3,
  },
  {
    item_code: "ELEMHIGH_Q09",
    item_type: "mcq_single",
    stem: "신석기 시대에 사람들이 정착할 수 있었던 가장 큰 이유는 무엇인가요?",
    max_score: 2,
    options: [
      "날씨가 추워져서",
      "커다란 짐승이 많아져서",
      "농사를 짓게 되어서",
      "바다가 없어져서",
      "동굴이 많아서",
    ],
    stimulus_id: 3,
  },
  {
    item_code: "ELEMHIGH_Q10",
    item_type: "mcq_multi",
    stem: "신석기 시대에 새로 등장한 것을 모두 고르세요. (2개)",
    max_score: 2,
    options: ["뗀석기", "간석기", "철기", "토기", "청동기"],
    stimulus_id: 3,
  },
  {
    item_code: "ELEMHIGH_Q11",
    item_type: "mcq_single",
    stem: "글에서 신석기 시대를 '인류 역사의 큰 전환점'이라고 한 이유는 무엇인가요?",
    max_score: 2,
    options: [
      "사냥 기술이 발전해서",
      "농사 덕분에 생활이 크게 달라져서",
      "큰 동물이 사라져서",
      "불을 사용하게 되어서",
      "언어가 생겨서",
    ],
    stimulus_id: 3,
  },
  {
    item_code: "ELEMHIGH_E04",
    item_type: "essay",
    stem: "농사가 시작되면서 사람들의 생활이 어떻게 달라졌는지 두 가지 이상 써 보세요.",
    max_score: 5,
    options: [],
    stimulus_id: 3,
  },
  // 지문 4: 일회용품 공익광고
  {
    item_code: "ELEMHIGH_Q12",
    item_type: "mcq_single",
    stem: "이 광고에서 거북이가 비닐봉지를 먹으려 한 이유는 무엇인가요?",
    max_score: 1,
    options: [
      "배가 고파서",
      "호기심 때문에",
      "해파리인 줄 알아서",
      "맛있어 보여서",
      "다른 거북이가 먹어서",
    ],
    stimulus_id: 4,
  },
  {
    item_code: "ELEMHIGH_Q13",
    item_type: "mcq_single",
    stem: "광고에서 아이가 나중에 꺼낸 물건은 무엇인가요?",
    max_score: 1,
    options: ["플라스틱 컵", "비닐봉지", "종이컵", "텀블러", "빨대"],
    stimulus_id: 4,
  },
  {
    item_code: "ELEMHIGH_Q14",
    item_type: "mcq_single",
    stem: "이 광고가 전달하려는 메시지는 무엇인가요?",
    max_score: 2,
    options: [
      "바다에 가지 말자",
      "거북이를 보호하자",
      "일회용품 사용을 줄이자",
      "편의점에 가지 말자",
      "쓰레기를 바다에 버리지 말자",
    ],
    stimulus_id: 4,
  },
  {
    item_code: "ELEMHIGH_E05",
    item_type: "essay",
    stem: "일회용품 사용을 줄이기 위해 여러분이 실천할 수 있는 방법을 두 가지 이상 써 보세요.",
    max_score: 5,
    options: [],
    stimulus_id: 4,
  },
  {
    item_code: "ELEMHIGH_E06",
    item_type: "essay",
    stem: "환경 보호를 위한 공익광고를 만든다면 어떤 내용을 담고 싶나요? 간단한 광고 내용을 써 보세요.",
    max_score: 6,
    options: [],
    stimulus_id: 4,
  },
];

export default function ElemHighDiagnosticAssessment() {
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [responses, setResponses] = useState<Map<string, StudentResponse>>(
    new Map(),
  );
  const [timeLeft, setTimeLeft] = useState(50 * 60); // 50분
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
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

  const currentItem = ELEMHIGH_ITEMS[currentItemIndex];
  const currentStimulus = ELEMHIGH_STIMULI.find(
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
  };

  const goNext = () => {
    if (currentItemIndex < ELEMHIGH_ITEMS.length - 1) {
      setCurrentItemIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex((prev) => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getResponseStats = () => {
    const answered = ELEMHIGH_ITEMS.filter((item) => {
      const resp = responses.get(item.item_code);
      if (item.item_type === "essay") {
        return resp?.essay_text && resp.essay_text.trim().length > 0;
      }
      return resp?.selected_options && resp.selected_options.length > 0;
    }).length;

    const flagged = ELEMHIGH_ITEMS.filter(
      (item) => responses.get(item.item_code)?.flagged,
    ).length;

    return { answered, flagged, total: ELEMHIGH_ITEMS.length };
  };

  const stats = getResponseStats();
  const totalScore = ELEMHIGH_ITEMS.reduce(
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
              2025학년도 초등 고학년 문해력 진단 평가
            </Typography>
            <Chip
              label="초등 5~6학년"
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
                        secondary={`${ELEMHIGH_ITEMS.length}문항`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="문항 구성"
                        secondary={`객관식 ${ELEMHIGH_ITEMS.filter((i) => i.item_type !== "essay").length}문항 + 서술형 ${ELEMHIGH_ITEMS.filter((i) => i.item_type === "essay").length}문항`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="제한 시간" secondary="50분" />
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
                    {ELEMHIGH_STIMULI.map((stimulus, idx) => (
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
          <Typography variant="h6">초등 고학년 문해력 진단 평가</Typography>
          <Chip
            icon={<Quiz />}
            label={`문항 ${currentItemIndex + 1} / ${ELEMHIGH_ITEMS.length}`}
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
              {ELEMHIGH_ITEMS.map((item, idx) => {
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

        {/* 메인 컨텐츠: 왼쪽 지문 + 오른쪽 문항 */}
        <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* 왼쪽: 지문 영역 */}
          {currentStimulus && (
            <Box
              sx={{
                width: "50%",
                height: "100%",
                overflow: "auto",
                borderRight: "1px solid",
                borderColor: "divider",
                bgcolor: "grey.50",
              }}
            >
              <Paper
                sx={{
                  m: 2,
                  p: 3,
                  minHeight: "calc(100% - 32px)",
                  border: "1px solid",
                  borderColor: "grey.300",
                }}
                elevation={0}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <MenuBook color="primary" />
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {currentStimulus.title}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-wrap",
                    lineHeight: 2,
                    fontFamily: "serif",
                    fontSize: "1.05rem",
                  }}
                >
                  {currentStimulus.content}
                </Typography>
              </Paper>
            </Box>
          )}

          {/* 오른쪽: 문항 영역 */}
          <Box
            sx={{
              width: currentStimulus ? "50%" : "100%",
              height: "100%",
              overflow: "auto",
              p: 2,
            }}
          >
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
                    {currentResponse?.flagged ? (
                      <Bookmark />
                    ) : (
                      <BookmarkBorder />
                    )}
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
                      onChange={(e) =>
                        handleMcqChange(parseInt(e.target.value))
                      }
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
                            bgcolor:
                              currentResponse?.selected_options?.includes(idx)
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
          disabled={currentItemIndex === ELEMHIGH_ITEMS.length - 1}
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
