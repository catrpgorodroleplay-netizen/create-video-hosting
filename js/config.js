// Конфигурация приложения CREATE Video Hosting
const CONFIG = {
    // Актуальные рабочие Invidious instances
    invidiousInstances: [
        'https://inv.odyssey346.dev',
        'https://invidious.private.coffee',
        'https://yt.artemislena.eu',
        'https://invidious.flokinet.to',
        'https://inv.nadeko.net'
    ],
    
    // Инстанс по умолчанию
    defaultInstance: 'https://inv.odyssey346.dev',
    
    // Настройки поиска
    maxResults: 20,
    cacheDuration: 60 * 60 * 1000,
    
    // Категории видео
    categories: {
        music: 'music',
        gaming: 'gaming',
        education: 'education',
        comedy: 'comedy',
        sports: 'sports',
        news: 'news',
        tech: 'technology'
    }
};
