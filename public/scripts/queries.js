//unemployment
export const getQuery1 = (state, city) => {
    return `SELECT IQ.state, city, IQ.Year, IQ.Month, IQ.severity_avg, IQ.available_traffic_details_count, 
        ROUND(IQ.accident_count / (d.driverpopulation/12),10)*1000 AS "Accident_Rate(Times 1,000)"
FROM(SELECT 
    s.name AS state,
    s.state_id as sID,
    l.city as city,
    EXTRACT(YEAR FROM a.accident_date) as Year,
    EXTRACT(MONTH FROM a.accident_date) as Month,
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
    l.city = '${city}' AND
    s.state_id = '${state}'
GROUP BY 
    s.name,
    s.state_id,
    l.city,
    EXTRACT(YEAR FROM a.accident_date),
    EXTRACT(MONTH FROM a.accident_date)
ORDER BY 
    s.name ASC
) IQ
JOIN
    MSTRENGES.DRIVERPOPULATION d ON d.state_id = IQ.sID and d.year=IQ.year
ORDER BY
    IQ.state, 
    IQ.Year asc, 
    IQ.Month asc
`;
};

export const getQuery2 = (state, month) => {
    console.log("month: ", month);
    if (month == 0) {
        return `SELECT 
    s.name AS state,
    accident_date,
    number_of_trips,
    perc_pop_at_home,
    ROUND(accident_count / (d.driverpopulation/365), 10)*1000 AS "Accident_Rate(Times 1,000)",
    "2019_number_of_trips"
FROM (
    SELECT 
        l.state_id,
        a.accident_date,
        c.number_of_trips,
        ROUND(c.population_staying_at_home / (c.population_staying_at_home + c.population_not_staying_at_home) * 100,2) AS perc_pop_at_home,
        COUNT(*) AS accident_count,
        beforeLockdown.number_of_trips AS "2019_number_of_trips"
    FROM 
        MSTRENGES.COVIDTRIPSBYDISTANCE c
        JOIN
        RCARVALHEIRA.LocationDetails l ON l.state_id = c.state_id
        JOIN
        "THOMAS.MARTIN".Accident a ON a.location_id = l.location_id
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
        l.state_id, 
        a.accident_date,
        c.number_of_trips,
        c.population_staying_at_home / (c.population_staying_at_home + c.population_not_staying_at_home),
        beforeLockdown.number_of_trips
    ) acc_covid
JOIN
    MSTRENGES.STATE s ON s.state_id = acc_covid.state_id
JOIN
    MSTRENGES.DRIVERPOPULATION d ON d.state_id = acc_covid.state_id
WHERE
    EXTRACT(YEAR FROM acc_covid.accident_date) = d.year and
    s.state_id = '${state}'
ORDER BY
    s.name ASC,
    accident_date ASC`;
    } else {
        return `SELECT 
    s.name AS state,
    accident_date,
    number_of_trips,
    perc_pop_at_home,
    ROUND(accident_count / (d.driverpopulation/365), 10)*1000 AS "Accident_Rate(Times 1,000)",
    "2019_number_of_trips"
FROM (
    SELECT 
        l.state_id,
        a.accident_date,
        c.number_of_trips,
        ROUND(c.population_staying_at_home / (c.population_staying_at_home + c.population_not_staying_at_home) * 100,2) AS perc_pop_at_home,
        COUNT(*) AS accident_count,
        beforeLockdown.number_of_trips AS "2019_number_of_trips"
    FROM 
        MSTRENGES.COVIDTRIPSBYDISTANCE c
        JOIN
        RCARVALHEIRA.LocationDetails l ON l.state_id = c.state_id
        JOIN
        "THOMAS.MARTIN".Accident a ON a.location_id = l.location_id
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
        l.state_id, 
        a.accident_date,
        c.number_of_trips,
        c.population_staying_at_home / (c.population_staying_at_home + c.population_not_staying_at_home),
        beforeLockdown.number_of_trips
    ) acc_covid
JOIN
    MSTRENGES.STATE s ON s.state_id = acc_covid.state_id
JOIN
    MSTRENGES.DRIVERPOPULATION d ON d.state_id = acc_covid.state_id
WHERE
    EXTRACT(YEAR FROM acc_covid.accident_date) = d.year and
    s.state_id = '${state}' and
    EXTRACT(Month FROM acc_covid.accident_date) = ${month}
ORDER BY
    s.name ASC,
    accident_date ASC`;
    }
};

