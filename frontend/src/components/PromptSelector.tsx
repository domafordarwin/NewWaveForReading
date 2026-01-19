import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Alert,
  Divider,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Chip,
} from "@mui/material";
import { Star, StarBorder, Delete } from "@mui/icons-material";
import PromptDisplay from "./PromptDisplay";
import PromptEditDialog from "./PromptEditDialog";
import { supabase } from "../services/supabaseClient";

interface BaseTemplate {
  base_template_id: string;
  template_name: string;
  template_code: string;
  persona_text: string;
  input_schema_text: string;
  task_text: string;
  quality_rules_text: string;
  output_format_text: string;
  self_check_text: string;
  version: number;
}

interface AreaTemplate {
  area_template_id: string;
  area_code: string;
  area_name: string;
  area_description: string;
  objective_text: string;
  guidelines_text: string;
  example_patterns: string;
  display_order: number;
}

interface PersonalPrompt {
  favorite_id: string;
  favorite_name: string;
  base_template_id?: string;
  area_template_id?: string;
  custom_overrides: Record<string, string>;
  created_at: string;
}

interface PromptSelectorProps {
  userId?: number;
  onBaseTemplateChange?: (template: BaseTemplate | null) => void;
  onAreaTemplateChange?: (template: AreaTemplate | null) => void;
}

