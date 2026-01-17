import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Button,
} from "@mui/material";
import { OpenInNew, School, ChildCare } from "@mui/icons-material";

interface ReportSampleProps {
  type: "student" | "parent" | "school" | "teacher";
}

const reportConfig = {
  student: {
    title: "학생 보고서 샘플",
    description: "학생용 독서 능력 진단 결과 보고서입니다.",
    reports: [
      { label: "초등학생용", value: "element", icon: <ChildCare /> },
      { label: "중학생용", value: "middle", icon: <School /> },
    ],
  },
  parent: {
    title: "학부모 보고서 샘플",
    description: "학부모용 자녀 독서 능력 진단 결과 보고서입니다.",
    reports: [{ label: "학부모용", value: "parent", icon: null }],
  },
  school: {
    title: "학교 보고서 샘플",
    description: "학교 관리자용 학교 전체 독서 능력 진단 결과 보고서입니다.",
    reports: [{ label: "학교용", value: "school", icon: null }],
  },
  teacher: {
    title: "교사 보고서 샘플",
    description: "담당 교사용 학급 독서 능력 진단 결과 보고서입니다.",
    reports: [{ label: "교사용", value: "teacher", icon: null }],
  },
};

const ReportSample = ({ type }: ReportSampleProps) => {
  const config = reportConfig[type];
  const [selectedReport, setSelectedReport] = useState(config.reports[0].value);

  const getReportUrl = (reportValue: string) => {
    return `/reports/report_for_${reportValue}.html`;
  };

  const handleReportChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: string | null
  ) => {
    if (newValue !== null) {
      setSelectedReport(newValue);
    }
  };

  const openInNewTab = () => {
    window.open(getReportUrl(selectedReport), "_blank");
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
              {config.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {config.description}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {config.reports.length > 1 && (
              <ToggleButtonGroup
                value={selectedReport}
                exclusive
                onChange={handleReportChange}
                size="small"
              >
                {config.reports.map((report) => (
                  <ToggleButton key={report.value} value={report.value}>
                    {report.icon && (
                      <Box component="span" sx={{ mr: 0.5, display: "flex" }}>
                        {report.icon}
                      </Box>
                    )}
                    {report.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            )}
            <Button
              variant="outlined"
              startIcon={<OpenInNew />}
              onClick={openInNewTab}
              size="small"
            >
              새 탭에서 열기
            </Button>
          </Box>
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
          src={getReportUrl(selectedReport)}
          title={config.title}
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

export default ReportSample;
