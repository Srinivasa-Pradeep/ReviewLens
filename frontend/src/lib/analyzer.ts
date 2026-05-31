// We will use standard RegExp

export const MOCK_TEMPLATES: Record<string, any> = {
  wearable: {
    summary: "Reviewers of {product_name} are generally pleased with its fitness tracking capabilities and modern design. The AMOLED screen is bright, and notifications are reliable. However, the heart-rate sensor occasionally lags during high-intensity training, and the proprietary charger is easy to misplace.",
    pros: [
      { term: "Heart Rate Tracking", count: 22, percentage: 82.0 },
      { term: "Vibrant AMOLED Display", count: 18, percentage: 75.0 },
      { term: "Activity Goals Setup", count: 14, percentage: 60.0 },
      { term: "Sleek Straps Style", count: 11, percentage: 45.0 }
    ],
    cons: [
      { term: "Heart-Rate Sensor Lag", count: 16, percentage: 52.0 },
      { term: "Proprietary Charging Cable", count: 12, percentage: 40.0 },
      { term: "Sleep Analysis Glitches", count: 8, percentage: 28.0 }
    ],
    thematic: [
      { category: "Value for Money", score: 4.1 },
      { category: "Build Quality", score: 4.5 },
      { category: "Ease of Use", score: 3.8 },
      { category: "Reliability", score: 4.0 }
    ],
    comparison: "Compared to similar fitness trackers, the {product_name} excels in screen brightness but the companion app is slightly less refined than leading competitors.",
    highlights: [
      { category: "Display", quote: "The display is absolutely gorgeous, even under direct sunlight during outdoor runs.", sentiment: "Positive" },
      { category: "Battery", quote: "Battery lasts about 4 days, which is decent but I expected more.", sentiment: "Neutral" },
      { category: "Connectivity", quote: "Keeps disconnecting from my phone every couple of days. Annoying to resync.", sentiment: "Negative" }
    ],
    complaints: [
      { issue: "Sleep Tracking Accuracy Failures", impact_score: 7, volume: 14, severity: "Medium", root_cause: "Glitches in motion sensor algorithm when user is restless." },
      { issue: "Heart Rate Sync Latency", impact_score: 8, volume: 19, severity: "High", root_cause: "Suboptimal PPG sensor frequency during active workout modes." },
      { issue: "Proprietary Charger Easy to Lose", impact_score: 5, volume: 12, severity: "Low", root_cause: "Non-standard magnetic pin connection instead of USB-C." }
    ],
    timeline: [
      { stage_or_time: "Day 1 (Unboxing)", issue: "Stiff silicone band", diagnostic: "Matte silicone requires a few days of wear to become flexible and comfortable." },
      { stage_or_time: "Week 2", issue: "Heart-rate spikes during runs", diagnostic: "Sensor loses tight wrist contact due to strap sliding with sweat." },
      { stage_or_time: "Month 3", issue: "Magnetic pins charging connection weakens", diagnostic: "Sweat residue corrodes copper pins on the back of the watch face." }
    ],
    requests: [
      { feature: "Standard USB-C Charging Port", count: 18, sample_quote: "Please just let me charge it with my phone cable instead of carrying this custom dock." },
      { feature: "More Custom Watch Face Layouts", count: 11, sample_quote: "The default faces are boring. Need more widgets for weather and active calories." }
    ],
    clusters: [
      { category: "Product Quality", issue: "PPG sensor cover scratches", frequency: 9 },
      { category: "User Experience", issue: "App pairing sync drops", frequency: 15 },
      { category: "Delivery", issue: "Delivered in damaged box", frequency: 4 },
      { category: "Customer Service", issue: "Support takes days to email back", frequency: 5 },
      { category: "Pricing", issue: "Accessory bands are overpriced", frequency: 8 }
    ],
    fixes: [
      "Deploy firmware update 1.2 to optimize PPG sensor polling rate.",
      "Redesign buckle style to prevent watch slippage during high-movement activities."
    ],
    improvements: [
      "Provide alternative fabric strap in the basic retail packaging box.",
      "Redesign companion app homepage for quicker syncing response."
    ],
    roadmap: [
      "Research scratch-resistant sapphire glass options for watch screen cover.",
      "Build standard Qi wireless charging support into future editions."
    ],
    gaps: [
      "Our step accuracy matches leading brands, but we lack standard smart-assistant voice commands.",
      "Product excels at screen refresh rates compared to cheap trackers."
    ]
  },
  kitchen: {
    summary: "Reviews for {product_name} emphasize its ease of use and consistent results. Coffee/meals are prepared quickly and maintain excellent temperature. However, the cleaning process is tedious due to non-removable base plates, and the steam valve is noisy.",
    pros: [
      { term: "Consistent Temperature", count: 25, percentage: 85.0 },
      { term: "Fast Brew/Cook Time", count: 20, percentage: 78.0 },
      { term: "Compact Desk Footprint", count: 15, percentage: 62.0 },
      { term: "Premium Stainless Finish", count: 10, percentage: 42.0 }
    ],
    cons: [
      { term: "Difficult to Deep Clean", count: 18, percentage: 50.0 },
      { term: "Loud Steaming / Valve noise", count: 12, percentage: 35.0 },
      { term: "Short Power Cord Length", count: 9, percentage: 25.0 }
    ],
    thematic: [
      { category: "Value for Money", score: 4.3 },
      { category: "Build Quality", score: 4.2 },
      { category: "Ease of Use", score: 4.6 },
      { category: "Reliability", score: 4.4 }
    ],
    comparison: "The {product_name} heats faster than traditional heating pots, but lacks the granular temperature controls found in professional barista tools.",
    highlights: [
      { category: "Speed", quote: "Heats up water in under 90 seconds. Absolute lifesaver for busy mornings.", sentiment: "Positive" },
      { category: "Design", quote: "The stainless steel look fits nicely on my kitchen counter.", sentiment: "Positive" },
      { category: "Cleaning", quote: "Getting coffee grounds out of the inner rim is almost impossible without a brush.", sentiment: "Negative" }
    ],
    complaints: [
      { issue: "Cleaning Grounds / Food Residue Build-up", impact_score: 8, volume: 18, severity: "High", root_cause: "Non-removable inner basket leaves small crevices where moisture gathers." },
      { issue: "Steam Valve Screeching Noise", impact_score: 6, volume: 12, severity: "Medium", root_cause: "High pressure release through a narrow metal gasket." },
      { issue: "Power Cord Does Not Reach Outlets", impact_score: 4, volume: 9, severity: "Low", root_cause: "Safety regulation compliance limits cord length to under 3 feet."}
    ],
    timeline: [
      { stage_or_time: "Day 1 (Unboxing)", issue: "Plastic taste in first brew", diagnostic: "Manufacturing sealants require at least 2 full flush cycles to wash out entirely." },
      { stage_or_time: "Week 2", issue: "Lid lock mechanism stiffens", diagnostic: "Heat expansion of plastic latch causes friction during closure." },
      { stage_or_time: "Month 3", issue: "Scaling visible on bottom plate", diagnostic: "Mineral deposits from tap water build up on the steel heating element." }
    ],
    requests: [
      { feature: "Removable Dishwasher-Safe Inner pot", count: 22, sample_quote: "Washing this by hand under the sink without getting the plug wet is stressful." },
      { feature: "Variable Temperature Selection Dial", count: 14, sample_quote: "I want to set it specifically to 195 degrees for pour-overs instead of just boil."}
    ],
    clusters: [
      { category: "Product Quality", issue: "Inner coating wears off", frequency: 7 },
      { category: "User Experience", issue: "Control panel buttons stick", frequency: 8 },
      { category: "Delivery", issue: "Box arrived dented", frequency: 5 },
      { category: "Customer Service", issue: "Helpful support replaced unit", frequency: 12 },
      { category: "Pricing", issue: "Fair value for quality", frequency: 15 }
    ],
    fixes: [
      "Redesign lid seal with heat-resistant food-grade silicone.",
      "Include a custom cleaning brush with all future shipments."
    ],
    improvements: [
      "Increase power cable length from 30 inches to 45 inches.",
      "Add rubber dampeners to the steam exhaust pipe to deaden sound."
    ],
    roadmap: [
      "Integrate smart phone controls to schedule water heating in the morning.",
      "Explore dual-chamber designs for brewing multiple items simultaneously."
    ],
    gaps: [
      "Our unit is 30% faster than standard pots, which is our core competitive advantage.",
      "Unlike competitors, we do not offer preset selections for green or black teas."
    ]
  },
  apparel: {
    summary: "Reviewers find the {product_name} highly comfortable and stylish for everyday wear. The fabric/material feels soft and holds up well in standard weather. However, the sizing runs noticeably small, and the stitching around the seams feels thin.",
    pros: [
      { term: "Exceptional Cushion/Comfort", count: 30, percentage: 88.0 },
      { term: "Modern Style Aesthetics", count: 24, percentage: 80.0 },
      { term: "Breathable Lightweight Feel", count: 18, percentage: 65.0 },
      { term: "Flexible Sole / Fabric", count: 14, percentage: 50.0 }
    ],
    cons: [
      { term: "Sizing Runs Small/Narrow", count: 22, percentage: 58.0 },
      { term: "Stitching Pulls Out Easily", count: 14, percentage: 38.0 },
      { term: "Lacks Arch Support", count: 10, percentage: 28.0 }
    ],
    thematic: [
      { category: "Value for Money", score: 3.9 },
      { category: "Build Quality", score: 3.5 },
      { category: "Ease of Use", score: 4.8 },
      { category: "Reliability", score: 3.7 }
    ],
    comparison: "While more comfortable than traditional structured products, the {product_name} has lower durability for active trail use or heavy washing cycles.",
    highlights: [
      { category: "Comfort", quote: "Feels like walking on clouds. Excellent memory foam/fabric softness.", sentiment: "Positive" },
      { category: "Sizing", quote: "Order at least a half size up. They run very narrow in the toe box.", sentiment: "Negative" },
      { category: "Quality", quote: "Stitching near the cuff started unraveling after my second run.", sentiment: "Negative" }
    ],
    complaints: [
      { issue: "Sizing Inconsistencies / Runs Small", impact_score: 8, volume: 22, severity: "High", root_cause: "Narrow foot molds used during factory lasting process." },
      { issue: "Weak Stitching at High-Stress Joints", impact_score: 7, volume: 14, severity: "Medium", root_cause: "Single-thread chain stitch used instead of lockstitch construction." },
      { issue: "Heel Slippage during Wear", impact_score: 5, volume: 10, severity: "Medium", root_cause: "Shallow heel cup design does not lock the foot in place." }
    ],
    timeline: [
      { stage_or_time: "Day 1 (Unboxing)", issue: "Stiff heel collar scrapes ankle", diagnostic: "The rigid synthetic lining rubs against the skin until broken in." },
      { stage_or_time: "Week 2", issue: "Insole slides forward", diagnostic: "Adhesive backing is weak and fails when exposed to warmth/moisture." },
      { stage_or_time: "Month 3", issue: "Fabric/Sole wearing flat", diagnostic: "Low-density EVA foam compresses permanently after 100 miles of walking." }
    ],
    requests: [
      { feature: "Offer Wide-Width (EE) Options", count: 26, sample_quote: "I love the style but my toes are completely squished. Please sell wide versions." },
      { feature: "Removable Insole for Orthotics", count: 12, sample_quote: "The glued-in insole is hard to pull out without tearing the base shoe material." }
    ],
    clusters: [
      { category: "Product Quality", issue: "Thread runs on outer seams", frequency: 14 },
      { category: "User Experience", issue: "Narrow toe box pressure points", frequency: 22 },
      { category: "Delivery", issue: "Fast shipping but package torn", frequency: 6 },
      { category: "Customer Service", issue: "Free exchanges was smooth", frequency: 18 },
      { category: "Pricing", issue: "Slightly expensive for durability", frequency: 11 }
    ],
    fixes: [
      "Update online sizing chart to explicitly recommend buying one size larger.",
      "Reinforce heel cuff collar padding with soft microfiber linings."
    ],
    improvements: [
      "Implement double-stitching along the high-pressure side seams.",
      "Upgrade insole adhesive to water-resistant bonding agents."
    ],
    roadmap: [
      "Evaluate recycled ocean plastic yarn constructs for the next edition.",
      "Partner with orthopedic designers to engineer custom high-arch support bases."
    ],
    gaps: [
      "Our cushioning outclasses competitors by 15%, but we lag in water-resistance capabilities.",
      "Competitors offer custom colorways which our product catalog currently lacks."
    ]
  },
  display: {
    summary: "Reviewers are highly impressed with the {product_name}'s vibrant colors, sharp resolution, and high refresh rate. The panel offers excellent viewing angles and thin bezels. However, many note noticeable backlight bleed in dark rooms and a slightly wobbly stand.",
    pros: [
      { term: "Vibrant Color Accuracy", count: 26, percentage: 86.0 },
      { term: "Smooth High Refresh Rate", count: 20, percentage: 78.0 },
      { term: "Ultra-Thin Bezels", count: 15, percentage: 65.0 },
      { term: "Excellent 4K Resolution", count: 11, percentage: 50.0 }
    ],
    cons: [
      { term: "Backlight Bleed in Corners", count: 18, percentage: 48.0 },
      { term: "Wobbly Screen Stand", count: 12, percentage: 35.0 },
      { term: "Tinny Audio Output", count: 8, percentage: 25.0 }
    ],
    thematic: [
      { category: "Value for Money", score: 4.3 },
      { category: "Build Quality", score: 3.9 },
      { category: "Ease of Use", score: 4.5 },
      { category: "Reliability", score: 4.1 }
    ],
    comparison: "Compared to standard office displays, the {product_name} provides superior color space coverage (99% sRGB) and gaming response times, though the stand lacks height adjustments found in professional monitors.",
    highlights: [
      { category: "Panel", quote: "The IPS panel is gorgeous. Colors are rich and deep, making games and videos look fantastic.", sentiment: "Positive" },
      { category: "Bleed", quote: "Noticeable IPS glow and backlight bleeding along the bottom edge when displaying dark scenes.", sentiment: "Negative" },
      { category: "Speakers", quote: "Built-in speakers are very weak and lack bass, but fine for system sounds.", sentiment: "Neutral" }
    ],
    complaints: [
      { issue: "Backlight Bleeding & IPS Glow", impact_score: 7, volume: 15, severity: "Medium", root_cause: "Uneven pressure along the display bezel during casing assembly." },
      { issue: "Unstable & Wobbly Base Stand", impact_score: 6, volume: 12, severity: "Low", root_cause: "Small footprint mounting bracket without sufficient counterweight." },
      { issue: "HDR Mode Washing Out Colors", impact_score: 8, volume: 9, severity: "High", root_cause: "Low peak brightness of 300 nits failing to meet true HDR standards." }
    ],
    timeline: [
      { stage_or_time: "Day 1 (Setup)", issue: "Unstable mounting base", diagnostic: "Mounted the stand and plugged it in. The thin bezels look gorgeous on my desk." },
      { stage_or_time: "Week 2", issue: "Dead pixels panel scan", diagnostic: "Noticed a dead pixel near the top right corner. Very distracting on white screens." },
      { stage_or_time: "Month 3", issue: "Auto-input source failure", diagnostic: "Auto-input source switching sometimes fails and requires manual power cycles." }
    ],
    requests: [
      { feature: "Fully Adjustable Ergonomic Stand", count: 22, sample_quote: "Please make the stand height-adjustable and support vertical pivot." },
      { feature: "Include a DisplayPort Cable", count: 14, sample_quote: "It only came with an HDMI cable, had to buy a DisplayPort cable to get full refresh rates." }
    ],
    clusters: [
      { category: "Product Quality", issue: "Dead pixels on panel", frequency: 9 },
      { category: "User Experience", issue: "On-screen menu buttons hard to reach", frequency: 12 },
      { category: "Delivery", issue: "Box arrived damaged but screen was intact", frequency: 5 },
      { category: "Customer Service", issue: "Support replaced wobbly unit with no questions", frequency: 14 },
      { category: "Pricing", issue: "Best value high refresh rate screen", frequency: 20 }
    ],
    fixes: [
      "Tighten factory quality control tolerances for dead pixel inspections.",
      "Redesign base attachment bracket with reinforced steel screws to increase stability."
    ],
    improvements: [
      "Upgrade display backlight diffuse sheet to reduce localized bleed.",
      "Bundle high-speed DisplayPort cables in the box instead of standard HDMI."
    ],
    roadmap: [
      "Develop a model with integrated USB-C hub supporting 65W power delivery for laptops.",
      "Increase maximum panel peak brightness to 600 nits for HDR support."
    ],
    gaps: [
      "Our refresh rate is 144Hz which beats standard 60Hz panels, but we lack built-in webcam modules.",
      "Competitors feature integrated KVM switches which our model currently lacks."
    ]
  },
  keyboard: {
    summary: "Reviewers of {product_name} are highly satisfied with its typing comfort, tactile switch feedback, and sleek layout. The wireless connectivity is responsive with low latency. However, some complain about key stabilizer rattle on the spacebar and the lack of shine-through keycaps.",
    pros: [
      { term: "Tactile Switch Feedback", count: 25, percentage: 85.0 },
      { term: "Responsive Wireless Latency", count: 20, percentage: 75.0 },
      { term: "Sleek Compact Layout", count: 15, percentage: 60.0 },
      { term: "Long Rechargeable Battery", count: 11, percentage: 45.0 }
    ],
    cons: [
      { term: "Spacebar Stabilizer Rattle", count: 16, percentage: 50.0 },
      { term: "Non-Shine-Through Keycaps", count: 11, percentage: 35.0 },
      { term: "Confusing Custom Software", count: 7, percentage: 22.0 }
    ],
    thematic: [
      { category: "Value for Money", score: 4.2 },
      { category: "Build Quality", score: 4.1 },
      { category: "Ease of Use", score: 4.5 },
      { category: "Reliability", score: 4.3 }
    ],
    comparison: "Compared to standard membrane keyboards, the {product_name} offers a far superior mechanical typing experience, though the key stabilizers feel less premium than custom-built alternatives.",
    highlights: [
      { category: "Typing", quote: "The key switches feel extremely smooth and satisfying for long coding sessions.", sentiment: "Positive" },
      { category: "Stabilizers", quote: "The larger keys like Spacebar rattle loudly and feel loose.", sentiment: "Negative" },
      { category: "Lighting", quote: "RGB effects are cool, but the keys are hard to read in the dark.", sentiment: "Neutral" }
    ],
    complaints: [
      { issue: "Spacebar & Enter Stabilizer Rattle", impact_score: 6, volume: 16, severity: "Medium", root_cause: "Dry stabilizer stems and loose wire clips in the plate mount." },
      { issue: "Backlight Blocked by Keycap Material", impact_score: 5, volume: 12, severity: "Low", root_cause: "Opaque ABS double-shot injection without clear legends." },
      { issue: "Customization Software Crashes", impact_score: 7, volume: 9, severity: "High", root_cause: "Outdated desktop companion app driver compatibilities with macOS." }
    ],
    timeline: [
      { stage_or_time: "Day 1 (Setup)", issue: "Quick pairing connection", diagnostic: "Quick pairing over Bluetooth and 2.4GHz receiver. Typing felt immediately responsive." },
      { stage_or_time: "Week 2", issue: "Double typing key chattering", diagnostic: "Noticed keys chatter or double-type occasionally when battery falls below 10%." },
      { stage_or_time: "Month 3", issue: "Keycap texture shines out", diagnostic: "Matte texture on keycaps begins to shine from finger grease." }
    ],
    requests: [
      { feature: "Include Lubricated Screw-in Stabilizers", count: 18, sample_quote: "Please lube the stabilizers in the factory to stop the annoying rattle." },
      { feature: "PBT Shine-Through Keycaps Pack", count: 11, sample_quote: "Wish the keycaps let the RGB light pass through so I can type in the dark." }
    ],
    clusters: [
      { category: "Product Quality", issue: "Key chatter on double keystrokes", frequency: 9 },
      { category: "User Experience", issue: "Software profile syncing errors", frequency: 15 },
      { category: "Delivery", issue: "Keycap puller tool missing from box", frequency: 4 },
      { category: "Customer Service", issue: "Responsive customer support sent replacement switches", frequency: 12 },
      { category: "Pricing", issue: "Affordable hot-swappable board", frequency: 18 }
    ],
    fixes: [
      "Pre-lubricate stabilizer housings and wires during factory assembly.",
      "Fix memory leaks in the macOS driver version of customization software."
    ],
    improvements: [
      "Upgrade stock keycaps to high-durability textured PBT material.",
      "Include a dedicated keycap and switch puller tool in the retail pack."
    ],
    roadmap: [
      "Develop a custom web-based configurator (VIAL/QMK) to eliminate native app dependencies.",
      "Offer quiet linear silent switch variants for office environments."
    ],
    gaps: [
      "Our hot-swappability allows users to swap switches easily, which matches enthusiast boards.",
      "We lack standard gasket mounting, which makes the typing feel stiffer than premium custom keyboards."
    ]
  },
  audio: {
    summary: "Reviewers praise the {product_name} for its excellent vocal clarity, robust metal construction, and plug-and-play simplicity. It captures audio with minimal self-noise. However, users report that the desk stand picks up desk vibrations easily and the gain control dial is too loose.",
    pros: [
      { term: "Crisp Vocal Clarity", count: 28, percentage: 88.0 },
      { term: "Plug-and-Play USB Setup", count: 22, percentage: 78.0 },
      { term: "Solid Metal Construction", count: 18, percentage: 65.0 },
      { term: "Low Internal Noise Floor", count: 12, percentage: 50.0 }
    ],
    cons: [
      { term: "Transfers Desk Vibrations", count: 18, percentage: 55.0 },
      { term: "Loose Gain Dial Control", count: 12, percentage: 38.0 },
      { term: "Sensitive to Pop Plosives", count: 8, percentage: 28.0 }
    ],
    thematic: [
      { category: "Value for Money", score: 4.5 },
      { category: "Build Quality", score: 4.4 },
      { category: "Ease of Use", score: 4.7 },
      { category: "Reliability", score: 4.2 }
    ],
    comparison: "Compared to built-in laptop microphones, the {product_name} provides professional broadcast-quality sound, though it requires a shock mount to match studio setups.",
    highlights: [
      { category: "Sound", quote: "Vocals sound professional and rich. Great for voiceovers and Zoom calls.", sentiment: "Positive" },
      { category: "Mounting", quote: "The heavy stand is nice, but it transmits every keyboard tap directly into the recording.", sentiment: "Negative" },
      { category: "Controls", quote: "Mute button is handy, but I wish it didn't make a loud click sound when pressed.", sentiment: "Neutral" }
    ],
    complaints: [
      { issue: "Vibration & Typing Noise Ingestion", impact_score: 7, volume: 18, severity: "Medium", root_cause: "Rigid metal connection without rubber dampening in the desk stand." },
      { issue: "Loud Physical Click on Mute Button", impact_score: 6, volume: 8, severity: "Medium", root_cause: "Tactile dome switch used instead of a silent capacitive sensor." },
      { issue: "Oversensitive Gain Control Dial", impact_score: 5, volume: 11, severity: "Low", root_cause: "Lack of detents or physical resistance in the potentiometer." }
    ],
    timeline: [
      { stage_or_time: "Day 1 (Setup)", issue: "Instant USB detection", diagnostic: "Plugged it in and it was instantly recognized. Volume output was excellent." },
      { stage_or_time: "Week 2", issue: "Clipping on plosive letters", diagnostic: "Bought a foam windscreen because my 'P' and 'B' sounds were clipping." },
      { stage_or_time: "Month 3", issue: "Slightly loose USB port", diagnostic: "The USB connection port on the mic base feels slightly loose."}
    ],
    requests: [
      { feature: "Include Elastic Band Shock Mount", count: 22, sample_quote: "Please bundle a shock mount to stop the thumping noise from typing." },
      { feature: "Add Silent Mute Touch Sensor", count: 14, sample_quote: "Replace the clicky button with a touch pad so I can mute silently during calls."}
    ],
    clusters: [
      { category: "Product Quality", issue: "USB connection drops", frequency: 8 },
      { category: "User Experience", issue: "Gain dial bumps easily", frequency: 12 },
      { category: "Delivery", issue: "Box arrived slightly squished", frequency: 4 },
      { category: "Customer Service", issue: "Support sent replacement cable", frequency: 10 },
      { category: "Pricing", issue: "Incredible value compared to brand name mics", frequency: 22 }
    ],
    fixes: [
      "Add rubber vibration isolation rings to the mounting threads.",
      "Replace physical click mute button with a silent capacitive touch sensor."
    ],
    improvements: [
      "Stiffen the gain dial rotation resistance to avoid accidental changes.",
      "Provide a complimentary pop filter cover in the packaging."
    ],
    roadmap: [
      "Release a dual XLR/USB model to target both beginner and professional setups.",
      "Integrate an internal analog limiter to prevent audio clipping on loud sounds."
    ],
    gaps: [
      "Our audio resolution is 24-bit/96kHz which is top-tier, but we don't have headphone mixing software.",
      "Competitors bundle full virtual soundboards, which our companion app currently lacks."
    ]
  },
  home_office: {
    summary: "Reviewers of {product_name} are extremely pleased with its organizational capacity and sleek aesthetic. It declutters work spaces effectively and the metal/wood parts feel sturdy. However, the assembly instructions can be hard to follow, and the drawer tracks feel slightly loose over time.",
    pros: [
      { term: "Exceptional Storage Space", count: 28, percentage: 86.0 },
      { term: "Sturdy Metal/Wood Build", count: 22, percentage: 78.0 },
      { term: "Modern Desk Aesthetics", count: 18, percentage: 68.0 },
      { term: "Easy to Wipe Clean", count: 12, percentage: 48.0 }
    ],
    cons: [
      { term: "Vague Assembly Guide", count: 18, percentage: 52.0 },
      { term: "Loose Drawer Tracks", count: 12, percentage: 38.0 },
      { term: "Slight Chemical Odor Initially", count: 8, percentage: 24.0 }
    ],
    thematic: [
      { category: "Value for Money", score: 4.4 },
      { category: "Build Quality", score: 4.2 },
      { category: "Ease of Use", score: 3.9 },
      { category: "Reliability", score: 4.3 }
    ],
    comparison: "Compared to cheap plastic trays, the {product_name} offers superior structural rigidity, though it occupies slightly more desk area than standard models.",
    highlights: [
      { category: "Storage", quote: "Fits my dual monitor setup and holds all my pens, notebooks, and cables perfectly.", sentiment: "Positive" },
      { category: "Assembly", quote: "The screws weren't labeled properly in the manual. Spent 45 minutes trying to figure it out.", sentiment: "Negative" },
      { category: "Finish", quote: "The matte coat matches my desk, but scratch resistance could be slightly better.", sentiment: "Neutral" }
    ],
    complaints: [
      { issue: "Confusing Manual & Unlabeled Screws", impact_score: 7, volume: 15, severity: "Medium", root_cause: "Lack of exploded view diagrams and part labelling in retail booklet." },
      { issue: "Wobbly Joints / Loose Fit", impact_score: 8, volume: 11, severity: "High", root_cause: "Pre-drilled holes are slightly oversized, leading to play in the dowels." },
      { issue: "Drawer Sliding Friction", impact_score: 5, volume: 9, severity: "Low", root_cause: "Lack of ball-bearing tracks or pre-lubricated guide rails." }
    ],
    timeline: [
      { stage_or_time: "Day 1 (Assembly)", issue: "Struggled with board alignment", diagnostic: "The side panel slots have very tight tolerances making manual insertion tricky." },
      { stage_or_time: "Week 2", issue: "Drawer starts sticking when loaded", diagnostic: "Static wood joints absorb ambient moisture and expand slightly causing friction." },
      { stage_or_time: "Month 3", issue: "Bottom rubber pads slide off", diagnostic: "Thermal changes dry out the cheap adhesive layer under the protective footers." }
    ],
    requests: [
      { feature: "Numbered Assembly Screws Pack", count: 19, sample_quote: "Please separate the screws into labeled bags instead of one big mix." },
      { feature: "Include Cable Management Clips", count: 12, sample_quote: "Adding slot cutouts or clips on the back would help hide messy wires." }
    ],
    clusters: [
      { category: "Product Quality", issue: "Screw holes stripping out", frequency: 11 },
      { category: "User Experience", issue: "Drawer sticking issues", frequency: 14 },
      { category: "Delivery", issue: "Corners chipped during transit", frequency: 5 },
      { category: "Customer Service", issue: "Responsive support sent replacement board", frequency: 15 },
      { category: "Pricing", issue: "Very reasonable price for wood finish", frequency: 20 }
    ],
    fixes: [
      "Label screw packs with matching step numbers (A, B, C).",
      "Apply stronger thermal adhesive to bottom rubber feet."
    ],
    improvements: [
      "Include adhesive-backed cable management clips in the box.",
      "Increase pre-drill depth for main support dowels by 2mm."
    ],
    roadmap: [
      "Design an adjustable-height extension riser for dual monitor support.",
      "Offer bamboo and walnut wood finishes to match premium desks."
    ],
    gaps: [
      "Our load-bearing capacity is 40% higher than plastic organizers, but we lack built-in charging ports.",
      "Competitors include built-in wireless charging pads in their premium risers."
    ]
  },
  book: {
    summary: "Readers appreciate the insightful and life-changing concepts presented in {product_name}. The writing style is engaging and easy to follow. However, some find the later chapters repetitive and the paperback cover feels thin.",
    pros: [
      { term: "Inspiring & Practical Advice", count: 28, percentage: 86.0 },
      { term: "Engaging Writing Style", count: 24, percentage: 78.0 },
      { term: "Clear Formatting & Layout", count: 18, percentage: 68.0 },
      { term: "Quality Paper Stock", count: 12, percentage: 48.0 }
    ],
    cons: [
      { term: "Repetitive Mid-Chapters", count: 18, percentage: 52.0 },
      { term: "Thin Paperback Cover", count: 12, percentage: 38.0 },
      { term: "Small Font Size", count: 8, percentage: 24.0 }
    ],
    thematic: [
      { category: "Value for Money", score: 4.6 },
      { category: "Content Depth", score: 4.4 },
      { category: "Ease of Reading", score: 3.9 },
      { category: "Reliability & Integrity", score: 4.5 }
    ],
    comparison: "Compared to other bestsellers in personal growth, {product_name} offers a more structured approach, though some readers might prefer a more concise format.",
    highlights: [
      { category: "Content", quote: "Truly eye-opening. The practical exercises actually help apply the concepts.", sentiment: "Positive" },
      { category: "Repetition", quote: "I felt like I was reading the same chapter three times in the middle sections.", sentiment: "Negative" },
      { category: "Quality", quote: "The page thickness is great, but the cover bends if you throw it in a backpack.", sentiment: "Neutral" }
    ],
    complaints: [
      { issue: "Repetitive Content in Later Chapters", impact_score: 5, volume: 12, severity: "Medium", root_cause: "Reiterating core concepts too many times without new case studies." },
      { issue: "Cover Easily Bent in Transit", impact_score: 6, volume: 8, severity: "Low", root_cause: "Thin cardstock used for cover without protective packaging wrap." },
      { issue: "Small Text Font Size", impact_score: 4, volume: 10, severity: "Low", root_cause: "Layout design minimized margins and font size to fit page count budgets." }
    ],
    timeline: [
      { stage_or_time: "Chapter 1-3", issue: "Exciting and motivating", diagnostic: "Introduces clear frameworks and hooks the reader immediately." },
      { stage_or_time: "Chapter 4-7", issue: "Feels repetitive", diagnostic: "Repeats the same concepts with different wording, slowing the pace." },
      { stage_or_time: "Finished Reading", issue: "Lacks concrete action steps", diagnostic: "Leaves reader inspired but wanting more structured exercises." }
    ],
    requests: [
      { feature: "Actionable End-of-Chapter Worksheets", count: 22, sample_quote: "I wish there were practical worksheets or prompts to write down after each chapter." },
      { feature: "Release a Hardcover Edition", count: 14, sample_quote: "The paperback bent immediately. I would pay more for a sturdy hardcover version." }
    ],
    clusters: [
      { category: "Product Quality", issue: "Spine glue cracking after wear", frequency: 7 },
      { category: "User Experience", issue: "Font is hard to read in low light", frequency: 14 },
      { category: "Delivery", issue: "Bent corners on arrival", frequency: 10 },
      { category: "Customer Service", issue: "Responsive replacement sent for damaged book", frequency: 18 },
      { category: "Pricing", issue: "Great price for a paperback", frequency: 22 }
    ],
    fixes: [
      "Include summary worksheets at the end of each chapter.",
      "Stiffen the paperback cover board thickness by 50gsm."
    ],
    improvements: [
      "Increase the body font size from 9.5pt to 11pt for easier reading.",
      "Add bullet-point summaries at the end of each chapter for quick reference."
    ],
    roadmap: [
      "Publish a companion guided journal with daily reflection prompts.",
      "Release a premium hardcover box set with workbook and audiobook access."
    ],
    gaps: [
      "Our content is highly practical compared to theoretical books, but we lack online community groups.",
      "Competitors offer a QR code inside the book linking to private reader forums."
    ]
  },
  mouse: {
    summary: "Reviewers of {product_name} are highly satisfied with its ergonomic grip, precise sensor tracking, and tactile click feedback. The wireless connectivity is responsive with minimal latency. However, some complain about scroll wheel rattle and side buttons placement.",
    pros: [
      { term: "Ergonomic Grip Comfort", count: 24, percentage: 82.0 },
      { term: "Precise Sensor Tracking", count: 18, percentage: 75.0 },
      { term: "Tactile Clicks Feedback", count: 15, percentage: 62.0 },
      { term: "Long Rechargeable Battery", count: 11, percentage: 45.0 }
    ],
    cons: [
      { term: "Scroll Wheel Rattle", count: 16, percentage: 50.0 },
      { term: "Stiff Side Buttons", count: 10, percentage: 32.0 },
      { term: "Confusing Custom Software", count: 7, percentage: 22.0 }
    ],
    thematic: [
      { category: "Value for Money", score: 4.2 },
      { category: "Build Quality", score: 4.1 },
      { category: "Ease of Use", score: 4.5 },
      { category: "Reliability", score: 4.3 }
    ],
    comparison: "Compared to standard office mice, the {product_name} offers superior ergonomic support and customizable DPI settings, though the scroll wheel feels less robust than premium gaming alternatives.",
    highlights: [
      { category: "Ergonomics", quote: "The shape fits my hand perfectly, reducing wrist fatigue during long work days.", sentiment: "Positive" },
      { category: "Scroll Wheel", quote: "The scroll wheel feels slightly loose and wobbles when scrolled quickly.", sentiment: "Negative" },
      { category: "Clicks", quote: "Left and right clicks are quiet and satisfying.", sentiment: "Neutral" }
    ],
    complaints: [
      { issue: "Scroll Wheel Rattle & Play", impact_score: 6, volume: 16, severity: "Medium", root_cause: "Loose stabilizer mounts inside the wheel assembly." },
      { issue: "Side Buttons Hard to Reach", impact_score: 5, volume: 10, severity: "Medium", root_cause: "Button placement is optimized for large hand profiles only." },
      { issue: "Software Driver Disconnections", impact_score: 7, volume: 7, severity: "High", root_cause: "Incompatibilities with macOS background helper processes."}
    ],
    timeline: [
      { stage_or_time: "Day 1 (Unboxing)", issue: "Ergonomic fit feels natural", diagnostic: "Requires a day of regular use to get accustomed to the high thumb rest angle." },
      { stage_or_time: "Week 2", issue: "Scroll wheel play increases", diagnostic: "Friction wearing down the rubber coating of the inner wheel dial." },
      { stage_or_time: "Month 3", issue: "Battery capacity indicator drops", diagnostic: "RGB lighting active at maximum brightness drains power 3x faster." }
    ],
    requests: [
      { feature: "Metal Scroll Wheel Upgrade", count: 19, sample_quote: "Upgrade the cheap plastic scroll wheel to a premium metal design." },
      { feature: "Interchangeable Thumb Rest Wings", count: 12, sample_quote: "Offer wings for different hand sizes or let me remove it completely."}
    ],
    clusters: [
      { category: "Product Quality", issue: "Scroll wheel rattle", frequency: 16 },
      { category: "User Experience", issue: "Confusing button mapping software", frequency: 14 },
      { category: "Delivery", issue: "Box corners bent in transit", frequency: 5 },
      { category: "Customer Service", issue: "Support replaced wobbly unit quickly", frequency: 12 },
      { category: "Pricing", issue: "Excellent value for custom buttons", frequency: 18 }
    ],
    fixes: [
      "Stiffen the scroll wheel mounting brackets to remove side play.",
      "Fix software sync crash bugs on modern macOS updates."
    ],
    improvements: [
      "Bundle a set of replacement PTFE mouse feet gliders.",
      "Stiffen the tactile click activation on side buttons."
    ],
    roadmap: [
      "Develop a lightweight honeycomb shell gaming edition.",
      "Integrate dual-channel Bluetooth multi-device selector toggle."
    ],
    gaps: [
      "Our battery life exceeds competitors by 20%, but we lack infinite scrolling capabilities.",
      "Competitors support higher polling rates which are preferred by competitive e-sports players."
    ]
  },
  phone: {
    summary: "Reviewers of {product_name} are highly impressed with its vibrant OLED display, snappy performance, and excellent camera system. The software user interface is smooth and fluid. However, battery life is average and charging speeds are sluggish without purchasing a separate fast-charging block.",
    pros: [
      { term: "Stunning OLED Display", count: 28, percentage: 88.0 },
      { term: "Snappy UI Performance", count: 22, percentage: 78.0 },
      { term: "Vibrant Camera Photos", count: 18, percentage: 68.0 },
      { term: "Premium Sleek Build", count: 12, percentage: 48.0 }
    ],
    cons: [
      { term: "Average Battery Runtime", count: 18, percentage: 52.0 },
      { term: "Sluggish Charging Speeds", count: 12, percentage: 38.0 },
      { term: "Bloatware Apps Included", count: 8, percentage: 24.0 }
    ],
    thematic: [
      { category: "Value for Money", score: 4.4 },
      { category: "Build Quality", score: 4.5 },
      { category: "Ease of Use", score: 4.2 },
      { category: "Reliability", score: 4.1 }
    ],
    comparison: "Compared to other flagships, the {product_name} offers a superior display for the price, though it falls behind in telephoto camera zoom and fast charging capabilities.",
    highlights: [
      { category: "Display", quote: "The 120Hz display makes browsing and animations feel incredibly smooth.", sentiment: "Positive" },
      { category: "Camera", quote: "Night photos are clear and sharp, catching a lot of detail.", sentiment: "Positive" },
      { category: "Battery", quote: "Barely makes it to the end of the day if I watch videos or play games.", sentiment: "Negative" }
    ],
    complaints: [
      { issue: "Fast Charger Omitted from Box", impact_score: 7, volume: 18, severity: "Medium", root_cause: "Environmental packaging decisions omitting charger accessory." },
      { issue: "Battery Drain in Standby Mode", impact_score: 6, volume: 12, severity: "Medium", root_cause: "Background system processes failing to enter low-power sleep states." },
      { issue: "Thermal Throttle during Video Calls", impact_score: 8, volume: 9, severity: "High", root_cause: "Passive thermal dissipation limit in compact metal frame." }
    ],
    timeline: [
      { stage_or_time: "Day 1 (Setup)", issue: "Stunning screen setup", diagnostic: "Initial data transfer took 30 minutes, display colors look phenomenal." },
      { stage_or_time: "Week 2", issue: "Phone gets warm during tasks", diagnostic: "High processor usage raises phone core temperature to 42C." },
      { stage_or_time: "Month 3", issue: "Standby drain increases", diagnostic: "System cache logs block deep sleep, draining 8% charge overnight." }
    ],
    requests: [
      { feature: "Include 30W Fast Charger Block", count: 22, sample_quote: "Please just put a fast charger block in the box so I don't have to buy one." },
      { feature: "Expand MicroSD Storage Support", count: 14, sample_quote: "Add a microSD card slot so I can expand storage for my photos." }
    ],
    clusters: [
      { category: "Product Quality", issue: "Screen scratches easily", frequency: 11 },
      { category: "User Experience", issue: "Standby battery drain bugs", frequency: 14 },
      { category: "Delivery", issue: "Arrived safely in bubble pack", frequency: 5 },
      { category: "Customer Service", issue: "Helpful support for OS updates", frequency: 15 },
      { category: "Pricing", issue: "Excellent specs for the price tag", frequency: 20 }
    ],
    fixes: [
      "Optimize background OS power management to resolve standby drain.",
      "Adjust dynamic thermal throttling profiles to prevent camera overheat."
    ],
    improvements: [
      "Apply a harder scratch-resistant glass coating to screen glass.",
      "Increase maximum supported charging rate to 45W speed."
    ],
    roadmap: [
      "Develop under-display selfie camera sensors for a notchless screen.",
      "Integrate direct satellite connectivity features for emergency messaging."
    ],
    gaps: [
      "Our display refresh speed matches top brands, but we lack wireless charging pads.",
      "Competitors support reverse wireless charging which our phone lacks."
    ]
  },
  generic: {
    summary: "Reviewers generally rate the {product_name} highly for its usability and solid build quality. The design is modern and fits well into daily use. However, some users find it difficult to clean and note that the instruction sheet could be clearer.",
    pros: [
      { term: "Excellent Build Quality", count: 20, percentage: 80.0 },
      { term: "Ergonomic & Portable Design", count: 16, percentage: 70.0 },
      { term: "Premium Material Feel", count: 12, percentage: 55.0 },
      { term: "Value for the Price", count: 9, percentage: 40.0 }
    ],
    cons: [
      { term: "Difficult to Clean / Maintain", count: 15, percentage: 48.0 },
      { term: "Vague User Manual Instructions", count: 10, percentage: 32.0 },
      { term: "Delicate Outer Surfaces", count: 7, percentage: 22.0 }
    ],
    thematic: [
      { category: "Value for Money", score: 4.1 },
      { category: "Build Quality", score: 4.2 },
      { category: "Ease of Use", score: 3.8 },
      { category: "Reliability", score: 4.0 }
    ],
    comparison: "Compared to standard models on the market, the {product_name} offers a more modern aesthetics, though some details could be refined for long-term durability.",
    highlights: [
      { category: "Usability", quote: "Very practical for daily use. Holds up well under normal conditions.", sentiment: "Positive" },
      { category: "Manual", quote: "The instructions were brief and didn't explain all the features clearly.", sentiment: "Negative" },
      { category: "Surface", quote: "The texture looks premium but shows dust and smudges easily.", sentiment: "Neutral" }
    ],
    complaints: [
      { issue: "Vague User Manual Instructions", impact_score: 6, volume: 12, severity: "Medium", root_cause: "The packaging brochure lacks clear diagrams for assembly and care." },
      { issue: "Difficult to Deep Clean", impact_score: 5, volume: 10, severity: "Low", root_cause: "Tight angles and crevices trap moisture and dust easily." },
      { issue: "Outer Finish Scratches Easily", impact_score: 7, volume: 9, severity: "Medium", root_cause: "Lack of scratch-resistant coating on the main exterior surface." }
    ],
    timeline: [
      { stage_or_time: "Day 1 (First Use)", issue: "Slight chemical odor", diagnostic: "Manufacturing finishes require washing or airing out prior to regular use." },
      { stage_or_time: "Week 2", issue: "Stiff latch or joints", diagnostic: "Moving parts require a break-in period to smooth out friction." },
      { stage_or_time: "Month 3", issue: "Bottom pads or seals loosen", diagnostic: "Repetitive washing or friction weakens the adhesive/rubber parts." }
    ],
    requests: [
      { feature: "Provide a Carrying Case/Pouch", count: 16, sample_quote: "I wish it came with a sleeve or travel bag to keep it clean in transit." },
      { feature: "Dishwasher-Safe Certification", count: 20, sample_quote: "Washing this by hand is annoying. Make it safe for dishwasher cleaning." }
    ],
    clusters: [
      { category: "Product Quality", issue: "Surface finishes wearing flat", frequency: 8 },
      { category: "User Experience", issue: "Hard to clean slots", frequency: 12 },
      { category: "Delivery", issue: "Package arrived with open seals", frequency: 4 },
      { category: "Customer Service", issue: "Customer support resolved questions quickly", frequency: 14 },
      { category: "Pricing", issue: "Fair price for the build", frequency: 18 }
    ],
    fixes: [
      "Redesign user manual with simplified visual steps and cleaning tips.",
      "Upgrade to a higher-grade non-toxic material that doesn't retain odors."
    ],
    improvements: [
      "Apply a scratch-resistant matte coating to the exterior surfaces.",
      "Include a simple cleaning brush accessory in the package."
    ],
    roadmap: [
      "Develop a collapsible version for enhanced travel convenience.",
      "Expand the color selection catalog to include premium metallic finishes."
    ],
    gaps: [
      "Our durability exceeds cheap alternatives by 20%, but we lack smart features.",
      "Competitors are beginning to integrate Bluetooth tracking or digital indicators."
    ]
  }
};

