const createLinks = (webURL, GitHubURL) => {
    const links = document.createElement("div");
    links.classList.add("links");

    links.innerHTML = `
        <div class="link">
            <a
                target="_blank"
                href="${webURL}"
                class="text-neutral-grayish-blue">
                <i
                    class="fa-brands fa-github fa-xl text-neutral-moderate-blue"></i>
                Github</a
            >
        </div>
    `;
    if (GitHubURL) {
        links.innerHTML += `
            <div class="link">
                <a
                    target="_blank"
                    href="https://frontendmentor-interactive-comments.vercel.app/"
                    class="text-neutral-grayish-blue">
                    <i
                        class="fa-solid fa-globe fa-xl text-primary-soft-red"></i>
                    Hemsida</a
                >
            </div>
        `;
    }
    return links.outerHTML;
};

const createDialog = async (title, webURL, GitHubURL, contributors = []) => {
    const dialog = document.createElement("dialog");
    dialog.classList.add("modal");
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
                    class="text-neutral-grayish-blue"
                    >${contributor.login}</a
                >
            `;
            contributorsList.appendChild(li);
        });
    }

    let bodyContent = "";
    try {
        const { data } = await octokit.request(
            "GET /repos/{owner}/{repo}/readme",
            {
                owner: "JosefForkman",
                repo: title,
                headers: {
                    "X-GitHub-Api-Version": "2022-11-28",
                    "accept": "application/vnd.github.html+json",
                },
            },
        );
        if (data.content) {
            bodyContent = atob(data.content);
        } else if (data) {
            bodyContent = data;
        } else {
            bodyContent = "Kunde inte hitta någon Readme";
        }
    } catch (error) {
        console.error(error);
    }

    dialog.innerHTML = `
        <div class="content bg-neutral-white">
            <div class="header">
                <button
                    popovertargetaction="hide"
                    popovertarget="${title}">
                    <i
                        class="fa-solid fa-times fa-lg text-neutral-moderate-blue text-neutral-grayish-blue-hover"></i>
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
