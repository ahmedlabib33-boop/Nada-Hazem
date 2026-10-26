// Content for the Fashion and Beauty helpers.

// ---------- Fashion ----------

// How dressy each occasion is: 0 = loungewear … 3 = formal.
export const OCCASIONS = [
  { id: "home",    label: "Cozy at home",  emoji: "🏡", f: 0 },
  { id: "beach",   label: "Beach day",     emoji: "🏖️", f: 0 },
  { id: "travel",  label: "Travel",        emoji: "✈️", f: 1 },
  { id: "brunch",  label: "Brunch",        emoji: "🥂", f: 1 },
  { id: "work",    label: "Work",          emoji: "💼", f: 2 },
  { id: "date",    label: "Date night",    emoji: "💘", f: 2 },
  { id: "night",   label: "Night out",     emoji: "🪩", f: 3 },
  { id: "wedding", label: "Wedding guest", emoji: "💍", f: 3 },
];

export const WEATHER = [
  { id: "hot",   label: "Hot",   emoji: "☀️" },
  { id: "mild",  label: "Mild",  emoji: "🌤️" },
  { id: "cold",  label: "Cold",  emoji: "❄️" },
  { id: "rainy", label: "Rainy", emoji: "🌧️" },
];

export const VIBES = [
  { id: "sporty",  label: "Sporty chic", emoji: "🧢" },
  { id: "classic", label: "Old money",   emoji: "🤍" },
  { id: "glam",    label: "Glam",        emoji: "💎" },
  { id: "boho",    label: "Boho",        emoji: "🌻" },
  { id: "minimal", label: "Minimal",     emoji: "◽" },
  { id: "modest",  label: "Modest",      emoji: "🧕" },
];

