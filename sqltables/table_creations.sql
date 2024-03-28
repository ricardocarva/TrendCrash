-- Create Region entity table
CREATE TABLE Region (
    region_id VARCHAR2(2) PRIMARY KEY,
    name VARCHAR2(128) NOT NULL
);

-- Create Timezone entity table
CREATE TABLE Timezone (
    timezone_id VARCHAR2(5) PRIMARY KEY,
    name VARCHAR2(32) NOT NULL
);
-- Create State entity table
CREATE TABLE State (
    state_id VARCHAR2(2) PRIMARY KEY,
    region_id VARCHAR2(2) NOT NULL,
    name VARCHAR2(12) NOT NULL,
    FOREIGN KEY (region_id) REFERENCES Region(region_id)
);

-- Create RoadConditions entity table
CREATE TABLE RoadConditions (
    road_cond_id INTEGER PRIMARY KEY,
    state_id VARCHAR2(2) NOT NULL,
    total_miles DECIMAL(10,2) NOT NULL,
    acceptable_miles DECIMAL(10,2) NOT NULL,
    percent_acceptable_miles DECIMAL(5,2) NOT NULL,
    year INTEGER NOT NULL,
    FOREIGN KEY (state_id) REFERENCES State(state_id)
);


-- Create Location entity table
CREATE TABLE Location (
    location_id INTEGER PRIMARY KEY,
    state_id VARCHAR2(2) NOT NULL,
    timezone_id VARCHAR2(64) NOT NULL,
    street VARCHAR2(128) NOT NULL,
    city VARCHAR2(128) NOT NULL,
    county VARCHAR2(128) NOT NULL,
    zip VARCHAR2(10) NOT NULL,
    FOREIGN KEY (state_id) REFERENCES State(state_id),
    FOREIGN KEY (timezone_id) REFERENCES Timezone(timezone_id)
);

-- Create TrafficDetails entity table 
CREATE TABLE TrafficDetails (
    traffic_details_id INTEGER PRIMARY KEY,
    bump NUMBER(1) DEFAULT 0 CHECK (bump IN (0, 1)) NOT NULL,
    crossing NUMBER(1) DEFAULT 0 CHECK (crossing IN (0, 1)) NOT NULL,
    give_way NUMBER(1) DEFAULT 0 CHECK (give_way IN (0, 1)) NOT NULL,
    junction NUMBER(1) DEFAULT 0 CHECK (junction IN (0, 1)) NOT NULL,
    no_exit NUMBER(1) DEFAULT 0 CHECK (no_exit IN (0, 1)) NOT NULL,
    railway NUMBER(1) DEFAULT 0 CHECK (railway IN (0, 1)) NOT NULL,
    railway_station NUMBER(1) DEFAULT 0 CHECK (railway_station IN (0, 1)) NOT NULL,
    roundabout NUMBER(1) DEFAULT 0 CHECK (roundabout IN (0, 1)) NOT NULL,
    stop NUMBER(1) DEFAULT 0 CHECK (stop IN (0, 1)) NOT NULL,
    traffic_calming NUMBER(1) DEFAULT 0 CHECK (traffic_calming IN (0, 1)) NOT NULL,
    traffic_signal NUMBER(1) DEFAULT 0 CHECK (traffic_signal IN (0, 1)) NOT NULL,
    turning_loop NUMBER(1) DEFAULT 0 CHECK (turning_loop IN (0, 1))NOT NULL
);

-- Create AccidentWeather entity table
CREATE TABLE AccidentWeather (
    accident_weather_id INTEGER PRIMARY KEY,
    condition VARCHAR2(255) NOT NULL,
    accident_date DATE NOT NULL,
    accident_time TIMESTAMP NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    wind_chill DECIMAL(5,2) NOT NULL,
    humidity DECIMAL(5,2) NOT NULL,
    pressure DECIMAL(5,2) NOT NULL,
    visibility DECIMAL(5,2) NOT NULL,
    wind_speed DECIMAL(5,2) NOT NULL,
    precipitation DECIMAL(5,2)NOT NULL
);

-- Create Accident entity table
CREATE TABLE Accident (
    accident_id INTEGER PRIMARY KEY,
    location_id INTEGER NOT NULL,
    accident_weather_id INTEGER NOT NULL,
    traffic_details_id INTEGER NOT NULL,
    severity INTEGER NOT NULL,
    accident_date DATE NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    time_of_day VARCHAR2(64) NOT NULL,
    distance DECIMAL(10,2) NOT NULL,
    description VARCHAR2(255) NOT NULL,
    FOREIGN KEY (location_id) REFERENCES Location(location_id),
    FOREIGN KEY (accident_weather_id) REFERENCES AccidentWeather(accident_weather_id),
    FOREIGN KEY (traffic_details_id) REFERENCES TrafficDetails(traffic_details_id)
);

-- Create CPI entity table
CREATE TABLE CPI (
    region_id VARCHAR2(2) NOT NULL,
    year INTEGER NOT NULL,
    month VARCHAR2(9) NOT NULL,
    price_index DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (region_id, year, month),
    FOREIGN KEY (region_id) REFERENCES Region(region_id) 
);

-- Create Unemployment entity table
CREATE TABLE Unemployment (
    state_id VARCHAR2(2) NOT NULL,
    year INTEGER NOT NULL,
    month VARCHAR2(9) NOT NULL,
    rate DECIMAL(5,2) NOT NULL,
    PRIMARY KEY (state_id, year, month),
    FOREIGN KEY (state_id) REFERENCES State(state_id)
);

-- COVIDTripsByDistance entity table
CREATE TABLE COVIDTripsByDistance (
    state_id VARCHAR2(2) NOT NULL,
    year INTEGER NOT NULL,
    month VARCHAR2(9) NOT NULL,
    population_staying_at_home DECIMAL(10,2) NOT NULL,
    population_not_staying_at_home DECIMAL(10,2) NOT NULL,
    number_of_trips DECIMAL(10,2) NOT NULL,
    number_of_trips_less_than_1 DECIMAL(10,2) NOT NULL,
    number_of_trips_1_to_3 DECIMAL(10,2) NOT NULL,
    number_of_trips_3_to_5 DECIMAL(10,2) NOT NULL,
    number_of_trips_5_to_10 DECIMAL(10,2) NOT NULL,
    number_of_trips_10_to_25 DECIMAL(10,2) NOT NULL,
    number_of_trips_25_to_50 DECIMAL(10,2) NOT NULL,
    number_of_trips_50_to_100 DECIMAL(10,2) NOT NULL,
    number_of_trips_100_to_250 DECIMAL(10,2) NOT NULL,
    number_of_trips_250_to_500 DECIMAL(10,2) NOT NULL,
    number_of_trips_500_or_more DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (state_id, year, month),
    FOREIGN KEY (state_id) REFERENCES State(state_id)
);