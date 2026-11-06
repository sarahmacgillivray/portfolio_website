const projectButtons = [...document.querySelectorAll("[data-open-project]")];
const projectDetails = [...document.querySelectorAll("[data-project]")];
const fieldMapLayout = document.querySelector(".field-map-layout");
const fieldNotePanel = document.querySelector("#field-note-panel");
const emptyFieldNote = document.querySelector(".field-note-empty");

const fieldSummaries = {
    biomusic: ["IN PROGRESS", "Firmware & biosensing", "nRF5340 · FreeRTOS · BLE"],
    autocar: ["FASTEST / 15 TEAMS", "Autonomous robotics", "ROS 2 · LiDAR · vision"],
    os161: ["KERNEL SYSTEMS", "Concurrency & memory", "C · GDB · OS/161"],
    arc4: ["DIGITAL DESIGN", "Parallel key search", "SystemVerilog · FPGA"],
    firefighter: ["EMBEDDED ROBOTICS", "Navigation & sensing", "Ultrasonic · IR · LCD"],
    sumo: ["AUTONOMOUS ROBOTICS", "Sensing & control", "IR · phototransistors · motors"],
    shell: ["UNIX SYSTEMS", "Processes & job control", "C · POSIX · signals"]
};

if (fieldNotePanel) {
    const projectDetailsContainer = document.querySelector(".project-details");
    if (projectDetailsContainer) fieldNotePanel.append(projectDetailsContainer);
}

projectDetails.forEach((detail) => {
    const summary = fieldSummaries[detail.dataset.project];
    const heading = detail.querySelector(".detail-heading");
    if (!summary || !heading) return;

    const summaryElement = document.createElement("div");
    summaryElement.className = "field-summary";
    summaryElement.innerHTML = summary.map((value, index) => {
        const labels = ["TRAIL NOTE", "TERRAIN", "FIELD KIT"];
        return `<div><span>${labels[index]}</span><strong>${value}</strong></div>`;
    }).join("");
    heading.after(summaryElement);
});

function closeProjectDetails() {
    projectDetails.forEach((detail) => {
        detail.hidden = true;
        detail.querySelectorAll("video").forEach((video) => video.pause());
    });
    projectButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));
    document.querySelectorAll(".destination-index button").forEach((button) => button.classList.remove("is-active"));
    fieldMapLayout?.classList.remove("has-selection");
    if (emptyFieldNote) emptyFieldNote.hidden = false;
}

function openProjectDetails(projectId, playDemo = false) {
    const detail = document.querySelector(`[data-project="${projectId}"]`);
    if (!detail) return;

    closeProjectDetails();
    detail.hidden = false;
    emptyFieldNote?.setAttribute("hidden", "");
    fieldMapLayout?.classList.add("has-selection");
    projectButtons
        .filter((button) => button.dataset.openProject === projectId)
        .forEach((button) => button.setAttribute("aria-expanded", "true"));
    document.querySelectorAll(`.destination-index [data-open-project="${projectId}"]`)
        .forEach((button) => button.classList.add("is-active"));

    if (window.matchMedia("(max-width: 760px)").matches) {
        requestAnimationFrame(() => fieldNotePanel?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }

    if (playDemo) {
        const video = detail.querySelector("video");
        if (video) video.play().catch(() => video.focus());
    }
}

projectButtons.forEach((button) => {
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", () => {
        openProjectDetails(button.dataset.openProject, button.hasAttribute("data-play-demo"));
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

const trailRoute = document.querySelector("#route-trail");
const trailMap = document.querySelector("#trail-map");

if (trailRoute && trailMap) {
    const revealTrail = () => {
        const mapBounds = trailMap.getBoundingClientRect();
        if (mapBounds.top < window.innerHeight * 0.85 && mapBounds.bottom > 0) {
            trailRoute.classList.add("is-visible");
            window.removeEventListener("scroll", revealTrail);
            window.removeEventListener("resize", revealTrail);
        }
    };
    window.addEventListener("scroll", revealTrail, { passive: true });
    window.addEventListener("resize", revealTrail);
    window.addEventListener("hashchange", revealTrail);
    window.addEventListener("load", revealTrail, { once: true });
    revealTrail();
}