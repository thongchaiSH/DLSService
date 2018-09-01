package com.dlearn.engine.util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.File;
import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;


@Component
public class AppUtil {
    private static Logger LOGGER = LoggerFactory.getLogger(AppUtil.class);

    public static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
    public static final SimpleDateFormat DATE_FORMAT_DDMMYYYY = new SimpleDateFormat("dd/MM/yyyy", Locale.US);
    public static final SimpleDateFormat DATE_FORMAT_DD = new SimpleDateFormat("dd", Locale.US);
    public static final SimpleDateFormat DATE_FORMAT_MM = new SimpleDateFormat("MM", Locale.US);
    public static final SimpleDateFormat DATE_FORMAT_YYYY = new SimpleDateFormat("yyyy", Locale.US);
    public static final SimpleDateFormat DATE_FORMAT_MMDD = new SimpleDateFormat("MMdd", Locale.US);

    public static Timestamp getCurrentDate() {
        Timestamp today = null;
        try {
            Date nowDate = Calendar.getInstance().getTime();
            today = new Timestamp(nowDate.getTime());
        } catch (Exception e) {
            LOGGER.error("error msg : {} ", e);
            throw new RuntimeException(e);
        }
        return today;
    }

    public static Timestamp getTimeStamp(String stringDate) {
        Timestamp today = null;
        try {
            today = getDateWithRemoveTime(DATE_FORMAT.parse(stringDate));
        } catch (Exception e) {
            LOGGER.error("error msg : {} ", e);
            throw new RuntimeException(e);
        }

        return today;
    }

    public static Timestamp getTimeStamp(Long longDate) {
        Timestamp today = null;
        try {
            today = new Timestamp(longDate);
        } catch (Exception e) {
            LOGGER.error("error msg : {} ", e);
            throw new RuntimeException(e);
        }

        return today;
    }

    public static Timestamp getTimeStampGetMaxTime(String stringDate) {

//        LOGGER.info()
        Timestamp today = null;
        try {
            today = getTimeMax(DATE_FORMAT.parse(stringDate));
        } catch (Exception e) {
            LOGGER.error("error msg : {} ", e);
            throw new RuntimeException(e);
        }

        return today;
    }


    public static Locale getSystemLocale() {
        LOGGER.info("getSystemLocale  Locale.US");
        return Locale.US;
    }

    public static Timestamp getDateWithRemoveTime(Date date) {
        LOGGER.info("getDateWithRemoveTime : {} ", date);
        Timestamp maxTimeDate = null;
        try {
            SimpleDateFormat newformat = new SimpleDateFormat("yyyy-MM-dd", AppUtil.getSystemLocale());
            maxTimeDate = Timestamp.valueOf(newformat.format(date) + " " + "00:00:00.000");
            LOGGER.debug("getDateWithRemoveTime return : {}", maxTimeDate);
        } catch (Exception e) {
            LOGGER.error("error msg : {} ", e);
            throw new RuntimeException(e);
        }

        return maxTimeDate;
    }


    public static Timestamp getTimeMax(Date date) {
        LOGGER.info("getDateWithRemoveTime : {} ", date);
        Timestamp maxTimeDate = null;
        try {
            SimpleDateFormat newformat = new SimpleDateFormat("yyyy-MM-dd", AppUtil.getSystemLocale());
            maxTimeDate = Timestamp.valueOf(newformat.format(date) + " " + "23:59:59.999");
            LOGGER.debug("getDateWithRemoveTime return : {}", maxTimeDate);
        } catch (Exception e) {
            LOGGER.error("error msg : {} ", e);
            throw new RuntimeException(e);
        }

        return maxTimeDate;
    }


    public static Timestamp getDateWithMaxTime(String date) {
        LOGGER.info("getDateWithMaxTime : {} ", date);
        Timestamp minTimeDate = null;
        try {
            String newFormateDate = convertStringDate(date);
            minTimeDate = Timestamp.valueOf(newFormateDate + " " + "23:59:59.999");

        } catch (Exception e) {
            LOGGER.error("error msg : {} ", e);
            throw new RuntimeException(e);
        }

        return minTimeDate;
    }

