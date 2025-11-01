package com.storage.s3.controller;

import com.storage.s3.dto.ObjectDTO;
import com.storage.s3.service.ObjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/buckets/{bucketName}/objects")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class ObjectController {
    
    private final ObjectService objectService;
    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ObjectDTO> uploadObject(
            @PathVariable String bucketName,
            @RequestParam("key") String objectKey,
            @RequestParam("file") MultipartFile file) {
        
        ObjectDTO object = objectService.uploadObject(bucketName, objectKey, file);
        return new ResponseEntity<>(object, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<ObjectDTO>> listObjects(@PathVariable String bucketName) {
        return ResponseEntity.ok(objectService.listObjects(bucketName));
    }
    
    @GetMapping("/{objectKey}")
    public ResponseEntity<Resource> downloadObject(
            @PathVariable String bucketName,
            @PathVariable String objectKey) {
        
        ObjectDTO metadata = objectService.getObjectMetadata(bucketName, objectKey);
        Resource resource = objectService.downloadObject(bucketName, objectKey);
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(metadata.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "attachment; filename=\"" + objectKey + "\"")
                .header("ETag", metadata.getEtag())
                .body(resource);
    }
    
    @GetMapping("/{objectKey}/metadata")
    public ResponseEntity<ObjectDTO> getObjectMetadata(
            @PathVariable String bucketName,
            @PathVariable String objectKey) {
        return ResponseEntity.ok(objectService.getObjectMetadata(bucketName, objectKey));
    }
    
    @DeleteMapping("/{objectKey}")
    public ResponseEntity<Map<String, String>> deleteObject(
            @PathVariable String bucketName,
            @PathVariable String objectKey) {
        
        objectService.deleteObject(bucketName, objectKey);
        return ResponseEntity.ok(Map.of("message", "Object deleted successfully"));
    }
}