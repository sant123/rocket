const defaults = {
  text: "To Top",
  min: 200,
  inDelay: 600,
  outDelay: 400,
  containerClass: "toTop",
  containerHoverClass: "toTopHover",
  imageSrc: "./images/go_to_top.png",
  onShow: () => {},
  onHide: () => {},
};

function injectCSS({ containerClass, containerHoverClass, imageSrc }) {
  const css =
    `.${containerClass},.${containerHoverClass}{height:64px;width:64px}.${containerClass}{background:url(${imageSrc}) left top no-repeat;bottom:10px;cursor:pointer;overflow:hidden;position:fixed;right:10px;display:none}.${containerHoverClass}{background:url(${imageSrc}) left -64px no-repeat;display:block;opacity:0;transition:opacity .6s linear}@media (hover:hover) and (pointer:fine){.${containerHoverClass}:hover{opacity:1}}`;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.append(style);

  return style;
}

function createContainer({ containerClass, text }) {
  const container = document.createElement("a");
  container.className = containerClass;
  container.text = text;
  return container;
}

function createContainerHover({ containerHoverClass }) {
  const containerHover = document.createElement("span");
  containerHover.className = containerHoverClass;
  return containerHover;
}

let initialized = false;

export function UItoTop(options = {}) {
  if (initialized) {
    return;
  }

  const settings = { ...defaults, ...options };

  const style = injectCSS(settings);
  const container = createContainer(settings);
  const containerHover = createContainerHover(settings);

  container.prepend(containerHover);
  document.body.append(container);

  const containerTransitionEnd = () => {
    container.style.display = "none";
    containerHover.style.opacity = "";
  };

  let rocketVisible = false;

  const scrollEvent = () => {
    const sy = window.scrollY;

    if (sy > settings.min && !rocketVisible) {
      rocketVisible = true;
      settings.onShow();
      container.style.transition = `opacity ${settings.inDelay}ms`;
      container.style.display = "block";
      setTimeout(() => container.style.opacity = "1", 0);
      container.removeEventListener("transitionend", containerTransitionEnd);
    }

    if (sy <= settings.min && rocketVisible) {
      rocketVisible = false;
      settings.onHide();
      container.style.transition = `opacity ${settings.outDelay}ms`;
      container.style.opacity = "0";
      container.addEventListener("transitionend", containerTransitionEnd);
    }
  };

  container.addEventListener("click", () => {
    scrollTo({ top: 0, behavior: "smooth" });
    containerHover.style.opacity = "1";
  });

  if (window.scrollY > settings.min) {
    container.style.display = "block";
  } else {
    container.style.opacity = "0";
  }

  addEventListener("scroll", scrollEvent);
  initialized = true;

  return {
    dispose() {
      style.remove();
      container.remove();
      removeEventListener("scroll", scrollEvent);
      initialized = false;
    },
  };
}