// Pieces per vibe: [name, min formality, max formality, weather]
// weather: "" = any, "h" = warm days only, "c" = cool days only.
export const WARDROBE = {
  sporty: {
    tops: [["cropped hoodie", 0, 1, "c"], ["fitted ribbed tank", 0, 2, "h"], ["oversized graphic tee", 0, 1, ""], ["zip-up track jacket over a bodysuit", 1, 2, ""], ["satin bomber over a crop top", 2, 3, ""], ["sleek one-shoulder top", 2, 3, ""]],
    bottoms: [["wide-leg joggers", 0, 1, ""], ["biker shorts", 0, 1, "h"], ["cargo pants", 1, 2, ""], ["straight-leg jeans", 1, 2, ""], ["satin midi skirt", 2, 3, ""], ["leather-look trousers", 2, 3, "c"]],
    dresses: [["ribbed tank midi dress", 0, 2, "h"], ["polo knit mini dress", 1, 2, ""], ["slip dress with a cropped jacket", 2, 3, ""]],
    shoes: [["chunky white sneakers", 0, 2, ""], ["slides", 0, 1, "h"], ["retro running sneakers", 0, 2, ""], ["combat boots", 1, 2, "c"], ["strappy heeled sandals", 2, 3, "h"], ["pointed sock boots", 2, 3, "c"]],
    outer: [["oversized puffer", 0, 2, "c"], ["cropped denim jacket", 0, 2, ""], ["long leather trench", 2, 3, ""]],
    bags: [["belt bag worn cross-body", 0, 2, ""], ["mini backpack", 0, 1, ""], ["structured shoulder bag", 2, 3, ""]],
    extras: [["your black baseball cap", 0, 2, ""], ["chunky gold hoops", 1, 3, ""], ["sporty wraparound sunglasses", 0, 2, "h"], ["layered chain necklaces", 1, 3, ""]],
  },
  classic: {
    tops: [["cashmere crewneck", 1, 2, "c"], ["crisp poplin shirt", 1, 2, ""], ["silk blouse", 2, 3, ""], ["cable-knit sweater over the shoulders", 1, 2, ""], ["fine-knit polo", 1, 2, "h"], ["soft cotton tee", 0, 1, ""]],
    bottoms: [["pleated wide-leg trousers", 1, 3, ""], ["tailored shorts", 1, 1, "h"], ["pleated midi skirt", 2, 3, ""], ["straight dark jeans", 1, 2, ""], ["knit lounge pants", 0, 0, ""]],
    dresses: [["linen shirt dress", 1, 2, "h"], ["wrap midi dress", 2, 3, ""], ["column maxi dress", 3, 3, ""], ["knit midi dress", 1, 2, "c"]],
    shoes: [["leather loafers", 1, 2, ""], ["ballet flats", 1, 2, ""], ["slingback kitten heels", 2, 3, ""], ["knee-high riding boots", 1, 2, "c"], ["leather sandals", 0, 2, "h"], ["suede slippers", 0, 0, "c"]],
    outer: [["camel wool coat", 1, 3, "c"], ["classic trench", 1, 3, ""], ["tweed jacket", 2, 3, ""]],
    bags: [["structured top-handle bag", 2, 3, ""], ["woven basket bag", 0, 1, "h"], ["leather tote", 1, 2, ""]],
    extras: [["pearl studs", 1, 3, ""], ["a silk scarf tied on your bag", 1, 3, ""], ["a slim gold watch", 1, 3, ""], ["tortoiseshell sunglasses", 0, 2, "h"], ["a velvet headband", 1, 2, ""]],
  },
  glam: {
    tops: [["corset top", 2, 3, ""], ["sequin cami", 3, 3, ""], ["draped satin blouse", 2, 3, ""], ["off-shoulder knit", 1, 2, "c"], ["lace bodysuit", 2, 3, ""], ["fitted baby tee", 0, 1, ""]],
    bottoms: [["high-waist flared trousers", 2, 3, ""], ["leather mini skirt", 2, 3, ""], ["satin slip skirt", 2, 3, ""], ["high-rise skinny jeans", 1, 2, ""], ["velour lounge set pants", 0, 0, ""]],
    dresses: [["bodycon midi dress", 2, 3, ""], ["sequin mini dress", 3, 3, ""], ["satin cowl-neck maxi", 3, 3, ""], ["one-shoulder midi dress", 2, 3, ""], ["flowy chiffon sundress", 0, 1, "h"]],
    shoes: [["strappy stilettos", 2, 3, ""], ["platform heels", 2, 3, ""], ["pointed knee-high boots", 2, 3, "c"], ["embellished flat sandals", 0, 1, "h"], ["fluffy slides", 0, 0, ""]],
    outer: [["faux-fur coat", 2, 3, "c"], ["cropped tweed jacket", 1, 3, ""], ["oversized blazer worn on the shoulders", 2, 3, ""]],
    bags: [["sparkly mini clutch", 3, 3, ""], ["chain-strap shoulder bag", 2, 3, ""], ["mini top-handle bag", 1, 2, ""]],
    extras: [["statement drop earrings", 2, 3, ""], ["a stack of gold bangles", 1, 3, ""], ["cat-eye sunglasses", 0, 2, "h"], ["a satin hair bow", 1, 2, ""]],
  },
  boho: {
    tops: [["embroidered peasant blouse", 1, 2, "h"], ["crochet top", 0, 2, "h"], ["chunky knit cardigan", 0, 2, "c"], ["ruffled-collar blouse", 2, 3, ""], ["soft linen tee", 0, 1, ""]],
    bottoms: [["tiered maxi skirt", 1, 3, ""], ["flared jeans", 1, 2, ""], ["linen palazzo pants", 0, 2, "h"], ["suede mini skirt", 1, 2, ""]],
    dresses: [["floral maxi dress", 1, 3, ""], ["broderie midi dress", 1, 2, "h"], ["kaftan dress", 0, 1, "h"], ["printed long-sleeve midi", 2, 3, "c"]],
    shoes: [["leather gladiator sandals", 0, 2, "h"], ["suede ankle boots", 1, 2, "c"], ["espadrille wedges", 1, 3, "h"], ["cowboy boots", 1, 2, ""], ["block-heel mules", 2, 3, ""]],
    outer: [["suede fringe jacket", 1, 2, ""], ["long knit duster", 0, 2, "c"], ["embroidered kimono", 0, 2, "h"]],
    bags: [["straw tote", 0, 1, "h"], ["fringe saddle bag", 1, 2, ""], ["beaded clutch", 2, 3, ""]],
    extras: [["layered turquoise jewelry", 0, 3, ""], ["a wide-brim hat", 0, 1, "h"], ["a braided headband", 0, 2, ""], ["stacked rings", 1, 3, ""]],
  },
  minimal: {
    tops: [["white tee", 0, 1, ""], ["black turtleneck", 1, 2, "c"], ["boxy cotton shirt", 1, 2, ""], ["square-neck bodysuit", 2, 3, ""], ["fine merino knit", 1, 2, "c"]],
    bottoms: [["straight-leg trousers", 1, 3, ""], ["column midi skirt", 2, 3, ""], ["relaxed jeans", 0, 2, ""], ["linen drawstring pants", 0, 1, "h"]],
    dresses: [["slip midi dress", 2, 3, ""], ["t-shirt maxi dress", 0, 1, "h"], ["sleeveless sheath dress", 2, 3, ""], ["sweater dress", 1, 2, "c"]],
    shoes: [["minimal leather sneakers", 0, 2, ""], ["square-toe flats", 1, 2, ""], ["sleek strappy sandals", 1, 3, "h"], ["heeled ankle boots", 2, 3, "c"], ["mule heels", 2, 3, ""]],
    outer: [["long wool coat", 1, 3, "c"], ["collarless blazer", 1, 3, ""], ["lightweight overshirt", 0, 1, ""]],
    bags: [["slouchy hobo bag", 0, 2, ""], ["clean-lined tote", 1, 2, ""], ["mini box clutch", 3, 3, ""]],
    extras: [["one delicate gold chain", 1, 3, ""], ["small sculptural earrings", 1, 3, ""], ["a claw clip", 0, 1, ""], ["sleek black sunglasses", 0, 2, "h"]],
  },
  modest: {
    tops: [["long flowy tunic", 0, 2, ""], ["high-neck pleated blouse", 2, 3, ""], ["oversized knit sweater", 0, 2, "c"], ["linen button-down", 1, 2, "h"], ["satin wrap top", 2, 3, ""]],
    bottoms: [["wide-leg trousers", 1, 3, ""], ["pleated maxi skirt", 1, 3, ""], ["denim maxi skirt", 0, 2, ""], ["relaxed culottes", 0, 2, "h"]],
    dresses: [["abaya-style maxi dress", 1, 3, ""], ["tiered maxi dress", 1, 2, ""], ["satin long-sleeve gown", 3, 3, ""], ["shirt maxi dress", 1, 2, "h"]],
    shoes: [["loafers", 1, 2, ""], ["clean white sneakers", 0, 2, ""], ["block heels", 2, 3, ""], ["leather ankle boots", 1, 2, "c"], ["flat sandals", 0, 1, "h"]],
    outer: [["longline blazer", 1, 3, ""], ["long belted coat", 1, 3, "c"], ["open kimono duster", 0, 2, "h"]],
    bags: [["structured tote", 1, 2, ""], ["chain crossbody", 1, 3, ""], ["embellished clutch", 3, 3, ""]],
    extras: [["a silk scarf (worn as hijab or at the neck)", 0, 3, ""], ["a statement belt", 1, 3, ""], ["gold cuff bracelet", 1, 3, ""], ["oversized sunglasses", 0, 2, "h"]],
  },
};

