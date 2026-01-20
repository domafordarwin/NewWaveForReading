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

// 중등 고학년 문항 데이터 타입
interface MidHighItem {
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
  selected_options?: number[]; // 객관식 (복수 응답 지원)
  essay_text?: string; // 서술형
  flagged?: boolean; // 나중에 다시 보기 표시
}

// 중등 고학년 지문 데이터
const MIDHIGH_STIMULI: Stimulus[] = [
  {
    id: 1,
    title: "지혜로운 두 사람 이야기",
    content: `옛날, 한 마을에 큰 지혜를 가진 두 사람이 살고 있었습니다. 첫 번째 사람은 ㉠아이작이라는 이름의 노인이었고, 두 번째 사람은 ㉡시몬이라는 젊은 사람이었습니다. 아이작은 나이가 많고 경험이 풍부한 지혜자로, 마을 사람들 사이에서 존경받고 있었습니다. 시몬은 젊고 똑똑했지만, 세상에 대한 경험이 부족했습니다.

어느 날, 마을에 큰 문제가 생겼습니다. 마을의 강물이 갑자기 불어나서, 마을 사람들의 집이 침수될 위험에 처하게 된 것입니다. 마을 사람들은 모두 불안해했고, 이를 해결할 방법을 찾기 위해 두 사람에게 도움을 청했습니다. 아이작은 침착하게 말했습니다. "우리는 물이 다시 빠질 때까지 기다리면 된다. 자연의 법칙을 따르는 것이 가장 현명한 방법이다." 하지만 시몬은 다르게 생각했습니다. "기다리는 것만으로는 문제를 해결할 수 없습니다. 물을 더 빨리 흘러가게 하려면 제방을 만들거나 물이 빠져 나갈 수 있는 다른 방법을 찾아야 합니다."

마을 사람들은 두 사람의 의견을 들으며 잠시 고민에 빠졌습니다. 결국, 두 사람은 각자 의견을 제시하기로 하고, 자신들의 방법을 따르기로 했다. 아이작은 그 자리에 앉아 침착하게 기다리며 마을 사람들에게 차분히 말했습니다. "우리는 자연의 순리에 따라 일을 해야 한다. 물이 넘치면 시간이 지나면서 자연스럽게 물은 빠질 것이다." 반면, 시몬은 빠르게 행동하기 시작했습니다. 그는 마을 사람들과 함께 나가서 제방을 만들고, 물이 빠질 수 있도록 구멍을 만들기 시작했습니다. 그 과정에서 일부 마을 사람들은 그의 생각에 ㉢동조하여 함께 일했고, 몇 명은 아이작의 조언을 따르며 기다리기로 했습니다.

며칠 후, 강물은 서서히 빠지기 시작했습니다. 하지만 아이작의 방법을 따른 마을 사람들은 물이 빠지는 속도가 느리다며 불안해했습니다. 시몬은 물을 빠르게 흘려보내기 위한 작업을 계속했고, 결국 제방을 만들면서 물이 더 빨리 빠지게 되었습니다.

결국 물이 빠진 후, 마을 사람들은 두 사람의 방법을 비교해 보았습니다. 아이작의 방법은 안전했지만, 시간이 많이 걸렸고, 시몬의 방법은 더 빠르게 문제를 해결했지만, 제방이 약간 붕괴되기도 했습니다. 마을 사람들은 두 사람의 방법 중 어떤 것이 더 나았는지를 두고 논의했습니다. 그러자 아이작이 말했습니다. "시몬, 네 방법이 매우 빠르고 효과적이었지만, 한 가지 중요한 점을 간과한 것 같구나. 우리는 때로 더 신중하게 일을 처리해야 한다. 다만, 네가 빠르게 행동한 덕분에 우리가 시간을 절약할 수 있었어." 시몬은 잠시 생각하다가 말했다. "아이작, 당신 말씀이 맞습니다. 하지만 때로는 신중함만으로는 문제를 해결할 수 없을 때도 있습니다. 저는 빠르게 행동했지만, 더 많은 사람들을 위험에 처하게 할 수도 있었습니다. 저는 앞으로 신중하게 결정을 내리겠지만, 지금처럼 빠르게 일을 처리할 필요도 있다는 것을 배웠습니다."`,
  },
  {
    id: 2,
    title: "AI(인공지능)의 발전과 사회적 영향",
    content: `AI(인공지능)는 인간의 지능을 기계에 구현하려는 기술적 시도이며, 데이터를 통해 학습하고 문제를 해결하는 시스템을 말한다. AI는 인간의 사고 과정을 모방하려는 노력에서 출발하였으며, 현재는 그 응용 분야가 점차 확대되고 있다. 오늘날 AI는 다양한 분야에서 혁신적인 변화를 일으키고 있으며, 많은 산업에 영향을 미치고 있다.

AI는 크게 ㉠기계 학습(Machine Learning)과 ㉡딥 러닝(Deep Learning) 두 가지 주요 기술로 나눌 수 있다. 기계 학습은 데이터에서 패턴을 찾아내고, 그 패턴을 바탕으로 예측하거나 결정을 내리는 방식이다. 가령, 기계 학습은 이메일 필터링, 신용카드 거래의 이상 탐지, 의학적 진단 등과 같은 분야에서 널리 사용된다. 반면, 딥 러닝은 기계 학습의 한 종류로, 인간의 뇌 구조와 비슷한 신경망을 활용하여 더 복잡한 문제를 해결할 수 있는 기술이다. 딥 러닝은 이미지 인식, 음성 인식, 자율주행 자동차 등의 분야에서 활발하게 연구되고 있다.

AI의 주요 장점 중 하나는 자동화다. AI는 사람이 처리하기 어려운 대규모 데이터를 빠르게 분석하고, 복잡한 계산을 신속하게 처리할 수 있다. 예를 들어, AI는 의료 분야에서 환자의 건강 상태를 예측하거나, 특정 질병의 위험 요소를 분석하는 데 사용될 수 있다. 또한, 자동화 산업 분야에서도 제조업체들이 생산 공정을 최적화하고, 비용을 절감하며, 품질을 향상시키는 데 AI를 활용하고 있다.

그러나 ㉢AI의 발전은 사회적 변화와 윤리적 문제를 동반하기도 한다. AI가 인간의 일자리를 대체하는 경우, 고용 시장에 미치는 영향이 우려되고 있다. 자동화가 진전되면서 일부 직종은 사라지고, 새로운 직업이 생기기도 하지만, 이에 대한 준비가 부족할 경우 많은 사람들이 일자리를 상실할 수 있다. 또한, AI가 어떤 문제를 해결하는 데 필요한 조치를 결정하는 과정은 종종 불투명하고, 이를 어떻게 공정하고 책임감 있게 관리할 것인가에 대한 논란이 따른다. 실례로, 자율주행 자동차가 사고를 일으킬 경우, 사고 책임을 차량 생산자와 운전자 중 누구에게 물을 것인가라는 문제가 발생할 수 있다.

아울러 AI는 개인 정보 보호와 관련된 우려를 낳고 있다. AI 시스템은 대량의 데이터를 수집하고 분석하는데, 이는 사용자의 개인 정보까지 포함할 수 있다. 이러한 데이터가 악용될 경우, 개인의 프라이버시가 침해될 위험이 존재한다. 예를 들어, AI를 활용한 광고 시스템은 사용자의 행동을 분석하여 맞춤형 광고를 제공하는데, 이는 개인 정보 보호에 중요한 문제를 일으킬 수 있다.

이와 같이 AI는 기술적으로 많은 장점을 가지고 있지만, 그 사용과 발전에 대해서는 신중히 접근해야 한다. AI가 사회에 미치는 부정적 영향을 최소화하고, 윤리적 기준을 지키며, 모두에게 이익이 되는 방식으로 발전할 수 있도록 하는 것이 중요한 과제가 되었다.`,
  },
  {
    id: 3,
    title: "가족과 국가에 대한 철학적 관점",
    content: `(가) 모든 사회 중에서 가장 오래되고, 단 하나의 자연스러운 사회는 가족이라는 사회다. 이 가족 사회에서도 자식들은 자기보존을 위해서 아버지를 필요로 하는 동안만 아버지에게 속해 있는 것이다. 이 필요성이 없어지면 곧 자연적 유대는 풀어진다. 자식은 아버지에 대한 복종의 의무에서 벗어나고 아버지 또한 자식에 대한 양육의 의무에서 벗어나 모두가 동등하게 독립된 생활을 한다. 만일 이들이 계속 함께 있다 해도, 이제는 자연적인 것이 아니라 자의적인 것으로 가족 자체도 결국은 약속에 따라서만 유지되는 것이다.

그러므로 가족은 국가에 비유할 수 있다. 즉 군주는 아버지에 해당하고, 인민은 자식에 해당한다. 또 모두가 평등하고 자유롭게 태어났기 때문에, 그들의 자유는 그들 자신의 이익을 위해서만 ㉠양도된다.

(나) 가족은 원래 사람들의 생활필수품 보급을 하려고 성립된 공동체이며, '식탁을 같이 쓰는 사람들', '여물통을 같이 쓰는 사람들'이라고 부르기도 했다. 그러나 여러 가족이 모여 결성되는 최초의 사회는 촌락이다. 촌락 중에서도 가장 자연스러운 형태는 동일 가족에서 나온 취락이며, 이는 자식과 손자들로 구성되어 있다. 이들 촌락은 여물을 같이 먹는 사람들이라고도 할 수 있다.

몇 개 촌락이 자급자족할 수 있을 만큼 완성된 생활공동체로 결성될 때, 비로소 국가가 나타난다. 국가는 일상생활의 단순한 필수품을 충족하려는 데서 출발하였고, 선한 생활을 위하여 유지된다. 그러므로 사회의 초기 형태가 자연스러웠다면 국가의 형성도 가족처럼 자연스러운 것이다.

(다) 길동이 자라 여덟 살이 되자 남달리 총명하여 하나를 들으면 백 가지를 알았다. 아들을 사랑하는 홍 판서(길동의 아버지)의 마음도 더욱 깊어졌지만, 길동의 근본이 천한 출생인 것은 어쩔 수가 없었다. 홍 판서는 길동이 아버지라 부르거나 형을 형이라고 부르는 것을 꾸짖어 못하게 했다. 아버지와 형님이 계시는데도 아버지를 아버지라 부르지 못하고, 형을 형이라 부르지 못하니 심장이 터질 지경이구나.`,
  },
  {
    id: 4,
    title: "해양 환경과 인류의 책임",
    content: `(가) 해양학자들은 국제 지구물리학의 해인 1957~1958년에 자신들의 목표가 '심해를 방사성 폐기장으로 활용하는 가능성'을 연구하는 것이라고 밝혔다. 널리 알려지지는 않았지만, 1957~1958년에는 이미 10년 이상 상당히 많은 양의 방사성 물질을 바다에 버리고 있었다. 미국은 1946년부터 200리터짜리 드럼에 넣은 방사성 폐기물을 캘리포니아주의 샌프란시스코에서 약 50킬로미터 정도 떨어진 파랄론 제도로 싣고 가서 바닷속으로 던져 버렸다. 1990년대에 그런 일을 그만둘 때까지 미국은 대략 50여 곳의 바다에 수십만 개의 폐기물 드럼을 버렸고, 파랄론 지역에만 5만 개의 드럼을 폐기했다. 미국만 그랬던 것은 아니었다. 러시아, 중국, 일본, 뉴질랜드, 그리고 유럽의 거의 모든 국가들이 그런 식으로 폐기물을 버려왔다. 그런 일들이 바다 밑에 사는 생물들에게 어떤 영향을 주었을까?

(나) 꽃게가 간장 속에
반쯤 몸을 담그고 엎드려 있다
등판에 간장이 울컥울컥 쏟아질 때
꽃게는 뱃속의 알을 껴안으려고
꿈틀거리다가 더 낮게
더 바닥 쪽으로 웅크렸으리라
어찌할 수 없어서
살 속으로 스며드는 것을
한때의 어스름을
꽃게는 천천히 받아들였으리라
껍질이 먹먹해지기 전에
가만히 알들에게 말했으리라
저녁이야
불 끄고 잘 시간이야
- 안도현, 『스며드는 것』 -

(다) [공익광고, 해양환경관리공단] - 해양환경을 살리는 '新 자린고비' 정신!`,
  },
  {
    id: 5,
    title: "1인 배달 서비스 규제 토론",
    content: `사회자: 최근 1인 배달 서비스는 스마트폰 앱과 결합하여 빠르게 확산되고 있습니다. 원하는 음식이나 물건을 한 사람의 라이더가 바로 배달해 주는 방식으로, 편리함 때문에 이용이 크게 늘었습니다. 그러나 짧은 거리에도 오토바이와 포장이 사용되어 환경오염과 교통 혼잡이 심해진다는 지적이 있습니다. 또한 배달비 인상과 배달원 과로 문제도 제기되고 있습니다. 이런 상황을 고려해 오늘은 '1인 배달 서비스를 규제해야 한다.'를 논제로 학생 토론을 진행하겠습니다.

찬성 1: 1인 배달 서비스는 '한 건의 주문을 한 명의 라이더가 단독으로 배송하는 서비스'를 뜻합니다. 이를 규제해야 하는 첫째 이유는 환경 보호입니다. 가까운 거리 주문에도 오토바이가 오가고, 다량의 플라스틱 포장재가 사용되며, 그로 인한 이산화탄소 배출과 쓰레기 증가가 심각합니다. 둘째, 배달비 상승과 노동 강도 문제입니다.

반대 1: 저희는 1인 배달 서비스 규제에 반대합니다. 첫째, 소비자 선택권의 침해입니다. 특히 거동이 불편한 노인이나 환자, 교통이 불편한 지역에 사는 사람들에게 1인 배달은 필수적인 서비스일 수 있습니다. 둘째, 경제적 타격입니다. 배달 산업은 청년층과 이주 노동자들에게 중요한 일자리이며, 규제는 고용 감소로 이어질 수 있습니다.

찬성 3: ㉡거동이 불편한 사람들에게 1인 배달이 필요하다는 점은 이해하지만, 모든 상황에서 무제한적으로 허용되는 경우 불필요한 단거리 이동과 과도한 포장으로 환경 피해가 커질 수 있다는 점을 생각해 보신 적은 없습니까?

찬성 2: 따라서 1인 배달 서비스를 전면적으로 금지하자는 것이 아니라, 환경 부담이 큰 구간과 시간대, 불필요한 단거리 주문 등에 대해 합리적인 규제를 적용해야 합니다.`,
  },
];