    private static String convertStringDate(String dateString1) {
        String newDate = "";
        try {
            Date date = new SimpleDateFormat("dd/MM/yyyy", AppUtil.getSystemLocale()).parse(dateString1);
            SimpleDateFormat newformat = new SimpleDateFormat("yyyy-MM-dd", AppUtil.getSystemLocale());
            newDate = newformat.format(date);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return newDate;
    }

    public static boolean isNotEmpty(List checkList) {
        Boolean returnValue = false;
        if (checkList != null && !checkList.isEmpty() && checkList.size() > 0) {
            returnValue = true;
        }
        return returnValue;
    }

    public static boolean isNotEmpty(String checkString) {
        boolean returnValue = false;
        if (checkString != null && checkString.length() > 0) {
            returnValue = true;
        }
        return returnValue;
    }

    public static boolean isNotNull(Object object) {
        boolean returnValue = false;
        if (object != null) {
            returnValue = true;
        }
        return returnValue;
    }

    public static boolean isNull(Object object) {
        boolean returnValue = false;
        if (object == null) {
            returnValue = true;
        }
        return returnValue;
    }

    public static String splitDot(String str) {
        if (str.indexOf(".") != -1) {
            String itemSplit[] = str.split("\\.");
            LOGGER.info("--------SPLIT {}", itemSplit[0]);
            return itemSplit[0];

        } else {
            return str;
        }
    }

    public static String checkE(String str) {


//            }
        Double number = Double.valueOf(str);
        BigDecimal big = new BigDecimal(number);

        return big.toString();

    }


    public static String checkEAccount(String str) {
        if (str.indexOf("E") != -1 && str.indexOf(".") != -1) {


            Double number = Double.valueOf(str);
            BigDecimal big = new BigDecimal(number);

            return big.toString();


        } else {
            return str;
        }
    }


    public static String MD5Encode(String md5) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("MD5");
            byte[] array = md.digest(md5.getBytes());
            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < array.length; ++i) {
                sb.append(Integer.toHexString((array[i] & 0xFF) | 0x100).substring(1, 3));
            }
            return sb.toString();
        } catch (java.security.NoSuchAlgorithmException e) {
        }
        return null;
    }


    public static String convertStringToDate(String dateString1) {
        String newDate = "";
        try {
            Date date = new SimpleDateFormat("yyyy-MM-dd", AppUtil.getSystemLocale()).parse(dateString1);
            SimpleDateFormat newformat = new SimpleDateFormat("dd-MM-yyyy", AppUtil.getSystemLocale());
            newDate = newformat.format(date);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return newDate;


    }

    public static String ChangeNumberStyle(String str) {

        if (str.length() < 3) {
            return str;
        } else {
            int count = 0;
            String result = "";
            for (int i = str.length() - 1; i >= 0; i++) {
                count++;
                result = result.concat(str.charAt(i) + "");
                if (count == 3) {
                    result = result.concat(",");
                    count = 0;
                }

            }
            return new StringBuilder(result).reverse().toString();
        }

    }


    public static String ConvertDateExcelDateFormat(String stringDate) {

        try {
            String dateStr = stringDate;
            DateFormat formatter = new SimpleDateFormat("E MMM dd HH:mm:ss Z yyyy");
            Date date = (Date) formatter.parse(dateStr);
            System.out.println(date);

            Calendar cal = Calendar.getInstance();
            cal.setTime(date);
            String formatedDate = cal.get(Calendar.YEAR) + "-" + (cal.get(Calendar.MONTH) + 1) + "-" + cal.get(Calendar.DATE);
            System.out.println("formatedDate : " + formatedDate);
            return formatedDate;
        } catch (Exception e) {
            LOGGER.error("error msg : {} ", e);
            throw new RuntimeException(e);
        }


    }


    public static String checkDateFormat(String str) {


        if (str.length() > 10) {
            String itemSplit[] = str.split("\\-");


            String day = itemSplit[2].substring(0, 2);
            String month = itemSplit[1];
            String year = itemSplit[0];

            StringBuilder sb = new StringBuilder();
            sb.append(day);
            sb.append("-");
            sb.append(month);
            sb.append("-");
            sb.append(year);


            return sb.toString();
        } else {
            return str;
        }


    }


    /**
     * Integer  : dayOrderItem          => 1 = Monday ,..., 7 = Sunday
     * String   : timeCutOffOrderItem   => format HH:mm Default 08:00
     */
    public static Timestamp getDateOrderItem(int dayOrderItem, String timeCutOffOrderItem) {

        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm");
        SimpleDateFormat dateFormat2 = new SimpleDateFormat("dd/MM/yyyy");

        Calendar current = Calendar.getInstance();
        Calendar orderItem = Calendar.getInstance();

        Date result = null;

        try {
            current.setTime(dateFormat.parse(dateFormat.format(current.getTime())));            // ตัดเวลา
            orderItem.setTime(dateFormat.parse(dateFormat.format(orderItem.getTime())));        // ตัดเวลา

            dayOrderItem = dayOrderItem % 7;
            int dayCurrent = current.get(Calendar.DAY_OF_WEEK) - 1;                               // ในโปรแกรมคิด 0 = Sunday

            int dayDiff = Math.max(dayCurrent, dayOrderItem) - Math.min(dayCurrent, dayOrderItem);
            if (dayDiff > 0) {                                    // ยังไม่ถึงวันที่รอบเปิดบิล
                orderItem.add(Calendar.DATE, 7 - dayDiff);
            } else if (dayDiff == 0) {                             // ถ้าเป็นวันที่เดียวกัน -> เทียบเวลา
                Date dateCurrent = dateFormat.parse(dateFormat.format(current.getTime()));
                Date dateDateOrderItem = dateFormat.parse(dateFormat2.format(current.getTime()) + " " + timeCutOffOrderItem);

                if (dateCurrent.after(dateDateOrderItem)) {       // เลยเวลามาแล้ว -> ใช้รอบบิลถัดไป
                    orderItem.add(Calendar.DATE, 7);
                }
            }

            result = dateFormat.parse(dateFormat2.format(orderItem.getTime()) + " " + timeCutOffOrderItem);

        } catch (Exception e) {
            LOGGER.error("error msg : {} ", e);
            throw new RuntimeException(e);
        }

        return new Timestamp(result.getTime());
    }

    /**
     * Integer  : dayReceiveItem          => 1 = Monday ,..., 7 = Sunday
     */
    public static Timestamp getDateReceiveItem(int dayReceiveItem) {

        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

        Calendar current = Calendar.getInstance();
        Calendar receiveItem = Calendar.getInstance();

        try {
            current.setTime(dateFormat.parse(dateFormat.format(current.getTime())));            // ตัดเวลา
            receiveItem.setTime(dateFormat.parse(dateFormat.format(receiveItem.getTime())));    // ตัดเวลา

            dayReceiveItem = dayReceiveItem % 7;
            int dayCurrent = current.get(Calendar.DAY_OF_WEEK) - 1;                               // ในโปรแกรมคิด 0 = Sunday

            int dayDiff = Math.max(dayCurrent, dayReceiveItem) - Math.min(dayCurrent, dayReceiveItem);
            if (dayDiff > 0) {                                    // ยังไม่ถึงวัน
                receiveItem.add(Calendar.DATE, 7 - dayDiff);
            } else {                                              // เลยวันมาแล้ว หรือตรงกับวันนี้ -> ใช้รอบถัดไป
                receiveItem.add(Calendar.DATE, -1 * dayDiff);
            }

        } catch (Exception e) {
            LOGGER.error("error msg : {} ", e);
            throw new RuntimeException(e);
        }

        return new Timestamp(receiveItem.getTime().getTime());
    }

    public static String getDateShortThai(Date date) {
        String months[] = {
                "ม.ค", "ก.พ", "มี.ค", "เม.ย",
                "พ.ค", "มิ.ย", "ก.ค", "ส.ค",
                "ก.ย", "ต.ค", "พ.ย", "ธ.ค"
        };
        SimpleDateFormat dateFormatDD = new SimpleDateFormat("dd ", new Locale("th", "TH"));
        SimpleDateFormat dateFormatMM = new SimpleDateFormat("MM", new Locale("th", "TH"));
        SimpleDateFormat dateFormatYY = new SimpleDateFormat(" yy", new Locale("th", "TH"));

        String strDate = dateFormatDD.format(date) + months[Integer.parseInt(dateFormatMM.format(date)) - 1] + dateFormatYY.format(date);
        return strDate;
    }


    public static List<Map> stringJsonToListMap(String json) {
        Gson gson = new GsonBuilder().setDateFormat("dd/MM/yyyy HH:mm").create();
        Type founderListType = new TypeToken<ArrayList<Map>>() {
        }.getType();
        return gson.fromJson(json, founderListType);
    }

    public static Map stringJsonToMap(String json) {
        Gson gson = new GsonBuilder().setDateFormat("dd/MM/yyyy HH:mm").create();
        return gson.fromJson(json, Map.class);
    }

    public static String getFileExtension(File file) {
        String extension = "";

        try {
            if (file != null && file.exists()) {
                String name = file.getName();
                extension = name.substring(name.lastIndexOf("."));
            }
        } catch (Exception e) {
            extension = "";
        }
        extension = extension.replace(".", "");
        return extension;
    }

    public static <T> List<T> fromJsonList(String json, Class<T> clazz) {
        Gson gson = new Gson();
        Object[] array = (Object[]) java.lang.reflect.Array.newInstance(clazz, 0);
        array = gson.fromJson(json, array.getClass());
        List<T> list = new ArrayList<T>();
        for (int i = 0; i < array.length; i++)
            list.add(clazz.cast(array[i]));

        return list;
    }
}