export const getQuery3 = (state, rate) => {
    return `SELECT  acc_unemp.name, 
    acc_unemp.month_no as Month, 
    acc_unemp.year, 
    acc_unemp.rate as "Unemployment Rate",
    ROUND(accident_count / (d.driverpopulation/12),10)*1000 AS "Accident_Rate(Times 1,000)"
FROM(
SELECT 
    s.name,
    l.state_id,
    u.month_no, 
    u.year, 
    u.rate,
    COUNT(*) AS accident_count
FROM 
    RCARVALHEIRA.LocationDetails l
JOIN 
    "THOMAS.MARTIN".Accident a ON l.location_ID = a.location_ID 
JOIN 
    mstrenges.unemployment u ON l.state_id = u.state_id 
JOIN
    MSTRENGES.STATE s ON s.state_id=l.state_id
WHERE 
    EXTRACT(YEAR FROM a.accident_date) = u.year 
    AND EXTRACT(MONTH FROM a.accident_date) = u.month_no
GROUP BY 
    s.name, 
    l.state_id,
    u.month_no, 
    u.year, 
    u.rate
) acc_unemp 
JOIN
MSTRENGES.DRIVERPOPULATION d ON d.state_id = acc_unemp.state_id and d.year=acc_unemp.year,
(SELECT 
    s.name, 
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
JOIN
    MSTRENGES.STATE s ON s.state_id=l.state_id
WHERE 
    l.state_id = '${state}' 
    AND u.rate >= ${rate}
    AND EXTRACT(YEAR FROM a.accident_date) = u.year 
    AND EXTRACT(MONTH FROM a.accident_date) = u.month_no
GROUP BY 
    s.name, 
    l.state_id,
    u.month_no, 
    u.year, 
    u.rate
) qualRows
WHERE
    ((acc_unemp.month_no between qualrows.month_no-1 and qualRows.month_no AND acc_unemp.year = qualRows.year) OR (qualrows.month_no=1 and acc_unemp.month_no=12 and acc_unemp.year=qualrows.year-1))
    AND acc_unemp.state_id = qualRows.state_id
group by
    acc_unemp.name, 
    acc_unemp.month_no, 
    acc_unemp.year, 
    acc_unemp.rate,
    ROUND(accident_count / (d.driverpopulation/12),10)*1000
ORDER BY
    acc_unemp.name ASC, 
    acc_unemp.year ASC,
    acc_unemp.month_no ASC`;
};

export const getQuery4 = (region) => {
    return `SELECT
    acc_cpi.name, 
    acc_cpi.month, 
    acc_cpi.year, 
    acc_cpi.price_index*100,
    ROUND(acc_cpi.accident_count / (rpop.pop/12), 10) * 1000 AS "Accident_Rate(Times 1,000)"
FROM (SELECT 
    r.name,
    c.region_id, 
    c.month, 
    c.year, 
    c.price_index, 
    count(*) AS accident_count
FROM 
    "THOMAS.MARTIN".Accident a
    JOIN RCARVALHEIRA.LocationDetails l ON l.location_ID=a.location_ID
    JOIN mstrenges.state s ON s.state_id=l.state_id
    JOIN mstrenges.region r ON s.region_id=r.region_id
    JOIN mstrenges.CPI2 c ON c.region_id=r.region_id
WHERE 
    EXTRACT(YEAR FROM a.accident_date)=c.year AND 
    EXTRACT(MONTH FROM a.accident_date)=c.month AND 
    c.region_id='${region}'
GROUP BY 
    r.name,
    c.region_id, 
    c.month, 
    c.year, 
    c.price_index 
) acc_cpi
JOIN
    (SELECT s.region_id, d.year, sum(driverpopulation) AS pop
        FROM mstrenges.driverpopulation d
        JOIN mstrenges.state s on d.state_id = s.state_id
        JOIN mstrenges.region r on r.region_id=s.region_id
        WHERE s.region_id='${region}'
        GROUP BY s.region_id, d.year
    ) rpop on rpop.year=acc_cpi.year and rpop.region_id=acc_cpi.region_id
ORDER BY 
    acc_cpi.name, 
    acc_cpi.year,
    acc_cpi.month`;
};

export const getQuery5 = (state1, state2) => {
    return `SELECT
    s.name,
    acc_rc.year,
    percent_acceptable_miles,
    ROUND(accident_count / d.driverpopulation, 10) * 1000 AS "Accident_Rate(Times 1,000)"
FROM( 
    SELECT
        l.state_id,
        rc.year,
        rc.percent_acceptable_miles,
        COUNT(a.accident_id) AS accident_count
    FROM 
        RCARVALHEIRA.LocationDetails l
        JOIN
        "THOMAS.MARTIN".Accident a ON l.location_ID = a.location_ID
        JOIN
        MSTRENGES.ROADCONDITIONS rc ON l.state_id = rc.state_id
    WHERE 
        EXTRACT(YEAR FROM a.accident_date) = rc.year
    GROUP BY
        rc.year,
        rc.percent_acceptable_miles,
        l.state_id
    ) acc_rc
JOIN
    MSTRENGES.STATE s ON s.state_id = acc_rc.state_id
JOIN
    MSTRENGES.DRIVERPOPULATION d ON d.state_id = acc_rc.state_id
WHERE
    acc_rc.year = d.year and
    (s.state_id = '${state1}' OR s.state_id='${state2}')
ORDER BY
    s.name ASC,
    acc_rc.year ASC`;
};

export const highlightKeywords = (query) => {
    const keywords = [
        "SELECT",
        "JOIN",
        "ON",
        "WHERE",
        "GROUP BY",
        "ORDER BY",
        "FETCH",
        "FIRST",
        "EXISTS",
        "BETWEEN",
        "EXTRACT",
        "AND",
        "OR",
        "FROM",
        "THEN",
        "CASE",
        "END",
        "IF",
        "ELSE",
        "ASC",
        "DSC",
        "IS",
        "NOT",
        "NULL",
        "ROWS",
        "ONLY",
        "WHEN",
        "ROUND",
        "COUNT",
        "SUM",
        "AS",
        "AVG",
    ];

    // escape keywords for use in a regular expression, split, wrap in word boundary, then join
    const escapedKeywords = keywords.map((keyword) =>
        keyword
            .split(" ")
            .map((word) => `\\b${word}\\b`)
            .join("\\s+")
    );

    // regex to match all keywords
    const keywordsRegex = new RegExp(`(${escapedKeywords.join("|")})`, "gi");

    if (query) {
        // replace keywords with the span-wrapped version
        query = query.replace(keywordsRegex, (match) => {
            return `<span class="keyword">${match.toUpperCase()}</span>`;
        });
    }

    return query;
};
