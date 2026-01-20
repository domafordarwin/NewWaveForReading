package com.literacy.assessment.service;

import com.literacy.assessment.config.OpenAIConfig;
import com.literacy.assessment.entity.*;
import com.literacy.assessment.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIAnalysisService {
    
    private final OpenAIConfig openAIConfig;
    private final RestTemplate restTemplate;
    private final AnswerRepository answerRepository;
    private final EvaluationRepository evaluationRepository;
    private final CorrectionRepository correctionRepository;
    private final AtomicBoolean loggedApiKeyStatus = new AtomicBoolean(false);
    
    /**
     * 답안을 종합 분석하고 평가 결과를 생성
     */
    @Transactional
    public Evaluation analyzeAnswer(Long answerId) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found: " + answerId));
        
        String content = answer.getContent();
        String topic = answer.getAssessment().getTopic().getTopicText();
        
        log.info("Starting AI analysis for answer ID: {}", answerId);
        
        // 1. 기본 오류 검출
        Map<String, Integer> errors = detectBasicErrors(content);
        
        // 2. OpenAI를 통한 종합 분석 (Mock)
        Map<String, Object> aiAnalysis = analyzeWithAI(content, topic);
        
        // 3. 평가 결과 생성
        Evaluation evaluation = Evaluation.builder()
                .answer(answer)
                .bookAnalysisScore(extractScore(aiAnalysis, "bookAnalysis", 20))
                .creativeThinkingScore(extractScore(aiAnalysis, "creativeThinking", 20))
                .problemSolvingScore(extractScore(aiAnalysis, "problemSolving", 20))
                .expressionScore(extractScore(aiAnalysis, "expression", 20))
                .spellingErrors(errors.get("spelling"))
                .spacingErrors(errors.get("spacing"))
                .grammarErrors(errors.get("grammar"))
                .comprehensiveFeedback((String) aiAnalysis.get("comprehensiveFeedback"))
                .detailedFeedback((String) aiAnalysis.get("detailedFeedback"))
                .strengths((String) aiAnalysis.get("strengths"))
                .weaknesses((String) aiAnalysis.get("weaknesses"))
                .improvements((String) aiAnalysis.get("improvements"))
                .build();
        
        // 총점 계산
        int totalScore = evaluation.getBookAnalysisScore() 
                + evaluation.getCreativeThinkingScore()
                + evaluation.getProblemSolvingScore() 
                + evaluation.getExpressionScore();
        evaluation.setTotalScore(totalScore);
        evaluation.setGrade(calculateGrade(totalScore));
        
        // 4. 첨삭 정보 생성
        List<Correction> corrections = generateCorrections(evaluation, content);
        
        // 5. 저장
        Evaluation savedEvaluation = evaluationRepository.save(evaluation);
        corrections.forEach(c -> c.setEvaluation(savedEvaluation));
        correctionRepository.saveAll(corrections);
        
        log.info("AI analysis completed for answer ID: {}", answerId);
        
        return savedEvaluation;
    }
    
    /**
     * 기본 오류 검출 (맞춤법, 띄어쓰기, 문법)
     */
    private Map<String, Integer> detectBasicErrors(String content) {
        Map<String, Integer> errors = new HashMap<>();
        
        // Mock 구현 (실제로는 한글 맞춤법 검사 API 사용)
        errors.put("spelling", (int) (Math.random() * 5));
        errors.put("spacing", (int) (Math.random() * 8));
        errors.put("grammar", (int) (Math.random() * 3));
        
        return errors;
    }
    
    /**
     * OpenAI API를 통한 AI 분석
     */
    private Map<String, Object> analyzeWithAI(String content, String topic) {
        Map<String, Object> result = new HashMap<>();
        
        String apiKey = openAIConfig.getApiKey();

        if (loggedApiKeyStatus.compareAndSet(false, true)) {
            if (apiKey == null || apiKey.isEmpty()) {
                log.warn("OpenAI API key not configured. Using mock analysis.");
            } else {
                log.info("OpenAI API key detected. Using live analysis.");
            }
        }
        
        // API Key가 없으면 Mock 데이터 반환
        if (apiKey == null || apiKey.isEmpty()) {
            return generateMockAnalysis(content, topic);
        }
        
        try {
            // OpenAI API 호출 준비
            String url = openAIConfig.getApiUrl() + "/chat/completions";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);
            
            String prompt = buildAnalysisPrompt(content, topic);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-4");
            requestBody.put("messages", List.of(
                Map.of("role", "system", "content", "당신은 학생 답안을 평가하는 전문 교육자입니다."),
                Map.of("role", "user", "content", prompt)
            ));
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 2000);
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                request, 
                Map.class
            );
            
            // 응답 파싱
            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = response.getBody();
                return parseAIResponse(responseBody);
            }
            
        } catch (Exception e) {
            log.error("Error calling OpenAI API: {}", e.getMessage());
        }
        
        // 실패 시 Mock 데이터 반환
        return generateMockAnalysis(content, topic);
    }
    
    /**
     * AI 분석 프롬프트 생성
     */
    private String buildAnalysisPrompt(String content, String topic) {
        return "다음 논제에 대한 학생의 답안을 평가해주세요.\n\n" +
            "[논제]\n" + topic + "\n\n" +
            "[학생 답안]\n" + content + "\n\n" +
            "다음 4개 영역을 각각 25점 만점으로 평가하고, JSON 형식으로 결과를 제공해주세요:\n\n" +
            "1. 대상도서 분석력 (bookAnalysis): 도서 내용을 얼마나 잘 이해하고 분석했는가\n" +
            "2. 창의적 사고력 (creativeThinking): 독창적이고 창의적인 생각을 표현했는가\n" +
            "3. 문제해결력 (problemSolving): 논제의 문제를 해결하는 방안을 제시했는가\n" +
            "4. 문장력/표현력 (expression): 문장이 명확하고 표현이 적절한가\n\n" +
            "또한 다음 항목도 포함해주세요:\n" +
            "- comprehensiveFeedback: 종합 피드백 (200자 이내)\n" +
            "- detailedFeedback: 상세 피드백 (500자 이내)\n" +
            "- strengths: 강점 3개 (JSON 배열)\n" +
            "- weaknesses: 약점 3개 (JSON 배열)\n" +
            "- improvements: 개선 제안 3개 (JSON 배열)";
    }
    
    /**
     * AI 응답 파싱
     */
    private Map<String, Object> parseAIResponse(Map<String, Object> response) {
        // OpenAI 응답에서 실제 내용 추출
        // 실제 구현 필요
        return new HashMap<>();
    }
    
    /**
     * Mock 분석 결과 생성
     */
    private Map<String, Object> generateMockAnalysis(String content, String topic) {
        Map<String, Object> result = new HashMap<>();
        
        int wordCount = content.length();
        
        // 글자 수에 따른 기본 점수 계산
        int baseScore = Math.min(20, wordCount / 100);
        
        result.put("bookAnalysis", baseScore + (int)(Math.random() * 5));
        result.put("creativeThinking", baseScore + (int)(Math.random() * 5));
        result.put("problemSolving", baseScore + (int)(Math.random() * 5));
        result.put("expression", baseScore + (int)(Math.random() * 5));
        
        result.put("comprehensiveFeedback", 
            "전반적으로 논제를 잘 이해하고 자신의 생각을 표현하였습니다. " +
            "문장 구성이 명확하며, 논리적인 흐름이 잘 갖추어져 있습니다.");
        
        result.put("detailedFeedback",
            "대상 도서의 주요 내용을 잘 파악하고 있으며, 이를 바탕으로 자신의 생각을 전개하였습니다. " +
            "특히 구체적인 예시를 들어 설명한 부분이 돋보입니다. " +
            "다만, 더 깊이 있는 분석과 비판적 사고를 보여주면 더욱 좋은 답안이 될 것입니다.");
        
        result.put("strengths", 
            "[\"논제에 대한 명확한 이해\", \"구체적인 예시 활용\", \"논리적인 문장 구성\"]");
        
        result.put("weaknesses",
            "[\"깊이 있는 분석 부족\", \"비판적 사고 미흡\", \"어휘 다양성 제한적\"]");
        
        result.put("improvements",
            "[\"도서의 주제를 더 깊이 탐구하기\", \"다양한 관점에서 생각해보기\", \"풍부한 어휘 사용하기\"]");
        
        return result;
    }
    
    /**
     * 점수 추출
     */
    private Integer extractScore(Map<String, Object> analysis, String key, int defaultScore) {
        Object value = analysis.get(key);
        if (value instanceof Integer) {
            return (Integer) value;
        } else if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        return defaultScore;
    }
    
    /**
     * 등급 계산
     */
    private String calculateGrade(int totalScore) {
        if (totalScore >= 95) return "A+";
        if (totalScore >= 90) return "A";
        if (totalScore >= 85) return "B+";
        if (totalScore >= 80) return "B";
        if (totalScore >= 75) return "C+";
        if (totalScore >= 70) return "C";
        if (totalScore >= 65) return "D+";
        if (totalScore >= 60) return "D";
        return "F";
    }
    
    /**
     * 첨삭 정보 생성
     */
    private List<Correction> generateCorrections(Evaluation evaluation, String content) {
        List<Correction> corrections = new ArrayList<>();
        
        // Mock 첨삭 생성 (실제로는 상세한 오류 분석 필요)
        int errorCount = evaluation.getSpellingErrors() + evaluation.getSpacingErrors();
        
        for (int i = 0; i < Math.min(errorCount, 5); i++) {
            int position = (int) (Math.random() * Math.max(1, content.length() - 10));
            
            Correction correction = Correction.builder()
                    .correctionType(CorrectionType.values()[(int) (Math.random() * CorrectionType.values().length)])
                    .startPosition(position)
                    .endPosition(position + 5)
                    .originalText(content.substring(position, Math.min(position + 5, content.length())))
                    .correctedText("[수정 제안]")
                    .description("문법 또는 맞춤법 오류가 발견되었습니다.")
                    .severity((int) (Math.random() * 3) + 1)
                    .build();
            
            corrections.add(correction);
        }
        
        return corrections;
    }
}
