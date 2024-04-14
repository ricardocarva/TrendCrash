//unemployment
export const getQuery1 = (state) => {
    return `SELECT 
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
