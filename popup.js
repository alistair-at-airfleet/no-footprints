document.addEventListener('DOMContentLoaded', function () {
    var toggleExtensionCheckbox = document.getElementById('toggleExtension');

    // Initialize checkbox based on stored extension state
    chrome.storage.local.get('extensionEnabled', function(data) {
        toggleExtensionCheckbox.checked = data.extensionEnabled;
    });

    toggleExtensionCheckbox.addEventListener('change', function () {
        // Update the extension's enabled state based on checkbox
        var newState = toggleExtensionCheckbox.checked;
        chrome.storage.local.set({'extensionEnabled': newState}, function() {
            // Send a message to background or content script to enable/disable functionality
            chrome.runtime.sendMessage({extensionEnabled: newState});
        });
    });
});