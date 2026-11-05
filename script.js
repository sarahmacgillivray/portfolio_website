const projectButtons = document.querySelectorAll("[data-open-project]");
const projectDetails = document.querySelectorAll("[data-project]");

function closeProjectDetails() {
    projectDetails.forEach((detail) => {
        detail.hidden = true;
        detail.querySelectorAll("video").forEach((video) => video.pause());
    });
    projectButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));
}

function openProjectDetails(projectId, playDemo = false) {
    const detail = document.querySelector(`[data-project="${projectId}"]`);
    if (!detail) return;

    closeProjectDetails();
    detail.hidden = false;
    [...projectButtons]
        .filter((button) => button.dataset.openProject === projectId)
        .forEach((button) => button.setAttribute("aria-expanded", "true"));

    requestAnimationFrame(() => {
        detail.scrollIntoView({ behavior: "smooth", block: "start" });
        if (playDemo) {
            const video = detail.querySelector("video");
            if (video) video.play().catch(() => video.focus());
        }
    });
}

projectButtons.forEach((button) => {
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", () => {
        openProjectDetails(button.dataset.openProject, button.hasAttribute("data-play-demo"));
    });
});

document.querySelectorAll(".project-image").forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const projectId = link.getAttribute("href").replace("#project-", "");
        openProjectDetails(projectId);
    });
});

document.querySelectorAll(".close-detail").forEach((button) => {
    button.addEventListener("click", closeProjectDetails);
});

const carDemoVideo = document.querySelector("#car-demo-video");
const carDemoTitle = document.querySelector("#car-demo-title");

document.querySelectorAll("[data-car-demo]").forEach((button) => {
    button.addEventListener("click", () => {
        if (!carDemoVideo) return;

        document.querySelectorAll("[data-car-demo]").forEach((demoButton) => {
            const isSelected = demoButton === button;
            demoButton.classList.toggle("is-active", isSelected);
            demoButton.setAttribute("aria-pressed", String(isSelected));
        });

        carDemoTitle.textContent = button.dataset.demoTitle;
        carDemoVideo.src = button.dataset.demoSrc;
        carDemoVideo.load();
        carDemoVideo.play().catch(() => carDemoVideo.focus());
    });
});