const PromptSelector = ({
  userId,
  onBaseTemplateChange,
  onAreaTemplateChange,
}: PromptSelectorProps) => {
  const [baseTemplates, setBaseTemplates] = useState<BaseTemplate[]>([]);
  const [areaTemplates, setAreaTemplates] = useState<AreaTemplate[]>([]);
  const [personalPrompts, setPersonalPrompts] = useState<PersonalPrompt[]>([]);

  const [selectedBase, setSelectedBase] = useState<BaseTemplate | null>(null);
  const [selectedArea, setSelectedArea] = useState<AreaTemplate | null>(null);

  const [baseEditOpen, setBaseEditOpen] = useState(false);
  const [areaEditOpen, setAreaEditOpen] = useState(false);

  const [favoriteAreas, setFavoriteAreas] = useState<string[]>([]);

  useEffect(() => {
    fetchTemplates();
    if (userId) {
      fetchPersonalPrompts();
    }
  }, [userId]);

  const fetchTemplates = async () => {
    if (!supabase) return;

    try {
      const { data: bases } = await supabase
        .from("prompt_base_templates")
        .select("*")
        .eq("is_active", true)
        .order("version", { ascending: false });

      const { data: areas } = await supabase
        .from("prompt_area_templates")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (bases && bases.length > 0) {
        setBaseTemplates(bases);
        setSelectedBase(bases[0]);
        onBaseTemplateChange?.(bases[0]);
      }

      if (areas) {
        setAreaTemplates(areas);
        if (areas.length > 0) {
          setSelectedArea(areas[0]);
          onAreaTemplateChange?.(areas[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    }
  };

  const fetchPersonalPrompts = async () => {
    if (!supabase || !userId) return;

    try {
      const { data } = await supabase
        .from("prompt_user_favorites")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (data) {
        setPersonalPrompts(data);
      }
    } catch (error) {
      console.error("Failed to fetch personal prompts:", error);
    }
  };

  const handleSavePersonalPrompt = async (
    templateType: "base" | "area",
    templateId: string,
    overrides: Record<string, string>,
    personalName: string
  ) => {
    if (!supabase || !userId) return;

    try {
      const insertData: any = {
        user_id: userId,
        favorite_name: personalName,
        custom_overrides: overrides,
      };

      if (templateType === "base") {
        insertData.base_template_id = templateId;
      } else {
        insertData.area_template_id = templateId;
      }

      await supabase.from("prompt_user_favorites").insert([insertData]);

      fetchPersonalPrompts();
    } catch (error) {
      console.error("Failed to save personal prompt:", error);
    }
  };

  const handleDeletePersonalPrompt = async (favoriteId: string) => {
    if (!supabase) return;

    try {
      await supabase
        .from("prompt_user_favorites")
        .delete()
        .eq("favorite_id", favoriteId);

      fetchPersonalPrompts();
    } catch (error) {
      console.error("Failed to delete personal prompt:", error);
    }
  };

  const toggleFavoriteArea = (areaCode: string) => {
    setFavoriteAreas((prev) =>
      prev.includes(areaCode)
        ? prev.filter((c) => c !== areaCode)
        : [...prev, areaCode]
    );
  };

  return (
    <Box>
      {/* 기본 프롬프트 */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        기본 프롬프트
      </Typography>

      {baseTemplates.length > 0 ? (
        <>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <Select
              value={selectedBase?.base_template_id || ""}
              onChange={(e) => {
                const template = baseTemplates.find(
                  (t) => t.base_template_id === e.target.value
                );
                setSelectedBase(template || null);
                onBaseTemplateChange?.(template || null);
              }}
            >
              {baseTemplates.map((template) => (
                <MenuItem
                  key={template.base_template_id}
                  value={template.base_template_id}
                >
                  {template.template_name} (v{template.version})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedBase && (
            <PromptDisplay
              title={selectedBase.template_name}
              subtitle={`버전 ${selectedBase.version} • ${selectedBase.template_code}`}
              sections={[
                {
                  title: "페르소나",
                  content: selectedBase.persona_text,
                  color: "primary.main",
                },
                {
                  title: "입력 스키마",
                  content: selectedBase.input_schema_text,
                  color: "secondary.main",
                },
                {
                  title: "작업 지시",
                  content: selectedBase.task_text,
                  color: "success.main",
                },
                {
                  title: "품질 규칙",
                  content: selectedBase.quality_rules_text,
                  color: "warning.main",
                },
                {
                  title: "출력 형식",
                  content: selectedBase.output_format_text,
                  color: "info.main",
                },
                {
                  title: "자체 점검",
                  content: selectedBase.self_check_text,
                  color: "error.main",
                },
              ]}
              onEdit={() => setBaseEditOpen(true)}
              showEditButton={true}
            />
          )}
        </>
      ) : (
        <Alert severity="info">기본 프롬프트를 불러오는 중...</Alert>
      )}

      <Divider sx={{ my: 4 }} />

      {/* 영역 프롬프트 */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        영역 프롬프트
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        {areaTemplates.map((template) => (
          <Card
            key={template.area_template_id}
            variant="outlined"
            sx={{
              minWidth: 200,
              cursor: "pointer",
              bgcolor:
                selectedArea?.area_template_id === template.area_template_id
                  ? "primary.50"
                  : "transparent",
              borderColor:
                selectedArea?.area_template_id === template.area_template_id
                  ? "primary.main"
                  : "divider",
              borderWidth: 2,
            }}
            onClick={() => {
              setSelectedArea(template);
              onAreaTemplateChange?.(template);
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {template.area_name}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteArea(template.area_code);
                  }}
                >
                  {favoriteAreas.includes(template.area_code) ? (
                    <Star fontSize="small" color="warning" />
                  ) : (
                    <StarBorder fontSize="small" />
                  )}
                </IconButton>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {template.area_description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {selectedArea && (
        <PromptDisplay
          title={selectedArea.area_name}
          subtitle={selectedArea.area_code}
          sections={[
            {
              title: "목표",
              content: selectedArea.objective_text,
              color: "primary.main",
            },
            {
              title: "설계 지침",
              content: selectedArea.guidelines_text,
              color: "secondary.main",
            },
            ...(selectedArea.example_patterns
              ? [
                  {
                    title: "예시 패턴",
                    content: selectedArea.example_patterns,
                    color: "success.main",
                  },
                ]
              : []),
          ]}
          onEdit={() => setAreaEditOpen(true)}
          isFavorite={favoriteAreas.includes(selectedArea.area_code)}
          onFavorite={() => toggleFavoriteArea(selectedArea.area_code)}
          showEditButton={true}
        />
      )}

      {/* 개인 프롬프트 목록 */}
      {personalPrompts.length > 0 && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            개인 프롬프트
          </Typography>
          <List>
            {personalPrompts.map((prompt) => (
              <ListItem
                key={prompt.favorite_id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleDeletePersonalPrompt(prompt.favorite_id)}
                  >
                    <Delete />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemButton>
                  <ListItemIcon>
                    <Star color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary={prompt.favorite_name}
                    secondary={new Date(prompt.created_at).toLocaleDateString()}
                  />
                  <Chip
                    label={Object.keys(prompt.custom_overrides).length + "개 수정"}
                    size="small"
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}

      {/* 편집 다이얼로그 */}
      {selectedBase && (
        <PromptEditDialog
          open={baseEditOpen}
          onClose={() => setBaseEditOpen(false)}
          promptType="base"
          templateName={selectedBase.template_name}
          sections={[
            {
              label: "페르소나",
              key: "persona_text",
              value: selectedBase.persona_text,
            },
            {
              label: "입력 스키마",
              key: "input_schema_text",
              value: selectedBase.input_schema_text,
            },
            {
              label: "작업 지시",
              key: "task_text",
              value: selectedBase.task_text,
            },
            {
              label: "품질 규칙",
              key: "quality_rules_text",
              value: selectedBase.quality_rules_text,
            },
            {
              label: "출력 형식",
              key: "output_format_text",
              value: selectedBase.output_format_text,
            },
            {
              label: "자체 점검",
              key: "self_check_text",
              value: selectedBase.self_check_text,
            },
          ]}
          onSave={(overrides, saveAsPersonal, personalName) => {
            if (saveAsPersonal && personalName) {
              handleSavePersonalPrompt(
                "base",
                selectedBase.base_template_id,
                overrides,
                personalName
              );
            }
            // TODO: Apply overrides to current session
          }}
        />
      )}

      {selectedArea && (
        <PromptEditDialog
          open={areaEditOpen}
          onClose={() => setAreaEditOpen(false)}
          promptType="area"
          templateName={selectedArea.area_name}
          sections={[
            {
              label: "목표",
              key: "objective_text",
              value: selectedArea.objective_text,
            },
            {
              label: "설계 지침",
              key: "guidelines_text",
              value: selectedArea.guidelines_text,
            },
            ...(selectedArea.example_patterns
              ? [
                  {
                    label: "예시 패턴",
                    key: "example_patterns",
                    value: selectedArea.example_patterns,
                  },
                ]
              : []),
          ]}
          onSave={(overrides, saveAsPersonal, personalName) => {
            if (saveAsPersonal && personalName) {
              handleSavePersonalPrompt(
                "area",
                selectedArea.area_template_id,
                overrides,
                personalName
              );
            }
            // TODO: Apply overrides to current session
          }}
        />
      )}
    </Box>
  );
};

export default PromptSelector;
