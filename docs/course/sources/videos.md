# Video check

Every YouTube video in `content/resources/catalogue.yaml`, checked on 2026-10-15 for Dimensio's
Blender 5.2 course. Each topic has one to three picks for its lesson, marked "pick", and sometimes
further videos that were checked and are worth a lesson writer's look, marked "also".

## How each column was checked

- **Title, channel, length, upload date:** from `videoDetails` and `microformat` in
  `ytInitialPlayerResponse` on the watch page (`https://www.youtube.com/watch?v=ID&hl=en`), fetched
  with curl and a desktop Chrome user agent. Minutes is `lengthSeconds` rounded to the nearest
  minute, at least 1.
- **Embeddable:** the oEmbed endpoint
  (`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=ID&format=json`) answered 200
  with the same title and channel, `playableInEmbed` is true and `playabilityStatus.status` is `OK`.
  Every video below passed all three, and none answered 401 or 404. All are marked family-safe
  (`microformat.isFamilySafe`).
- **Ids:** every id came from YouTube's search results or a channel's playlist page.
- **Blender:** the version the video was made with, and where that came from. "title" or
  "description" means the video says so. "series description" means another part of the same
  series says so (Blender Guru's 2026 donut series is "remade for Blender 5.0"). "by upload date"
  means the video does not say, and the figure is the Blender release that was current on the day it
  was uploaded (5.0 came out on 2025-11-18 and 5.1 on 2026-03-17, the days Blender published their
  official overviews). Treat "by upload date" as a close estimate. A lesson writer should confirm it
  in the video before a resource line shows it.
- **Content:** read from the title, the description and its chapter list. The videos were not
  watched. A lesson writer watches a video before linking it, as PLAN.md requires.
- Requests went out from a WSL machine. Availability in other countries was not checked.

| Column | Meaning |
| --- | --- |
| Video | YouTube id, linked |
| Title | As on YouTube |
| Min | Length in minutes |
| Catalogue id | The `id` in `content/resources/catalogue.yaml` |

## 1. Installing Blender and the interface

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [kVcY7K-JA1Y](https://www.youtube.com/watch?v=kVcY7K-JA1Y) | Blender 5 Complete Beginners Guide - FREE COURSE - Part 1 - The Interface | Grant Abbitt (Gabbitt) | 13 | 5.0 (title) | yes | 2026-10-15 | `grant-abbitt-interface` |
| pick | [eVRiJYhE0Wk](https://www.youtube.com/watch?v=eVRiJYhE0Wk) | Editors and Windows in Blender - BLENDER 4.5 BASICS (part 15) | CG Cookie – Learn Blender | 20 | 4.5 (title) | yes | 2026-10-15 | `cgcookie-editors-windows` |
| pick | [-tbSCMbJA6o](https://www.youtube.com/watch?v=-tbSCMbJA6o) | Blender Donut Tutorial Part 1 (2026) | Blender Guru | 28 | 5.0 (description) | yes | 2026-10-15 | `blender-guru-donut-part-1` |
| also | [qZIOA7mFaRg](https://www.youtube.com/watch?v=qZIOA7mFaRg) | Introduction to Blender and CG Cookie - BLENDER BASICS (part 0) | CG Cookie – Learn Blender | 12 | 4.5 (description) | yes | 2026-10-15 | `cgcookie-introduction` |
| also | [8XyIYRW_2xk](https://www.youtube.com/watch?v=8XyIYRW_2xk) | Interface Overview - Blender 2.80 Fundamentals | Blender | 11 | 2.80 (title) | yes | 2026-10-15 | `blender-interface-overview` |
| also | [g4OXlrxqIx0](https://www.youtube.com/watch?v=g4OXlrxqIx0) | What's New in Blender 5.2 LTS! Official Overview | Blender | 37 | 5.2 (title) | yes | 2026-10-15 | `blender-whats-new-5-2` |

## 2. Viewport navigation, including laptops

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [i8wO5PEDO1c](https://www.youtube.com/watch?v=i8wO5PEDO1c) | Intro to 3D Navigation in Blender - BLENDER 4.5 BASICS (part 1) | CG Cookie – Learn Blender | 9 | 4.5 (title) | yes | 2026-10-15 | `cgcookie-navigation` |
| pick | [6tYuNEDjgnQ](https://www.youtube.com/watch?v=6tYuNEDjgnQ) | How to Use Blender Without a Numpad (7 Methods) | Ryan King Art | 8 | 3.1 (by upload date) | yes | 2026-10-15 | `ryan-king-without-numpad` |
| pick | [ILqOWe3zAbk](https://www.youtube.com/watch?v=ILqOWe3zAbk) | Viewport Navigation - Blender 2.80 Fundamentals | Blender | 4 | 2.80 (title) | yes | 2026-10-15 | `blender-viewport-navigation` |

## 3. Selecting, transforming, pivots, snapping and orientations

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [lYr25_YeuL8](https://www.youtube.com/watch?v=lYr25_YeuL8) | Transforming Objects in Blender - BLENDER 4.5 BASICS (part 3) | CG Cookie – Learn Blender | 15 | 4.5 (title) | yes | 2026-10-15 | `cgcookie-transforming` |
| pick | [PfBO0Gfla_Y](https://www.youtube.com/watch?v=PfBO0Gfla_Y) | Pivots, Snapping, and Proportional Editing in Blender - BLENDER 4.5 BASICS (part 8) | CG Cookie – Learn Blender | 13 | 4.5 (title) | yes | 2026-10-15 | `cgcookie-pivots-snapping` |
| pick | [vlR6qAbIlR0](https://www.youtube.com/watch?v=vlR6qAbIlR0) | Orientations and Parenting in Blender - BLENDER 4.5 BASICS (part 5) | CG Cookie – Learn Blender | 13 | 4.5 (title) | yes | 2026-10-15 | `cgcookie-orientations` |
| also | [aCltLvsGxNw](https://www.youtube.com/watch?v=aCltLvsGxNw) | Why You're Selecting Wrong in Blender: An Essential Guide for Beginners | Grant Abbitt (Gabbitt) | 8 | 4.5 (by upload date) | yes | 2026-10-15 | `grant-abbitt-selecting` |
| also | [ACdtFVSbDZo](https://www.youtube.com/watch?v=ACdtFVSbDZo) | Adding, Deleting, and the 3D Cursor in Blender - BLENDER 4.5 BASICS (part 4) | CG Cookie – Learn Blender | 10 | 4.5 (title) | yes | 2026-10-15 | `cgcookie-3d-cursor` |
| also | [hTL6AKR8YDs](https://www.youtube.com/watch?v=hTL6AKR8YDs) | Select & Transform - Blender 2.80 Fundamentals | Blender | 11 | 2.80 (title) | yes | 2026-10-15 | `blender-select-transform` |

## 4. Objects, collections and the Outliner; saving and files

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [fPXT6-6Z7pU](https://www.youtube.com/watch?v=fPXT6-6Z7pU) | Visibility and Collections in Blender - BLENDER 4.5 BASICS (part 9) | CG Cookie – Learn Blender | 13 | 4.5 (title) | yes | 2026-10-15 | `cgcookie-collections` |
| pick | [5dRvcq0rLzU](https://www.youtube.com/watch?v=5dRvcq0rLzU) | Working with Blender Files - BLENDER 4.5 BASICS (part 16) | CG Cookie – Learn Blender | 8 | 4.5 (title) | yes | 2026-10-15 | `cgcookie-blender-files` |
| pick | [HFstA5lM4BM](https://www.youtube.com/watch?v=HFstA5lM4BM) | Object Data and Duplication in Blender - BLENDER 4.5 BASICS (part 7) | CG Cookie – Learn Blender | 8 | 4.5 (title) | yes | 2026-10-15 | `cgcookie-object-data` |
| also | [u_yIGGhubZs](https://www.youtube.com/watch?v=u_yIGGhubZs) | Collections - Blender 2.80 Fundamentals | Blender | 7 | 2.80 (title) | yes | 2026-10-15 | `blender-collections` |

## 5. Edit Mode basics

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [eJH0hxlhd5M](https://www.youtube.com/watch?v=eJH0hxlhd5M) | Mesh Components and Object Origins in Blender -BLENDER 4.5 BASICS (part 6) | CG Cookie – Learn Blender | 11 | 4.5 (title) | yes | 2026-10-15 | `cgcookie-mesh-components` |
| pick | [K1UyEdmSttQ](https://www.youtube.com/watch?v=K1UyEdmSttQ) | Blender Basic Modelling Tutorial (Donut Part 2) | Blender Guru | 31 | 5.0 (description) | yes | 2026-10-15 | `blender-guru-donut-part-2` |
| pick | [34FBeC9mktE](https://www.youtube.com/watch?v=34FBeC9mktE) | Object and Edit Mode - Blender 2.80 Fundamentals | Blender | 3 | 2.80 (title) | yes | 2026-10-15 | `blender-object-edit-mode` |
| also | [yqe7kC7Fk-I](https://www.youtube.com/watch?v=yqe7kC7Fk-I) | Mesh Selection Mode - Blender 2.80 Fundamentals | Blender | 2 | 2.80 (title) | yes | 2026-10-15 | `blender-mesh-select-mode` |
| also | [ut9_RRf1-hM](https://www.youtube.com/watch?v=ut9_RRf1-hM) | Blender 5 Complete Beginners Guide - FREE COURSE - Part 3 - The Old Man | Grant Abbitt (Gabbitt) | 11 | 5.0 (title) | yes | 2026-10-15 | `grant-abbitt-old-man` |

## 6. Extrude, inset, loop cut, bevel, knife, merge and dissolve

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [g5WCcHsgWf4](https://www.youtube.com/watch?v=g5WCcHsgWf4) | Extrude, Inset, and Knife in Blender - BLENDER 4.5 BASICS (part 11) | CG Cookie – Learn Blender | 12 | 4.5 (title) | yes | 2026-10-15 | `cgcookie-extrude-inset-knife` |
| pick | [Iyk1rBNFMDg](https://www.youtube.com/watch?v=Iyk1rBNFMDg) | Bevel and Loop Cut in Blender - BLENDER 4.5 BASICS (part 12) | CG Cookie – Learn Blender | 10 | 4.5 (title) | yes | 2026-10-15 | `cgcookie-bevel-loop-cut` |
| pick | [IjsugFxhB1w](https://www.youtube.com/watch?v=IjsugFxhB1w) | Subdivide, Fill, and Merge in Blender - BLENDER 4.5 BASICS (part 13) | CG Cookie – Learn Blender | 13 | 4.5 (title) | yes | 2026-10-15 | `cgcookie-subdivide-fill-merge` |
| also | [p8l-PGew_rI](https://www.youtube.com/watch?v=p8l-PGew_rI) | Delete and Dissolve Explained  - What's the difference and what do they do in Blender? | Artisans of Vaul | 9 | 3.3 (by upload date) | yes | 2026-10-15 | `artisans-of-vaul-delete-dissolve` |
| also | [2qD_tcPMhOs](https://www.youtube.com/watch?v=2qD_tcPMhOs) | Extrude - Blender 2.80 Fundamentals | Blender | 5 | 2.80 (title) | yes | 2026-10-15 | `blender-extrude` |
| also | [-pCf3DjsEBg](https://www.youtube.com/watch?v=-pCf3DjsEBg) | Loop Cut - Blender 2.80 Fundamentals | Blender | 3 | 2.80 (title) | yes | 2026-10-15 | `blender-loop-cut` |
| also | [JSvGts95S7A](https://www.youtube.com/watch?v=JSvGts95S7A) | Bevel Tool - Blender 2.80 Fundamentals | Blender | 4 | 2.80 (title) | yes | 2026-10-15 | `blender-bevel-tool` |
| also | [0I-4a1q0YLE](https://www.youtube.com/watch?v=0I-4a1q0YLE) | Knife Tool - Blender 2.80 Fundamentals | Blender | 2 | 2.80 (title) | yes | 2026-10-15 | `blender-knife-tool` |

## 7. Proportional editing

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [F7VggbBaCsg](https://www.youtube.com/watch?v=F7VggbBaCsg) | How to Use Proportional Editing in Blender (Tutorial) | Ryan King Art | 7 | 4.2 (by upload date) | yes | 2026-10-15 | `ryan-king-proportional-editing` |
| pick | [PfBO0Gfla_Y](https://www.youtube.com/watch?v=PfBO0Gfla_Y) | Pivots, Snapping, and Proportional Editing in Blender - BLENDER 4.5 BASICS (part 8) | CG Cookie – Learn Blender | 13 | 4.5 (title) | yes | 2026-10-15 | `cgcookie-pivots-snapping` |
| also | [nQD79TtFxDg](https://www.youtube.com/watch?v=nQD79TtFxDg) | Blender: Proportional Editing | Royal Skies | 1 | 4.4 (by upload date) | yes | 2026-10-15 | `royal-skies-proportional-editing` |

## 8. Modifiers: mirror, subdivision surface, solidify, array, bevel, boolean, weld, decimate, curve and simple deform

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [JiQuGealRrs](https://www.youtube.com/watch?v=JiQuGealRrs) | Modifiers in Blender - BLENDER 4.5 BASICS (part 14) | CG Cookie – Learn Blender | 11 | 4.5 (title) | yes | 2026-10-15 | `cgcookie-modifiers` |
| pick | [_YEyik7UQZ8](https://www.youtube.com/watch?v=_YEyik7UQZ8) | Mirror Modifier for Complete Beginners (Blender Tutorial) | Ryan King Art | 21 | 4.5 (by upload date) | yes | 2026-10-15 | `ryan-king-mirror-modifier` |
| pick | [DDpedZobA5Q](https://www.youtube.com/watch?v=DDpedZobA5Q) | Demystifying Blender's Array & Curve Modifiers | Grant Abbitt (Gabbitt) | 10 | 4.4 (by upload date) | yes | 2026-10-15 | `grant-abbitt-array-curve` |
| also | [CHqH5oz0DvQ](https://www.youtube.com/watch?v=CHqH5oz0DvQ) | How to Use the Boolean Modifier in Blender (Tutorial) | Ryan King Art | 8 | 4.1 (description) | yes | 2026-10-15 | `ryan-king-boolean-modifier` |
| also | [NNEtGWrhcQ8](https://www.youtube.com/watch?v=NNEtGWrhcQ8) | How to Use the Simple Deform Modifier in Blender | Ryan King Art | 16 | 5.1 (by upload date) | yes | 2026-10-15 | `ryan-king-simple-deform` |
| also | [rodbBWVMZno](https://www.youtube.com/watch?v=rodbBWVMZno) | The Ultimate Guide to the Solidify Modifier in Blender (2025 Update) | Josh - Blender Bros | 18 | 4.5 (by upload date) | yes | 2026-10-15 | `josh-gambrell-solidify` |
| also | [fIzzmh6vAyk](https://www.youtube.com/watch?v=fIzzmh6vAyk) | How to Use the WELD MODIFIER in Blender - Complete Tutorial! | The CG Essentials | 5 | 3.1 (by upload date) | yes | 2026-10-15 | `cg-essentials-weld-modifier` |
| also | [w9P0JsXifGA](https://www.youtube.com/watch?v=w9P0JsXifGA) | Using Blender's Decimate Modifier to Create Low-Poly Objects | Tom Lauerman | 8 | 5.0 (by upload date) | yes | 2026-10-15 | `tom-lauerman-decimate` |

## 9. Topology and edge flow; normals and shading

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [7lN3DzD95a8](https://www.youtube.com/watch?v=7lN3DzD95a8) | EDGE LOOPS & TOPOLOGY FLOW - Master Blender - Skill Building Exercises | Grant Abbitt (Gabbitt) | 10 | 4.4 (by upload date) | yes | 2026-10-15 | `grant-abbitt-edge-loops` |
| pick | [2cQROA13T04](https://www.youtube.com/watch?v=2cQROA13T04) | Mesh Normals and Smoothing in Blender - BLENDER 4.5 BASICS (part 10) | CG Cookie – Learn Blender | 7 | 4.5 (title) | yes | 2026-10-15 | `cgcookie-normals-smoothing` |
| pick | [bl9J7GjaewM](https://www.youtube.com/watch?v=bl9J7GjaewM) | Auto Smooth is Back in Blender 4.2! | Ryan King Art | 4 | 4.2 (title) | yes | 2026-10-15 | `ryan-king-auto-smooth` |
| also | [PwmXuGeRfCE](https://www.youtube.com/watch?v=PwmXuGeRfCE) | The Truth About Topology (Blender Tutorial) | Josh - Blender Bros | 13 | 4.2 (by upload date) | yes | 2026-10-15 | `josh-gambrell-topology` |

## 10. Blocking out from reference images

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [K1UyEdmSttQ](https://www.youtube.com/watch?v=K1UyEdmSttQ) | Blender Basic Modelling Tutorial (Donut Part 2) | Blender Guru | 31 | 5.0 (description) | yes | 2026-10-15 | `blender-guru-donut-part-2` |
| pick | [ZR_X2OhsteQ](https://www.youtube.com/watch?v=ZR_X2OhsteQ) | Turn Any Photo into a Game Asset (Fast & Easy Blender Tutorial) | Grant Abbitt (Gabbitt) | 22 | 5.1 (by upload date) | yes | 2026-10-15 | `grant-abbitt-photo-to-asset` |
| pick | [F_JK9eaYYTQ](https://www.youtube.com/watch?v=F_JK9eaYYTQ) | Blender 5 for Beginners: Model Any LOW POLY ANIMAL (Detailed Follow-Along Guide!) | Grant Abbitt (Gabbitt) | 36 | 5.0 (title) | yes | 2026-10-15 | `grant-abbitt-low-poly-animal` |
| also | [lpIonmH90-k](https://www.youtube.com/watch?v=lpIonmH90-k) | How to Use Background Images in Blender (Tutorial) | Ryan King Art | 12 | 3.2 (by upload date) | yes | 2026-10-15 | `ryan-king-background-images` |

## 11. Low-poly props, characters and environments; modular kits

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [M_cGaqzAIAc](https://www.youtube.com/watch?v=M_cGaqzAIAc) | Crash Course: Low Poly Fantasy Props in Blender 5 | Imphenzia | 20 | 5.0 (title) | yes | 2026-10-15 | `imphenzia-fantasy-props` |
| pick | [BL6fyBeldHA](https://www.youtube.com/watch?v=BL6fyBeldHA) | Create Low Poly Characters in Blender (Beginner Tutorial) | Ryan King Art | 86 | 5.0 (by upload date) | yes | 2026-10-15 | `ryan-king-low-poly-characters` |
| pick | [QE4aiWp5bZk](https://www.youtube.com/watch?v=QE4aiWp5bZk) | Essential Tips for Modular Building | Grant Abbitt (Gabbitt) | 4 | 3.5 (by upload date) | yes | 2026-10-15 | `grant-abbitt-modular-building` |
| also | [PTWV67qUX2k](https://www.youtube.com/watch?v=PTWV67qUX2k) | LEARN LOW POLY Character Modeling - Blender 3.5 Full Course - Model \| Rig \| Animate \| Clone \| Export | Imphenzia | 121 | 3.5 (title) | yes | 2026-10-15 | `imphenzia-low-poly-character-course` |
| also | [mvE_TykzJQU](https://www.youtube.com/watch?v=mvE_TykzJQU) | Essential Tips for Low Poly Scenes - Blender Tutorial | Grant Abbitt (Gabbitt) | 12 | 4.2 (by upload date) | yes | 2026-10-15 | `grant-abbitt-low-poly-scenes` |
| also | [uIHuqFLa_X0](https://www.youtube.com/watch?v=uIHuqFLa_X0) | Blender Low Poly Character: PS1 Style Modeling for Beginners | Grant Abbitt (Gabbitt) | 19 | 4.5 (by upload date) | yes | 2026-10-15 | `grant-abbitt-ps1-character` |
| also | [PP-UWvKivY8](https://www.youtube.com/watch?v=PP-UWvKivY8) | Let's Model a Wood Crate in 10 Minutes - ep. 144 | Imphenzia | 25 | 4.4 (by upload date) | yes | 2026-10-15 | `imphenzia-wood-crate` |

## 12. Curves and text

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [gxzWCH1Q4fM](https://www.youtube.com/watch?v=gxzWCH1Q4fM) | How to Use Curves for Beginners (Blender Tutorial) | Ryan King Art | 19 | 4.4 (by upload date) | yes | 2026-10-15 | `ryan-king-curves` |
| pick | [sSpem6jHXak](https://www.youtube.com/watch?v=sSpem6jHXak) | How to Use Text In Blender for Beginners (Tutorial) | Ryan King Art | 18 | 3.6 (by upload date) | yes | 2026-10-15 | `ryan-king-text` |

## 13. Sculpting basics, remesh and multires

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [K7AJVx0H3Ec](https://www.youtube.com/watch?v=K7AJVx0H3Ec) | Complete Beginner's Guide to Sculpting in Blender 4.4 | Grant Abbitt (Gabbitt) | 37 | 4.4 (title) | yes | 2026-10-15 | `grant-abbitt-sculpting` |
| pick | [Y6asaZsDHCg](https://www.youtube.com/watch?v=Y6asaZsDHCg) | Essential Sculpting Workflows - Multires vs Dyntopo vs Remesh | Grant Abbitt (Gabbitt) | 14 | 3.0 (by upload date) | yes | 2026-10-15 | `grant-abbitt-multires-dyntopo-remesh` |
| pick | [iveM_C6cenA](https://www.youtube.com/watch?v=iveM_C6cenA) | How to Use Blender's Sculpting Remesh Feature (Tutorial) | Ryan King Art | 6 | 3.5 (by upload date) | yes | 2026-10-15 | `ryan-king-sculpt-remesh` |
| also | [5-mNgCpEkCI](https://www.youtube.com/watch?v=5-mNgCpEkCI) | Master Blender Sculpting: Every Brush Explained | Grant Abbitt (Gabbitt) | 44 | 4.3 (by upload date) | yes | 2026-10-15 | `grant-abbitt-every-brush` |

## 14. Retopology and baking normals

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [1myOZaxtHes](https://www.youtube.com/watch?v=1myOZaxtHes) | Retopology for Beginners (Blender Tutorial) | Ryan King Art | 22 | 4.1 (by upload date) | yes | 2026-10-15 | `ryan-king-retopology` |
| pick | [X2GNyEUvpD4](https://www.youtube.com/watch?v=X2GNyEUvpD4) | Retopology in Blender (Beginner Tutorial) | CG Boost | 14 | 3.0 (description) | yes | 2026-10-15 | `cg-boost-retopology` |
| pick | [Zxl38NpPWdo](https://www.youtube.com/watch?v=Zxl38NpPWdo) | Texture Bake High Poly Details to a Low Poly Mesh (Blender Tutorial) | Ryan King Art | 14 | 4.1 (by upload date) | yes | 2026-10-15 | `ryan-king-texture-bake` |

## 15. UV unwrapping, seams and packing

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [DmuZTw3UZ-c](https://www.youtube.com/watch?v=DmuZTw3UZ-c) | Blender 5 - UV Unwrapping Just Got WAY Easier (Full Guide) | Grant Abbitt (Gabbitt) | 5 | 5.1 (by upload date) | yes | 2026-10-15 | `grant-abbitt-uv-unwrapping` |
| pick | [jnzhNdWoXMg](https://www.youtube.com/watch?v=jnzhNdWoXMg) | The Complete Guide to UV Unwrapping for the 3D Artist - Where & Why Marking Seams | Grant Abbitt (Gabbitt) | 8 | 3.3 (by upload date) | yes | 2026-10-15 | `grant-abbitt-uv-seams` |
| pick | [yxAqN8TzFbo](https://www.youtube.com/watch?v=yxAqN8TzFbo) | Blender Basic UV Unwrapping Tutorial (Donut Part 6) | Blender Guru | 34 | 5.0 (series description) | yes | 2026-10-15 | `blender-guru-donut-part-6` |
| also | [Y7M-B6xnaEM](https://www.youtube.com/watch?v=Y7M-B6xnaEM) | UV Unwrapping - Blender 2.80 Fundamentals | Blender | 6 | 2.80 (title) | yes | 2026-10-15 | `blender-uv-unwrapping` |

## 16. Palette and gradient texture atlases for low poly

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [wymvSs7m1jk](https://www.youtube.com/watch?v=wymvSs7m1jk) | How To SPEED UP Your BLENDER LOW POLY Modeling Process | Imphenzia | 49 | 4.3 (description) | yes | 2026-10-15 | `imphenzia-palette-textures` |
| pick | [Komry1kruHs](https://www.youtube.com/watch?v=Komry1kruHs) | The Secret to Creating Stunning Low-Poly Game Optimized Textures - Blender tutorial | Grant Abbitt (Gabbitt) | 8 | 4.2 (by upload date) | yes | 2026-10-15 | `grant-abbitt-gradient-textures` |
| pick | [gZRDwbHEB34](https://www.youtube.com/watch?v=gZRDwbHEB34) | Advance Unwrapping & Making Texture Atlases \| Blender 2.81 | Grant Abbitt (Gabbitt) | 20 | 2.81 (title) | yes | 2026-10-15 | `grant-abbitt-texture-atlases` |
| also | [9ljoYSVRWy4](https://www.youtube.com/watch?v=9ljoYSVRWy4) | BLENDER 4.3 - Imphenzia PixPal Palette in - Shader Tutorial | Imphenzia | 48 | 4.3 (title) | yes | 2026-10-15 | `imphenzia-pixpal-shader` |

## 17. Texture painting

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [_-zAhCOUpog](https://www.youtube.com/watch?v=_-zAhCOUpog) | Blender 4.3 Texture Painting: Beginner's Guide & New Brushes | Grant Abbitt (Gabbitt) | 12 | 4.3 (title) | yes | 2026-10-15 | `grant-abbitt-texture-painting` |
| pick | [E29D9rS8op8](https://www.youtube.com/watch?v=E29D9rS8op8) | Master Texture Painting in Blender 4 (& 5): A Quick Start  Beginner's Guide | Grant Abbitt (Gabbitt) | 5 | 4.0 (by upload date) | yes | 2026-10-15 | `grant-abbitt-texture-painting-quick-start` |
| pick | [6jT4K0JpGNs](https://www.youtube.com/watch?v=6jT4K0JpGNs) | Texture Painting for Beginners 🖌️ (Blender Tutorial) | Ryan King Art | 27 | 3.3 (by upload date) | yes | 2026-10-15 | `ryan-king-texture-painting` |

## 18. Materials and the Shader Editor, procedural textures, vertex colours

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [5Xlu2zwbJd0](https://www.youtube.com/watch?v=5Xlu2zwbJd0) | Blender Basic Materials Tutorial (Donut Part 4) | Blender Guru | 34 | 5.0 (series description) | yes | 2026-10-15 | `blender-guru-donut-part-4` |
| pick | [J5t7gzIfTt0](https://www.youtube.com/watch?v=J5t7gzIfTt0) | Introduction to Procedural Shader Nodes for Complete Beginners (Blender Tutorial) | Ryan King Art | 24 | 4.0 (by upload date) | yes | 2026-10-15 | `ryan-king-procedural-shader-nodes` |
| pick | [-OqRp9o9vQA](https://www.youtube.com/watch?v=-OqRp9o9vQA) | Vertex colors: the hidden workhorse of shaders – introduction to realtime lowpoly vertex painting | Blender | 41 | 4.2 (by upload date) | yes | 2026-10-15 | `tirkkonen-vertex-colors` |
| also | [3-_zyiBk0JI](https://www.youtube.com/watch?v=3-_zyiBk0JI) | Every Shader Node You NEED to Know in Blender | SouthernShotty | 11 | 4.5 (by upload date) | yes | 2026-10-15 | `southern-shotty-shader-nodes` |
| also | [4LySeRWSNiA](https://www.youtube.com/watch?v=4LySeRWSNiA) | Materials and Textures in Blender - BLENDER 4.5 BASICS (part 18) | CG Cookie – Learn Blender | 15 | 4.5 (title) | yes | 2026-10-15 | `cgcookie-materials` |
| also | [h30ZJQrb4s8](https://www.youtube.com/watch?v=h30ZJQrb4s8) | Blender Basic Texturing Tutorial (Donut Part 5) | Blender Guru | 32 | 5.0 (series description) | yes | 2026-10-15 | `blender-guru-donut-part-5` |
| also | [_deRNqDcwRk](https://www.youtube.com/watch?v=_deRNqDcwRk) | Procedural Textures - Blender 2.80 Fundamentals | Blender | 3 | 2.80 (title) | yes | 2026-10-15 | `blender-procedural-textures` |

## 19. Lights, world and HDRIs

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [E3d7R7BNr_4](https://www.youtube.com/watch?v=E3d7R7BNr_4) | Lighting in Blender - BLENDER 4.5 BASICS (part 19) | CG Cookie – Learn Blender | 8 | 4.5 (title) | yes | 2026-10-15 | `cgcookie-lighting` |
| pick | [QNr7lwhW0h4](https://www.youtube.com/watch?v=QNr7lwhW0h4) | How to Light your Scenes with HDRIs in Blender | Ryan King Art | 4 | 3.5 (by upload date) | yes | 2026-10-15 | `ryan-king-hdri` |
| pick | [ENnEYoUpFfU](https://www.youtube.com/watch?v=ENnEYoUpFfU) | Fundamentals of Lighting in Blender | Blender Guru | 43 | 5.1 (by upload date) | yes | 2026-10-15 | `blender-guru-lighting` |
| also | [7moxMNaRlk8](https://www.youtube.com/watch?v=7moxMNaRlk8) | Blender 5 Complete Beginners Guide - FREE COURSE - Part 8 - Lights & Composit | Grant Abbitt (Gabbitt) | 14 | 5.0 (title) | yes | 2026-10-15 | `grant-abbitt-lights-compositing` |
| also | [FdbnzfjoOJU](https://www.youtube.com/watch?v=FdbnzfjoOJU) | Light Types - Blender 2.80 Fundamentals | Blender | 2 | 2.80 (title) | yes | 2026-10-15 | `blender-light-types` |

## 20. Cameras

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [iiXElj1DLBo](https://www.youtube.com/watch?v=iiXElj1DLBo) | Cameras and Rendering in Blender - BLENDER 4.5 BASICS (part 17) | CG Cookie – Learn Blender | 11 | 4.5 (title) | yes | 2026-10-15 | `cgcookie-cameras-rendering` |
| pick | [aY04h4ujrlY](https://www.youtube.com/watch?v=aY04h4ujrlY) | How to Use the Camera in Blender (Tutorial) | Ryan King Art | 17 | 3.0 (by upload date) | yes | 2026-10-15 | `ryan-king-camera` |
| also | [ahT3P274EMw](https://www.youtube.com/watch?v=ahT3P274EMw) | How to Use Depth of Field in Blender (Tutorial) | Ryan King Art | 3 | 3.1 (by upload date) | yes | 2026-10-15 | `ryan-king-depth-of-field` |

## 21. EEVEE and Cycles; render settings and output

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [WobATxh3i-g](https://www.youtube.com/watch?v=WobATxh3i-g) | The Basics of Lighting and Rendering in Blender (Donut Finale) | Blender Guru | 33 | 5.0 (series description) | yes | 2026-10-15 | `blender-guru-donut-finale` |
| pick | [-gW6vk_OuNQ](https://www.youtube.com/watch?v=-gW6vk_OuNQ) | How to use Eevee - Full Blender Course | Blender Guru | 77 | 4.4 (by upload date) | yes | 2026-10-15 | `blender-guru-eevee` |
| pick | [RsCNKHSRk_s](https://www.youtube.com/watch?v=RsCNKHSRk_s) | Eevee Render Quality: Small Settings, Huge Difference #b3d | CG Boost | 12 | 5.1 (by upload date) | yes | 2026-10-15 | `cg-boost-eevee-quality` |
| also | [iiXElj1DLBo](https://www.youtube.com/watch?v=iiXElj1DLBo) | Cameras and Rendering in Blender - BLENDER 4.5 BASICS (part 17) | CG Cookie – Learn Blender | 11 | 4.5 (title) | yes | 2026-10-15 | `cgcookie-cameras-rendering` |
| also | [kIW648Cfo18](https://www.youtube.com/watch?v=kIW648Cfo18) | 10 Easy Ways to Render Faster in Blender | Blender Guru | 9 | 4.4 (by upload date) | yes | 2026-10-15 | `blender-guru-render-faster` |
| also | [OENbinegV2c](https://www.youtube.com/watch?v=OENbinegV2c) | How to Render Your 3d Animation to a Video File (Blender Tutorial) | Ryan King Art | 7 | 3.5 (by upload date) | yes | 2026-10-15 | `ryan-king-render-video` |

## 22. Compositing

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [4zoixL45nvI](https://www.youtube.com/watch?v=4zoixL45nvI) | Blender 5 Compositing for Beginners: The Ultimate Crash Course | Grant Abbitt (Gabbitt) | 10 | 5.0 (title) | yes | 2026-10-15 | `grant-abbitt-compositing` |
| pick | [vPF8Aj20Bqc](https://www.youtube.com/watch?v=vPF8Aj20Bqc) | New Compositing Features in Blender 5.0! | Ryan King Art | 16 | 5.0 (title) | yes | 2026-10-15 | `ryan-king-compositing-5` |
| pick | [7moxMNaRlk8](https://www.youtube.com/watch?v=7moxMNaRlk8) | Blender 5 Complete Beginners Guide - FREE COURSE - Part 8 - Lights & Composit | Grant Abbitt (Gabbitt) | 14 | 5.0 (title) | yes | 2026-10-15 | `grant-abbitt-lights-compositing` |
| also | [JgQvvd1jryw](https://www.youtube.com/watch?v=JgQvvd1jryw) | Compositing for Beginners (Blender Tutorial) | Ryan King Art | 38 | 4.4 (by upload date) | yes | 2026-10-15 | `ryan-king-compositing` |

## 23. Keyframes, the Timeline, Dope Sheet and Graph Editor

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [xKv0mARhsMg](https://www.youtube.com/watch?v=xKv0mARhsMg) | 3D Animation with Keyframes in Blender - BLENDER 4.5 BASICS (part 20) | CG Cookie – Learn Blender | 16 | 4.5 (title) | yes | 2026-10-15 | `cgcookie-keyframes` |
| pick | [5WOrfMz2Sqs](https://www.youtube.com/watch?v=5WOrfMz2Sqs) | Beginners Guide to Animation in blender 4 : Part 1 - Keyframes | Grant Abbitt (Gabbitt) | 14 | 4.1 (by upload date) | yes | 2026-10-15 | `grant-abbitt-animation-keyframes` |
| pick | [sc64wS-gukU](https://www.youtube.com/watch?v=sc64wS-gukU) | How to Use the Graph Editor for Beginners (Blender Tutorial) | Ryan King Art | 18 | 4.4 (by upload date) | yes | 2026-10-15 | `ryan-king-graph-editor` |
| also | [geE8Sy97CQE](https://www.youtube.com/watch?v=geE8Sy97CQE) | Beginners Guide to Animation in blender 4 - Part 2 - Graph Editor | Grant Abbitt (Gabbitt) | 13 | 4.1 (by upload date) | yes | 2026-10-15 | `grant-abbitt-animation-graph-editor` |
| also | [SZJswvw9wEs](https://www.youtube.com/watch?v=SZJswvw9wEs) | Keyframes - Blender 2.80 Fundamentals | Blender | 8 | 2.80 (title) | yes | 2026-10-15 | `blender-keyframes` |
| also | [o19U-yPGdyY](https://www.youtube.com/watch?v=o19U-yPGdyY) | Timeline - Blender 2.80 Fundamentals | Blender | 14 | 2.80 (title) | yes | 2026-10-15 | `blender-timeline` |
| also | [LHdh8p37yM8](https://www.youtube.com/watch?v=LHdh8p37yM8) | Dope Sheet - Blender 2.80 Fundamentals | Blender | 9 | 2.80 (title) | yes | 2026-10-15 | `blender-dope-sheet` |
| also | [zHlln3AzeMs](https://www.youtube.com/watch?v=zHlln3AzeMs) | Graph Editor - Blender 2.80 Fundamentals | Blender | 10 | 2.80 (title) | yes | 2026-10-15 | `blender-graph-editor` |

## 24. Constraints and drivers

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [fQJK3thkh0k](https://www.youtube.com/watch?v=fQJK3thkh0k) | Object Constraints for Beginners (Blender Tutorial) | Ryan King Art | 50 | 4.5 (by upload date) | yes | 2026-10-15 | `ryan-king-object-constraints` |
| pick | [aGBOu-dNZ-w](https://www.youtube.com/watch?v=aGBOu-dNZ-w) | Tracking Constraints - Blender 2.80 Fundamentals | Blender | 6 | 2.80 (title) | yes | 2026-10-15 | `blender-tracking-constraints` |
| pick | [85oospWTIQ8](https://www.youtube.com/watch?v=85oospWTIQ8) | Blender: Drivers Explained (60 Seconds!!) | Royal Skies | 1 | 4.4 (by upload date) | yes | 2026-10-15 | `royal-skies-drivers` |
| also | [1_LcXcNnieQ](https://www.youtube.com/watch?v=1_LcXcNnieQ) | Transform Constraints - Blender 2.80 Fundamentals | Blender | 5 | 2.80 (title) | yes | 2026-10-15 | `blender-transform-constraints` |
| also | [CPEEjlRLKEU](https://www.youtube.com/watch?v=CPEEjlRLKEU) | Quick Tip: Working With Drivers in Blender | Polyfjord | 4 | 3.3 (by upload date) | yes | 2026-10-15 | `polyfjord-drivers` |
| also | [XfHC7mpYNbA](https://www.youtube.com/watch?v=XfHC7mpYNbA) | Getting Started with DRIVERS in Blender for Beginners! | The CG Essentials | 6 | 3.0 (by upload date) | yes | 2026-10-15 | `cg-essentials-drivers` |

## 25. Shape keys

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [Kumk-reupso](https://www.youtube.com/watch?v=Kumk-reupso) | Shape Keys for Beginners (Blender Tutorial) | Ryan King Art | 27 | 4.5 (by upload date) | yes | 2026-10-15 | `ryan-king-shape-keys` |
| pick | [ZRLQ6PT5c5g](https://www.youtube.com/watch?v=ZRLQ6PT5c5g) | Blender: Shape-Keys Explained | Royal Skies | 1 | 4.4 (by upload date) | yes | 2026-10-15 | `royal-skies-shape-keys` |

## 26. Armatures, weight painting, IK and Rigify

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [DDeB4tDVCGY](https://www.youtube.com/watch?v=DDeB4tDVCGY) | Rigging for impatient people - Blender Tutorial | Joey Carlino | 10 | 3.5 (by upload date) | yes | 2026-10-15 | `joey-carlino-rigging` |
| pick | [RdTuAY23vzk](https://www.youtube.com/watch?v=RdTuAY23vzk) | Easy Rigging Using RIGIFY in Blender | Grant Abbitt (Gabbitt) | 15 | 4.5 (by upload date) | yes | 2026-10-15 | `grant-abbitt-rigify` |
| pick | [PLWv9yjVaoU](https://www.youtube.com/watch?v=PLWv9yjVaoU) | Blender 4.0 - Weight Paint Workflow (& Techniques!!) | Royal Skies | 7 | 4.0 (title) | yes | 2026-10-15 | `royal-skies-weight-paint` |
| also | [FOdLM1gYsAM](https://www.youtube.com/watch?v=FOdLM1gYsAM) | Beginners Guide to Animation in blender 4 - Part 3 - Bones & Armatures | Grant Abbitt (Gabbitt) | 15 | 4.1 (by upload date) | yes | 2026-10-15 | `grant-abbitt-bones-armatures` |
| also | [2nlMZx0vp6E](https://www.youtube.com/watch?v=2nlMZx0vp6E) | Character Rigging in Blender : Easy Setup for Beginners | Grant Abbitt (Gabbitt) | 9 | 4.1 (by upload date) | yes | 2026-10-15 | `grant-abbitt-character-rigging` |
| also | [S-2v_CKmVE8](https://www.youtube.com/watch?v=S-2v_CKmVE8) | Inverse Kinematics - Blender 2.80 Fundamentals | Blender | 10 | 2.80 (title) | yes | 2026-10-15 | `blender-inverse-kinematics` |
| also | [Rbl080ZfAgA](https://www.youtube.com/watch?v=Rbl080ZfAgA) | How to Setup Arm IK Rigging (Blender Tutorial) | Ryan King Art | 20 | 3.1 (by upload date) | yes | 2026-10-15 | `ryan-king-arm-ik` |

## 27. Walk cycles, actions and the NLA

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [siNABirUDMQ](https://www.youtube.com/watch?v=siNABirUDMQ) | Walk Cycle Animation in Blender (Tutorial) | CG Boost | 36 | 3.0 (by upload date) | yes | 2026-10-15 | `cg-boost-walk-cycle` |
| pick | [Vud9Ora9IwE](https://www.youtube.com/watch?v=Vud9Ora9IwE) | Make your animation 10x better with LAYERS - Blender tutorial | Joey Carlino | 19 | 4.2 (by upload date) | yes | 2026-10-15 | `joey-carlino-nla-layers` |
| pick | [HCdynE4IL5c](https://www.youtube.com/watch?v=HCdynE4IL5c) | Blender 4.4 NEW Actions Let You Mix Animations Like a Game Dev PRO! | SouthernShotty | 17 | 4.4 (title) | yes | 2026-10-15 | `southern-shotty-actions` |
| also | [SLh3hUIxv1s](https://www.youtube.com/watch?v=SLh3hUIxv1s) | Create a Walk Cycle animation in Blender | Pierrick Picaut | 19 | 5.1 (by upload date) | yes | 2026-10-15 | `pierrick-picaut-walk-cycle` |
| also | [u1VftqTABK0](https://www.youtube.com/watch?v=u1VftqTABK0) | Slotted Actions demonstration \| Blender 4.4-alpha | Blender Developers | 3 | 4.4 (title) | yes | 2026-10-15 | `blender-slotted-actions` |
| also | [B5h2HvkqXZ0](https://www.youtube.com/watch?v=B5h2HvkqXZ0) | Simple Walk Cycle in Blender 2.81 | Imphenzia | 11 | 2.81 (title) | yes | 2026-10-15 | `imphenzia-walk-cycle` |

## 28. Geometry nodes basics, scattering and instances

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [188IeRY-ch0](https://www.youtube.com/watch?v=188IeRY-ch0) | Geometry Nodes for Beginners (Blender Tutorial) | Ryan King Art | 90 | 5.1 (by upload date) | yes | 2026-10-15 | `ryan-king-geometry-nodes` |
| pick | [_-QsGTL7pS0](https://www.youtube.com/watch?v=_-QsGTL7pS0) | How to Scatter in Blender 5.0 (Donut Part 7) | Blender Guru | 37 | 5.0 (title) | yes | 2026-10-15 | `blender-guru-donut-part-7` |
| pick | [JvbppmT0ILY](https://www.youtube.com/watch?v=JvbppmT0ILY) | Instances - Geometry Nodes for Beginners | Joey Carlino | 43 | 3.1 (by upload date) | yes | 2026-10-15 | `joey-carlino-instances` |
| also | [szTYXk0t09A](https://www.youtube.com/watch?v=szTYXk0t09A) | Getting Started - Geometry Nodes for Beginners | Joey Carlino | 19 | 3.1 (by upload date) | yes | 2026-10-15 | `joey-carlino-geometry-nodes-start` |
| also | [iNU-1ORXw74](https://www.youtube.com/watch?v=iNU-1ORXw74) | How to Scatter Objects WITH GEOMETRY NODES in 2023! (Blender Tutorial) | The CG Essentials | 19 | 3.4 (by upload date) | yes | 2026-10-15 | `cg-essentials-scatter` |

## 29. Physics: rigid body, cloth, soft body, particles, hair curves and fluids

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [lctjzasiy64](https://www.youtube.com/watch?v=lctjzasiy64) | Rigid Body Physics for Beginners (Blender Tutorial) | Ryan King Art | 25 | 2.93 (by upload date) | yes | 2026-10-15 | `ryan-king-rigid-body` |
| pick | [c5LOOoSHh9c](https://www.youtube.com/watch?v=c5LOOoSHh9c) | Cloth Physics for Beginners (Blender Tutorial) | Ryan King Art | 43 | 3.4 (by upload date) | yes | 2026-10-15 | `ryan-king-cloth` |
| pick | [Lj2EBG2_ooQ](https://www.youtube.com/watch?v=Lj2EBG2_ooQ) | Particle Systems for Beginners (Blender Tutorial) | Ryan King Art | 52 | 4.3 (by upload date) | yes | 2026-10-15 | `ryan-king-particles` |
| also | [6Dtwhd1N0bY](https://www.youtube.com/watch?v=6Dtwhd1N0bY) | Soft Body Physics for Beginners (Blender Tutorial) | Ryan King Art | 34 | 3.5 (by upload date) | yes | 2026-10-15 | `ryan-king-soft-body` |
| also | [A93O4COVPyw](https://www.youtube.com/watch?v=A93O4COVPyw) | Fluid Simulations for Beginners 💦 (Blender Tutorial) | Ryan King Art | 54 | 3.5 (by upload date) | yes | 2026-10-15 | `ryan-king-fluids` |
| also | [_-d0HaT5f1g](https://www.youtube.com/watch?v=_-d0HaT5f1g) | Introducing: Hair Assets in Blender 3.5! | Blender | 7 | 3.5 (title) | yes | 2026-10-15 | `blender-hair-assets` |
| also | [gCQN5vNgHiI](https://www.youtube.com/watch?v=gCQN5vNgHiI) | How to Make Procedural Fur in Blender Geometry Nodes | Blender Studio | 35 | 3.5 (by upload date) | yes | 2026-10-15 | `blender-studio-procedural-fur` |

## 30. Grease Pencil

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [wskCvU7_xtc](https://www.youtube.com/watch?v=wskCvU7_xtc) | Draw on 3D Objects in Blender with Grease Pencil (Quick Start Tutorial) | Grant Abbitt (Gabbitt) | 5 | 4.5 (by upload date) | yes | 2026-10-15 | `grant-abbitt-grease-pencil` |
| pick | [ZkqZRe9IXQ8](https://www.youtube.com/watch?v=ZkqZRe9IXQ8) | 2D Blender Grease Pencil Basics: Start Animating In 10 Minutes | Micah Buzan ANIMATION | 12 | 4.4 (by upload date) | yes | 2026-10-15 | `micah-buzan-grease-pencil` |
| pick | [6RveA8qlSsA](https://www.youtube.com/watch?v=6RveA8qlSsA) | Learn Grease Pencil in 10 MINUTES (Blender Tutorial for dummies) | Janice Journal | 10 | 4.3 (by upload date) | yes | 2026-10-15 | `janice-journal-grease-pencil` |

## 31. The Video Sequencer

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [XKqdmHRGnjI](https://www.youtube.com/watch?v=XKqdmHRGnjI) | Video Editing Quick Start Guide for Absolute Beginners (Blender Tutorial) | Ryan King Art | 23 | 5.0 (by upload date) | yes | 2026-10-15 | `ryan-king-video-editing` |
| pick | [idwvVfNQs0Y](https://www.youtube.com/watch?v=idwvVfNQs0Y) | Blender 5.0 VSE - Trimming and moving clips | Nick Gammon | 8 | 5.0 (title) | yes | 2026-10-15 | `nick-gammon-vse-trimming` |
| pick | [99ZdOuJMrao](https://www.youtube.com/watch?v=99ZdOuJMrao) | Blender Video Editing: Learn workflow, transitions, modifiers & more! | ExplainingComputers | 29 | 4.5 (by upload date) | yes | 2026-10-15 | `explainingcomputers-video-editing` |
| also | [yh7YPabqeDk](https://www.youtube.com/watch?v=yh7YPabqeDk) | Video Editing with Blender for Complete Beginners - Part 1 | Ryan King Art | 31 | 3.6 (by upload date) | yes | 2026-10-15 | `ryan-king-video-editing-part-1` |

## 32. Asset browser, linking and appending

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [j1EhPPFrZgk](https://www.youtube.com/watch?v=j1EhPPFrZgk) | Build Scenes FASTER: Mastering the Asset Browser in Blender 5.1 | Grant Abbitt (Gabbitt) | 9 | 5.1 (title) | yes | 2026-10-15 | `grant-abbitt-asset-browser` |
| pick | [soWVMlBe_ww](https://www.youtube.com/watch?v=soWVMlBe_ww) | How to Append and Import Data in Blender (Tutorial) | Ryan King Art | 6 | 3.1 (by upload date) | yes | 2026-10-15 | `ryan-king-append` |
| pick | [z-KH-zmV79I](https://www.youtube.com/watch?v=z-KH-zmV79I) | Everything about Linking & Overrides in blender | Pierrick Picaut | 10 | 5.0 (by upload date) | yes | 2026-10-15 | `pierrick-picaut-linking` |
| also | [1J5sdNPo5R8](https://www.youtube.com/watch?v=1J5sdNPo5R8) | Import Methods for Asset Libraries in Blender 5.0 | Ryan King Art | 4 | 5.0 (title) | yes | 2026-10-15 | `ryan-king-asset-import-methods` |
| also | [An5ft5nXzmk](https://www.youtube.com/watch?v=An5ft5nXzmk) | Blender Just Got SO Much Easier (New Built-In Assets!) | Grant Abbitt (Gabbitt) | 2 | 5.2 (description) | yes | 2026-10-15 | `grant-abbitt-built-in-assets` |
| also | [01jcDvHpOmY](https://www.youtube.com/watch?v=01jcDvHpOmY) | Asset Browser - Beginners Guide - Blender 3 | Grant Abbitt (Gabbitt) | 6 | 3.0 (title) | yes | 2026-10-15 | `grant-abbitt-asset-browser-3` |

## 33. Add-ons and extensions, preferences

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [3FkY7hXvte4](https://www.youtube.com/watch?v=3FkY7hXvte4) | The Blender FREE Extension Store is Here! (Free Add-Ons for ALL!) | The CG Essentials | 8 | 4.2 (description) | yes | 2026-10-15 | `cg-essentials-extensions` |
| pick | [Yjr61lfPLs4](https://www.youtube.com/watch?v=Yjr61lfPLs4) | Blender 4.2 is MISSING ADD-ONS? Where did they go? | The CG Essentials | 3 | 4.2 (title) | yes | 2026-10-15 | `cg-essentials-missing-addons` |
| pick | [xcaHhUSScIc](https://www.youtube.com/watch?v=xcaHhUSScIc) | Blender Preferences Explained \| Best Settings for Beginners (Step-by-Step Guide) | Skill Brew | 16 | 4.5 (by upload date) | yes | 2026-10-15 | `skill-brew-preferences` |
| also | [PSzauPYseqM](https://www.youtube.com/watch?v=PSzauPYseqM) | How to Enable Add Ons & the Extensions Platform in Blender Beginner Guide | Tom mc donald | 4 | 4.4 (by upload date) | yes | 2026-10-15 | `tom-mcdonald-extensions` |

## 34. Python scripting basics

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [wWTAQP7-ZUQ](https://www.youtube.com/watch?v=wWTAQP7-ZUQ) | Getting Started with Scripting in Python | Blender | 49 | 3.6 (by upload date) | yes | 2026-10-15 | `shah-scripting-python` |
| pick | [ZGU9VEst7hw](https://www.youtube.com/watch?v=ZGU9VEst7hw) | Blender Python Tutorial 1 - Interface | KenzoCG | 24 | 5.0 (by upload date) | yes | 2026-10-15 | `kenzocg-python-interface` |
| pick | [nKt6CtMH0no](https://www.youtube.com/watch?v=nKt6CtMH0no) | From Script to Add-on \| Scripting for Artists [9] | Blender | 10 | 2.82 (by upload date) | yes | 2026-10-15 | `blender-scripting-for-artists-addon` |

## 35. glTF export, LODs and collision, and importing into Godot 4

| Pick | Video | Title | Channel | Min | Blender | Embeddable | Checked | Catalogue id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pick | [5fDuf2IlizU](https://www.youtube.com/watch?v=5fDuf2IlizU) | From model to gameplay in seconds: setting up your Blender Godot pipeline – Marion Allard – GodotCon | Godot Engine | 32 | 5.1 (by upload date) | yes | 2026-10-15 | `allard-blender-godot-pipeline` |
| pick | [_eIAl_HZWXM](https://www.youtube.com/watch?v=_eIAl_HZWXM) | Exporting 3D Models to Godot 4 \| GlTF settings | Octodemy | 9 | 3.6 (by upload date) | yes | 2026-10-15 | `octodemy-godot-export` |
| pick | [S8dMzNRd63E](https://www.youtube.com/watch?v=S8dMzNRd63E) | Godot 4 Automatic LOD Tutorial | Gwizz | 2 | none (Godot only) | yes | 2026-10-15 | `gwizz-godot-lod` |
| also | [6TsdmFvkw9w](https://www.youtube.com/watch?v=6TsdmFvkw9w) | Godot 4 and Blender: Setup and Importing // Tutorial | StayAtHomeDev | 11 | 3.5 (by upload date) | yes | 2026-10-15 | `stayathomedev-godot-blender` |
