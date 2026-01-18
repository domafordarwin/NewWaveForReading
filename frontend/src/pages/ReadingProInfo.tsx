import { Box, Grid, Paper, Typography } from "@mui/material";

type ColorKey = "blue" | "orange" | "green";

interface CompetencyItem {
  icon: string;
  title: string;
  description: string;
  color: ColorKey;
}

interface ReaderTypeItem {
  type: string;
  subtitle: string;
  description: string;
  characteristics: string[];
  examples: string[];
  color: ColorKey;
}

const colorStyles: Record<
  ColorKey,
  {
    bg: string;
    border: string;
    text: string;
    accent: string;
    light: string;
  }
> = {
  blue: {
    bg: "#EEF4FF",
    border: "#3B82F6",
    text: "#1E3A8A",
    accent: "#3B82F6",
    light: "#DBEAFE",
  },
  orange: {
    bg: "#FFF4E5",
    border: "#F97316",
    text: "#7C2D12",
    accent: "#F97316",
    light: "#FFEAD5",
  },
  green: {
    bg: "#ECFDF3",
    border: "#22C55E",
    text: "#14532D",
    accent: "#22C55E",
    light: "#DCFCE7",
  },
};

const aestheticCompetencies: CompetencyItem[] = [
  {
    icon: "📖",
    title: "문학적 표현",
    description: "작가의 표현 기법과 언어의 아름다움에 대한 이해",
    color: "blue",
  },
  {
    icon: "❤️",
    title: "정서적 공감",
    description: "등장인물의 감정이나 상황에 공감하는 능력",
    color: "orange",
  },
  {
    icon: "⭐",
    title: "문학적 가치",
    description: "작품이 담고 있는 주제·의식이나 교훈을 파악하는 능력",
    color: "green",
  },
];

const communicationCompetencies: CompetencyItem[] = [
  {
    icon: "💡",
    title: "창의적 문제 해결",
    description: "텍스트 내용을 응용하여 새로운 해결책을 찾는 능력",
    color: "blue",
  },
  {
    icon: "🗣️",
    title: "표현과 전달 능력",
    description: "이해 내용을 정확히 표현하고 전달하는 능력",
    color: "orange",
  },
  {
    icon: "👥",
    title: "사회적 상호작용",
    description: "읽은 내용을 바탕으로 타인과 소통하고 협력하는 능력",
    color: "green",
  },
];

const comprehensionCompetencies: CompetencyItem[] = [
  {
    icon: "📚",
    title: "사실적 이해",
    description:
      "글에 명시된 정보를 이해하고, 핵심 사실과 세부 내용을 정확히 찾아내는 능력",
    color: "blue",
  },
  {
    icon: "🔗",
    title: "추론적 이해",
    description:
      "글에 나타나지 않은 의미를 단서와 맥락을 바탕으로 논리적으로 추론하는 능력",
    color: "orange",
  },
  {
    icon: "🔍",
    title: "비판적 이해",
    description:
      "글의 주장과 근거를 검토하고, 타당성과 관점을 비판적으로 평가하는 능력",
    color: "green",
  },
];

const readerTypes: ReaderTypeItem[] = [
  {
    type: "A 유형",
    subtitle: "감성관계 중심 요인 우세",
    description:
      "정서적 반응 요인과 사회적 동기 요인이 상대적으로 높게 나타난 학생군입니다.",
    characteristics: [
      "독서를 재미, 감동, 공감의 활동으로 인식",
      "타인의 반응(칭찬, 권유, 함께 읽기)이 독서 동기에 크게 작용",
      "독서 후 느낀 나누기, 이야기 공유에 대한 긍정적 태도",
    ],
    examples: [
      "\"책을 읽으면 기분이 좋아진다\"",
      "\"가족이나 친구와 책 이야기를 나누는 것이 좋다\"",
      "\"누군가 권해 주면 책을 더 잘 읽는다\"",
    ],
    color: "blue",
  },
  {
    type: "B 유형",
    subtitle: "인지·분석 요인 우세",
    description: "정보 처리 요인과 인지적 독서 동기가 두드러진 학생군입니다.",
    characteristics: [
      "독서를 지식 습득과 이해의 수단으로 인식",
      "내용의 사실성, 논리성, 활용 가능성을 중시",
      "구체적 설명, 실제 사례가 있는 책을 선호",
    ],
    examples: [
      "\"책을 읽으며 새로운 정보를 얻고 싶다\"",
      "\"읽은 내용을 이해하고 설명할 수 있다\"",
      "\"실생활에 도움이 되는 책이 좋다\"",
    ],
    color: "orange",
  },
  {
    type: "C 유형",
    subtitle: "행동·습관 요인 우세",
    description:
      "독서 실천 행동과 자기조절 요인이 가장 안정적으로 나타난 학생군입니다.",
    characteristics: [
      "독서가 생활 습관으로 내면화됨",
      "외적 통제 없이도 꾸준히 독서를 실천",
      "독서 시간과 분량에 대한 자기 관리 능력 보유",
    ],
    examples: [
      "\"정해진 시간에 책을 읽는 편이다\"",
      "\"누가 시키지 않아도 스스로 책을 읽는다\"",
      "\"독서를 자주, 꾸준히 한다\"",
    ],
    color: "green",
  },
  {
    type: "D 유형",
    subtitle: "자율·탐색 요인 우세",
    description:
      "호기심 기반 동기와 탐색적 독서 요인이 상대적으로 높은 학생군입니다.",
    characteristics: [
      "독서 방식이 유연하고 비정형적",
      "장르와 주제 선택의 폭이 넓음",
      "필요와 흥미에 따라 독서 강도가 변동",
    ],
    examples: [
      "\"관심 있는 주제라면 어떤 책이든 읽어 보고 싶다\"",
      "\"여러 종류의 책을 자유롭게 읽는다\"",
      "\"읽다가 흥미가 없으면 다른 책을 선택한다\"",
    ],
    color: "blue",
  },
];

