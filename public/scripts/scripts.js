import { showLoader, hideLoader } from "./utils.js";
import { getQuery1, highlightKeywords } from "./queries.js";

// submits a query, takes an element
const querySubmitHandler = async (element) => {
    // get the corresponding query number off the elemt id
    const queryNumber = element.id[element.id.length - 1];
    const ul = document.getElementById(`response-${queryNumber}`);
    const timeDiv = document.getElementById(`time-${queryNumber}`);

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
        this.queries[queryNumber].queryString = getQuery1(...params);
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

    queryManager.setQuery(1, "FL");
    queryManager.setQuery(2);
    queryManager.setQuery(3);
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

    document.getElementById("states-1").addEventListener("change", (e) => {
        queryManager.setQuery(1, e.target.value);
        document.getElementById("queryInput-1").innerHTML =
            queryManager.getQueryHTML(1);
    });

    // start the user on the input form so they can type right away
    document.getElementById("queryInput-1").focus();
});
