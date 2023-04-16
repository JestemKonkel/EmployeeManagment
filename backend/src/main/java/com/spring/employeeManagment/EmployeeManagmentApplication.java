package com.spring.employeeManagment;

import com.spring.employeeManagment.models.ERole;
import com.spring.employeeManagment.models.Role;
import com.spring.employeeManagment.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class EmployeeManagmentApplication {

	private static RoleRepository roleRepository;


	@Autowired
	public EmployeeManagmentApplication(RoleRepository roleRepository){
		this.roleRepository = roleRepository;
	}
	public static void main(String[] args) {
    SpringApplication.run(EmployeeManagmentApplication.class, args);
	if(roleRepository.count() == 0) {

		Role startRoleUser = new Role(ERole.EMPLOYEE);
		Role startRoleModerator = new Role(ERole.PERSONAL);
		Role startRoleAdmin = new Role(ERole.MANAGER);

		roleRepository.save(startRoleUser);
		roleRepository.save(startRoleModerator);
		roleRepository.save(startRoleAdmin);
	}

	}




}
