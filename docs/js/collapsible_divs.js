function create_collapsible_div(title_content, body_content, class_name=null) {
    var details = document.createElement("details");
    details.className = class_name;

    // Create the title
    var title = document.createElement("summary");
    if (typeof title_content === "string") {
        title.innerHTML = title_content;
    } else if (Array.isArray(title_content)) {
        for (let elem of title_content) {
            title.appendChild(elem);
        }
    } else {
        title_div.appendChild(title_content);
    }

    var content = document.createElement("div");
    if (typeof body_content === "string") {
        content.innerHTML = body_content;
    } else if (Array.isArray(body_content)) {
        for (let elem of body_content) {
            content.appendChild(elem);
        }
    } else {
        content.appendChild(body_content);
    }

    details.appendChild(title);
    details.appendChild(content);
    return details;
}

// function create_collapsible_div(title, content, class_name=null) {
//     var container = document.createElement("div");
//     container.classList.add("collapsible-div-container");
//     if (class_name != null) {
//         container.classList.add(...class_name.split(" "));
//     }

//     // Create the clickable Title
//     var title_div = document.createElement("div");
//     title_div.classList.add("collapsible-div-title");
//     title_div.onclick = collapsible_div_title_onclick;
//     if (typeof title === "string") {
//         var title_p = document.createElement("p");
//         title_p.innerHTML = title;
//         title_div.appendChild(title_p);
//     } else if (Array.isArray(title)) {
//         for (let elem of title) {
//             title_div.appendChild(elem);
//         }
//     } else {
//         title_div.appendChild(title);
//     }

//     var content_div = document.createElement("div");
//     content_div.classList.add("collapsible-div-content");
//     if (typeof content == "string") {
//         let content_p = document.createElement("p");
//         content_p.innerHTML = content;
//         content_div.appendChild(content_p);
//     } else if (typeof content == "object") {
//         for (let elem of content) {
//             content_div.appendChild(elem);
//         }
//     }

//     container.appendChild(title_div);
//     container.appendChild(content_div);
//     return container;
// }

function collapsible_div_title_onclick(event) {
    // console.log(event);
    // console.log(event.target.parentNode);
    var target = event.target;
    while (true) {
        if (target.classList.contains("collapsible-div-container")) {
            if (!(target.classList.contains("disabled"))) {
                target.classList.toggle("closed");
            }
            return;
        } else {
            let parent = target.parentNode;
            if (parent == window) {
                return;
            } else {
                target = parent;
            }
        }
    }
}

function activate_collapsible_divs() {
    console.groupCollapsed("Activating collapsible_divs");
    var collapsible_titles = document.querySelectorAll(".collapsible-div-title");
    console.log(`Found ${collapsible_titles.length} collapsible_divs`);
    for (var title of collapsible_titles) {
        title.addEventListener("click", collapsible_div_title_onclick, true)
    }
    console.groupEnd();
}