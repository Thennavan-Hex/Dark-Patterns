chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'updatePopup') {
    const totalScore = request.totalScore;

    displayTotalScore(totalScore);
  } else if (request.action === 'updatePopupDefault') {
    displayTotalScore(0, true);
  }
});

function displayTotalScore(totalScore, notAvailable) {
  // Wait for the DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function () {
    const scoreElement = document.getElementById('totalScore');

    if (scoreElement) {
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
    } else {
      console.error("Element with ID 'totalScore' not found.");
    }
  });
}
