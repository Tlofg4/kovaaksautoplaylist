---

# Playlist Recommendation System

## Objetivo

Analizar el benchmark de un jugador, identificar sus debilidades relativas y recomendar las playlists más relevantes de los CSVs disponibles.

**Inputs requeridos:**
- Screenshot del benchmark con scores por categoría
- CSVs de playlists (con nombre, descripción, creador y share code)

---

## Proceso — Pasos en Orden

### Paso 0 — Normalizar Scores por Tier (OBLIGATORIO antes de comparar)

Las tablas de benchmark muestran columnas de tier en un orden creciente ESTRICTO.
El orden completo y oficial de menor a mayor es:
Lemming < Hare < Ermine < Puffin < Penguin < Fox < Mammoth < Orca < Seal < Cinnabar < Vermillion < Saffron < Celadon < Viridian < Cerulean < Lavender < Indigo < Fuchsia < Wool < Rayon < Linen < Velvet < Chiffon < Tricot < Satin < Silk < Interloper < Attuned < Heroic < Mythic < Ascension < Eclipse

El "%" junto al score NO es una medida absoluta de habilidad.
Es el progreso dentro del tier actual hacia el siguiente tier.

Para cada escenario:
1. Determinar el TIER ALCANZADO comparando el score contra las
   columnas (el tier es la última columna que el score iguala o supera).
2. Registrar (tier_alcanzado, % dentro del tier) como par, NO solo el %.

REGLA DE COMPARACIÓN:
- Nunca comparar el % de dos escenarios directamente si no se ha
  verificado primero que están en el MISMO tier.
- Si tier A < tier B, el escenario en tier A es la debilidad relativa,
  sin importar que su % parezca más alto.
- Si tier A == tier B, ENTONCES sí comparar % como desempate.

Ejemplo de error a evitar:
  Escenario X: tier Cinnabar, 99%
  Escenario Y: tier Celadon, 37%
  → Y es muy superior a X, aunque 37% < 99%.

---

### Paso 1 — Analizar el Benchmark

Extraer del screenshot:
- Categorías y subcategorías evaluadas
- Debilidades **relativas** (no solo scores bajos en absoluto)
- Fortalezas relativas

> **Importante:** Comparar el perfil del jugador contra sí mismo, no contra un estándar fijo.
>
> *Ejemplo:* Si el jugador tiene Seal en Precision pero Penguin en Fingertip Control, entonces Fingertip Control es prioridad — aunque no sea el score más bajo del benchmark completo.

---

### Paso 2 — Construir la Lista de Debilidades

Crear un ranking ordenado de debilidades. Para cada una, explicar:
- Por qué es una debilidad (contexto del benchmark)
- Qué habilidad representa
- Qué errores comunes causan un score bajo en esa área

*Ejemplo de lista:*
1. Fingertip Control
2. Wrist Control
3. Speed TS
4. Reactive Reading
5. Precision Stability

---

### Paso 3 — Buscar en los CSVs

Buscar en todos los archivos CSV usando:
- Nombre de la playlist
- **Descripción de la playlist** ← prioridad más alta

> Las descripciones tienen mayor peso que los nombres.
>
> *Ejemplo — malo:* `"Reactive Playlist"`
> *Ejemplo — bueno:* `"Focuses on reading acceleration changes and target movement adaptation."`

---

### Paso 4 — Inferir el Propósito de Cada Playlist

Para cada playlist candidata, determinar:
- Categoría primaria
- Categoría secundaria
- Dificultad
- Habilidad objetivo

*Categorías posibles:* Control Tracking · Reactive Tracking · Dynamic Clicking · Precision Clicking · Target Switching · Reading · Stability · Speed · Microcorrections · Smoothness

---

### Paso 5 — Hacer el Match con las Debilidades

Para cada debilidad, encontrar las playlists que la entrenan. Orden de preferencia:

1. Entrena directamente esa debilidad
2. La entrena de forma indirecta
3. Mejora general (solo como último recurso)

---

### Paso 6 — Filtrar Recomendaciones Débiles

