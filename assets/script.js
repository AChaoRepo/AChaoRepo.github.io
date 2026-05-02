(function () {
  const root = document.documentElement;
  const themeButton = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    root.dataset.theme = savedTheme;
  }

  function syncThemeIcon() {
    const isDark = root.dataset.theme === "dark";
    document.querySelectorAll("[data-theme-icon]").forEach((icon) => {
      icon.hidden = icon.dataset.themeIcon !== (isDark ? "sun" : "moon");
    });
    if (themeButton) {
      const label = isDark ? "切换到浅色模式" : "切换到深色模式";
      themeButton.setAttribute("aria-label", label);
      themeButton.setAttribute("title", label);
    }
  }

  themeButton?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
    syncThemeIcon();
  });

  syncThemeIcon();

  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear().toString();
  }

  const searchInput = document.querySelector("[data-search]");
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const filterableItems = Array.from(document.querySelectorAll("[data-title][data-tags]"));
  const emptyState = document.getElementById("noResults");
  let currentFilter = "all";

  function normalize(value) {
    return (value || "").trim().toLowerCase();
  }

  function applyFilters() {
    const query = normalize(searchInput?.value);
    let visibleCount = 0;

    filterableItems.forEach((item) => {
      const title = item.dataset.title || "";
      const tags = item.dataset.tags || "";
      const haystack = normalize(`${title} ${tags}`);
      const tagList = tags.split(/\s+/);
      const matchesFilter = currentFilter === "all" || tagList.includes(currentFilter);
      const matchesQuery = !query || haystack.includes(query);
      const visible = matchesFilter && matchesQuery;
      item.hidden = !visible;
      if (visible) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter || "all";
      filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      applyFilters();
    });
  });

  searchInput?.addEventListener("input", applyFilters);
  applyFilters();

  document.querySelector("[data-random-post]")?.addEventListener("click", () => {
    const posts = Array.from(document.querySelectorAll(".post-link[href]"));
    const target = posts[Math.floor(Math.random() * posts.length)];
    if (target) {
      window.location.href = target.getAttribute("href");
    }
  });

  const favoriteKey = "achao-favorites";
  const favorites = new Set(JSON.parse(localStorage.getItem(favoriteKey) || "[]"));

  function saveFavorites() {
    localStorage.setItem(favoriteKey, JSON.stringify(Array.from(favorites)));
  }

  document.querySelectorAll("[data-favorite]").forEach((button) => {
    const id = button.dataset.favorite || "";
    button.classList.toggle("is-active", favorites.has(id));
    button.setAttribute("aria-pressed", favorites.has(id).toString());
    button.addEventListener("click", (event) => {
      event.preventDefault();
      if (favorites.has(id)) {
        favorites.delete(id);
      } else {
        favorites.add(id);
      }
      button.classList.toggle("is-active", favorites.has(id));
      button.setAttribute("aria-pressed", favorites.has(id).toString());
      saveFavorites();
    });
  });

  const modalBackdrop = document.getElementById("detailModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");
  const modalTags = document.getElementById("modalTags");
  const modalLink = document.getElementById("modalLink");

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.hidden = true;
    }
  }

  document.querySelectorAll("[data-modal-open]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const card = button.closest("[data-title]");
      if (!modalBackdrop || !card) {
        return;
      }
      modalTitle.textContent = card.dataset.title || "项目详情";
      modalText.textContent = card.dataset.summary || "这个项目的详细说明会继续完善。";
      modalTags.innerHTML = "";
      (card.dataset.tags || "").split(/\s+/).filter(Boolean).forEach((tag) => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = tag;
        modalTags.appendChild(span);
      });
      const href = card.dataset.href || button.getAttribute("href") || "#";
      modalLink.setAttribute("href", href);
      modalBackdrop.hidden = false;
    });
  });

  modalBackdrop?.addEventListener("click", (event) => {
    if (event.target === modalBackdrop || event.target.matches("[data-modal-close]")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  const progress = document.querySelector(".reading-progress");
  if (progress) {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  document.querySelectorAll("[data-copy-link]").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        const previousText = button.dataset.defaultText || button.textContent;
        button.dataset.defaultText = previousText;
        button.textContent = "已复制";
        window.setTimeout(() => {
          button.textContent = previousText;
        }, 1400);
      } catch {
        button.setAttribute("title", "复制失败，请手动复制地址栏链接");
      }
    });
  });

  const siteHeader = document.querySelector(".site-header");
  if (siteHeader) {
    const syncHeaderState = () => {
      siteHeader.classList.toggle("scrolled", window.scrollY > 14);
    };
    syncHeaderState();
    window.addEventListener("scroll", syncHeaderState, { passive: true });
  }

  const homeSearchToggle = document.getElementById("searchToggle");
  const homeSearchBox = document.getElementById("homeSearchBox");
  const homeSearchInput = document.getElementById("homeSearchInput");
  homeSearchToggle?.addEventListener("click", () => {
    homeSearchBox?.classList.toggle("open");
    if (homeSearchBox?.classList.contains("open")) {
      homeSearchInput?.focus();
    }
  });

  const heroTopicButtons = document.querySelectorAll("[data-hero-topic]");
  const heroTopicTitle = document.getElementById("heroTopicTitle");
  const heroTopicDesc = document.getElementById("heroTopicDesc");
  const heroTopicStack = document.getElementById("heroTopicStack");

  function syncHeroTopic(button) {
    if (!button || !heroTopicTitle || !heroTopicDesc || !heroTopicStack) {
      return;
    }

    heroTopicButtons.forEach((node) => {
      const isActive = node === button;
      node.classList.toggle("is-active", isActive);
      node.setAttribute("aria-selected", String(isActive));
    });

    heroTopicTitle.textContent = button.dataset.title || "";
    heroTopicDesc.textContent = button.dataset.desc || "";
    heroTopicStack.replaceChildren();
    (button.dataset.stack || "").split("|").filter(Boolean).forEach((item) => {
      const chip = document.createElement("span");
      chip.textContent = item;
      heroTopicStack.appendChild(chip);
    });

    document.querySelectorAll(".lab-part.is-highlighted").forEach((node) => {
      node.classList.remove("is-highlighted");
    });
    const target = button.dataset.target ? document.querySelector(button.dataset.target) : null;
    target?.classList.add("is-highlighted");
  }

  heroTopicButtons.forEach((button) => {
    button.addEventListener("click", () => syncHeroTopic(button));
  });
  syncHeroTopic(document.querySelector("[data-hero-topic].is-active") || heroTopicButtons[0]);

  const homeModal = document.getElementById("homeModal");
  const homeModalTitle = document.getElementById("homeModalTitle");
  const homeModalDesc = document.getElementById("homeModalDesc");

  function closeHomeModal() {
    if (homeModal) {
      homeModal.hidden = true;
    }
  }

  document.querySelectorAll("[data-home-modal]").forEach((item) => {
    if (!item.hasAttribute("tabindex") && item.tagName !== "BUTTON") {
      item.setAttribute("tabindex", "0");
      item.setAttribute("role", "button");
    }

    const openHomeModal = () => {
      if (!homeModal || !homeModalTitle || !homeModalDesc) {
        return;
      }
      document.querySelectorAll("[data-home-modal]").forEach((node) => node.classList.remove("is-active"));
      item.classList.add("is-active");
      homeModalTitle.textContent = item.dataset.title || "详情";
      homeModalDesc.textContent = item.dataset.desc || "这部分内容会继续完善。";
      homeModal.hidden = false;
    };

    item.addEventListener("click", (event) => {
      event.preventDefault();
      openHomeModal();
    });

    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openHomeModal();
      }
    });
  });

  homeModal?.addEventListener("click", (event) => {
    if (event.target === homeModal || event.target.matches("[data-home-modal-close]")) {
      closeHomeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeHomeModal();
    }
  });
})();
