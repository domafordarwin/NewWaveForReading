import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  School,
} from '@mui/icons-material';
import { getAllUsers, createUser } from '../services/api';

export default function StudentManagement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({
    email: '',
    name: '',
    schoolName: '',
    grade: '',
    passwordHash: 'default123', // 기본 비밀번호
  });

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    // 검색 필터링
    if (searchTerm) {
      const filtered = students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.schoolName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const allUsers = await getAllUsers();
      const studentList = allUsers.filter((u: any) => u.userType === 'STUDENT');
      setStudents(studentList);
      setFilteredStudents(studentList);
      setError(null);
    } catch (err: any) {
      console.error('학생 목록 로드 실패:', err);
      setError(err.message || '학생 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    try {
      const studentData = {
        ...newStudent,
        userType: 'STUDENT',
        grade: parseInt(newStudent.grade),
      };
      await createUser(studentData);
      setOpenDialog(false);
      setNewStudent({
        email: '',
        name: '',
        schoolName: '',
        grade: '',
        passwordHash: 'default123',
      });
      loadStudents(); // 목록 새로고침
    } catch (err: any) {
      console.error('학생 추가 실패:', err);
      alert('학생 추가에 실패했습니다: ' + (err.message || '알 수 없는 오류'));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={loadStudents}>
          다시 시도
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          학생 관리
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          학생 추가
        </Button>
      </Box>

      {/* 검색 및 필터 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="이름, 이메일, 학교로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* 학생 목록 테이블 */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>이름</TableCell>
                <TableCell>이메일</TableCell>
                <TableCell align="center">학교</TableCell>
                <TableCell align="center">학년</TableCell>
                <TableCell align="center">등록일</TableCell>
                <TableCell align="center">상태</TableCell>
                <TableCell align="center">작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary" py={4}>
                      {searchTerm ? '검색 결과가 없습니다.' : '등록된 학생이 없습니다.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.userId} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <School sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography fontWeight="medium">{student.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell align="center">{student.schoolName || '-'}</TableCell>
                    <TableCell align="center">{student.grade ? `${student.grade}학년` : '-'}</TableCell>
                    <TableCell align="center">
                      {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell align="center">
                      <Chip label="활성" color="success" size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 학생 추가 다이얼로그 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>새 학생 추가</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="이름"
              fullWidth
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              required
            />
            <TextField
              label="이메일"
              type="email"
              fullWidth
              value={newStudent.email}
              onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
              required
            />
            <TextField
              label="학교명"
              fullWidth
              value={newStudent.schoolName}
              onChange={(e) => setNewStudent({ ...newStudent, schoolName: e.target.value })}
            />
            <TextField
              label="학년"
              type="number"
              fullWidth
              value={newStudent.grade}
              onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
              inputProps={{ min: 1, max: 12 }}
            />
            <Alert severity="info">
              초기 비밀번호는 'default123' 으로 설정됩니다.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>취소</Button>
          <Button
            onClick={handleAddStudent}
            variant="contained"
            disabled={!newStudent.name || !newStudent.email}
          >
            추가
          </Button>
        </DialogActions>
      </Dialog>

      {/* 통계 요약 */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          전체 {students.length}명 | 표시 중 {filteredStudents.length}명
        </Typography>
      </Paper>
    </Box>
  );
}
