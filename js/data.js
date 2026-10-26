// Content catalog for the app. Everything here is free AND legal:
// public-domain films hosted by the Internet Archive (playable in-app),
// plus ad-supported / library-card streaming services (opened in a new tab).

export const MOODS = [
  { id: "cozy",    label: "Cozy night in",  emoji: "🛋️" },
  { id: "laugh",   label: "Make me laugh",  emoji: "😂" },
  { id: "romance", label: "Romance",        emoji: "💕" },
  { id: "thrill",  label: "Edge of my seat", emoji: "🔪" },
  { id: "spooky",  label: "Spooky",         emoji: "👻" },
  { id: "classic", label: "Old Hollywood",  emoji: "🎞️" },
];

// Internet Archive public-domain films. `id` is the archive.org identifier,
// used for both the embedded player and the poster thumbnail.
export const VAULT = [
  { id: "his_girl_friday", title: "His Girl Friday", year: 1940, moods: ["laugh", "romance", "classic"],
    blurb: "A fast-talking newspaper editor tries to win back his star reporter — and ex-wife. Rapid-fire screwball perfection." },
  { id: "MyManGodfrey1936", title: "My Man Godfrey", year: 1936, moods: ["laugh", "romance", "cozy", "classic"],
    blurb: "A ditzy socialite hires a 'forgotten man' as the family butler. Carole Lombard at her funniest." },
  { id: "penny_serenade", title: "Penny Serenade", year: 1941, moods: ["romance", "cozy", "classic"],
    blurb: "Cary Grant and Irene Dunne relive their marriage through a stack of old records. Bring tissues." },
  { id: "meet_john_doe", title: "Meet John Doe", year: 1941, moods: ["cozy", "classic"],
    blurb: "A columnist invents a fake protest letter, then has to find a man to play its author. Frank Capra heart." },
  { id: "my_favorite_brunette", title: "My Favorite Brunette", year: 1947, moods: ["laugh", "classic"],
    blurb: "Bob Hope is a baby photographer mistaken for a private eye, opposite Dorothy Lamour." },
  { id: "The39Steps_1935", title: "The 39 Steps", year: 1935, moods: ["thrill", "romance", "classic"],
    blurb: "Hitchcock's original man-on-the-run thriller, with a reluctant romance handcuffed in." },
  { id: "TheStranger_0", title: "The Stranger", year: 1946, moods: ["thrill", "classic"],
    blurb: "Orson Welles directs and stars as a hidden war criminal living as a small-town teacher." },
  { id: "Detour", title: "Detour", year: 1945, moods: ["thrill", "classic"],
    blurb: "A hitchhiking pianist falls into one bad decision after another. Lean, mean film noir." },
  { id: "kansascityconfidencial", title: "Kansas City Confidential", year: 1952, moods: ["thrill"],
    blurb: "A framed ex-con tracks the masked crew behind an armored-car heist to a Mexican resort." },
  { id: "house_on_haunted_hill_ipod", title: "House on Haunted Hill", year: 1959, moods: ["spooky", "laugh"],
    blurb: "Vincent Price offers $10,000 to anyone who survives the night. Campy, creepy fun." },
  { id: "CarnivalofSouls", title: "Carnival of Souls", year: 1962, moods: ["spooky"],
    blurb: "After a car accident, a church organist is haunted by a pale man and an abandoned pavilion." },
  { id: "Nosferatu_most_complete_version_93_mins.", title: "Nosferatu", year: 1922, moods: ["spooky", "classic"],
    blurb: "The silent vampire film that started it all. Still deeply unsettling a century later." },
  { id: "The_Little_Shop_of_Horrors.mpeg", title: "The Little Shop of Horrors", year: 1960, moods: ["laugh", "spooky"],
    blurb: "A florist's clerk breeds a plant with a taste for blood. Look out for a young Jack Nicholson." },
  { id: "The_General_Buster_Keaton", title: "The General", year: 1926, moods: ["laugh", "classic", "cozy"],
    blurb: "Buster Keaton chases his stolen locomotive in one of the greatest stunt comedies ever made." },
  { id: "Sita_Sings_the_Blues", title: "Sita Sings the Blues", year: 2008, moods: ["romance", "laugh", "cozy"],
    blurb: "An animated retelling of the Ramayana set to 1920s jazz, mixed with a modern breakup story." },
  { id: "gullivers_travels1939", title: "Gulliver's Travels", year: 1939, moods: ["cozy"],
    blurb: "The Fleischer Studios' colorful animated adventure in the land of Lilliput." },
];

