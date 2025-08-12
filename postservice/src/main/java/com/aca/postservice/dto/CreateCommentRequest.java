package com.aca.postservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateCommentRequest {
    
    @NotBlank(message = "El contenido del comentario es obligatorio")
    private String content;
    
    @NotNull(message = "El ID del post es obligatorio")
    private Long postId;
    
    @NotNull(message = "El ID del usuario es obligatorio")
    private Long userId;
    
    @NotBlank(message = "El nombre del usuario es obligatorio")
    private String userName;
}
