package com.literacy.assessment.config;

import com.literacy.assessment.entity.*;
import com.literacy.assessment.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@Profile("!prod")
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final TopicRepository topicRepository;
    private final AssessmentRepository assessmentRepository;

    public DataInitializer(
            UserRepository userRepository,
            BookRepository bookRepository,
            TopicRepository topicRepository,
            AssessmentRepository assessmentRepository
    ) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.topicRepository = topicRepository;
        this.assessmentRepository = assessmentRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 이미 데이터가 있으면 초기화 건너뛰기
        if (userRepository.count() > 0) {
            System.out.println("========================================");
            System.out.println("데이터가 이미 존재합니다. 초기화를 건너뜁니다.");
            System.out.println("========================================");
            return;
        }

        System.out.println("========================================");
        System.out.println("샘플 데이터 초기화를 시작합니다...");
        System.out.println("========================================");

        // 1. 교사 2명 생성
        User teacher1 = User.builder()
                .email("teacher1@school.com")
                .passwordHash("$2a$10$samplehash1") // 실제로는 암호화된 비밀번호
                .name("김선생")
                .userType(UserType.TEACHER)
                .schoolName("서울초등학교")
                .phone("010-1111-1111")
                .isActive(true)
                .build();
        userRepository.save(teacher1);
        System.out.println("✓ 교사 생성: " + teacher1.getName() + " (" + teacher1.getEmail() + ")");

        User teacher2 = User.builder()
                .email("teacher2@school.com")
                .passwordHash("$2a$10$samplehash2")
                .name("이선생")
                .userType(UserType.TEACHER)
                .schoolName("서울초등학교")
                .phone("010-2222-2222")
                .isActive(true)
                .build();
        userRepository.save(teacher2);
        System.out.println("✓ 교사 생성: " + teacher2.getName() + " (" + teacher2.getEmail() + ")");

        // 2. 학생 10명 생성
        String[] studentNames = {
                "김민준", "이서연", "박지호", "최유진", "정도윤",
                "강서준", "조민서", "윤예준", "임하은", "한지우"
        };
        
        String[] grades = {"3학년", "3학년", "4학년", "4학년", "5학년", 
                          "5학년", "6학년", "6학년", "4학년", "5학년"};

        for (int i = 0; i < studentNames.length; i++) {
            User student = User.builder()
                    .email("student" + (i + 1) + "@school.com")
                    .passwordHash("$2a$10$samplehash" + (i + 3))
                    .name(studentNames[i])
                    .userType(UserType.STUDENT)
                    .schoolName("서울초등학교")
                    .grade(Integer.parseInt(grades[i].substring(0, 1)))
                    .birthDate(LocalDate.of(2014 + (i % 4), (i % 12) + 1, (i % 28) + 1))
                    .phone("010-" + String.format("%04d", 3000 + i) + "-" + String.format("%04d", 1000 + i))
                    .isActive(true)
                    .build();
            userRepository.save(student);
            System.out.println("✓ 학생 생성: " + student.getName() + " (" + grades[i] + ", " + student.getEmail() + ")");
        }

        // 3. 도서 5권 생성
        Book book1 = Book.builder()
                .title("어린 왕자")
                .author("생텍쥐페리")
                .publisher("문학동네")
                .isbn("9788958280661")
                .publishedYear(2015)
                .category("문학")
                .difficultyLevel(DifficultyLevel.ELEMENTARY)
                .description("사막에 불시착한 비행사가 어린 왕자를 만나며 겪는 이야기")
                .build();
        bookRepository.save(book1);

        Book book2 = Book.builder()
                .title("동물농장")
                .author("조지 오웰")
                .publisher("민음사")
                .isbn("9788937460449")
                .publishedYear(2009)
                .category("소설")
                .difficultyLevel(DifficultyLevel.MIDDLE)
                .description("동물들이 농장을 운영하며 벌어지는 풍자 우화")
                .build();
        bookRepository.save(book2);

        Book book3 = Book.builder()
                .title("해리포터와 마법사의 돌")
                .author("J.K. 롤링")
                .publisher("문학수첩")
                .isbn("9788983920959")
                .publishedYear(1999)
                .category("판타지")
                .difficultyLevel(DifficultyLevel.MIDDLE)
                .description("마법 학교에 입학한 해리포터의 모험")
                .build();
        bookRepository.save(book3);

        Book book4 = Book.builder()
                .title("연금술사")
                .author("파울로 코엘료")
                .publisher("문학동네")
                .isbn("9788982814471")
                .publishedYear(2001)
                .category("문학")
                .difficultyLevel(DifficultyLevel.HIGH)
                .description("자신의 운명을 찾아가는 양치기 소년의 여행")
                .build();
        bookRepository.save(book4);

        Book book5 = Book.builder()
                .title("데미안")
                .author("헤르만 헤세")
                .publisher("민음사")
                .isbn("9788937460784")
                .publishedYear(2000)
                .category("문학")
                .difficultyLevel(DifficultyLevel.HIGH)
                .description("한 소년의 내면 성장과 자아 발견의 이야기")
                .build();
        bookRepository.save(book5);

        System.out.println("✓ 도서 5권 생성 완료");

        // 4. 논제(Topic) 10개 생성
        Topic topic1 = Topic.builder()
                .book(book1)
                .topicText("어린 왕자가 여러 별을 여행하며 만난 어른들을 통해 작가가 전하고자 하는 메시지는 무엇인가요?")
                .topicType(TopicType.ANALYTICAL)
                .difficultyLevel(2)
                .keywords("본질, 관계, 어른, 가치")
                .build();
        topicRepository.save(topic1);

        Topic topic2 = Topic.builder()
                .book(book1)
                .topicText("여우가 어린 왕자에게 '길들인다'는 것의 의미를 설명합니다. 이것이 우리의 인간관계에 어떤 의미를 줄까요?")
                .topicType(TopicType.CREATIVE)
                .difficultyLevel(3)
                .keywords("길들임, 관계, 책임, 유대감")
                .build();
        topicRepository.save(topic2);

        Topic topic3 = Topic.builder()
                .book(book2)
                .topicText("동물농장에서 돼지들이 권력을 잡은 후 변화하는 과정을 분석하고, 이것이 현실 사회에 주는 교훈은 무엇인가요?")
                .topicType(TopicType.CRITICAL)
                .difficultyLevel(4)
                .keywords("권력, 부패, 평등, 독재")
                .build();
        topicRepository.save(topic3);

        Topic topic4 = Topic.builder()
                .book(book3)
                .topicText("해리포터가 호그와트에서 진정한 용기를 발휘한 순간을 찾아 설명하고, 용기의 의미를 논하시오.")
                .topicType(TopicType.ANALYTICAL)
                .difficultyLevel(2)
                .keywords("용기, 우정, 희생, 성장")
                .build();
        topicRepository.save(topic4);

        Topic topic5 = Topic.builder()
                .book(book3)
                .topicText("만약 당신이 호그와트 학생이라면 어떤 기숙사에 배정받고 싶으며, 그 이유는 무엇인가요?")
                .topicType(TopicType.CREATIVE)
                .difficultyLevel(1)
                .keywords("기숙사, 가치관, 정체성, 선택")
                .build();
        topicRepository.save(topic5);

        Topic topic6 = Topic.builder()
                .book(book4)
                .topicText("산티아고가 자신의 '개인적인 신화'를 찾아가는 여정에서 만난 인물들의 역할을 분석하시오.")
                .topicType(TopicType.ANALYTICAL)
                .difficultyLevel(4)
                .keywords("운명, 조력자, 성장, 깨달음")
                .build();
        topicRepository.save(topic6);

        Topic topic7 = Topic.builder()
                .book(book4)
                .topicText("당신의 '개인적인 신화'는 무엇이며, 그것을 이루기 위해 어떤 노력을 할 것인가요?")
                .topicType(TopicType.CREATIVE)
                .difficultyLevel(3)
                .keywords("꿈, 목표, 노력, 자아실현")
                .build();
        topicRepository.save(topic7);

        Topic topic8 = Topic.builder()
                .book(book5)
                .topicText("싱클레어의 성장 과정에서 데미안이 미친 영향을 분석하고, 멘토의 중요성을 논하시오.")
                .topicType(TopicType.CRITICAL)
                .difficultyLevel(5)
                .keywords("멘토, 성장, 자아, 영향")
                .build();
        topicRepository.save(topic8);

        Topic topic9 = Topic.builder()
                .book(book5)
                .topicText("'알에서 나오려는 새는 하나의 세계를 깨뜨려야 한다'는 구절의 의미를 해석하시오.")
                .topicType(TopicType.ANALYTICAL)
                .difficultyLevel(4)
                .keywords("변화, 성장, 극복, 탄생")
                .build();
        topicRepository.save(topic9);

        Topic topic10 = Topic.builder()
                .book(book2)
                .topicText("동물농장의 결말에서 동물들이 돼지와 인간을 구별하지 못하는 장면의 상징적 의미를 설명하시오.")
                .topicType(TopicType.CRITICAL)
                .difficultyLevel(5)
                .keywords("권력, 타락, 본질, 풍자")
                .build();
        topicRepository.save(topic10);

        System.out.println("✓ 논제 10개 생성 완료");

        // 5. 검사(Assessment) 샘플 데이터 생성 (학생 10명에게 각각 1-2개씩)
        User[] students = userRepository.findByUserType(UserType.STUDENT).toArray(new User[0]);
        Topic[] topics = topicRepository.findAll().toArray(new Topic[0]);

        int assessmentCount = 0;
        for (int i = 0; i < students.length; i++) {
            // 각 학생에게 1-2개의 검사 배정
            int numAssessments = (i % 2) + 1; // 1 또는 2
            
            for (int j = 0; j < numAssessments; j++) {
                Topic topic = topics[(i + j) % topics.length];
                
                AssessmentStatus status;
                LocalDateTime startedAt = null;
                
                // 다양한 상태 부여
                if (i < 3) {
                    status = AssessmentStatus.NOT_STARTED;
                } else if (i < 6) {
                    status = AssessmentStatus.IN_PROGRESS;
                    startedAt = LocalDateTime.now().minusHours(1);
                } else if (i < 8) {
                    status = AssessmentStatus.SUBMITTED;
                    startedAt = LocalDateTime.now().minusDays(1);
                } else {
                    status = AssessmentStatus.EVALUATED;
                    startedAt = LocalDateTime.now().minusDays(2);
                }
                
                Assessment assessment = Assessment.builder()
                        .student(students[i])
                        .topic(topic)
                        .status(status)
                        .assessmentType(AssessmentType.ESSAY)
                        .timeLimitMinutes(90)
                        .wordCountMin(800)
                        .wordCountMax(2000)
                        .startedAt(startedAt)
                        .build();
                assessmentRepository.save(assessment);
                assessmentCount++;
            }
        }

        System.out.println("✓ 검사 " + assessmentCount + "개 생성 완료");

        System.out.println("========================================");
        System.out.println("샘플 데이터 초기화 완료!");
        System.out.println("----------------------------------------");
        System.out.println("교사 2명:");
        System.out.println("  - 김선생 (teacher1@school.com / password: teacher123)");
        System.out.println("  - 이선생 (teacher2@school.com / password: teacher123)");
        System.out.println("----------------------------------------");
        System.out.println("학생 10명:");
        for (int i = 0; i < studentNames.length; i++) {
            System.out.println("  - " + studentNames[i] + " (student" + (i+1) + "@school.com / password: student123)");
        }
        System.out.println("----------------------------------------");
        System.out.println("도서 5권, 논제 10개, 검사 " + assessmentCount + "개 생성");
        System.out.println("========================================");
    }
}
