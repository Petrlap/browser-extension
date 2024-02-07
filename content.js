window.addEventListener("load", function () {
  const performanceInfo = createPerformanceInfo();

  document.body.insertBefore(performanceInfo, document.body.firstChild);
});

function createPerformanceInfo() {
  const pageLoadTime = calculatePageLoadTime();
  const resources = performance.getEntriesByType("resource");
  const groupedResources = groupResourcesByType(resources);

  const performanceInfo = document.createElement("div");
  performanceInfo.style.cssText = `
    width: 450px; 
    height: 250px;
    padding: 20px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow: visible;
    word-break: break-all;
    color: black;
    overflow-y: scroll;
    scroll-behavior: smooth;
  `;
  performanceInfo.innerHTML = `
    <h2>Performance Information</h2>
    <p>Page load time: ${pageLoadTime} seconds</p>
    <h3>Resource Load Times:</h3>
    ${renderGroupedResources(groupedResources)}
  `;

  return performanceInfo;
}

function calculatePageLoadTime() {
  const loadEventEnd = performance.timing.domContentLoadedEventEnd;
  const navigationStart = performance.timing.navigationStart;
  return ((loadEventEnd - navigationStart) / 1000).toFixed(5);
}

function groupResourcesByType(resources) {
  const groupedResources = {};
  resources.forEach((resource) => {
    const type = resource.initiatorType;
    if (!groupedResources[type]) {
      groupedResources[type] = [];
    }
    groupedResources[type].push({
      name: resource.name,
      duration: (resource.duration / 1000).toFixed(5),
    });
  });
  return groupedResources;
}

function renderGroupedResources(groupedResources) {
  return Object.keys(groupedResources)
    .map(
      (type) => `
    <details>
      <summary>${type}</summary>
      <ul>
        ${groupedResources[type]
          .map(
            (resource) => `
          <li>${resource.name}: <br><span style="color: red;">${resource.duration}</span> seconds</li>
        `
          )
          .join("")}
      </ul>
    </details>
  `
    )
    .join("");
}
