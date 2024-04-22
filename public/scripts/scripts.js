import { showLoader, hideLoader } from "./utils.js";
import {
    getQuery1,
    getQuery2,
    getQuery3,
    getQuery4,
    getQuery5,
    highlightKeywords,
} from "./queries.js";

// manage the charts
let myChart1 = null;
let myChart2 = null;
let myChart3 = null;
let myChart4 = null;
let myChart5 = null;

// flag is query has been run or not
let query1Ran = false;
let query2Ran = false;
let query3Ran = false;
let query4Ran = false;
let query5Ran = false;

// submits a query, takes an element
const querySubmitHandler = async (element) => {
    // get the corresponding query number off the elemt id
    const queryNumber = element.id[element.id.length - 1];
    const ul = document.getElementById(`response-${queryNumber}`);
    const timeDiv = document.getElementById(`time-${queryNumber}`);
    console.log("queryNumber: ", queryNumber);

    // clear previous time and results
    timeDiv.innerText = "Results: ";
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    // display loading element
    showLoader(`queryLoader-${queryNumber}`);

    console.log("input data", queryManager.getQueryString(queryNumber));

    try {
        // post to backend
        const response = await fetch("http://localhost:3000/data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data: queryManager.getQueryString(queryNumber),
            }),
        });

        // error on bad response
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // await getting the response in json
        const data = await response.json();

        // check for success results or error for bad query on our custom checks to prevent alter
        if (data.message === "success") {
            // add a li for each item to the ul
            data.result.forEach((item) => {
                const li = document.createElement("li");
                li.classList.add("list-item");
                const textNode = document.createTextNode(item);
                li.appendChild(textNode);
                ul.appendChild(li);
            });

            timeDiv.innerText = `Results: ${data.execution_time}`;
            console.log(Number.isInteger(queryNumber));
            // Handle charts for each visualization
            switch (queryNumber) {
                case "1":
                    visualizeQuery1(data);
                    break;
                case "2":
                    visualizeQuery2(data);
                    break;
                case "3":
                    visualizeQuery3(data);
                    break;
                case "4":
                    visualizeQuery4(data);
                    break;
                case "5":
                    visualizeQuery5(data);
                    break;
                default:
                    break;
            }
            M.toast({
                html: "Visualization Ready!",
                displayLength: 2000, // Duration in milliseconds (4000 is the default)
                inDuration: 300, // Transition in duration
                outDuration: 375, // Transition out duration
                classes: "green-toast rounded", // Additional classes for customization
                completeCallback: function () {
                    console.log("Toast dismissed.");
                }, // Callback function when toast is dismissed
            });
        } else {
            timeDiv.innerText = data.message;
        }

        hideLoader(`queryLoader-${queryNumber}`);
    } catch (error) {
        console.error("Error:", error);
    }
};

// colors for graphs
const colors = [
    "rgba(255, 99, 132)", // Red
    "rgba(54, 162, 235)", // Blue
    "rgba(255, 206, 86)", // Yellow
    "rgba(153, 102, 255)", // Purple
    "rgba(32, 178, 170)", // Light Sea Green
    "rgba(210, 105, 30)", // Chocolate
    "rgba(255, 159, 64)", // Orange
    "rgba(75, 192, 192)", // Green
    "rgba(255, 99, 71)", // Tomato
    "rgba(60, 179, 113)", // Medium Sea Green
    "rgba(32, 178, 170)", // Light Sea Green
    "rgba(70, 130, 180)", // Steel Blue
    "rgba(72, 61, 139)", // Dark Slate Blue
    "rgba(143, 188, 143)", // Dark Sea Green
    "rgba(210, 105, 30)", // Chocolate
    "rgba(188, 143, 143)", // Rosy Brown
    "rgba(189, 183, 107)", // Dark Khaki
];
const colorsAlpha = [
    "rgba(255, 99, 132, 0.9)", // Red
    "rgba(54, 162, 235, 0.9)", // Blue
    "rgba(255, 206, 86, 0.9)", // Yellow
    "rgba(153, 102, 255, 0.9)", // Purple
    "rgba(32, 178, 170, 0.9)", // Light Sea Green
    "rgba(210, 105, 30, 0.9)", // Chocolate
    "rgba(255, 159, 64, 0.9)", // Orange
    "rgba(75, 192, 192)", // Green
    "rgba(255, 99, 71, 0.9)", // Tomato
    "rgba(60, 179, 113, 0.9)", // Medium Sea Green
    "rgba(32, 178, 170, 0.9)", // Light Sea Green
    "rgba(70, 130, 180, 0.9)", // Steel Blue
    "rgba(72, 61, 139, 0.9)", // Dark Slate Blue
    "rgba(143, 188, 143, 0.9)", // Dark Sea Green
    "rgba(210, 105, 30, 0.9)", // Chocolate
    "rgba(188, 143, 143, 0.9)", // Rosy Brown
    "rgba(189, 183, 107, 0.9)", // Dark Khaki
];
// months labels
const monthLabels = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
];