// Free streaming services. `search` gets the query appended (URL-encoded).
// `tag` explains the catch, if any.
export const SERVICES = [
  { name: "Tubi", color: "#fa541c", has: "Movies & series", tag: "Free with ads",
    home: "https://tubitv.com", search: "https://tubitv.com/search/" },
  { name: "Pluto TV", color: "#fff200", ink: "#111", has: "Live channels, movies & series", tag: "Free with ads",
    home: "https://pluto.tv", search: "https://pluto.tv/en/search/details/?query=" },
  { name: "The Roku Channel", color: "#6f1ab1", has: "Movies, series & live TV", tag: "Free with ads",
    home: "https://therokuchannel.roku.com", search: "https://therokuchannel.roku.com/search/" },
  { name: "Plex", color: "#e5a00d", ink: "#111", has: "Movies, series & live TV", tag: "Free with ads",
    home: "https://watch.plex.tv", search: "https://watch.plex.tv/search?q=" },
  { name: "YouTube Movies", color: "#ff0033", has: "Full movies & shows", tag: "Free with ads",
    home: "https://www.youtube.com/feed/storefront", search: "https://www.youtube.com/results?search_query=", suffix: " full movie free" },
  { name: "Shahid", color: "#00c389", ink: "#111", has: "Arabic series & movies", tag: "Free section, with ads",
    home: "https://shahid.mbc.net", search: "https://shahid.mbc.net/en/search?term=" },
  { name: "Kanopy", color: "#e0362c", has: "Award-winning films", tag: "Free with a library card",
    home: "https://www.kanopy.com", search: "https://www.kanopy.com/en/search?query=" },
  { name: "Hoopla", color: "#1b75bb", has: "Movies, TV, music & books", tag: "Free with a library card",
    home: "https://www.hoopladigital.com", search: "https://www.hoopladigital.com/search?q=" },
  { name: "Internet Archive", color: "#9aa0a6", ink: "#111", has: "Thousands of classic films", tag: "Free, no ads",
    home: "https://archive.org/details/feature_films", search: "https://archive.org/search?query=" },
];

// JustWatch shows which free services carry a title in her country.
export const JUSTWATCH = "https://www.justwatch.com/us/search?q=";

// Social platforms. `url` gets the saved handle appended; `app` is used when
// there's no handle (or the platform has no public profile URL).
export const SOCIALS = [
  { id: "instagram", name: "Instagram", color: "#e1306c", url: "https://instagram.com/", app: "https://instagram.com" },
  { id: "tiktok",    name: "TikTok",    color: "#25f4ee", ink: "#111", url: "https://www.tiktok.com/@", app: "https://www.tiktok.com" },
  { id: "facebook",  name: "Facebook",  color: "#1877f2", url: "https://facebook.com/", app: "https://facebook.com" },
  { id: "snapchat",  name: "Snapchat",  color: "#fffc00", ink: "#111", url: "https://snapchat.com/add/", app: "https://web.snapchat.com" },
  { id: "youtube",   name: "YouTube",   color: "#ff0033", url: "https://youtube.com/@", app: "https://youtube.com" },
  { id: "x",         name: "X",         color: "#e7e9ea", ink: "#111", url: "https://x.com/", app: "https://x.com" },
  { id: "threads",   name: "Threads",   color: "#bfbfbf", ink: "#111", url: "https://threads.net/@", app: "https://threads.net" },
  { id: "pinterest", name: "Pinterest", color: "#e60023", url: "https://pinterest.com/", app: "https://pinterest.com" },
  { id: "whatsapp",  name: "WhatsApp",  color: "#25d366", ink: "#111", url: null, app: "https://web.whatsapp.com" },
  { id: "telegram",  name: "Telegram",  color: "#2aabee", url: "https://t.me/", app: "https://web.telegram.org" },
  { id: "letterboxd", name: "Letterboxd", color: "#00e054", ink: "#111", url: "https://letterboxd.com/", app: "https://letterboxd.com" },
  { id: "spotify",   name: "Spotify",   color: "#1ed760", ink: "#111", url: null, app: "https://open.spotify.com" },
];

// Ideas for the "Movie night kit" generator.
export const SNACKS = [
  "Popcorn with a drizzle of melted chocolate", "Strawberries & whipped cream", "Nachos piled high",
  "A big mug of hot chocolate", "Cheese board & grapes", "Mint tea & dates", "Ice cream straight from the tub",
  "Homemade pizza", "Salted caramel popcorn", "Fresh mango slices", "Basbousa & coffee", "Sushi takeout",
];
export const NIGHT_VIBES = [
  "Fairy lights on, phone on silent", "Face mask + fluffy socks", "Blanket fort, no apologies",
  "Candles lit, lights off", "Pajamas and the comfiest pillow", "Call a friend and watch together",
  "Sofa + weighted blanket", "Bubble bath first, film after",
];

