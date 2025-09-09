package org.example.todoprojectmanagerbackend.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // autorise toutes les routes du backend
                        .allowedOrigins("http://localhost:4200") // autorise Angular
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // toutes les méthodes HTTP
                        .allowedHeaders("*") // tous les headers
                        .allowCredentials(true); // autorise l’envoi des cookies et JWT
            }
        };
    }
}
