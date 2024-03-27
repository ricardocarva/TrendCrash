CREATE TABLE "RCARVALHEIRA"."LOCATIONKAGGLE" 
   (    "ID" VARCHAR2(9 BYTE), 
        "STREET" VARCHAR2(59 BYTE), 
        "CITY" VARCHAR2(32 BYTE), 
        "COUNTY" VARCHAR2(30 BYTE), 
        "STATE" VARCHAR2(3 BYTE), 
        "ZIPCODE" VARCHAR2(12 BYTE), 
        "TIMEZONE" VARCHAR2(11 BYTE)
   ) 
   COMPRESS FOR OLTP
    TABLESPACE "USERS" 
    LOGGING;
    
DROP TABLE LOCATIONKAGGLE;
DROP TABLE KAGGLE;

PURGE RECYCLEBIN;

SELECT COUNT(*) FROM "RCARVALHEIRA"."LOCATIONKAGGLE";
    
SELECT TABLESPACE_NAME, 
BYTES/1024/1024 AS "ALLOCATED_MB", 
MAX_BYTES/1024/1024 AS "MAX_ALLOCATED_MB", 
BLOCKS, 
MAX_BLOCKS 
FROM USER_TS_QUOTAS 
WHERE TABLESPACE_NAME = 'USERS';

SELECT DISTINCT STATE FROM "RCARVALHEIRA"."LOCATIONKAGGLE";

SELECT *
FROM "RCARVALHEIRA"."LOCATIONKAGGLE"
WHERE "TIMEZONE" IS NULL;


SELECT MAX(LENGTH("ID")) AS max_length_id,
       MAX(LENGTH("END_LAT")) AS max_length_end_lat,
       MAX(LENGTH("END_LNG")) AS max_length_end_lng,
       MAX(LENGTH("DESCRIPTION")) AS max_length_description,
       MAX(LENGTH("STREET")) AS max_length_street,
       MAX(LENGTH("CITY")) AS max_length_city,
       MAX(LENGTH("COUNTY")) AS max_length_county,
       MAX(LENGTH("STATE")) AS max_length_state,
       MAX(LENGTH("ZIPCODE")) AS max_length_zipcode,
       MAX(LENGTH("COUNTRY")) AS max_length_country,
       MAX(LENGTH("TIMEZONE")) AS max_length_timezone,
       MAX(LENGTH("AIRPORT_CODE")) AS max_length_airport_code,
       MAX(LENGTH("WIND_DIRECTION")) AS max_length_wind_direction,
       MAX(LENGTH("WEATHER_CONDITION")) AS max_length_weather_condition,
       MAX(LENGTH("AMENITY")) AS max_length_amenity,
       MAX(LENGTH("BUMP")) AS max_length_bump,
       MAX(LENGTH("CROSSING")) AS max_length_crossing,
       MAX(LENGTH("GIVE_WAY")) AS max_length_give_way,
       MAX(LENGTH("JUNCTION")) AS max_length_junction,
       MAX(LENGTH("NO_EXIT")) AS max_length_no_exit,
       MAX(LENGTH("RAILWAY")) AS max_length_railway,
       MAX(LENGTH("ROUNDABOUT")) AS max_length_roundabout,
       MAX(LENGTH("STATION")) AS max_length_station,
       MAX(LENGTH("STOP")) AS max_length_stop,
       MAX(LENGTH("TRAFFIC_CALMING")) AS max_length_traffic_calming,
       MAX(LENGTH("TRAFFIC_SIGNAL")) AS max_length_traffic_signal,
       MAX(LENGTH("TURNING_LOOP")) AS max_length_turning_loop,
       MAX(LENGTH("SUNRISE_SUNSET")) AS max_length_sunrise_sunset,
       MAX(LENGTH("CIVIL_TWILIGHT")) AS max_length_civil_twilight,
       MAX(LENGTH("NAUTICAL_TWILIGHT")) AS max_length_nautical_twilight,
       MAX(LENGTH("ASTRONOMICAL_TWILIGHT")) AS max_length_astronomical_twilight
FROM "RCARVALHEIRA"."KAGGLE";


