//unemployment
export const getQuery1 = (state) => {
    return `
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
    l.state_id = '${state}' 
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
`;
};
