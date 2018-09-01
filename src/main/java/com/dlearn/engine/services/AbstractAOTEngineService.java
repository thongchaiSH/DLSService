package com.dlearn.engine.services;

import com.dlearn.engine.constant.ApplicationStatic;
import com.google.gson.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.http.*;
import org.springframework.http.converter.FormHttpMessageConverter;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.lang.reflect.Type;
import java.nio.charset.Charset;
import java.util.*;


public abstract class AbstractAOTEngineService {
	protected static Logger LOGGER = LoggerFactory.getLogger(AbstractAOTEngineService.class);

	protected String EngineServer = "localhost:8080/Engine/rest";
    protected static Properties connectProperties = null;

    protected String webServicesString = "";
    protected String resultString = "";

    protected RestTemplate restTemplate;

    public abstract void setRestTemplate(RestTemplate restTemplate);
    public abstract void setToken();

	protected JsonParser parser = new JsonParser();

    JsonSerializer<Date> ser = new JsonSerializer<Date>() {
        public JsonElement serialize(Date src, Type typeOfSrc,
                                     JsonSerializationContext context) {
            return src == null ? null : new JsonPrimitive(src.getTime());
        }
    };

    JsonDeserializer<Date> deser = new JsonDeserializer<Date>() {
        public Date deserialize(JsonElement json, Type typeOfT,
                                JsonDeserializationContext context) throws JsonParseException {
            return json == null ? null : new Date(json.getAsLong());
        }
    };

    protected Gson gson = new GsonBuilder().setDateFormat("dd/MM/yyyy HH:mm").create();

    static {
        Resource resource = new ClassPathResource("/server.properties");
        try{
            connectProperties = PropertiesLoaderUtils.loadProperties(resource);

        } catch (IOException e){
            LOGGER.error("Error : {}", e);
        }

    }

    public AbstractAOTEngineService(){
        this.EngineServer  = connectProperties.getProperty("EngineServer");
    }
    
    public String getWebServicesString() {
        return webServicesString;
    }
    
    public AbstractAOTEngineService setWebServicesString(String webServicesString) {
        this.webServicesString = webServicesString;
        return this;
    }
    
    public String getResultString() {
        LOGGER.debug("request :{}",getWebServicesString());
        resultString  = restTemplate.getForObject(getWebServicesString(), String.class);
        return resultString;
    }
    
    public String getResultString(String url) {
        LOGGER.debug("request :{}",url);
        resultString  = restTemplate.getForObject(url, String.class);
        return resultString;
    }
    
    public ResponseEntity<String> getResultString(String urlParam, HttpEntity<String> entitys) {
    	String url = this.EngineServer +urlParam;
        LOGGER.info(" request :{}",url);
        return restTemplate.exchange(url, HttpMethod.GET, entitys, String.class);
    }

