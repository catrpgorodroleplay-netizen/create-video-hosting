class YouTubeAPI {
    constructor() {
        this.apiKey = window.YOUTUBE_API_KEY;
    }

    async searchVideos(query) {
        try {
            console.log('🔍 YouTube API поиск:', query);
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=20&key=${this.apiKey}`
            );
            
            if (!response.ok) throw new Error('YouTube API error');
            
            const data = await response.json();
            console.log('✅ YouTube API результаты:', data.items.length);
            return this.formatResults(data.items);
        } catch (error) {
            console.log('❌ YouTube API ошибка:', error);
            throw new Error('YouTube API недоступен');
        }
    }

    async getTrending() {
        try {
            console.log('🔥 YouTube API тренды');
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=20&regionCode=RU&key=${this.apiKey}`
            );
            
            if (!response.ok) throw new Error('YouTube API error');
            
            const data = await response.json();
            console.log('✅ YouTube API тренды:', data.items.length);
            return this.formatVideoResults(data.items);
        } catch (error) {
            console.log('❌ YouTube API ошибка:', error);
            throw new Error('YouTube API недоступен');
        }
    }

    formatResults(items) {
        return items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.medium.url,
            published: this.formatDate(item.snippet.publishedAt),
            views: 0,
            duration: '0:00'
        }));
    }

    formatVideoResults(items) {
        return items.map(item => ({
            id: item.id,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.medium.url,
            published: this.formatDate(item.snippet.publishedAt),
            views: this.formatNumber(item.statistics.viewCount),
            duration: '0:00'
        }));
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'сегодня';
        if (days === 1) return 'вчера';
        if (days < 7) return `${days} дней назад`;
        if (days < 30) return `${Math.floor(days / 7)} недель назад`;
        return `${Math.floor(days / 30)} месяцев назад`;
    }

    formatNumber(num) {
        if (!num) return '0';
        num = parseInt(num);
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }
}

// Создаем глобальный экземпляр
const youtubeAPI = new YouTubeAPI();
