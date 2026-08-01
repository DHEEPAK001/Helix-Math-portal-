package com.mathlms.controller;

import com.mathlms.dto.ChatRequest;
import com.mathlms.dto.ChatResponse;
import com.mathlms.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/chat")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER')")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String reply = aiService.chat(request.getMessage(), request.getContext());
        return ResponseEntity.ok(new ChatResponse(reply));
    }
}
