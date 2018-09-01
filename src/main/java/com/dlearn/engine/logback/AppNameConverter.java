package com.dlearn.engine.logback;

import ch.qos.logback.classic.pattern.ClassicConverter;
import ch.qos.logback.classic.spi.ILoggingEvent;
import com.dlearn.engine.constant.LogbackConstant;

public class AppNameConverter extends ClassicConverter {
    @Override
    public String convert(ILoggingEvent event) {
       return LogbackConstant.WAR_NAME;
    }
}
