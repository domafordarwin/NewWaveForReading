import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
} from "@mui/material";

// 추천 도서 샘플 DB (실제 구현 시 Supabase에서 불러오기)
const BOOKS_DB = [
  {
    title: "초등 독서왕",
    author: "홍길동",
    description: "초등학생을 위한 필독서",
    grade: "초등",
    tags: ["기초 독서", "흥미 유발"],
  },
  {
    title: "비판적 사고력 키우기",
    author: "김철수",
    description: "비판적 사고력 향상에 도움",
    grade: "중등",
    tags: ["비판적 사고", "논리력"],
  },
  {
    title: "창의적 글쓰기",
    author: "이영희",
    description: "글쓰기 실력 향상",
    grade: "초등",
    tags: ["표현력", "창의력"],
  },
  {
    title: "교과 연계 독서",
    author: "박교사",
    description: "교과와 연계된 심화 독서",
    grade: "중등",
    tags: ["교과 연계", "심화"],
  },
  {
    title: "가족 토론 도서",
    author: "최가족",
    description: "부모와 자녀가 함께 읽는 토론형 도서",
    grade: "공통",
    tags: ["토론", "공감"],
  },
  {
    title: "베스트셀러 독서",
    author: "인기작가",
    description: "최근 인기 도서로 독서 동기 부여",
    grade: "공통",
    tags: ["베스트셀러", "동기부여"],
  },
];

// 진단 결과/학생 정보 샘플 (실제 구현 시 props 또는 DB에서 전달)
const SAMPLE_DIAGNOSIS = {
  grade: "초등", // "초등", "중등", "고등" 등
  strengths: ["표현력"],
  weaknesses: ["비판적 사고"],
};

const ParentRecommendedBooks: React.FC = () => {
  const [filteredBooks, setFilteredBooks] = useState(BOOKS_DB);

  useEffect(() => {
    // 진단 결과 기반 추천: 약점(weaknesses) 태그 포함 도서 우선, 학년별 필터
    let books = BOOKS_DB.filter(
      (book) => book.grade === SAMPLE_DIAGNOSIS.grade || book.grade === "공통",
    );

    // 약점 태그 포함 도서 우선 정렬
    books = books.sort((a, b) => {
      const aMatch = a.tags.some((tag) =>
        SAMPLE_DIAGNOSIS.weaknesses.includes(tag),
      );
      const bMatch = b.tags.some((tag) =>
        SAMPLE_DIAGNOSIS.weaknesses.includes(tag),
      );
      return Number(bMatch) - Number(aMatch);
    });

    setFilteredBooks(books);
  }, []);

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        추천 도서 전체 보기
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        진단 결과(학년, 강점/약점)에 따라 맞춤형 도서를 추천합니다.
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Divider sx={{ mb: 2 }} />
        <List>
          {filteredBooks.map((book, idx) => (
            <ListItem key={idx} alignItems="flex-start">
              <ListItemText
                primary={<Typography variant="h6">{book.title}</Typography>}
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      저자: {book.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {book.description}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {book.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{ mr: 1 }}
                          color={
                            SAMPLE_DIAGNOSIS.weaknesses.includes(tag)
                              ? "error"
                              : "default"
                          }
                        />
                      ))}
                    </Box>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Button variant="outlined" sx={{ mt: 3 }} href="/parent/dashboard">
        대시보드로 돌아가기
      </Button>
    </Box>
  );
};

export default ParentRecommendedBooks;
