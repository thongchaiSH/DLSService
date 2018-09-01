//package com.dlearn.engine.jobs;
//
//import com.spt.engine.service.cus.NewsService;
//import com.spt.engine.service.rc.ReceiveItemService;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Component;
//
//import java.text.SimpleDateFormat;
//import java.util.Date;
//
//
//@Component
//public class EveryStartDayTasks {
//    static final Logger LOGGER = LoggerFactory.getLogger(EveryStartDayTasks.class);
//
//    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
//
//    @Scheduled(cron = "0 5 0 * * ?")
//    public void reportCurrentTime() {
//        LOGGER.info("*****************  EverStartDayTasks    **********************");
//        try {
//            LOGGER.info("batchAutoChangeStatusNews START");
//            batchAutoNotifyNewsChangeStatusNews();
//            LOGGER.info("batchAutoChangeStatusNews finnish");
//        }catch (Exception e){
//            e.printStackTrace();
//            LOGGER.error("error Msg {}", e.getMessage());
//            throw new RuntimeException(e.getMessage());
//        }
//
//
//        LOGGER.info("***************************************");
//    }
//
//    public void batchAutoNotifyNewsChangeStatusNews() {
//        LOGGER.info("***************************************");
//        LOGGER.info("The time is now {}", dateFormat.format(new Date()));
//        LOGGER.info("Start StampStatusNewsTasks");
//
//        newsService.batchAutoNotifyNewsChangeStatusNews();
//
//        LOGGER.info("***************************************");
//    }
//}