Descartar una playlist si:
- Su descripción es vaga o genérica
- No tiene relación con la debilidad identificada
- El overlap es mínimo
- Entrena fortalezas del jugador en lugar de debilidades

---

### Paso 7 — Producir las Recomendaciones

Para cada playlist recomendada, incluir:

| Campo | Contenido |
|---|---|
| **Creador** | Nombre del creador |
| **Playlist** | Nombre de la playlist |
| **Share Code** | Código para importar |
| **Por qué se recomienda** | Justificación concreta |
| **Debilidad que trabaja** | Nombre exacto de la debilidad |
| **Mejora esperada** | Qué aspecto debería mejorar |

---

### Paso 8 — Priorizar

Organizar las recomendaciones en tres niveles:

- **Top Priority** — Las playlists de mayor impacto sobre las debilidades principales
- **Secondary** — Útiles pero no críticas
- **Optional** — Mejora general o complementaria

---

### Paso 9 — Explicar el Razonamiento

Para cada recomendación, explicar:
- Por qué se eligió esta playlist
- Por qué se descartaron otras candidatas
- Qué debilidad del benchmark trabaja específicamente

> No recomendar ninguna playlist sin justificación.

---

### Paso 10 — Fallback si No Hay Match

Si no existe una playlist que encaje bien con una debilidad: **no forzar la recomendación.**

En cambio, entregar:

```
No se encontró una playlist altamente relevante para esta debilidad.

Términos de búsqueda sugeridos:
  - [término exacto]
  - [término amplio]
  - [término alternativo]

Creadores sugeridos para revisar:
  - [creador 1]
  - [creador 2]

Razón: Las playlists disponibles no cubren específicamente esta área.
```

---

## Output Final

```
## Análisis de Debilidades
[Ranking con explicación de cada debilidad]

## Playlists Top Priority
[Recomendaciones con todos los campos del Paso 7]

## Playlists Secondary
[ídem]

## Playlists Optional
[ídem]

## Plan de Entrenamiento

### Estructura de bloques

1. **Bloque de Benchmark**
   Medir progreso periódicamente usando el mismo benchmark para
   detectar el cuello de botella actual.
   - Comparar tier alcanzado, no solo %.
   - Re-evaluar el ranking de debilidades cada vez.
   - No entrenar a ciegas: el benchmark decide qué se entrena después.

2. **Bloque de Debilidad (Weakness)**
   Atacar la debilidad #1 del ranking usando las playlists de Top Priority.
   Criterio de salida — NO es tiempo fijo, es progreso real:
   - Entrenar esta debilidad en la MAYORÍA de las sesiones de práctica
     hasta que el benchmark muestre que subió de tier (o cerró el
     desfase de % dentro del mismo tier) y dejó de ser el cuello de
     botella principal.
   - Empezar siempre por la variante más fácil disponible antes de
     subir dificultad.
   - Cuando deja de ser la debilidad #1, se pasa a la siguiente del
     ranking (#2, luego #3...).

### Cómo combinarlos
Benchmark → decide qué entrenar → Weakness. Repetir el ciclo después
de cada medición.
```

---

## Referencia A — Sistema de Dificultad y Tiers (Viscose Benchmarks S2)

El orden de los Tiers de menor a mayor es ESTRICTO e inalterable. 
Un escenario en un Tier inferior SIEMPRE representa una mayor debilidad que uno en un Tier superior.

Orden completo (de Peor a Mejor):
Lemming < Hare < Ermine < Puffin < Penguin < Fox < Mammoth < Orca < Seal < Cinnabar < Vermillion < Saffron < Celadon < Viridian < Cerulean < Lavender < Indigo < Fuchsia < Wool < Rayon < Linen < Velvet < Chiffon < Tricot < Satin < Silk < Interloper < Attuned < Heroic < Mythic < Ascension < Eclipse

