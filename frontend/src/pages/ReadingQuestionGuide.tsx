import { Box } from "@mui/material";

const ReadingQuestionGuide = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100vh - 64px)",
        overflow: "hidden",
      }}
    >
      <iframe
        srcDoc={`<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>독서 발문 생성 방법</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            line-height: 1.8;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
        }

        .header {
            background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
            color: white;
            padding: 60px 40px;
            border-radius: 20px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .header h1 {
            font-size: 3rem;
            margin-bottom: 15px;
            font-weight: 700;
        }

        .header p {
            font-size: 1.3rem;
            opacity: 0.9;
            line-height: 1.6;
        }

        .section {
            background: white;
            border-radius: 20px;
            padding: 50px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .section-title {
            font-size: 2.2rem;
            color: #2d3748;
            margin-bottom: 30px;
            font-weight: 700;
            padding-bottom: 15px;
            border-bottom: 3px solid #667eea;
        }

        .subsection-title {
            font-size: 1.8rem;
            color: #4a5568;
            margin: 40px 0 20px 0;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .subsection-title::before {
            content: "▶";
            color: #667eea;
            font-size: 1.5rem;
        }

        .method-card {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            padding: 30px;
            border-radius: 15px;
            margin: 25px 0;
            border-left: 5px solid #667eea;
            box-shadow: 0 3px 10px rgba(0,0,0,0.05);
        }

        .method-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .badge {
            background: #667eea;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
        }

        .method-content {
            font-size: 1.1rem;
            color: #4a5568;
            line-height: 1.9;
        }

        .highlight-box {
            background: #fff5e6;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            border-left: 5px solid #f59e0b;
        }

        .highlight-box strong {
            color: #c27803;
            font-size: 1.2rem;
        }

        .comparison-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }

        .comparison-card {
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }

        .comparison-card:hover {
            transform: translateY(-5px);
        }

        .comparison-card.question {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left: 5px solid #f59e0b;
        }

        .comparison-card.inquiry {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border-left: 5px solid #3b82f6;
        }

        .card-title {
            font-size: 1.4rem;
            font-weight: 700;
            margin-bottom: 15px;
            color: #1f2937;
        }

        .card-content {
            font-size: 1.05rem;
            color: #4b5563;
            line-height: 1.8;
        }

        .stage-section {
            background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
            padding: 40px;
            border-radius: 15px;
            margin: 30px 0;
        }

        .stage-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 25px;
        }

        .stage-number {
            background: #667eea;
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            font-weight: 700;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .stage-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #1e3a8a;
        }

        .stage-percentage {
            background: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: 700;
            color: #667eea;
            margin-left: auto;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }

        .principle-list {
            background: white;
            padding: 30px;
            border-radius: 12px;
            margin: 20px 0;
        }

        .principle-list li {
            padding: 15px 0;
            border-bottom: 1px solid #e5e7eb;
            font-size: 1.1rem;
            color: #374151;
        }

        .principle-list li:last-child {
            border-bottom: none;
        }

        .principle-list li::marker {
            color: #667eea;
            font-weight: 700;
        }

        .example-box {
            background: #f0fdf4;
            padding: 25px;
            border-radius: 12px;
            margin: 20px 0;
            border-left: 5px solid #10b981;
        }

        .example-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: #065f46;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .example-title::before {
            content: "💡";
            font-size: 1.5rem;
        }

        .example-content {
            font-size: 1.05rem;
            color: #047857;
            line-height: 1.9;
            padding-left: 15px;
        }

        .thinking-skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin: 30px 0;
        }

        .skill-card {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            border-top: 5px solid;
            transition: all 0.3s ease;
        }

        .skill-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .skill-card.understanding { border-top-color: #3b82f6; }
        .skill-card.critical { border-top-color: #ef4444; }
        .skill-card.analytical { border-top-color: #8b5cf6; }
        .skill-card.creative { border-top-color: #f59e0b; }
        .skill-card.expression { border-top-color: #10b981; }
        .skill-card.experience { border-top-color: #06b6d4; }
        .skill-card.problem-solving { border-top-color: #ec4899; }
        .skill-card.synthesis { border-top-color: #6366f1; }
        .skill-card.values { border-top-color: #14b8a6; }

        .skill-icon {
            font-size: 2.5rem;
            margin-bottom: 15px;
        }

        .skill-title {
            font-size: 1.4rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 15px;
        }

        .skill-description {
            font-size: 1.05rem;
            color: #6b7280;
            margin-bottom: 20px;
            line-height: 1.8;
        }

        .skill-examples {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            font-size: 0.95rem;
            color: #4b5563;
            line-height: 1.7;
        }

        .skill-examples strong {
            color: #1f2937;
            display: block;
            margin-bottom: 8px;
        }

        .process-timeline {
            position: relative;
            padding-left: 50px;
            margin: 40px 0;
        }

        .process-timeline::before {
            content: '';
            position: absolute;
            left: 20px;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
        }

        .process-step {
            position: relative;
            margin-bottom: 40px;
            padding: 25px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.08);
        }

        .process-step::before {
            content: '';
            position: absolute;
            left: -38px;
            top: 30px;
            width: 20px;
            height: 20px;
            background: #667eea;
            border: 4px solid white;
            border-radius: 50%;
            box-shadow: 0 0 0 4px #667eea;
        }

        .process-step-title {
            font-size: 1.4rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 15px;
        }

        .process-step-content {
            font-size: 1.05rem;
            color: #4a5568;
            line-height: 1.8;
        }

        .key-points {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            padding: 30px;
            border-radius: 15px;
            margin: 30px 0;
            border-left: 5px solid #f59e0b;
        }

        .key-points-title {
            font-size: 1.6rem;
            font-weight: 700;
            color: #92400e;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .key-points-title::before {
            content: "⭐";
            font-size: 2rem;
        }

        .key-points ul {
            list-style: none;
            padding: 0;
        }

        .key-points li {
            padding: 12px 0;
            padding-left: 30px;
            position: relative;
            font-size: 1.1rem;
            color: #78350f;
            line-height: 1.8;
        }

        .key-points li::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #f59e0b;
            font-weight: 700;
            font-size: 1.3rem;
        }

        .full-example {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            padding: 40px;
            border-radius: 15px;
            margin: 30px 0;
        }

        .full-example-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #0c4a6e;
            margin-bottom: 25px;
            text-align: center;
        }

        .book-title {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 30px;
            font-size: 1.4rem;
            font-weight: 700;
            color: #1e40af;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }

        .question-group {
            background: white;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.08);
        }

        .question-number {
            background: #3b82f6;
            color: white;
            padding: 5px 12px;
            border-radius: 15px;
            font-weight: 700;
            font-size: 0.95rem;
            display: inline-block;
            margin-bottom: 10px;
        }

        .question-text {
            font-size: 1.1rem;
            color: #1e3a8a;
            line-height: 1.8;
            padding-left: 10px;
        }

        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }

            .section {
                padding: 30px 20px;
            }

            .section-title {
                font-size: 1.8rem;
            }

            .comparison-grid,
            .thinking-skills-grid {
                grid-template-columns: 1fr;
            }

            .stage-header {
                flex-wrap: wrap;
            }

            .stage-percentage {
                margin-left: 0;
                margin-top: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📚 독서 발문 생성 방법</h1>
            <p>효과적인 독서토론을 위한 발문 작성 가이드<br>이야기식 독서토론과 일반 독서발문 작성법</p>
        </div>

        <!-- 1. 이야기식 독서토론 방법 -->
        <div class="section">
            <h2 class="section-title">1. 이야기식 독서토론 방법</h2>

            <h3 class="subsection-title">특징</h3>
            <div class="comparison-grid">
                <div class="method-card">
                    <div class="method-title">
                        <span class="badge">형식</span>
                    </div>
                    <div class="method-content">
                        카페에서 차 한 잔을 놓고 대화를 하는 듯 편한 분위기의 토론
                    </div>
                </div>

                <div class="method-card">
                    <div class="method-title">
                        <span class="badge">내용</span>
                    </div>
                    <div class="method-content">
                        다양한 주제를 다양한 방법으로 진행하는 재미있는 토론
                    </div>
                </div>

                <div class="method-card">
                    <div class="method-title">
                        <span class="badge">방법</span>
                    </div>
                    <div class="method-content">
                        토의를 포괄하는 독서토론으로, 대상 도서를 읽고 소감도 나누고 대안도 모색해보고, 쟁점이 생기면 찬반토론도 진행
                    </div>
                </div>

                <div class="method-card">
                    <div class="method-title">
                        <span class="badge">적용</span>
                    </div>
                    <div class="method-content">
                        일반화가 가능하고 초/중/고등학교 모든 학교에서 적용 가능
                    </div>
                </div>
            </div>

            <h3 class="subsection-title">토론 방법의 3단계 구성</h3>
            <div class="stage-section">
                <div class="stage-header">
                    <div class="stage-number">1</div>
                    <div class="stage-title">배경지식 관련 발문</div>
                    <div class="stage-percentage">20%</div>
                </div>
                <p style="color: #1e3a8a; font-size: 1.1rem; line-height: 1.8;">대상 도서를 읽지 않아도 쉽게 반응할 수 있는 흥미로운 발문으로 래포를 형성합니다.</p>
            </div>

            <div class="stage-section">
                <div class="stage-header">
                    <div class="stage-number">2</div>
                    <div class="stage-title">대상 도서의 내용 관련 발문</div>
                    <div class="stage-percentage">30%</div>
                </div>
                <p style="color: #1e3a8a; font-size: 1.1rem; line-height: 1.8;">책을 읽었다면 외우지 않아도 알 수 있는 내용 중심으로 다양한 생각을 나눕니다.</p>
            </div>

            <div class="stage-section">
                <div class="stage-header">
                    <div class="stage-number">3</div>
                    <div class="stage-title">인간 삶이나 사회 관련 발문</div>
                    <div class="stage-percentage">50%</div>
                </div>
                <p style="color: #1e3a8a; font-size: 1.1rem; line-height: 1.8;">실제로 토론이 이루어질 수 있는 발문으로, 갈등 문제 등으로 찬반이 나뉘거나 다양한 방법을 제시할 수 있는 내용입니다.</p>
            </div>
        </div>

        <!-- 2. 질문과 발문의 차이 -->
        <div class="section">
            <h2 class="section-title">2. 질문과 발문의 차이</h2>

            <div class="comparison-grid">
                <div class="comparison-card question">
                    <div class="card-title">🤔 질문 (Question)</div>
                    <div class="card-content">
                        모르거나 의심나는 점을 물어 대답을 구하는 단순한 질문
                    </div>
                </div>

                <div class="comparison-card inquiry">
                    <div class="card-title">💭 발문 (Inquiry)</div>
                    <div class="card-content">
                        <strong>사전적 의미:</strong> 책의 끝에 본문 내용의 대강이나 간행 관련 사항을 짧게 적은 글<br><br>
                        <strong>교육학적 의미:</strong> 토론 등을 이끄는, 의도를 가지고 하는 질문
                    </div>
                </div>
            </div>

            <div class="highlight-box">
                <strong>발문의 핵심 원칙</strong>
                <p style="margin-top: 15px; font-size: 1.1rem; color: #78350f; line-height: 1.9;">
                    독서토론 발문은 정답을 말하도록 물어서는 안 되며, 자신의 생각을 자유롭게 말할 수 있도록 작성해야 합니다.
                    단답형이 아닌 다양한 반응(다답형)을 유도하는 발문을 만들어야 하며, 1회성이 아닌 연속적인 발문이 가능하도록 구성해야 합니다.
                </p>
            </div>

            <h3 class="subsection-title">연속적 발문의 예시</h3>
            <div class="example-box">
                <div class="example-title">해외여행 경험 나누기</div>
                <div class="example-content">
                    <strong>1-1)</strong> 다녀온 해외여행지 중 기억에 남은 나라는?<br>
                    <strong>답변:</strong> 라오스<br><br>
                    <strong>1-2)</strong> 그렇게 생각한 이유는?<br>
                    <strong>답변:</strong> 사람과 자연이 좋아서<br><br>
                    <strong>1-3)</strong> 앞으로 다녀오고 싶은 나라는?<br>
                    <strong>답변:</strong> 네팔<br><br>
                    <strong>1-4)</strong> 우리나라에 외국 사람들이 오게 하는 전략은?<br>
                    <strong>답변:</strong> 라오스 + 네팔 + 한국적인 것을 결합
                </div>
            </div>
        </div>

        <!-- 3. 발문 잘 만드는 방법 -->
        <div class="section">
            <h2 class="section-title">3. 단계별 발문 작성 방법</h2>

            <div class="process-timeline">
                <div class="process-step">
                    <div class="process-step-title">1단계: 배경지식 관련 발문</div>
                    <div class="process-step-content">
                        대상 도서를 읽지 않아도 토론자들이 쉽게 반응할 수 있는 흥미 있는 발문을 제시합니다.
                        이 단계의 목적은 <strong>래포 형성</strong>입니다.
                    </div>
                </div>

                <div class="process-step">
                    <div class="process-step-title">2단계: 텍스트 내용 관련 발문</div>
                    <div class="process-step-content">
                        대상 도서를 읽었다면 일부러 외우지 않아도 알 수 있는 내용을 중심으로 발문을 생성합니다.
                        쉬운 내용 확인하기, 토론자의 생각은?, 왜 그렇게 생각하는가? 등으로 연속적이고 다양한 측면에서
                        <strong>창의성을 발휘</strong>할 수 있는 발문을 만듭니다.
                    </div>
                </div>

                <div class="process-step">
                    <div class="process-step-title">3단계: 인간 삶이나 사회 관련 발문</div>
                    <div class="process-step-content">
                        실제로 토론이 이루어질 수 있는 발문이어야 하며, 갈등 문제 등으로 찬반이 나뉘거나
                        다양한 방법 등을 제시할 수 있는 내용이어야 합니다. 가장 <strong>깊이 있는 토론</strong>이
                        이루어지는 단계입니다.
                    </div>
                </div>
            </div>

            <div class="key-points">
                <div class="key-points-title">독서토론 발문의 핵심 원칙</div>
                <ul>
                    <li><strong>연속성:</strong> 1회성이 아니라 연속적인 발문이 가능하도록 작성</li>
                    <li><strong>다답형:</strong> 단답형이 아니라 다양한 반응을 유도하는 발문</li>
                    <li><strong>개방성:</strong> 정답이 정해지지 않은 열린 질문으로 구성</li>
                    <li><strong>심화성:</strong> 같은 주제를 점진적으로 심화하거나 확대</li>
                </ul>
            </div>
        </div>

        <!-- 4. 일반적인 독서발문 작성법 -->
        <div class="section">
            <h2 class="section-title">4. 폐쇄적 발문 vs 개방적 발문</h2>

            <div class="method-card" style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-left-color: #dc2626;">
                <div class="method-title">
                    <span class="badge" style="background: #dc2626;">폐쇄적 발문</span>
                </div>
                <div class="method-content">
                    <strong>인지·기억적 발문:</strong> 기억에 남아 있는 부분을 말하며, 깊은 수준의 사고를 하지 않는 발문.
                    사실, 공식 등을 단순하게 재생하도록 요구하는 발문입니다.<br><br>

                    <strong>수렴적 발문:</strong> 주어지거나 기억된 자료의 분석과 종합을 이루게 하며, 번역, 관련, 설명,
                    결론 도출 등의 정신적 활동을 자극하는 발문입니다.
                </div>
            </div>

            <div class="method-card" style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-left-color: #2563eb;">
                <div class="method-title">
                    <span class="badge" style="background: #2563eb;">개방적 발문</span>
                </div>
                <div class="method-content">
                    <strong>확산적 발문:</strong> 상당한 수준의 사고를 요하는 발문으로, 학습자들은 상상적이고 창의적인 대답을
                    하게 됩니다. 자료를 산출하고, 고안하고, 종합하고, 정교하게 하는 등의 확산적인 정신적 조작을 이끌어냅니다.<br><br>

                    <strong>평가적 발문:</strong> 사실 문제보다 가치의 문제를 다룹니다. 판단을 하는 기준이나 준거를 요구하며,
                    가치를 판단하고, 비판하고, 의견을 말하게 하는 발문입니다.
                </div>
            </div>

            <div class="highlight-box">
                <strong>토론과 토의에 필요한 발문</strong>
                <p style="margin-top: 15px; font-size: 1.1rem; color: #78350f; line-height: 1.9;">
                    확산적 발문과 개방적 발문은 흥미를 자극하고, 통찰, 감식, 태도 등을 발달시키며,
                    새로운 아이디어나 주제를 소개하고, 기술된 정보 이상을 넘어선 지식과 이해를 요구합니다.
                    따라서 <strong>토론이나 토의의 발문을 할 때 꼭 필요</strong>합니다.
                </p>
            </div>
        </div>

        <!-- 5. 사고력 훈련을 위한 다양한 발문 -->
        <div class="section">
            <h2 class="section-title">5. 사고력 훈련을 위한 다양한 발문 유형</h2>

            <div class="thinking-skills-grid">
                <div class="skill-card understanding">
                    <div class="skill-icon">📖</div>
                    <div class="skill-title">① 이해력 기르기</div>
                    <div class="skill-description">
                        책 속의 중요한 사건의 원인, 결과, 동기, 의미 등을 연관 지어 발문합니다.
                    </div>
                    <div class="skill-examples">
                        <strong>예시 발문:</strong>
                        • 작품에서 가장 중요한 사건은 무엇인가?<br>
                        • 등장인물은 어떤 사람인지 행동이나 태도, 말과 생각을 살펴보고 대답해 보자<br>
                        • 이 작품의 주제는 무엇인가?
                    </div>
                </div>

                <div class="skill-card critical">
                    <div class="skill-icon">🔍</div>
                    <div class="skill-title">② 비판력 기르기</div>
                    <div class="skill-description">
                        책의 내용, 인물, 사건을 대상으로 옳고 그름, 선악, 잘된 곳, 잘못된 곳을 생각할 수 있는 발문을 합니다.
                    </div>
                    <div class="skill-examples">
                        <strong>예시 발문:</strong>
                        • 등장인물의 삶은 과연 바람직한지 평가해 보자<br>
                        • 작품의 내용 중에서 바꾸고 싶은 부분이 있다면 어디인가?<br>
                        • 작품의 전개 과정이 필연적이며 논리적인지 살펴보자
                    </div>
                </div>

                <div class="skill-card analytical">
                    <div class="skill-icon">🧩</div>
                    <div class="skill-title">③ 분석력 기르기</div>
                    <div class="skill-description">
                        등장인물의 성격, 역할, 행동들이 글 속에 표현된 부분을 통해 유추해 볼 수 있도록 발문합니다.
                    </div>
                    <div class="skill-examples">
                        <strong>예시 발문:</strong>
                        • 등장인물을 성격, 역할, 행동, 갈등의 유형으로 나누어 비교해보자<br>
                        • 갈등이 일어나는 부분을 찾고 왜 갈등이 일어났는지 살펴보자<br>
                        • 비슷한 줄거리를 가진 책이 있다면 소개해 보자
                    </div>
                </div>

                <div class="skill-card creative">
                    <div class="skill-icon">✨</div>
                    <div class="skill-title">④ 상상력·창의력 기르기</div>
                    <div class="skill-description">
                        주인공과의 대화 내용을 꾸미거나, 등장인물, 사건, 순서, 결말을 바꾸었을 때 내용을 예상하도록 발문합니다.
                    </div>
                    <div class="skill-examples">
                        <strong>예시 발문:</strong>
                        • 주인공을 인터뷰한다면 어떤 질문을 할 것인가?<br>
                        • 등장인물(사건, 순서, 결말)이 바뀌면 이야기는 어떻게 달라질 것인가?<br>
                        • 뒷이야기를 상상해 보자
                    </div>
                </div>

                <div class="skill-card expression">
                    <div class="skill-icon">✍️</div>
                    <div class="skill-title">⑤ 표현 능력 기르기</div>
                    <div class="skill-description">
                        아름다운 표현, 잘된 문장을 찾을 수 있도록 발문합니다.
                    </div>
                    <div class="skill-examples">
                        <strong>예시 발문:</strong>
                        • 이야기를 다른 장르(극본, 시, 노래 등)로 바꾸어 보자<br>
                        • 기억하고 싶은 멋진 문장이나 표현을 메모하여 발표해 보자<br>
                        • 책의 내용을 친구들 앞에서 동화로 구연해 보자
                    </div>
                </div>

                <div class="skill-card experience">
                    <div class="skill-icon">🌍</div>
                    <div class="skill-title">⑥ 경험 넓히기</div>
                    <div class="skill-description">
                        책 내용과 비슷한 자신의 경험을 이야기하거나, 새롭게 알게 된 점을 발표할 수 있도록 발문합니다.
                    </div>
                    <div class="skill-examples">
                        <strong>예시 발문:</strong>
                        • 책 속의 줄거리나 사건과 비슷한 경험이 있다면 발표해 보자<br>
                        • 책 속의 사건과 비슷한 역사적 사건을 들어 보자<br>
                        • 새롭게 알게 된 점을 발표해 보자
                    </div>
                </div>

                <div class="skill-card problem-solving">
                    <div class="skill-icon">💡</div>
                    <div class="skill-title">⑦ 문제 해결 능력 기르기</div>
                    <div class="skill-description">
                        비슷한 사건을 경험한다면 어떻게 대처할 것이며, 다른 방법으로 문제를 해결할 대안을 제시하도록 발문합니다.
                    </div>
                    <div class="skill-examples">
                        <strong>예시 발문:</strong>
                        • 책 속의 사건을 만약 내가 겪게 된다면 어떻게 대처할 것인가?<br>
                        • 주인공의 문제 해결 방법에 대해 어떻게 생각하며, 나라면 어떻게 해결할 것인가?
                    </div>
                </div>

                <div class="skill-card synthesis">
                    <div class="skill-icon">📊</div>
                    <div class="skill-title">⑧ 종합 구성 능력 기르기</div>
                    <div class="skill-description">
                        책 내용을 도표로 만들거나, 인물연대기, 인생 곡선 등을 작성하여 발표하도록 발문합니다.
                    </div>
                    <div class="skill-examples">
                        <strong>예시 발문:</strong>
                        • 도서의 내용을 도표로 만들어 발표해 보자<br>
                        • 위인전을 읽고 인물연대기를 만들어 발표해 보자<br>
                        • 인생 곡선을 그려서 발표해 보자
                    </div>
                </div>

                <div class="skill-card values">
                    <div class="skill-icon">💎</div>
                    <div class="skill-title">⑨ 가치관 가꾸기</div>
                    <div class="skill-description">
                        책 내용, 등장인물, 사건이 주는 교훈을 찾고, 인생관, 세계관, 윤리성과 관계되는 내용을 찾도록 발문합니다.
                    </div>
                    <div class="skill-examples">
                        <strong>예시 발문:</strong>
                        • 등장인물을 통해 얻을 수 있는 교훈은 무엇인가?<br>
                        • 등장인물이 추구하는 세계관은 무엇인지 살펴보자<br>
                        • 나의 생활에 적용하고 싶은 점은 무엇인지 발표해 보자
                    </div>
                </div>
            </div>
        </div>

        <!-- 6. 학습과정에 따른 단계별 발문 -->
        <div class="section">
            <h2 class="section-title">6. 학습과정에 따른 단계별 발문</h2>

            <div class="method-card" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left-color: #f59e0b;">
                <div class="method-title">
                    <span class="badge" style="background: #f59e0b;">도입 과정</span>
                </div>
                <div class="method-content">
                    <strong>목적:</strong> 학습 동기 유발<br><br>
                    다양한 관심과 경험을 끌어내기 위한 개방적 질문을 합니다. 학습자의 생활 및 경험과 관련이 있는 발문,
                    놀이 형식의 발문, 행동으로 흥미를 유발하는 발문 등을 활용합니다.<br><br>
                    <strong>예시:</strong><br>
                    • 끝말잇기 놀이를 해볼까요?<br>
                    • 말과 관련된 속담이나 관용어를 발표해 보세요<br>
                    • 남자 혹은 여자로 바꾸어 태어나고 싶었다면 언제 그랬는지, 왜 그랬는지 밝혀 보세요
                </div>
            </div>

            <div class="method-card" style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-left-color: #3b82f6;">
                <div class="method-title">
                    <span class="badge" style="background: #3b82f6;">전개 과정</span>
                </div>
                <div class="method-content">
                    <strong>목적:</strong> 학습 목표 확인 및 탐색<br><br>
                    수렴적인 발문을 사용하여 학습 목표를 명료화합니다. 지식을 비교, 대조, 분석, 종합해서 대답할 수 있도록 하는
                    추론적 발문을 하며, 문제의 탐색과 해결 방안을 강구하는 발문으로 창의적인 문제 해결방식을 탐색합니다.<br><br>
                    <strong>예시:</strong><br>
                    • 성역할에 따라 여성들이 많이 갖는 직업과 남성들이 많이 갖는 직업은 무엇인가요?<br>
                    • 성역할에 따라 직업을 나누는 것은 차별인가요? 차이를 인정하는 것인가요?
                </div>
            </div>

            <div class="method-card" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-left-color: #10b981;">
                <div class="method-title">
                    <span class="badge" style="background: #10b981;">정리 과정</span>
                </div>
                <div class="method-content">
                    <strong>목적:</strong> 내면화 및 행동 변화 촉구<br><br>
                    토론(토의)한 내용을 내면화하고, 행동 변화를 촉구하며, 가치 기준으로 삼을 수 있도록 발문을 합니다.<br><br>
                    <strong>예시:</strong><br>
                    • 아름답고 소중한 우리말을 가꾸고 되살리기 위해서는 어떤 노력이 필요할까요?<br>
                    • 양성평등을 위해서 우리가 할 수 있는 일은 무엇인지 발표해 보세요
                </div>
            </div>
        </div>

        <!-- 7. 실전 예시: 완득이 -->
        <div class="section">
            <h2 class="section-title">7. 실전 발문 예시</h2>

            <div class="full-example">
                <div class="full-example-title">📚 이야기식 독서토론 발문 전체 예시</div>
                <div class="book-title">대상 도서: 「완득이」 (김려령, 창비)</div>

                <h3 style="color: #0c4a6e; font-size: 1.6rem; margin: 30px 0 20px 0; font-weight: 700;">
                    1단계: 배경지식 관련 발문 (20%)
                </h3>

                <div class="question-group">
                    <span class="question-number">1-1</span>
                    <p class="question-text">여러분의 가족 구성원을 소개해 봅시다.</p>
                </div>

                <div class="question-group">
                    <span class="question-number">1-2</span>
                    <p class="question-text">만약 여러분 가족에 다른 사람이 들어와서 함께 지내게 된다면 어떤 점들이 불편할까요?</p>
                </div>

                <div class="question-group">
                    <span class="question-number">2-1</span>
                    <p class="question-text">여러분이 지금까지 성장하는데 가장 영향을 많이 미친 사람은 누구인가요?</p>
                </div>

                <div class="question-group">
                    <span class="question-number">2-2</span>
                    <p class="question-text">사춘기를 잘 넘기고 바람직한 어른이 되기 위해서는 어떤 조건들이 필요한가요?</p>
                </div>

                <h3 style="color: #0c4a6e; font-size: 1.6rem; margin: 30px 0 20px 0; font-weight: 700;">
                    2단계: 텍스트 내용 관련 발문 (30%)
                </h3>

                <div class="question-group">
                    <span class="question-number">1-1</span>
                    <p class="question-text">완득이는 어떻게 하여 학교에서 수급대상자가 되었나요?</p>
                </div>

                <div class="question-group">
                    <span class="question-number">1-2</span>
                    <p class="question-text">본인은 가만히 있는데 담임선생님이 학생의 형편을 고려하여 수급대상자로 신청하는 것에 대하여 어떻게 생각하나요?</p>
                </div>

                <div class="question-group">
                    <span class="question-number">2-1</span>
                    <p class="question-text">싸움에서 2등이라면 섭섭해 할 정도로 탁월한 능력을 지닌 완득이가 이런 능력을 원 없이 발휘하는 때는 언제인지 여러 가지 예를 들어 봅시다.</p>
                </div>

                <div class="question-group">
                    <span class="question-number">2-2</span>
                    <p class="question-text">몸이 머리보다 빨리 움직이는 완득이의 이러한 상황대처방법에 대해 어떻게 생각하나요?</p>
                </div>

                <div class="question-group">
                    <span class="question-number">3-1</span>
                    <p class="question-text">완득이와 윤하는 어떻게 하여 가까이 지내게 되었나요?</p>
                </div>

                <div class="question-group">
                    <span class="question-number">3-2</span>
                    <p class="question-text">윤하의 어머니 말대로 한창 공부에 열중해야 할 고등학교 시절 이성과 사귀는 것에 대해 어떻게 생각하나요?</p>
                </div>

                <h3 style="color: #0c4a6e; font-size: 1.6rem; margin: 30px 0 20px 0; font-weight: 700;">
                    3단계: 인간 삶과 사회 관련 발문 (50%)
                </h3>

                <div class="question-group">
                    <span class="question-number">1-1</span>
                    <p class="question-text">완득이가 어머니의 신발을 사주기 위해 신발 가게에 갔는데 가게 주인은 베트남 엄마를 '저짝 사람'이라고 표현하였다. 이 말에 담긴 의미를 다양하게 해석해 봅시다.</p>
                </div>

                <div class="question-group">
                    <span class="question-number">1-2</span>
                    <p class="question-text">국제결혼이나 외국인 노동자의 유입으로 다문화 가정이 늘고 있다. 현재 다문화 가정을 위한 지원책을 살펴보고 보완해야 할 점이 있다면 무엇인지 발표해 봅시다.</p>
                </div>

                <div class="question-group">
                    <span class="question-number">2-1</span>
                    <p class="question-text">사회적 약자란 무엇을 말하나요?</p>
                </div>

                <div class="question-group">
                    <span class="question-number">2-2</span>
                    <p class="question-text">우리나라는 사회적 약자에 대한 사회 제도적 배려가 잘 되어 있다고 생각하나요?</p>
                </div>

                <div class="question-group">
                    <span class="question-number">3-1</span>
                    <p class="question-text">완득이가 어려운 환경 속에서도 탈선하지 않고 자신의 정체성을 찾은 이유가 무엇인지 발표해 봅시다.</p>
                </div>

                <div class="question-group">
                    <span class="question-number">3-2</span>
                    <p class="question-text">만약 완득이와 같은 상황에 놓인 청소년이 실제 존재한다면 탈선하지 않고 학교에 잘 적응하면서 자신의 꿈을 향해 나아갈 수 있을까요?</p>
                </div>

                <div class="question-group">
                    <span class="question-number">3-3</span>
                    <p class="question-text">완득이가 앞으로 잘 성장하여 자신의 꿈을 이룰 수 있으려면 가족이나 주변 사람들이 어떤 도움을 주어야 할까요?</p>
                </div>
            </div>
        </div>

        <!-- 8. 발문 작성 시 유의점 -->
        <div class="section">
            <h2 class="section-title">8. 발문 작성 시 유의점</h2>

            <div class="key-points" style="background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); border-left-color: #ec4899;">
                <div class="key-points-title" style="color: #831843;">💡 효과적인 발문을 위한 핵심 가이드</div>
                <ul>
                    <li>책 선정에 심혈을 기울이고, 아이의 연령을 고려하여 너무 어렵지 않은 책을 선정합니다</li>
                    <li>교사의 마음에 울림이 있는 책은 아이들에게도 울림이 있을 가능성이 높습니다</li>
                    <li>책을 꼼꼼하게 읽고, 해당 도서를 통해 학습자들과 나누고자 하는 메시지를 생각해야 합니다</li>
                    <li>책이 주는 감동이나 깨달음, 마음에 깊이 남은 구절, 세상과의 연계 등을 체크하고 고민합니다</li>
                    <li>토론의 질은 발문을 만드는 이가 세상을 바라보는 관점과 무관하지 않으므로, 평소 자신의 삶과 생각을 잘 가꾸어야 합니다</li>
                    <li>연속적인 발문이 가능하도록 예상 답변을 고려하여 같은 주제를 심화하거나 확대하는 발문을 만듭니다</li>
                    <li>구체적인 정보를 외워서 말해야 하는 단답형 문제를 지양하고 다양한 답을 말할 수 있는 문항을 구성합니다</li>
                    <li>책을 읽어오지 않았더라도 소외되지 않고 토론의 흐름을 보고 어느 정도 자신의 생각을 말할 수 있도록 구성합니다</li>
                </ul>
            </div>

            <div class="highlight-box" style="background: #e0f2fe; border-left-color: #0284c7;">
                <strong style="color: #0c4a6e;">학생 주도적 발문 작성</strong>
                <p style="margin-top: 15px; font-size: 1.1rem; color: #075985; line-height: 1.9;">
                    초등 고학년이나 중등 이상의 학생이라면 발문을 만들어가는 일도 학생 주도적으로 할 수 있습니다.
                    학생에게 단계를 자세히 설명한 후 단계별로 발문을 작성하게 하여 모으거나, 팀별로 발문을 정리해 오도록 하는 방법도 효과적입니다.
                </p>
            </div>
        </div>

        <!-- 9. 다양한 발문 예시 모음 -->
        <div class="section">
            <h2 class="section-title">9. 주제별 발문 예시 모음</h2>

            <div class="example-box" style="background: #fef3c7; border-left-color: #f59e0b;">
                <div class="example-title" style="color: #92400e;">「너 정말 우리말 아니?」 배경지식 발문</div>
                <div class="example-content" style="color: #78350f;">
                    <strong>1-1)</strong> 무엇을 우리말이라고 하는지 나의 생각을 이야기해 보세요.<br><br>
                    <strong>1-2)</strong> 우리가 오늘 토론할 책은 「너 정말 우리말 아니?」라는 책입니다.
                    만약 여러분에게 누군가 "너 정말 우리말 아니?"라고 묻는다면 어떻게 대답할 것인가요?
                </div>
            </div>

            <div class="example-box" style="background: #dbeafe; border-left-color: #3b82f6;">
                <div class="example-title" style="color: #1e3a8a;">「잘 먹고 잘 사는 식량 이야기」 배경지식 발문</div>
                <div class="example-content" style="color: #1e40af;">
                    <strong>1-1)</strong> 여러분이 좋아하는 음식은 무엇인가요? 왜 그 음식을 좋아하나요?<br><br>
                    <strong>1-2)</strong> 여러분이 좋아하는 음식은 누구의 손을 거쳐 어떻게 하여 여러분이 먹게 되었는지 생각해 보세요.
                </div>
            </div>

            <div class="example-box" style="background: #fce7f3; border-left-color: #ec4899;">
                <div class="example-title" style="color: #831843;">「싸움대장」 배경지식 발문</div>
                <div class="example-content" style="color: #9f1239;">
                    <strong>1-1)</strong> 나에게 친구가 없다면 학교 생활이 어떠할까요? 상상하여 말해보세요.<br><br>
                    <strong>1-2)</strong> 자랑하고 싶은 친구에 대하여 자랑해 보세요. 그 친구의 어떤 점이 좋나요?
                </div>
            </div>

            <div class="example-box" style="background: #d1fae5; border-left-color: #10b981;">
                <div class="example-title" style="color: #065f46;">「갯벌, 무슨 일이 일어나고 있을까」 텍스트 내용 발문</div>
                <div class="example-content" style="color: #047857;">
                    <strong>1-1)</strong> 이 책에는 여러 곳의 갯벌이 소개되고 있습니다. 여러분이 자신 있게 소개할 수 있는 갯벌을
                    한 곳 골라서 위치와 특징, 역할 등을 소개해 보세요.<br><br>
                    <strong>1-2)</strong> 우리나라 서해안은 갯벌을 만들기에 좋은 조건을 갖추고 있어 세계 5대 갯벌의 하나로 꼽힙니다.
                    그렇다면 갯벌은 어떤 조건을 갖추고 있어야 잘 만들어질까요?
                </div>
            </div>

            <div class="example-box" style="background: #e0e7ff; border-left-color: #6366f1;">
                <div class="example-title" style="color: #3730a3;">「지렁이 카로」 인간 삶과 사회 관련 발문</div>
                <div class="example-content" style="color: #4338ca;">
                    <strong>1-1)</strong> 여러분은 스스로 자연과 연결된 삶을 살고 있다고 생각하나요?
                    자연과 분리된 삶을 살고 있다고 생각하나요? (찬반토론)<br><br>
                    <strong>1-2)</strong> 셰퍼 교장 선생님은 자연을 통한 교육을 실천합니다. 자연을 통한 학습과
                    교실 안에서 교과서나 수업 자료 등을 이용하는 학습 중 어떤 것이 더 좋다고 생각하나요? (찬반토론)
                </div>
            </div>
        </div>
    </div>
</body>
</html>`}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="독서 발문 생성 방법"
      />
    </Box>
  );
};

export default ReadingQuestionGuide;