// Her seasonal palette: warm tan skin, hazel-green eyes and caramel hair read as "Warm Autumn".
export const PALETTE = {
  name: "Warm Autumn",
  why: "Warm golden skin, hazel-green eyes and caramel hair glow in rich, earthy, warm colors. That yellow top you love is exactly right.",
  neutrals: [["Cream", "#f1e3c6"], ["Camel", "#c19a6b"], ["Chocolate", "#5b3a29"], ["Warm taupe", "#8b7765"], ["Espresso", "#3b2a22"]],
  colors: [["Olive", "#708238"], ["Mustard", "#e1ad21"], ["Terracotta", "#c8553d"], ["Rust", "#b7410e"], ["Teal", "#1f7a7a"], ["Emerald", "#2e7d5b"], ["Burgundy", "#7b2d3b"], ["Coral", "#f08a5d"]],
  careful: [["Icy pastels", "#cfe3f5"], ["Neon", "#39ff14"], ["Optic white", "#ffffff"], ["Cool grey", "#9aa3ad"]],
};

export const STYLE_TIPS = [
  "Match your metals: gold jewelry flatters warm skin more than silver.",
  "Same color head to toe (in different shades) instantly looks expensive.",
  "Tuck the front of your top only (the 'French tuck') to define your waist.",
  "Roll your sleeves twice: it makes any shirt look styled, not just worn.",
  "One statement piece per outfit. Let it be the star.",
  "Your cap works with more than you think: try it with a trench coat.",
  "Swap sneakers for loafers and the same outfit goes from errands to brunch.",
  "A belt over a blazer or long cardigan gives you shape in seconds.",
  "Wear olive or teal near your face to make hazel-green eyes look greener.",
  "Nude shoes in your own skin tone make legs look longer.",
];