// Subscription platforms. The app can't make these free, but it opens her own
// account straight to the search results. `free` notes any free plan or trial.
export const PLATFORMS = [
  { name: "Netflix", color: "#e50914", has: "Series, films & reality", free: "Subscription",
    home: "https://www.netflix.com", search: "https://www.netflix.com/search?q=" },
  { name: "Shahid VIP", color: "#00c389", ink: "#111", has: "Arabic series, Ramadan shows & films", free: "Free plan with ads",
    home: "https://shahid.mbc.net", search: "https://shahid.mbc.net/en/search?term=" },
  { name: "Prime Video", color: "#00a8e1", has: "Films, series & sport", free: "30-day free trial",
    home: "https://www.primevideo.com", search: "https://www.primevideo.com/search/ref=atv_nb_sr?phrase=" },
  { name: "Disney+", color: "#113ccf", has: "Disney, Marvel, Pixar & Star Wars", free: "Subscription",
    home: "https://www.disneyplus.com", search: null },
  { name: "HBO Max", color: "#5822b4", has: "HBO series & Warner films", free: "Subscription",
    home: "https://www.hbomax.com", search: "https://play.hbomax.com/search?q=" },
  { name: "Apple TV+", color: "#1d1d1f", has: "Apple originals", free: "7-day free trial",
    home: "https://tv.apple.com", search: "https://tv.apple.com/search?term=" },
  { name: "OSN+", color: "#ff5a1f", has: "HBO & Hollywood in the Middle East", free: "Free trial",
    home: "https://osnplus.com", search: "https://osnplus.com/en/search?q=" },
  { name: "Watch It", color: "#f2c200", ink: "#111", has: "Egyptian series & classics", free: "Subscription",
    home: "https://www.watchit.com", search: "https://www.watchit.com/search?query=" },
  { name: "Hulu", color: "#1ce783", ink: "#111", has: "US series & next-day TV", free: "Subscription",
    home: "https://www.hulu.com", search: "https://www.hulu.com/search?q=" },
  { name: "Paramount+", color: "#0064ff", has: "Paramount films & CBS shows", free: "7-day free trial",
    home: "https://www.paramountplus.com", search: "https://www.paramountplus.com/search/?query=" },
  { name: "Crunchyroll", color: "#f47521", has: "Anime", free: "Free plan with ads",
    home: "https://www.crunchyroll.com", search: "https://www.crunchyroll.com/search?q=" },
];

// Music, podcasts and live video. All have a free way in.
export const MUSIC = [
  { name: "Spotify", color: "#1ed760", ink: "#111", has: "Music & podcasts", free: "Free with ads",
    home: "https://open.spotify.com", search: "https://open.spotify.com/search/" },
  { name: "Anghami", color: "#9b4dff", has: "Arabic & international music", free: "Free with ads",
    home: "https://play.anghami.com", search: "https://play.anghami.com/search/" },
  { name: "YouTube Music", color: "#ff0033", has: "Every song, every remix", free: "Free with ads",
    home: "https://music.youtube.com", search: "https://music.youtube.com/search?q=" },
  { name: "SoundCloud", color: "#ff5500", has: "Remixes & new artists", free: "Free",
    home: "https://soundcloud.com", search: "https://soundcloud.com/search?q=" },
  { name: "Apple Music", color: "#fa243c", has: "Music & radio", free: "1-month free trial",
    home: "https://music.apple.com", search: "https://music.apple.com/search?term=" },
  { name: "Twitch", color: "#9146ff", has: "Live streams & gaming", free: "Free",
    home: "https://www.twitch.tv", search: "https://www.twitch.tv/search?term=" },
  { name: "YouTube", color: "#ff0033", has: "Vlogs, music & full shows", free: "Free",
    home: "https://www.youtube.com", search: "https://www.youtube.com/results?search_query=" },
];

// Pages on each service that list what's free right now.
export const FREE_NOW = [
  { name: "Prime Video: Free with ads", color: "#00a8e1", has: "Films & series free, no Prime needed", url: "https://www.primevideo.com/storefront/freewithads/" },
  { name: "Tubi", color: "#fa541c", has: "New films added every week", url: "https://tubitv.com/home" },
  { name: "Pluto TV on demand", color: "#fff200", ink: "#111", has: "Full series & films", url: "https://pluto.tv/en/on-demand/" },
  { name: "The Roku Channel", color: "#6f1ab1", has: "Free films, series & live TV", url: "https://therokuchannel.roku.com/browse" },
  { name: "Plex", color: "#e5a00d", ink: "#111", has: "Free films & live channels", url: "https://watch.plex.tv/movies" },
  { name: "Shahid free", color: "#00c389", ink: "#111", has: "Arabic series free with ads", url: "https://shahid.mbc.net/en/free" },
  { name: "YouTube free movies", color: "#ff0033", has: "Studio films, free with ads", url: "https://www.youtube.com/feed/storefront" },
  { name: "Crunchyroll new", color: "#f47521", has: "New anime episodes, free with ads", url: "https://www.crunchyroll.com/videos/new" },
];

// One a day, under the greeting.
export const AFFIRMATIONS = [
  "You're the main character today. Dress like it.",
  "Rest is productive too. Tonight, let's just enjoy.",
  "Your glow doesn't need permission.",
  "A good outfit is a good mood you can wear.",
  "Today's plan: look great, feel great, watch something great.",
  "You've done hard things. Tonight is for soft things.",
  "Confidence is the best accessory, and you've got it.",
  "Whatever today brings, you've got the perfect look for it.",
  "Be gentle with yourself. Then be fabulous.",
  "You're allowed to take up space, in olive, in mustard, in anything.",
  "Small joys count: a film, a snack, a perfectly winged liner.",
  "Treat yourself like someone you love.",
  "The best time to feel beautiful is right now.",
  "Make it a good one. You usually do.",
];
