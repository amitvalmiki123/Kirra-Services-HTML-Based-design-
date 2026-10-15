# Kirra Services — homepage V2 vs client documents

Sources read in full: `Kirra Services.docx` (brief), `Page Breakdown - Kirra Services.docx`,
`Website Onboarding Form - Kirra Services.docx`, `Copy of Digital Movement _ Kirra Services - Website Project
Questionnaire.docx`, `design guideline.docx`, `Guide.png` / `BRANDING GUIDELINE.png` (brand guide), the Assets
folder, plus the live site, Facebook-sourced images and the YouTube channel the documents point to.
(The two images embedded in the Word files are only the agency logo. `Kirra Design .pdf` is the same
artwork as `Kirra Design .png`.)

## Covered on the homepage
| Requirement (source) | Where |
|---|---|
| Hero banner with a web form on the right (design guideline 1) | Hero slider + "Talk to kirra" form |
| ~1,500–2,000 words, clearly defined content sections (guideline 2) | ~1,710 words, held in tabs, cards, sliders and FAQ |
| FAQ section + FAQPage schema (guideline 3) | 8 questions |
| Get in Touch section with a form (guideline 4) | "Let's talk" |
| Interactive, creative map directly below Get in Touch (guideline 5) | Dark Leaflet map, office chips, Canberra–Darwin route, link per office |
| Identity and purpose lead, services underneath (brief, questionnaire) | Order: hero → Acknowledgement → Who we are → at a glance → business units |
| Acknowledgement of Country prominent, not buried in the footer (brief) | Top band + full section straight after the hero |
| Jobs on the landing page; search by keyword and location; Submit CV; Refer and Reward (brief, questionnaire) | Jobs section (JobAdder feed placeholder) |
| Partners called out properly — Tier 1 vendors (brief, questionnaire) | Apple, Microsoft Surface, i.safe MOBILE feature cards + vendor and client logo rows |
| Wins and awards lifted up (brief, questionnaire) | Awards slider (SEEK, ACSA 2024, CRN Impact 2021, CRN Fast 50 2020 + 2021, Telstra 2022) |
| Business units: AV, Broadcom & professional services, Labour Hire, Pathway & training, Product Sales (questionnaire §06) | "One partner, five ways" bento (Broadcom in the partner logos) |
| Breadth under one provider; security-cleared personnel and payroll; Tier 1 vendors; national incl. regional (brief) | "Built for procurement" + bento |
| Profit for purpose: Kirra on Country 4,000km, Cyber Career Starter Program, regional pathways (brief) | Tabs, at-a-glance band, pathways slider |
| Audience: procurement managers, ICT decision makers, program leads; job seekers (brief) | "Built for procurement" + Jobs |
| Primary CTAs: Find a job + Contact us; secondary: explore business units (brief) | Header, hero, mobile bar |
| Kirra Academy single page within the main site (brief) | Menu item + pathways slide |
| Blog / News migrated (brief) | Latest 3 live posts |
| Team (brief, About) | Team slider |
| Page structure mirrors the current site, nothing dropped (brief, page breakdown) | Full-screen menu = page breakdown, item for item |
| Six location pages (brief) | Footer office links + map links (pages to build next) |
| Newsletter signup (brief) | Footer |
| Integrations: JobAdder stays; timesheets NOT carried across (brief) | No timesheet link anywhere |
| Use YouTube videos and existing site/Facebook imagery (onboarding) | "See kirra in action" video + project slider |
| NAP: +61 2 6196 6999, info@kirraservices.com.au, all 6 addresses (onboarding) | Header, contact, footer, map, schema |
| Social: LinkedIn, Facebook, YouTube, Google Business Profile (brief) | Footer + schema |
| SEO keywords incl. Indigenous procurement IT, First Nations / Aboriginal IT provider, Supply Nation Certified IT provider, ICT managed services, AI, cloud, cyber, AV, hardware & software sales (brief, questionnaire §09) | Used naturally in copy, FAQ, title, meta |
| Colour scheme, logo and artwork link (brief, questionnaire §05, brand guide) | Palette-only backgrounds, client artwork throughout |
| Tone: straight-talking and friendly (brief, questionnaire) | All copy |
| Mobile-first (brief, onboarding) | Checked at 13 widths, 1920 → 320 |
| Trading name (questionnaire §01) | Footer copyright |

## Not on this homepage — later phases or for the client
- **Inner pages** (About, Jobs, Employers, ICT & AV Services, Partners, Contact) and the **six location pages** — next stage after homepage approval.
- **Shopping cart** — questionnaire says "may be phase 2".
- **Content help** — questionnaire asks for extra help improving written content; the bento / unit copy is drafted and needs client sign-off.
- **Approver**: Brad Nagle. Day-to-day contact: Trish Young. Content and imagery: Dom Polegubic and Sam Faraj. Keep brand manager Dana Spasenoska in the loop.
- **Timing**: live before Christmas; client unavailable mid-October and slows down from mid-December; slow feedback turnaround.
- **To confirm**: Acknowledgement of Country wording; "21 vendor partners" count; "Every project gives back" hero line; Kandira commercial licence; clean Kirra on Country poster (current one has a "Grok" watermark).