export const QUIZ = [
  { q: "Your dream Saturday?", a: [["Farmers market, then a long lunch", "classic"], ["Sneakers on, exploring the city", "sporty"], ["Getting ready for a big night out", "glam"], ["Beach, music and a sunset", "boho"]] },
  { q: "Pick a bag:", a: [["Structured leather top-handle", "classic"], ["Belt bag", "sporty"], ["Sparkly mini clutch", "glam"], ["Woven straw tote", "boho"]] },
  { q: "Your go-to shoes:", a: [["Loafers or ballet flats", "classic"], ["Chunky sneakers", "sporty"], ["Heels, always", "glam"], ["Sandals or boots", "boho"]] },
  { q: "Choose a color story:", a: [["Cream, camel and navy", "classic"], ["Black, white and one bold color", "sporty"], ["Gold, black and red", "glam"], ["Rust, olive and turquoise", "boho"]] },
  { q: "Which compliment do you love most?", a: [["\"You look so elegant\"", "classic"], ["\"You always look so cool\"", "sporty"], ["\"You're stunning!\"", "glam"], ["\"I love your vibe\"", "boho"]] },
];

export const AESTHETICS = {
  classic: { name: "Quiet Luxury", emoji: "🤍", text: "Timeless, polished and effortless. Think tailored trousers, cashmere, loafers and gold jewelry. You'd rather look expensive than trendy.", search: "quiet luxury outfit ideas women" },
  sporty:  { name: "Street Chic", emoji: "🧢", text: "Cool, comfy and always put together. Caps, sneakers, oversized layers and one sharp piece. Your style says confident and easygoing.", search: "street chic outfit ideas women" },
  glam:    { name: "Soft Glam", emoji: "💎", text: "You love a moment. Body-skimming shapes, satin, sparkle and a perfect heel. Dressing up is your favorite part of the night.", search: "soft glam outfit ideas" },
  boho:    { name: "Sun-Kissed Boho", emoji: "🌻", text: "Free-spirited and warm. Flowing maxis, crochet, earthy colors and layered jewelry. You dress for the feeling, not the rules.", search: "boho chic outfit ideas" },
};

// ---------- Beauty ----------

export const UNDERTONES = [
  { id: "warm", label: "Warm" }, { id: "neutral", label: "Neutral" }, { id: "cool", label: "Cool" },
];
export const EYES = [
  { id: "hazel", label: "Hazel-green" }, { id: "brown", label: "Brown" }, { id: "green", label: "Green" }, { id: "blue", label: "Blue" },
];
export const SKIN = [
  { id: "light", label: "Light" }, { id: "medium", label: "Medium / tan" }, { id: "deep", label: "Deep" },
];

// Shades that suit each feature. Each entry is [name, swatch].
export const SHADES = {
  shadow: {
    hazel: [["Plum", "#6b3a5a"], ["Bronze", "#9c6a3c"], ["Copper", "#b8632e"], ["Golden olive", "#8a8040"]],
    brown: [["Gold", "#c9a227"], ["Navy", "#26345f"], ["Bronze", "#9c6a3c"], ["Emerald", "#2e7d5b"]],
    green: [["Plum", "#6b3a5a"], ["Burgundy", "#7b2d3b"], ["Rose gold", "#c58b7a"], ["Mauve", "#9b6b80"]],
    blue:  [["Copper", "#b8632e"], ["Peach", "#f0a881"], ["Terracotta", "#c8553d"], ["Champagne", "#e6cfa3"]],
  },
  blush: {
    warm: [["Peach", "#f4a17d"], ["Apricot", "#f2a56b"], ["Terracotta", "#c8664e"]],
    neutral: [["Dusty rose", "#cc8a8a"], ["Soft coral", "#ef8f7a"]],
    cool: [["Rose pink", "#e48aa0"], ["Berry", "#a83b5b"]],
  },
  lip: {
    warm: [["Caramel nude", "#b5735a"], ["Brick red", "#9e3b2a"], ["Coral", "#e0694f"], ["Warm rose", "#b8625e"]],
    neutral: [["Rosewood", "#a65e5e"], ["Nude pink", "#c98a83"], ["True red", "#b3202b"]],
    cool: [["Mauve", "#a26a80"], ["Berry", "#8a2d4f"], ["Blue-red", "#a3132c"]],
  },
  highlight: { warm: ["Gold", "#e6c27a"], neutral: ["Champagne", "#ead3a8"], cool: ["Pearl pink", "#f0d6dc"] },
  bronzer: { light: ["Soft taupe bronze", "#b58c6c"], medium: ["Warm bronze", "#9a6440"], deep: ["Rich mahogany", "#6b3a22"] },
};

