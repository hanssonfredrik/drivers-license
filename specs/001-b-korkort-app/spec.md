# Feature Specification: B-Körkortsappen — Teoriträning för Svenskt B-Körkort

**Feature Branch**: `001-b-korkort-app`
**Created**: 2026-03-17
**Status**: Draft
**Input**: User description: "Skapa en körkortsapp med alla frågor som är relevanta för att man ska kunna ta ett B-körkort i Sverige. Det ska finnas både instuderingsfrågor och quiz. Detta ska bli den optimala körkortsappen. Den ska vara enkel att använda med ett intuitivt gränssnitt som samtidigt ska vara roligt att använda. Appen ska vara på svenska."

## Clarifications

### Session 2026-03-17

- Q: Hur ska appen skapa en "rolig" upplevelse (gamification)? → A: Kombination av streaks, badges OCH XP/nivåer (Duolingo-stil).
- Q: Vilken fördelning av frågor per ämnesområde ska gälla i quiz-läget? → A: Viktad — Trafikregler 30 %, Trafiksäkerhet 25 %, Fordonskännedom 20 %, Miljö 15 %, Personliga förutsättningar 10 %.
- Q: Ska användaren kunna exportera/importera framsteg mellan enheter? → A: Nej — enbart lokal lagring utan export/import (MVP-scope).
- Q: Hur stor andel av frågebanken ska innehålla bilder? → A: ~20 % bildfrågor, fokuserade på vägmärken och trafiksituationer.
- Q: Ska användaren kunna granska sina svar fråga för fråga efter avslutat quiz? → A: Ja — fullständig granskning med rätt/fel-markering och förklaring för varje fråga.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Plugga teori per ämnesområde (Priority: P1)

En användare som förbereder sig för kunskapsprovet vill kunna välja ett av de fem officiella ämnesområdena (Trafikregler, Trafiksäkerhet, Fordonskännedom och manövrering, Miljö, Personliga förutsättningar) och studera frågor inom det området. Varje fråga visas med flervalssvar. Efter att användaren svarat visas direkt om svaret var rätt eller fel, tillsammans med en kort förklaring. Användaren kan stega genom frågorna i valfri takt.

**Why this priority**: Utan instuderingsfrågor har appen inget kärnvärde. Att kunna plugga per ämne speglar hur kunskapsprovet är uppbyggt och ger användaren strukturerad inlärning.

**Independent Test**: Kan testas helt fristående genom att öppna appen, välja ett ämne och besvara frågor. Levererar omedelbart studievärde.

**Acceptance Scenarios**:

1. **Given** användaren befinner sig på startsidan, **When** hen väljer "Instudering" och sedan ämnet "Trafikregler", **Then** visas frågor ur kategorin Trafikregler med flervalssvar.
2. **Given** en fråga visas med fyra svarsalternativ, **When** användaren väljer ett alternativ, **Then** markeras rätt svar grönt och eventuellt fel svar rött, samt en förklaringstext visas.
3. **Given** användaren har besvarat en fråga, **When** hen trycker "Nästa", **Then** visas nästa fråga i ämnet.
4. **Given** användaren har besvarat alla frågor i ett ämne, **When** sista frågan besvaras, **Then** visas en sammanfattning med antal rätt/fel och en knapp att gå tillbaka.

---

### User Story 2 — Provliknande quiz med tidsgräns (Priority: P2)

En användare vill simulera det riktiga kunskapsprovet genom att göra ett quiz med 65 poänggrundande frågor, blandade från alla fem ämnesområden, på maximalt 50 minuter. När tiden löper ut eller användaren avslutar visas ett resultat: godkänd (52+ rätt) eller underkänd, samt uppdelning per ämne.

**Why this priority**: Quiz-funktionen ger användaren möjlighet att mäta sin faktiska provberedskap och simulerar den verkliga provsituationen. Det är den näst viktigaste funktionen efter instuderingen.

**Independent Test**: Kan testas genom att starta ett quiz och besvara alla frågor. Resultatsidan visar godkänt/underkänt.

