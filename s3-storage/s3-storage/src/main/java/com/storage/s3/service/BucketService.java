package com.storage.s3.service;

import com.storage.s3.dto.BucketDTO;
import com.storage.s3.entity.Bucket;
import com.storage.s3.entity.User;
import com.storage.s3.exception.ResourceNotFoundException;
import com.storage.s3.repository.BucketRepository;
import com.storage.s3.repository.ObjectRepository;
import com.storage.s3.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BucketService {
    
    private final BucketRepository bucketRepository;
    private final ObjectRepository objectRepository;
    private final UserRepository userRepository;
    
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    public BucketDTO createBucket(String name, Boolean isPublic) {
        User currentUser = getCurrentUser();
        
        // Validate bucket name
        if (!isValidBucketName(name)) {
            throw new IllegalArgumentException(
                "Bucket name must be between 3 and 63 characters, " +
                "start and end with a lowercase letter or number, " +
                "and contain only lowercase letters, numbers, and hyphens"
            );
        }
        
        if (bucketRepository.existsByName(name)) {
            throw new IllegalArgumentException("Bucket name already exists");
        }
        
        Bucket bucket = new Bucket();
        bucket.setName(name);
        bucket.setOwnerId(currentUser.getId());
        bucket.setIsPublic(isPublic != null ? isPublic : false);
        
        bucket = bucketRepository.save(bucket);
        
        return convertToDTO(bucket, 0L);
    }
    
    public List<BucketDTO> listBuckets() {
        User currentUser = getCurrentUser();
        System.out.println("📧 Current user email: " + currentUser.getEmail());
        System.out.println("🆔 Current user ID: " + currentUser.getId());
        
        List<Bucket> buckets = bucketRepository.findByOwnerId(currentUser.getId());
        System.out.println("📦 Found " + buckets.size() + " buckets");
        
        return buckets.stream()
                .map(bucket -> {
                    long objectCount = objectRepository.countByBucketId(bucket.getId());
                    return convertToDTO(bucket, objectCount);
                })
                .collect(Collectors.toList());
    }
    
    public BucketDTO getBucket(String name) {
        User currentUser = getCurrentUser();
        Bucket bucket = bucketRepository.findByNameAndOwnerId(name, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Bucket not found"));
        
        long objectCount = objectRepository.countByBucketId(bucket.getId());
        return convertToDTO(bucket, objectCount);
    }
    
    @Transactional
    public void deleteBucket(String name) {
        User currentUser = getCurrentUser();
        Bucket bucket = bucketRepository.findByNameAndOwnerId(name, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Bucket not found"));
        
        long objectCount = objectRepository.countByBucketId(bucket.getId());
        if (objectCount > 0) {
            throw new IllegalStateException("Cannot delete bucket with objects. Delete all objects first.");
        }
        
        bucketRepository.delete(bucket);
    }
    
    public BucketDTO updateBucketVisibility(String name, Boolean isPublic) {
        User currentUser = getCurrentUser();
        Bucket bucket = bucketRepository.findByNameAndOwnerId(name, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Bucket not found"));
        
        bucket.setIsPublic(isPublic);
        bucket = bucketRepository.save(bucket);
        
        long objectCount = objectRepository.countByBucketId(bucket.getId());
        return convertToDTO(bucket, objectCount);
    }
    
    private boolean isValidBucketName(String name) {
        if (name == null || name.length() < 3 || name.length() > 63) {
            return false;
        }
        return name.matches("^[a-z0-9][a-z0-9-]*[a-z0-9]$");
    }
    
    private BucketDTO convertToDTO(Bucket bucket, Long objectCount) {
        return new BucketDTO(
                bucket.getId(),
                bucket.getName(),
                bucket.getIsPublic(),
                objectCount,
                bucket.getCreatedAt()
        );
    }
    
    // Helper method for ObjectService
    public Bucket getBucketEntity(String name, Long userId) {
        return bucketRepository.findByNameAndOwnerId(name, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Bucket not found"));
    }
}