    public byte[] printReport(String urlParam){
        String url = this.EngineServer +urlParam;
        LOGGER.info(" request :{}",url);
        try{
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
            headers.add("Content-Type", "application/json; charset=utf-8");
            HttpEntity<String> entity = new HttpEntity<String>("", headers);
            ResponseEntity<byte[]> reponseEntity = restTemplate.exchange(url, HttpMethod.GET, entity, byte[].class);
            return reponseEntity.getBody();
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }


    
    public ResponseEntity<String> getResultByExchange(String urlParam) {
    	HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.add("Content-Type", "application/json; charset=utf-8");

        HttpEntity<String> entity = new HttpEntity<String>("", headers);
    	String url = this.EngineServer +urlParam;
        LOGGER.info(" request :{}",url);
        return restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
    }
    
    public ResponseEntity<String> getResultStringByTypeHttpMethodAndBodyContent(String json, HttpMethod httpMethod, String url, RestTemplate restTemplate) {
        LOGGER.debug("url :{}", url);
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.add("Content-Type", "application/json; charset=utf-8");

        HttpEntity<String> entity = new HttpEntity<String>(json, headers);
        if(httpMethod==null){
            httpMethod = HttpMethod.GET;
        }
        ResponseEntity<String> responseEntity = restTemplate.exchange(url, httpMethod, entity, String.class);
        return responseEntity;
    }
    
    public ResponseEntity<String> getResultStringByTypeHttpMethodAndBodyContent(HttpMethod httpMethod, String urlParam) {
    	String url = this.EngineServer +urlParam;
        LOGGER.info("url :{}", url);
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.add("Content-Type", "application/json; charset=utf-8");


        HttpEntity<String> entity = new HttpEntity<String>("", headers);
        if(httpMethod==null){
            httpMethod = HttpMethod.GET;
        }
        ResponseEntity<String> responseEntity = restTemplate.exchange(url, httpMethod, entity, String.class);
        return responseEntity;
    }
    
    public ResponseEntity<String> postWithMapParameter(Map<String, String> parameterMap, String urlParam) {
    	String url = this.EngineServer +urlParam;
    	LOGGER.info("url :{}", url);

        MediaType mediaType = new MediaType("application","x-www-form-urlencoded");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<String, String>();
        if(parameterMap!=null){
        	for(String key:parameterMap.keySet()){
        		if(!"parentId".equals(key) && !"_csrf".equals(key)){
        				body.add(key, parameterMap.get(key));
        			
        		}
        		
        		
        	}
        }
        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<MultiValueMap<String, String>>(body, headers);
//        if(httpMethod==null){
//            httpMethod = HttpMethod.POST;
//        }
        
        FormHttpMessageConverter converter = new FormHttpMessageConverter();
        converter.setSupportedMediaTypes(Arrays.asList(mediaType));
        
        restTemplate.getMessageConverters().add(converter);
//
//        CloseableHttpClient httpClient = HttpClients.custom().setSSLHostnameVerifier(new NoopHostnameVerifier()).build();
//        HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
//        requestFactory.setHttpClient(httpClient);
//        restTemplate.setRequestFactory(requestFactory);

        ResponseEntity<String> responseEntity = restTemplate.postForEntity(url, entity, String.class);
        return responseEntity;
    }

    public ResponseEntity<String> postAuthorWithMapParameter(Map<String, String> parameterMap, String urlParam) {
        //setToken
        setToken();

        String url = this.EngineServer +urlParam;
        LOGGER.info("url :{}", url);

        MediaType mediaType = new MediaType("application","x-www-form-urlencoded");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.add("Authorization", "Bearer "+ ApplicationStatic.getAccessToken());
        MultiValueMap<String, String> body = new LinkedMultiValueMap<String, String>();
        if(parameterMap!=null){
            for(String key:parameterMap.keySet()){
                if(!"parentId".equals(key) && !"_csrf".equals(key)){
                    body.add(key, parameterMap.get(key));
                }
            }
        }
        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<MultiValueMap<String, String>>(body, headers);
        FormHttpMessageConverter converter = new FormHttpMessageConverter();
        converter.setSupportedMediaTypes(Arrays.asList(mediaType));

        restTemplate.getMessageConverters().add(converter);
        ResponseEntity<String> responseEntity = restTemplate.postForEntity(url, entity, String.class);
        return responseEntity;
    }

    public ResponseEntity<String> postWithAuthorization(String urlParam) {
        //setToken
        setToken();

        String url = this.EngineServer +urlParam;
        LOGGER.info("url :{}", url);

        MediaType mediaType = new MediaType("application","x-www-form-urlencoded");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.add("Authorization", "Bearer "+ ApplicationStatic.getAccessToken());
        MultiValueMap<String, String> body = new LinkedMultiValueMap<String, String>();
        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<MultiValueMap<String, String>>(body, headers);
        FormHttpMessageConverter converter = new FormHttpMessageConverter();
        converter.setSupportedMediaTypes(Arrays.asList(mediaType));

        restTemplate.getMessageConverters().add(converter);
        ResponseEntity<String> responseEntity = restTemplate.postForEntity(url, entity, String.class);
        return responseEntity;
    }


    public ResponseEntity<String> putWithJson(Map<String, String[]> parameterMap, HttpMethod httpMethod, String urlParam) {
    	String url = this.EngineServer +urlParam;
    	LOGGER.info("url :{}", url);

        MediaType mediaType = new MediaType("application","json", Charset.forName("UTF-8"));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);

        Map<String, String> body = new HashMap<String, String>();  
        if(parameterMap!=null){
        	for(String key:parameterMap.keySet()){
        		body.put(key, parameterMap.get(key)[0]);
        	}
        }


        HttpEntity<String> entity = new HttpEntity<String>(gson.toJson(body), headers);

        LOGGER.info("entity :{}", entity);
        if(httpMethod==null){
            httpMethod = HttpMethod.PUT;
        }
        
        FormHttpMessageConverter converter = new FormHttpMessageConverter();
        converter.setSupportedMediaTypes(Arrays.asList(mediaType));
        
        restTemplate.getMessageConverters().add(converter);
        //restTemplate.put(url, entity, String.class);
        ResponseEntity<String> responseEntity = restTemplate.exchange(url, httpMethod, entity, String.class);
        
        return new ResponseEntity(responseEntity.getBody(), HttpStatus.OK);
    }
    
    public ResponseEntity<String> putAssociate(List<String> associateIdLs, String urlParam, String associatePath) {
    	String url = this.EngineServer +urlParam+associatePath;
    	LOGGER.info("url :{}", url);

        MediaType mediaType = new MediaType("text","uri-list", Charset.forName("UTF-8"));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);

        String content = "";
        if(associateIdLs!=null) for(String id:associateIdLs){
        	content += this.EngineServer + associatePath+"/"+id+"\n";
        }
        
        
        HttpEntity<String> entity = new HttpEntity<String>(content, headers);

        
        FormHttpMessageConverter converter = new FormHttpMessageConverter();
        converter.setSupportedMediaTypes(Arrays.asList(mediaType));
        