**Acceptance Scenarios**:

1. **Given** användaren väljer "Quiz" på startsidan, **When** quizet startar, **Then** visas en nedräkningstimer på 50 minuter och fråga 1 av 65.
2. **Given** quizet pågår, **When** användaren besvarar en fråga, **Then** kan hen navigera vidare utan att svar avslöjas (ingen direkt feedback under quiz).
3. **Given** alla 65 frågor har besvarats eller tiden gått ut, **When** resultatsidan visas, **Then** ser användaren totalpoäng, godkänd/underkänd-markering (gräns 52 rätt), samt poäng per ämnesområde.
4. **Given** resultatsidan visas, **When** användaren trycker "Granska svar", **Then** kan hen bläddra genom alla 65 frågor med sitt svar, rätt svar markerat och förklaringstext.
5. **Given** användaren har mer än 10 minuter kvar, **When** hen trycker "Avsluta quiz", **Then** ombeds hen bekräfta valet innan resultatet visas.

---

### User Story 3 — Se framsteg och statistik (Priority: P3)

En användare vill kunna se sin studiehistorik: hur många frågor hen svarat på, andel rätt per ämne och hur det går över tid. Syftet är att motivera och synliggöra svaga områden att prioritera.

**Why this priority**: Framstegsöversikten motiverar fortsatt pluggande och hjälper användaren att fokusera på svaga ämnesområden. Kräver att instudering (P1) eller quiz (P2) redan fungerar.

**Independent Test**: Kan testas genom att svara på frågor i instudering eller quiz, sedan öppna statistiksidan och verifiera att resultat visas korrekt.

**Acceptance Scenarios**:

1. **Given** användaren har svarat på minst 10 frågor totalt, **When** hen öppnar "Statistik", **Then** visas andel rätt per ämnesområde i ett visuellt diagram.
2. **Given** användaren har gjort minst 2 quizförsök, **When** hen öppnar "Statistik", **Then** visas en tidslinje med resultat per quiz.
3. **Given** användaren inte har svarat på några frågor ännu, **When** hen öppnar "Statistik", **Then** visas ett uppmuntrande tomt-tillstånd med text som föreslår att börja studera.

---

### User Story 4 — Vägmärken och skyltar-referens (Priority: P4)

En användare vill kunna bläddra bland alla svenska vägmärken och trafikskyltar som en uppslagsbok, organiserade efter kategori (förbudsmärken, varningsmärken, påbudsmärken, informationsmärken, vägmarkeringar, etc.) med bild och förklaring.

**Why this priority**: Vägmärken är en betydande del av kunskapsprovet. En dedikerad referensdel gör appen till ett komplett studieverktyg, men frågorna (P1) måste fungera först.

**Independent Test**: Kan testas genom att öppna vägmärkessektionen och bläddra bland kategorier. Varje märke visas med bild och beskrivning.

**Acceptance Scenarios**:

1. **Given** användaren öppnar "Vägmärken", **When** sidan laddas, **Then** visas kategorier (Varningsmärken, Förbudsmärken, Påbudsmärken, Informationsmärken, Tilläggstavlor, Vägmarkeringar).
2. **Given** användaren väljer en kategori, **When** listan visas, **Then** visas varje skylt med bild/ikon och kort beskrivning av dess innebörd.
3. **Given** användaren trycker på ett specifikt vägmärke, **When** detaljvyn öppnas, **Then** visas fullständig förklaring, var märket vanligtvis förekommer och eventuell relevant trafikregel.

---

### User Story 5 — Bokmärk svåra frågor (Priority: P5)

En användare som stöter på frågor de tycker är extra svåra vill kunna bokmärka dem och senare kunna öva specifikt på dessa bokmärkta frågor.

**Why this priority**: Personaliserad repetition förbättrar inlärningseffekten avsevärt, men kräver att frågefunktionaliteten (P1) redan är på plats.

**Independent Test**: Kan testas genom att bokmärka frågor under instudering och sedan öppna bokmärkeslistan och studera därifrån.

