package com.dlearn.engine.controllers;

import com.dlearn.engine.constant.ApplicationStatic;
import com.dlearn.engine.entity.AOTEmployee;
import com.dlearn.engine.entity.Employee;
import com.dlearn.engine.services.AOTService;
import com.dlearn.engine.services.EmployeeService;
import com.dlearn.engine.util.AppUtil;
import flexjson.JSONSerializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/aotServices")
public class AOTApplicationController {

    static final Logger LOGGER = LoggerFactory.getLogger(AOTApplicationController.class);

    @Autowired
    AOTService aotService;
    @Autowired
    EmployeeService employeeService;

    @GetMapping("/getToken")
    public ResponseEntity<String> getToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json; charset=utf-8");
        ResponseEntity<String> responseEntity;
        try {
            if (AppUtil.isNull(ApplicationStatic.token)) {
                ApplicationStatic.token = aotService.getToken();
            }
            return new ResponseEntity<String>(new JSONSerializer().exclude("*.class").deepSerialize(ApplicationStatic.token), headers, HttpStatus.OK);
        } catch (Exception e) {
            LOGGER.error("getToken[Controller] error msg : {}", e.getMessage());
            return new ResponseEntity<String>("{\"ERROR\":" + e.getMessage() + "\"}", headers, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/employeeRowCount")
    public ResponseEntity<String> employeeRowCount() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json; charset=utf-8");
        ResponseEntity<String> responseEntity;
        try {
            Integer result=aotService.employeeRowCount();
            return new ResponseEntity<String>(new JSONSerializer().exclude("*.class").deepSerialize(result), headers, HttpStatus.OK);
        } catch (Exception e) {
            LOGGER.error("employeeRowCount[Controller] error msg : {}", e.getMessage());
            return new ResponseEntity<String>("{\"ERROR\":" + e.getMessage() + "\"}", headers, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/authenUser")
    public ResponseEntity<String> authenUser(HttpServletRequest request
            , @RequestParam(value = "username") String userName
            , @RequestParam(value = "password") String password
    ) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json; charset=utf-8");
        ResponseEntity<String> responseEntity;
        try {
            Map result = aotService.isAuthenUser(userName, password);
            return new ResponseEntity<String>(new JSONSerializer().exclude("*.class").deepSerialize(result), headers, HttpStatus.OK);
        } catch (Exception e) {
            LOGGER.error("getToken[Controller] error msg : {}", e.getMessage());
            return new ResponseEntity<String>("{\"ERROR\":" + e.getMessage() + "\"}", headers, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAOTEmployee")
    public ResponseEntity<String> getAOTEmployee(HttpServletRequest request
            , @RequestParam(value = "start") String start
            , @RequestParam(value = "retrieve") String retrieve
            , @RequestParam(value = "keyword") String keyword
    ) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json; charset=utf-8");
        ResponseEntity<String> responseEntity;
        try {
            List<AOTEmployee> aotEmployeeList=aotService.getAOTEmployee(start,retrieve,keyword);
            return new ResponseEntity<String>(new JSONSerializer().exclude("*.class").deepSerialize(aotEmployeeList), headers, HttpStatus.OK);
        } catch (Exception e) {
            LOGGER.error("getToken[Controller] error msg : {}", e.getMessage());
            return new ResponseEntity<String>("{\"ERROR\":" + e.getMessage() + "\"}", headers, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
