// Function to inject a script that adds a global variable
function injectGlobalVariable() {
    const scriptContent = `
      // Check if the variable doesn't already exist to avoid overwriting it
      if (typeof window.footprint === 'undefined') {
        window.footprint = true; // Set the global variable
      }
    `;
  
    const scriptElement = document.createElement('script');
    scriptElement.textContent = scriptContent;
    (document.head || document.documentElement).appendChild(scriptElement);
    scriptElement.remove(); // Clean up after injecting
  }
  
  // Inject the global variable as early as possible
  injectGlobalVariable();
  
  // Function to push an event into the data layer
  function pushEventToDataLayer() {
    if (window.dataLayer) {
      // Push an event to the data layer
      window.dataLayer.push({
        'event': 'footprint'
      });
    } else {
      console.log("Data layer not found.");
    }
  }
  
  // Attempt to push the event to the data layer
  pushEventToDataLayer();  