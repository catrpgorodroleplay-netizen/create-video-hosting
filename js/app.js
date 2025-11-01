class CreateApp {
    constructor() {
        this.currentVideos = [];
        this.init();
    }

    async init() {
        console.log('🚀 CREATE Video Hosting запущен');
        this.setupEventListeners();
        await this.loadTrendingVideos();
    }

    setupEventListeners() {
        // Поиск по Enter
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });

        // Закрытие модального окна
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) this.closeVideo();
        });
    }

    // Загрузка трендов
    async loadTrendingVideos() {
        try {
            this.showLoading();
            this.currentVideos = await pipedAPI.getTrending();
            this.displayVideos(this.currentVideos);
        } catch (error) {
            this.showError('Ошибка загрузки: ' + error.message);
        }
    }

    // Поиск видео
    async performSearch() {
        const query = document.getElementById('searchInput').value.trim();
        if (!query) return await this.loadTrendingVideos();

        try {
            this.showLoading();
            this.currentVideos = await pipedAPI.searchVideos(query);
            this.displayVideos(this.currentVideos);
        } catch (error) {
            this.showError('Ошибка поиска: ' + error.message);
        }
    }

    // Загрузка по категории
    async loadCategory(category) {
        try {
            this.showLoading();
            const categoryName = CONFIG.categories[category] || category;
            this.currentVideos = await pipedAPI.searchVideos(categoryName);
            this.displayVideos(this.currentVideos);
        } catch (error) {
            this.showError('Ошибка категории: ' + error.message);
        }
    }

    // Открытие видео
    async openVideo(videoId, title = '', channel = '') {
        try {
            const videoInfo = await pipedAPI.getVideoInfo(videoId);
            
            // Создаем плеер
            videoPlayer.createPlayer(videoId);
            
            // Заполняем информацию
            document.getElementById('videoTitleModal').textContent = videoInfo.title;
            document.getElementById('videoViewsModal').textContent = this.formatNumber(videoInfo.views) + ' просмотров';
            document.getElementById('videoLikesModal').textContent = this.formatNumber(videoInfo.likes) + ' лайков';
            document.getElementById('channelNameModal').textContent = videoInfo.channel;
            document.getElementById('channelAvatarModal').textContent = videoInfo.channel.charAt(0).toUpperCase();
            
            // Показываем модальное окно
            document.getElementById('videoModal').style.display = 'block';
            
        } catch (error) {
            alert('Ошибка загрузки видео');
        }
    }

    // Закрытие видео
    closeVideo() {
        document.getElementById('videoModal').style.display = 'none';
        videoPlayer.stopVideo();
    }

    // Отображение видео
    displayVideos(videos) {
        const grid = document.getElementById('videosGrid');
        
        if (!videos || videos.length === 0) {
            grid.innerHTML = '<div class="error">Видео не найдены</div>';
            return;
        }

        grid.innerHTML = videos.map(video => `
            <div class="video-card" onclick="app.openVideo('${video.id}', '${this.escapeHtml(video.title)}', '${this.escapeHtml(video.channel)}')">
                <div class="thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <div class="duration">${video.duration}</div>
                </div>
                <div class="video-info">
                    <div class="channel-avatar">${video.channel.charAt(0).toUpperCase()}</div>
                    <div class="video-details">
                        <div class="video-title">${video.title}</div>
                        <div class="channel-name">${video.channel}</div>
                        <div class="video-meta">${this.formatNumber(video.views)} просмотров</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Вспомогательные методы
    showLoading() {
        document.getElementById('videosGrid').innerHTML = '<div class="loading">Загрузка...</div>';
    }

    showError(message) {
        document.getElementById('videosGrid').innerHTML = `<div class="error">${message}</div>`;
    }

    formatNumber(num) {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Публичные методы для HTML
    loadHomePage() {
        this.loadTrendingVideos();
    }

    loadTrending() {
        this.loadTrendingVideos();
    }

    showUploadForm() {
        alert('Добавление видео в разработке');
    }
}

// Запуск приложения
const app = new CreateApp();
