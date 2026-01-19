import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ArrowBack, Save, Add, Delete } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

interface ItemBank {
  item_id: number;
  item_code: string | null;
  grade_band: string;
  item_type: string;
  stem: string;
  max_score: number;
  difficulty_level: number | null;
  is_active: boolean;
  stimulus_id: number | null;
  created_at: string;
  updated_at: string;
}

interface ItemOption {
  option_id: number;
  item_id: number;
  label: string;
  option_text: string;
  display_order: number;
}

interface ItemOptionScoring {
  option_id: number;
  is_correct: boolean;
  partial_score: number | null;
  rationale_text: string | null;
}

interface ItemKey {
  key_id: number;
  target_type: string;
  target_item_id: number;
  answer_type: string;
  correct_option_ids: number[] | null;
  correct_text: string | null;
}

interface OptionWithScoring extends ItemOption {
  scoring?: ItemOptionScoring;
}

const itemTypeLabels: Record<string, string> = {
  mcq_single: "객관식 (단일)",
  mcq_multi: "객관식 (복수)",
  short_text: "단답형",
  essay: "서술형",
  fill_blank: "빈칸 채우기",
  composite: "복합문항",
  survey: "설문",
};

const gradeBandLabels: Record<string, string> = {
  초저: "초등 저학년",
  초고: "초등 고학년",
  중저: "중등 저학년",
  중고: "중등 고학년",
};

const ItemEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<ItemBank | null>(null);
  const [options, setOptions] = useState<OptionWithScoring[]>([]);
  const [itemKey, setItemKey] = useState<ItemKey | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Edit form state
  const [formData, setFormData] = useState({
    item_code: "",
    grade_band: "",
    item_type: "",
    stem: "",
    max_score: 1,
    difficulty_level: 3,
    is_active: true,
  });

  // Option edit dialog
  const [optionDialogOpen, setOptionDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<OptionWithScoring | null>(
    null,
  );
  const [optionForm, setOptionForm] = useState({
    label: "",
    option_text: "",
    display_order: 0,
    is_correct: false,
    partial_score: 0,
    rationale_text: "",
  });

  useEffect(() => {
    if (id) {
      fetchItemData();
    }
  }, [id]);

  const fetchItemData = async () => {
    if (!supabase || !id) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch item
      const { data: itemData, error: itemError } = await supabase
        .from("item_bank")
        .select("*")
        .eq("item_id", parseInt(id))
        .single();

      if (itemError) throw itemError;
      if (!itemData) throw new Error("문항을 찾을 수 없습니다.");

      setItem(itemData);
      setFormData({
        item_code: itemData.item_code || "",
        grade_band: itemData.grade_band,
        item_type: itemData.item_type,
        stem: itemData.stem,
        max_score: itemData.max_score,
        difficulty_level: itemData.difficulty_level || 3,
        is_active: itemData.is_active,
      });

      // Fetch options with scoring for MCQ types
      if (itemData.item_type?.startsWith("mcq")) {
        const { data: optionsData } = await supabase
          .from("item_options")
          .select("*")
          .eq("item_id", parseInt(id))
          .order("display_order");

        if (optionsData && optionsData.length > 0) {
          const optionIds = optionsData.map((o) => o.option_id);
          const { data: scoringData } = await supabase
            .from("item_option_scoring")
            .select("*")
            .in("option_id", optionIds);

          const optionsWithScoring = optionsData.map((opt) => ({
            ...opt,
            scoring: scoringData?.find((s) => s.option_id === opt.option_id),
          }));

          setOptions(optionsWithScoring);
        }
      }

      // Fetch item key
      const { data: keyData } = await supabase
        .from("item_keys")
        .select("*")
        .eq("target_item_id", parseInt(id))
        .eq("target_type", "item")
        .single();

      if (keyData) {
        setItemKey(keyData);
      }
    } catch (err: any) {
      setError(err.message || "문항 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!supabase || !id) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const { error: updateError } = await supabase
        .from("item_bank")
        .update({
          item_code: formData.item_code || null,
          grade_band: formData.grade_band,
          item_type: formData.item_type,
          stem: formData.stem,
          max_score: formData.max_score,
          difficulty_level: formData.difficulty_level,
          is_active: formData.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("item_id", parseInt(id));

      if (updateError) throw updateError;

      setSuccess("문항이 성공적으로 저장되었습니다.");

      // Refresh data
      await fetchItemData();
    } catch (err: any) {
      setError(err.message || "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenOptionDialog = (option?: OptionWithScoring) => {
    if (option) {
      setEditingOption(option);
      setOptionForm({
        label: option.label,
        option_text: option.option_text,
        display_order: option.display_order,
        is_correct: option.scoring?.is_correct || false,
        partial_score: option.scoring?.partial_score || 0,
        rationale_text: option.scoring?.rationale_text || "",
      });
    } else {
      setEditingOption(null);
      setOptionForm({
        label: String.fromCharCode(65 + options.length), // A, B, C, ...
        option_text: "",
        display_order: options.length + 1,
        is_correct: false,
        partial_score: 0,
        rationale_text: "",
      });
    }
    setOptionDialogOpen(true);
  };

  const handleSaveOption = async () => {
    if (!supabase || !id) return;

    try {
      setSaving(true);
      setError(null);

      if (editingOption) {
        // Update existing option
        const { error: optionError } = await supabase
          .from("item_options")
          .update({
            label: optionForm.label,
            option_text: optionForm.option_text,
            display_order: optionForm.display_order,
          })
          .eq("option_id", editingOption.option_id);

        if (optionError) throw optionError;

        // Update or insert scoring
        if (editingOption.scoring) {
          const { error: scoringError } = await supabase
            .from("item_option_scoring")
            .update({
              is_correct: optionForm.is_correct,
              partial_score: optionForm.partial_score || null,
              rationale_text: optionForm.rationale_text || null,
            })
            .eq("option_id", editingOption.option_id);

          if (scoringError) throw scoringError;
        } else {
          const { error: scoringError } = await supabase
            .from("item_option_scoring")
            .insert({
              option_id: editingOption.option_id,
              is_correct: optionForm.is_correct,
              partial_score: optionForm.partial_score || null,
              rationale_text: optionForm.rationale_text || null,
            });

          if (scoringError) throw scoringError;
        }
      } else {
        // Insert new option
        const { data: newOption, error: optionError } = await supabase
          .from("item_options")
          .insert({
            item_id: parseInt(id),
            label: optionForm.label,
            option_text: optionForm.option_text,
            display_order: optionForm.display_order,
          })
          .select()
          .single();

        if (optionError) throw optionError;

        // Insert scoring
        const { error: scoringError } = await supabase
          .from("item_option_scoring")
          .insert({
            option_id: newOption.option_id,
            is_correct: optionForm.is_correct,
            partial_score: optionForm.partial_score || null,
            rationale_text: optionForm.rationale_text || null,
          });

        if (scoringError) throw scoringError;
      }

      setOptionDialogOpen(false);
      await fetchItemData();
    } catch (err: any) {
      setError(err.message || "선택지 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOption = async (optionId: number) => {
    if (!supabase || !window.confirm("이 선택지를 삭제하시겠습니까?")) return;

    try {
      setSaving(true);
      setError(null);

      // Delete scoring first (foreign key constraint)
      await supabase
        .from("item_option_scoring")
        .delete()
        .eq("option_id", optionId);

      // Delete option
      const { error: deleteError } = await supabase
        .from("item_options")
        .delete()
        .eq("option_id", optionId);

      if (deleteError) throw deleteError;

      await fetchItemData();
    } catch (err: any) {
      setError(err.message || "선택지 삭제에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!item) {
    return (
      <Alert severity="error">
        문항을 찾을 수 없습니다.
        <Button onClick={() => navigate("/question-dev/items")} sx={{ ml: 2 }}>
          목록으로
        </Button>
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                문항 수정
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.item_code || `#${item.item_id}`}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/question-dev/items/${id}`)}
            >
              상세보기
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "저장 중..." : "저장"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      {/* Basic Info Form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          기본 정보
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 3,
          }}
        >
          <TextField
            label="문항 코드"
            value={formData.item_code}
            onChange={(e) =>
              setFormData({ ...formData, item_code: e.target.value })
            }
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>학년군</InputLabel>
            <Select
              value={formData.grade_band}
              label="학년군"
              onChange={(e) =>
                setFormData({ ...formData, grade_band: e.target.value })
              }
            >
              {Object.entries(gradeBandLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>문항 유형</InputLabel>
            <Select
              value={formData.item_type}
              label="문항 유형"
              onChange={(e) =>
                setFormData({ ...formData, item_type: e.target.value })
              }
            >
              {Object.entries(itemTypeLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="배점"
            type="number"
            value={formData.max_score}
            onChange={(e) =>
              setFormData({
                ...formData,
                max_score: parseInt(e.target.value) || 1,
              })
            }
            inputProps={{ min: 1, max: 100 }}
            fullWidth
          />

          <TextField
            label="난이도 (1-5)"
            type="number"
            value={formData.difficulty_level}
            onChange={(e) =>
              setFormData({
                ...formData,
                difficulty_level: parseInt(e.target.value) || 3,
              })
            }
            inputProps={{ min: 1, max: 5 }}
            fullWidth
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
              />
            }
            label="활성화"
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <TextField
            label="문항 내용 (Stem)"
            value={formData.stem}
            onChange={(e) => setFormData({ ...formData, stem: e.target.value })}
            multiline
            rows={4}
            fullWidth
          />
        </Box>
      </Paper>

      {/* Options Section for MCQ */}
      {formData.item_type?.startsWith("mcq") && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              선택지 관리
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => handleOpenOptionDialog()}
              size="small"
            >
              선택지 추가
            </Button>
          </Box>
          <Divider sx={{ mb: 3 }} />

          {options.length === 0 ? (
            <Typography
              color="text.secondary"
              sx={{ textAlign: "center", py: 4 }}
            >
              등록된 선택지가 없습니다.
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.100" }}>
                    <TableCell width={80}>번호</TableCell>
                    <TableCell>내용</TableCell>
                    <TableCell width={100} align="center">
                      정답여부
                    </TableCell>
                    <TableCell width={100} align="center">
                      부분점수
                    </TableCell>
                    <TableCell width={100} align="center">
                      관리
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {options.map((option) => (
                    <TableRow key={option.option_id} hover>
                      <TableCell>
                        <Chip label={option.label} size="small" />
                      </TableCell>
                      <TableCell>{option.option_text}</TableCell>
                      <TableCell align="center">
                        {option.scoring?.is_correct && (
                          <Chip label="정답" size="small" color="success" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {option.scoring?.partial_score ?? "-"}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenOptionDialog(option)}
                        >
                          <Save fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteOption(option.option_id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* Item Key Info */}
      {itemKey && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            정답 정보
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                정답 유형
              </Typography>
              <Typography variant="body1">
                {itemKey.answer_type === "option_ids"
                  ? "선택지 ID"
                  : itemKey.answer_type === "text"
                    ? "텍스트"
                    : itemKey.answer_type}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                정답
              </Typography>
              <Typography variant="body1">
                {itemKey.correct_option_ids
                  ? itemKey.correct_option_ids.join(", ")
                  : itemKey.correct_text || "-"}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Meta Info */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          메타 정보
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              문항 ID
            </Typography>
            <Typography variant="body1">{item.item_id}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              생성일
            </Typography>
            <Typography variant="body1">
              {new Date(item.created_at).toLocaleDateString("ko-KR")}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              수정일
            </Typography>
            <Typography variant="body1">
              {new Date(item.updated_at).toLocaleDateString("ko-KR")}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Option Edit Dialog */}
      <Dialog
        open={optionDialogOpen}
        onClose={() => setOptionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingOption ? "선택지 수정" : "선택지 추가"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="번호 (예: A, B, C)"
              value={optionForm.label}
              onChange={(e) =>
                setOptionForm({ ...optionForm, label: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="선택지 내용"
              value={optionForm.option_text}
              onChange={(e) =>
                setOptionForm({ ...optionForm, option_text: e.target.value })
              }
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="표시 순서"
              type="number"
              value={optionForm.display_order}
              onChange={(e) =>
                setOptionForm({
                  ...optionForm,
                  display_order: parseInt(e.target.value) || 0,
                })
              }
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={optionForm.is_correct}
                  onChange={(e) =>
                    setOptionForm({
                      ...optionForm,
                      is_correct: e.target.checked,
                    })
                  }
                />
              }
              label="정답"
            />
            <TextField
              label="부분 점수"
              type="number"
              value={optionForm.partial_score}
              onChange={(e) =>
                setOptionForm({
                  ...optionForm,
                  partial_score: parseInt(e.target.value) || 0,
                })
              }
              fullWidth
            />
            <TextField
              label="해설"
              value={optionForm.rationale_text}
              onChange={(e) =>
                setOptionForm({ ...optionForm, rationale_text: e.target.value })
              }
              multiline
              rows={2}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOptionDialogOpen(false)}>취소</Button>
          <Button
            variant="contained"
            onClick={handleSaveOption}
            disabled={saving}
          >
            {saving ? "저장 중..." : "저장"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ItemEdit;
