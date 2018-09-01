package com.dlearn.engine.constant;

import java.text.SimpleDateFormat;
import java.util.Date;

public class ApplicationConstant {
    public static final String APPLICATION_NAME    = "DLS";
    public static final String APPLICATION_VERSION = new SimpleDateFormat("MM/dd/yyyy").format(new Date());

    public static  String FETCH_FRONTEND_PARAMETER_TIME = (new SimpleDateFormat("yyyyMMddhhmmss")).format(new Date());
    public static final String FETCH_PARAMETER_NAME = "PARAMETER_FETCH";

    public static final String IMAGE_NOT_FOUND_PART = "src/main/webapp/images/imgNotFound.png";

    public static final String FILE_DOWNLOAD_COOKIE_NAME = "fileDownload";

}
