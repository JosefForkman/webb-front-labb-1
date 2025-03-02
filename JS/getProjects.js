import { Octokit } from "https://esm.sh/octokit";
const octokit = new Octokit();
const localStorageName = "projects";
const cashTime = 15;

export const getProjects = async () => {
    const currentTimestamp = new Date().getTime();
    try {
        let localStorageData = JSON.parse(
            localStorage.getItem(localStorageName),
        ) || {
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
            data: [],
        };

        /* Get data from localStorage */
        if (localStorageData && localStorageData.data.length > 0) {
            const diff = currentTimestamp - localStorageData.updatedAt;
            const diffInMinutes = Math.floor(diff / 1000 / 60);
            
            if (diffInMinutes <= cashTime) {
                console.log("Fetching data from localStorage");
                return localStorageData.data;
            }
        }

        console.log("Fetching data from GitHub");

        // Get data from GitHub
        const { data: repos } = await octokit.request(
            "GET /users/{username}/repos?per_page=4&page=0&sort=updated",
            {
                username: "JosefForkman",
            },
        );

        if (repos.length === 0) {
            return localStorageData.data;
        }

        // Get Readme from GitHub for each repo and update the return array
        const updatedRepo = await repos.map(async (repo) => {
            try {
                let description = "";
                const { data } = await octokit.request(
                    "GET /repos/{owner}/{repo}/readme",
                    {
                        owner: "JosefForkman",
                        repo: repo.name,
                        headers: {
                            "X-GitHub-Api-Version": "2022-11-28",
                            "accept": "application/vnd.github.html+json",
                        },
                    },
                );
                if (data.content) {
                    description = atob(data.content);
                } else if (data) {
                    description = data;
                } else {
                    description = "Kunde inte hitta någon Readme";
                }

                return {
                    name: repo.name,
                    html_url: repo.html_url,
                    homepage: repo.homepage,
                    owner: repo.owner,
                    description,
                };
            } catch (error) {
                console.error(error);
                return {
                    errorMesssage: "Kunde inte hitta någon Readme",
                };
            }
        });
        localStorage.setItem(
            localStorageName,
            JSON.stringify({
                createdAt: localStorageData.createdAt,
                updatedAt: currentTimestamp,
                data: await Promise.all(updatedRepo),
            }),
        );

        return await Promise.all(updatedRepo);
    } catch (error) {
        console.error(error);
    }
};
