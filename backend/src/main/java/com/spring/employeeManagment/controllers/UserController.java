package com.spring.employeeManagment.controllers;

import com.spring.employeeManagment.models.User;
import com.spring.employeeManagment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    UserRepository userRepository;

    @GetMapping("/find/{id}")
    public User allAccess(@PathVariable String id) {
        User find = userRepository.findById(Long.valueOf(id)).orElseThrow();
        return find;
    }


}