// 중등 고학년 문항 데이터
const MIDHIGH_ITEMS: MidHighItem[] = [
  // 지문 1: 지혜로운 두 사람 이야기
  {
    item_code: "MIDHIGH_Q01",
    item_type: "mcq_single",
    stem: "㉠과 ㉡의 방법을 가장 적절하게 비교한 마을 사람을 고르시오.",
    max_score: 1,
    options: [
      "마을 사람 1: ㉠의 방법이 ㉡보다 더 빨리 물을 처리할 수 있었어.",
      "마을 사람 2: ㉠과 ㉡의 방법은 달랐지만 결국 결과가 똑같았다고 볼 수 있지.",
      "마을 사람 3: 두 사람 다 물을 잘 처리할 수 있었지만, ㉡의 방법이 시간이 더 걸렸지.",
      "마을 사람 4: ㉡의 방법은 ㉠이 지닌 장점을 갖지 못했고, 제방이 붕괴되는 아쉬움이 있었어.",
      "마을 사람 5: ㉠의 방법은 제방의 완성이라는 결과를 가져왔고, ㉡은 기다림과 인내의 중요성을 사람들에게 전해 주었어.",
    ],
    stimulus_id: 1,
  },
  {
    item_code: "MIDHIGH_Q02",
    item_type: "mcq_single",
    stem: "다음 밑줄 친 단어 중 ㉢의 의미와 가장 가까운 것을 고르시오.",
    max_score: 1,
    options: [
      "그는 어린 시절의 꿈을 좇아 화가가 되었다.",
      "두 회사는 긴 논의 끝에 계약 조건에 대해 합의했다.",
      "그 친구의 판단을 제지하려는 생각에 깊은 고민에 빠졌다.",
      "목표를 이루기 위해서는 계획을 꾸준히 따르는 것이 중요하다.",
      "안쓰러운 사연을 듣고 그들을 보호하자는 의견에 공감할 수밖에 없었다.",
    ],
    stimulus_id: 1,
  },
  {
    item_code: "MIDHIGH_Q03",
    item_type: "mcq_single",
    stem: "이 글을 읽고 '문제 해결을 위한 태도'에 대해 얻을 수 있는 교훈으로 가장 적절한 것은?",
    max_score: 1,
    options: [
      "항상 신중하게 기다려야 한다.",
      "빠르고 즉각적인 행동이 중요하다.",
      "언제나 자연의 법칙을 따르는 것이 가장 중요하다.",
      "많은 사람들이 선택하는 방법을 따르는 것이 옳다.",
      "상황에 맞는 균형 잡힌 판단과 적절한 조화가 중요하다.",
    ],
    stimulus_id: 1,
  },
  {
    item_code: "MIDHIGH_E01",
    item_type: "essay",
    stem: "만약 자신이 마을 사람이었다면, 누구의 말을 따랐을지 쓰고, 그렇게 생각한 이유를 서술하시오.",
    max_score: 5,
    options: [],
    stimulus_id: 1,
  },
  {
    item_code: "MIDHIGH_E02",
    item_type: "essay",
    stem: `<보기>에서 마을 사람들에게 가장 필요한 조언을 말한 철학자 한 명을 고르고, 그렇게 생각한 이유를 서술하시오.

<보기>
(가) 소크라테스(Socrates): "알고 있다는 것을 아는 것이 진정한 지혜이다." 소크라테스는 그의 연설 『변론』에서 자신이 '무엇을 모른다고 아는 것'이 진정한 지혜라고 주장했다.
(나) 아리스토텔레스(Aristotle): "도덕적 미덕은 중용에 있다." 아리스토텔레스는 그의 저서 『니코마코스 윤리학』에서 중용의 덕을 강조했다.
(다) 헤라클레이토스(Heraclitus): "모든 것은 흐른다." 헤라클레이토스는 세상은 끊임없이 변하고 변화하는 것만이 불변이라고 주장했다.`,
    max_score: 5,
    options: [],
    stimulus_id: 1,
  },
  // 지문 2: AI
  {
    item_code: "MIDHIGH_Q04",
    item_type: "mcq_single",
    stem: "윗글에서 AI가 활용되고 있는 분야로 언급하지 않은 것은?",
    max_score: 1,
    options: [
      "금융 거래",
      "우주 탐사",
      "의학적 진단",
      "맞춤형 광고",
      "자율주행 자동차",
    ],
    stimulus_id: 2,
  },
  {
    item_code: "MIDHIGH_Q05",
    item_type: "mcq_single",
    stem: "㉠과 ㉡에 대한 설명으로 가장 적절한 것은?",
    max_score: 1,
    options: [
      "기계 학습은 자율주행 자동차를 위한 기술이고, 딥 러닝은 이메일 필터링을 위한 기술이다.",
      "기계 학습은 신경망을 이용해 문제를 해결하고, 딥 러닝은 이미 학습된 데이터를 바탕으로 예측한다.",
      "기계 학습은 맞춤형 광고를 제공하기 위한 기술이고, 딥 러닝은 개인 정보를 보호하기 위한 기술이다.",
      "기계 학습은 인간의 일자리를 대체하는 기술이고, 딥 러닝은 인간의 새로운 일자리를 만들어내는 기술이다.",
      "기계 학습은 데이터에서 패턴을 찾아내어 예측하고, 딥 러닝은 인간의 뇌와 비슷한 구조를 사용하여 복잡한 문제를 해결한다.",
    ],
    stimulus_id: 2,
  },
  {
    item_code: "MIDHIGH_Q06",
    item_type: "mcq_single",
    stem: "윗글의 내용을 고려할 때, AI의 주요 장점으로 가장 적절한 것은?",
    max_score: 1,
    options: [
      "인간의 직업을 대체하는 능력",
      "인간의 창의성을 발휘하는 능력",
      "사용자의 개인 정보를 수집하고 분석하는 능력",
      "사람과 유사한 감정을 이해하고 표현하는 능력",
      "복잡한 수식을 처리하고 방대한 정보를 분석하는 능력",
    ],
    stimulus_id: 2,
  },
  {
    item_code: "MIDHIGH_Q07",
    item_type: "mcq_single",
    stem: "윗글에서 AI의 발전으로 인해 발생할 수 있는 문제로 언급한 것으로 가장 적절한 것은?",
    max_score: 1,
    options: [
      "새로운 직업 창출",
      "이미지나 음성 인식",
      "대량의 데이터 분석",
      "개인 정보 보호와 관련된 우려",
      "AI가 사회적으로 적응하지 못하는 문제",
    ],
    stimulus_id: 2,
  },
  {
    item_code: "MIDHIGH_Q08",
    item_type: "mcq_single",
    stem: "윗글의 내용을 고려할 때, AI가 의료 분야에서 사용되는 예로 가장 적절한 것은?",
    max_score: 1,
    options: [
      "환자의 기존 질병 파악",
      "입원 환자의 퇴원 가능 날짜 예측",
      "환자의 진료 및 약 처방 기록 최신화",
      "환자 가족들의 질병 이력에 대한 조사",
      "환자의 정서적 문제에 대한 상담과 치료",
    ],
    stimulus_id: 2,
  },
  {
    item_code: "MIDHIGH_E03",
    item_type: "essay",
    stem: "AI의 결정 과정의 불투명성으로 인해 발생할 수 있는 윤리적 문제의 사례를 서술하시오.",
    max_score: 5,
    options: [],
    stimulus_id: 2,
  },
  {
    item_code: "MIDHIGH_E04",
    item_type: "essay",
    stem: "AI가 자신의 진로에 미치는 영향으로 어떤 것이 있는지 서술하시오. (진로를 정하지 않은 학생은 AI가 평소 자신이 관심을 가지고 있는 분야에 미치는 영향을 서술하시오.)",
    max_score: 5,
    options: [],
    stimulus_id: 2,
  },
  // 지문 3: 가족과 국가
  {
    item_code: "MIDHIGH_Q09",
    item_type: "mcq_single",
    stem: "다음 밑줄 친 단어의 의미가 ㉠과 비슷한 의미로 쓰인 것은?",
    max_score: 1,
    options: [
      "아들은 엄마의 충고를 귓등으로 넘겼다.",
      "주택 주인으로서 권리를 임차인에게 넘겼다.",
      "그는 수술 후 고비를 넘기고 회복 중에 있다.",
      "그는 쉰 살이 넘어 새로운 사업을 시작하셨다.",
      "그녀는 아들의 잦은 일탈을 대수롭지 않게 넘겼다.",
    ],
    stimulus_id: 3,
  },
  {
    item_code: "MIDHIGH_Q10",
    item_type: "mcq_single",
    stem: "(나)의 핵심 내용을 비판한 질문으로 가장 적절한 것은?",
    max_score: 1,
    options: [
      "가족은 사랑에 의해 만들어진 것이 아닐까?",
      "자식이 약속을 지키지 않는 것은 자유로운 존재로 살고 싶은 것이 아닐까?",
      "평등하고 자유로운 인간은 자기에게 이익이 되는 것만 추구하는 존재인가?",
      "자기 이익을 따라 군주의 존재를 인정하는 인민은 자유롭고 평등한 존재일까?",
      "자기 이익을 위해 국가를 형성하는 것이 가족의 형성처럼 자연스럽고 당연한 것일까?",
    ],
    stimulus_id: 3,
  },
  {
    item_code: "MIDHIGH_Q11",
    item_type: "mcq_single",
    stem: "글(다)의 길동 입장에서 글 (가)와 (나)의 내용을 비판한 내용으로 적절하지 않은 것은?",
    max_score: 1,
    options: [
      "생활 필수품을 공급하기 위해 길동이 태어난 것은 아니다.",
      "길동이 아버지를 부르지 못하는 것은 약속으로 유지된 것이 아니다.",
      "길동이 일상의 필요에 의해 아버지나 형을 불러보고 싶은 것은 아니다.",
      "길동이 홍 판서 가족의 일원이 된 것은 자신의 의지로 선택한 것이 아니다.",
      "서자의 신분으로 태어난 길동이 아버지를 부르지 못하는 것은 길동의 자의가 아니다.",
    ],
    stimulus_id: 3,
  },
  {
    item_code: "MIDHIGH_E05",
    item_type: "essay",
    stem: "만약 자신이 홍길동이라면, 지금 우리 사회에서 개선해야 할 문제를 개인적 차원과 국가적 차원에서 해결 방안을 서술하시오.",
    max_score: 5,
    options: [],
    stimulus_id: 3,
  },
  // 지문 4: 해양 환경
  {
    item_code: "MIDHIGH_Q12",
    item_type: "mcq_single",
    stem: "글 (가)에 드러난 문제를 해결하기 위해 가장 타당한 의견을 제시한 사람은?",
    max_score: 1,
    options: [
      "영이: 방사성 폐기물 처리와 관련한 국제법 실행에 여러 나라는 참여해야 한다.",
      "철이: 방사성 폐기물을 바다에 버리지 않으면 인류의 삶이 더 위험해질 수 있다.",
      "성이: 해수, 빙하의 분포와 활용 사례를 조사하고 물의 가치를 널리 알려야 한다.",
      "숙이: 지속가능한 지구를 만들기 위해 재생 및 대체에너지 관련 기술을 개발해야 한다.",
      "석이: 해양 강국으로 성장하기 위해 해양 정책을 보완하고 해양 전문가를 양성해야 한다.",
    ],
    stimulus_id: 4,
  },
  {
    item_code: "MIDHIGH_Q13",
    item_type: "mcq_single",
    stem: "(나)의 화자가 가진 정서와 가장 비슷한 것은?",
    max_score: 1,
    options: [
      "와장창하고 창문이 깨지는 소리가 났습니다.",
      "님은 갔습니다, 사랑하는 나의 님은 갔습니다.",
      "아픈 배를 어루만지시는 할머니의 손이 참 따뜻했어.",
      "분수처럼 흩어지는 푸른 종소리가 광장에 퍼지고 있어.",
      "이번 주말에 가족과 함께 제주도에 여행을 가기로 했어.",
    ],
    stimulus_id: 4,
  },
  {
    item_code: "MIDHIGH_Q14",
    item_type: "mcq_single",
    stem: "글 (가)를 읽고 문제를 해결하기 위해 제작한 광고 (다)의 적절성을 평가한 내용으로 가장 적절한 것은?",
    max_score: 1,
    options: [
      "부정적으로 사용되는 단어를 환기하여 해양 환경 보호에 대한 참여를 유도한다.",
      "물고기 한 마리를 묶은 그림으로 플라스틱이 해양환경에 미친 결과를 보여주고 있다.",
      "방사성 폐기물 투기의 결과로 발생한 심각한 먹거리 문제를 소박한 밥상으로 표현한다.",
      "방사성 투기보다는 해양쓰레기로 인한 오염의 정도를 수치로 제시하여 각성을 촉구한다.",
      "바다가 차지하는 지구 면적의 비율을 구체적으로 제시하여 해양환경 오염의 심각성을 알린다.",
    ],
    stimulus_id: 4,
  },
  {
    item_code: "MIDHIGH_E06",
    item_type: "essay",
    stem: "위 시 (나)를 읽고 시어 '한 때의 어스름'의 의미를 생각해 보고, 이와 비슷한 의미로 사용된 시어를 있는 대로 서술하시오. (50자 내외)",
    max_score: 5,
    options: [],
    stimulus_id: 4,
  },
  {
    item_code: "MIDHIGH_E07",
    item_type: "essay",
    stem: `다음 글에서 할아버지의 마지막 말에 공감한 소년이 시 (나)의 꽃게에게 전하고 싶은 마음을 편지글의 형식으로 쓰시오. (글자 수 150자 내외)

"그런데 왜 시가 쓸모없는 취급을 받았을까요?"
"무엇에 쓸모 있느냐가 문제였지. 그 시절 사람들은 몸을 잘 살게 하는데 쓸모 있는 것만 중요하게 생각하고 마음을 잘 살게 하는 데 쓸모 있는 건 무시하려 들었으니까."
"그럼 몸이 잘 사는 것과 마음이 잘 사는 것은 서로 다른 건가요?"
"암, 다르고말고. 몸이 잘 산다는 건 편안한 것에 길들여지는 거고, 마음이 잘 산다는 건 편안한 것으로부터 놓여나 새로워지는 거고."
-박완서, 시인의 꿈 중에서-`,
    max_score: 5,
    options: [],
    stimulus_id: 4,
  },
  // 지문 5: 1인 배달 서비스
  {
    item_code: "MIDHIGH_Q15",
    item_type: "mcq_single",
    stem: "찬성 3이 ㉡과 같이 반대 신문하기 위해 참고한 정보에 해당하지 않은 것은?",
    max_score: 1,
    options: [
      "공동 배달과 1인 배달의 환경적 영향 차이",
      "특정 시간대 및 거리 제한 규제로 인한 이점",
      "1인 배달 서비스의 평균 이동 거리와 소요 시간",
      "1인 배달 서비스가 친환경 운송 수단을 사용하는지 여부",
      "1인 배달 서비스가 거동이 불편한 사람들에게 미치는 영향",
    ],
    stimulus_id: 5,
  },
  {
    item_code: "MIDHIGH_Q16",
    item_type: "mcq_single",
    stem: "찬성 측이 1인 배달 서비스를 규제해야 한다고 주장하는 이유로 옳은 것은?",
    max_score: 1,
    options: [
      "1인 배달 서비스가 소비자 편익을 높일 수 있기 때문에",
      "1인 배달 서비스가 신속성과 품질 유지 측면에서 장점이 있기 때문에",
      "1인 배달 서비스가 거동이 불편한 사람들에게 필요한 경우가 있기 때문에",
      "1인 배달 서비스 규제가 환경오염과 배달원의 과로 문제를 줄일 수 있기 때문에",
      "1인 배달 서비스가 청년층과 이주 노동자들에게 중요한 일자리를 제공하기 때문에",
    ],
    stimulus_id: 5,
  },
  {
    item_code: "MIDHIGH_E08",
    item_type: "essay",
    stem: "위에 제시된 전체 토론의 맥락을 고려하여 ㉠에 들어갈 적절한 단어를 넣고, 그 후 전체 맥락을 고려하여 찬성 1의 재반론 내용을 완성하시오. (재반론 내용 전체를 쓰시오)",
    max_score: 5,
    options: [],
    stimulus_id: 5,
  },
  {
    item_code: "MIDHIGH_E09",
    item_type: "essay",
    stem: `아래 자료를 활용하여 위의 토론에 참여한다면, 찬성측 또는 반대측 어느 쪽에서 토론할 수 있는지 쓰고, 어떤 측면에서 그러한지 명확히 근거를 들어 서술하시오.

[자료: 한국영양학회와 보건복지부 '성인 배달 음식 섭취 실태 조사' - 1인 배달 서비스 이용 빈도가 월평균 6회 이상인 성인의 평균 나트륨 섭취량은 하루 권장량의 1.7배, 포화지방 섭취량은 권장량의 1.5배에 달함. BMI 25 이상 비율은 42%로 전체 성인 평균(29%)보다 높음.]`,
    max_score: 5,
    options: [],
    stimulus_id: 5,
  },
];