// Steps use {shadow1}, {shadow2}, {blush}, {lip}, {highlight} and {bronzer},
// which are filled in from her features.
export const LOOKS = [
  { id: "everyday", name: "Everyday fresh", emoji: "🌤️", mins: 10, steps: [
    ["Prep", "Moisturizer and SPF. Let it sink in for a minute."],
    ["Skin", "Skin tint or light foundation, only where you need it. Blend with fingers."],
    ["Conceal", "A little concealer under the eyes and around the nose."],
    ["Brows", "Brush brows up with clear or tinted gel."],
    ["Eyes", "Sweep {shadow2} across the lid with your finger, then one coat of mascara."],
    ["Cheeks", "{blush} blush on the apples, blended up toward your temples."],
    ["Lips", "Tinted balm in {lip}."],
  ]},
  { id: "nomakeup", name: "No-makeup makeup", emoji: "🫧", mins: 7, steps: [
    ["Prep", "Hydrating serum and moisturizer for a dewy base."],
    ["Skin", "Concealer only where needed. Tap it in so skin still looks like skin."],
    ["Brows", "Fluff brows up with soap or gel."],
    ["Lashes", "Curl lashes and add one coat of brown mascara."],
    ["Glow", "Cream {blush} blush and a dab of balm on the cheekbones."],
    ["Lips", "Lip oil or balm."],
  ]},
  { id: "office", name: "Office polished", emoji: "💼", mins: 15, steps: [
    ["Prep", "Moisturizer, SPF and a mattifying primer on the T-zone."],
    ["Skin", "Medium-coverage foundation, set with powder on the T-zone."],
    ["Brows", "Fill gaps with pencil and set with gel."],
    ["Eyes", "{shadow2} on the lid, {shadow1} softly in the crease. Tightline the upper lash line."],
    ["Lashes", "Two coats of mascara."],
    ["Sculpt", "A light sweep of {bronzer} under the cheekbones."],
    ["Cheeks", "{blush} blush."],
    ["Lips", "{lip} satin lipstick, blotted once."],
  ]},
  { id: "date", name: "Date night", emoji: "💘", mins: 25, steps: [
    ["Prep", "Hydrating primer for a soft-focus glow."],
    ["Skin", "Radiant foundation. Conceal and brighten under the eyes."],
    ["Brows", "Define the brows a little more than daytime."],
    ["Eyes", "{shadow1} in the crease and outer corner, {shadow2} on the lid. It makes your eyes pop."],
    ["Liner", "Your signature winged liner. Keep the wing soft and smudge it slightly."],
    ["Lashes", "Two coats of black mascara, or a few individual lashes on the outer corners."],
    ["Sculpt", "{bronzer} under the cheekbones and along the hairline."],
    ["Glow", "{highlight} highlighter on the top of the cheekbones and the inner corners of your eyes."],
    ["Cheeks", "{blush} blush."],
    ["Lips", "Line slightly over your lip line, then fill in with {lip}. Add a touch of gloss in the center."],
  ]},
  { id: "party", name: "Party glam", emoji: "🪩", mins: 35, steps: [
    ["Prep", "Gripping primer so it lasts all night."],
    ["Skin", "Full-coverage foundation. Bake under the eyes with powder."],
    ["Brows", "Sculpted, laminated-look brows with gel."],
    ["Eyes", "Smoky outer V with {shadow1}, a shimmery {shadow2} on the lid, and glitter in the center."],
    ["Liner", "Sharp winged liner, plus kohl in the waterline."],
    ["Lashes", "Full strip lashes and mascara."],
    ["Sculpt", "Contour and {bronzer} for snatched cheekbones."],
    ["Glow", "Lots of {highlight} highlighter on the cheekbones, nose tip and collarbones."],
    ["Lips", "Bold {lip} lipstick, then setting spray on the face."],
  ]},
  { id: "wedding", name: "Wedding guest", emoji: "💍", mins: 30, steps: [
    ["Prep", "Long-wear primer, plus eye primer so the shadow won't crease."],
    ["Skin", "Long-wear foundation, set lightly with powder."],
    ["Brows", "Soft, defined brows."],
    ["Eyes", "Blend {shadow2} all over the lid with {shadow1} in the crease. Keep it soft and romantic."],
    ["Liner", "A thin flick of liner."],
    ["Lashes", "Waterproof mascara (happy tears happen!)."],
    ["Glow", "Subtle {highlight} highlighter on the cheekbones."],
    ["Cheeks", "{blush} blush."],
    ["Lips", "{lip} long-wear lipstick. Pack it in your bag for touch-ups."],
    ["Set", "Setting spray for the photos and the dancing."],
  ]},
  { id: "eid", name: "Eid glam", emoji: "🌙", mins: 30, steps: [
    ["Prep", "Hydrating primer and moisturizer for a luminous base."],
    ["Skin", "Glowy foundation, set lightly."],
    ["Brows", "Full, defined brows."],
    ["Eyes", "Golden halo eye: {shadow1} on the outer and inner thirds, shimmery gold in the center of the lid."],
    ["Liner", "Kohl in the waterline and a winged liner."],
    ["Lashes", "Fluffy lashes on the outer corners."],
    ["Glow", "{highlight} highlighter on the cheekbones and inner corners."],
    ["Cheeks", "{blush} blush."],
    ["Lips", "{lip} lipstick with a touch of gloss."],
  ]},
];

