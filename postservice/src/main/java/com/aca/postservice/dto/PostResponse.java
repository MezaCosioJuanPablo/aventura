package com.aca.postservice.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String adventureType;
    private String difficultyLevel;
    private String estimatedDuration;
    private Long userId;
    private String userName;
    private List<String> photos;
    private Integer likesCount;
    private Integer commentsCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