export default function MidHighDiagnosticAssessment() {
  const navigate = useNavigate();

  // 상태
  const [started, setStarted] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [responses, setResponses] = useState<Map<string, StudentResponse>>(
    new Map(),
  );
  const [timeLeft, setTimeLeft] = useState(70 * 60); // 70분
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showStimulusExpanded, setShowStimulusExpanded] = useState(true);
  const [showNavigator, setShowNavigator] = useState(false);

  // 제출 함수를 ref로 저장
  const handleSubmitRef = useRef<() => void>(() => {});

  // 제출 함수
  const handleSubmit = useCallback(() => {
    // 실제로는 API 호출
    console.log("제출된 응답:", Object.fromEntries(responses));
    alert("평가가 제출되었습니다.");
    navigate("/student/dashboard");
  }, [navigate, responses]);

  // ref 업데이트
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  // 타이머
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

  // 현재 문항
  const currentItem = MIDHIGH_ITEMS[currentItemIndex];
  const currentStimulus = MIDHIGH_STIMULI.find(
    (s) => s.id === currentItem?.stimulus_id,
  );
  const currentResponse = responses.get(currentItem?.item_code);

  // 응답 처리
  const handleMcqChange = useCallback(
    (optionIndex: number) => {
      const newResponses = new Map(responses);
      const existing = newResponses.get(currentItem.item_code) || {
        item_code: currentItem.item_code,
      };

      if (currentItem.item_type === "mcq_multi") {
        // 복수 응답
        const current = existing.selected_options || [];
        const updated = current.includes(optionIndex)
          ? current.filter((i) => i !== optionIndex)
          : [...current, optionIndex];
        newResponses.set(currentItem.item_code, {
          ...existing,
          selected_options: updated,
        });
      } else {
        // 단일 응답
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

  // 네비게이션
  const goToItem = (index: number) => {
    setCurrentItemIndex(index);
    setShowStimulusExpanded(true);
  };

  const goNext = () => {
    if (currentItemIndex < MIDHIGH_ITEMS.length - 1) {
      // 같은 지문이면 접은 상태 유지
      const nextItem = MIDHIGH_ITEMS[currentItemIndex + 1];
      setShowStimulusExpanded(nextItem.stimulus_id !== currentItem.stimulus_id);
      setCurrentItemIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentItemIndex > 0) {
      const prevItem = MIDHIGH_ITEMS[currentItemIndex - 1];
      setShowStimulusExpanded(prevItem.stimulus_id !== currentItem.stimulus_id);
      setCurrentItemIndex((prev) => prev - 1);
    }
  };

  // 시간 포맷
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // 응답 현황 계산
  const getResponseStats = () => {
    const answered = MIDHIGH_ITEMS.filter((item) => {
      const resp = responses.get(item.item_code);
      if (item.item_type === "essay") {
        return resp?.essay_text && resp.essay_text.trim().length > 0;
      }
      return resp?.selected_options && resp.selected_options.length > 0;
    }).length;

    const flagged = MIDHIGH_ITEMS.filter(
      (item) => responses.get(item.item_code)?.flagged,
    ).length;

    return { answered, flagged, total: MIDHIGH_ITEMS.length };
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
              2025학년도 중등 고학년 문해력 진단 평가
            </Typography>
            <Chip
              label="중3 ~ 고1"
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
                      <ListItemText primary="총 문항 수" secondary="25문항" />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="문항 구성"
                        secondary="객관식 16문항 + 서술형 9문항"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="제한 시간" secondary="70분" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="총점" secondary="61점" />
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
                    {MIDHIGH_STIMULI.map((stimulus, idx) => (
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
          <Typography variant="h6">중등 고학년 문해력 진단 평가</Typography>
          <Chip
            icon={<Quiz />}
            label={`문항 ${currentItemIndex + 1} / ${MIDHIGH_ITEMS.length}`}
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

      {/* 진행률 바 */}
      <LinearProgress
        variant="determinate"
        value={(stats.answered / stats.total) * 100}
        sx={{ height: 4 }}
      />

      {/* 메인 컨텐츠 */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* 문항 네비게이터 (사이드바) */}
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
              {MIDHIGH_ITEMS.map((item, idx) => {
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

        {/* 문항 영역 */}
        <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
          {/* 지문 */}
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
                    fontSize: "1.05rem",
                  }}
                >
                  {currentStimulus.content}
                </Typography>
              </Collapse>
            </Paper>
          )}

          {/* 문항 */}
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
                    currentItem.item_type === "essay" ? "서술형" : "객관식"
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

            {/* 객관식 */}
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

            {/* 서술형 */}
            {currentItem.item_type === "essay" && (
              <TextField
                fullWidth
                multiline
                rows={10}
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

      {/* 하단 네비게이션 */}
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
          disabled={currentItemIndex === MIDHIGH_ITEMS.length - 1}
          variant="contained"
        >
          다음 문항
        </Button>
      </Paper>

      {/* 제출 확인 다이얼로그 */}
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
