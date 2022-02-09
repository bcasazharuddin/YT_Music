chrome.runtime.sendMessage('enable-youtube-audio');

var makeSetAudioURL = function(videoElement, url) {
    if (videoElement.src != url) {
		var paused = videoElement.paused;
        videoElement.src = url;
		if (paused === false) {
			videoElement.play();
		}
    }
};

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        let url = request.url;
        let videoElement = document.getElementsByTagName('video')[0];
		videoElement.onloadeddata = makeSetAudioURL(videoElement, url);

        let audioOnlyDivs = document.getElementsByClassName('audio_only_div');
        // Append alert text
        if (audioOnlyDivs.length == 0 && url.includes('mime=audio')) {
            let extensionAlert = document.createElement('div');
            extensionAlert.className = 'audio_only_div';

            let alertText = document.createElement('p');
            alertText.className = 'alert_text';
            alertText.innerHTML = 'YT Music Extension is running. ' +
                'It disabled the video stream and streaming the audio only tosave battery life and data.' +
                'If you want to watch video just click on the extension icon.';

            extensionAlert.appendChild(alertText);
            let parent = videoElement.parentNode.parentNode;

            // Append alert only if options specify to do so
            chrome.storage.local.get('disable_video_text', function(values) {
              var disableVideoText = (values.disable_video_text ? true : false);
              if (!disableVideoText && parent.getElementsByClassName("audio_only_div").length == 0)
                parent.appendChild(extensionAlert);
            });
        }
        else if (url == "") {
            for(div in audioOnlyDivs) {
                div.parentNode.removeChild(div);
            }
        }
    }
);
