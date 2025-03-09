const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector("nav");
const navlist = document.querySelector("nav ul");

menuBtn.addEventListener("click", () => {
    navlist.classList.toggle("active");
    nav.setAttribute("aria-expanded", nav.getAttribute("aria-expanded") === "true" ? "false" : "true");
});
