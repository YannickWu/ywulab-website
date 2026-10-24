/* Progressive enhancements; navigation and figures still work without JavaScript. */
(() => {
  "use strict";
  document.documentElement.classList.add("js");
  const menu = document.querySelector(".menu-button");
  const navigation = document.querySelector("#primary-nav");
  if (menu && navigation) {
    menu.hidden = false;
    const setMenu = (open) => {
      navigation.classList.toggle("is-open", open);
      menu.setAttribute("aria-expanded", String(open));
      menu.querySelector(".menu-label").textContent = open ? "Close" : "Menu";
    };
    menu.addEventListener("click", () => setMenu(menu.getAttribute("aria-expanded") !== "true"));
    navigation.addEventListener("click", (event) => { if (event.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") { setMenu(false); menu.focus(); }
    });
    document.addEventListener("click", (event) => { if (!event.target.closest(".site-header")) setMenu(false); });
    window.matchMedia("(min-width: 901px)").addEventListener("change", () => setMenu(false));
  }
  const figureToggle = document.querySelector(".figure-toggle");
  if (figureToggle) {
    figureToggle.hidden = false;
    figureToggle.addEventListener("click", () => {
      const hidden = document.body.classList.toggle("figures-hidden");
      figureToggle.setAttribute("aria-pressed", String(hidden));
      figureToggle.textContent = hidden ? "Show figures" : "Hide figures";
    });
  }
  const localLinks = document.querySelectorAll(".section-nav a");
  const updateLocation = () => localLinks.forEach((link) => {
    if (link.hash === window.location.hash) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  window.addEventListener("hashchange", updateLocation);
  updateLocation();
  if (!window.HTMLDialogElement || !document.querySelector("[data-figure]")) return;
  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", "Research image viewer");
  dialog.innerHTML = '<div class="lightbox-panel"><div class="lightbox-header"><p>Image viewer</p><button class="lightbox-close" type="button" autofocus>Close ×</button></div><img class="lightbox-image" alt=""><p class="lightbox-caption"></p><a class="lightbox-original" target="_blank" rel="noopener noreferrer">Open original image ↗</a></div>';
  document.body.append(dialog);
  const image = dialog.querySelector(".lightbox-image");
  const caption = dialog.querySelector(".lightbox-caption");
  const original = dialog.querySelector(".lightbox-original");
  let trigger;
  document.querySelectorAll("[data-figure]").forEach((link) => {
    link.setAttribute("aria-haspopup", "dialog");
    link.addEventListener("click", (event) => {
      event.preventDefault(); trigger = link;
      image.src = link.href; image.alt = link.querySelector("img").alt;
      caption.textContent = image.alt; original.href = link.href;
      dialog.showModal();
    });
  });
  dialog.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => { image.removeAttribute("src"); if (trigger) trigger.focus({ preventScroll: true }); });
})();
