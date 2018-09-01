package com.dlearn.engine.controllers;

import com.dlearn.engine.constant.ApplicationStatic;
import com.dlearn.engine.services.JobService;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dlsServices")
public class DLSApplicationController {
    static final Logger LOGGER = LoggerFactory.getLogger(DLSApplicationController.class);

    @Autowired
    JobService jobService;

    @GetMapping("/autoInsertOrUpdateEmployee")
    public ResponseEntity<String> autoInsertOrUpdateEmployee() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json; charset=utf-8");
        ResponseEntity<String> responseEntity;
        try {
            jobService.autoInsertOrUpdateEmployee();
            return new ResponseEntity<String>(new JSONSerializer().exclude("*.class").deepSerialize("Success"), headers, HttpStatus.OK);
        } catch (Exception e) {
            LOGGER.error("autoInsertOrUpdateEmployee[Controller] error msg : {}", e.getMessage());
            return new ResponseEntity<String>("{\"ERROR\":" + e.getMessage() + "\"}", headers, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
