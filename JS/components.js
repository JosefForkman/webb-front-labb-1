const createLinks = (webURL, GitHubURL) => {
    const links = document.createElement("div");
    links.classList.add("links");

    links.innerHTML = `
        <div class="link">
            <a
                target="_blank"
                href="${webURL}"
                class="text-gray-400">
                <i
                    class="fa-brands fa-github fa-xl text-blue-400"></i>
                Github</a
            >
        </div>
    `;
    if (GitHubURL) {
        links.innerHTML += `
            <div class="link">
                <a
                    target="_blank"
                    href="${GitHubURL}"
                    class="text-gray-400">
                    <i
                        class="fa-solid fa-globe fa-xl text-primary-soft-red"></i>
                    Hemsida</a
                >
            </div>
        `;
    }
    return links.outerHTML;
};

const createDialog = async (
    title,
    webURL,
    GitHubURL,
    bodyContent,
    contributors = [],
) => {
    const dialog = document.createElement("dialog");
    dialog.classList.add("modal");
    dialog.classList.add("bg-gray-100");
    dialog.setAttribute("popover", "auto");
    dialog.id = title;

    const links = createLinks(webURL, GitHubURL);

    const contributorsList = document.createElement("ul");
    if (contributors && contributors.length > 0) {
        contributors.forEach((contributor) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <a
                    href="${contributor.html_url}"
                    target="_blank"
                    class="text-gray-400"
                    >${contributor.login}</a
                >
            `;
            contributorsList.appendChild(li);
        });
    }

    dialog.innerHTML = `
        <div class="content">
            <div class="header">
                <button
                    popovertargetaction="hide"
                    popovertarget="${title}">
                    <i
                        class="fa-solid fa-times fa-lg text-blue-400 text-gray-400-hover"></i>
                </button>
            </div>
            <div class="body">
                <h2>
                    ${title}
                </h2>
                ${links}
                <div class="contributors">
                    <h3>contributors:</h3>
                    ${contributorsList.outerHTML}
                </div>
                ${bodyContent}
            </div>
        </div>
    `;

    return dialog;
};

export { createDialog, createLinks };
