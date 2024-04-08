/* Query 1: Relationship between accidents and traffic details */
SELECT 
    s.name AS state,
    l.city,
    a.accident_date,
    ROUND(AVG(a.severity), 2) AS severity_avg,
    COUNT(*) AS accident_count,
    SUM(
        CASE WHEN td.bump = 1 THEN 1 ELSE 0 END +
        CASE WHEN td.crossing = 1 THEN 1 ELSE 0 END +
        CASE WHEN td.give_way = 1 THEN 1 ELSE 0 END +
        CASE WHEN td.junction = 1 THEN 1 ELSE 0 END +
        CASE WHEN td.no_exit = 1 THEN 1 ELSE 0 END +
        CASE WHEN td.railway = 1 THEN 1 ELSE 0 END +
        CASE WHEN td.railway_station = 1 THEN 1 ELSE 0 END +
        CASE WHEN td.roundabout = 1 THEN 1 ELSE 0 END +
        CASE WHEN td.stop = 1 THEN 1 ELSE 0 END +
        CASE WHEN td.traffic_calming = 1 THEN 1 ELSE 0 END +
        CASE WHEN td.traffic_signal = 1 THEN 1 ELSE 0 END +
        CASE WHEN td.turning_loop = 1 THEN 1 ELSE 0 END
    ) AS available_traffic_details_count
FROM 
    "THOMAS.MARTIN".Accident a
    JOIN
    RCARVALHEIRA.TrafficDetails td ON td.traffic_details_id = a.traffic_details_id
    JOIN 
    RCARVALHEIRA.LocationDetails l ON l.location_id = a.location_id
    JOIN
    MSTRENGES.STATE s ON s.state_id = l.state_id
WHERE
    l.city IS NOT NULL 
GROUP BY 
    s.name,
    l.city,
    a.accident_date
ORDER BY 
    s.name ASC,
    l.city ASC,
    a.accident_date ASC
FETCH FIRST 50 ROWS ONLY;

/* Query 2: Relationship between Covid-19 lockdowns and traffic accidents */
SELECT 
    s.name,
    a.accident_date,
    c.number_of_trips,
    ROUND(c.population_staying_at_home / (c.population_staying_at_home + c.population_not_staying_at_home) * 100,2) AS perc_pop_at_home,
    COUNT(*) AS accident_count,
    (beforeLockdown.number_of_trips - c.number_of_trips) AS trips_diff_to_2019
FROM 
    MSTRENGES.COVIDTRIPSBYDISTANCE c
    JOIN
    RCARVALHEIRA.LocationDetails l ON l.state_id = c.state_id
    JOIN
    "THOMAS.MARTIN".Accident a ON a.location_id = l.location_id
    JOIN 
    MSTRENGES.STATE s ON s.state_id = l.state_id
    JOIN
    (SELECT 
        state_id, 
        year, 
        month, 
        day,
        number_of_trips
    FROM MSTRENGES.COVIDTRIPSBYDISTANCE
    WHERE year = 2019) beforeLockdown ON beforeLockdown.state_id = l.state_id
WHERE
    EXTRACT(YEAR FROM a.accident_date) = c.year AND 
    EXTRACT(MONTH FROM a.accident_date) = c.month AND
    EXTRACT(DAY FROM a.accident_date) = c.day AND
    c.day = beforeLockdown.day AND
    c.month = beforeLockdown.month AND
    a.accident_date between ('12-MAR-20')AND ('31-AUG-20')
GROUP BY
    s.name, 
    a.accident_date,
    c.number_of_trips,
    c.population_staying_at_home / (c.population_staying_at_home + c.population_not_staying_at_home),
    (beforeLockdown.number_of_trips - c.number_of_trips)
ORDER BY
    s.name ASC,
    a.accident_date ASC;

/* Query 3: Relationship between unemployment rates and accident rates */
SELECT 
    l.state_id, 
    u.month_no, 
    u.year, 
    u.rate
FROM 
    RCARVALHEIRA.LocationDetails l
JOIN 
    "THOMAS.MARTIN".Accident a ON l.location_ID = a.location_ID 
JOIN 
    mstrenges.unemployment u ON l.state_id = u.state_id 
WHERE 
    l.state_id = 'FL' 
    AND EXTRACT(YEAR FROM a.accident_date) = u.year 
    AND EXTRACT(MONTH FROM a.accident_date) = u.month_no
GROUP BY 
    l.state_id, 
    u.month_no, 
    u.year, 
    u.rate
ORDER BY 
    l.state_id ASC, 
    u.year ASC, 
    u.month_no ASC
FETCH FIRST 100 ROWS ONLY;

/* Query 4: Correlation between Consumer Price Index (CPI) and accident rates */
SELECT 
	l.state_id, 
	c.quarter, 
	c.year, 
	c.price_index, 
	count(*)
FROM 
	"THOMAS.MARTIN".Accident a, 
	RCARVALHEIRA.LocationDetails l, 
	mstrenges.CPI c
WHERE 
	l.location_ID = a.location_ID and 
	l.state_id = c.state_id and EXTRACT(YEAR FROM a.accident_date)=c.year 
	and TO_CHAR(a.accident_date, 'Q')=c.quarter and l.state_id='FL' 
	and c.state_id='FL' 
GROUP BY 
	l.state_id, 
	c.quarter, 
	c.year, 
	c.price_index
ORDER BY 
	l.state_id, 
	c.year,
	c.quarter;

/* Query 5: Correlation between road conditions and accident rates */
SELECT
    s.name AS state,
    rc.year,
    rc.percent_acceptable_miles,
    COUNT(a.accident_id) AS accident_count
FROM 
    RCARVALHEIRA.LocationDetails l
    JOIN
    "THOMAS.MARTIN".Accident a ON l.location_ID = a.location_ID
    JOIN
    MSTRENGES.ROADCONDITIONS rc ON l.state_id = rc.state_id
    JOIN
    MSTRENGES.STATE s ON s.state_id = l.state_id
WHERE 
    EXTRACT(YEAR FROM a.accident_date) = rc.year
GROUP BY
    rc.year,
    rc.percent_acceptable_miles,
    s.name
ORDER BY
    s.name ASC,
    rc.year ASC
FETCH FIRST 100 ROWS ONLY;