function create_collapsible_div(title_text, content, class_name=null) {
    var container = document.createElement("div");
    container.classList.add("collapsible-div-container");
    if (class_name != null) {
        container.classList.add(...class_name.split(" "));
    }

    var title_div = document.createElement("div");
    title_div.classList.add("collapsible-div-title");
    var title_p = document.createElement("p");
    title_p.innerHTML = title_text;
    title_div.appendChild(title_p);
    title_div.onclick = collapsible_div_title_onclick;

    var content_div = document.createElement("div");
    content_div.classList.add("collapsible-div-content");
    if (typeof content == "string") {
        let content_p = document.createElement("p");
        content_p.innerHTML = content;
        content_div.appendChild(content_p);
    } else if (typeof content == "object") {
        for (let elem of content) {
            content_div.appendChild(elem);
        }
    }

    container.appendChild(title_div);
    container.appendChild(content_div);
    return container;
}

function collapsible_div_title_onclick(event) {
    // console.log(event);
    // console.log(event.target.parentNode);
    var target = event.target;
    while (true) {
        if (target.classList.contains("collapsible-div-container")) {
            if (!(target.classList.contains("disabled"))) {
                target.classList.toggle("hidden");
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