const ReadingProInfo = () => {
  return (
    <Box sx={{ pb: 6 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          리딩 PRO 소개
        </Typography>
        <Typography variant="body2" color="text.secondary">
          문해력 진단 및 독자성향검사에 대한 설명입니다.
        </Typography>
      </Paper>

      <Box component="section" sx={{ mb: 5 }}>
        <Paper sx={{ p: 3, border: "1px solid #E5E7EB", bgcolor: "#F5F9FF" }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#1E3A8A" }}>
            개요
          </Typography>
          <Typography sx={{ mt: 2, color: "#1F2937", lineHeight: 1.8 }}>
            문해력은 글을 읽고 이해하는 것에 그치지 않고, 정보를 해석하고
            비판적으로 판단하며 자신의 생각을 근거로 표현하는 능력까지 포함합니다.
            리딩 PRO는 학습자가 다양한 텍스트에서 핵심 정보를 정확히 추출하고,
            맥락을 고려해 의미를 확장하며, 실제 상황에서 지식을 적용할 수 있는지를
            종합적으로 평가합니다.
          </Typography>
        </Paper>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Box sx={{ width: 6, height: 36, bgcolor: "#3B82F6", borderRadius: 3 }} />
          <Typography variant="h5" fontWeight="bold">
            문해력 진단
          </Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 4, border: "1px solid #E5E7EB", bgcolor: "#FAFAFA" }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            리딩 PRO 문해력 진단은 무엇을 평가하는가?
          </Typography>
          <Typography sx={{ color: "#374151", lineHeight: 1.8 }}>
            리딩 PRO는 학습자의 문해력을 세 가지 핵심 영역으로 나누어 평가합니다.
            각 영역은 독립적이면서도 상호 연관되어 있으며, 학생의 종합적인 읽기
            능력을 파악하는 데 중요한 역할을 합니다.
          </Typography>
        </Paper>

        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            심미적 감수성
          </Typography>
          <Typography sx={{ color: "#4B5563", mb: 2, lineHeight: 1.7 }}>
            문학 작품 등을 감상하며 아름다움이나 의미를 느끼고 공감하는 능력
          </Typography>
          <Grid container spacing={3}>
            {aestheticCompetencies.map((item) => {
              const colors = colorStyles[item.color];
              return (
                <Grid item xs={12} md={4} key={item.title}>
                  <Paper
                    sx={{
                      p: 3,
                      bgcolor: colors.bg,
                      borderLeft: `6px solid ${colors.border}`,
                      borderRadius: 2,
                      height: "100%",
                    }}
                  >
                    <Box sx={{ fontSize: 32, textAlign: "center", mb: 1 }}>
                      {item.icon}
                    </Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ color: colors.text, textAlign: "center", mb: 1 }}
                    >
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: "#374151", lineHeight: 1.6 }}>
                      {item.description}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            의사소통 능력
          </Typography>
          <Typography sx={{ color: "#4B5563", mb: 2, lineHeight: 1.7 }}>
            글을 통해 생각을 표현하고 다른 사람과 상호 작용하는 능력
          </Typography>
          <Grid container spacing={3}>
            {communicationCompetencies.map((item) => {
              const colors = colorStyles[item.color];
              return (
                <Grid item xs={12} md={4} key={item.title}>
                  <Paper
                    sx={{
                      p: 3,
                      bgcolor: colors.bg,
                      borderLeft: `6px solid ${colors.border}`,
                      borderRadius: 2,
                      height: "100%",
                    }}
                  >
                    <Box sx={{ fontSize: 32, textAlign: "center", mb: 1 }}>
                      {item.icon}
                    </Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ color: colors.text, textAlign: "center", mb: 1 }}
                    >
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: "#374151", lineHeight: 1.6 }}>
                      {item.description}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            이해력
          </Typography>
          <Typography sx={{ color: "#4B5563", mb: 2, lineHeight: 1.7 }}>
            글의 내용을 정확히 파악하고 추론하는 능력
          </Typography>
          <Grid container spacing={3}>
            {comprehensionCompetencies.map((item) => {
              const colors = colorStyles[item.color];
              return (
                <Grid item xs={12} md={4} key={item.title}>
                  <Paper
                    sx={{
                      p: 3,
                      bgcolor: colors.bg,
                      borderLeft: `6px solid ${colors.border}`,
                      borderRadius: 2,
                      height: "100%",
                    }}
                  >
                    <Box sx={{ fontSize: 32, textAlign: "center", mb: 1 }}>
                      {item.icon}
                    </Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ color: colors.text, textAlign: "center", mb: 1 }}
                    >
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: "#374151", lineHeight: 1.6 }}>
                      {item.description}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>

      <Box component="section" sx={{ mb: 6 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Box sx={{ width: 6, height: 36, bgcolor: "#F97316", borderRadius: 3 }} />
          <Typography variant="h5" fontWeight="bold">
            독자성향검사
          </Typography>
        </Box>

        <Paper sx={{ p: 3, border: "1px solid #FCD6B5", bgcolor: "#FFF4E5", mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#7C2D12" }}>
            독자성향검사란?
          </Typography>
          <Typography sx={{ mt: 2, color: "#7C2D12", lineHeight: 1.8 }}>
            독자성향검사는 학생들의 읽기 태도와 습관, 동기 등을 종합적으로 진단하여
            개인별 읽기 성향을 파악하는 평가도구입니다. 이 검사는 기존의 읽기 능력(독해력)
            측정에 더해 학생의 정서적·심리적 태도, 행동 양상, 사회적 환경 요인까지 포함한
            통합적 문해력을 평가하도록 설계되었습니다.
          </Typography>
          <Typography sx={{ mt: 2, color: "#7C2D12", lineHeight: 1.8 }}>
            다시 말해, 단순한 독해 능력뿐만 아니라 책을 대하는 마음가짐, 선호하는 책의 종류,
            읽기 동기와 목적, 독서 습관 및 환경 등 비인지적 특성을 함께 살펴봅니다. 이를 통해
            학생 개개인의 강점과 약점을 진단하고, 그 결과를 바탕으로 맞춤형 독서 지도를 제공하는
            것이 목적입니다.
          </Typography>
          <Typography sx={{ mt: 2, color: "#7C2D12", lineHeight: 1.8 }}>
            독자성향검사는 효과적인 독서 교육 전략 수립에 활용됩니다. 예를 들어, 검사를 통해
            어떤 학생이 새로운 지식을 얻기 위해 독서하는 경향이 강하다거나, 반대로 주변의 격려에
            의해 독서 습관이 형성되는 유형임을 알 수 있습니다. 이러한 정보를 바탕으로 교사와
            학부모는 학생의 성향에 맞는 독서 프로그램이나 지도 방안을 마련할 수 있습니다.
            나아가 학생 자신도 자신의 독서 성향을 이해함으로써 독서 활동에 대한 동기 부여를 얻고,
            부족한 부분을 인식하여 개선할 수 있습니다.
          </Typography>
        </Paper>

        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          독자성향 유형 분석
        </Typography>

        <Grid container spacing={3}>
          {readerTypes.map((type) => {
            const colors = colorStyles[type.color];
            return (
              <Grid item xs={12} lg={6} key={type.type}>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: colors.accent,
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                      }}
                    >
                      {type.type.charAt(0)}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: colors.text }}>
                        {type.type}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text, opacity: 0.8 }}>
                        {type.subtitle}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography sx={{ color: "#374151", lineHeight: 1.6, mb: 3 }}>
                    {type.description}
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                      분류 근거
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                      {type.characteristics.map((item) => (
                        <Box
                          component="li"
                          key={item}
                          sx={{ mb: 1, color: "#374151", lineHeight: 1.5 }}
                        >
                          {item}
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                      측정 지표 예시
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                      {type.examples.map((item) => (
                        <Box
                          component="li"
                          key={item}
                          sx={{
                            mb: 1,
                            color: "#4B5563",
                            fontStyle: "italic",
                            lineHeight: 1.5,
                          }}
                        >
                          {item}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default ReadingProInfo;
