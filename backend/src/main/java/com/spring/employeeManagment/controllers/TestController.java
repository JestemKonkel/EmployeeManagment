package com.spring.employeeManagment.controllers;

import com.spring.employeeManagment.models.TimeOfJob;
import com.spring.employeeManagment.models.User;
import com.spring.employeeManagment.repository.RoleRepository;
import com.spring.employeeManagment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @GetMapping("/check")
    public ResponseEntity<Boolean> allAccess() {
        List<User> find = userRepository.findPersonal();
        if (find.isEmpty()) {
            return ResponseEntity.badRequest().body(false);
        }
        return ResponseEntity.ok().body(true);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('PERSONAL')")
    public List<User> allEmployee() {
        List<User> employee = userRepository.findEmployee();

        return employee;
    }

    @GetMapping("/timeOfJob")
    public TimeOfJob[] getTime() {
        return TimeOfJob.values();
    }



}
