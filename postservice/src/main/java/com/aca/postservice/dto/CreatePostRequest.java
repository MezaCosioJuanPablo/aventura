package com.aca.postservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreatePostRequest {
    
    @NotBlank(message = "El título es obligatorio")
    private String title;
    
    private String description;
    
    @NotBlank(message = "La ubicación es obligatoria")
    private String location;
    
    private String adventureType;
    
    private String difficultyLevel;
    
    private String estimatedDuration;
    
    @NotNull(message = "El ID del usuario es obligatorio")
    private Long userId;
    
    @NotBlank(message = "El nombre del usuario es obligatorio")
    private String userName;
    
    private List<String> photos;
}
