package com.aca.postservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    
    public static final String POST_CREATED_QUEUE = "post.created.queue";
    public static final String POST_CREATED_EXCHANGE = "post.created.exchange";
    public static final String POST_CREATED_ROUTING_KEY = "post.created";
    
    public static final String USER_FOLLOW_QUEUE = "user.follow.queue";
    public static final String USER_FOLLOW_EXCHANGE = "user.follow.exchange";
    public static final String USER_FOLLOW_ROUTING_KEY = "user.follow";
    
    @Bean
    public Queue postCreatedQueue() {
        return new Queue(POST_CREATED_QUEUE, true);
    }
    
    @Bean
    public DirectExchange postCreatedExchange() {
        return new DirectExchange(POST_CREATED_EXCHANGE);
    }
    
    @Bean
    public Binding postCreatedBinding(Queue postCreatedQueue, DirectExchange postCreatedExchange) {
        return BindingBuilder.bind(postCreatedQueue)
                .to(postCreatedExchange)
                .with(POST_CREATED_ROUTING_KEY);
    }
    
    @Bean
    public Queue userFollowQueue() {
        return new Queue(USER_FOLLOW_QUEUE, true);
    }
    
    @Bean
    public DirectExchange userFollowExchange() {
        return new DirectExchange(USER_FOLLOW_EXCHANGE);
    }
    
    @Bean
    public Binding userFollowBinding(Queue userFollowQueue, DirectExchange userFollowExchange) {
        return BindingBuilder.bind(userFollowQueue)
                .to(userFollowExchange)
                .with(USER_FOLLOW_ROUTING_KEY);
    }
    
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
    
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
}
