package com.dlearn.engine;

import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.ViewStatusMessagesServlet;
import ch.qos.logback.classic.joran.JoranConfigurator;
import ch.qos.logback.core.joran.spi.JoranException;
import com.dlearn.engine.constant.ApplicationConstant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.request.RequestContextListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;

public class ApplicationInitializer implements WebApplicationInitializer {

    static final Logger LOGGER = LoggerFactory.getLogger(ApplicationInitializer.class);

    public void onStartup(ServletContext container) throws ServletException {
        System.setProperty("rootPath", container.getRealPath("/"));
        System.setProperty("applicationName", ApplicationConstant.APPLICATION_NAME);

        LoggerContext context = (LoggerContext) LoggerFactory.getILoggerFactory();
        JoranConfigurator configurator = new JoranConfigurator();
        configurator.setContext(context);
        context.reset();


        //LOGGER.info("=================== file="+this.getClass().getClassLoader().getResource("logback.xml"));
        try {
            configurator.doConfigure(this.getClass().getClassLoader().getResource("logback.xml").getFile());
        } catch (JoranException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        ctx.register(ApplicationConfiguration.class);
        ctx.setServletContext(container);

        ServletRegistration.Dynamic servlet = container.addServlet("dispatcher", new DispatcherServlet(ctx));

        servlet.setLoadOnStartup(1);
        servlet.addMapping("/");

        container.addListener(new RequestContextListener());
        container.addListener(new SessionListener());


        ServletRegistration.Dynamic logbackAccessServlet = container.addServlet("logbackAccess", new ViewStatusMessagesServlet());

        logbackAccessServlet.setLoadOnStartup(2);
        logbackAccessServlet.addMapping("/lbAccessStatus");


    }


}
