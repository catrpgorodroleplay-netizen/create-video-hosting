class CreatePlayer {
    constructor() {
        this.currentVideoId = null;
        this.player = null;
        this.isYouTubeAPILoaded = false;
        this.loadYouTubeAPI();
    }

    // Загрузка YouTube IFrame API
    loadYouTubeAPI() {
        if (this.isYouTubeAPILoaded) return;

        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
            this.isYouTubeAPILoaded = true;
            console.log('✅ YouTube IFrame API загружен');
        };
    }

    // Создание плеера
    createPlayer(videoId, elementId = 'videoPlayer') {
        if (!this.isYouTubeAPILoaded) {
            console.log('⚠️ YouTube API еще не загружен');
            setTimeout(() => this.createPlayer(videoId, elementId), 100);
            return;
        }

        this.currentVideoId = videoId;

        // Удаляем старый плеер если есть
        if (this.player) {
            this.player.destroy();
        }

        // Создаем новый плеер
        this.player = new YT.Player(elementId, {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
                'playsinline': 1,
                'rel': 0,
                'modestbranding': 1,
                'showinfo': 0
            },
            events: {
                'onReady': this.onPlayerReady.bind(this),
                'onStateChange': this.onPlayerStateChange.bind(this),
                'onError': this.onPlayerError.bind(this)
            }
        });
    }

    onPlayerReady(event) {
        console.log('✅ Плеер готов');
        event.target.playVideo();
    }

    onPlayerStateChange(event) {
        const states = {
            '-1': 'unstarted',
            '0': 'ended',
            '1': 'playing',
            '2': 'paused',
            '3': 'buffering',
            '5': 'video cued'
        };
        console.log(`🎬 Состояние плеера: ${states[event.data]}`);
    }

    onPlayerError(event) {
        console.error('❌ Ошибка плеера:', event.data);
    }

    // Воспроизведение видео
    playVideo() {
        if (this.player) {
            this.player.playVideo();
        }
    }

    // Пауза
    pauseVideo() {
        if (this.player) {
            this.player.pauseVideo();
        }
    }

    // Остановка
    stopVideo() {
        if (this.player) {
            this.player.stopVideo();
        }
    }

    // Установка громкости
    setVolume(volume) {
        if (this.player) {
            this.player.setVolume(volume);
        }
    }

    // Получение длительности
    getDuration() {
        return this.player ? this.player.getDuration() : 0;
    }

    // Получение текущего времени
    getCurrentTime() {
        return this.player ? this.player.getCurrentTime() : 0;
    }

    // Перемотка
    seekTo(seconds) {
        if (this.player) {
            this.player.seekTo(seconds, true);
        }
    }

    // Уничтожение плеера
    destroy() {
        if (this.player) {
            this.player.destroy();
            this.player = null;
        }
    }
}

// Создаем глобальный экземпляр плеера
const videoPlayer = new CreatePlayer();
