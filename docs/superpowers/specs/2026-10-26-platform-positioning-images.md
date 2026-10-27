# Image brief — platform-first positioning

Date: 2026-10-26 · For generation in Codex · Belongs to [the positioning design](2026-10-26-platform-positioning-design.md)

Fifteen images are now listed: 8 replace the home page hero photo wall, 5 more (09 to 13) sit on standard, industry and module pages, 1 is the social share card background, and 1 sits in the new "Book a demo" box on blog and guide pages. The layout does not change; these fill slots that already exist or are already planned. The ready-to-paste prompt for each image is one file in [`docs/image-prompts/`](../../image-prompts/README.md), which also lists where each image is used.

**The story the images tell:** today's hero photos show people *talking about* compliance around a tablet. The new set shows the software *doing the work on the floor*: a check recorded at the machine, a sign-off on a tablet, a supplier pallet scanned at receiving. People stay in charge; the screen is a tool in their hands.

## How to use this brief

1. Paste the **shared style** block, then one image's **scene** block, as one prompt.
2. Generate landscape at **1536×1024** (or larger), except where a size is given.
3. Save each result as PNG with the file name shown, in a folder outside the repo (for example `~/Downloads/icc-platform-images/`). Claude crops them to final size and places them in `public/images/`.
4. Reject and regenerate any image with readable text, a logo, a brand mark on a device, extra fingers, or warped tools.

## Shared style (paste first, every time)

> Photorealistic editorial photograph for a manufacturing trade publication. Modern North American manufacturing interior: clean floor, organized workstations, real machinery. Natural daylight from high windows mixed with even overhead lighting. Palette: steel gray and navy blue machinery and workwear with muted safety-orange accents, plus a subtle teal glow from device screens; no saturated reds or greens, no dramatic color grading, no HDR. 35 mm lens at eye level, shallow depth of field, slight film grain, true-to-life color. People wear real PPE suited to the task and are shown mid-task, never posed, never looking at the camera, no close-up faces. The team across the series is diverse in age, gender and ethnicity. Any tablet, handheld or screen shows a simple interface of colored status tiles, check rows or a chart in teal, amber and navy, deliberately soft and out of focus so that no text, numbers or logos are readable. Devices are unbranded, in rugged gray or black cases. Avoid: offices, boardrooms, meetings around a table, laptops as the subject, stock-photo smiles, readable text, logos, signage, labels, brand marks or watermarks of any kind.

Hero framing note (add to the 8 hero prompts): *Subject in the middle distance and slightly above center; keep the bottom third of the frame simple (floor, bench edge or soft machinery) because a dark caption band covers it; leave room to crop to 16:9.*

## Home page hero wall (8 images)

Shown as moving cards about 390×240 px with an industry caption over the bottom. The captions stay the same, so each image must match its industry.

### 1. Fabrication · ISO 9001 — `platform-fabrication.png`

> Scene: a fabrication shop. A quality technician in safety glasses and cut-resistant gloves measures a laser-cut steel bracket with digital calipers at a steel inspection table. A rugged tablet on a small stand beside the part shows a checklist with a column of green check rows, out of focus. Behind: a press brake, racks of cut sheet-metal parts, a welding curtain in muted gray. Wide shot, the technician and table in the middle distance.

### 2. Automotive · IATF 16949 — `platform-automotive.png`

> Scene: an inline inspection station beside an automotive assembly cell. An operator in a navy work shirt, safety glasses and gloves scans the barcode on a machined aluminum housing with a handheld scanner. A touchscreen on an arm next to the station shows a control chart whose line stays inside a green band, soft focus. Orange-and-gray industrial robots and a conveyor in the background.

### 3. Medical devices · ISO 13485 — `platform-medical-device.png`

> Scene: a controlled assembly area for small medical devices. A technician in a white lab coat, hairnet, safety glasses and nitrile gloves signs off a record on a tablet with a stylus at a clean white bench. Small device components sit in labeled-looking but unreadable trays under a magnifier lamp. Bright, even, clean lighting; glass partition to a cleanroom behind.

### 4. Aerospace · AS9100 — `platform-aerospace.png`

> Scene: a coordinate-measuring-machine room in an aerospace machine shop. A titanium bracket sits on a granite CMM table while the probe touches it. An inspector in safety glasses holds a tablet showing a 3D part view with an abstract colored deviation map, out of focus. Precision machining centers visible through a window behind.

### 5. Food & beverage · ISO 22000 — `platform-food-beverage.png`

> Scene: a stainless-steel packaging line in a food plant. A worker in a white coat, hairnet, beard net if relevant, and blue gloves takes a temperature reading with a probe thermometer and records it on a tablet in a wipe-clean case. Sealed cartons move along the conveyor behind. Bright, hygienic, white and stainless surfaces with navy accents.

