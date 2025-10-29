// ---- Hamburger Menu Functionality ----
function initHamburgerMenu() {
  // Create mobile header elements
  const mobileHeader = document.createElement("div");
  mobileHeader.className = "mobile-header";
  mobileHeader.innerHTML = `
    <div class="mobile-nav">
      <div class="mobile-profile">
        <div class="mobile-avatar">KH</div>
        <div class="mobile-name">Kharis</div>
      </div>
      <button class="hamburger">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  `;

  // Create mobile menu overlay
  const mobileMenuOverlay = document.createElement("div");
  mobileMenuOverlay.className = "mobile-menu-overlay";

  // Create mobile sidebar
  const mobileSidebar = document.createElement("div");
  mobileSidebar.className = "mobile-sidebar";
  mobileSidebar.innerHTML = `
    <div class="mobile-sidebar-content">
      <div class="profile">
        <div class="avatar">KH</div>
        <div>
          <div class="name">Kharis</div>
          <div class="program">Computer Science • 2023</div>
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

  // Insert elements into DOM
  document.body.insertBefore(mobileHeader, document.body.firstChild);
  document.body.appendChild(mobileMenuOverlay);
  document.body.appendChild(mobileSidebar);

  // Hamburger menu functionality
  const hamburger = document.querySelector(".hamburger");

  function toggleMenu() {
    hamburger.classList.toggle("active");
    mobileMenuOverlay.classList.toggle("active");
    mobileSidebar.classList.toggle("active");
    document.body.style.overflow = mobileSidebar.classList.contains("active")
      ? "hidden"
      : "";
  }

  hamburger.addEventListener("click", toggleMenu);
  mobileMenuOverlay.addEventListener("click", toggleMenu);

  // Close menu when clicking on links
  const mobileLinks = document.querySelectorAll(".mobile-sidebar nav a");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const section = this.dataset.section;
      switchSection(section);
      toggleMenu();
    });
  });

  // Close menu on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileSidebar.classList.contains("active")) {
      toggleMenu();
    }
  });
}

// ---- Section Management ----
function switchSection(sectionId) {
  const links = document.querySelectorAll(
    ".sidebar nav a, .mobile-sidebar nav a"
  );
  const sections = document.querySelectorAll(".section");

  // Remove active class from all links
  links.forEach((link) => link.classList.remove("active"));

  // Add active class to clicked link in both sidebars
  const desktopLink = document.querySelector(
    `.sidebar nav a[data-section="${sectionId}"]`
  );
  const mobileLink = document.querySelector(
    `.mobile-sidebar nav a[data-section="${sectionId}"]`
  );

  if (desktopLink) desktopLink.classList.add("active");
  if (mobileLink) mobileLink.classList.add("active");

  // Hide all sections
  sections.forEach((sec) => (sec.style.display = "none"));

  // Show selected section
  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.style.display = "flex";

    // Reinitialize chart if switching to dashboard
    if (sectionId === "dashboard" && typeof chart !== "undefined") {
      setTimeout(() => {
        chart.resize();
      }, 100);
    }
  }
}

// ---- Sidebar Interactive ----
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

// ---- Chart JS ----
function initChart() {
  const ctx = document.getElementById("progressChart");

  // Check if chart canvas exists
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

  // Course select change handler
  const courseSelect = document.getElementById("courseSelect");
  if (courseSelect) {
    courseSelect.addEventListener("change", (e) => {
      const selected = e.target.value;
      chart.data.datasets[0].data = courseData[selected];

      // Update line color based on course
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

// ---- Initialize Everything ----
document.addEventListener("DOMContentLoaded", function () {
  // Initialize hamburger menu for mobile
  initHamburgerMenu();

  // Initialize sidebar navigation
  initSidebar();

  // Initialize chart
  let chart = initChart();

  // Handle window resize for chart
  window.addEventListener("resize", function () {
    if (chart) {
      setTimeout(() => {
        chart.resize();
      }, 100);
    }
  });

  // Set initial active section
  switchSection("dashboard");
});

document.getElementById("logoutBtn").addEventListener("click", function () {
  window.location.href = "index.html";
});

// ---- Additional Utility Functions ----

// Update progress bar animation
function updateProgressBar(percentage) {
  const progressBar = document.querySelector(".progress-bar");
  if (progressBar) {
    progressBar.style.width = percentage + "%";
  }
}

// Simulate loading data
function simulateDataLoading() {
  // Simulate progress bar animation
  setTimeout(() => {
    updateProgressBar(72);
  }, 500);
}

// Call data simulation on dashboard load
document.addEventListener("DOMContentLoaded", simulateDataLoading);
