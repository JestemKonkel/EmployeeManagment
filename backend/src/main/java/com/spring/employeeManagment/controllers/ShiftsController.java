package com.spring.employeeManagment.controllers;

import com.spring.employeeManagment.repository.ShiftsRepository;
import com.spring.employeeManagment.repository.UserRepository;
import com.spring.employeeManagment.models.Shifts;
import com.spring.employeeManagment.models.TimeOfJob;
import com.spring.employeeManagment.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.*;
import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/shift")
public class ShiftsController {
    @Autowired
    ShiftsRepository shiftsRepository;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('PERSONAL')")
    public void addShift(@Valid @RequestBody Shifts shifts) {
            if (shifts.getUser() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee not selected");
            }

            if (shifts.getHours() > 0) {
                if (shifts.getHours() < 5) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Work time can't be less than 5 hours");
                }
                if (shifts.getHours() > 12) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Work time can't be more than 12 hours");
                }
            }

            checkDates(shifts.getStartData(), shifts.getEndData(), shifts.getStartTime(), shifts.getEndTime());

            if (shiftsRepository.count() != 0) {
                if (shiftsRepository.existsByUserAndStartData(shifts.getUser(), shifts.getStartData())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee works on that day!!!");
                }

                Shifts lastShift = shiftsRepository.findTopByUserOrderByIdDesc(shifts.getUser());

                if (lastShift != null) {
                    checkDaily(lastShift.getEndData() + " " + lastShift.getEndTime(), shifts.getStartData() + " " + shifts.getStartTime(), shifts.getUser());
                    checkWeekly(shifts.getStartData().toString(), shifts.getUser());
                    checkMonthly(shifts.getUser(), shifts.getStartData(), shifts.getHours(), shifts);
                }
                shiftsRepository.save(shifts);
                throw new ResponseStatusException(HttpStatus.CREATED, "First shift for this employee is added!!!");
            } else {
                shiftsRepository.save(shifts);
                throw new ResponseStatusException(HttpStatus.CREATED, "First shift is added!!!");
            }

    }

    public void checkDates(LocalDate start_date, LocalDate end_date, LocalTime start_time, LocalTime end_time) {
        if (end_date.isBefore(start_date)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date can't be before start date");
        }
        if (end_time.isBefore(start_time) && start_date.isEqual(end_date)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End time can't be before start time for the same day");
        }
        if (end_time.equals(start_time) && start_date.isEqual(end_date)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start and end have to be different");
        }

    }

    public void checkDaily(String start_date, String end_date, User user) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        try {
            Date d1 = sdf.parse(start_date);
            Date d2 = sdf.parse(end_date);

            float difference_In_Time = d2.getTime() - d1.getTime();
            float difference_In_Hours = (difference_In_Time / (1000 * 60 * 60));


            if (difference_In_Hours < 11) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Daily rest wasn't fulfilled");
            }
            User employee = userRepository.findByUsername(user.getUsername()).orElseThrow();

            employee.setWeeklyRest(difference_In_Hours);


        } catch (ParseException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date format is incompatible");
        }

    }

    public void checkWeekly(String start_date, User user) {
        LocalDate date = LocalDate.parse(start_date);
        int dayOfWeek = date.getDayOfWeek().getValue();
        int first = dayOfWeek - 1;
        int last = 7 - dayOfWeek;

        List<Shifts> employeeDays = shiftsRepository.findByStartDataBetweenAndUser(date.minusDays(first), date.plusDays(last), user);
        int count = 0;
        for (Shifts i : employeeDays) {
            if (i.getStartData().getMonthValue() == date.getMonthValue()) {
                count++;
            }
        }
        if (count >= 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Weekly rest won't fulfilled");
        }

    }

    public void checkMonthly(User user, LocalDate date, float newHours , Shifts shifts) {
        //obliczanie dni pracujących
        int month = date.getMonthValue();
        int numberOfDays = new Date(date.getYear(), month, 0).getDate();
        int weekends = 0;

        for (int i = 0; i < numberOfDays; i++) {
            LocalDate day = LocalDate.of(date.getYear(), date.getMonth(), 1);
            if (day.plusDays(i).getDayOfWeek().equals(DayOfWeek.SATURDAY) |day.plusDays(i).getDayOfWeek().equals(DayOfWeek.SUNDAY)) {
                weekends++;
            }
        }

        int workDays = numberOfDays - weekends;

        float workHours = 0;
        float weeklyHours = 0;
        TimeOfJob vacancy = user.getTime();

        switch (vacancy) {
            case FULL:
                workHours = workDays * 8;
                weeklyHours = (workDays * 8) / 4 ;
                break;
            case THREEFOURTH:
                workHours = (workDays * 8) - 1;
                weeklyHours = (float) (((workDays * 8) * 0.75) / 4);
                break;

            case HALF:
                workHours = (int) ((workDays * 0.75) - 1);
                weeklyHours = (float) (((workDays * 8) * 0.5) / 4);
                break;

            case QUARTER:
                workHours = (int) ((workDays * 0.5) - 1);
                weeklyHours = (float) (((workDays * 8) * 0.25) / 4);
                break;
        }

        //godziny pracujące w danym miesiącu
        List<Shifts> employeeShifts = shiftsRepository.findByUser(user);
        float hoursInMonth = 0;
        for (Shifts i : employeeShifts) {
            if (i.getStartData().getMonthValue() == month) {
                hoursInMonth += i.getHours();
            }
        }

        if ((hoursInMonth + newHours) > workHours) {
            int surplus = (int) ((hoursInMonth + newHours) - workHours);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee will be have" +surplus+ " hours to much");
        }
        shiftsRepository.save(shifts);

        int dayOfWeek = date.getDayOfWeek().getValue();
        int first = dayOfWeek - 1;
        int last = 7 - dayOfWeek;

        List<Shifts> employeeShiftWeek = shiftsRepository.findByStartDataBetweenAndUser(date.minusDays(first), date.plusDays(last), user);
        float hoursInWeek = 0;
        for (Shifts i : employeeShiftWeek) {
            hoursInWeek += i.getHours();
        }

        if(hoursInWeek > weeklyHours){
            throw new ResponseStatusException(HttpStatus.CREATED, "Weekly hours standard has been exceeded by" +" "+ ((weeklyHours - hoursInWeek) * -1 ) +"\r\n"+
                                                                  "For this employee remind "+(workHours - hoursInMonth)+" monthly hours");
        }
        else{
            throw new ResponseStatusException(HttpStatus.CREATED, "For this employee remind "+(weeklyHours - hoursInWeek)+" weekly hours" + "\r\n"+
                                                                  "For this employee remind "+(workHours - hoursInMonth)+" monthly hours");
        }


    }


    @GetMapping("/personalSchedule")
    @PreAuthorize("hasAuthority('PERSONAL')")
    public List<Shifts> getShifts(@RequestParam String date) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
        Date convertDate = sdf.parse(date);
        LocalDate correctDate = convertDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        List<Shifts> shifts = shiftsRepository.findByStartData(correctDate);

        return shifts;

    }

    @GetMapping("/employeeSchedule")
    @PreAuthorize("hasAuthority('PERSONAL') or hasAuthority('EMPLOYEE')")
    public List<Shifts> getEmployeeShifts(@RequestParam Long user) {

        List<Shifts> shifts = shiftsRepository.findByUserId(user);

        return shifts;

    }

}