**Acceptance Scenarios**:

1. **Given** en fråga visas under instudering, **When** användaren trycker på bokmärkesikonen, **Then** markeras frågan som bokmärkt med visuell bekräftelse.
2. **Given** användaren har minst 3 bokmärkta frågor, **When** hen öppnar "Bokmärkta frågor", **Then** visas alla bokmärkta frågor och hen kan studera dem som en serie.
3. **Given** en fråga redan är bokmärkt, **When** användaren trycker bokmärkesikonen igen, **Then** tas bokmärket bort.

---

### Edge Cases

- Vad händer om användaren stänger appen mitt i ett quiz? → Quizframsteg sparas lokalt och kan återupptas vid nästa besök.
- Vad händer om nedräkningstimern når noll under ett quiz? → Quizet avslutas automatiskt och resultatsidan visas med de frågor som hann besvaras.
- Vad händer om en användare har besvarat alla frågor i ett ämne? → Frågorna kan repeteras, men ordningen blandas om.
- Hur hanteras skärmstorlekar? → Gränssnittet ska vara mobilanpassat (responsive) som primär plattform, med stöd för desktop.
- Vad händer vid avbruten nätverksanslutning? → Appen ska fungera offline efter första laddning (all frågedata bundlas med appen).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Systemet MÅSTE innehålla minst 1 000 unika flervalsfrågor som täcker alla fem ämnesområden i det svenska B-körkortets kunskapsprov (Trafikregler, Trafiksäkerhet, Fordonskännedom och manövrering, Miljö, Personliga förutsättningar).
- **FR-002**: Varje fråga MÅSTE ha exakt ett korrekt svar och 3 felaktiga distraktorer.
- **FR-003**: Varje fråga MÅSTE ha en förklaringstext som visas efter svar i instuderingsläge.
- **FR-004**: Systemet MÅSTE kategorisera frågor enligt Trafikverkets fem officiella ämnesområden.
- **FR-005**: Instuderingsläget MÅSTE ge omedelbar återkoppling (rätt/fel + förklaring) efter varje svar.
- **FR-006**: Quizläget MÅSTE simulera kunskapsprovet: 65 poänggrundande frågor, 50 minuters tidsbegränsning, fördelade enligt viktning — Trafikregler 30 % (~20 frågor), Trafiksäkerhet 25 % (~16 frågor), Fordonskännedom 20 % (~13 frågor), Miljö 15 % (~10 frågor), Personliga förutsättningar 10 % (~6 frågor).
- **FR-007**: Quizläget FÅR INTE visa om svaret är rätt eller fel förrän quizet avslutats.
- **FR-008**: Resultatsidan efter quiz MÅSTE visa totalpoäng, godkänd/underkänd (gräns: 52 av 65) och fördelning per ämnesområde.
- **FR-009**: Systemet MÅSTE spara användarens framsteg, statistik och bokmärken lokalt i webbläsaren.
- **FR-010**: Systemet MÅSTE inkludera en vägmärkes-referenssektion med bilder och beskrivningar av alla svenska vägmärken, organiserade per kategori.
- **FR-011**: Användaren MÅSTE kunna bokmärka frågor och studera enbart bokmärkta frågor.
- **FR-012**: Hela gränssnittet MÅSTE vara på svenska.
- **FR-013**: Appen MÅSTE fungera offline efter första laddningen (alla frågor och bilder bundlas lokalt).
- **FR-014**: Gränssnittet MÅSTE vara responsivt med mobil som primär plattform (mobile-first design).
- **FR-015**: Appen MÅSTE visa en visuell statistiköversikt med andel rätt per ämnesområde.
- **FR-016**: Systemet MÅSTE spåra dagliga studiestreaks (antal dagar i rad med minst 1 besvarad fråga) och visa aktuell streak på startsidan.
- **FR-017**: Systemet MÅSTE tilldela milstolpsmärken (badges) vid definierade händelser (t.ex. "Första quiz", "100 frågor besvarade", "Första godkända quiz", "7-dagars streak").
- **FR-018**: Systemet MÅSTE tilldela XP-poäng för varje rätt svar och visa en nivå/level baserad på ackumulerade XP.
- **FR-019**: Systemet MÅSTE visa visuella belöningar (animationer) vid uppnådd milstolpe, avklarad streak eller ny nivå.
- **FR-020**: Minst 20 % av frågebanken MÅSTE innehålla bildfrågor (bild som del av frågetexten), fokuserade på vägmärken i kontext och trafiksituationer.
- **FR-021**: Efter avslutat quiz MÅSTE användaren kunna granska alla 65 frågor med sitt svar, rätt svar markerat, och förklaringstext för varje fråga.

