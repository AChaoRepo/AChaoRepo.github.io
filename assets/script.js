(function () {
  const root = document.documentElement;
  const themeButton = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme) {
    root.dataset.theme = savedTheme;
  } else if (prefersDark) {
    root.dataset.theme = "dark";
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

  const searchInput = document.getElementById("postSearch");
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const filterableItems = Array.from(document.querySelectorAll("[data-title][data-tags]"));
  const emptyState = document.getElementById("noResults");
  let currentFilter = "all";

  function applyFilters() {
    const query = (searchInput?.value || "").trim().toLowerCase();
    let visibleCount = 0;

    filterableItems.forEach((item) => {
      const title = item.dataset.title || "";
      const tags = item.dataset.tags || "";
      const haystack = `${title} ${tags}`.toLowerCase();
      const tagList = tags.split(/\s+/);
      const matchesFilter = currentFilter === "all" || tagList.includes(currentFilter);
      const matchesQuery = !query || haystack.includes(query);
      const isVisible = matchesFilter && matchesQuery;
      item.hidden = !isVisible;
      if (isVisible) {
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
        const previousText = button.lastChild?.textContent || "";
        button.lastChild.textContent = "已复制";
        window.setTimeout(() => {
          button.lastChild.textContent = previousText;
        }, 1400);
      } catch {
        button.setAttribute("title", "复制失败，请手动复制地址栏链接");
      }
    });
  });
})();
