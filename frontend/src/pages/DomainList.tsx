import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  ExpandMore,
  Category,
} from "@mui/icons-material";
import { supabase } from "../services/supabaseClient";

interface Domain {
  domain_id: number;
  code: string;
  name: string;
  domain_type: string;
  parent_domain_id: number | null;
  description: string | null;
  display_order: number;
}

const DomainList = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        setDomains([]);
        return;
      }
      const { data, error } = await supabase
        .from("domains")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setDomains(data || []);
    } catch (err: any) {
      setError(err.message || "영역 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 계층 구조로 그룹화
  const mainDomains = domains.filter((d) => d.domain_type === "literacy_main");
  const subDomains = domains.filter((d) => d.domain_type === "literacy_sub");
  const dispositionTypes = domains.filter((d) => d.domain_type === "disposition_type");

  const getSubDomains = (parentId: number) => {
    return subDomains.filter((d) => d.parent_domain_id === parentId);
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          평가 영역 관리
        </Typography>
        <Typography variant="body2" color="text.secondary">
          문해력 진단 및 독자성향검사의 평가 영역 체계입니다.
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* 문해력 영역 */}
          <Paper sx={{ mb: 3 }}>
            <Box sx={{ p: 2, bgcolor: "primary.main", color: "white", borderRadius: "4px 4px 0 0" }}>
              <Typography variant="h6" fontWeight="bold">
                📚 문해력 진단 영역
              </Typography>
            </Box>
            {mainDomains.map((main) => (
              <Accordion key={main.domain_id} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Chip
                      label={main.name}
                      color="primary"
                      sx={{ fontWeight: "bold" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {main.description}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {getSubDomains(main.domain_id).map((sub) => (
                      <ListItem key={sub.domain_id}>
                        <ListItemIcon>
                          <Category color="info" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography fontWeight="medium">{sub.name}</Typography>
                              <Chip label={sub.code} size="small" variant="outlined" />
                            </Box>
                          }
                          secondary={sub.description}
                        />
                      </ListItem>
                    ))}
                    {getSubDomains(main.domain_id).length === 0 && (
                      <ListItem>
                        <ListItemText
                          secondary="하위 영역이 없습니다."
                          sx={{ color: "text.secondary" }}
                        />
                      </ListItem>
                    )}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>

          {/* 독자성향 유형 */}
          <Paper>
            <Box sx={{ p: 2, bgcolor: "secondary.main", color: "white", borderRadius: "4px 4px 0 0" }}>
              <Typography variant="h6" fontWeight="bold">
                📖 독자성향 유형
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.100" }}>
                    <TableCell>유형</TableCell>
                    <TableCell>코드</TableCell>
                    <TableCell>설명</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dispositionTypes.map((type) => (
                    <TableRow key={type.domain_id} hover>
                      <TableCell>
                        <Chip
                          label={type.name}
                          color="secondary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {type.code}
                        </Typography>
                      </TableCell>
                      <TableCell>{type.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* 요약 통계 */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              영역 현황
            </Typography>
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {mainDomains.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  문해력 대분류
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="info.main">
                  {subDomains.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  문해력 소분류
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="secondary">
                  {dispositionTypes.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  독자성향 유형
                </Typography>
              </Box>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default DomainList;
