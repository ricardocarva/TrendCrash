// define format for us dollar currency so it shows with dollar sign and commas
export const USDollar = (data) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

// generic debounce function used to help give user time to type a full word before checking their input
export const debounce = (func, timeout = 350) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, timeout);
    };
};

// helper to remove class from all items with it
export const removeAllByClass = (className) => {
    const items = document.querySelectorAll(`.${className}`);
    for (const item of items) {
        item.classList.remove(className);
    }
};

// shows the loader, assumes you mean the main query loader if no id given
export const showLoader = (id = "queryLoader") => {
    const loader = document.getElementById(id);
    if (loader) {
        loader.classList.remove("none");
        loader.classList.add("block");
    }
};

// hide the loader, assumes you mean the main query loader if no id given
export const hideLoader = (id = "queryLoader") => {
    const loader = document.getElementById(id);
    if (loader) {
        loader.classList.remove("block");
        loader.classList.add("none");
    }
};

export const noIllegalCommands = (query = "") => {
    return !query.includes("drop") && !query.includes("delete");
};

export const safeGuardQuery = (query = "") => {
    let copy = query;
    if (copy) {
        // lower case to make disallowing words easier
        copy = copy.toLowerCase();

        // remove any ;
        copy = copy.replace(/;/g, "");

        if (
            copy.includes("drop") ||
            copy.includes("delete") ||
            copy.includes("alter")
        ) {
            query = null;
        }
    }
    return query;
};
