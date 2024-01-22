document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabId = tabs[0].id;
    chrome.runtime.sendMessage({ action: 'getTotalScore', tabId: tabId });
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'updatePopup') {
    const totalScore = request.totalScore;
    displayTotalScore(totalScore);
    updateProgressCircle(totalScore);
  } else if (request.action === 'updatePopupDefault') {
    displayTotalScore(0, true);
    updateProgressCircle(0);
  }
});

function displayTotalScore(totalScore, notAvailable) {
  const scoreElement = document.getElementById('totalScore');
  let colorClass = '';

  if (notAvailable) {
    colorClass = 'red';
    scoreElement.textContent = 'Total Score: 0% Not Available';
  } else {
    if (totalScore >= 70) {
      colorClass = 'green';
    } else if (totalScore >= 40) {
      colorClass = 'orange';
    } else {
      colorClass = 'red';
    }

    scoreElement.textContent = `Total Score: ${totalScore}%`;
  }

  scoreElement.className = colorClass;
}

function updateProgressCircle(totalScore) {
  const progressCircle = document.getElementById('progressCircle');
  const rotation = (totalScore / 100) * 360;
  progressCircle.style.transform = `rotate(${rotation}deg)`;
}
