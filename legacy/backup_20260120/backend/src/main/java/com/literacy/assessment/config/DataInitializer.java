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
        // ?´ë? ?°ì´?°ê? ?ˆìœ¼ë©?ê¸°ë³¸ ê³„ì •ë§?ë³´ê°•?˜ê³  ì´ˆê¸°??ê±´ë„ˆ?°ê¸°
        if (userRepository.count() > 0) {
            ensureBaseUsers();
            System.out.println("========================================");
            System.out.println("?°ì´?°ê? ?´ë? ì¡´ì¬?©ë‹ˆ?? ì´ˆê¸°?”ë? ê±´ë„ˆ?ë‹ˆ??");
            System.out.println("========================================");
            return;
        }

        System.out.println("========================================");
        System.out.println("?˜í”Œ ?°ì´??ì´ˆê¸°?”ë? ?œì‘?©ë‹ˆ??..");
        System.out.println("========================================");

        // 1. êµì‚¬ 2ëª??ì„±
        User teacher1 = User.builder()
                .email("teacher1@school.com")
                .passwordHash("ehrtjtoanfruf") // ?¤ì œë¡œëŠ” ?”í˜¸?”ëœ ë¹„ë?ë²ˆí˜¸
                .name("ê¹€? ìƒ")
                .userType(UserType.TEACHER)
                .schoolName("?œìš¸ì´ˆë“±?™êµ")
                .phone("010-1111-1111")
                .isActive(true)
                .build();
        userRepository.save(teacher1);
        System.out.println("??êµì‚¬ ?ì„±: " + teacher1.getName() + " (" + teacher1.getEmail() + ")");

        User teacher2 = User.builder()
                .email("teacher2@school.com")
                .passwordHash("ehrtjtoanfruf")
                .name("?´ì„ ??)
                .userType(UserType.TEACHER)
                .schoolName("?œìš¸ì´ˆë“±?™êµ")
                .phone("010-2222-2222")
                .isActive(true)
                .build();
        userRepository.save(teacher2);
        System.out.println("??êµì‚¬ ?ì„±: " + teacher2.getName() + " (" + teacher2.getEmail() + ")");
        // 1-1. ?™ë?ëª?ê´€ë¦¬ì ?ì„±
        User parent1 = User.builder()
                .email("parent1@school.com")
                .passwordHash("ehrtjtoanfruf")
                .name("ë°•í•™ë¶€ëª?)
                .userType(UserType.PARENT)
                .phone("010-3333-3333")
                .isActive(true)
                .build();
        userRepository.save(parent1);
        System.out.println("? ?™ë?ëª??ì„±: " + parent1.getName() + " (" + parent1.getEmail() + ")");

        User admin1 = User.builder()
                .email("admin@school.com")
                .passwordHash("ehrtjtoanfruf")
                .name("ê´€ë¦¬ì")
                .userType(UserType.ADMIN)
                .phone("010-9999-9999")
                .isActive(true)
                .build();
        userRepository.save(admin1);
        System.out.println("? ê´€ë¦¬ì ?ì„±: " + admin1.getName() + " (" + admin1.getEmail() + ")");

        // 2. ?™ìƒ 10ëª??ì„±
        String[] studentNames = {
                "ê¹€ë¯¼ì?", "?´ì„œ??, "ë°•ì???, "ìµœìœ ì§?, "?•ë„??,
                "ê°•ì„œì¤€", "ì¡°ë???, "?¤ì˜ˆì¤€", "?„í•˜?€", "?œì???
        };
        
        String[] grades = {"3?™ë…„", "3?™ë…„", "4?™ë…„", "4?™ë…„", "5?™ë…„", 
                          "5?™ë…„", "6?™ë…„", "6?™ë…„", "4?™ë…„", "5?™ë…„"};

        for (int i = 0; i < studentNames.length; i++) {
            User student = User.builder()
                    .email("student" + (i + 1) + "@school.com")
                    .passwordHash("ehrtjtoanfruf")
                    .name(studentNames[i])
                    .userType(UserType.STUDENT)
                    .schoolName("?œìš¸ì´ˆë“±?™êµ")
                    .grade(Integer.parseInt(grades[i].substring(0, 1)))
                    .birthDate(LocalDate.of(2014 + (i % 4), (i % 12) + 1, (i % 28) + 1))
                    .phone("010-" + String.format("%04d", 3000 + i) + "-" + String.format("%04d", 1000 + i))
                    .isActive(true)
                    .build();
            userRepository.save(student);
            System.out.println("???™ìƒ ?ì„±: " + student.getName() + " (" + grades[i] + ", " + student.getEmail() + ")");
        }

        // 3. ?„ì„œ 5ê¶??ì„±
        Book book1 = Book.builder()
                .title("?´ë¦° ?•ì")
                .author("?í…ì¥í˜ë¦?)
                .publisher("ë¬¸í•™?™ë„¤")
                .isbn("9788958280661")
                .publishedYear(2015)
                .category("ë¬¸í•™")
                .difficultyLevel(DifficultyLevel.ELEMENTARY)
                .description("?¬ë§‰??ë¶ˆì‹œì°©í•œ ë¹„í–‰?¬ê? ?´ë¦° ?•ìë¥?ë§Œë‚˜ë©?ê²ªëŠ” ?´ì•¼ê¸?)
                .build();
        bookRepository.save(book1);

        Book book2 = Book.builder()
                .title("?™ë¬¼?ì¥")
                .author("ì¡°ì? ?¤ì›°")
                .publisher("ë¯¼ìŒ??)
                .isbn("9788937460449")
                .publishedYear(2009)
                .category("?Œì„¤")
                .difficultyLevel(DifficultyLevel.MIDDLE)
                .description("?™ë¬¼?¤ì´ ?ì¥???´ì˜?˜ë©° ë²Œì–´ì§€???ì ?°í™”")
                .build();
        bookRepository.save(book2);

        Book book3 = Book.builder()
                .title("?´ë¦¬?¬í„°?€ ë§ˆë²•?¬ì˜ ??)
                .author("J.K. ë¡¤ë§")
                .publisher("ë¬¸í•™?˜ì²©")
                .isbn("9788983920959")
                .publishedYear(1999)
                .category("?í?ì§€")
                .difficultyLevel(DifficultyLevel.MIDDLE)
                .description("ë§ˆë²• ?™êµ???…í•™???´ë¦¬?¬í„°??ëª¨í—˜")
                .build();
        bookRepository.save(book3);

        Book book4 = Book.builder()
                .title("?°ê¸ˆ? ì‚¬")
                .author("?Œìš¸ë¡?ì½”ì—˜ë£?)
                .publisher("ë¬¸í•™?™ë„¤")
                .isbn("9788982814471")
                .publishedYear(2001)
                .category("ë¬¸í•™")
                .difficultyLevel(DifficultyLevel.HIGH)
                .description("?ì‹ ???´ëª…??ì°¾ì•„ê°€???‘ì¹˜ê¸??Œë…„???¬í–‰")
                .build();
        bookRepository.save(book4);

        Book book5 = Book.builder()
                .title("?°ë???)
                .author("?¤ë¥´ë§??¤ì„¸")
                .publisher("ë¯¼ìŒ??)
                .isbn("9788937460784")
                .publishedYear(2000)
                .category("ë¬¸í•™")
                .difficultyLevel(DifficultyLevel.HIGH)
                .description("???Œë…„???´ë©´ ?±ì¥ê³??ì•„ ë°œê²¬???´ì•¼ê¸?)
                .build();
        bookRepository.save(book5);

        System.out.println("???„ì„œ 5ê¶??ì„± ?„ë£Œ");

        // 4. ?¼ì œ(Topic) 10ê°??ì„±
        Topic topic1 = Topic.builder()
                .book(book1)
                .topicText("?´ë¦° ?•ìê°€ ?¬ëŸ¬ ë³„ì„ ?¬í–‰?˜ë©° ë§Œë‚œ ?´ë¥¸?¤ì„ ?µí•´ ?‘ê?ê°€ ?„í•˜ê³ ì ?˜ëŠ” ë©”ì‹œì§€??ë¬´ì—‡?¸ê???")
                .topicType(TopicType.ANALYTICAL)
                .difficultyLevel(2)
                .keywords("ë³¸ì§ˆ, ê´€ê³? ?´ë¥¸, ê°€ì¹?)
                .build();
        topicRepository.save(topic1);

        Topic topic2 = Topic.builder()
                .book(book1)
                .topicText("?¬ìš°ê°€ ?´ë¦° ?•ì?ê²Œ 'ê¸¸ë“¤?¸ë‹¤'??ê²ƒì˜ ?˜ë?ë¥??¤ëª…?©ë‹ˆ?? ?´ê²ƒ???°ë¦¬???¸ê°„ê´€ê³„ì— ?´ë–¤ ?˜ë?ë¥?ì¤„ê¹Œ??")
                .topicType(TopicType.CREATIVE)
                .difficultyLevel(3)
                .keywords("ê¸¸ë“¤?? ê´€ê³? ì±…ì„, ? ë?ê°?)
                .build();
        topicRepository.save(topic2);

        Topic topic3 = Topic.builder()
                .book(book2)
                .topicText("?™ë¬¼?ì¥?ì„œ ?¼ì??¤ì´ ê¶Œë ¥???¡ì? ??ë³€?”í•˜??ê³¼ì •??ë¶„ì„?˜ê³ , ?´ê²ƒ???„ì‹¤ ?¬íšŒ??ì£¼ëŠ” êµí›ˆ?€ ë¬´ì—‡?¸ê???")
                .topicType(TopicType.CRITICAL)
                .difficultyLevel(4)
                .keywords("ê¶Œë ¥, ë¶€?? ?‰ë“±, ?…ì¬")
                .build();
        topicRepository.save(topic3);

        Topic topic4 = Topic.builder()
                .book(book3)
                .topicText("?´ë¦¬?¬í„°ê°€ ?¸ê·¸?€?¸ì—??ì§„ì •???©ê¸°ë¥?ë°œíœ˜???œê°„??ì°¾ì•„ ?¤ëª…?˜ê³ , ?©ê¸°???˜ë?ë¥??¼í•˜?œì˜¤.")
                .topicType(TopicType.ANALYTICAL)
                .difficultyLevel(2)
                .keywords("?©ê¸°, ?°ì •, ?¬ìƒ, ?±ì¥")
                .build();
        topicRepository.save(topic4);

        Topic topic5 = Topic.builder()
                .book(book3)
                .topicText("ë§Œì•½ ?¹ì‹ ???¸ê·¸?€???™ìƒ?´ë¼ë©??´ë–¤ ê¸°ìˆ™?¬ì— ë°°ì •ë°›ê³  ?¶ìœ¼ë©? ê·??´ìœ ??ë¬´ì—‡?¸ê???")
                .topicType(TopicType.CREATIVE)
                .difficultyLevel(1)
                .keywords("ê¸°ìˆ™?? ê°€ì¹˜ê?, ?•ì²´?? ? íƒ")
                .build();
        topicRepository.save(topic5);

        Topic topic6 = Topic.builder()
                .book(book4)
                .topicText("?°í‹°?„ê³ ê°€ ?ì‹ ??'ê°œì¸?ì¸ ? í™”'ë¥?ì°¾ì•„ê°€???¬ì •?ì„œ ë§Œë‚œ ?¸ë¬¼?¤ì˜ ??• ??ë¶„ì„?˜ì‹œ??")
                .topicType(TopicType.ANALYTICAL)
                .difficultyLevel(4)
                .keywords("?´ëª…, ì¡°ë ¥?? ?±ì¥, ê¹¨ë‹¬??)
                .build();
        topicRepository.save(topic6);

        Topic topic7 = Topic.builder()
                .book(book4)
                .topicText("?¹ì‹ ??'ê°œì¸?ì¸ ? í™”'??ë¬´ì—‡?´ë©°, ê·¸ê²ƒ???´ë£¨ê¸??„í•´ ?´ë–¤ ?¸ë ¥????ê²ƒì¸ê°€??")
                .topicType(TopicType.CREATIVE)
                .difficultyLevel(3)
                .keywords("ê¿? ëª©í‘œ, ?¸ë ¥, ?ì•„?¤í˜„")
                .build();
        topicRepository.save(topic7);

        Topic topic8 = Topic.builder()
                .book(book5)
                .topicText("?±í´?ˆì–´???±ì¥ ê³¼ì •?ì„œ ?°ë??ˆì´ ë¯¸ì¹œ ?í–¥??ë¶„ì„?˜ê³ , ë©˜í† ??ì¤‘ìš”?±ì„ ?¼í•˜?œì˜¤.")
                .topicType(TopicType.CRITICAL)
                .difficultyLevel(5)
                .keywords("ë©˜í† , ?±ì¥, ?ì•„, ?í–¥")
                .build();
        topicRepository.save(topic8);

        Topic topic9 = Topic.builder()
                .book(book5)
                .topicText("'?Œì—???˜ì˜¤?¤ëŠ” ?ˆëŠ” ?˜ë‚˜???¸ê³„ë¥?ê¹¨ëœ¨?¤ì•¼ ?œë‹¤'??êµ¬ì ˆ???˜ë?ë¥??´ì„?˜ì‹œ??")
                .topicType(TopicType.ANALYTICAL)
                .difficultyLevel(4)
                .keywords("ë³€?? ?±ì¥, ê·¹ë³µ, ?„ìƒ")
                .build();
        topicRepository.save(topic9);

        Topic topic10 = Topic.builder()
                .book(book2)
                .topicText("?™ë¬¼?ì¥??ê²°ë§?ì„œ ?™ë¬¼?¤ì´ ?¼ì??€ ?¸ê°„??êµ¬ë³„?˜ì? ëª»í•˜???¥ë©´???ì§•???˜ë?ë¥??¤ëª…?˜ì‹œ??")
                .topicType(TopicType.CRITICAL)
                .difficultyLevel(5)
                .keywords("ê¶Œë ¥, ?€?? ë³¸ì§ˆ, ?ì")
                .build();
        topicRepository.save(topic10);

        System.out.println("???¼ì œ 10ê°??ì„± ?„ë£Œ");

        // 5. ê²€??Assessment) ?˜í”Œ ?°ì´???ì„± (?™ìƒ 10ëª…ì—ê²?ê°ê° 1-2ê°œì”©)
        User[] students = userRepository.findByUserType(UserType.STUDENT).toArray(new User[0]);
        Topic[] topics = topicRepository.findAll().toArray(new Topic[0]);

        int assessmentCount = 0;
        for (int i = 0; i < students.length; i++) {
            // ê°??™ìƒ?ê²Œ 1-2ê°œì˜ ê²€??ë°°ì •
            int numAssessments = (i % 2) + 1; // 1 ?ëŠ” 2
            
            for (int j = 0; j < numAssessments; j++) {
                Topic topic = topics[(i + j) % topics.length];
                
                AssessmentStatus status;
                LocalDateTime startedAt = null;
                
                // ?¤ì–‘???íƒœ ë¶€??
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

        System.out.println("??ê²€??" + assessmentCount + "ê°??ì„± ?„ë£Œ");

        System.out.println("========================================");
        System.out.println("?˜í”Œ ?°ì´??ì´ˆê¸°???„ë£Œ!");
        System.out.println("----------------------------------------");
        System.out.println("êµì‚¬ 2ëª?");
        System.out.println("  - ê¹€? ìƒ (teacher1@school.com / password: ehrtjtoanfruf)");
        System.out.println("  - ?´ì„ ??(teacher2@school.com / password: ehrtjtoanfruf)");
        System.out.println("----------------------------------------");
        System.out.println("?™ë?ëª?ê´€ë¦¬ì:");
        System.out.println("  - ë°•í•™ë¶€ëª?(parent1@school.com / password: ehrtjtoanfruf)");
        System.out.println("  - ê´€ë¦¬ì (admin@school.com / password: ehrtjtoanfruf)");
        System.out.println("----------------------------------------");
        System.out.println("?™ìƒ 10ëª?");
        for (int i = 0; i < studentNames.length; i++) {
            System.out.println("  - " + studentNames[i] + " (student" + (i+1) + "@school.com / password: ehrtjtoanfruf)");
        }
        System.out.println("----------------------------------------");
        System.out.println("?„ì„œ 5ê¶? ?¼ì œ 10ê°? ê²€??" + assessmentCount + "ê°??ì„±");
        System.out.println("========================================");
    }

    private void ensureBaseUsers() {
        ensureUser("teacher1@school.com", "ê¹€? ìƒ", UserType.TEACHER, "010-1111-1111", "?œìš¸ì´ˆë“±?™êµ", null);
        ensureUser("teacher2@school.com", "?´ì„ ??, UserType.TEACHER, "010-2222-2222", "?œìš¸ì´ˆë“±?™êµ", null);
        ensureUser("parent1@school.com", "ë°•í•™ë¶€ëª?, UserType.PARENT, "010-3333-3333", null, null);
        ensureUser("admin@school.com", "ê´€ë¦¬ì", UserType.ADMIN, "010-9999-9999", null, null);
    }

    private void ensureUser(
            String email,
            String name,
            UserType userType,
            String phone,
            String schoolName,
            Integer grade
    ) {
        if (userRepository.existsByEmail(email)) {
            return;
        }

        User user = User.builder()
                .email(email)
                .passwordHash("ehrtjtoanfruf")
                .name(name)
                .userType(userType)
                .schoolName(schoolName)
                .phone(phone)
                .grade(grade)
                .isActive(true)
                .build();
        userRepository.save(user);
        System.out.println("? ê¸°ë³¸ ê³„ì • ?ì„±: " + user.getName() + " (" + user.getEmail() + ")");
    }
}