        restTemplate.getMessageConverters().add(converter);
        LOGGER.info("entity :{}", restTemplate);
        restTemplate.put(url, entity, String.class);
        
        return new ResponseEntity("", HttpStatus.OK);
    }
    

    
    public ResponseEntity<String> putParent(List<String> associateIdLs, String urlParam, String associatePath) {
    	String url = this.EngineServer +urlParam+associatePath;
    	LOGGER.info("putParent url :{}", url);

        MediaType mediaType = new MediaType("text","uri-list", Charset.forName("UTF-8"));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);

        String content = "";
        if(associateIdLs!=null) for(String id:associateIdLs){
        	content += this.EngineServer + associatePath+"/"+id;
        }
        
        
        HttpEntity<String> entity = new HttpEntity<String>(content, headers);

        
        FormHttpMessageConverter converter = new FormHttpMessageConverter();
        converter.setSupportedMediaTypes(Arrays.asList(mediaType));
        
        restTemplate.getMessageConverters().add(converter);
        LOGGER.info("entity :{}", restTemplate);
        restTemplate.put(url, entity, String.class);
        
        return new ResponseEntity("", HttpStatus.OK);
    }
    
    public ResponseEntity<String> deleteSend(HttpMethod httpMethod, String urlParam) {
    	String url = this.EngineServer +urlParam;
    	LOGGER.info("url :{}", url);

        HttpHeaders headers = new HttpHeaders();

        HttpEntity<String> entity = new HttpEntity<String>("", headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.DELETE, entity, String.class);
        // restTemplate.delete(url);
        return response;
    }
    

    
    public ResponseEntity<String> uploadFile(String base64, String fileName, String urlParam) {
    	String url = this.EngineServer +urlParam;
    	LOGGER.info("url :{}", url);

    	ResponseEntity<String> responseEntity;
		try {
			MediaType mediaType = MediaType.MULTIPART_FORM_DATA;
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(mediaType);

			
			MultiValueMap<String, Object> body = new LinkedMultiValueMap<String, Object>();

			body.add("file", base64);
			body.add("filename", fileName);


			HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<MultiValueMap<String, Object>>(body, headers);
			
			FormHttpMessageConverter converter = new FormHttpMessageConverter();
			converter.setSupportedMediaTypes(Arrays.asList(mediaType));
			
			restTemplate.getMessageConverters().add(converter);
            responseEntity = restTemplate.postForEntity(url, entity, String.class);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			responseEntity = new ResponseEntity("ERROR", HttpStatus.OK);
		}
        
        return responseEntity;
    }
    

    
    public ResponseEntity<Resource> loadReqource(String urlParam) {
    	String url = this.EngineServer +urlParam;
        LOGGER.info("url :{}", url);
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.add("Content-Type", "application/json; charset=utf-8");



        HttpEntity<String> entity = new HttpEntity<String>("", headers);
        ResponseEntity<Resource> responseEntity = restTemplate.exchange(url, HttpMethod.GET, entity, Resource.class);
        return responseEntity;
    }
    
    public ResponseEntity<String> deleteAssociate(List<String> associateIdLs, String urlParam, String associatePath) {
    	String url = this.EngineServer +urlParam+associatePath;
    	LOGGER.info("url :{}", url);

        MediaType mediaType = new MediaType("text","uri-list", Charset.forName("UTF-8"));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);

        String content = "";
        
        
        
        HttpEntity<String> entity = new HttpEntity<String>("", headers);

        
        FormHttpMessageConverter converter = new FormHttpMessageConverter();
        converter.setSupportedMediaTypes(Arrays.asList(mediaType));
        
        restTemplate.getMessageConverters().add(converter);
        LOGGER.info("entity :{}", restTemplate);
        if(associateIdLs!=null) for(String id:associateIdLs){
        	restTemplate.delete(url+id, entity, String.class);
        }
        
        return new ResponseEntity("", HttpStatus.OK);
    }
    

    
    public ResponseEntity<String> deleteAllAssociate(String urlParam, String associatePath) {
    	String url = this.EngineServer +urlParam+associatePath;
    	LOGGER.info("url :{}", url);

        MediaType mediaType = new MediaType("text","uri-list", Charset.forName("UTF-8"));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);

        String content = "";
        
        
        
        HttpEntity<String> entity = new HttpEntity<String>("", headers);

        
        FormHttpMessageConverter converter = new FormHttpMessageConverter();
        converter.setSupportedMediaTypes(Arrays.asList(mediaType));
        
        restTemplate.getMessageConverters().add(converter);
        LOGGER.info("entity :{}", restTemplate);
        restTemplate.put(url, entity, String.class);
        return new ResponseEntity("", HttpStatus.OK);
    }

}
