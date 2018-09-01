package com.dlearn.engine.logback;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class LoggerController {

	@MessageMapping("/log")
    @SendTo("/topic/log/messages")
    public LogOutputMessage send(final LogMessage message) throws Exception {
        return new LogOutputMessage(message.getMessage());
    }
	
	@RequestMapping(value = { "/viewlog" }, method = RequestMethod.GET)
    public String viewlog(ModelMap model) {
        return "viewlog";
    }

}