### 6. Electronics · ISO 9001 — `platform-electronics.png`

> Scene: an ESD-safe electronics bench. A technician in a light-blue ESD smock inspects a green circuit board under an illuminated magnifier, tweezers in hand. A monitor on an arm shows a pass/fail list with green and amber rows, soft focus. Reels of components and a pick-and-place machine in the background.

### 7. Receiving · ISO 9001 — `platform-receiving.png`

> Scene: a warehouse receiving dock. An inspector in a high-visibility vest and safety glasses scans the label on an incoming shrink-wrapped supplier pallet with a rugged handheld, a tablet clipped to the pallet jack shows a green "accepted" status tile without readable text. Tall racking, a parked forklift and open dock doors with daylight behind.

### 8. Training · Implementation — `platform-training.png`

> Scene: a short training huddle on the plant floor next to a machine. A supervisor points to a large wall-mounted screen showing a step-by-step work instruction made of simple diagrams (no readable text). Three operators in PPE watch; one of them taps a tablet to sign off the training. Wide shot, the group in the middle distance, machinery around them.

## Social share card background — `og-platform-bg.png`

Size: landscape, generate at 1536×1024 or wider; it is cropped to 1200×630. Claude adds the logo, headline ("Stop managing compliance. Start automating it.") and the standards line in code, the same way as the current card.

> Scene: a wide view of a modern plant floor in cool blue-navy evening light. One quality engineer stands in the right third of the frame holding a tablet whose soft teal glow lights their hands and safety glasses; machinery and conveyors stretch into the distance. The left 60% of the frame is calm and darker: out-of-focus machinery and floor, no bright highlights, so white headline text can sit on it. Overall darker and moodier than the other images, still realistic.

## "Book a demo" box image — `demo-box-tablet.png`

Size: square, **1024×1024**. Shown small (about 220 px) beside the demo box text on every blog post and guide page.

> Scene: close-up on a steel workbench. A rugged tablet in a gray protective case lies next to a freshly machined steel part and a digital caliper; a gloved hand reaches toward the tablet. The screen shows a dashboard of status tiles in teal, amber and navy with one small chart, out of focus, nothing readable. Background: soft bokeh of a plant floor in steel gray and navy. Mid-shot framing as for an inline article image.

## Final placement (done by Claude during implementation)

All 15 images. Prompts: [`docs/image-prompts/`](../../image-prompts/README.md).

| # | File | Final size | Goes to |
| --- | --- | --- | --- |
| 01 | `platform-fabrication.png` | 1672×941 PNG | `public/images/hero/` (old hero photos stay in the repo; only references change). Home wall, Fabrication industry page, ISO 9001 page |
| 02 | `platform-automotive.png` | 1672×941 PNG | `public/images/hero/`. Home wall, Automotive industry page, IATF 16949 page |
| 03 | `platform-medical-device.png` | 1672×941 PNG | `public/images/hero/`. Home wall, Healthcare & Medical Devices page, ISO 13485 page |
| 04 | `platform-aerospace.png` | 1672×941 PNG | `public/images/hero/`. Home wall, Aerospace & Defence page, AS9100 page |
| 05 | `platform-food-beverage.png` | 1672×941 PNG | `public/images/hero/`. Home wall, Food & Beverage page, ISO 22000 page |
| 06 | `platform-electronics.png` | 1672×941 PNG | `public/images/hero/`. Home wall, Manufacturing industry page |
| 07 | `platform-receiving.png` | 1672×941 PNG | `public/images/hero/`. Home wall, Supplier Quality context |
| 08 | `platform-training.png` | 1672×941 PNG | `public/images/hero/`. Home wall |
| 09 | `platform-environmental.png` | 1672×941 PNG | `public/images/hero/`. ISO 14001 page, Oil, Gas & Energy and Mining pages |
| 10 | `platform-safety.png` | 1672×941 PNG | `public/images/hero/`. ISO 45001 page, Construction page |
| 11 | `platform-infosec.png` | 1672×941 PNG | `public/images/hero/`. ISO/IEC 27001 page |
| 12 | `platform-continuity.png` | 1672×941 PNG | `public/images/hero/`. ISO 22301 page |
| 13 | `platform-lab.png` | 1672×941 PNG | `public/images/hero/`. ISO/IEC 17025 page, Assets module context |
| 14 | `demo-box-tablet.png` | 600×600 WebP | `public/images/demo-box-tablet.webp`. End of every blog post and guide |
| 15 | `og-platform-bg.png` | 1200×630 JPG with text | `public/images/og-default.jpg` is replaced by the new card |
