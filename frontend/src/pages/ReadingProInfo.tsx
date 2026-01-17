import { Box, Typography, Paper, Grid, Card, CardContent } from "@mui/material";
import { MenuBook, Favorite, Balance, Lightbulb, RecordVoiceOver, People, AutoStories, Extension, Search } from "@mui/icons-material";

const ReadingProInfo = () => {
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {/* 헤더 */}
      <Paper
        sx={{
          background: "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)",
          color: "white",
          p: { xs: 4, md: 6 },
          borderRadius: 3,
          mb: 4,
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          개요
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          문해력 진단 및 독자성향검사
        </Typography>
      </Paper>

      {/* 섹션 1: 문해력 진단 */}
      <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Box
            sx={{
              background: "#667eea",
              color: "white",
              width: 50,
              height: 50,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            1
          </Box>
          <Typography variant="h4" fontWeight="bold">
            문해력 진단
          </Typography>
        </Box>

        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: "#2d3748" }}>
          리딩 PRO 문해력 진단은 무엇을 평가하는가?
        </Typography>

        {/* 3가지 핵심 역량 */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 5 }}>
          <Paper
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)",
              color: "white",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              의사소통 능력
            </Typography>
            <Typography>글을 통해 생각을 표현하고 다른 사람과 상호 작용하는 능력</Typography>
          </Paper>

          <Paper
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #fc8181 0%, #f56565 100%)",
              color: "white",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              심미적 감수성
            </Typography>
            <Typography>문학 작품 등을 감상하며 아름다움이나 의미를 느끼고 공감하는 능력</Typography>
          </Paper>

          <Paper
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #f6e05e 0%, #ecc94b 100%)",
              color: "#2d3748",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              이해력
            </Typography>
            <Typography>글의 내용을 정확히 파악하고 추론하는 능력</Typography>
          </Paper>
        </Box>

        {/* 심미적 감수성 하위 영역 */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: "#2d3748" }}>
          심미적 감수성 하위 영역
        </Typography>

        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ background: "linear-gradient(135deg, #f6e05e 0%, #ecc94b 100%)", height: "100%" }}>
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <MenuBook sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  문학적 표현
                </Typography>
                <Typography>작가의 표현 기법과 언어의 아름다움에 대한 이해</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ background: "linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)", color: "white", height: "100%" }}>
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Favorite sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  정서적 공감
                </Typography>
                <Typography>등장인물의 감정이나 상황에 공감하는 능력</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ background: "linear-gradient(135deg, #fc8181 0%, #f56565 100%)", color: "white", height: "100%" }}>
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Balance sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  문학적 가치
                </Typography>
                <Typography>작품이 담고 있는 주제·의식이나 교훈을 파악하는 능력</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 의사소통 능력 하위 영역 */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: "#2d3748" }}>
          의사소통 능력의 하위 영역
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 5 }}>
          <Paper sx={{ p: 3, background: "#fef5e7", borderLeft: "5px solid #f39c12", borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Lightbulb color="warning" />
              <Typography variant="h6" fontWeight="bold" color="#2d3748">
                창의적 문제 해결
              </Typography>
            </Box>
            <Typography color="#4a5568">텍스트 내용을 응용하여 새로운 해결책을 찾는 능력</Typography>
          </Paper>

          <Paper sx={{ p: 3, background: "#fef9e7", borderLeft: "5px solid #f1c40f", borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <RecordVoiceOver sx={{ color: "#f1c40f" }} />
              <Typography variant="h6" fontWeight="bold" color="#2d3748">
                표현과 전달 능력
              </Typography>
            </Box>
            <Typography color="#4a5568">이해 내용을 정확히 표현하고 전달하는 능력</Typography>
          </Paper>

          <Paper sx={{ p: 3, background: "#e8f8f5", borderLeft: "5px solid #1abc9c", borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <People sx={{ color: "#1abc9c" }} />
              <Typography variant="h6" fontWeight="bold" color="#2d3748">
                사회적 상호작용
              </Typography>
            </Box>
            <Typography color="#4a5568">읽은 내용을 바탕으로 타인과 소통하고 협력하는 능력</Typography>
          </Paper>
        </Box>

        {/* 이해력 하위 영역 */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: "#2d3748" }}>
          이해력의 하위 영역
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Paper sx={{ p: 3, background: "linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%)", borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <AutoStories />
              <Typography variant="h6" fontWeight="bold" color="#2d3748">
                사실적 이해
              </Typography>
            </Box>
            <Typography color="#4a5568">글에 명시된 정보를 이해</Typography>
          </Paper>

          <Paper sx={{ p: 3, background: "linear-gradient(135deg, #ffb3ba 0%, #ff9aa2 100%)", borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Extension />
              <Typography variant="h6" fontWeight="bold" color="#2d3748">
                추론적 이해
              </Typography>
            </Box>
            <Typography color="#4a5568">글에 나타나지 않은 내용을 추론</Typography>
          </Paper>

          <Paper sx={{ p: 3, background: "linear-gradient(135deg, #d4e4f7 0%, #b8d4f1 100%)", borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Search />
              <Typography variant="h6" fontWeight="bold" color="#2d3748">
                비판적 이해
              </Typography>
            </Box>
            <Typography color="#4a5568">글의 내용과 논리를 평가</Typography>
          </Paper>
        </Box>
      </Paper>

      {/* 섹션 2: 독자성향검사 */}
      <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Box
            sx={{
              background: "#667eea",
              color: "white",
              width: 50,
              height: 50,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            2
          </Box>
          <Typography variant="h4" fontWeight="bold">
            독자성향검사
          </Typography>
        </Box>

        <Paper sx={{ p: 4, background: "linear-gradient(135deg, #e3e8f0 0%, #d4dbe8 100%)", borderRadius: 3 }}>
          <Typography sx={{ fontSize: "1.1rem", lineHeight: 2, color: "#2d3748", mb: 3, textAlign: "justify" }}>
            독자성향검사는 학생들의 읽기 태도와 습관, 동기 등을 종합적으로 진단하여 개인별 읽기 성향을 파악하는 평가도구입니다.
            이 검사는 기존의 읽기 능력(독해력) 측정에 더해 학생의 정서적·심리적 태도, 행동 양상, 사회적 환경 요인까지 포함한 통합적 문해력을 평가하도록 설계되었습니다.
          </Typography>
          <Typography sx={{ fontSize: "1.1rem", lineHeight: 2, color: "#2d3748", mb: 3, textAlign: "justify" }}>
            다시 말해, 단순한 독해 능력뿐만 아니라 책을 대하는 마음가짐, 선호하는 책의 종류, 읽기 동기와 목적, 독서 습관 및 환경 등 비인지적 특성을 함께 살펴봅니다.
            이를 통해 학생 개개인의 강점과 약점을 진단하고, 그 결과를 바탕으로 맞춤형 독서 지도를 제공하는 것이 목적입니다.
          </Typography>
          <Typography sx={{ fontSize: "1.1rem", lineHeight: 2, color: "#2d3748", textAlign: "justify" }}>
            독자성향검사는 효과적인 독서 교육 전략 수립에 활용됩니다. 예를 들어, 검사를 통해 어떤 학생이 새로운 지식을 얻기 위해 독서하는 경향이 강하다거나,
            반대로 주변의 권유에 의해 독서 습관이 형성되는 유형임을 알 수 있습니다. 이러한 정보를 바탕으로 교사와 학부모는 학생의 성향에 맞는 독서 프로그램이나 지도 방안을 마련할 수 있습니다.
          </Typography>
        </Paper>
      </Paper>

      {/* 섹션 3: 독자성향유형 */}
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          독자성향유형
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          A~D 유형 설명
        </Typography>

        {/* A 유형 */}
        <Paper sx={{ p: 4, mb: 3, borderRadius: 3, boxShadow: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box sx={{ px: 3, py: 1, borderRadius: 3, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", fontWeight: "bold" }}>
              A 유형
            </Box>
            <Typography color="text.secondary">감성관계 중심 요인 우세</Typography>
          </Box>
          <Paper sx={{ p: 2, background: "#f7fafc", borderRadius: 2, mb: 2 }}>
            <Typography fontWeight="600">A 유형은 정서적 반응 요인과 사회적 동기 요인이 상대적으로 높게 나타난 학생군입니다.</Typography>
          </Paper>
          <Typography variant="subtitle1" fontWeight="bold" color="error" gutterBottom>분류 근거</Typography>
          <Box component="ol" sx={{ pl: 3, mb: 2 }}>
            <li>독서를 재미, 감동, 공감의 활동으로 인식</li>
            <li>타인의 반응(칭찬, 권유, 함께 읽기)이 독서 동기에 크게 작용</li>
            <li>독서 후 느낀 나누기, 이야기 공유에 대한 긍정적 태도</li>
          </Box>
          <Paper sx={{ p: 2, background: "#fef5e7", borderRadius: 2, mb: 2 }}>
            <Typography fontWeight="bold" color="#c27803" gutterBottom>측정 지표 예)</Typography>
            <Typography color="#744210">"책을 읽으면 기분이 좋아진다"</Typography>
            <Typography color="#744210">"가족이나 친구와 책 이야기를 나누는 것이 좋다"</Typography>
            <Typography color="#744210">"누군가 권해 주면 책을 더 잘 읽는다"</Typography>
          </Paper>
          <Paper sx={{ p: 2, background: "#e6fffa", borderLeft: "4px solid #38b2ac", borderRadius: 1 }}>
            <Typography fontWeight="600">→ 정서·관계 기반 독서 동기가 우세할 경우 A 유형으로 분류됩니다.</Typography>
          </Paper>
        </Paper>

        {/* B 유형 */}
        <Paper sx={{ p: 4, mb: 3, borderRadius: 3, boxShadow: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box sx={{ px: 3, py: 1, borderRadius: 3, background: "linear-gradient(135deg, #38b2ac 0%, #2c7a7b 100%)", color: "white", fontWeight: "bold" }}>
              B 유형
            </Box>
            <Typography color="text.secondary">인지·분석 요인 우세</Typography>
          </Box>
          <Paper sx={{ p: 2, background: "#f7fafc", borderRadius: 2, mb: 2 }}>
            <Typography fontWeight="600">B 유형은 정보 처리 요인과 인지적 독서 동기가 두드러진 학생군입니다.</Typography>
          </Paper>
          <Typography variant="subtitle1" fontWeight="bold" color="error" gutterBottom>분류 근거</Typography>
          <Box component="ol" sx={{ pl: 3, mb: 2 }}>
            <li>독서를 지식 습득과 이해의 수단으로 인식</li>
            <li>내용의 사실성, 논리성, 활용 가능성을 중시</li>
            <li>구체적 설명, 실제 사례가 있는 책을 선호</li>
          </Box>
          <Paper sx={{ p: 2, background: "#fef5e7", borderRadius: 2, mb: 2 }}>
            <Typography fontWeight="bold" color="#c27803" gutterBottom>측정 지표 예)</Typography>
            <Typography color="#744210">"책을 읽으며 새로운 정보를 얻고 싶다"</Typography>
            <Typography color="#744210">"읽은 내용을 이해하고 설명할 수 있다"</Typography>
            <Typography color="#744210">"실생활에 도움이 되는 책이 좋다"</Typography>
          </Paper>
          <Paper sx={{ p: 2, background: "#e6fffa", borderLeft: "4px solid #38b2ac", borderRadius: 1 }}>
            <Typography fontWeight="600">→ 분석적·목적 지향적 독서 성향이 강할 경우 B 유형으로 분류됩니다.</Typography>
          </Paper>
        </Paper>

        {/* C 유형 */}
        <Paper sx={{ p: 4, mb: 3, borderRadius: 3, boxShadow: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box sx={{ px: 3, py: 1, borderRadius: 3, background: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)", color: "white", fontWeight: "bold" }}>
              C 유형
            </Box>
            <Typography color="text.secondary">행동·습관 요인 우세</Typography>
          </Box>
          <Paper sx={{ p: 2, background: "#f7fafc", borderRadius: 2, mb: 2 }}>
            <Typography fontWeight="600">C 유형은 독서 실천 행동과 자기조절 요인이 가장 안정적으로 나타난 학생군입니다.</Typography>
          </Paper>
          <Typography variant="subtitle1" fontWeight="bold" color="error" gutterBottom>분류 근거</Typography>
          <Box component="ol" sx={{ pl: 3, mb: 2 }}>
            <li>독서가 생활 습관으로 내면화됨</li>
            <li>외적 통제 없이도 꾸준히 독서를 실천</li>
            <li>독서 시간과 분량에 대한 자기 관리 능력 보유</li>
          </Box>
          <Paper sx={{ p: 2, background: "#fef5e7", borderRadius: 2, mb: 2 }}>
            <Typography fontWeight="bold" color="#c27803" gutterBottom>측정 지표 예)</Typography>
            <Typography color="#744210">"정해진 시간에 책을 읽는 편이다"</Typography>
            <Typography color="#744210">"누가 시키지 않아도 스스로 책을 읽는다"</Typography>
            <Typography color="#744210">"독서를 자주, 꾸준히 한다"</Typography>
          </Paper>
          <Paper sx={{ p: 2, background: "#e6fffa", borderLeft: "4px solid #38b2ac", borderRadius: 1 }}>
            <Typography fontWeight="600">→ 지속성·자율성·실천력이 높을 경우 C 유형으로 분류됩니다.</Typography>
          </Paper>
        </Paper>

        {/* D 유형 */}
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box sx={{ px: 3, py: 1, borderRadius: 3, background: "linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)", color: "white", fontWeight: "bold" }}>
              D 유형
            </Box>
            <Typography color="text.secondary">자율·탐색 요인 우세</Typography>
          </Box>
          <Paper sx={{ p: 2, background: "#f7fafc", borderRadius: 2, mb: 2 }}>
            <Typography fontWeight="600">D 유형은 호기심 기반 동기와 탐색적 독서 요인이 상대적으로 높은 학생군입니다.</Typography>
          </Paper>
          <Typography variant="subtitle1" fontWeight="bold" color="error" gutterBottom>분류 근거</Typography>
          <Box component="ol" sx={{ pl: 3, mb: 2 }}>
            <li>독서 방식이 유연하고 비정형적</li>
            <li>장르와 주제 선택의 폭이 넓음</li>
            <li>필요와 흥미에 따라 독서 강도가 변동</li>
          </Box>
          <Paper sx={{ p: 2, background: "#fef5e7", borderRadius: 2, mb: 2 }}>
            <Typography fontWeight="bold" color="#c27803" gutterBottom>측정 지표 예)</Typography>
            <Typography color="#744210">"관심 있는 주제라면 어떤 책이든 읽어 보고 싶다"</Typography>
            <Typography color="#744210">"여러 종류의 책을 자유롭게 읽는다"</Typography>
            <Typography color="#744210">"읽다가 흥미가 없으면 다른 책을 선택한다"</Typography>
          </Paper>
          <Paper sx={{ p: 2, background: "#e6fffa", borderLeft: "4px solid #38b2ac", borderRadius: 1 }}>
            <Typography fontWeight="600">→ 자율성·창의성·탐색성이 두드러질 경우 D 유형으로 분류됩니다.</Typography>
          </Paper>
        </Paper>
      </Paper>
    </Box>
  );
};

export default ReadingProInfo;