export function hasWordMatch(text: string, keywords: string[]): boolean {
  const pattern = new RegExp(`\\b(${keywords.map(k => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})\\b`, 'i');
  return pattern.test(text);
}

export function detectCategoryFromText(text: string): string {
  // 1. Compound accessories / stands / risers (home_office)
  if (hasWordMatch(text, [
    "monitor stand", "monitor mount", "monitor arm", "monitor riser", "monitor bracket",
    "tv stand", "tv mount", "tv bracket",
    "keyboard tray", "keyboard stand", "keyboard riser",
    "mic stand", "microphone stand", "speaker stand",
    "laptop stand", "laptop riser", "phone stand", "phone holder",
    "tablet stand", "tablet holder", "desk organizer", "desk organiser"
  ])) {
    return "home_office";
  }
  
  // 2. Wearables
  if (hasWordMatch(text, ["watch", "band", "fitbit", "wearable", "tracker", "smartwatch", "fitness"])) {
    return "wearable";
  }
  // 3. Kitchen / Brewers
  if (hasWordMatch(text, ["coffee", "brewer", "kettle", "maker", "mug", "cooker", "blender", "pot", "grinder", "cook", "toaster", "oven", "airfryer", "juicer"])) {
    return "kitchen";
  }
  // 4. Shoes / Clothing / Apparel
  if (hasWordMatch(text, ["shoe", "boot", "sneaker", "running", "shirt", "pants", "jacket", "coat", "hoodie", "sock", "apparel", "clothing", "jeans", "tshirt", "t-shirt", "dress"])) {
    return "apparel";
  }
  // 5. Phones & Mobile Devices
  if (hasWordMatch(text, ["phone", "smartphone", "iphone", "android", "galaxy", "pixel", "oneplus", "cellular", "mobile"])) {
    return "phone";
  }
  // 6. Computer Mice
  if (hasWordMatch(text, ["mouse", "mice", "trackpad", "scroll", "pointer", "dpi", "sensor", "grip", "clicks"])) {
    return "mouse";
  }
  // 7. Keyboards & Input Devices (Excluding Mouse)
  if (hasWordMatch(text, ["keyboard", "keypad", "typing", "keeb", "keys", "clicky", "keycaps"])) {
    return "keyboard";
  }
  // 8. Audio, Speakers & Microphones
  if (hasWordMatch(text, ["mic", "microphone", "headphone", "headset", "earphone", "earbud", "speaker", "audio", "sound", "voice", "music", "earphones", "earbuds", "headphones", "headsets", "microphones", "speakers", "jbl", "soundbar", "soundbars"])) {
    return "audio";
  }
  // 9. Monitors & Display Screens
  if (hasWordMatch(text, ["monitor", "screen", "display", "tv", "television", "displayport", "hdmi", "projector"])) {
    return "display";
  }
  // 10. Books & Novels
  if (hasWordMatch(text, ["book", "read", "manifest", "novel", "bestseller", "paperback", "hardcover", "author", "pages", "reading", "novels", "books", "hardback", "paperbacks", "literature", "fiction", "biography"])) {
    return "book";
  }
  // 11. Home / Office / Desk Organizer / Furniture / Lamp
  if (hasWordMatch(text, ["organizer", "organiser", "desk", "chair", "table", "shelf", "furniture", "storage", "rack", "stand", "holder", "riser", "lamp", "light", "decor", "cabinet", "drawer", "sofa", "bed", "stool"])) {
    return "home_office";
  }
  
  return "";
}

