function initHamburgerMenu() {
  const mobileHeader = document.createElement("div");
  mobileHeader.className = "mobile-header";
  mobileHeader.innerHTML = `
    <div class="mobile-nav">
      <div class="mobile-profile">
        <div class="mobile-avatar">KD</div>
        <div class="mobile-name">Kharis</div>
      </div>
      <button class="hamburger">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  `;

  const mobileMenuOverlay = document.createElement("div");
  mobileMenuOverlay.className = "mobile-menu-overlay";

  const mobileSidebar = document.createElement("div");
  mobileSidebar.className = "mobile-sidebar";
  mobileSidebar.innerHTML = `
    <div class="mobile-sidebar-content">
      <div class="profile">
        <div class="avatar">KD</div>
        <div>
          <div class="name">Kharis Destian Maulana</div>
          <div class="program">Informatics Engineering • 2023</div>
        </div>
      </div>
      <nav>
        <a href="#" class="active" data-section="dashboard">Dashboard</a>
        <a href="#" data-section="profile">Profile</a>
        <a href="#" data-section="grades">Grades</a>
        <a href="#" data-section="attendance">Attendance</a>
        <a href="#" data-section="settings">Settings</a>
      </nav>
    </div>
  `;

  document.body.insertBefore(mobileHeader, document.body.firstChild);
  document.body.appendChild(mobileMenuOverlay);
  document.body.appendChild(mobileSidebar);

  const hamburger = document.querySelector(".hamburger");

  function toggleMenu() {
    const isActive = mobileSidebar.classList.contains("active");

    hamburger.classList.toggle("active");
    mobileMenuOverlay.classList.toggle("active");
    mobileSidebar.classList.toggle("active");

    if (!isActive) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  }

  hamburger.addEventListener("click", toggleMenu);
  mobileMenuOverlay.addEventListener("click", toggleMenu);

  const mobileLinks = document.querySelectorAll(".mobile-sidebar nav a");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const section = this.dataset.section;
      switchSection(section);
      toggleMenu();
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileSidebar.classList.contains("active")) {
      toggleMenu();
    }
  });
}

function switchSection(sectionId) {
  const links = document.querySelectorAll(
    ".sidebar nav a, .mobile-sidebar nav a"
  );
  const sections = document.querySelectorAll(".section");

  links.forEach((link) => link.classList.remove("active"));

  const desktopLink = document.querySelector(
    `.sidebar nav a[data-section="${sectionId}"]`
  );
  const mobileLink = document.querySelector(
    `.mobile-sidebar nav a[data-section="${sectionId}"]`
  );

  if (desktopLink) desktopLink.classList.add("active");
  if (mobileLink) mobileLink.classList.add("active");

  sections.forEach((sec) => (sec.style.display = "none"));

  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.style.display = "flex";

    if (sectionId === "dashboard" && typeof chart !== "undefined") {
      setTimeout(() => {
        chart.resize();
      }, 100);
    }
  }
}

function initSidebar() {
  const links = document.querySelectorAll(".sidebar nav a");

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = link.dataset.section;
      switchSection(sectionId);
    });
  });
}

function initChart() {
  const ctx = document.getElementById("progressChart");

  if (!ctx) return;

  const courseData = {
    programming: [60, 72, 68, 80, 85, 88],
    math: [55, 63, 70, 74, 78, 78],
    algorithms: [70, 75, 82, 88, 92, 92],
    database: [65, 67, 73, 78, 81, 81],
  };

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Current"],
      datasets: [
        {
          label: "Score",
          data: courseData.programming,
          borderColor: "#6366F1",
          backgroundColor: "rgba(99,102,241,0.1)",
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#6366F1",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: "rgba(0,0,0,0.1)",
          },
          ticks: {
            callback: function (value) {
              return value + "%";
            },
          },
        },
        x: {
          grid: {
            color: "rgba(0,0,0,0.1)",
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          callbacks: {
            label: function (context) {
              return `Score: ${context.parsed.y}%`;
            },
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      animations: {
        tension: {
          duration: 1000,
          easing: "linear",
        },
      },
    },
  });

  const courseSelect = document.getElementById("courseSelect");
  if (courseSelect) {
    courseSelect.addEventListener("change", (e) => {
      const selected = e.target.value;
      chart.data.datasets[0].data = courseData[selected];

      const colors = {
        programming: "#6366F1",
        math: "#10B981",
        algorithms: "#F59E0B",
        database: "#EF4444",
      };

      chart.data.datasets[0].borderColor = colors[selected] || "#6366F1";
      chart.data.datasets[0].backgroundColor = colors[selected]
        ? colors[selected].replace(")", ", 0.1)").replace("rgb", "rgba")
        : "rgba(99,102,241,0.1)";
      chart.data.datasets[0].pointBackgroundColor =
        colors[selected] || "#6366F1";

      chart.update();
    });
  }

  return chart;
}

function initAttendanceFilter() {
  const attendanceCourse = document.getElementById("attendanceCourse");

  if (attendanceCourse) {
    attendanceCourse.addEventListener("change", (e) => {
      const selectedCourse = e.target.value;
      const allRows = document.querySelectorAll(".table-body .table-row");

      allRows.forEach((row) => {
        const courseCell = row.querySelector(".col-course");
        if (selectedCourse === "all") {
          row.style.display = "grid";
        } else {
          const courseName = courseCell.textContent.toLowerCase();
          if (courseName.includes(selectedCourse)) {
            row.style.display = "grid";
          } else {
            row.style.display = "none";
          }
        }
      });
    });
  }
}

function initLogout() {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to logout?")) {
        window.location.href = "index.html";
      }
    });
  }
}

function updateProgressBar(percentage) {
  const progressBar = document.querySelector(".progress-bar");
  if (progressBar) {
    progressBar.style.width = percentage + "%";
  }
}

function simulateDataLoading() {
  setTimeout(() => {
    updateProgressBar(72);
  }, 500);
}

document.addEventListener("DOMContentLoaded", function () {
  initHamburgerMenu();
  initSidebar();
  let chart = initChart();
  initAttendanceFilter();
  initLogout();

  window.addEventListener("resize", function () {
    if (chart) {
      setTimeout(() => {
        chart.resize();
      }, 100);
    }
  });

  switchSection("dashboard");
  simulateDataLoading();
});

document.addEventListener("DOMContentLoaded", function () {
  const saveSettingsBtn = document.querySelector(".save-settings");

  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener("click", function () {
      const emailNotifications =
        document.getElementById("emailNotifications").checked;
      const darkMode = document.getElementById("darkMode").checked;
      const profileVisibility =
        document.getElementById("profileVisibility").value;

      const settings = {
        emailNotifications,
        darkMode,
        profileVisibility,
      };

      localStorage.setItem("userSettings", JSON.stringify(settings));

      alert("Settings saved successfully!");

      if (darkMode) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
    });
  }

  const savedSettings = localStorage.getItem("userSettings");
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);

    if (document.getElementById("emailNotifications")) {
      document.getElementById("emailNotifications").checked =
        settings.emailNotifications;
    }
    if (document.getElementById("darkMode")) {
      document.getElementById("darkMode").checked = settings.darkMode;
    }
    if (document.getElementById("profileVisibility")) {
      document.getElementById("profileVisibility").value =
        settings.profileVisibility;
    }

    if (settings.darkMode) {
      document.body.classList.add("dark-mode");
    }
  }
});
