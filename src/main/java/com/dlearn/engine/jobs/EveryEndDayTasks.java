package com.dlearn.engine.jobs;

import com.dlearn.engine.services.JobService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;


@Component
public class EveryEndDayTasks {
    static final Logger LOGGER = LoggerFactory.getLogger(EveryEndDayTasks.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

    @Autowired
    JobService jobService;
    @Scheduled(cron = "0 40 23 * * ?")
    public void reportCurrentTime() {

        LOGGER.info("*****************  EveryEndDayTasks    **********************");
        try {
            LOGGER.info("autoInsertOrUpdateEmployee START");
            jobService.autoInsertOrUpdateEmployee();
            LOGGER.info("autoInsertOrUpdateEmployee finnish");
        }catch (Exception e){
            e.printStackTrace();
            LOGGER.error("error Msg {}", e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
        LOGGER.info("***************************************");
    }
}
