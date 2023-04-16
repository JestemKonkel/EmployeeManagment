package com.spring.employeeManagment.models;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        })
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Size(max = 20)
  private String username;

  @NotBlank
  @Size(max = 50)
  @Email
  private String email;

  @NotBlank
  @Size(max = 20)
  private String name;

  @NotBlank
  @Size(max = 50)
  private String lastname;

  @NotBlank
  @Size(max = 120)
  private String password;

  private TimeOfJob time;

  private Float perHour;

  private Float weeklyRest;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(  name = "user_roles",
          joinColumns = @JoinColumn(name = "user_id"),
          inverseJoinColumns = @JoinColumn(name = "role_id"))
  private Set<Role> roles = new HashSet<>();

  public User() {
  }

  public User(String username, String email, String name, String lastname, String password, TimeOfJob time, Float perHour) {
    this.username = username;
    this.email = email;
    this.name = name;
    this.lastname = lastname;
    this.password = password;
    this.time = time;
    this.perHour = perHour;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getLastname() {
    return lastname;
  }

  public void setLastname(String lastname) {
    this.lastname = lastname;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public TimeOfJob getTime() {
    return time;
  }

  public void setTime(TimeOfJob time) {
    this.time = time;
  }

  public Float getPerHour() {
    return perHour;
  }

  public void setPerHour(Float perHour) {
    this.perHour = perHour;
  }

  public Set<Role> getRoles() {
    return roles;
  }

  public void setRoles(Set<Role> roles) {
    this.roles = roles;
  }

  public Float getWeeklyRest() {
    return weeklyRest;
  }

  public void setWeeklyRest(Float weeklyRest) {
    this.weeklyRest = weeklyRest;
  }
}