Agrupación por Dificultad (en orden de progresión interna):
- **EASIER:** Lemming < Hare < Ermine < Puffin < Penguin < Fox < Mammoth < Orca < Seal
- **MEDIUM:** Cinnabar < Vermillion < Saffron < Celadon < Viridian < Cerulean < Lavender < Indigo < Fuchsia
- **HARD:** Wool < Rayon < Linen < Velvet < Chiffon < Tricot < Satin < Silk
- **EXPERT:** Interloper < Attuned < Heroic < Mythic < Ascension < Eclipse

---

## Referencia B — Términos de Búsqueda por Debilidad

| Debilidad | Términos de búsqueda |
|---|---|
| Control Tracking – Wrist | wrist control · wrist tracking · control tracking wrist · smooth wrist · smoothness |
| Control Tracking – Fingertip | fingertip control · fingertip tracking · smoothness · precision tracking · smooth tracking |
| Reactive Tracking | reactive tracking · acceleration tracking · speed tracking · reading · movement reading |
| Reactive Tracking – Speed | speed tracking · fast reactive · acceleration · reading speed · high speed tracking |
| Target Switching – Speed | speed ts · speed switching · fast switching · target switching speed · dynamic switching |
| Target Switching – Stability | stable switching · precision switching · control switching · micro switching |
| Static Clicking – Speed | speed static · speed clicking · fast static · static speed · wide static |
| Static Clicking – Stability | static stability · precise static · controlled clicking · micro correction · click stability |
| Micro Flicks | micro flick · micro correction · precise flick · small flicks · correction training |
| Flick Stability | flick stability · stable flicks · precision flicks · controlled flicks · stopping power |
| Click Timing – Precision | click timing · precision timing · reading clicks · timing precision |
| Click Timing – Reading | reading · movement reading · prediction · click timing reading |
| Smoothness | smoothness · smooth tracking · smooth aim · precision tracking · control tracking |

---

## Referencia C — Índice de CSVs por Creador

Déjame leer todos los archivos primero.Perfecto, ya leí todo. Aquí está el índice completo:

---

## Índice de CSVs — Tipos de Rutinas

### 📁 4BangerKovaaks — 100+ playlists
| Categoría | Ejemplos |
|-----------|---------|
| Smoothness / Control Tracking | Guaranteed Smoothness Fix, SYA Smoothness, Smooth Regen, Fire & Ice |
| Reactive Tracking | Guaranteed Reactive Fix, SYA Reactive, Reactive Strafes |
| Target Switching Speed | Buy My Coaching (TS), Corrective Flicking, Speed TS |
| Static Clicking | Static GOD, Static Conditioning, Accuracy + Flicking |
| Tracking General | Full Tracking Mastery, Tracking Conditioning, Best Tracking Scenarios |
| Fundamentals / Beginner | ZTH Weeks 0-3, FAR Days 1-7, Beginner Fundamentals |
| Variety / Game-specific | FAR completo, Fortnite, CS2/VAL, COD/BF |

---

### 📁 MattyOW — ~80 playlists
| Categoría | Ejemplos |
|-----------|---------|
| Precise Tracking | Jade Purge - Precise Tracking, DCC Precise, Matty Routine 3 |
| Reactive Tracking | Jade Purge - Reactive Tracking, DCC Reactivity, Matty Routine 2 |
| Static Clicking | Jade Purge - Static Clicking, DCC Statics, Matty Routine 1 |
| Dynamic Clicking | Jade Purge - Dynamic Clicking, DCC XY/Arc Dynamic |
| Evasive / Speed TS | Jade Purge - EvasiveTS, Jade Purge - SpeedTS, Oblivion |
| Smoothness | Parkinson's Cure, sm00th |
| Switching | DCC Switching, Matty Routine 6 |
| Strafe Tracking | DCC Strafe, Matty Routine 7 |
| Game-specific | OW Ultimate Routine, Pathfinders series |

---

