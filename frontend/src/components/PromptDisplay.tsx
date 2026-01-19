import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Button,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  Edit,
  ContentCopy,
  Star,
  StarBorder,
} from "@mui/icons-material";
import { useState } from "react";

interface PromptSection {
  title: string;
  content: string;
  color?: string;
}

interface PromptDisplayProps {
  title: string;
  subtitle?: string;
  sections: PromptSection[];
  onEdit?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  defaultExpanded?: boolean;
  showEditButton?: boolean;
}

const PromptDisplay = ({
  title,
  subtitle,
  sections,
  onEdit,
  onFavorite,
  isFavorite = false,
  defaultExpanded = false,
  showEditButton = true,
}: PromptDisplayProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleCopySection = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleCopyAll = () => {
    const fullText = sections.map((s) => `## ${s.title}\n${s.content}`).join("\n\n");
    navigator.clipboard.writeText(fullText);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 2,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* 헤더 */}
      <Box
        sx={{
          p: 2,
          bgcolor: "grey.50",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {title}
            </Typography>
            <Chip label={sections.length + "개 섹션"} size="small" />
          </Box>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {onFavorite && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
            >
              {isFavorite ? (
                <Star fontSize="small" color="warning" />
              ) : (
                <StarBorder fontSize="small" />
              )}
            </IconButton>
          )}

          {showEditButton && onEdit && (
            <Button
              size="small"
              startIcon={<Edit />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              variant="outlined"
            >
              편집
            </Button>
          )}

          <Button
            size="small"
            startIcon={<ContentCopy />}
            onClick={(e) => {
              e.stopPropagation();
              handleCopyAll();
            }}
            variant="text"
          >
            전체 복사
          </Button>

          <IconButton size="small">
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      {/* 내용 */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          {sections.map((section, index) => (
            <Box key={index} sx={{ mb: index < sections.length - 1 ? 3 : 0 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{
                      color: section.color || "primary.main",
                    }}
                  >
                    {section.title}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => handleCopySection(section.content)}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Box>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: "grey.50",
                  maxHeight: 300,
                  overflow: "auto",
                }}
              >
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "0.813rem",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    m: 0,
                  }}
                >
                  {section.content}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default PromptDisplay;
