# Portfolio visual and text review

Reviewed October 7, 2026. The fixed-angle workbench and all eight project dossiers were checked in Chrome, including all 55 chapters, profile/contact inspections, actual media, and rendered text. Desktop, tablet, 390px and 320px phone layouts were covered; the review also added short-window checks at 1440×500, 844×390 and 667×375.

## Fixed

| Finding | Change |
| --- | --- |
| Landscape phones clipped the dock and inspection controls because the bench exceeded the window height. | Removed the minimum scene height and added a compact inspection layout with visible navigation and a scrolling reading area. The angled desktop view stays in place. |
| The chapter highlight could revert to an earlier section when a near-bottom anchor could not reach the normal scroll offset. | Track the anchor's actual, clamped destination and release it when the reader scrolls away. Manual scrolling to the end selects the final chapter. |
| Tall chapter lists could extend beyond a short desktop window; resizing to mobile could leave the active link outside the horizontal rail. | The desktop rail now scrolls within the available height. Mobile reveals the active link after a resize. |
| Unequal-height evidence figures stretched to match one another, producing large empty bordered panels. | Each figure now keeps its own height. |
| A transparent camera comparison graphic lost its dark heading against the dark page; expanded figures discarded their background styling. | Added a white image background and preserved figure styling in the expanded view. |
| STM32's instrument chapter repeated the Overview label; EEG's limitations chapter was titled only “Next.” | Matched the STM32 chapter label to its navigation and renamed the EEG heading “Limitations and next steps.” |
| Kinetic power claims lacked their operating assumption in the header and generalized the LED comparison. | Identified the average as an estimate at 8 pulses/min and 5 V, named the LED/kinetic power ratio, and scoped the LED baseline to the comparison digit. Numeric results remain unchanged. |
| A demo described mint bars as cyan; instructions still referred to a navigation “layer.” | Matched the actual color and current chapter/slider controls. Also clarified component selection and the camera accuracy label. |
| The default error page gave visitors no path back from a retired or invalid URL. | Added a simple 404 in the portfolio palette with a direct workbench link. The response retains its 404 status. |

## Validation

`npm run check` passed typecheck, lint and the production static export. Both Chrome suites passed after the changes, including new landscape inspection checks and native links to the last two chapters of every project. Image dialogs, keyboard interaction, Back/Forward, bench return, reduced motion and JavaScript-disabled reading passed. Kinetic and charging videos were separately played successfully. No browser exceptions, broken local links/anchors, missing visible images or document-wide horizontal overflow were detected.

The suites are `scripts/verify-bench.mjs` and `scripts/verify-projects.mjs`. `scripts/audit-portfolio.mjs` captures project chapters and bench inspections against the local server; its generated captures are ignored by Git. The audit checked local links, not external service availability. Browser coverage is Chrome; Safari and Firefox still need a separate compatibility pass.

Selected evidence: [landscape before](landscape-before.png), [landscape after](../bench/landscape-844x390.png), [evidence layout before](evidence-before.png), [evidence layout after](evidence-after.png), [final chapter on mobile](final-chapter-mobile.png), [legible comparison](camera-comparison-after.png), [expanded comparison](camera-comparison-expanded.png), [mobile 404](not-found-mobile.png). The [project gallery](../projects/README.md) contains updated desktop/mobile views.

## Remaining enhancements

1. **Strengthen secondary-project evidence.** Camera accuracy/false-alarm claims need dataset and test-duration context. IoT latency, battery-life and reconnect claims need the baseline, workload and measurement conditions. Link the existing reports, logs or repositories when available; these details cannot be supplied from the current content.
2. **Clarify ownership on the remaining projects.** STM32, EEG, Waypoint and charging already state a role. Camera, IoT, kinetic and iGuard would benefit from a concise statement of personal contribution and team/client scope, once confirmed.
3. **Check other browsers.** The current checks cover Chrome. Safari and Firefox should receive a separate pass for native dialogs, sticky rails and mobile viewport sizing before deployment.

These are content and usability follow-ups. The review did not change project URLs, invent measurements, or deploy the site.
