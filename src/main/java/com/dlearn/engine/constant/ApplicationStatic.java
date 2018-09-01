package com.dlearn.engine.constant;

import com.dlearn.engine.entity.Token;

public class ApplicationStatic {

    public static Token token;

    public static String getAccessToken() {
        return ApplicationStatic.token.getAccessToken();
    }
}