### Key Entities

- **Fråga (Question)**: En teoriuppgift med frågetext, fyra svarsalternativ (varav ett korrekt), förklaringstext, ämnesområde och valfritt bildunderlag. Cirka 20 % av frågorna ska ha bild (vägmärken, trafiksituationer).
- **Ämnesområde (Category)**: Ett av de fem officiella kunskapsområdena som Trafikverket bedömer: Trafikregler, Trafiksäkerhet, Fordonskännedom och manövrering, Miljö, Personliga förutsättningar.
- **Quiz (Quiz Session)**: En provomgång bestående av 65 frågor med tidsbegränsning 50 minuter, blandat från alla ämnesområden. Har status (pågående/avslutad) och slutresultat.
- **Framsteg (Progress)**: Aggregerad statistik per användare: antal besvarade frågor, andel rätt per ämne, quizhistorik med datum och poäng.
- **Vägmärke (Road Sign)**: En trafikskylt med bild, namn, kategori (varningsmärke, förbudsmärke, etc.) och beskrivningstext.
- **Bokmärke (Bookmark)**: En koppling mellan en användare och en fråga som markerats som "svår" för riktad repetition.
- **Streak**: Antal sammanhängande dagar användaren har besvarat minst en fråga. Återställs till 0 vid en missad dag.
- **Badge (Milstolpsmärke)**: En visuell utmärkelse som låses upp vid specifika händelser (t.ex. "100 frågor", "Första godkända quiz").
- **XP & Nivå**: Erfarenhetspoäng som ackumuleras per rätt svar. Nivåer beräknas från total XP med stigande tröskel per nivå.

## Assumptions

- Frågebanken bygger på allmänt tillgänglig körkortsteori utifrån gällande svenska trafikregler, inte på Trafikverkets hemliga provfrågor (dessa är konfidentiella).
- Appen riktar sig till privatpersoner som pluggar på egen hand — den ersätter inte riskutbildning eller körträning.
- Ingen användarregistrering krävs; all data sparas lokalt i webbläsaren. Ingen export/import eller molnsynk ingår i MVP.
- Vägmärkesbilder produceras som SVG-ikoner eller hämtas från offentliga källor med korrekt licens.
- Frågedistributionen i quiz följer en definierad viktning: Trafikregler 30 %, Trafiksäkerhet 25 %, Fordonskännedom 20 %, Miljö 15 %, Personliga förutsättningar 10 %.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Användare ska kunna starta instudering inom 3 tryck/klick från startsidan.
- **SC-002**: 90 % av användare som påbörjar ett quiz ska kunna slutföra det utan att stöta på tekniska problem.
- **SC-003**: Appen ska ladda interaktivt (första fråga synlig) inom 3 sekunder på en genomsnittlig mobiltelefon.
- **SC-004**: Användare som använder appen regelbundet (minst 3 sessioner) ska visa mätbar förbättring i sin quizpoäng över tid.
- **SC-005**: Minst 1 000 frågor ska finnas tillgängliga fördelade över alla fem ämnesområden vid lansering.
- **SC-006**: Appen ska fungera fullständigt utan internetanslutning efter första besöket.
- **SC-007**: Gränssnittet ska klara tillgänglighetstest (färgkontrast WCAG AA-nivå) och vara användbart med enbart tangentbord.
