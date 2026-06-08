(function () {
    function boot(shell) {
        var video = shell.querySelector("video");
        var cover = shell.querySelector(".player-cover");
        if (!video) {
            return;
        }
        var stream = video.getAttribute("data-stream");
        var started = false;
        function attach() {
            if (started) {
                return;
            }
            started = true;
            if (cover) {
                cover.classList.add("is-hidden");
            }
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
            } else {
                video.src = stream;
                video.play().catch(function () {});
            }
        }
        if (cover) {
            cover.addEventListener("click", attach);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                attach();
            }
        });
    }
    document.addEventListener("DOMContentLoaded", function () {
        Array.prototype.slice.call(document.querySelectorAll(".player-shell")).forEach(boot);
    });
}());