CREATE TABLE "RCARVALHEIRA"."KAGGLE" 
(
    "ID" VARCHAR2(9 BYTE), 
    "SEVERITY" NUMBER(1,0),  -- Severity ranges from 1 to 4
    "START_TIME" TIMESTAMP,   -- Assuming START_TIME and END_TIME are TIMESTAMPs
    "END_TIME" TIMESTAMP, 
    "START_LAT" NUMBER(9, 6), -- Increased precision for latitude
    "START_LNG" NUMBER(10, 6), -- Increased precision for longitude
    "DISTANCE" NUMBER(5, 3),  -- Assuming distance goes up to 1.587 and can be precise to thousandths
    "DESCRIPTION" VARCHAR2(577 BYTE), -- Adjusted based on max length
    "STREET" VARCHAR2(51 BYTE), -- Adjusted based on max length
    "CITY" VARCHAR2(30 BYTE),  -- Adjusted based on max length
    "COUNTY" VARCHAR2(30 BYTE), -- Adjusted based on max length
    "STATE" CHAR(2 BYTE),  -- No change needed
    "ZIPCODE" CHAR(10 BYTE), -- No change needed
    "TIMEZONE" VARCHAR2(11 BYTE), -- Adjusted based on max length
    "AIRPORT_CODE" VARCHAR2(4 BYTE), -- Adjusted based on max length
    "WEATHER_TIMESTAMP" TIMESTAMP, -- Assuming this is a TIMESTAMP
    "TEMPERATURE" NUMBER(5, 2), -- No change, adjusted for potential max/min temperature values
    "WIND_CHILL" NUMBER(5, 2), -- No change, adjusted for potential max/min wind chill values
    "HUMIDITY" NUMBER(3, 0), -- Humidity percentage ranging from 1 to 100
    "PRESSURE" NUMBER(5, 2), -- Pressure values adjusted for observed range
    "VISIBILITY" NUMBER(3, 1), -- Visibility up to 10.0 miles
    "WIND_DIRECTION" VARCHAR2(8 BYTE), -- Adjusted based on max length
    "WIND_SPEED" NUMBER(4, 1), -- Wind speed can go up to 20.0
    "PRECIPITATION" NUMBER(3, 3), -- Assuming precision for small precipitation values
    "WEATHER_CONDITION" VARCHAR2(28 BYTE), -- Adjusted based on max length
    "AMENITY" CHAR(5 BYTE), -- TRUE/FALSE values can be stored as 'T'/'F' or 0/1
    "BUMP" CHAR(5 BYTE), -- TRUE/FALSE values
    "CROSSING" CHAR(5 BYTE), -- TRUE/FALSE values
    "GIVE_WAY" CHAR(5 BYTE), -- TRUE/FALSE values
    "JUNCTION" CHAR(5 BYTE), -- TRUE/FALSE values
    "NO_EXIT" CHAR(5 BYTE), -- TRUE/FALSE values
    "RAILWAY" CHAR(5 BYTE), -- TRUE/FALSE values
    "ROUNDABOUT" CHAR(5 BYTE), -- TRUE/FALSE values
    "STATION" CHAR(5 BYTE), -- TRUE/FALSE values
    "STOP" CHAR(5 BYTE), -- TRUE/FALSE values
    "TRAFFIC_CALMING" CHAR(5 BYTE), -- TRUE/FALSE values
    "TRAFFIC_SIGNAL" CHAR(5 BYTE), -- TRUE/FALSE values
    "TURNING_LOOP" CHAR(5 BYTE), -- TRUE/FALSE values, given it's only FALSE, consider if needed
    "SUNRISE_SUNSET" VARCHAR2(5 BYTE), -- Based on max length, could be 'Day' or 'Night'
    "CIVIL_TWILIGHT" VARCHAR2(5 BYTE), 
    "NAUTICAL_TWILIGHT" VARCHAR2(5 BYTE),
    "ASTRONOMICAL_TWILIGHT" VARCHAR2(5 BYTE)
) 
SEGMENT CREATION IMMEDIATE 
PCTFREE 10 
INITRANS 1 
MAXTRANS 255 
NOCOMPRESS 
LOGGING
TABLESPACE "USERS";

SELECT USER FROM DUAL;

SELECT * FROM "RCARVALHEIRA"."KAGGLE";

GRANT SELECT,INSERT,UPDATE,DELETE ON KAGGLE TO "THOMAS.MARTIN";

