import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Stack,
} from '@mui/material';
import { Add, Remove, Search } from '@mui/icons-material';
import { getAvailableItems } from '../services/diagnosticAssessmentService';

interface SelectedItem {
  draft_item_id: number;
  sequence_number: number;
  points: number;
}

interface ItemSelectorProps {
  gradeBand: string;
  selectedItems: SelectedItem[];
  onSelectionChange: (items: SelectedItem[]) => void;
}

export default function ItemSelector({
  gradeBand,
  selectedItems,
  onSelectionChange,
}: ItemSelectorProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadItems();
  }, [gradeBand]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAvailableItems({ grade_band: gradeBand });
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '문항 로드 실패');
    } finally {
      setLoading(false);
    }
  };

  const isSelected = (draftItemId: number) => {
    return selectedItems.some((item) => item.draft_item_id === draftItemId);
  };

  const handleToggleItem = (item: any) => {
    const draftItemId = item.draft_item_id;

    if (isSelected(draftItemId)) {
      // 선택 해제
      const newItems = selectedItems.filter(
        (si) => si.draft_item_id !== draftItemId
      );
      // 순서 번호 재정렬
      const reorderedItems = newItems.map((si, index) => ({
        ...si,
        sequence_number: index + 1,
      }));
      onSelectionChange(reorderedItems);
    } else {
      // 선택 추가
      const newItem: SelectedItem = {
        draft_item_id: draftItemId,
        sequence_number: selectedItems.length + 1,
        points: 10, // 기본 배점
      };
      onSelectionChange([...selectedItems, newItem]);
    }
  };

  const handlePointsChange = (draftItemId: number, points: number) => {
    const newItems = selectedItems.map((item) =>
      item.draft_item_id === draftItemId ? { ...item, points } : item
    );
    onSelectionChange(newItems);
  };

  const getItemKindLabel = (kind: string) => {
    const labels: Record<string, string> = {
      mcq_single: '객관식(단일)',
      mcq_multiple: '객관식(복수)',
      essay: '서술형',
      short_answer: '단답형',
    };
    return labels[kind] || kind;
  };

  const filteredItems = items.filter((item) => {
    if (!searchTerm) return true;

    const stemText =
      item.current_version?.content_json?.stem?.toLowerCase() || '';
    const stimulusTitle = item.stimuli?.title?.toLowerCase() || '';

    return (
      stemText.includes(searchTerm.toLowerCase()) ||
      stimulusTitle.includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="문항 또는 지문 제목으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          선택된 문항: {selectedItems.length}개
        </Typography>

        {selectedItems.length > 0 && (
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {selectedItems.map((item) => {
              const fullItem = items.find(
                (i) => i.draft_item_id === item.draft_item_id
              );
              if (!fullItem) return null;

              return (
                <Grid item key={item.draft_item_id}>
                  <Chip
                    label={`문항 ${item.sequence_number}`}
                    onDelete={() => handleToggleItem(fullItem)}
                    color="primary"
                    size="small"
                  />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

      <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <Grid container spacing={2}>
          {filteredItems.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="info">
                {searchTerm
                  ? '검색 결과가 없습니다.'
                  : '사용 가능한 문항이 없습니다.'}
              </Alert>
            </Grid>
          ) : (
            filteredItems.map((item) => {
              const selected = isSelected(item.draft_item_id);
              const selectedItem = selectedItems.find(
                (si) => si.draft_item_id === item.draft_item_id
              );

              return (
                <Grid item xs={12} key={item.draft_item_id}>
                  <Card
                    variant={selected ? 'elevation' : 'outlined'}
                    sx={{
                      bgcolor: selected ? 'primary.50' : 'background.paper',
                      borderColor: selected ? 'primary.main' : 'divider',
                      borderWidth: selected ? 2 : 1,
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 2,
                        }}
                      >
                        <Checkbox
                          checked={selected}
                          onChange={() => handleToggleItem(item)}
                          sx={{ mt: -1 }}
                        />

                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                            <Chip
                              label={getItemKindLabel(item.item_kind)}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            {item.stimuli && (
                              <Chip
                                label={item.stimuli.title}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Stack>

                          <Typography
                            variant="body1"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {item.current_version?.content_json?.stem ||
                              '문항 내용 없음'}
                          </Typography>

                          {selected && (
                            <Box sx={{ mt: 2 }}>
                              <TextField
                                size="small"
                                type="number"
                                label="배점"
                                value={selectedItem?.points || 10}
                                onChange={(e) =>
                                  handlePointsChange(
                                    item.draft_item_id,
                                    parseFloat(e.target.value)
                                  )
                                }
                                inputProps={{ min: 0, step: 0.5 }}
                                sx={{ width: 120 }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ ml: 2 }}
                              >
                                순서: {selectedItem?.sequence_number}번
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        <Button
                          size="small"
                          variant={selected ? 'outlined' : 'contained'}
                          color={selected ? 'error' : 'primary'}
                          startIcon={selected ? <Remove /> : <Add />}
                          onClick={() => handleToggleItem(item)}
                        >
                          {selected ? '제거' : '추가'}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          )}
        </Grid>
      </Box>
    </Box>
  );
}
