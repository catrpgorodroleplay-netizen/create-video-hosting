// Конфигурация приложения CREATE Video Hosting
const CONFIG = {
    // Invidious instances для поиска видео
    invidiousInstances: [
        'https://iv.ggtyler.dev',
        'https://inv.riverside.rocks', 
        'https://yewtu.be',
        'https://invidious.snopyta.org',
        'https://invidious.osi.kr'
    ],
    
    // Инстанс по умолчанию
    defaultInstance: 'https://iv.ggtyler.dev',
    
    // Настройки поиска
    maxResults: 20,
    cacheDuration: 60 * 60 * 1000, // 1 час кэширования
    
    // Категории видео
    categories: {
        music: 'Музыка',
        gaming: 'Игры',
        education: 'Образование',
        comedy: 'Комедия',
        sports: 'Спорт',
        news: 'Новости',
        tech: 'Технологии',
        film: 'Фильмы',
        animation: 'Анимация',
        automotive: 'Авто'
    },
    
    // Настройки плеера
    player: {
        autoplay: true,
        controls: true,
        modestbranding: true,
        rel: false, // Не показывать related videos
        showinfo: false
    },
    
    // Настройки UI
    ui: {
        theme: 'dark',
        language: 'ru',
        defaultQuality: 'medium'
    }
};
