package com.literacy.assessment.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class OpenAIConfig {
    
    @Value("${openai.api.key:}")
    private String apiKey;
    
    @Value("${openai.api.url:https://api.openai.com/v1}")
    private String apiUrl;
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    
    public String getApiKey() {
        if (apiKey != null && !apiKey.isBlank()) {
            return apiKey;
        }

        String envKey = System.getenv("OPENAI_API_KEY");
        return envKey != null ? envKey : "";
    }
    
    public String getApiUrl() {
        if (apiUrl != null && !apiUrl.isBlank()) {
            return apiUrl;
        }

        String envUrl = System.getenv("OPENAI_API_URL");
        return (envUrl != null && !envUrl.isBlank())
                ? envUrl
                : "https://api.openai.com/v1";
    }
}
