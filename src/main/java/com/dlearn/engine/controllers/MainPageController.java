package com.dlearn.engine.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("/main")
public class MainPageController {

    static final Logger LOGGER = LoggerFactory.getLogger(MainPageController.class);

    @GetMapping("")
    public String mainPage(ModelMap model) {
        return "demos/inquiry";
    }
}
