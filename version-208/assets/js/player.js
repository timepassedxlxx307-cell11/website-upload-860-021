import { H as Hls } from './hls.js';

document.addEventListener('DOMContentLoaded', () => {
    const players = document.querySelectorAll('.video-player');

    players.forEach((player) => {
        const video = player.querySelector('video');
        const overlay = player.querySelector('.play-overlay');
        const stream = video?.getAttribute('data-video');
        let prepared = false;
        let hls = null;

        const prepare = () => {
            if (!video || !stream || prepared) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (Hls.isSupported()) {
                hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
            } else {
                video.src = stream;
            }

            video.controls = true;
            prepared = true;
        };

        const play = async () => {
            if (!video) {
                return;
            }

            prepare();
            overlay?.classList.add('is-hidden');

            try {
                await video.play();
            } catch (error) {
                overlay?.classList.remove('is-hidden');
            }
        };

        overlay?.addEventListener('click', play);
        video?.addEventListener('click', () => {
            if (!prepared) {
                play();
                return;
            }

            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });

        video?.addEventListener('pause', () => {
            if (video.currentTime === 0 || video.ended) {
                overlay?.classList.remove('is-hidden');
            }
        });
    });
});
