package com.storage.s3.service;

import com.storage.s3.dto.ObjectDTO;
import com.storage.s3.entity.Bucket;
import com.storage.s3.entity.StorageObject;
import com.storage.s3.entity.User;
import com.storage.s3.exception.ResourceNotFoundException;
import com.storage.s3.repository.ObjectRepository;
import com.storage.s3.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ObjectService {
    
    private final ObjectRepository objectRepository;
    private final UserRepository userRepository;
    private final BucketService bucketService;
    private final StorageService storageService;
    
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    @Transactional
    public ObjectDTO uploadObject(String bucketName, String objectKey, MultipartFile file) {
        User currentUser = getCurrentUser();
        Bucket bucket = bucketService.getBucketEntity(bucketName, currentUser.getId());
        
        // Check if object already exists (will be replaced)
        objectRepository.findByBucketIdAndObjectKey(bucket.getId(), objectKey)
                .ifPresent(existingObject -> {
                    storageService.delete(existingObject.getStoragePath());
                    objectRepository.delete(existingObject);
                });
        
        // Store the file
        String storagePath = storageService.store(bucketName, objectKey, file);
        String etag = storageService.calculateETag(file);
        
        // Create object metadata
        StorageObject object = new StorageObject();
        object.setBucketId(bucket.getId());
        object.setObjectKey(objectKey);
        object.setSize(file.getSize());
        object.setContentType(file.getContentType());
        object.setEtag(etag);
        object.setStoragePath(storagePath);
        
        object = objectRepository.save(object);
        
        return convertToDTO(object);
    }
    
    public List<ObjectDTO> listObjects(String bucketName) {
        User currentUser = getCurrentUser();
        Bucket bucket = bucketService.getBucketEntity(bucketName, currentUser.getId());
        
        List<StorageObject> objects = objectRepository.findByBucketId(bucket.getId());
        
        return objects.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ObjectDTO getObjectMetadata(String bucketName, String objectKey) {
        User currentUser = getCurrentUser();
        Bucket bucket = bucketService.getBucketEntity(bucketName, currentUser.getId());
        
        StorageObject object = objectRepository.findByBucketIdAndObjectKey(bucket.getId(), objectKey)
                .orElseThrow(() -> new ResourceNotFoundException("Object not found"));
        
        return convertToDTO(object);
    }
    
    public Resource downloadObject(String bucketName, String objectKey) {
        User currentUser = getCurrentUser();
        Bucket bucket = bucketService.getBucketEntity(bucketName, currentUser.getId());
        
        StorageObject object = objectRepository.findByBucketIdAndObjectKey(bucket.getId(), objectKey)
                .orElseThrow(() -> new ResourceNotFoundException("Object not found"));
        
        InputStream inputStream = storageService.load(object.getStoragePath());
        return new InputStreamResource(inputStream);
    }
    
    @Transactional
    public void deleteObject(String bucketName, String objectKey) {
        User currentUser = getCurrentUser();
        Bucket bucket = bucketService.getBucketEntity(bucketName, currentUser.getId());
        
        StorageObject object = objectRepository.findByBucketIdAndObjectKey(bucket.getId(), objectKey)
                .orElseThrow(() -> new ResourceNotFoundException("Object not found"));
        
        storageService.delete(object.getStoragePath());
        objectRepository.delete(object);
    }
    
    private ObjectDTO convertToDTO(StorageObject object) {
        return new ObjectDTO(
                object.getId(),
                object.getObjectKey(),
                object.getSize(),
                object.getContentType(),
                object.getEtag(),
                object.getCreatedAt()
        );
    }
}