package com.spring.employeeManagment.repository;

import java.util.*;

import com.spring.employeeManagment.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);

  Boolean existsByUsername(String username);

  Boolean existsByEmail(String email);
  @Query("SELECT user FROM User user LEFT JOIN user.roles role WHERE role.id = 2")
  List<User> findPersonal();
  @Query("SELECT user FROM User user LEFT JOIN user.roles role WHERE role.id = 1")
  List<User> findEmployee();
}
