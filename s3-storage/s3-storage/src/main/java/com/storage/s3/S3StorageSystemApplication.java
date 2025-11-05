package com.storage.s3;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.Map;

@SpringBootApplication
public class S3StorageSystemApplication {
    
    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(S3StorageSystemApplication.class, args);
        
        // Print all registered endpoints
        System.out.println("\n========================================");
        System.out.println("🚀 REGISTERED API ENDPOINTS:");
        System.out.println("========================================");
        
        RequestMappingHandlerMapping mapping = context.getBean(RequestMappingHandlerMapping.class);
        Map<RequestMappingInfo, HandlerMethod> map = mapping.getHandlerMethods();
        
        map.forEach((info, method) -> {
            System.out.println("✅ " + info.getPatternsCondition() + " → " + 
                             method.getBeanType().getSimpleName() + "." + 
                             method.getMethod().getName());
        });
        
        System.out.println("========================================\n");
    }
}