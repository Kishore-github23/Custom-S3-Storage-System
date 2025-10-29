package com.storage.s3.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "storage_objects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StorageObject {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "bucket_id", nullable = false)
    private Long bucketId;
    
    @Column(name = "object_key", nullable = false, length = 1024)
    private String objectKey;
    
    @Column(nullable = false)
    private Long size;
    
    @Column(name = "content_type")
    private String contentType;
    
    private String etag;
    
    @Column(name = "storage_path", nullable = false)
    private String storagePath;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}