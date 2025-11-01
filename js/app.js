class CreateApp {
    constructor() {
        this.currentVideos = [];
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.isLoading = false;
        
        this.init();
    }

    async init() {
        console.log('🚀 Инициализация CREATE Video Hosting');
        this.setupEventListeners();
        await this.loadTrendingVideos();
    }

    setupEventListeners() {
        // Поиск по Enter
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Закрытие модальных окон
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeVideo();
            }
        });
    }

    // Загрузка трендовых видео
    async loadTrendingVideos() {
        try {
            this.showLoading();
            this.currentVideos = await invidiousAPI.getTrending();
            this.displayVideos(this.currentVideos);
        } catch (error) {
            this.showError('Ошибка загрузки трендов: ' + error.message);
        }
    }

    // Поиск видео
    async performSearch() {
        const query = document.getElementById('searchInput').value.trim();
        if (!query) {
            await this.loadTrendingVideos();
            return;
        }

        try {
            this.showLoading();
            this.searchQuery = query;
            this.currentVideos = await invidiousAPI.searchVideos(query);
            this.displayVideos(this.currentVideos);
        } catch (error) {
            this.showError('Ошибка поиска: ' + error.message);
        }
    }

    // Загрузка по категории
    async loadCategory(category) {
        try {
            this.showLoading();
            this.currentCategory = category;
            const categoryName = CONFIG.categories[category] || category;
            this.currentVideos = await invidiousAPI.searchVideos(categoryName);
            this.displayVideos(this.currentVideos);
            this.updateActiveCategory(category);
        } catch (error) {
            this.showError('Ошибка загрузки категории: ' + error.message);
        }
    }

    // Открытие видео
    async openVideo(videoId, title = '', channel = '', views = 0) {
        try {
            // Получаем детальную информацию о видео
            const videoInfo = await invidiousAPI.getVideoInfo(videoId);
            
            // Создаем плеер
            videoPlayer.createPlayer(videoId);
            
            // Заполняем информацию
            document.getElementById('videoTitleModal').textContent = videoInfo.title;
            document.getElementById('videoViewsModal').textContent = this.formatNumber(videoInfo.views) + ' просмотров';
            document.getElementById('videoLikesModal').textContent = this.formatNumber(videoInfo.likes) + ' лайков';
            document.getElementById('channelNameModal').textContent = videoInfo.channel;
            document.getElementById('channelAvatarModal').textContent = videoInfo.channel ? videoInfo.channel.charAt(0).toUpperCase() : 'C';
            
            // Показываем модальное окно
            document.getElementById('videoModal').style.display = 'block';
            
        } catch (error) {
            alert('Ошибка загрузки видео: ' + error.message);
        }
    }

    // Закрытие видео
    closeVideo() {
        document.getElementById('videoModal').style.display = 'none';
        videoPlayer.stopVideo();
    }

    // Отображение видео в сетке
    displayVideos(videos) {
        const grid = document.getElementById('videosGrid');
        
        if (!videos || videos.length === 0) {
            grid.innerHTML = '<div class="error">Видео не найдены</div>';
            return;
        }

        grid.innerHTML = videos.map(video => `
            <div class="video-card" onclick="app.openVideo('${video.id}', '${this.escapeHtml(video.title)}', '${this.escapeHtml(video.channel)}', ${video.views})">
                <div class="thumbnail">
                    <img src="${video.thumbnail}" 
                         alt="${video.title}"
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjMjcyNzI3Ii8+Cjx0ZXh0IHg9IjE2MCIgeT0iOTAiIGZpbGw9IiM2NjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UFJFVklFVzwvdGV4dD4KPC9zdmc+'">
                    <div class="duration">${video.duration}</div>
                </div>
                <div class="video-info">
                    <div class="channel-avatar">${video.channel ? video.channel.charAt(0).toUpperCase() : 'C'}</div>
                    <div class="video-details">
                        <div class="video-title">${video.title}</div>
                        <div class="channel-name">${video.channel}</div>
                        <div class="video-meta">${this.formatNumber(video.views)} просмотров • ${video.published}</div>
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
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateActiveCategory(category) {
        // Обновляем активные кнопки категорий
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
        });
    }

    // Публичные методы для HTML
    loadHomePage() {
        this.loadTrendingVideos();
    }

    loadTrending() {
        this.loadTrendingVideos();
    }

    showUploadForm() {
        alert('Функция добавления видео в разработке');
    }
}

// Инициализация приложения
const app = new CreateApp();
