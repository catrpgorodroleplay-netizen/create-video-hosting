class InvidiousAPI {
    constructor() {
        this.currentInstance = CONFIG.defaultInstance;
        this.fallbackInstances = CONFIG.invidiousInstances.filter(inst => inst !== this.currentInstance);
    }

    // Поиск видео
    async searchVideos(query, type = 'video') {
        for (let instance of [this.currentInstance, ...this.fallbackInstances]) {
            try {
                console.log(`🔍 Поиск через ${instance}: ${query}`);
                const response = await fetch(`${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=${type}`);
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const data = await response.json();
                console.log(`✅ Найдено ${data.length} видео`);
                return this.formatSearchResults(data);
            } catch (error) {
                console.log(`❌ Ошибка ${instance}:`, error.message);
                continue;
            }
        }
        throw new Error('Все инстансы недоступны');
    }

    // Получение трендов
    async getTrending() {
        for (let instance of [this.currentInstance, ...this.fallbackInstances]) {
            try {
                console.log(`🔥 Получение трендов через ${instance}`);
                const response = await fetch(`${instance}/api/v1/trending`);
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const data = await response.json();
                console.log(`✅ Получено ${data.length} трендовых видео`);
                return this.formatSearchResults(data);
            } catch (error) {
                console.log(`❌ Ошибка ${instance}:`, error.message);
                continue;
            }
        }
        throw new Error('Все инстансы недоступны');
    }

    // Получение информации о видео
    async getVideoInfo(videoId) {
        for (let instance of [this.currentInstance, ...this.fallbackInstances]) {
            try {
                console.log(`📹 Получение информации о видео ${videoId}`);
                const response = await fetch(`${instance}/api/v1/videos/${videoId}`);
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const data = await response.json();
                return this.formatVideoInfo(data);
            } catch (error) {
                console.log(`❌ Ошибка ${instance}:`, error.message);
                continue;
            }
        }
        throw new Error('Все инстансы недоступны');
    }

    // Форматирование результатов поиска
    formatSearchResults(data) {
        return data.map(item => ({
            id: item.videoId,
            title: item.title,
            channel: item.author,
            channelId: item.authorId,
            views: item.viewCount,
            duration: this.formatDuration(item.lengthSeconds),
            thumbnail: this.getBestThumbnail(item.videoThumbnails),
            published: item.publishedText,
            platform: 'youtube'
        }));
    }

    // Форматирование информации о видео
    formatVideoInfo(data) {
        return {
            id: data.videoId,
            title: data.title,
            description: data.description,
            channel: data.author,
            channelId: data.authorId,
            views: data.viewCount,
            likes: data.likeCount,
            duration: this.formatDuration(data.lengthSeconds),
            thumbnail: this.getBestThumbnail(data.videoThumbnails),
            published: data.publishedText,
            keywords: data.keywords || []
        };
    }

    // Форматирование длительности
    formatDuration(seconds) {
        if (!seconds) return '--:--';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    }

    // Выбор лучшего превью
    getBestThumbnail(thumbnails) {
        if (!thumbnails || thumbnails.length === 0) {
            return '';
        }
        
        // Предпочитаем превью среднего качества
        const qualityOrder = ['medium', 'high', 'standard', 'default'];
        for (let quality of qualityOrder) {
            const thumb = thumbnails.find(t => t.quality === quality);
            if (thumb) return thumb.url;
        }
        
        return thumbnails[0].url;
    }
}

// Создаем глобальный экземпляр
const invidiousAPI = new InvidiousAPI();
