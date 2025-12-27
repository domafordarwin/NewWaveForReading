package com.literacy.assessment.entity;

import lombok.*;
import javax.persistence.*;

@Entity
@Table(name = "evaluations")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evaluation extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "evaluation_id")
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_id", nullable = false, unique = true)
    private Answer answer;
    
    // 4개 평가 영역 (각 25점, 총 100점)
    @Column(name = "book_analysis_score")
    private Integer bookAnalysisScore;  // 대상도서 분석력
    
    @Column(name = "creative_thinking_score")
    private Integer creativeThinkingScore;  // 창의적 사고력
    
    @Column(name = "problem_solving_score")
    private Integer problemSolvingScore;  // 문제해결력
    
    @Column(name = "expression_score")
    private Integer expressionScore;  // 문장력/표현력
    
    @Column(name = "total_score")
    private Integer totalScore;  // 총점
    
    @Column(length = 10)
    private String grade;  // 등급 (A+, A, B+, etc.)
    
    // 오류 검출 결과
    @Column(name = "spelling_errors")
    private Integer spellingErrors;  // 맞춤법 오류 수
    
    @Column(name = "spacing_errors")
    private Integer spacingErrors;  // 띄어쓰기 오류 수
    
    @Column(name = "grammar_errors")
    private Integer grammarErrors;  // 문법 오류 수
    
    // AI 분석 결과
    @Column(columnDefinition = "TEXT")
    private String comprehensiveFeedback;  // 종합 피드백
    
    @Column(columnDefinition = "TEXT")
    private String detailedFeedback;  // 상세 피드백
    
    @Column(columnDefinition = "JSON")
    private String strengths;  // 강점 (JSON 배열)
    
    @Column(columnDefinition = "JSON")
    private String weaknesses;  // 약점 (JSON 배열)
    
    @Column(columnDefinition = "JSON")
    private String improvements;  // 개선 제안 (JSON 배열)
}
