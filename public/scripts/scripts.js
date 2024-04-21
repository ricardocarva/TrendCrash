import { showLoader, hideLoader } from "./utils.js";
import {
    getQuery1,
    getQuery2,
    getQuery3,
    getQuery4,
    getQuery5,
    highlightKeywords,
} from "./queries.js";

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
        } else {
            timeDiv.innerText = data.message;
        }

        hideLoader(`queryLoader-${queryNumber}`);
    } catch (error) {
        console.error("Error:", error);
    }
};

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
    queryManager.setQuery(2, "FL");
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
        queryManager.setQuery(2, e.target.value);
        document.getElementById("queryInput-2").innerHTML =
            queryManager.getQueryHTML(2);
    });

    // event listeners for query 3
    document.getElementById("states-3").addEventListener("change", (e) => {
        queryManager.setQuery(3, e.target.value);
        document.getElementById("queryInput-3").innerHTML =
            queryManager.getQueryHTML(3);
    });

    document.getElementById("rate-3").addEventListener("change", (e) => {
        const state = document.getElementById("states-3").value;
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
