/* Query 1: Relationship between accidents and traffic details */

/* Query 2: Relationship between Covid-19 lockdowns and traffic accidents */

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
    s.name,
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
    EXTRACT(YEAR FROM a.accident_date) = rc.year AND 
    rc.state_id = 'FL' AND
    rc.percent_acceptable_miles between 80 AND 89
GROUP BY
    rc.year,
    rc.percent_acceptable_miles,
    s.name
ORDER BY
    s.name ASC,
    rc.year ASC;