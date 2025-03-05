import { createDialog, createLinks } from "./components.js";
import { getProjects } from "./getProjects.js";
const educationContainer = document.querySelector("#education ul");

(async () => {
    try {
        const repos = await getProjects();
        const ul = document.querySelector("#projects-list");
        console.log(repos);

        ul.innerHTML = "";
        repos.forEach(async (repo) => {
            const li = document.createElement("li");
            const dialog = await createDialog(
                repo.name,
                repo.html_url,
                repo.homepage,
                repo.description,
                [repo.owner],
            );
            li.classList.add("card");
            li.innerHTML = `
                <h3><i class="fa-solid fa-book-bookmark fa-xl text-blue-400"></i> ${
                    repo.name
                }</h3>
                ${createLinks(repo.html_url, repo.homepage)}
                <button
                    popovertarget="${repo.name}"
                    class="btn w100 text-gray-100 bg-blue-400 bg-blue-200-hover bg-blue-200-focus">
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

            li.innerHTML = `
                <h3>${education.name}</h3>
                <p>${education.roll} ${startDate}-${endDate}</p>
            `;
            educationContainer.appendChild(li);
        });
    } catch (error) {}
})();
