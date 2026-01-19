import { Box, Paper, Typography } from "@mui/material";
import PromptSelector from "../components/PromptSelector";
import { getCurrentUser } from "../utils/session";

const PromptManagement = () => {
  const currentUser = getCurrentUser();

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          프롬프트 관리
        </Typography>
        <Typography variant="body2" color="text.secondary">
          AI 문항 생성에 사용되는 프롬프트를 관리하고 편집할 수 있습니다.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <PromptSelector
          userId={currentUser?.userId}
          onBaseTemplateChange={(template) => {
            console.log("Base template changed:", template);
          }}
          onAreaTemplateChange={(template) => {
            console.log("Area template changed:", template);
          }}
        />
      </Paper>
    </Box>
  );
};

export default PromptManagement;
