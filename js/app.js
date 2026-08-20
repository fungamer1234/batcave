(function () {
  const games = window.BATCAVE_GAMES || [];
  const grid = document.getElementById("grid");
  const empty = document.getElementById("empty");
  const count = document.getElementById("count");
  const totalPill = document.getElementById("totalPill");
  const catsEl = document.getElementById("cats");
  const azEl = document.getElementById("az");
  const q = document.getElementById("q");
  const schoolMode = document.getElementById("schoolMode");

  if (totalPill) totalPill.textContent = games.length + " GAMES";

  const saved = localStorage.getItem("batcave-school");
  if (schoolMode) {
    schoolMode.checked = saved === null ? true : saved === "1";
    schoolMode.addEventListener("change", () => {
      localStorage.setItem("batcave-school", schoolMode.checked ? "1" : "0");
      render();
    });
  }

  const categories = [
    ["all", "All"],
    ["ugs", "UGS Files"],
    ["school", "School"],
    ["featured", "Featured"],
    ["action", "Action"],
    ["racing", "Racing"],
    ["sports", "Sports"],
    ["shooting", "Shooting"],
    ["platform", "Platform"],
    ["puzzle", "Puzzle"],
    ["stickman", "Stickman"],
    ["io", ".IO"],
    ["minecraft", "Minecraft"],
    ["horror", "Horror"],
    ["idle", "Idle"],
    ["arcade", "Arcade"]
  ];

  let cat = "all";
  let letter = "all";

  function initials(title) {
    return title.replace(/[^A-Za-z0-9. ]/g, "").split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  }

  function renderFilters() {
    catsEl.innerHTML = categories.map(([id, label]) =>
      `<button data-cat="${id}" class="${id === cat ? "active" : ""}">${label}</button>`
    ).join("");

    const letters = ["all", ... "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), "0-9"];
    azEl.innerHTML = letters.map(l =>
      `<button data-letter="${l}" class="${l === letter ? "active" : ""}">${l === "all" ? "A–Z" : l}</button>`
    ).join("");
  }

  function filtered() {
    const term = (q.value || "").trim().toLowerCase();
    return games.filter((g) => {
      if (cat !== "all" && !(g.cats || []).includes(cat)) return false;
      const first = g.title.replace(/^[^A-Za-z0-9]+/, "")[0] || "";
      if (letter === "0-9" && !/[0-9]/.test(first)) return false;
      if (letter !== "all" && letter !== "0-9" && first.toUpperCase() !== letter) return false;
      if (!term) return true;
      return g.title.toLowerCase().includes(term) || g.id.includes(term.replace(/\s+/g, "-"));
    });
  }

  function render() {
    const list = filtered();
    count.textContent = list.length + " / " + games.length;
    empty.hidden = list.length > 0;
    const schoolOn = schoolMode ? schoolMode.checked : true;
    grid.innerHTML = list.map((g) => {
      const featured = (g.cats || []).includes("featured");
      const hasFile = !!g.file;
      let href = "play.html?g=" + encodeURIComponent(g.id);
      let extra = "";
      if (schoolOn && !hasFile && g.school) {
        href = g.schoolUrl;
        extra = ' target="_blank" rel="noopener"';
      }
      const tag = hasFile
        ? `<span class="tag">UGS</span>`
        : g.school
          ? `<span class="tag">SCHOOL</span>`
          : featured ? `<span class="tag">SIGNAL</span>` : "";
      const thumb = g.thumb
        ? `<img src="${g.thumb}" alt="" loading="lazy" onerror="this.style.display='none'">`
        : "";
      return `
        <a class="card" href="${href}"${extra}>
          <div class="thumb">
            <span class="fallback">${initials(g.title)}</span>
            ${thumb}
            ${tag}
          </div>
          <h3>${g.title}</h3>
        </a>`;
    }).join("");
  }

  catsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-cat]");
    if (!btn) return;
    cat = btn.dataset.cat;
    renderFilters();
    render();
  });

  azEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-letter]");
    if (!btn) return;
    letter = btn.dataset.letter;
    renderFilters();
    render();
  });

  q.addEventListener("input", render);

  renderFilters();
  render();
})();
