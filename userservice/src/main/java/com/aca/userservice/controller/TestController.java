package com.aca.userservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {

    @GetMapping
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Test endpoint funcionando");
    }

    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> options() {
        return ResponseEntity.ok().build();
    }
}