### 📁 m0narcS — 200+ playlists (el más grande)
| Categoría | Ejemplos |
|-----------|---------|
| Control Tracking | Control Those Spheres, Control Prison, Raven Control Tracking, M&H Control Benchmarks |
| Reactive Tracking | Reactive Captivity, Reactive Fundamentals, M&H Reactive Benchmarks, hizkuRawReactive |
| Precise Tracking | Precise Tracking, Raven Precise Tracking, M&H Precise Benchmarks |
| Smoothness / X&Y | Smoothness Jail, Smoothness Chamber, X&Y Smoothness Isolation, 20cm Smoothness |
| Micro Adjustments | Angelic, Micro Heaven, Avasive Micro, Nomy Micro Tech |
| Flick Tech | Flick Tech Stability & Fluidity, Yoxie Flick Tech, AURABOROS Flick |
| Target Switching | Switching, Battlefield TS, WAITER MORE TARGETS, tamTS |
| Evasive Tracking | Avasive Scenarios, Evasive Targets, Avasive S1 series |
| Click Timing | AURABOROS Click Timing, Akame Clicking |
| Static | Static 2026 Grind, Static Clicking |
| Stability | TacFPS Stability, Rimu Stability, Tremor Removal |
| Benchmarks propios | M&H Tracking/Control/Reactive, Elusive Tracking, Wallhack, Euphoric TacFPS |
| Warmups | Daily Warmup, TacFPS Warmup, Technique Warmup |

---

### 📁 Viscose — ~60 playlists
| Categoría | Ejemplos |
|-----------|---------|
| Control Tracking | Controlled Tracking, Patreon Playlist - Tracking, StrafingFlame Tracking |
| Stability / Fine Control | Airen Stability and Fine Control, Domi Playlist Stability, GLaDOS Stability |
| Undertracking | Undertracking Heaven v2 |
| Target Switching | Bucket SpeedTS / EvasiveTS Fundamentals, viscose 2025 TS list |
| Dynamic | Bucket Dynamic Fundamentals |
| Pokeball / Static | Viscose Recommended Pokeball Scenarios, static ts stuff |
| Iso / Arm Tracking | Iso Tracking |
| Flick Speed | Elige Flick Speed+acc, Twistzz Flicking Technique |
| Precision Clicking | Elige Precise Clicking, Elige Wide Flicks |
| Warmups | Euriece Warmup, Bucket Val Warmup |
| Weekly programs | Bucket Mon-Fri, Dominika Mon-Fri, BigMeech Mon-Fri, StrafingFlame Days |

---

### 📁 minigod — 100+ playlists
| Categoría | Ejemplos |
|-----------|---------|
| Flick Tech | dav1g flick-tech, Patrick Flick-Tech Speed, steinful flicktech |
| Micro Adjustments / Discipline | Kajaak Micro-Discipline, chron micro, Vind Micro-Correction |
| Static | minigodcs - statics, KnightMare Static GOAT |
| Smooth Flick Tech | HZ Smooth Flick Tech, HZ W2 Smoother Flick-Tech |
| Target Reading | HZ W3 Target Reading |
| Speed / Reflex | HZ R2 Flick n Reflex, Pa1nt Speed-Matching n Micros |
| Warmup | KJK RAMP WARMUP, Kajaak Warmup, HZ Warmup |
| Weekly programs | Kajaak W1-W5, Patrick W1-W3, HZ Week series |
| Valorant | pro players routines |

---