// Winged liner tips by eye shape.
export const EYE_SHAPES = {
  almond: { label: "Almond", tip: "Lucky you: almost any wing works. Follow your lower lash line up toward the end of your brow, then connect to the middle of the lid." },
  hooded: { label: "Hooded", tip: "Draw the wing with your eyes open, looking straight ahead, so it doesn't fold. Try a 'bat wing' that looks right when the eye is open." },
  round: { label: "Round", tip: "Keep the line thin in the inner corner and thicker at the outer third. Pull the wing out horizontally to elongate your eyes." },
  monolid: { label: "Monolid", tip: "Go a little thicker so the liner shows when your eyes are open. A graphic, floating line looks amazing." },
  downturned: { label: "Downturned", tip: "Angle the wing up steeply and skip lining the outer lower lash line, so it lifts the eye." },
  upturned: { label: "Upturned", tip: "Keep the wing straighter and add a little liner on the outer lower lash line to balance it." },
};

export const UNDERTONE_QUIZ = [
  { q: "The veins on your inner wrist look…", a: [["Green or olive", "warm"], ["A mix / hard to tell", "neutral"], ["Blue or purple", "cool"]] },
  { q: "Which jewelry makes your skin glow?", a: [["Gold", "warm"], ["Both look good", "neutral"], ["Silver", "cool"]] },
  { q: "In the sun, you usually…", a: [["Tan easily and turn golden", "warm"], ["Tan a little, sometimes burn", "neutral"], ["Burn first, then maybe tan", "cool"]] },
];

export const BEAUTY_TIPS = [
  "Spray your brush with setting spray before applying shimmer shadow: the color doubles.",
  "Hazel eyes look greener with plum and burgundy, more golden with bronze.",
  "Put blush higher and blend it toward your temples for an instant lift.",
  "Use a piece of tape as a guide for a perfectly sharp winged liner.",
  "Line your lips with a liner close to your natural lip color for a fuller look.",
  "Tap concealer in with your ring finger. It's the gentlest finger.",
  "A dot of highlighter in the inner eye corners makes you look awake.",
  "Mix a drop of foundation with your moisturizer on lazy days.",
  "Curl lashes before mascara, never after.",
  "Set only where you get shiny. The rest of your face can stay dewy.",
];

// ---------- Hair ----------

export const HAIR_LENGTHS = [
  { id: "short", label: "Short" }, { id: "medium", label: "Medium" }, { id: "long", label: "Long" },
];