const visualizeQuery1 = (data) => {
    if (myChart1) {
        myChart1.destroy();
    }
    const ctx = document.getElementById("myChart-1").getContext("2d");

    const rawData = data.result;

    let dataByYear = {};

    // Process rawData to fit into the data structure
    rawData.forEach((item) => {
        const year = item[2];
        const month = item[3];
        const value = item[6];

        if (!dataByYear[year]) {
            dataByYear[year] = Array(12).fill(null);
        }
        dataByYear[year][month - 1] = value; // Month index is zero-based
    });

    // Prepare datasets
    const datasets = Object.keys(dataByYear).map((year, i) => {
        return {
            label: year,
            data: dataByYear[year],
            fill: true,
            borderColor: colors[i % colors.length],
            backgroundColor: colorsAlpha[i % colorsAlpha.length],
            pointBackgroundColor: "#fff",
            pointBorderColor: colors[i % colors.length],
            /* tension: 0.4, */
            pointRadius: 3,
            pointBorderWidth: 3,
        };
    });

    // Chart initialization
    // const ctx = document.getElementById('myChart').getContext('2d');
    myChart1 = new Chart(ctx, {
        type: "line",
        data: {
            labels: monthLabels,
            datasets: datasets,
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Month",
                    },
                },
                y: {
                    stacked: true,
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: "Accident Rate",
                    },
                },
            },
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                },
            },
        },
    });
};

