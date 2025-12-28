package br.com.cantu.myapp.util;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class DateUtil {

    private static final DateTimeFormatter FRONT_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter BR_DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter BR_DATE_TIME_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final DateTimeFormatter EDF_DATE_FORMAT = DateTimeFormatter.ofPattern("ddMMyyyy");
    private static final DateTimeFormatter EDF_DATE_TIME_FORMAT = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
    private static final DateTimeFormatter FRONT_DATETIME_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
    private static final ZoneOffset ZONE_OFFSET = ZoneOffset.of("-03:00");
    public static final String SIMPLE_DATE_FORMAT = "dd/MM/yyyy";

    public static LocalDate toLocalDate(String date){
        if(date == null){
            return null;
        }
        return LocalDate.parse(date, BR_DATE_FORMAT);
    }

    public static LocalDate toLocalDateFromFront(String date){
        if(date == null){
            return null;
        }
        return LocalDate.parse(date, FRONT_DATE_FORMAT);
    }

    public static LocalDateTime toLocalDateTimeFromFront(String dateTime) {
        if (dateTime == null) {
            return null;
        }
        return LocalDateTime.parse(dateTime, FRONT_DATETIME_FORMAT);
    }
    public static String toEDFFormat(LocalDate date) {
        if(date == null){
            return null;
        }
        return date.format(EDF_DATE_FORMAT);
    }

    public static LocalDate parseToEDF(String date) {
        if(date == null){
            return null;
        }
        return LocalDate.parse(date, EDF_DATE_FORMAT);
    }

    public static LocalDateTime parseToEDFDateTime(String date) {
        if(date == null){
            return null;
        }
        return LocalDateTime.parse(date, EDF_DATE_TIME_FORMAT);
    }

    public static OffsetDateTime toODT(String dateTime) {
        if (dateTime == null) {
            return null;
        }
        return OffsetDateTime.parse(dateTime);

    }

    public static OffsetDateTime toODTFromFrontDatetime(String dateTime) {
        if (dateTime == null) {
            return null;
        }
        LocalDateTime localDateTime = toLocalDateTimeFromFront(dateTime);
        return localDateTime.atOffset(ZONE_OFFSET);

    }

    public static OffsetDateTime toODTFromFrontDate(String date) {
        if (date == null) {
            return null;
        }
        LocalDate localDate = toLocalDateFromFront(date);
        return localDate.atStartOfDay().atOffset(ZONE_OFFSET);

    }

    public static OffsetDateTime toODTFromFrontDateEndOfDay(String date) {
        if (date == null) {
            return null;
        }
        LocalDate localDate = toLocalDateFromFront(date);
        return localDate.atTime(23, 59, 59).atOffset(ZONE_OFFSET);

    }
    public static String toFrontDateTime(OffsetDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(FRONT_DATETIME_FORMAT);
    }
    public static String toSimpleDate(LocalDate date) {
        if(date == null){
            return null;
        }
        return date.format(BR_DATE_FORMAT);
    }

    public static String toSimpleDateTime(LocalDateTime date) {
        if(date == null){
            return null;
        }
        return date.format(BR_DATE_TIME_FORMAT);
    }

    public static String toFrontDate(LocalDate date) {
        if(date == null){
            return null;
        }
        return date.format(FRONT_DATE_FORMAT);
    }

    public static String toFrontDate(Date date) {
        if(date == null){
            return null;
        }
        return new SimpleDateFormat(SIMPLE_DATE_FORMAT).format(date);
    }

}
