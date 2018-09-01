package com.dlearn.engine;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

public class SessionListener implements HttpSessionListener {

    @Override
    public void sessionCreated(HttpSessionEvent event) {
//        event.getSession().setMaxInactiveInterval(30*60);
        event.getSession().setMaxInactiveInterval(60*60*1);//1Hours
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent event) {
    }
}
