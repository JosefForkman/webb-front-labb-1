import { Octokit } from "https://esm.sh/octokit";
const educationContainer = document.querySelector("#education ul");

const octokit = new Octokit();

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

    const body = document.createElement("div");
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

(async () => {
    try {
        const ul = document.querySelector("#projects-list");
        const { data: repos } = await octokit.request(
            "GET /users/{username}/repos?per_page=4&page=0&sort=updated",
            {
                username: "JosefForkman",
            },
        );
        console.log(repos);
        const repo = repos[0];
        console.log(repo);

        repos.forEach(async (repo) => {
            const li = document.createElement("li");
            const dialog = await createDialog(
                repo.name,
                repo.html_url,
                repo.homepage,
                [repo.owner],
            );
            li.classList.add("card");
            li.innerHTML = `
                <h3><i class="fa-solid fa-book-bookmark fa-xl text-neutral-moderate-blue"></i> ${
                    repo.name
                }</h3>
                ${createLinks(repo.html_url, repo.homepage)}
                <button
                    popovertarget="${repo.name}"
                    class="btn w100 text-neutral-white bg-neutral-moderate-blue bg-primary-light-grayish-blue-hover bg-primary-light-grayish-blue-focus">
                    Läs mera
                </button>

                ${dialog.outerHTML}
            `;
            ul.appendChild(li);
        });
    } catch (error) {}
})();

(async () => {
    try {
        const response = await fetch("/Education.json");
        const data = await response.json();
        educationContainer.innerHTML = "";
        data.forEach((education) => {
            const li = document.createElement("li");
            li.classList.add("card");

            const startDate = new Date(education.startDate).getFullYear();
            const endDate = new Date(education.endDate).getFullYear();
            console.log(startDate);
            console.log(endDate);

            li.innerHTML = `
                <h3>${education.name}</h3>
                <p>${education.roll} ${startDate}-${endDate}</p>
            `;
            educationContainer.appendChild(li);
        });
    } catch (error) {}
})();

// const getAllReposGraphQL = async () => {
//     const result = await octokit.graphql(
//         `
//           {
// 			user(login: "styrbjorn-n") {
// 			  pinnedItems(first: 5, types: [REPOSITORY, GIST, ORGANIZATION]) {
// 				totalCount
// 				edges {
// 				  node {
// 					... on Repository {
// 					  name
// 					  nameWithOwner
// 					  createdAt
// 					  updatedAt
// 					  forkCount
// 					  homepageUrl
// 					  url
// 					  openGraphImageUrl
// 					  collaborators {
// 						nodes {
// 						  avatarUrl
// 						  name
// 						}
// 						totalCount
// 					  }
//                       mentionableUsers(first: 100) {
// 						totalCount
// 						nodes {
// 						  avatarUrl
// 						  name
// 						}
// 					  }
// 					  stargazers {
// 						totalCount
// 					  }
// 					}
// 				  }
// 				}
// 			  }
// 			}
// 		  }
//         `,
//     );

//     const pinnedRepos = result.user.pinnedItems.edges
//         .map((edge) => edge.node)
//         .sort((a, b) => {
//             if (a.updatedAt < b.updatedAt) {
//                 return 1;
//             } else if (a.updatedAt === b.updatedAt) {
//                 return 0;
//             } else {
//                 return -1;
//             }
//         });
//     console.log(pinnedRepos);
// };

// getAllReposGraphQL();
