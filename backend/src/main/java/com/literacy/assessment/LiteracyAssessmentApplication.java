package com.literacy.assessment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class LiteracyAssessmentApplication {

    public static void main(String[] args) {
        SpringApplication.run(LiteracyAssessmentApplication.class, args);
    }

}
