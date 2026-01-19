/**
 * 시스템 진단 페이지
 * OpenAI API 및 환경 변수 상태 확인
 */
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";

interface DiagnosticResult {
  name: string;
  status: "success" | "error" | "warning";
  message: string;
  details?: string;
}

const DiagnosticsPage: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);

  const runDiagnostics = async () => {
    setTesting(true);
    const diagnosticResults: DiagnosticResult[] = [];

    // 1. 환경 변수 체크
    const hasOpenAIKey = !!import.meta.env.VITE_OPENAI_API_KEY;
    const hasSupabaseUrl = !!import.meta.env.VITE_SUPABASE_URL;
    const hasSupabaseKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;

    diagnosticResults.push({
      name: "OpenAI API Key",
      status: hasOpenAIKey ? "success" : "warning",
      message: hasOpenAIKey
        ? "API 키가 설정되어 있습니다"
        : "API 키가 없습니다 (시뮬레이션 모드로 작동)",
      details: hasOpenAIKey
        ? `키 길이: ${import.meta.env.VITE_OPENAI_API_KEY?.length}자`
        : "VITE_OPENAI_API_KEY 환경 변수를 설정해주세요",
    });

    diagnosticResults.push({
      name: "Supabase URL",
      status: hasSupabaseUrl ? "success" : "error",
      message: hasSupabaseUrl
        ? "Supabase URL이 설정되어 있습니다"
        : "Supabase URL이 없습니다",
      details: hasSupabaseUrl ? import.meta.env.VITE_SUPABASE_URL : undefined,
    });

    diagnosticResults.push({
      name: "Supabase Anon Key",
      status: hasSupabaseKey ? "success" : "error",
      message: hasSupabaseKey
        ? "Supabase 키가 설정되어 있습니다"
        : "Supabase 키가 없습니다",
      details: hasSupabaseKey
        ? `키 길이: ${import.meta.env.VITE_SUPABASE_ANON_KEY?.length}자`
        : undefined,
    });

    // 2. OpenAI API 연결 테스트
    if (hasOpenAIKey) {
      try {
        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-4-turbo-preview",
              messages: [
                {
                  role: "user",
                  content: "테스트입니다. '성공'이라고만 답변해주세요.",
                },
              ],
              max_tokens: 10,
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          diagnosticResults.push({
            name: "OpenAI API 연결",
            status: "success",
            message: "OpenAI API가 정상적으로 작동합니다",
            details: `모델: ${data.model}, 토큰: ${data.usage?.total_tokens}`,
          });
        } else {
          const errorData = await response.json();
          diagnosticResults.push({
            name: "OpenAI API 연결",
            status: "error",
            message: "OpenAI API 연결 실패",
            details: errorData.error?.message || response.statusText,
          });
        }
      } catch (error: any) {
        diagnosticResults.push({
          name: "OpenAI API 연결",
          status: "error",
          message: "OpenAI API 요청 중 오류 발생",
          details: error.message,
        });
      }
    }

    // 3. Supabase 연결 테스트
    if (hasSupabaseUrl && hasSupabaseKey) {
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`, {
          method: "HEAD",
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
          },
        });

        if (response.ok || response.status === 404) {
          // 404도 정상 (엔드포인트가 없지만 연결은 됨)
          diagnosticResults.push({
            name: "Supabase 연결",
            status: "success",
            message: "Supabase 연결이 정상입니다",
            details: `Status: ${response.status}`,
          });
        } else {
          diagnosticResults.push({
            name: "Supabase 연결",
            status: "error",
            message: "Supabase 연결 실패",
            details: `Status: ${response.status} - API 키 또는 URL을 확인하세요`,
          });
        }
      } catch (error: any) {
        diagnosticResults.push({
          name: "Supabase 연결",
          status: "error",
          message: "Supabase 연결 중 오류 발생",
          details: error.message,
        });
      }
    }

    // 4. 환경 정보
    diagnosticResults.push({
      name: "빌드 환경",
      status: "success",
      message: "환경 정보",
      details: `Mode: ${import.meta.env.MODE}, Base URL: ${import.meta.env.BASE_URL}`,
    });

    setResults(diagnosticResults);
    setTesting(false);
  };

  const getStatusIcon = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircleIcon color="success" />;
      case "error":
        return <ErrorIcon color="error" />;
      case "warning":
        return <InfoIcon color="warning" />;
    }
  };

  const getStatusColor = (
    status: DiagnosticResult["status"],
  ): "success" | "error" | "warning" => {
    return status;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        🔍 시스템 진단
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        환경 변수 설정 및 OpenAI API 연결 상태를 확인합니다.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          onClick={runDiagnostics}
          disabled={testing}
          startIcon={testing && <CircularProgress size={20} />}
        >
          {testing ? "진단 중..." : "진단 시작"}
        </Button>
      </Box>

      {results.length > 0 && (
        <Stack spacing={2}>
          {results.map((result, index) => (
            <Card key={index} variant="outlined">
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {getStatusIcon(result.status)}
                    <Typography variant="h6">{result.name}</Typography>
                  </Box>
                  <Chip
                    label={result.status.toUpperCase()}
                    color={getStatusColor(result.status)}
                    size="small"
                  />
                </Box>
                <Typography variant="body1" gutterBottom>
                  {result.message}
                </Typography>
                {result.details && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                      {result.details}
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          {results.some((r) => r.status === "error" || r.status === "warning") && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>⚠️ 환경 변수가 올바르게 설정되지 않았습니다</strong>
                <br />
                <br />
                이 문제는 Vercel 배포 환경에서 환경 변수를 설정하지 않아서 발생합니다.
                <br />
                로컬의 .env 파일은 Git에 커밋되지 않으므로, Vercel Dashboard에서 별도로 설정해야 합니다.
              </Typography>
            </Alert>
          )}

          <Alert severity="info">
            <Typography variant="body2">
              <strong>✅ Vercel 환경 변수 설정 방법:</strong>
              <br />
              <br />
              <strong>1단계: Vercel Dashboard 접속</strong>
              <br />
              • https://vercel.com/dashboard
              <br />
              • 프로젝트 선택 → Settings → Environment Variables
              <br />
              <br />
              <strong>2단계: 다음 변수들 추가</strong>
              <br />
              • VITE_OPENAI_API_KEY (AI 문항 생성용)
              <br />
              • VITE_SUPABASE_URL (데이터베이스 연결)
              <br />
              • VITE_SUPABASE_ANON_KEY (데이터베이스 인증)
              <br />
              • 환경: Production, Preview, Development 모두 선택
              <br />
              <br />
              <strong>3단계: 재배포</strong>
              <br />
              • Deployments → 최신 배포 → Redeploy
              <br />
              • ⚠️ "Use existing Build Cache" 체크 해제 필수!
              <br />
              <br />
              <strong>4단계: 확인</strong>
              <br />
              • 재배포 완료 후 이 페이지에서 다시 진단 시작
              <br />
              <br />
              📚 자세한 내용: 프로젝트 루트의{" "}
              <strong>README_OPENAI_VERCEL.md</strong> 참조
            </Typography>
          </Alert>
        </Box>
      )}
    </Container>
  );
};

export default DiagnosticsPage;
