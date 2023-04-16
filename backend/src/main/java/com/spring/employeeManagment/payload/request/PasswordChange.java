package com.spring.employeeManagment.payload.request;

import javax.validation.constraints.*;

public class PasswordChange {
    @NotBlank
    @Size(min = 3, max = 20)
    private String oldPass;

    @NotBlank
    @Size(min = 3, max = 20)
    private String newPass;

    private Long user;

    public String getOldPass() {
        return oldPass;
    }

    public void setOldPass(String oldPass) {
        this.oldPass = oldPass;
    }

    public String getNewPass() {
        return newPass;
    }

    public void setNewPass(String newPass) {
        this.newPass = newPass;
    }

    public Long getUser() {
        return user;
    }

    public void setUser(Long user) {
        this.user = user;
    }
}
