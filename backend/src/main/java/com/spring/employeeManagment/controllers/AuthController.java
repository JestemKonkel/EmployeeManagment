package com.spring.employeeManagment.controllers;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

import com.spring.employeeManagment.payload.request.PasswordChange;
import com.spring.employeeManagment.models.ERole;
import com.spring.employeeManagment.models.Role;
import com.spring.employeeManagment.models.User;
import com.spring.employeeManagment.payload.request.LoginRequest;
import com.spring.employeeManagment.payload.request.SignupRequest;
import com.spring.employeeManagment.payload.response.JwtResponse;
import com.spring.employeeManagment.payload.response.MessageResponse;
import com.spring.employeeManagment.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.spring.employeeManagment.repository.UserRepository;
import com.spring.employeeManagment.security.jwt.JwtUtils;
import com.spring.employeeManagment.security.services.UserDetailsImpl;
import org.springframework.web.server.ResponseStatusException;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority()).collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), userDetails.getEmail(), roles));
    }

    @PostMapping("/signup")
    @PreAuthorize("hasAuthority('PERSONAL')")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }
        // Create new user's account
        User user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(), signUpRequest.getName(), signUpRequest.getLastname(), encoder.encode(signUpRequest.getPassword()), signUpRequest.getTime(), signUpRequest.getPerHour());

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.EMPLOYEE).orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "manager":
                        Role adminRole = roleRepository.findByName(ERole.MANAGER).orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    case "personal":
                        Role modRole = roleRepository.findByName(ERole.PERSONAL).orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.EMPLOYEE).orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PutMapping("/changePass")
    @PreAuthorize("hasAuthority('PERSONAL') or hasAuthority('EMPLOYEE')")
    public void changePass(@RequestBody PasswordChange passwordChange) {

        User user = userRepository.findById(passwordChange.getUser()).orElseThrow();

        if (encoder.matches(passwordChange.getOldPass(), user.getPassword())) {
            user.setPassword(encoder.encode(passwordChange.getNewPass()));
            userRepository.save(user);

        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Passwords doesn't match");
        }
    }

}
