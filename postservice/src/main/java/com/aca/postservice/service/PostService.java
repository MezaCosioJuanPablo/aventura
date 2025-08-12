package com.aca.postservice.service;

import com.aca.postservice.dto.CreatePostRequest;
import com.aca.postservice.dto.PostResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PostService {
    
    PostResponse createPost(CreatePostRequest request);
    
    PostResponse getPostById(Long id);
    
    Page<PostResponse> getAllPosts(Pageable pageable);
    
    List<PostResponse> getPostsByUserId(Long userId);
    
    Page<PostResponse> searchPosts(String location, String adventureType, Pageable pageable);
    
    List<PostResponse> getPostsByUserIds(List<Long> userIds);
    
    PostResponse updatePost(Long id, CreatePostRequest request);
    
    void deletePost(Long id);
    
    void likePost(Long postId);
    
    void unlikePost(Long postId);
}