// Hairstyles: lengths they work for, occasions (f = formality 0..3), time and steps.
export const HAIRSTYLES = [
  { id: "sleek-bun", name: "Sleek low bun", emoji: "🪮", lengths: ["medium", "long"], f: [1, 3], mins: 5,
    vibe: "Clean, chic and effortless. The model-off-duty classic.",
    steps: ["Brush hair back with a boar-bristle brush and a little gel at the roots.", "Gather at the nape and twist into a bun.", "Secure with a hair tie and pins, then smooth flyaways with hairspray on a toothbrush."] },
  { id: "claw-clip", name: "Claw clip twist", emoji: "🦀", lengths: ["medium", "long"], f: [0, 1], mins: 1,
    vibe: "The easiest cute hairstyle there is.",
    steps: ["Gather hair at the back and twist upward.", "Fold the twist up against your head.", "Clip it in place and pull out two face-framing strands."] },
  { id: "cap-waves", name: "Cap + loose waves", emoji: "🧢", lengths: ["medium", "long"], f: [0, 1], mins: 8,
    vibe: "Your signature. Soft waves under your black cap.",
    steps: ["Spray a heat protectant and wave the ends only with a wand.", "Rake through with fingers and add texture spray.", "Put the cap on slightly back so the face-framing pieces show."] },
  { id: "slick-pony", name: "Slick high ponytail", emoji: "🐎", lengths: ["medium", "long"], f: [1, 3], mins: 6,
    vibe: "Snatched and glamorous. Lifts the whole face.",
    steps: ["Flip your head upside down and brush hair up to the crown.", "Secure tightly with a strong elastic.", "Wrap a strand of hair around the elastic and pin. Smooth edges with gel."] },
  { id: "hollywood", name: "Old Hollywood waves", emoji: "🎞️", lengths: ["medium", "long"], f: [2, 3], mins: 25,
    vibe: "Red-carpet glamour, perfect for weddings and parties.",
    steps: ["Make a deep side part and curl 1-inch sections all in the same direction.", "Clip each curl up while it cools.", "Brush out gently with a paddle brush and set with shine spray."] },
  { id: "half-up", name: "Half-up with a bow", emoji: "🎀", lengths: ["medium", "long"], f: [1, 2], mins: 4,
    vibe: "Sweet and romantic. Date-night approved.",
    steps: ["Take the top half of your hair and tie it at the crown.", "Tie a satin ribbon or bow over the elastic.", "Loosen a few pieces around the face."] },
  { id: "braids", name: "Boxer braids", emoji: "🧵", lengths: ["medium", "long"], f: [0, 1], mins: 10,
    vibe: "Sporty, keeps hair off your face all day.",
    steps: ["Part hair down the middle.", "Dutch braid each side (cross the strands under, not over).", "Tie the ends and gently pull the braids apart for volume."] },
  { id: "beach", name: "Beach waves", emoji: "🌊", lengths: ["short", "medium", "long"], f: [0, 2], mins: 7,
    vibe: "Undone, tousled, sun-kissed.",
    steps: ["Mist damp hair with sea-salt spray.", "Twist sections away from your face and let them air dry (or diffuse).", "Shake out with fingers and finish with a drop of hair oil on the ends."] },
  { id: "bob-tuck", name: "Tucked-behind-the-ear bob", emoji: "💇", lengths: ["short"], f: [1, 3], mins: 5,
    vibe: "Sharp and French-girl chic.",
    steps: ["Blow-dry with a round brush, ends slightly under.", "Tuck one side behind your ear.", "Add statement earrings on the tucked side."] },
  { id: "pixie-texture", name: "Textured pixie", emoji: "✂️", lengths: ["short"], f: [0, 3], mins: 3,
    vibe: "Bold and low maintenance.",
    steps: ["Rub a pea-sized bit of paste between your palms.", "Push hair up and forward at the crown.", "Define a few pieces at the front."] },
  { id: "bubble", name: "Bubble ponytail", emoji: "🫧", lengths: ["long"], f: [0, 2], mins: 5,
    vibe: "Playful and fun for brunch or a night out.",
    steps: ["Make a low or mid ponytail.", "Add elastics every 2 inches down the length.", "Gently pull each section apart into a 'bubble'."] },
  { id: "headscarf", name: "Silk scarf wrap", emoji: "🧣", lengths: ["short", "medium", "long"], f: [0, 3], mins: 3,
    vibe: "Elegant, modest-friendly and great on a bad hair day.",
    steps: ["Put hair in a low bun.", "Fold a square silk scarf into a triangle and place it over your head.", "Tie at the nape, then tuck or let the ends hang."] },
];

export const HAIR_CARE = [
  "Sleep on a silk pillowcase: fewer tangles, smoother hair and less frizz.",
  "Apply conditioner mid-length to ends only. Roots don't need it.",
  "Rinse with cool water at the end to seal the cuticle and add shine.",
  "Hair oil on damp ends before drying keeps balayage from looking dry.",
  "A purple shampoo once a week keeps blonde highlights bright.",
  "Dry with a microfiber towel or a cotton T-shirt, never rub with a regular towel.",
  "Heat-protect every single time you use a wand, flat iron or hot brush.",
];

// ---------- Nails ----------

export const NAIL_SHAPES = [
  { id: "almond", label: "Almond", tip: "Elongates the fingers and suits almost everyone. Elegant and strong." },
  { id: "square", label: "Square", tip: "Clean and modern. Best on long nail beds; keep the corners softened so they don't snag." },
  { id: "oval", label: "Oval", tip: "Soft and classic. Great for a natural, low-maintenance look." },
  { id: "coffin", label: "Coffin", tip: "Dramatic and glam. Needs some length or an extension." },
  { id: "squoval", label: "Squoval", tip: "Square with rounded edges: the easy, flattering everyday shape." },
];

