package com.dlearn.engine.services;

import com.dlearn.engine.entity.AOTEmployee;
import com.dlearn.engine.entity.Token;

import java.util.List;
import java.util.Map;

public interface AOTService {
    public Token getToken();
    public  Map isAuthenUser(String userName, String password);
    public  List<AOTEmployee> getAOTEmployee(String start, String retrieve, String keyword);
    public Integer employeeRowCount();
}
