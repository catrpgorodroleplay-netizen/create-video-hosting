class CreateApp {
    constructor() {
        this.currentVideos = [];
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.init();
    }

    async init() {
        console.log('🚀 CREATE Video Hosting с YouTube API');
        this.setupEventListeners();
        await this.loadTrendingVideos();
    }

    setupEventListeners() {
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) this.closeVideo();
        });
    }

    async loadTrendingVideos() {
        try {
            this.showLoading();
            this.currentVideos = await youtubeAPI.getTrending();
            this.displayVideos(this.currentVideos);
        } catch (error) {
            this.showError('Ошибка загрузки: ' + error.message);
        }
    }

    async performSearch() {
        const query = document.getElementById('searchInput').value.trim();
        if (!query) return await this.loadTrendingVideos();

        try {
            this.showLoading();
            this.searchQuery = query;
            this.currentVideos = await youtubeAPI.searchVideos(query);
            this.displayVideos(this.currentVideos);
        } catch (error) {
            this.showError('Ошибка поиска: ' + error.message);
        }
    }

    async loadCategory(category) {
        try {
            this.showLoading();
            this.currentCategory = category;
            const categoryName = CONFIG.categories[category] || category;
            this.currentVideos = await youtubeAPI.searchVideos(categoryName);
            this.displayVideos(this.currentVideos);
            this.updateActiveCategory(category);
        } catch (error) {
            this.showError('Ошибка категории: ' + error.message);
        }
    }

    async openVideo(videoId, title = '', channel = '', views = 0) {
        try {
            videoPlayer.createPlayer(videoId);
            
            document.getElementById('videoTitleModal').textContent = title;
            document.getElementById('videoViewsModal').textContent = views + ' просмотров';
            document.getElementById('videoLikesModal').textContent = 'Лайки: загружаются...';
            document.getElementById('channelNameModal').textContent = channel;
            document.getElementById('channelAvatarModal').textContent = channel ? channel.charAt(0).toUpperCase() : 'C';
            
            document.getElementById('videoModal').style.display = 'block';
            
        } catch (error) {
            alert('Ошибка загрузки видео: ' + error.message);
        }
    }

    closeVideo() {
        document.getElementById('videoModal').style.display = 'none';
        videoPlayer.stopVideo();
    }

    displayVideos(videos) {
        const grid = document.getElementById('videosGrid');
        
        if (!videos || videos.length === 0) {
            grid.innerHTML = '<div class="error">Видео не найдены</div>';
            return;
        }

        grid.innerHTML = videos.map(video => `
            <div class="video-card" onclick="app.openVideo('${video.id}', '${this.escapeHtml(video.title)}', '${this.escapeHtml(video.channel)}', '${video.views}')">
                <div class="thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <div class="duration">${video.duration}</div>
                </div>
                <div class="video-info">
                    <div class="channel-avatar">${video.channel ? video.channel.charAt(0).toUpperCase() : 'C'}</div>
                    <div class="video-details">
                        <div class="video-title">${video.title}</div>
                        <div class="channel-name">${video.channel}</div>
                        <div class="video-meta">${video.views} просмотров • ${video.published}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showLoading() {
        document.getElementById('videosGrid').innerHTML = '<div class="loading">Загрузка через YouTube API...</div>';
    }

    showError(message) {
        document.getElementById('videosGrid').innerHTML = `<div class="error">${message}</div>`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateActiveCategory(category) {
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
        });
    }

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

const app = new CreateApp();
