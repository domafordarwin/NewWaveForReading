import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { School } from "@mui/icons-material";
import { useSupabase } from "../services/supabaseClient";

interface ClassInfo {
  class_id: number;
  class_name: string;
  grade: number;
  teacher_name: string;
}

const SchoolAdminClasses = () => {
  const supabase = useSupabase();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  useEffect(() => {
    const loadClasses = async () => {
      if (!supabase) return;
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("classes")
          .select("class_id, class_name, grade, teacher_name");
        if (error) setError(error.message);
        else setClasses(data || []);
      } catch {
        setError("반 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadClasses();
  }, [supabase]);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        반 관리
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        전체 반 목록을 확인하고 관리할 수 있습니다.
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Paper sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>반 이름</TableCell>
                <TableCell>학년</TableCell>
                <TableCell>담임 교사</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : classes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    반 정보가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                classes.map((cls) => (
                  <TableRow key={cls.class_id}>
                    <TableCell>
                      <Chip icon={<School />} label={cls.class_name} />
                    </TableCell>
                    <TableCell>{cls.grade}</TableCell>
                    <TableCell>{cls.teacher_name || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default SchoolAdminClasses;