## Inner pages (built 2026-10-10)
Built from `src/` with `perl build.pl` (shared head/header/Get in Touch + map/footer partials; FAQPage schema is generated from each page's FAQ). Style follows the approved light homepage (`index-v2.html`) plus `css/inner.css`. Content is from the live site, rewritten.

| Page | Sections (menu sub-pages are anchors on the parent page) |
|---|---|
| `about.html` | Our story · Country · Community Give Back · Team (8) · Indigenous Procurement Policy · Panels (tabs) · Awards · News · FAQ |
| `jobs.html` | Find a Job (live filter) · Contracting · Submit CV (form) · Refer and Reward (form) · Scribing · Coaching (tabs) · Career Advice · Training · FAQ |
| `employers.html` | Kirra Talent Acquisition · Government Recruitment · How we recruit · Register a Vacancy (form) · Internship (KIPP) · Cultural Awareness · Why Kirra · FAQ |
| `services.html` | 13 ICT & AV services from the page breakdown + Cloud (from the brief) · Brochures · FAQ |
| `partners.html` | Why partner · How it works · Apple · Microsoft Surface · i.safe MOBILE · Vendors (search + A–Z, 138) · Clients · FAQ |
| `kirra-academy.html` | Training your way · Who it's for · Cyber Career Starter · AV Bootcamp · Courses (filter) · Coaching · FAQ |
| `contact.html` | Five enquiry paths · Visit us · Offices with live local time · Who you'll talk to · What happens next · FAQ |
| `locations.html` | All six offices on ONE page (per kirra910: separate location pages impractical) with local panels and licence info, live clocks, "Show on map" |

Every page: hero with form on the right · sticky "on this page" bar · FAQ + FAQPage schema · Get in Touch form · interactive map directly below.

### To confirm with the client
- Darwin address: onboarding form says Level 4 and 5, 66 Smith St; the live contact page says 10 Catterthun St, Winnellie (and Gapuwiyak). The onboarding address is used.
- Live contact page also lists an Indigenous Business Precinct at 6/12 Albany Street, Fyshwick ACT — not shown; confirm if it should be.
- Team: Milenko Rogic, Ricky Bryan and Annie McKendrick have no photos (initials shown). Marina's role differs between live pages (Procurement vs Sales Support) — "Procurement" used.
- Refer and Reward amount/terms; brochure PDFs (shown as "Request" links); jobs are a static snapshot of the JobAdder board.
- Contact page is ~1,280 words (lighter by nature); all other pages are 1,400–2,300.

## Client changes, 12 October (both homepage versions + inner pages for consistency)
1. Em dashes removed from all visible copy (homepages 43 each, inner pages ~200; map credit line too). The en dash in "Elders – past and present" is the client's own wording.
2. Hero form line: "Tell us what you need and we'll point you to the right part of the team."
3. Acknowledgement of Country paragraph replaced with the client's wording (also used in the footer, About and Employers).
4. Map: the dotted Canberra–Darwin "Kirra on Country" route line removed; pins only. Canberra label now sits left of its pin so it no longer crowds Sydney.

## Homepage Version 3, "Full palette" (12 October)
`index-v3.html` = the approved light V2 (with all 12 Oct changes) re-coloured by `css/v3.css` to use every colour in Guide.png as section and card colours: green Acknowledgement, teal "at a glance" with green/cyan/orange/lime stat cards, multi-colour service and job cards, slate procurement band, lime awards band, teal videos, cyan give-back, lime FAQ panel, teal Get in Touch, colour-coded map pins, and a six-colour brand stripe under the hero and above the footer. White text only on teal/slate/black; dark text on green/orange/cyan/lime (AA). Inner pages still use the V2 look.
Also fixed for all homepages: slideshow controls ran off-screen on phones.
- V3 map (12 Oct): replaced with an office directory + map (`js/map-v3.js`, V3 only). List of six offices with live local time; branded numbered pins (selected = orange); office card with Get directions / phone / office details; "Show all offices" reset; no route line. Phones/tablets: map first, card, then a compact 2-column list.

## V3 feedback, 13 October
- "Culture Awareness Services" link removed from the Acknowledgement of Country section.
- Footer copyright now ends "· Web Design by Digital Movement".
- Sections reordered to the client's list: Hero → Acknowledgement → Who we are → What we do → Our story in numbers → Pathways → Jobs → Built for procurement → Awards → Partners → Team → Videos → News → Find your nearest office → FAQs → Let's talk → Footer.
- Note: the design guideline asks for the map directly below Get in Touch; the client's new order puts the map above the FAQs and contact. Followed the client's order; worth confirming.

## V3 feedback, 14 October
1. Hero H1: "A Proud Indigenous Owned ICT Solution Provider, powered by purpose" (size tuned so it sits on ~4 lines).
2. Feature service card: bold "PROFESSIONAL SERVICES, CYBER, AI" + script "& IT Integration".
3. New "Already on your panel" section after Partners/Trusted by: client copy, three columns (Federal, State & Territory, Local Government), link "View all panels and memberships" → about.html#panels.
4. Our story in numbers, 4th card: "50+" / "Key vendor partners".