// Shades in her Warm Autumn palette.
export const NAIL_SHADES = [
  ["Milky nude", "#e8cdb8"], ["Toffee", "#b57f5b"], ["Terracotta", "#c8553d"], ["Burnt orange", "#cc5500"],
  ["Mustard", "#e1ad21"], ["Olive", "#708238"], ["Deep teal", "#1f6f6f"], ["Burgundy", "#6e1f33"],
  ["Chocolate", "#4a2c23"], ["Coral", "#f08a5d"], ["Gold chrome", "#d4af37"], ["Sheer peach", "#f6cdb6"],
];

// Nail looks by occasion formality.
export const NAIL_LOOKS = [
  { name: "Glazed donut", emoji: "🍩", f: [0, 3], shade: "Milky nude", how: "Sheer milky base, then rub pearl chrome powder on top and seal with top coat.", search: "glazed donut nails" },
  { name: "Clean girl French", emoji: "🤍", f: [1, 3], shade: "Sheer peach", how: "Sheer pink base and a micro French tip in soft white or chocolate.", search: "micro french nails" },
  { name: "Chocolate glazed", emoji: "🍫", f: [1, 3], shade: "Chocolate", how: "Rich brown with a gold chrome shimmer. Perfect for autumn and evenings.", search: "chocolate chrome nails" },
  { name: "Terracotta solid", emoji: "🧱", f: [0, 2], shade: "Terracotta", how: "Two coats of terracotta. Warm, earthy and goes with everything you own.", search: "terracotta nails" },
  { name: "Gold tips", emoji: "✨", f: [2, 3], shade: "Gold chrome", how: "Nude base with gold foil or chrome just on the tips.", search: "gold tip nails" },
  { name: "Aura nails", emoji: "🌅", f: [1, 3], shade: "Coral", how: "A soft airbrushed glow of coral in the center of each nail fading to nude.", search: "aura nails coral" },
  { name: "Olive matte", emoji: "🫒", f: [0, 2], shade: "Olive", how: "Olive polish with a matte top coat. Cool, unexpected and great with gold rings.", search: "olive green matte nails" },
  { name: "Burgundy velvet", emoji: "🍷", f: [2, 3], shade: "Burgundy", how: "Magnetic 'cat eye' polish in burgundy for a velvet shimmer.", search: "burgundy velvet cat eye nails" },
  { name: "Tortoiseshell", emoji: "🐢", f: [1, 3], shade: "Toffee", how: "Amber base with dabbed chocolate and black spots blended under a jelly top coat.", search: "tortoiseshell nails" },
  { name: "Minimal dots", emoji: "⚪", f: [0, 2], shade: "Milky nude", how: "Sheer nude with one tiny chocolate or gold dot at the base of each nail.", search: "minimalist dot nails" },
];

export const NAIL_TIPS = [
  "Cuticle oil every night. It's the secret to nails that look salon-fresh for two weeks.",
  "Wrap the tip of the nail with every coat of polish to stop chipping.",
  "Thin coats, always. Three thin beats one thick.",
  "File in one direction only; sawing back and forth weakens the nail.",
  "Warm-toned nudes (peach, toffee, caramel) flatter your golden skin more than pink nudes.",
  "Gloves for dishes and cleaning. Water is the enemy of a long manicure.",
];

// Hair advice by face shape (filled in by the beauty scan).
export const FACE_SHAPES = {
  oval: { label: "Oval", tip: "The most balanced shape: almost every cut works. Try curtain bangs, long layers or a sleek bob.", hair: ["cap-waves", "sleek-bun", "hollywood"] },
  round: { label: "Round", tip: "Add height and length: long layers, a high ponytail, side-swept bangs. Avoid chin-length blunt cuts.", hair: ["slick-pony", "beach", "half-up"] },
  square: { label: "Square", tip: "Soften the jaw with waves, wispy layers and side parts. Long layers past the chin look amazing.", hair: ["beach", "hollywood", "cap-waves"] },
  heart: { label: "Heart", tip: "Balance a wider forehead with chin-length volume, curtain bangs and side-swept styles.", hair: ["bob-tuck", "beach", "half-up"] },
  oblong: { label: "Oblong", tip: "Add width: waves, bangs and shoulder-length cuts. Avoid very long, flat styles.", hair: ["beach", "bob-tuck", "claw-clip"] },
  triangle: { label: "Triangle", tip: "Add volume at the top: layers around the eyes and cheekbones, textured crowns, side-swept bangs.", hair: ["half-up", "beach", "pixie-texture"] },
};
