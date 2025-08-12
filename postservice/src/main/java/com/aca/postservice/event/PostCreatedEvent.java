package com.aca.postservice.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostCreatedEvent {
    
    private Long postId;
    private String title;
    private String location;
    private String adventureType;
    private Long userId;
    private String userName;
    private List<String> photos;
    private LocalDateTime createdAt;
}
