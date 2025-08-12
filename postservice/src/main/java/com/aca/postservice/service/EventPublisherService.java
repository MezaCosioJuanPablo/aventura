package com.aca.postservice.service;

import com.aca.postservice.event.PostCreatedEvent;
import com.aca.postservice.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventPublisherService {
    
    private final RabbitTemplate rabbitTemplate;
    
    public void publishPostCreatedEvent(PostCreatedEvent event) {
        try {
            log.info("Publicando evento de publicación creada: {}", event.getPostId());
            rabbitTemplate.convertAndSend(
                RabbitMQConfig.POST_CREATED_EXCHANGE,
                RabbitMQConfig.POST_CREATED_ROUTING_KEY,
                event
            );
            log.info("Evento de publicación creada publicado exitosamente");
        } catch (Exception e) {
            log.error("Error al publicar evento de publicación creada: {}", e.getMessage(), e);
        }
    }
}
