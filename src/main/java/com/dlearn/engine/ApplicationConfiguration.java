package com.dlearn.engine;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.*;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.request.RequestContextListener;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.*;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;
import org.springframework.web.servlet.view.UrlBasedViewResolver;
import org.springframework.web.servlet.view.tiles3.TilesConfigurer;
import org.springframework.web.servlet.view.tiles3.TilesView;

import java.util.Locale;

@Configuration
@EnableWebMvc
@EnableScheduling
@ComponentScan(basePackages = "com.dlearn.engine")
public class ApplicationConfiguration extends WebMvcConfigurerAdapter {
	
    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer.favorPathExtension(true).
                ignoreAcceptHeader(true).
                useJaf(false).mediaType("json", MediaType.APPLICATION_JSON);
    }
    
    @Bean
    public FilterRegistrationBean filterRegistrationBean(){
    	FilterRegistrationBean registrationBean = new FilterRegistrationBean();
    	CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
    	characterEncodingFilter.setForceEncoding(true);
    	characterEncodingFilter.setEncoding("UTF-8");
    	registrationBean.setFilter(characterEncodingFilter);
		return registrationBean;
    	
    }
    
    @Bean
	@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
	public RestTemplate restTemplate(){
		return new RestTemplate();
	}
    
    @Bean
    public RequestContextListener requestContextListener(){
        return new RequestContextListener();
    }

    @Bean
    public ViewResolver viewResolver() {
        UrlBasedViewResolver viewResolver = new UrlBasedViewResolver();
        viewResolver.setViewClass(TilesView.class);

        return viewResolver;
    }

    @Bean
    public CommonsMultipartResolver multipartResolver() {
        CommonsMultipartResolver resolver=new CommonsMultipartResolver();
        resolver.setDefaultEncoding("utf-8");
        return resolver;
    }



    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // TODO Auto-generated method stub
//        VersionResourceResolver versionResourceResolver = new VersionResourceResolver()
//                .addVersionStrategy(new FixedVersionStrategy(ApplicationConstant.APPLICATION_VERSION), "/**");


        if (!registry.hasMappingForPattern("/resources/**")) {
            registry.addResourceHandler("/resources/**")
                    .addResourceLocations("/")
                    .addResourceLocations("classpath:/META-INF/web-resources/")
                    .setCachePeriod(60 * 60 * 24 * 365) /* one year */
//					.setCachePeriod(60 * 60 * 24) /* one day */
//					.setCachePeriod(60 * 60 * 3) /* 3 H */
//					.setCachePeriod(0) /*no cache */
                    .resourceChain(true);
//                    .addResolver(versionResourceResolver);
        }
    }



    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }

//    @Override
//    public void addInterceptors(InterceptorRegistry registry) {
//        registry.addInterceptor(localeChangeInterceptor());
//        registry.addInterceptor(new RememberFilterInterceptor()).addPathPatterns("/**/findByCriteria**").excludePathPatterns("/login**");
//        registry.addInterceptor(new CookieMemoryFilterInterceptor()).addPathPatterns("/**/listView**").excludePathPatterns("/login**");
//        registry.addInterceptor(new MemberLinkExcludeLangInterceptor()).addPathPatterns("/**").excludePathPatterns("/login**");
//        registry.addInterceptor(cookieLocalStorageInteceptor()).addPathPatterns("/**").excludePathPatterns("/login**","/admin/**");
//        registry.addInterceptor(new UrlAuthorizationInterceptor()).addPathPatterns("/**").excludePathPatterns(
//                "/login**",
//                "/admin/**",
//                "/chat/**",
//                "/Access_Denied**");
//    }


    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor localeChangeInterceptor = new LocaleChangeInterceptor();
        localeChangeInterceptor.setParamName("lang");

        return localeChangeInterceptor;
    }

    @Bean
    public LocaleResolver localeResolver(){
        CookieLocaleResolver resolver=new CookieLocaleResolver();
        resolver.setDefaultLocale(new Locale("en"));
        return resolver;
    }

    @Bean
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasenames(	"WEB-INF/i18n/application",
                "WEB-INF/i18n/label",
                "WEB-INF/i18n/button",
                "WEB-INF/i18n/message");
        messageSource.setDefaultEncoding("UTF-8");
        return messageSource;
    }

    @Bean
    public CommonsMultipartResolver commonsMultipartResolver() {
        CommonsMultipartResolver commonsMultipartResolver = new CommonsMultipartResolver();
        return commonsMultipartResolver;
    }

    @Bean
    public TilesConfigurer tilesConfigurer(){
        TilesConfigurer tilesConfigurer = new TilesConfigurer();
        tilesConfigurer.setDefinitions("/WEB-INF/layouts/layouts.xml",
                "/WEB-INF/views/**/views.xml");
        return tilesConfigurer;
    }


}