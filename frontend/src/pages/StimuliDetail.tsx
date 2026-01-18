import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Article,
  Image,
  PictureAsPdf,
  CalendarToday,
  TextFields,
  Category,
  School,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

interface Stimulus {
  stimulus_id: number;
  title: string;
  content_type: string;
  content_text: string | null;
  content_url: string | null;
  grade_band: string;
  genre: string | null;
  source: string | null;
  author: string | null;
  word_count: number | null;
  created_at: string;
  updated_at: string;
}

interface LinkedItem {
  item_id: number;
  item_code: string | null;
  item_type: string;
  stem: string;
}

const contentTypeIcons: Record<string, React.ReactNode> = {
  text: <Article sx={{ fontSize: 40 }} />,
  html: <Article sx={{ fontSize: 40 }} />,
  markdown: <Article sx={{ fontSize: 40 }} />,
  image: <Image sx={{ fontSize: 40 }} />,
  pdf: <PictureAsPdf sx={{ fontSize: 40 }} />,
  mixed: <Article sx={{ fontSize: 40 }} />,
};

const contentTypeLabels: Record<string, string> = {
  text: "텍스트",
  html: "HTML",
  markdown: "마크다운",
  image: "이미지",
  table: "표",
  pdf: "PDF",
  mixed: "복합",
};

const gradeBandLabels: Record<string, string> = {
  초저: "초등 저학년",
  초고: "초등 고학년",
  중저: "중등 저학년",
  중고: "중등 고학년",
};

const itemTypeLabels: Record<string, string> = {
  mcq_single: "객관식 (단일)",
  mcq_multi: "객관식 (복수)",
  short_text: "단답형",
  essay: "서술형",
  fill_blank: "빈칸 채우기",
  composite: "복합문항",
  survey: "설문",
};

const StimuliDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [stimulus, setStimulus] = useState<Stimulus | null>(null);
  const [linkedItems, setLinkedItems] = useState<LinkedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchStimulusData();
    }
  }, [id]);

  const fetchStimulusData = async () => {
    if (!supabase || !id) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch stimulus
      const { data: stimulusData, error: stimulusError } = await supabase
        .from("stimuli")
        .select("*")
        .eq("stimulus_id", parseInt(id))
        .single();

      if (stimulusError) throw stimulusError;
      if (!stimulusData) throw new Error("지문을 찾을 수 없습니다.");

      setStimulus(stimulusData);

      // Fetch linked items
      const { data: itemsData } = await supabase
        .from("item_bank")
        .select("item_id, item_code, item_type, stem")
        .eq("stimulus_id", parseInt(id))
        .order("item_id");

      if (itemsData) {
        setLinkedItems(itemsData);
      }
    } catch (err: any) {
      setError(err.message || "지문 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !stimulus) {
    return (
      <Alert severity="error">
        {error || "지문을 찾을 수 없습니다."}
        <Button onClick={() => navigate("/question-dev/stimuli")} sx={{ ml: 2 }}>
          목록으로
        </Button>
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => navigate("/question-dev/stimuli")}>
              <ArrowBack />
            </IconButton>
            <Box sx={{ color: "primary.main" }}>
              {contentTypeIcons[stimulus.content_type] || <Article sx={{ fontSize: 40 }} />}
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {stimulus.title}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                <Chip
                  label={contentTypeLabels[stimulus.content_type] || stimulus.content_type}
                  size="small"
                  color="primary"
                />
                <Chip
                  label={gradeBandLabels[stimulus.grade_band] || stimulus.grade_band}
                  size="small"
                  variant="outlined"
                />
                {stimulus.genre && (
                  <Chip label={stimulus.genre} size="small" variant="outlined" />
                )}
              </Box>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/question-dev/stimuli/${id}/edit`)}
          >
            수정
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              지문 내용
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {stimulus.content_type === "image" && stimulus.content_url ? (
              <Box sx={{ textAlign: "center" }}>
                <img
                  src={stimulus.content_url}
                  alt={stimulus.title}
                  style={{ maxWidth: "100%", maxHeight: 500, objectFit: "contain" }}
                />
              </Box>
            ) : stimulus.content_type === "pdf" && stimulus.content_url ? (
              <Box sx={{ height: 600 }}>
                <iframe
                  src={stimulus.content_url}
                  title={stimulus.title}
                  style={{ width: "100%", height: "100%", border: "none" }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  p: 3,
                  bgcolor: "#f9fafb",
                  borderRadius: 2,
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.8,
                  fontSize: "1rem",
                  maxHeight: 600,
                  overflow: "auto",
                }}
              >
                {stimulus.content_text || "내용이 없습니다."}
              </Box>
            )}
          </Paper>

          {/* Linked Items */}
          {linkedItems.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                연결된 문항 ({linkedItems.length}개)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {linkedItems.map((item) => (
                <Card
                  key={item.item_id}
                  variant="outlined"
                  sx={{ mb: 1, cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}
                  onClick={() => navigate(`/question-dev/items/${item.item_id}`)}
                >
                  <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Chip
                        label={item.item_code || `#${item.item_id}`}
                        size="small"
                        color="primary"
                      />
                      <Chip
                        label={itemTypeLabels[item.item_type] || item.item_type}
                        size="small"
                        variant="outlined"
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.stem}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Paper>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              기본 정보
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <School color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    학년군
                  </Typography>
                  <Typography variant="body2">
                    {gradeBandLabels[stimulus.grade_band] || stimulus.grade_band}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Category color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    장르
                  </Typography>
                  <Typography variant="body2">
                    {stimulus.genre || "-"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextFields color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    글자수
                  </Typography>
                  <Typography variant="body2">
                    {stimulus.word_count ? `${stimulus.word_count}자` : "-"}
                  </Typography>
                </Box>
              </Box>

              {stimulus.source && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    출처
                  </Typography>
                  <Typography variant="body2">{stimulus.source}</Typography>
                </Box>
              )}

              {stimulus.author && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    저자
                  </Typography>
                  <Typography variant="body2">{stimulus.author}</Typography>
                </Box>
              )}
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              메타 정보
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarToday color="action" fontSize="small" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    생성일
                  </Typography>
                  <Typography variant="body2">
                    {new Date(stimulus.created_at).toLocaleDateString("ko-KR")}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarToday color="action" fontSize="small" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    수정일
                  </Typography>
                  <Typography variant="body2">
                    {new Date(stimulus.updated_at).toLocaleDateString("ko-KR")}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  지문 ID
                </Typography>
                <Typography variant="body2">{stimulus.stimulus_id}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StimuliDetail;
