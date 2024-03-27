document.getElementById("dataForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the normal submission of the form

    const loader = document.getElementById("queryLoader");
    loader.classList.remove("none");
    loader.classList.add("block");

    const inputData = document.getElementById("queryInput").value;
    console.log("input data", inputData);
    fetch("http://localhost:3000/data", {
        // Use the correct port and endpoint
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: inputData }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Success:", data);
            loader.classList.remove("block");
            loader.classList.add("none");

            const ul = document.getElementById("response");
            data.result.forEach((item) => {
                const li = document.createElement("li");
                const textNode = document.createTextNode(item);
                li.appendChild(textNode);
                ul.appendChild(li);
            });

            const timeDiv = document.getElementById("time");

            timeDiv.innerText = `Execution Time: ${data.execution_time}`;

            // Handle success response
            // You can display a success message or clear the form as needed.
        })
        .catch((error) => {
            console.error("Error:", error);
            // Handle errors here
            // You can display an error message to the user.
        });
});

document.getElementById("queryInput").focus();
