package com.storage.s3.service;

import com.storage.s3.exception.StorageException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

@Service
public class StorageService {
    
    @Value("${storage.location}")
    private String storageLocation;
    
    public String store(String bucketName, String objectKey, MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new StorageException("Failed to store empty file");
            }
            
            Path bucketPath = Paths.get(storageLocation, bucketName);
            Files.createDirectories(bucketPath);
            
            String fileName = objectKey.replace("/", "_");
            Path destinationFile = bucketPath.resolve(fileName);
            
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, 
                        StandardCopyOption.REPLACE_EXISTING);
            }
            
            return destinationFile.toString();
            
        } catch (IOException e) {
            throw new StorageException("Failed to store file", e);
        }
    }
    
    public InputStream load(String storagePath) {
        try {
            Path file = Paths.get(storagePath);
            if (!Files.exists(file)) {
                throw new StorageException("File not found: " + storagePath);
            }
            return Files.newInputStream(file);
        } catch (IOException e) {
            throw new StorageException("Failed to load file", e);
        }
    }
    
    public void delete(String storagePath) {
        try {
            Path file = Paths.get(storagePath);
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new StorageException("Failed to delete file", e);
        }
    }
    
    public String calculateETag(MultipartFile file) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(file.getBytes());
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException | IOException e) {
            throw new StorageException("Failed to calculate ETag", e);
        }
    }
}