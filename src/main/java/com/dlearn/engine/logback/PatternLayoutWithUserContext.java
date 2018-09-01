package com.dlearn.engine.logback;

import ch.qos.logback.classic.PatternLayout;

public class PatternLayoutWithUserContext extends PatternLayout {
    static {
        PatternLayout.defaultConverterMap.put("session", SessionConverter.class.getName());
        PatternLayout.defaultConverterMap.put("warname", AppNameConverter.class.getName());
    }
}
