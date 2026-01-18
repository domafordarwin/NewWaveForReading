import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
} from "@mui/material";
import {
  ExpandMore,
  MenuBook,
  LooksOne,
  LooksTwo,
  Looks3,
  CheckCircle,
  Lightbulb,
  Psychology,
  QuestionAnswer,
  School,
  EmojiObjects,
  Create,
  Explore,
  Build,
  Extension,
  Favorite,
  AutoStories,
  Forum,
  TipsAndUpdates,
} from "@mui/icons-material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ReadingQuestionGuide = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      {/* 헤더 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <MenuBook sx={{ fontSize: 40, color: "primary.main" }} />
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              독서 발문 생성 방법
            </Typography>
            <Typography variant="body2" color="text.secondary">
              효과적인 독서토론을 위한 발문 작성 가이드 | 이야기식 독서토론과 일반 독서발문 작성법
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* 탭 네비게이션 */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab icon={<Forum />} label="이야기식 토론" iconPosition="start" />
          <Tab icon={<QuestionAnswer />} label="질문과 발문" iconPosition="start" />
          <Tab icon={<Create />} label="단계별 작성법" iconPosition="start" />
          <Tab icon={<Psychology />} label="사고력 발문" iconPosition="start" />
          <Tab icon={<School />} label="학습과정별" iconPosition="start" />
          <Tab icon={<AutoStories />} label="실전 예시" iconPosition="start" />
          <Tab icon={<TipsAndUpdates />} label="유의점" iconPosition="start" />
        </Tabs>
      </Paper>

      {/* 탭 1: 이야기식 독서토론 방법 */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Forum color="primary" /> 이야기식 독서토론 특징
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                {[
                  { label: "형식", content: "카페에서 차 한 잔을 놓고 대화를 하는 듯 편한 분위기의 토론", color: "#667eea" },
                  { label: "내용", content: "다양한 주제를 다양한 방법으로 진행하는 재미있는 토론", color: "#764ba2" },
                  { label: "방법", content: "토의를 포괄하는 독서토론으로, 대상 도서를 읽고 소감도 나누고 대안도 모색해보고, 쟁점이 생기면 찬반토론도 진행", color: "#10b981" },
                  { label: "적용", content: "일반화가 가능하고 초/중/고등학교 모든 학교에서 적용 가능", color: "#f59e0b" },
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card variant="outlined" sx={{ height: "100%", borderLeft: `4px solid ${item.color}` }}>
                      <CardContent>
                        <Chip label={item.label} size="small" sx={{ mb: 1, bgcolor: item.color, color: "white" }} />
                        <Typography variant="body2">{item.content}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                토론 방법의 3단계 구성
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                {[
                  { step: 1, icon: <LooksOne />, title: "배경지식 관련 발문", percentage: "20%", description: "대상 도서를 읽지 않아도 쉽게 반응할 수 있는 흥미로운 발문으로 래포를 형성합니다.", color: "#3b82f6" },
                  { step: 2, icon: <LooksTwo />, title: "대상 도서의 내용 관련 발문", percentage: "30%", description: "책을 읽었다면 외우지 않아도 알 수 있는 내용 중심으로 다양한 생각을 나눕니다.", color: "#8b5cf6" },
                  { step: 3, icon: <Looks3 />, title: "인간 삶이나 사회 관련 발문", percentage: "50%", description: "실제로 토론이 이루어질 수 있는 발문으로, 갈등 문제 등으로 찬반이 나뉘거나 다양한 방법을 제시할 수 있는 내용입니다.", color: "#ec4899" },
                ].map((item) => (
                  <Grid item xs={12} md={4} key={item.step}>
                    <Card sx={{ height: "100%", bgcolor: `${item.color}10`, border: `1px solid ${item.color}30` }}>
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ bgcolor: item.color, color: "white", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                              {item.step}
                            </Box>
                            <Typography variant="subtitle1" fontWeight="bold">{item.title}</Typography>
                          </Box>
                          <Chip label={item.percentage} size="small" sx={{ bgcolor: item.color, color: "white", fontWeight: "bold" }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* 탭 2: 질문과 발문의 차이 */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: "100%", borderTop: "4px solid #f59e0b" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "#f59e0b" }}>
                질문 (Question)
              </Typography>
              <Typography variant="body1">
                모르거나 의심나는 점을 물어 대답을 구하는 단순한 질문
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: "100%", borderTop: "4px solid #3b82f6" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "#3b82f6" }}>
                발문 (Inquiry)
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>사전적 의미:</strong> 책의 끝에 본문 내용의 대강이나 간행 관련 사항을 짧게 적은 글
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>교육학적 의미:</strong> 토론 등을 이끄는, 의도를 가지고 하는 질문
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Alert severity="warning" icon={<Lightbulb />} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>발문의 핵심 원칙</Typography>
              <Typography variant="body2">
                독서토론 발문은 정답을 말하도록 물어서는 안 되며, 자신의 생각을 자유롭게 말할 수 있도록 작성해야 합니다.
                단답형이 아닌 다양한 반응(다답형)을 유도하는 발문을 만들어야 하며, 1회성이 아닌 연속적인 발문이 가능하도록 구성해야 합니다.
              </Typography>
            </Alert>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmojiObjects color="primary" /> 연속적 발문의 예시: 해외여행 경험 나누기
              </Typography>
              <Divider sx={{ my: 2 }} />
              <List>
                {[
                  { q: "다녀온 해외여행지 중 기억에 남은 나라는?", a: "라오스" },
                  { q: "그렇게 생각한 이유는?", a: "사람과 자연이 좋아서" },
                  { q: "앞으로 다녀오고 싶은 나라는?", a: "네팔" },
                  { q: "우리나라에 외국 사람들이 오게 하는 전략은?", a: "라오스 + 네팔 + 한국적인 것을 결합" },
                ].map((item, index) => (
                  <ListItem key={index} sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Chip label={`1-${index + 1}`} size="small" color="primary" />
                      <Typography variant="body1" fontWeight="medium">{item.q}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ pl: 5 }}>
                      → 답변: {item.a}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* 탭 3: 단계별 발문 작성 방법 */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {[
              { title: "1단계: 배경지식 관련 발문", content: "대상 도서를 읽지 않아도 토론자들이 쉽게 반응할 수 있는 흥미 있는 발문을 제시합니다. 이 단계의 목적은 래포 형성입니다.", color: "#3b82f6" },
              { title: "2단계: 텍스트 내용 관련 발문", content: "대상 도서를 읽었다면 일부러 외우지 않아도 알 수 있는 내용을 중심으로 발문을 생성합니다. 쉬운 내용 확인하기, 토론자의 생각은?, 왜 그렇게 생각하는가? 등으로 연속적이고 다양한 측면에서 창의성을 발휘할 수 있는 발문을 만듭니다.", color: "#8b5cf6" },
              { title: "3단계: 인간 삶이나 사회 관련 발문", content: "실제로 토론이 이루어질 수 있는 발문이어야 하며, 갈등 문제 등으로 찬반이 나뉘거나 다양한 방법 등을 제시할 수 있는 내용이어야 합니다. 가장 깊이 있는 토론이 이루어지는 단계입니다.", color: "#ec4899" },
            ].map((step, index) => (
              <Paper key={index} sx={{ p: 3, mb: 2, borderLeft: `4px solid ${step.color}` }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: step.color }}>
                  {step.title}
                </Typography>
                <Typography variant="body2">{step.content}</Typography>
              </Paper>
            ))}
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3, bgcolor: "#fef3c7", border: "1px solid #f59e0b" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircle sx={{ color: "#f59e0b" }} /> 독서토론 발문의 핵심 원칙
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {[
                  { label: "연속성", desc: "1회성이 아니라 연속적인 발문이 가능하도록 작성" },
                  { label: "다답형", desc: "단답형이 아니라 다양한 반응을 유도하는 발문" },
                  { label: "개방성", desc: "정답이 정해지지 않은 열린 질문으로 구성" },
                  { label: "심화성", desc: "같은 주제를 점진적으로 심화하거나 확대" },
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                      <CheckCircle sx={{ color: "#f59e0b", fontSize: 20, mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">{item.label}</Typography>
                        <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                폐쇄적 발문 vs 개방적 발문
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: "100%", bgcolor: "#fee2e2", border: "1px solid #fecaca" }}>
                    <CardContent>
                      <Chip label="폐쇄적 발문" sx={{ bgcolor: "#dc2626", color: "white", mb: 2 }} />
                      <Typography variant="body2" paragraph>
                        <strong>인지·기억적 발문:</strong> 기억에 남아 있는 부분을 말하며, 깊은 수준의 사고를 하지 않는 발문. 사실, 공식 등을 단순하게 재생하도록 요구하는 발문입니다.
                      </Typography>
                      <Typography variant="body2">
                        <strong>수렴적 발문:</strong> 주어지거나 기억된 자료의 분석과 종합을 이루게 하며, 번역, 관련, 설명, 결론 도출 등의 정신적 활동을 자극하는 발문입니다.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: "100%", bgcolor: "#dbeafe", border: "1px solid #bfdbfe" }}>
                    <CardContent>
                      <Chip label="개방적 발문" sx={{ bgcolor: "#2563eb", color: "white", mb: 2 }} />
                      <Typography variant="body2" paragraph>
                        <strong>확산적 발문:</strong> 상당한 수준의 사고를 요하는 발문으로, 학습자들은 상상적이고 창의적인 대답을 하게 됩니다.
                      </Typography>
                      <Typography variant="body2">
                        <strong>평가적 발문:</strong> 사실 문제보다 가치의 문제를 다룹니다. 판단을 하는 기준이나 준거를 요구하며, 가치를 판단하고, 비판하고, 의견을 말하게 하는 발문입니다.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* 탭 4: 사고력 훈련을 위한 다양한 발문 */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={2}>
          {[
            { icon: <AutoStories />, title: "이해력 기르기", desc: "책 속의 중요한 사건의 원인, 결과, 동기, 의미 등을 연관 지어 발문합니다.", examples: ["작품에서 가장 중요한 사건은 무엇인가?", "등장인물은 어떤 사람인지 행동이나 태도, 말과 생각을 살펴보고 대답해 보자"], color: "#3b82f6" },
            { icon: <Explore />, title: "비판력 기르기", desc: "책의 내용, 인물, 사건을 대상으로 옳고 그름, 선악을 생각할 수 있는 발문을 합니다.", examples: ["등장인물의 삶은 과연 바람직한지 평가해 보자", "작품의 내용 중에서 바꾸고 싶은 부분이 있다면 어디인가?"], color: "#ef4444" },
            { icon: <Extension />, title: "분석력 기르기", desc: "등장인물의 성격, 역할, 행동들이 글 속에 표현된 부분을 통해 유추해 볼 수 있도록 발문합니다.", examples: ["등장인물을 성격, 역할, 행동, 갈등의 유형으로 나누어 비교해보자", "갈등이 일어나는 부분을 찾고 왜 갈등이 일어났는지 살펴보자"], color: "#8b5cf6" },
            { icon: <EmojiObjects />, title: "상상력·창의력 기르기", desc: "주인공과의 대화 내용을 꾸미거나, 등장인물, 사건, 순서, 결말을 바꾸었을 때 내용을 예상하도록 발문합니다.", examples: ["주인공을 인터뷰한다면 어떤 질문을 할 것인가?", "뒷이야기를 상상해 보자"], color: "#f59e0b" },
            { icon: <Create />, title: "표현 능력 기르기", desc: "아름다운 표현, 잘된 문장을 찾을 수 있도록 발문합니다.", examples: ["이야기를 다른 장르(극본, 시, 노래 등)로 바꾸어 보자", "기억하고 싶은 멋진 문장이나 표현을 메모하여 발표해 보자"], color: "#10b981" },
            { icon: <Explore />, title: "경험 넓히기", desc: "책 내용과 비슷한 자신의 경험을 이야기하거나, 새롭게 알게 된 점을 발표할 수 있도록 발문합니다.", examples: ["책 속의 줄거리나 사건과 비슷한 경험이 있다면 발표해 보자", "새롭게 알게 된 점을 발표해 보자"], color: "#06b6d4" },
            { icon: <Build />, title: "문제 해결 능력 기르기", desc: "비슷한 사건을 경험한다면 어떻게 대처할 것이며, 다른 방법으로 문제를 해결할 대안을 제시하도록 발문합니다.", examples: ["책 속의 사건을 만약 내가 겪게 된다면 어떻게 대처할 것인가?", "주인공의 문제 해결 방법에 대해 어떻게 생각하며, 나라면 어떻게 해결할 것인가?"], color: "#ec4899" },
            { icon: <Psychology />, title: "종합 구성 능력 기르기", desc: "책 내용을 도표로 만들거나, 인물연대기, 인생 곡선 등을 작성하여 발표하도록 발문합니다.", examples: ["도서의 내용을 도표로 만들어 발표해 보자", "위인전을 읽고 인물연대기를 만들어 발표해 보자"], color: "#6366f1" },
            { icon: <Favorite />, title: "가치관 가꾸기", desc: "책 내용, 등장인물, 사건이 주는 교훈을 찾고, 인생관, 세계관, 윤리성과 관계되는 내용을 찾도록 발문합니다.", examples: ["등장인물을 통해 얻을 수 있는 교훈은 무엇인가?", "나의 생활에 적용하고 싶은 점은 무엇인지 발표해 보자"], color: "#14b8a6" },
          ].map((item, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card sx={{ height: "100%", borderTop: `4px solid ${item.color}` }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Box sx={{ color: item.color }}>{item.icon}</Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {index + 1}. {item.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.desc}
                  </Typography>
                  <Box sx={{ bgcolor: "#f9fafb", p: 1.5, borderRadius: 1 }}>
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">예시 발문:</Typography>
                    {item.examples.map((ex, i) => (
                      <Typography key={i} variant="body2" sx={{ mt: 0.5 }}>• {ex}</Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* 탭 5: 학습과정에 따른 단계별 발문 */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          {[
            {
              title: "도입 과정",
              purpose: "학습 동기 유발",
              content: "다양한 관심과 경험을 끌어내기 위한 개방적 질문을 합니다. 학습자의 생활 및 경험과 관련이 있는 발문, 놀이 형식의 발문, 행동으로 흥미를 유발하는 발문 등을 활용합니다.",
              examples: ["끝말잇기 놀이를 해볼까요?", "말과 관련된 속담이나 관용어를 발표해 보세요"],
              color: "#f59e0b",
              bgcolor: "#fef3c7"
            },
            {
              title: "전개 과정",
              purpose: "학습 목표 확인 및 탐색",
              content: "수렴적인 발문을 사용하여 학습 목표를 명료화합니다. 지식을 비교, 대조, 분석, 종합해서 대답할 수 있도록 하는 추론적 발문을 하며, 문제의 탐색과 해결 방안을 강구하는 발문으로 창의적인 문제 해결방식을 탐색합니다.",
              examples: ["성역할에 따라 여성들이 많이 갖는 직업과 남성들이 많이 갖는 직업은 무엇인가요?", "성역할에 따라 직업을 나누는 것은 차별인가요? 차이를 인정하는 것인가요?"],
              color: "#3b82f6",
              bgcolor: "#dbeafe"
            },
            {
              title: "정리 과정",
              purpose: "내면화 및 행동 변화 촉구",
              content: "토론(토의)한 내용을 내면화하고, 행동 변화를 촉구하며, 가치 기준으로 삼을 수 있도록 발문을 합니다.",
              examples: ["아름답고 소중한 우리말을 가꾸고 되살리기 위해서는 어떤 노력이 필요할까요?", "양성평등을 위해서 우리가 할 수 있는 일은 무엇인지 발표해 보세요"],
              color: "#10b981",
              bgcolor: "#d1fae5"
            },
          ].map((stage, index) => (
            <Grid item xs={12} key={index}>
              <Paper sx={{ p: 3, bgcolor: stage.bgcolor, border: `1px solid ${stage.color}30` }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Chip label={stage.title} sx={{ bgcolor: stage.color, color: "white", fontWeight: "bold" }} />
                  <Typography variant="body2" color="text.secondary">
                    목적: <strong>{stage.purpose}</strong>
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>{stage.content}</Typography>
                <Box sx={{ bgcolor: "white", p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" fontWeight="bold" color="text.secondary">예시:</Typography>
                  {stage.examples.map((ex, i) => (
                    <Typography key={i} variant="body2" sx={{ mt: 0.5 }}>• {ex}</Typography>
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* 탭 6: 실전 예시 */}
      <TabPanel value={tabValue} index={5}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              이야기식 독서토론 발문 전체 예시
            </Typography>
            <Chip label="대상 도서: 「완득이」 (김려령, 창비)" color="primary" sx={{ mt: 1 }} />
          </Box>

          {[
            {
              stage: "1단계: 배경지식 관련 발문 (20%)",
              color: "#3b82f6",
              questions: [
                { num: "1-1", q: "여러분의 가족 구성원을 소개해 봅시다." },
                { num: "1-2", q: "만약 여러분 가족에 다른 사람이 들어와서 함께 지내게 된다면 어떤 점들이 불편할까요?" },
                { num: "2-1", q: "여러분이 지금까지 성장하는데 가장 영향을 많이 미친 사람은 누구인가요?" },
                { num: "2-2", q: "사춘기를 잘 넘기고 바람직한 어른이 되기 위해서는 어떤 조건들이 필요한가요?" },
              ]
            },
            {
              stage: "2단계: 텍스트 내용 관련 발문 (30%)",
              color: "#8b5cf6",
              questions: [
                { num: "1-1", q: "완득이는 어떻게 하여 학교에서 수급대상자가 되었나요?" },
                { num: "1-2", q: "본인은 가만히 있는데 담임선생님이 학생의 형편을 고려하여 수급대상자로 신청하는 것에 대하여 어떻게 생각하나요?" },
                { num: "2-1", q: "싸움에서 2등이라면 섭섭해 할 정도로 탁월한 능력을 지닌 완득이가 이런 능력을 원 없이 발휘하는 때는 언제인지 여러 가지 예를 들어 봅시다." },
                { num: "3-1", q: "완득이와 윤하는 어떻게 하여 가까이 지내게 되었나요?" },
              ]
            },
            {
              stage: "3단계: 인간 삶과 사회 관련 발문 (50%)",
              color: "#ec4899",
              questions: [
                { num: "1-1", q: "완득이가 어머니의 신발을 사주기 위해 신발 가게에 갔는데 가게 주인은 베트남 엄마를 '저짝 사람'이라고 표현하였다. 이 말에 담긴 의미를 다양하게 해석해 봅시다." },
                { num: "1-2", q: "국제결혼이나 외국인 노동자의 유입으로 다문화 가정이 늘고 있다. 현재 다문화 가정을 위한 지원책을 살펴보고 보완해야 할 점이 있다면 무엇인지 발표해 봅시다." },
                { num: "2-1", q: "사회적 약자란 무엇을 말하나요?" },
                { num: "3-1", q: "완득이가 어려운 환경 속에서도 탈선하지 않고 자신의 정체성을 찾은 이유가 무엇인지 발표해 봅시다." },
              ]
            },
          ].map((section, sIndex) => (
            <Accordion key={sIndex} defaultExpanded={sIndex === 0}>
              <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: `${section.color}10` }}>
                <Typography fontWeight="bold" sx={{ color: section.color }}>{section.stage}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {section.questions.map((item, qIndex) => (
                    <ListItem key={qIndex}>
                      <ListItemIcon>
                        <Chip label={item.num} size="small" sx={{ bgcolor: section.color, color: "white" }} />
                      </ListItemIcon>
                      <ListItemText primary={item.q} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </TabPanel>

      {/* 탭 7: 발문 작성 시 유의점 */}
      <TabPanel value={tabValue} index={6}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, bgcolor: "#fce7f3", border: "1px solid #ec4899" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TipsAndUpdates sx={{ color: "#ec4899" }} /> 효과적인 발문을 위한 핵심 가이드
              </Typography>
              <Divider sx={{ my: 2 }} />
              <List>
                {[
                  "책 선정에 심혈을 기울이고, 아이의 연령을 고려하여 너무 어렵지 않은 책을 선정합니다",
                  "교사의 마음에 울림이 있는 책은 아이들에게도 울림이 있을 가능성이 높습니다",
                  "책을 꼼꼼하게 읽고, 해당 도서를 통해 학습자들과 나누고자 하는 메시지를 생각해야 합니다",
                  "책이 주는 감동이나 깨달음, 마음에 깊이 남은 구절, 세상과의 연계 등을 체크하고 고민합니다",
                  "토론의 질은 발문을 만드는 이가 세상을 바라보는 관점과 무관하지 않으므로, 평소 자신의 삶과 생각을 잘 가꾸어야 합니다",
                  "연속적인 발문이 가능하도록 예상 답변을 고려하여 같은 주제를 심화하거나 확대하는 발문을 만듭니다",
                  "구체적인 정보를 외워서 말해야 하는 단답형 문제를 지양하고 다양한 답을 말할 수 있는 문항을 구성합니다",
                  "책을 읽어오지 않았더라도 소외되지 않고 토론의 흐름을 보고 어느 정도 자신의 생각을 말할 수 있도록 구성합니다",
                ].map((tip, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: "#ec4899" }} />
                    </ListItemIcon>
                    <ListItemText primary={tip} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Alert severity="info" icon={<School />}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>학생 주도적 발문 작성</Typography>
              <Typography variant="body2">
                초등 고학년이나 중등 이상의 학생이라면 발문을 만들어가는 일도 학생 주도적으로 할 수 있습니다.
                학생에게 단계를 자세히 설명한 후 단계별로 발문을 작성하게 하여 모으거나, 팀별로 발문을 정리해 오도록 하는 방법도 효과적입니다.
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default ReadingQuestionGuide;
