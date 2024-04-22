//unemployment
export const getQuery1 = (state) => {
    return `
SELECT IQ.state, IQ.Year, IQ.Month, IQ.severity_avg, IQ.available_traffic_details_count, 
        ROUND(IQ.accident_count / (d.driverpopulation/12),10)*1000 AS "Accident_Rate(Times 1,000)"
FROM(SELECT 
    s.name AS state,
    s.state_id as sID,
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
    l.city IS NOT NULL and
    s.state_id = ${state}
GROUP BY 
    s.name,
    s.state_id,
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
