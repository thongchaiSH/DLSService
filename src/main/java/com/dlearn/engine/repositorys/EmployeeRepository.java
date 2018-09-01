package com.dlearn.engine.repositorys;

import com.dlearn.engine.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface EmployeeRepository  extends JpaSpecificationExecutor<Employee>, JpaRepository<Employee, Long> {

}