### 📁 wapaam! — 200+ playlists
| Categoría | Ejemplos |
|-----------|---------|
| Micro Adjustments | VA Micro, micro 1, loversrock micro, Mumble micros |
| Horizontals / Click Timing | horizontal, V25 Horizontals, click timing maps |
| Post-flick | loversrock post, post-micro, landing transition to micro |
| Static Clicking | luke static, static his micros, STATIC DAILY |
| Switching / Evasive | VA Switching, zzz switching, ('Z_Z) Lite |
| Dynamic / Wavy | ('W_W), dynamique, MicroDynamics |
| Fundamentals | valorant fundamentals, chadz fundamental build |
| Warmups | Valorant Warm-up series, BBL Warm-up |
| Personal programs | Kozzy W1-W7, loversrock series, Iluri, Mumble, etc. |

---

### 📁 thundah — ~80 playlists
| Categoría | Ejemplos |
|-----------|---------|
| Precise Tracking | thundah precise tracking S1/S2, CDIM Precise, rA Precise |
| Reactive Tracking | CDIM Reactive, VT Reactive, THURSDAY Reactive |
| Smooth Tracking | CDIM Smooth, WEDNESDAY Smooth, XYZ Smoothness Benchmarks |
| Static Clicking | CDIM Static, TUESDAY Static |
| Dynamic Clicking | CDIM Dynamic, MONDAY Dynamic |
| Speed Switching | CDIM Speed, FRIDAY Speed |
| Evasive Switching | CDIM Evasive, SATURDAY Evasive |
| Benchmarks propios | XYZ Benchmarks Easy/Hard, MIRA Benchmarks, rA Benchmarks |
| CDIM completo | Daily Improvement Method por categoría |

---

### 📁 cartoon — ~35 playlists
| Categoría | Ejemplos |
|-----------|---------|
| Flick Tech | Flicks Basicos, Tyler Flick Tech, Soft's Flick Tech, ATMN Speed Management |
| Micro Adjustments | Microajustes Basicos, Jab's Val Micros |
| Speed Management | Gusel Speed Management, devin's Speed Tech |
| Initial Flick Development | Lilo Initial Flick, HiGiDi Initial Flick |
| Tracking | best tracking routine ever, Chonk's Basic Tracking |
| Smooth Acquisitions | Persa Smooth Acquisitions, EdRoadtoSMOOTHNESS |

---

### 📁 AnimaAim — ~55 playlists
| Categoría | Ejemplos |
|-----------|---------|
| Click Timing | MM - Click Timing, raine Click Timing |
| Micro Adjustments | MM - Micro Adjustments, raine Micro Adjustments |
| Reactivity / Reading | MM - Reactivity x Target Reading, raine Target Reading |
| Stability | MM - Stability, raine Stability |
| Target Confirmation | MM - Target Confirmation |
| Evasive TS | anima evasiveTS favourites |
| Control / Linear | anima control favourites, anima linear favourites |
| Dynamic | anima dynamic favourites |
| TacFPS Micro | anima TacFPS micro heaven easy/hard |
| Fundamentals | MIRA x Anima Clicking/Tracking/Switching |
| Benchmarks | Anima Micro Benchmark v2 |

---

### 📁 Anima — ~30 playlists (distinto de AnimaAim)
| Categoría | Ejemplos |
|-----------|---------|
| Static | anima static, Anima - Static Scenarios/Benchmark |
| Stopping Power | Anima^ - Stopping Power |
| Micro Control | Anima^ - Micro Control |
| Smoothness | Anima - Bilek^Kol Smoothness, mammy smoothness |
| Dynamic | Anima - Dynamic Scenarios |
| Speed | anima daffy speed routine |
| Pokeball | Anima - Pokeball |

---

### 📁 F3zyX — ~23 playlists
| Categoría | Ejemplos |
|-----------|---------|
| Reactive/Precise Tracking | QrowxClover Reactive Tracking, QrowxClover Precise Tracking |
| Target Switching | QrowxClover Target Switching |
| Tracer/Movement-specific | QrowxClover Tracer Playlist, crysis tracking arc |
| Smoothness/Precision | fusah - smoothness & precision |
| Benchmarks | meow Benchmarks, rA kvk s1/s2, Sparky benchmarks, Sasukiri Tracer (con score targets) |

---

### 📁 Tammas Dexter — ~9 playlists
| Categoría | Ejemplos |
|-----------|---------|
| Benchmarks oficiales | Voltaic Novice/Intermediate/Advanced Benchmarks S5 |
| Rutinas personalizadas | Routine for Ragus (Bronze), Tammas' Frog House |
| Most played | Most played 500 |

---

### 📁 Struth — 9 playlists
| Categoría | Ejemplos |
|-----------|---------|
| Tracking predictivo | Struth AD Tracking Trainers (predictive, no reactive) |
| Educativo/YouTube | Tracking Training - KovaaK's Youtube, Flick Training - KovaaK's Youtube |
| Game-specific | LEGIONFARM Warzone (Beginner/Intermediate/Advanced), Splitgate Warmup 10 Min |

---

### 📁 Trippez — ~35 playlists
| Categoría | Ejemplos |
|-----------|---------|
| Smooth Reactivity/Regen | Trippez Smooth Reactivity 1-4, Trippez Smooth Regen 1-3 |
| Evasive Switching | Trippez Evasive Switching 1-4 |
| Speed (Gotta Go Fast series) | Gotta Go Fast (Clicking/TS/general) 1-3 |
| Static/Dynamic | Trippez Static for Shishigami, Trippez Dynamic for Cebb/Shishigami |
| Valorant | Trippez - IsakS - Valorant (Routine) |

---

### 📁 etherelkgg — ~120 playlists (grande)
| Categoría | Ejemplos |
|-----------|---------|
| Micro | MICRO GOLD MINE, MY MICRO, Valorant Micro God |
| God-Mode series (por skill) | ethSmooth/ethSpeed/ethEvasive/ethStatic/ethSwitch/ethReactive God Mode |
| Dynamic por nivel | ethDynamic Easy/Beginner/Intermediate/Advanced |
| Benchmarks propios | Eth TacFPS Benchmark (Easy/Med/Hard), Valorant Aim Evaluation, EtherelkGG's Valorant Aim Benchmark |
| Fundamentals | Flicking and Space, Sensitivity Calibration, Clicking/Dynamic/TS/Ground/Smooth/Arcs/Air |
| Full Reactive | Reactive Buster 1-3, PAPI's (reaction time) |

---

### 📁 Dokkie — ~38 playlists
| Categoría | Ejemplos |
|-----------|---------|
| Static (no pressure) | Dokkie Static no pressure (fixed), dont stop mouse |
| Smoothness | gramaki smoothness, smoothbot |
| Target Reading | LighthawkFPS - Target Reading (Hard) |
| Game warmup | Dokkie - Game warmup (PatTS/psalmTS/tamTS explicados) |
| Speed (Spid) | Dokkie Spid (50cm+) |

---

### 📁 Fallen — ~38 playlists
| Categoría | Ejemplos |
|-----------|---------|
| Smooth/Reactive/Precise/Dynamic/Static Tracking | psev series (Smooth/Reactive/Dynamic/Static/Fundamental) |
| OW Hitscan | OW2 Hitscan (v2, short, Easier) |
| Bounce | Bounce Tracking |
| TacFPS | Fallen TacFPS, Fallen Balanced Routine |

---

### 📁 wa11p1per — 150+ playlists (muy grande)
| Categoría | Ejemplos |
|-----------|---------|
| Community Benchmarks (CBI/CBW) | CBI Static/Speed/Reactive/Precise/Evasive/Dynamic Clicking, CBW Adaptive Warmup |
| cAt Benchmarks | cAt Benchmarks Easy/Normal/Hard (múltiples versiones) |
| Static Collection | Community Static Collection (varias) |
| Benchmarks propios | AIMERZ+ Benchmarks Hard/Easy S1, Voltaic S5 Advanced |
| Smoothness | !Smooth, FEROCIOUS SMOOTHNESS BENCHMARKS |
| Game-specific | fortnite series (charge, skate, ar/sg prac) |

---

### 📁 rxnown — ~150 playlists (muy grande)
| Categoría | Ejemplos |
|-----------|---------|
| Smoothness compilations | Smoothness Compilation, rx_smooF, rx sMoOFneZz |
| Static | rx static scenarios, BEST STATIC ROUTINE, Staticzz |
| Reactivity | Lorys REACTIVE, Good reactivity playlist, RSI Tracking |
| Precise/Smooth Tracking | A Precise/Smooth Tracking Playlist, Air Tracking Hell |
| Especiales (SY) | SMOOTH YOUR (relajación, sin enfoque en score) |

---

### 📁 mixu — ~48 playlists
| Categoría | Ejemplos |
|-----------|---------|
| Micro | micro, micro2 |
| Tracking (por días) | Day 1-7, Tracking I/II, Tracking short/shorter |
| Reactive/Dynamic/Static | Reactive, Reactive 2, Dynamic, Smooth+Dynamic, Static |
| Game combos | ApexOW (Tracking+Clicking/Arcing/Strafing), Valorant (Static+XY, Clicking+Switching) |

---

### 📁 Lowgravity56 — ~50 playlists
| Categoría | Ejemplos |
|-----------|---------|
| VDIM (Voltaic Daily Improvement Method) | A-G (Dynamic/Static/Smooth/Reactive/SpeedTS/EvasiveTS/Movement) × (Novice/Intermediate/Advanced/AD PLUS) |
| Multiclick | Multiclick Practice (Novice/Intermediate/Advanced) |
| Benchmarks oficiales | Voltaic Novice/Intermediate/Advanced Benchmarks S4 |
| PGTI / Preciseorb | PreciseOrb Full Practice, Preciseorb Left/Right Focus |
| Warmups | A - Chill/Warm Up Routine |

---

### 📁 cloverISL — 2 playlists
| Categoría | Ejemplos |
|-----------|---------|
| Tracking diaria | VT clover Daily Tracking (Beginner y normal), ~30cm recomendado |

---

### 📁 ness — ~48 playlists
| Categoría | Ejemplos |
|-----------|---------|
| 1 by 1 (threshold method) | ness 1 by 1 - Static/Precise/Dynamic/Reactive/Speed/Evasive |
| Benchmarks | Aimerz+ Reactive/Precise/Dynamic/SpeedTS/Evasive Switching Benchmarks |
| Top Improvement Scenarios | por nivel (Novice/Intermediate/Advanced) |

---

### 📁 divinebeginnings — ~22 playlists
| Categoría | Ejemplos |
|-----------|---------|
| ENV S5 Variants | Raw Control, Controlsphere, PGT, Snake Track |
| Static | Envision's static, Envision Novice Static |
| Pasu/SkyTS | Envision Pasu, SkyTS Training/variants/loop |
| Tracking | Goated tracking scenarios |

---

### 📁 TRAGEDY — ~75 playlists
| Categoría | Ejemplos |
|-----------|---------|
| LAJNUS series (técnica detallada) | LAJNUS Static/Reactive/Precise/Dynamic/Switching/Weaknesses |
| SIDEY Threshold | Static/Precise/Reactive/Dynamic/EvasiveTS/SpeedTS Threshold |
| Coaching personalizado | HaiX Micros (Week 1-4), Kai (Initial Flick/Cluster/Followthrough), Dave (Follow Through/Wide ROM) |
| Overwatch God series | Overwatch Tracking/Soldier/Hitscan/Precision/Clicking God |
| Smoothness | Smoothness God, LILY SMOOTH HAND, no tension basic dynamic |

---

### 📁 Pequeños / Especializados

| Creator | Especialidad |
|---------|-------------|
| **kynave** | Smoothness (underaim, precision, strafe aim), Air variants, VT Tracking diario |
| **darkwizarrddd** | Microajustes (MICRO GOLD MINE, xeus micro, Kajaak micro), TacFPS focus |
| **d3mur** | Micro Speed, warmup antes de VAL, rutina general |
| **e1se** | Tracking por niveles (Novice→Intermediate), Smoothness, Dodge, Flicking |
| **florescent** | Weekly VDIM (días), Sato routines, Benchmark focus |
| **reiuy** | Dynamic XY Arc, TS, Air Standard Reactive, precise control, Tracking Benchmarks |
| **sunflower** | Hit Confirmation, VAL hard |
| **Loita** | Solo 2: Voltaic RAMP Warmup |
| **Lored** | Micro ajustes, flicks, personal routines |
| **A1D** | Mousecontrol, Precision, VT Intermediate/Advanced |

---

Eso es todo lo que necesitas. El flujo ahora es: **benchmark → debilidades → búsqueda → match → output**. Las referencias quedan al final como consulta, sin interrumpir el proceso principal.