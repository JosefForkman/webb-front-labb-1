import { Octokit } from "https://esm.sh/octokit";
import { createDialog, createLinks } from "./components.js";
const educationContainer = document.querySelector("#education ul");

const octokit = new Octokit();

async () => {
    try {
        const ul = document.querySelector("#projects-list");
        const { data: repos } = await octokit.request(
            "GET /users/{username}/repos?per_page=4&page=0&sort=updated",
            {
                username: "JosefForkman",
            },
        );
        repos.forEach(async (repo, index) => {
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
            ul.children.item(index).remove();
            ul.appendChild(li);
        });
    } catch (error) {}
};

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

            li.innerHTML = `
                <h3>${education.name}</h3>
                <p>${education.roll} ${startDate}-${endDate}</p>
            `;
            educationContainer.appendChild(li);
        });
    } catch (error) {}
})();
