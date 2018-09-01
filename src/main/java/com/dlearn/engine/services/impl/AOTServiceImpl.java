package com.dlearn.engine.services.impl;

import com.dlearn.engine.constant.ApplicationStatic;
import com.dlearn.engine.entity.AOTEmployee;
import com.dlearn.engine.entity.Token;
import com.dlearn.engine.services.AOTService;
import com.dlearn.engine.services.AbstractAOTEngineService;
import com.dlearn.engine.util.AppUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("AOTService")
public class AOTServiceImpl extends AbstractAOTEngineService implements AOTService {

    @Override
    @Autowired
    public void setRestTemplate(RestTemplate restTemplate) {
        // TODO Auto-generated method stub
        super.restTemplate = restTemplate;
    }

    @Override
    public void setToken() {
        if (AppUtil.isNull(ApplicationStatic.token)) {
            ApplicationStatic.token = this.getToken();
        }
    }

    public Token getToken() {
        try {
            Long startTime=System.currentTimeMillis();
            Token token = new Token();
            String url = "/token";
            Map parameter = new HashMap();
            parameter.put("grant_type", "password");
            parameter.put("username", "jamorn@de-learn.com");
            parameter.put("password", "P@ssw0rd");
            ResponseEntity<String> responseEntity = postWithMapParameter(parameter, url);
            Map mapTemp = gson.fromJson(responseEntity.getBody(), Map.class);
            Map mapToToken = new HashMap();
            if (mapTemp.containsKey("access_token")) {
                mapToToken.put("accessToken", mapTemp.get("access_token"));
            }
            if (mapTemp.containsKey("token_type")) {
                mapToToken.put("tokenType", mapTemp.get("token_type"));
            }
            if (mapTemp.containsKey("expires_in")) {
                mapToToken.put("expiresIn", mapTemp.get("expires_in"));
            }
            if (mapTemp.containsKey("userName")) {
                mapToToken.put("userName", mapTemp.get("userName"));
            }
            if (mapTemp.containsKey(".issued")) {
                mapToToken.put("issued", mapTemp.get(".issued"));
            }
            if (mapTemp.containsKey(".expires")) {
                mapToToken.put("expires", mapTemp.get(".expires"));
            }
            ObjectMapper mapper = new ObjectMapper(); // jackson's objectmapper
            token = mapper.convertValue(mapToToken, Token.class);
            LOGGER.debug("getToken[Service] Time {} s.",(System.currentTimeMillis() - startTime) / 1000.0);
            return token;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public Map isAuthenUser(String userName, String password) {
        try {
            Long startTime = System.currentTimeMillis();
            String url = "/Authen/AuthenUser";
            Map parameter = new HashMap();
            parameter.put("username", userName);
            parameter.put("password", password);
            ResponseEntity<String> responseEntity = postAuthorWithMapParameter(parameter, url);
            Map result = gson.fromJson(responseEntity.getBody(), Map.class);
            LOGGER.debug("isAuthenUser[Service] Time {} s.",(System.currentTimeMillis() - startTime) / 1000.0);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public List<AOTEmployee> getAOTEmployee(String start, String retrieve, String keyword) {
        try {
            Long startTime = System.currentTimeMillis();
            String url = "/ContactDirectory/viewContactPaging";
            Map parameter = new HashMap();
            parameter.put("start", start);
            parameter.put("retrieve", retrieve);
            parameter.put("keyword", keyword);
            ResponseEntity<String> responseEntity = postAuthorWithMapParameter(parameter, url);
            List<AOTEmployee> result = AppUtil.fromJsonList(responseEntity.getBody(), AOTEmployee.class);
            LOGGER.debug("getAOTEmployee[Service] Size {} , Time {} s.",result.size(),(System.currentTimeMillis() - startTime) / 1000.0);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public Integer employeeRowCount() {
        try {
            Long start = System.currentTimeMillis();
            Integer result=null;
            String url = "/ContactDirectory/EmployeeRowCount";
            ResponseEntity<String> responseEntity = postWithAuthorization(url);
            Map mapResult = gson.fromJson(responseEntity.getBody(), Map.class);
            if(mapResult.containsKey("rowcount")){
                result=Double.valueOf(mapResult.get("rowcount").toString()).intValue();
            }
            LOGGER.debug("employeeRowCount[Service] {} , Time {} s.",result,(System.currentTimeMillis() - start) / 1000.0);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }
}
