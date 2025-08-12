package com.aca.postservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Post Service API")
                        .description("API para gestión de publicaciones y fotos de aventuras en Acapulco")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Antonio Salinas")
                                .email("antonio@example.com")
                                .url("https://github.com/antonio"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8081")
                                .description("Servidor de desarrollo"),
                        new Server()
                                .url("https://postservice.aventura.com")
                                .description("Servidor de producción")
                ));
    }
}
