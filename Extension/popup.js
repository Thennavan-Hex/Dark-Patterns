document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabId = tabs[0].id;
    chrome.runtime.sendMessage({ action: 'getTotalScore', tabId: tabId });
  });

  // Add event listener for the report button
  const reportButton = document.getElementById('reportButton');
  reportButton.addEventListener('click', showCommandBox);

  // Add event listener for the submit command button
  const submitCommandButton = document.getElementById('submitCommand');
  submitCommandButton.addEventListener('click', submitCommand);

  // Start the blinking interval when the popup is loaded
  startBlinking();
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'updatePopup') {
    const totalScore = request.totalScore;
    displayTotalScore(totalScore);
    updateProgressCircle(totalScore);
    updateOnlineIndicator(totalScore);
  } else if (request.action === 'updatePopupDefault') {
    displayTotalScore(0, true);
    updateProgressCircle(0);
    updateOnlineIndicator(0);
  }
});

function displayTotalScore(totalScore, notAvailable) {
  const scoreElement = document.getElementById('totalScore');
  let colorClass = '';

  if (notAvailable) {
    colorClass = 'red';
    scoreElement.textContent = 'Not Available';
  } else {
    if (totalScore >= 70) {
      colorClass = 'green';
    } else if (totalScore >= 40) {
      colorClass = 'orange';
    } else {
      colorClass = 'red';
    }

    scoreElement.textContent = `${totalScore}%`;
  }

  scoreElement.className = `score ${colorClass}`;
}

function updateProgressCircle(totalScore) {
  const progressCircle = document.getElementById('progressCircle');
  if (progressCircle) {
    const rotation = (totalScore / 100) * 360;
    progressCircle.style.transform = `rotate(${rotation}deg)`;
  }
}

function updateOnlineIndicator(totalScore) {
  const onlineIndicator = document.getElementById('onlineIndicator');

  // Create the online indicator dot if not present
  if (!onlineIndicator) {
    const dot = document.createElement('div');
    dot.id = 'onlineIndicator';
    dot.className = 'dot';
    document.getElementById('totalScoreContainer').appendChild(dot);
  }

  // Update the dot color based on the total score
  const dot = document.getElementById('onlineIndicator');
  dot.style.display = 'block'; // Ensure the dot is visible

  if (totalScore < 50) {
    dot.style.backgroundColor = 'green';
  } else {
    dot.style.backgroundColor = 'red';
  }
}

function showCommandBox() {
  const commandBox = document.getElementById('commandBox');
  commandBox.classList.toggle('hidden');

  const totalScoreContainer = document.getElementById('totalScoreContainer');
  totalScoreContainer.classList.toggle('report-mode');
}

function submitCommand() {
  const commandInput = document.getElementById('commandInput');
  const userCommand = commandInput.value.trim();

  // Get the active tab information
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    if (activeTab) {
      // Get user IP address and report details
      getIpAddress(function (userIp) {
        const reportDetails = {
          userIp: userIp,
          report: userCommand,
        };

        // Send the report to the server
        sendReportToServer(activeTab.url, reportDetails);
      });
    }
  });

  // Hide the command box after submitting
  const commandBox = document.getElementById('commandBox');
  commandBox.classList.add('hidden');

  const totalScoreContainer = document.getElementById('totalScoreContainer');
  totalScoreContainer.classList.remove('report-mode');
}

function sendReportToServer(url, reportDetails) {
  // Send a POST request to the server with the user's report
  fetch('http://localhost:3000/api/report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: url, // Pass the URL here
      userIp: reportDetails.userIp,
      report: reportDetails.report,
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Report sent successfully:', data);
    })
    .catch(error => {
      console.error('Error sending report:', error);
    });
}

function getIpAddress(callback) {
  // Use a third-party service to get the user's public IP address
  fetch('https://api64.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      const userIp = data.ip || 'Unknown';
      callback(userIp);
    })
    .catch(error => {
      console.error('Error fetching user IP address:', error);
      callback('Unknown');
    });
}

function startBlinking() {
  let iconVisible = true;
  let blinkingCount = 0;

  // Set an interval to toggle the visibility of the icon every 500 milliseconds
  const blinkingInterval = setInterval(function () {
    const icon = chrome.runtime.getURL('icons/icon16.png'); // Replace with the correct path to your icon
    chrome.browserAction.setIcon({ path: icon }, function () {
      // Toggle the icon's visibility
      iconVisible = !iconVisible;

      // Stop blinking after 2500 milliseconds (5 times)
      if (blinkingCount >= 5) {
        clearInterval(blinkingInterval);
        resetIcon(); // Reset the icon to its original state
      }

      blinkingCount++;
    });
  }, 500);
}

function resetIcon() {
  const icon = chrome.runtime.getURL('icons/icon16.png'); // Replace with the correct path to your original icon
  chrome.browserAction.setIcon({ path: icon });
}
