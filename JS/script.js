const educationContainer = document.querySelector('#education ul');

const octokit = new octokit({ auth: `personal-access-token123` });

(async () => {
    try {
        const response = await fetch('/Education.json');
        const data = await response.json();
        educationContainer.innerHTML = '';
        data.forEach((education) => {
            const li = document.createElement('li');
            li.classList.add('card');

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
    } catch (error) {
        
    }
})();