const visualizeQuery2 = (data) => {
    if (myChart2) {
        myChart2.destroy();
    }
    const ctx = document.getElementById("myChart-2").getContext("2d");

    const rawData = data.result;
    console.log(data.result);

    // You would modify this processing part based on the actual structure of your rawData
    const labels = rawData.map((item) => item[1].substring(0, 10)); // Accident date is at index 1
    const number_of_trips_2020 = rawData.map((item) => Number(item[2])); // Number of trips in 2020 is at index 2
    const perc_pop_at_home = rawData.map((item) => Number(item[3])); // Percent population at home is at index 3
    const accident_rate = rawData.map((item) => Number(item[4])); // Accident rate (times 1,000) is at index 4
    const number_of_trips_2019 = rawData.map((item) => Number(item[5])); // 2019 number of trips is at index 5

    console.log(labels);
    console.log(number_of_trips_2019);
    // Chart initialization
    myChart2 = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Number of Trips 2020",
                    data: number_of_trips_2020,
                    borderColor: colors[0 % colors.length],
                    backgroundColor: "#fff",
                    pointRadius: 2,
                    pointBorderWidth: 2,
                    yAxisID: "y-axis-trips",
                },
                {
                    label: "Number of Trips 2019",
                    data: number_of_trips_2019,
                    borderColor: colors[1 % colors.length],
                    backgroundColor: "#fff",
                    pointRadius: 2,
                    pointBorderWidth: 2,
                    yAxisID: "y-axis-trips",
                },
                {
                    label: "Percentage Population at Home",
                    data: perc_pop_at_home,
                    borderColor: colors[2 % colors.length],
                    backgroundColor: "#fff",
                    pointRadius: 2,
                    pointBorderWidth: 2,
                    yAxisID: "y-axis-percent",
                },
                {
                    label: "Accident Rate",
                    data: accident_rate,
                    borderColor: colors[3 % colors.length],
                    backgroundColor: "#fff",
                    pointRadius: 2,
                    pointBorderWidth: 2,
                    yAxisID: "y-axis-percent",
                },
            ],
        },
        options: {
            scales: {
                "y-axis-trips": {
                    type: "linear",
                    display: true,
                    position: "left",
                    title: {
                        display: true,
                        text: "Number of Trips",
                    },
                },
                "y-axis-percent": {
                    type: "linear",
                    display: true,
                    position: "right",
                    title: {
                        display: true,
                        text: "Percentage / Rate",
                    },
                    // assuming perc_pop_at_home and accident_rate are percentages
                    suggestedMin: 0,
                    suggestedMax: 100,
                },
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || "";
                            if (label) {
                                label += ": ";
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y;
                                if (
                                    context.dataset.yAxisID === "y-axis-percent"
                                ) {
                                    label += "%";
                                }
                            }
                            return label;
                        },
                    },
                },
                legend: {
                    display: true,
                    position: "top",
                },
            },
        },
    });
};
const visualizeQuery3 = (data) => {
    if (myChart3) {
        myChart3.destroy();
    }
    const ctx = document.getElementById("myChart-3").getContext("2d");

    const rawData = data.result; // Replace this with your actual data source

    // Prepare the data structure
    const labels = [];
    const unemploymentRates = [];
    const accidentRates = [];

    // Process rawData to fill the data structure
    rawData.forEach((item) => {
        const date = `${item[1]}/${item[2]}`;
        const unemploymentRate = item[3];
        const accidentRate = item[4];

        labels.push(date);
        unemploymentRates.push(unemploymentRate);
        accidentRates.push(accidentRate);
    });

    // Chart initialization
    myChart3 = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Unemployment Rate",
                    data: unemploymentRates,
                    borderColor: colors[0 % colors.length],
                    backgroundColor: "#fff",
                    /*   pointBackgroundColor: "#fff",
                    pointBorderColor: colorsAlpha[0 % colorsAlpha.length], */
                    /*     tension: 0.4, */
                    pointRadius: 3,
                    pointBorderWidth: 3,
                    yAxisID: "y", // Assign to the first Y axis
                },
                {
                    label: "Accident Rate",
                    data: accidentRates,
                    borderColor: colors[1 % colors.length],
                    backgroundColor: "#fff",
                    /* pointBackgroundColor: "#fff",
                    pointBorderColor: colorsAlpha[1 % colorsAlpha.length], */
                    /*   tension: 0.4, */
                    pointRadius: 3,
                    pointBorderWidth: 3,
                    yAxisID: "y", // Assign to the second Y axis
                },
            ],
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Time",
                    },
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: "Rate",
                    },
                },
                /*    y1: {
                    beginAtZero: false,
                    position: "right",
                    title: {
                        display: true,
                        text: "Unemployment Rate (%)",
                    },
                    grid: {
                        drawOnChartArea: false, // Only show the grid for this axis
                    },
                }, */
            },
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                },
                tooltip: {
                    mode: "index",
                    intersect: false,
                },
            },
            interaction: {
                mode: "nearest",
                axis: "x",
                intersect: false,
            },
        },
    });
};
const visualizeQuery4 = (data) => {};
const visualizeQuery5 = (data) => {};

// store the queries and their html string variant
const queryManager = {
    queries: {},
    setQuery: function (queryNumber, ...params) {
        if (!this.queries[queryNumber]) {
            this.queries[queryNumber] = {};
        }

        let queryString = "";
        switch (queryNumber) {
            case 1:
                queryString = getQuery1(...params);
                break;
            case 2:
                queryString = getQuery2(...params);
                break;
            case 3:
                queryString = getQuery3(...params);
                break;
            case 4:
                queryString = getQuery4(...params);
                break;
            case 5:
                queryString = getQuery5(...params);
                break;
            default:
                break;
        }

        this.queries[queryNumber].queryString = queryString;
        this.queries[queryNumber].queryHTML = highlightKeywords(
            this.queries[queryNumber].queryString
        );
    },
    getQuery: function (queryNumber) {
        return queryNumber in this.queries ? this.queries[queryNumber] : null;
    },
    getQueryString: function (queryNumber) {
        const q = this.getQuery(queryNumber);
        return q ? q.queryString : "";
    },
    getQueryHTML: function (queryNumber) {
        const q = this.getQuery(queryNumber);
        return q ? q.queryHTML : "";
    },
    renderQueries: function () {
        // render queries as html
        document.getElementById("queryInput-1").innerHTML =
            queryManager.getQueryHTML(1);

        document.getElementById("queryInput-2").innerHTML =
            queryManager.getQueryHTML(2);

        document.getElementById("queryInput-3").innerHTML =
            queryManager.getQueryHTML(3);

        document.getElementById("queryInput-4").innerHTML =
            queryManager.getQueryHTML(4);

        document.getElementById("queryInput-5").innerHTML =
            queryManager.getQueryHTML(5);
    },
};

