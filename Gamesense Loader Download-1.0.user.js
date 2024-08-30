// ==UserScript==
// @name         Gamesense Loader Download
// @description  Script that adds download buttons for the latest CS2 & CS:GO Loader
// @version      1.0
// @author       Exodouding
// @match        https://gamesense.pub/forums/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamesense.pub
// ==/UserScript==

(function() {
    'use strict';

    function addDownloadButtons() {
        var autoDownloadLink = document.createElement("li");
        autoDownloadLink.id = "navpayment";
        autoDownloadLink.innerHTML = '<a href="" id="cs2DownloadButton">Download CS2 Loader</a>';

        var csgoDownloadLink = document.createElement("li");
        csgoDownloadLink.id = "navpayment-csgo";
        csgoDownloadLink.innerHTML = '<a href="" id="csgoDownloadButton">Download CS:GO Loader</a>';

        var premiumElement = document.getElementById("navpremium");
        if (premiumElement) {
            premiumElement.parentNode.insertBefore(autoDownloadLink, premiumElement.nextSibling);
            premiumElement.parentNode.insertBefore(csgoDownloadLink, autoDownloadLink.nextSibling);
        }

        var downloadButton = document.getElementById("cs2DownloadButton");
        if (downloadButton) {
            downloadButton.addEventListener('click', function(event) {
                event.preventDefault();
                fetchUserIdAndRedirect("cs2");
            });
        }

        var csgoButton = document.getElementById("csgoDownloadButton");
        if (csgoButton) {
            csgoButton.addEventListener('click', function(event) {
                event.preventDefault();
                fetchUserIdAndRedirect("csgo");
            });
        }
    }

    function fetchUserIdAndRedirect(version) {
        var profileLink = document.querySelector('#navprofile a');
        if (profileLink) {
            var urlParams = new URLSearchParams(profileLink.href.split('?')[1]);
            var userId = urlParams.get('id');
            if (userId) {
                redirectToPremiumPage(userId, version);
            }
        }
    }

    function redirectToPremiumPage(userId, version) {
        var premiumPageUrl = `https://gamesense.pub/forums/profile.php?section=premium&id=${userId}`;
        sessionStorage.setItem('triggerDownload', version);
        sessionStorage.setItem('userId', userId);
        window.location.href = premiumPageUrl;
    }

    function triggerDownloadOnPremiumPage() {
        var shouldTriggerDownload = sessionStorage.getItem('triggerDownload');
        if (shouldTriggerDownload) {
            sessionStorage.removeItem('triggerDownload');
            var downloadButtonName = shouldTriggerDownload === "cs2" ? "download_client" : "download_client_csgo";
            var existingDownloadButton = document.querySelector(`input[name="${downloadButtonName}"].button`);
            if (existingDownloadButton) {
                existingDownloadButton.click();
            }
        }
    }

    addDownloadButtons();

    if (window.location.href.includes('section=premium')) {
        triggerDownloadOnPremiumPage();
    }
})();