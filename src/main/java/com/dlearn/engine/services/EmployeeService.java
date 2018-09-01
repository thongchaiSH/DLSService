package com.dlearn.engine.services;

import com.dlearn.engine.entity.Employee;

import java.util.List;

public interface EmployeeService {
    List<Employee> listAll();

    Employee saveOrUpdate(Employee employee);

    void delete(Long id);
}