// dom is ready
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Materialize components
    var tabs = document.querySelector(".tabs");
    var instance = M.Tabs.init(tabs);
    var elems = document.querySelectorAll("select");
    var instances = M.FormSelect.init(elems);
    var elems = document.querySelectorAll(".modal");
    var minstances = M.Modal.init(elems);
    var elems = document.querySelectorAll(".collapsible");
    var cinstances = M.Collapsible.init(elems);

    //var elems = document.querySelectorAll(".collapsible");
    //M.UpdateTextFields();

    queryManager.setQuery(1, "FL", "Orlando");
    queryManager.setQuery(2, "FL", 3);
    queryManager.setQuery(3, "FL", 4.3);
    queryManager.setQuery(4, "FL");
    queryManager.setQuery(5, "FL", "GA");
    queryManager.renderQueries();

    // add event listeners to query form submit event for each form we have
    document.getElementById("dataForm-1").addEventListener("submit", (e) => {
        e.preventDefault();
        querySubmitHandler(e.target);
    });

    document.getElementById("dataForm-2").addEventListener("submit", (e) => {
        e.preventDefault();
        querySubmitHandler(e.target);
    });

    document.getElementById("dataForm-3").addEventListener("submit", (e) => {
        e.preventDefault();
        querySubmitHandler(e.target);
    });

    document.getElementById("dataForm-4").addEventListener("submit", (e) => {
        e.preventDefault();
        querySubmitHandler(e.target);
    });

    document.getElementById("dataForm-5").addEventListener("submit", (e) => {
        e.preventDefault();
        querySubmitHandler(e.target);
    });

    // event listeners for query 1
    document.getElementById("states-1").addEventListener("change", (e) => {
        const city = document.getElementById("states-1").value;
        if (city) {
            queryManager.setQuery(1, e.target.value, city);
            document.getElementById("queryInput-1").innerHTML =
                queryManager.getQueryHTML(1);
        }
    });

    document.getElementById("city-1").addEventListener("change", (e) => {
        const state = document.getElementById("states-1").value;
        if (state) {
            queryManager.setQuery(1, state, e.target.value);
            document.getElementById("queryInput-1").innerHTML =
                queryManager.getQueryHTML(1);
        }
    });

    // event listeners for query 2
    document.getElementById("states-2").addEventListener("change", (e) => {
        const month = document.getElementById("months-2").value || 3;
        queryManager.setQuery(2, e.target.value, Number(month));
        document.getElementById("queryInput-2").innerHTML =
            queryManager.getQueryHTML(2);
    });

    document.getElementById("months-2").addEventListener("change", (e) => {
        const state = document.getElementById("states-2").value || "FL";
        queryManager.setQuery(2, state, Number(e.target.value));
        document.getElementById("queryInput-2").innerHTML =
            queryManager.getQueryHTML(2);
    });

    // event listeners for query 3
    document.getElementById("states-3").addEventListener("change", (e) => {
        const rate = document.getElementById("rate-3").value || 4;
        queryManager.setQuery(3, e.target.value, rate);
        document.getElementById("queryInput-3").innerHTML =
            queryManager.getQueryHTML(3);
    });

    document.getElementById("rate-3").addEventListener("change", (e) => {
        const state = document.getElementById("states-3").value || "FL";
        queryManager.setQuery(3, state, e.target.value);
        document.getElementById("queryInput-3").innerHTML =
            queryManager.getQueryHTML(3);
    });

    // event listeners for query 4
    document.getElementById("states-4").addEventListener("change", (e) => {
        queryManager.setQuery(4, e.target.value);
        document.getElementById("queryInput-4").innerHTML =
            queryManager.getQueryHTML(4);
    });

    document.getElementById("states-5").addEventListener("change", (e) => {
        const state2 = document.getElementById("states-5-2").value;

        if (state2) {
            queryManager.setQuery(5, e.target.value, state2);
            document.getElementById("queryInput-5").innerHTML =
                queryManager.getQueryHTML(5);
        }
    });

    document.getElementById("states-5-2").addEventListener("change", (e) => {
        const state1 = document.getElementById("states-5").value;

        if (state1) {
            queryManager.setQuery(5, state1, e.target.value);
            document.getElementById("queryInput-5").innerHTML =
                queryManager.getQueryHTML(5);
        }
    });

    // start the user on the input form so they can type right away
    document.getElementById("queryInput-1").focus();
});
