package com.dlearn.engine.entity;
import lombok.Data;

import java.util.Date;

@Data
public class Token {
    String accessToken;
    Integer expiresIn;
    Date expires;
    Date issued;
    String tokenType;
    String userName;
}
