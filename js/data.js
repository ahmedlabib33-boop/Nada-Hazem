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
