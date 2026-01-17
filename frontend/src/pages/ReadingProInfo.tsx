import { Box, Typography, Paper, Button } from "@mui/material";
import { OpenInNew } from "@mui/icons-material";

const ReadingProInfo = () => {
  const openInNewTab = () => {
    window.open("/reports/reading_pro_info.html", "_blank");
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              리딩 PRO 소개
            </Typography>
            <Typography variant="body2" color="text.secondary">
              문해력 진단 및 독자성향검사에 대한 설명입니다.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<OpenInNew />}
            onClick={openInNewTab}
            size="small"
          >
            새 탭에서 열기
          </Button>
        </Box>
      </Paper>

      <Paper
        sx={{
          width: "100%",
          height: "calc(100vh - 250px)",
          minHeight: "600px",
          overflow: "hidden",
          borderRadius: 2,
        }}
      >
        <iframe
          src="/reports/reading_pro_info.html"
          title="리딩 PRO 소개"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      </Paper>
    </Box>
  );
};

export default ReadingProInfo;
