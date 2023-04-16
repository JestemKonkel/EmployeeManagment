package com.spring.employeeManagment.repository;

import com.spring.employeeManagment.models.Shifts;
import com.spring.employeeManagment.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;


@Repository
public interface ShiftsRepository extends JpaRepository<Shifts, Long> {

    boolean existsByUserAndStartData(User user, LocalDate localDate);
    Shifts findTopByUserOrderByIdDesc(User user);

    List<Shifts> findByStartData(LocalDate date);

    List<Shifts> findByUser(User user);

    List<Shifts> findByUserId(Long user);

    List<Shifts> findByStartDataBetweenAndUser(LocalDate minusDays, LocalDate plusDays, User user);


}
