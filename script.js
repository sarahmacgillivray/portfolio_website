const projectButtons = [...document.querySelectorAll("[data-open-project]")];
const projectDetails = [...document.querySelectorAll("[data-project]")];
const fieldMapLayout = document.querySelector(".field-map-layout");
const fieldNotePanel = document.querySelector("#field-note-panel");
const emptyFieldNote = document.querySelector(".field-note-empty");
const scrapbookViewer = document.querySelector(".scrapbook-viewer");
const scrapbookViewerImage = document.querySelector(".scrapbook-viewer-image");
const scrapbookViewerTitle = document.querySelector("#scrapbook-viewer-title");
const scrapbookViewerStory = document.querySelector(".scrapbook-viewer-story");
let lastScrapbookTrigger = null;

document.querySelectorAll("[data-scrapbook-photo]").forEach((button) => {
    button.addEventListener("click", () => {
        const image = button.querySelector("img");
        if (!scrapbookViewer || !image) return;

        lastScrapbookTrigger = button;
        scrapbookViewerImage.loading = "eager";
        scrapbookViewerImage.style.aspectRatio = "4 / 3";
        const applyPhotoAspectRatio = () => {
            if (scrapbookViewerImage.naturalWidth && scrapbookViewerImage.naturalHeight) {
                scrapbookViewerImage.style.aspectRatio = `${scrapbookViewerImage.naturalWidth} / ${scrapbookViewerImage.naturalHeight}`;
            }
        };
        scrapbookViewerImage.onload = applyPhotoAspectRatio;
        scrapbookViewerImage.src = image.currentSrc || image.src;
        if (scrapbookViewerImage.complete) applyPhotoAspectRatio();
        scrapbookViewerImage.alt = image.alt;
        scrapbookViewerTitle.textContent = button.dataset.photoTitle;
        scrapbookViewerStory.textContent = button.dataset.photoStory;
        scrapbookViewer.showModal();
    });
});

document.querySelector(".scrapbook-viewer-close")?.addEventListener("click", () => {
    scrapbookViewer?.close();
});

scrapbookViewer?.addEventListener("click", (event) => {
    if (event.target === scrapbookViewer) scrapbookViewer.close();
});

scrapbookViewer?.addEventListener("close", () => {
    lastScrapbookTrigger?.focus({ preventScroll: true });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && scrapbookViewer?.open) {
        event.preventDefault();
        scrapbookViewer.close();
    }
});

const fieldSummaries = {
    biomusic: ["IN PROGRESS", "Firmware & biosensing", "nRF5340 · FreeRTOS · BLE"],
    autocar: ["FASTEST / 15 TEAMS", "Autonomous robotics", "ROS 2 · LiDAR · vision"],
    os161: ["KERNEL SYSTEMS", "Concurrency & memory", "C · GDB · OS/161"],
    arc4: ["DIGITAL DESIGN", "Parallel key search", "SystemVerilog · FPGA"],
    firefighter: ["EMBEDDED ROBOTICS", "Navigation & sensing", "Ultrasonic · IR · LCD"],
    sumo: ["AUTONOMOUS ROBOTICS", "Sensing & control", "IR · phototransistors · motors"],
    shell: ["UNIX SYSTEMS", "Processes & job control", "C · POSIX · signals"]
};

const projectIllustrations = {
    biomusic: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="11" stroke-dasharray="1.5 3"/><path d="M4 17h5l2.4-7 4.5 14 4.5-11 2.2 4H28"/><circle class="solid" cx="4" cy="17" r="1.2"/><circle class="solid" cx="28" cy="17" r="1.2"/></svg>',
    autocar: '<svg viewBox="0 0 32 32"><path d="M10 7.5h12l3 5v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-10l3-5Z"/><path d="m9 13 2-3h10l2 3v5H9zM10 21h.1M22 21h.1M3 12v8M29 12v8"/><path class="solid" d="M11 20a1.4 1.4 0 1 0 0 .1zm10 0a1.4 1.4 0 1 0 0 .1z"/></svg>',
    os161: '<svg viewBox="0 0 32 32"><path d="M7 7h15v6H7zM10 14h15v6H10zM7 21h15v5H7z"/><path d="M10 10h8M13 17h8M10 23.5h8M24 8h2m-2 9h2m-2 7h2"/></svg>',
    arc4: '<svg viewBox="0 0 32 32"><rect x="9" y="9" width="14" height="14"/><path d="M12 5v4m4-4v4m4-4v4m-8 14v4m4-4v4m4-4v4M5 12h4m-4 4h4m-4 4h4m14-8h4m-4 4h4m-4 4h4M13 13h6v6h-6z"/><path class="solid" d="M15 15h2v2h-2z"/></svg>',
    firefighter: '<svg viewBox="0 0 32 32"><path d="M17 4c2 5-2 6 1 9 1-2 3-3 3-6 4 4 6 8 4 13a9 9 0 0 1-18 0c0-4 2-7 6-10 0 4 1 5 2 6 3-3 2-7 2-12Z"/><path d="M14 21h4m-2-2v4"/></svg>',
    sumo: '<svg viewBox="0 0 32 32"><circle cx="16" cy="17" r="11" stroke-dasharray="2 2"/><path d="M9 10h5v5H9zM18 18h5v5h-5zM14 12l4 4M14 14v-2h-2m4 6 2 2v-2"/><path class="solid" d="M11 12h1v1h-1zm9 8h1v1h-1z"/></svg>',
    shell: '<svg viewBox="0 0 32 32"><path d="m9 9 7 7-7 7m10 0h6M5 5h22v22H5z"/><path class="solid" d="M20 20h2v2h-2z"/></svg>'
};

document.querySelectorAll("[data-project-art]").forEach((element) => {
    element.innerHTML = projectIllustrations[element.dataset.projectArt] ?? "";
});

const fieldPhotographs = {
    os161: ["images/os161.jpg", "OS/161 running in the kernel test environment", "KERNEL TEST / OS161"],
    firefighter: ["images/fire_maze.jpg", "The autonomous firefighter robot navigating its maze", "MAZE TEST / FIREBOT"]
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
        const labels = ["PROJECT", "FOCUS", "TOOLS"];
        return `<div><span>${labels[index]}</span><strong>${value}</strong></div>`;
    }).join("");
    heading.after(summaryElement);

    const photograph = fieldPhotographs[detail.dataset.project];
    if (photograph) {
        const figure = document.createElement("figure");
        figure.className = `field-photograph field-photograph-${detail.dataset.project}`;
        figure.innerHTML = `<img src="${photograph[0]}" alt="${photograph[1]}" loading="lazy"><figcaption>${photograph[2]}</figcaption>`;
        summaryElement.after(figure);
    }
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