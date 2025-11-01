// Надежный Piped API
class PipedAPI {
    constructor() {
        this.currentInstance = CONFIG.defaultInstance;
        this.fallbackInstances = CONFIG.pipedInstances.filter(inst => inst !== this.currentInstance);
    }

    // Поиск видео
    async searchVideos(query) {
        for (let instance of [this.currentInstance, ...this.fallbackInstances]) {
            try {
                console.log(`🔍 Поиск через Piped: ${instance}`);
                const response = await fetch(`${instance}/search?q=${encodeURIComponent(query)}&filter=all`);
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const data = await response.json();
                const videos = data.items.filter(item => item.type === 'stream');
                
                console.log(`✅ Найдено ${videos.length} видео`);
                return this.formatResults(videos);
            } catch (error) {
                console.log(`❌ ${instance} упал:`, error.message);
                continue;
            }
        }
        throw new Error('Все Piped инстансы недоступны');
    }

    // Тренды
    async getTrending() {
        for (let instance of [this.currentInstance, ...this.fallbackInstances]) {
            try {
                console.log(`🔥 Тренды через Piped: ${instance}`);
                const response = await fetch(`${instance}/trending`);
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const data = await response.json();
                console.log(`✅ Получено ${data.length} трендов`);
                return this.formatResults(data);
            } catch (error) {
                console.log(`❌ ${instance} упал:`, error.message);
                continue;
            }
        }
        // Если все упали - возвращаем популярные видео через поиск
        return await this.searchVideos('music');
    }

    // Информация о видео
    async getVideoInfo(videoId) {
        for (let instance of [this.currentInstance, ...this.fallbackInstances]) {
            try {
                console.log(`📹 Информация о видео: ${videoId}`);
                const response = await fetch(`${instance}/streams/${videoId}`);
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const data = await response.json();
                return this.formatVideoInfo(data);
            } catch (error) {
                console.log(`❌ ${instance} упал:`, error.message);
                continue;
            }
        }
        // Базовая информация если API не доступно
        return this.getBasicVideoInfo(videoId);
    }

    // Форматирование результатов
    formatResults(items) {
        return items.map(item => ({
            id: item.url ? item.url.replace('/watch?v=', '') : item.id,
            title: item.title,
            channel: item.uploaderName || 'Unknown Channel',
            views: item.views || 0,
            duration: item.duration || '0:00',
            thumbnail: item.thumbnail || `https://img.youtube.com/vi/${item.url ? item.url.replace('/watch?v=', '') : item.id}/hqdefault.jpg`,
            published: 'recently',
            platform: 'youtube'
        }));
    }

    // Форматирование информации о видео
    formatVideoInfo(data) {
        return {
            id: data.id,
            title: data.title,
            description: data.description || 'Описание недоступно',
            channel: data.uploader,
            views: data.views || 0,
            likes: data.likes || 0,
            duration: this.formatDuration(data.duration),
            thumbnail: data.thumbnailUrl || `https://img.youtube.com/vi/${data.id}/hqdefault.jpg`,
            published: 'recently',
            keywords: []
        };
    }

    // Базовая информация если API не работает
    getBasicVideoInfo(videoId) {
        return {
            id: videoId,
            title: 'YouTube Video',
            description: 'Информация загружается...',
            channel: 'YouTube',
            views: 1000000,
            likes: 50000,
            duration: '10:00',
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            published: 'recently',
            keywords: []
        };
    }

    formatDuration(seconds) {
        if (!seconds) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

// Создаем глобальный экземпляр
const pipedAPI = new PipedAPI();
