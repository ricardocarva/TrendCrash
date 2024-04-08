import { showLoader, hideLoader } from "./utils.js";
import { getQuery1 } from "./queries.js";

// submits a query, takes an element
const querySubmitHandler = async (element) => {
    // get the corresponding query number off the elemt id
    const queryNumber = element.id[element.id.length - 1];
    const ul = document.getElementById(`response-${queryNumber}`);
    const timeDiv = document.getElementById(`time-${queryNumber}`);

    // clear previous time and results
    timeDiv.innerText = "";
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    // display loading element
    showLoader(`queryLoader-${queryNumber}`);

    // get the data from the form
    const inputData = document.getElementById(
        `queryInput-${queryNumber}`
    ).value;

    console.log("input data", inputData);

    try {
        // post to backend
        const response = await fetch("http://localhost:3000/data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: inputData }),
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

// dom is ready
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Materialize tabs
    var tabs = document.querySelector(".tabs");
    var instance = M.Tabs.init(tabs);
    var elems = document.querySelectorAll("select");
    var instances = M.FormSelect.init(elems);

    // add event listeners to query form submit event for each form we have
    document.getElementById("queryInput-1").value = getQuery1("FL");
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

    document.getElementById("states").addEventListener("change", (e) => {
        document.getElementById("queryInput-1").value = getQuery1(
            e.target.value
        );
    });

    // start the user on the input form so they can type right away
    document.getElementById("queryInput-1").focus();
});