export async function extractProductNameFromUrl(url: string): Promise<string> {
  if (!url) return "";
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      const html = await res.text();
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      if (titleMatch) {
        let rawTitle = titleMatch[1].trim();
        const suffixes = [
          "Amazon.in", "Amazon.com", "Amazon.co.uk", "Amazon.ca", "Amazon.de", "Amazon.fr", "Amazon.co.jp",
          ": Amazon.in", ": Amazon.com", "Buy Online at Low Prices in India", "Online at Low Prices",
          "Home & Kitchen", "Office Products", "Electronics", "Clothing & Accessories", "Books",
          "Online Shopping", "| Amazon"
        ];
        let cleaned = rawTitle;
        for (const suffix of suffixes) {
          cleaned = cleaned.replace(new RegExp(`\\b${suffix.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi'), "");
        }
        cleaned = cleaned.replace(/^(Buy|Amazon\.\w+\s*:\s*)/i, "").trim();
        cleaned = cleaned.replace(/^[:| ]+|[:| ]+$/g, "").trim();
        cleaned = cleaned.replace(/\s+/g, " ");
        if (cleaned) return cleaned;
      }
    }
  } catch (e) {
    console.warn(`[Warning] Failed to fetch page title for URL ${url}:`, e);
  }

  // Fallback path crawler
  try {
    const parts = url.split("/");
    for (let i = 0; i < parts.length; i++) {
      if (["dp", "gp", "product"].includes(parts[i]) && i > 0) {
        const slug = parts[i - 1];
        if (slug && !slug.includes("amazon") && !slug.includes("www")) {
          const cleanSlug = slug.replace(/[-_]+/g, " ").trim();
          return cleanSlug.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        }
      }
    }
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    if (pathParts.length > 0) {
      const slug = pathParts[pathParts.length - 1];
      if (slug.includes("-") || slug.includes("_")) {
        const cleanSlug = slug.replace(/[-_]+/g, " ").trim();
        return cleanSlug.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      }
    }
  } catch (err) {}
  return "";
}

export function getMockReviewsForUrl(productName: string, url: string): string[] {
  const display = productName || "Product";
  const combined = (display + " " + url).toLowerCase();
  const cat = detectCategoryFromText(combined);

  if (cat === "wearable") {
    return [
      `The smartwatch purchased from ${url} works perfectly. Setup was straightforward.`,
      "Beautiful display and design, but the battery drains twice as fast as my old watch.",
      "Excellent price point for a wearable. Material feels premium. Shipping took 4 days.",
      "The companion app keeps dropping Bluetooth pairing. Hope they fix it in a firmware update.",
      "Great tracking quality. Definitely recommend it for anyone looking to monitor steps."
    ];
  } else if (cat === "kitchen") {
    return [
      `The brewer purchased from ${url} works perfectly. Heating is extremely fast.`,
      "Beautiful stainless finish, but the steaming valve is much louder than my old cooker.",
      "Excellent price point for a coffee maker. Stainless steel feels premium. Shipping took 4 days.",
      "Hard to clean coffee grounds/food residue from the inner crevices, need a custom brush.",
      "Great beverage/cooking quality. Definitely recommend it for anyone looking to save time in the morning."
    ];
  } else if (cat === "apparel") {
    return [
      `The items purchased from ${url} feel extremely comfortable. Walking/wearing comfort is top tier.`,
      "Beautiful styling, but the sizing runs small and tight around the front seams.",
      "Excellent price point. Material feels soft and premium. Shipping took 4 days.",
      "The stitching around the collar is thin and began to run after my second use.",
      "Great fabric quality and breathability. Definitely recommend it for running/wearing."
    ];
  } else if (cat === "phone") {
    return [
      `The phone purchased from ${url} works beautifully. The OLED screen is stunningly bright and colorful.`,
      "Camera captures excellent photos, but the battery drains quickly under heavy usage.",
      "Excellent price point for a modern smartphone. Performance feels snappy. Shipping took 4 days.",
      "The charging speed is slower than expected without a custom adapter.",
      "Great overall build quality. Definitely recommend it for anyone upgrading their mobile device."
    ];
  } else if (cat === "mouse") {
    return [
      `The mouse purchased from ${url} works beautifully. The clicks feel tactile and responsive.`,
      "Love the ergonomic shape and grip, but the scroll wheel has a bit of rattle.",
      "Excellent price point for a wireless mouse. High precision sensor. Shipping took 4 days.",
      "The side buttons are slightly hard to reach for small hands.",
      "Great wireless tracking performance. Definitely recommend it for gaming or daily productivity."
    ];
  } else if (cat === "keyboard") {
    return [
      `The keyboard purchased from ${url} works beautifully. The keystrokes feel tactile and responsive.`,
      "Love the mechanical switch feel, but the spacebar has a bit of rattle.",
      "Excellent price point for a wireless keyboard. RGB lighting looks premium. Shipping took 4 days.",
      "The keycap legends are slightly thin and the backlight does not shine through clearly.",
      "Great wireless typing performance. Definitely recommend it for anyone writing or gaming."
    ];
  } else if (cat === "audio") {
    return [
      `The microphone purchased from ${url} works perfectly. The vocal clarity is crisp and clean.`,
      "Excellent sound pickup, but the gain knob turns too easily and gets bumped.",
      "Excellent price point for audio gear. Metal body feels premium. Shipping took 4 days.",
      "The desk stand transfers vibration noise whenever I touch my desk.",
      "Great voice recording quality. Definitely recommend it for podcasting or meetings."
    ];
  } else if (cat === "display") {
    return [
      `The monitor purchased from ${url} works beautifully. The colors are extremely vibrant and the contrast is excellent.`,
      "Love the high refresh rate, but the display panel has a bit of backlight bleed in the corners.",
      "Excellent price point for a 4K display. The stand feels wobbly.",
      "The built-in speakers sound tinny, but the screen panel quality makes up for it.",
      "Great color accuracy for editing. Definitely recommend it for gaming or design work."
    ];
  } else if (cat === "book") {
    return [
      `The book purchased from ${url} was an absolute joy to read. Very inspiring advice.`,
      "The concepts are interesting, but the middle chapters feel a bit repetitive and slow.",
      "Excellent price point for a bestseller. The formatting is clear and high-quality paper. Shipping took 4 days.",
      "The text font size is small, making it difficult to read in dim light.",
      "Great content quality and structural worksheets. Definitely recommend it to others."
    ];
  } else if (cat === "home_office") {
    return [
      `The organizer purchased from ${url} helps declutter my desk perfectly. Setup was clean.`,
      "Beautiful wood finish, but the assembly guide is confusing with unlabeled screws.",
      "Excellent price point for home storage. Metal frame feels premium. Shipping took 4 days.",
      "The drawer sliders have some friction when loaded with books and accessories.",
      "Great organization capacity and sturdiness. Definitely recommend it for a cleaner workspace."
    ];
  } else {
    return [
      `The items purchased from ${url} work well for daily use. Extremely practical build.`,
      "Beautiful styling, but the instruction manual is vague and brief.",
      "Excellent price point. Material feels premium and durable. Shipping took 4 days.",
      "Hard to clean the tight crevices and corners without a brush.",
      "Great quality and usability. Definitely recommend it for anyone looking for standard utility."
    ];
  }
}

export function parseSimpleKeywords(text: string): { hits: Record<string, number>, sentiment: { pos: number, neg: number, neu: number } } {
  const textLower = text.toLowerCase();
  const indicators: Record<string, string[]> = {
    battery: ["battery", "charge", "power", "drain"],
    price: ["price", "expensive", "cheap", "cost", "money", "worth"],
    quality: ["quality", "cheaply", "break", "broke", "robust", "durable", "material"],
    shipping: ["shipping", "delivery", "arrived", "delay", "packaged", "box"],
    ui: ["screen", "button", "app", "ui", "software", "connect", "bluetooth", "wifi", "design"],
    service: ["service", "support", "help", "chat", "representative", "refund"]
  };
  
  const hits: Record<string, number> = {};
  for (const [category, kws] of Object.entries(indicators)) {
    let count = 0;
    for (const kw of kws) {
      // Substring counts
      let pos = textLower.indexOf(kw);
      while (pos !== -1) {
        count++;
        pos = textLower.indexOf(kw, pos + 1);
      }
    }
    hits[category] = count;
  }
  
  const posWords = ["good", "great", "excellent", "love", "amazing", "perfect", "awesome", "easy", "satisfied"];
  const negWords = ["bad", "poor", "terrible", "hate", "worst", "broken", "fail", "difficult", "disappointed", "refund"];
  
  let posCount = 1;
  for (const w of posWords) {
    let pos = textLower.indexOf(w);
    while (pos !== -1) { posCount++; pos = textLower.indexOf(w, pos + 1); }
  }
  let negCount = 1;
  for (const w of negWords) {
    let pos = textLower.indexOf(w);
    while (pos !== -1) { negCount++; pos = textLower.indexOf(w, pos + 1); }
  }
  
  const total = posCount + negCount;
  let posPct = Math.round((posCount / total) * 100);
  let negPct = Math.round((negCount / total) * 100);
  let neuPct = 100 - posPct - negPct;
  if (neuPct < 0) {
    posPct += neuPct;
    neuPct = 0;
  }
  
  return { hits, sentiment: { pos: posPct, neg: negPct, neu: neuPct } };
}

export function getMockDataForProduct(productName: string, reviewsText: string = ""): any {
  const nameLower = productName.toLowerCase();
  const reviewsLower = reviewsText.toLowerCase();
  
  let cat = detectCategoryFromText(nameLower);
  if (!cat && reviewsLower) {
    cat = detectCategoryFromText(reviewsLower);
  }
  if (!cat) {
    cat = "generic";
  }
  
  // Deep copy the template
  const template = JSON.parse(JSON.stringify(MOCK_TEMPLATES[cat]));
  
  // Format summary & comparison string interpolation
  template.summary = template.summary.replace(/{product_name}/g, productName);
  template.comparison = template.comparison.replace(/{product_name}/g, productName);
  
  return template;
}

export function generateMockBuyerInsights(text: string, productName: string = "Smart Product"): any {
  const kwData = parseSimpleKeywords(text);
  const sentiment = kwData.sentiment;
  const mockDb = getMockDataForProduct(productName, text);
  
  let verdict = "Avoid";
  let explanation = `Frequent reports of functional defects, shipping issues, or bad customer service for ${productName} suggest looking for alternatives.`;
  
  const posPct = sentiment.pos;
  if (posPct >= 75) {
    verdict = "Strong Buy";
    explanation = `The reviews for ${productName} reflect outstanding satisfaction, with praise for build quality and performance far outweighing minor complaints.`;
  } else if (posPct >= 55) {
    verdict = "Buy with Caution";
    explanation = `Solid overall feedback for ${productName}, but buyers note potential concerns that might require review prior to purchasing.`;
  } else if (posPct >= 35) {
    verdict = "Only Buy on Discount";
    explanation = `The ${productName} delivers acceptable value but has enough drawbacks that it's best purchased on sale.`;
  }
  
  return {
    verdict,
    verdict_explanation: explanation,
    ai_summary: mockDb.summary,
    sentiment_overview: {
      positive_percentage: sentiment.pos,
      neutral_percentage: sentiment.neu,
      negative_percentage: sentiment.neg
    },
    top_pros: mockDb.pros,
    top_cons: mockDb.cons,
    thematic_scores: mockDb.thematic,
    comparison_insights: mockDb.comparison,
    categorized_highlights: mockDb.highlights
  };
}

export function generateMockSellerInsights(text: string, productName: string = "Smart Product"): any {
  const mockDb = getMockDataForProduct(productName, text);
  
  // Sort complaints by impact score
  const complaints = [...mockDb.complaints].sort((a: any, b: any) => b.impact_score - a.impact_score);
  
  return {
    ranked_complaints: complaints,
    root_cause_timeline: mockDb.timeline,
    extracted_feature_requests: mockDb.requests,
    clustered_feedback: mockDb.clusters,
    immediate_fixes: mockDb.fixes,
    short_term_improvements: mockDb.improvements,
    long_term_roadmap: mockDb.roadmap,
    competitor_gaps: mockDb.gaps
  };
}
