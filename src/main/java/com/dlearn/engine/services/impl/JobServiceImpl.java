package com.dlearn.engine.services.impl;

import com.dlearn.engine.controllers.DLSApplicationController;
import com.dlearn.engine.entity.AOTEmployee;
import com.dlearn.engine.entity.Employee;
import com.dlearn.engine.services.AOTService;
import com.dlearn.engine.services.EmployeeService;
import com.dlearn.engine.services.JobService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobServiceImpl implements JobService {
    static final Logger LOGGER = LoggerFactory.getLogger(JobServiceImpl.class);

    @Autowired
    AOTService aotService;
    @Autowired
    EmployeeService employeeService;

    @Override
    public void autoInsertOrUpdateEmployee() {

        try {
            Long start = System.currentTimeMillis();
            Integer rowEmployee=aotService.employeeRowCount();
            List<AOTEmployee> aotEmployeeList = aotService.getAOTEmployee("1", rowEmployee.toString(), "2");
            for (AOTEmployee aotEmployee : aotEmployeeList) {
                Employee employee = new Employee();
                employee.setFirstname(aotEmployee.getFirstname());
                employee.setLastname(aotEmployee.getLastname());
                employee.setCitizenid(aotEmployee.getCitizenID());
                employee.setUserid(aotEmployee.getUserID());
                employeeService.saveOrUpdate(employee);
            }
            LOGGER.debug("autoInsertOrUpdateEmployee Used Time {} S.",(System.currentTimeMillis() - start) / 1000.0);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }
}
