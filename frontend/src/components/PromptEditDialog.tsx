import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Tabs,
  Tab,
  Divider,
  Alert,
  IconButton,
} from "@mui/material";
import { Close, Save, ContentCopy } from "@mui/icons-material";

interface PromptSection {
  label: string;
  key: string;
  value: string;
  multiline?: boolean;
  rows?: number;
}

interface PromptEditDialogProps {
  open: boolean;
  onClose: () => void;
  promptType: "base" | "area";
  templateName: string;
  sections: PromptSection[];
  onSave: (editedSections: Record<string, string>, saveAsPersonal: boolean, personalName?: string) => void;
}

const PromptEditDialog = ({
  open,
  onClose,
  promptType,
  templateName,
  sections,
  onSave,
}: PromptEditDialogProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [editedSections, setEditedSections] = useState<Record<string, string>>({});
  const [saveAsPersonal, setSaveAsPersonal] = useState(false);
  const [personalName, setPersonalName] = useState("");

  const handleSectionChange = (key: string, value: string) => {
    setEditedSections((prev) => ({ ...prev, [key]: value }));
  };

  const getCurrentValue = (section: PromptSection) => {
    return editedSections[section.key] !== undefined
      ? editedSections[section.key]
      : section.value;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSave = () => {
    onSave(editedSections, saveAsPersonal, personalName);
    onClose();
  };

  const handleReset = () => {
    setEditedSections({});
    setSaveAsPersonal(false);
    setPersonalName("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">
            {promptType === "base" ? "기본 프롬프트" : "영역 프롬프트"} 편집
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {templateName}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 2 }}>
          {sections.map((section) => (
            <Tab key={section.key} label={section.label} />
          ))}
        </Tabs>

        {sections.map((section, idx) => (
          <Box key={section.key} hidden={activeTab !== idx}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {section.label}
              </Typography>
              <Button
                size="small"
                startIcon={<ContentCopy />}
                onClick={() => handleCopy(getCurrentValue(section))}
              >
                복사
              </Button>
            </Box>

            <TextField
              fullWidth
              multiline={section.multiline !== false}
              rows={section.rows || 15}
              value={getCurrentValue(section)}
              onChange={(e) => handleSectionChange(section.key, e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiInputBase-root": {
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                },
              }}
            />

            {editedSections[section.key] && (
              <Alert severity="info" sx={{ mt: 1 }}>
                이 섹션이 수정되었습니다
              </Alert>
            )}
          </Box>
        ))}

        <Divider sx={{ my: 3 }} />

        {/* 개인 프롬프트로 저장 옵션 */}
        <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            개인 프롬프트로 저장
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
            수정한 프롬프트를 개인 프롬프트로 저장하여 나중에 다시 사용할 수 있습니다.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              variant={saveAsPersonal ? "contained" : "outlined"}
              size="small"
              onClick={() => setSaveAsPersonal(!saveAsPersonal)}
            >
              {saveAsPersonal ? "개인 프롬프트로 저장됨" : "개인 프롬프트로 저장"}
            </Button>

            {saveAsPersonal && (
              <TextField
                size="small"
                placeholder="프롬프트 이름 (예: 나만의 독해력 v1)"
                value={personalName}
                onChange={(e) => setPersonalName(e.target.value)}
                sx={{ flex: 1 }}
              />
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleReset} color="inherit">
          초기화
        </Button>
        <Button onClick={onClose}>취소</Button>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={saveAsPersonal && !personalName.trim()}
        >
          적용
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PromptEditDialog;
