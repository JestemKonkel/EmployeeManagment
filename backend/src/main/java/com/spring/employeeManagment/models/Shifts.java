package com.spring.employeeManagment.models;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.time.LocalTime;

import javax.persistence.*;

@Entity
@Table(name = "shifts")
public class Shifts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate startData;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate endData;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime startTime;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime endTime;

    private Float hours;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Shifts() {
    }

    public Shifts(LocalDate startData, LocalDate endData, LocalTime startTime, LocalTime endTime, Float hours, User user) {
        this.startData = startData;
        this.endData = endData;
        this.startTime = startTime;
        this.endTime = endTime;
        this.hours = hours;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getStartData() {
        return startData;
    }

    public void setStartData(LocalDate startData) {
        this.startData = startData;
    }

    public LocalDate getEndData() {
        return endData;
    }

    public void setEndData(LocalDate endData) {
        this.endData = endData;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public Float getHours() {
        return hours;
    }

    public void setHours(Float hours) {
        this.hours = hours;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
