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
import { Person } from "@mui/icons-material";
import { useSupabase } from "../services/supabaseClient";

interface Student {
  user_id: number;
  name: string;
  grade: number;
  class_name: string;
  email: string;
}

const SchoolAdminStudents = () => {
  const supabase = useSupabase();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const loadStudents = async () => {
      if (!supabase) return;
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("users")
          .select("user_id, name, grade, class_name, email")
          .eq("user_type", "STUDENT");
        if (error) setError(error.message);
        else setStudents(data || []);
      } catch {
        setError("학생 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, [supabase]);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        학생 관리
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        전체 학생 목록을 확인하고 관리할 수 있습니다.
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Paper sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>이름</TableCell>
                <TableCell>학년</TableCell>
                <TableCell>반</TableCell>
                <TableCell>이메일</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    학생 정보가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.user_id}>
                    <TableCell>
                      <Chip icon={<Person />} label={student.name} />
                    </TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>{student.class_name || "-"}</TableCell>
                    <TableCell>{student.email}</TableCell>
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

export default SchoolAdminStudents;
