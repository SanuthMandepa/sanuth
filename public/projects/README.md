# Project photos

Drop screenshots here using these exact filenames. Each card switches from its
generated diagram to the real photo as soon as the file exists. No code change
is needed: `cover` is already pointed at these paths in `src/data/content.ts`,
and a missing file falls back to the diagram.

| Filename         | Project     | What to shoot                                            |
| ---------------- | ----------- | -------------------------------------------------------- |
| `rxray.jpg`      | RxRay       | The reviewer UI with inline evidence highlighting         |
| `chagasight.jpg` | ChagaSight  | The React ECG upload / inference screen                   |
| `emberloft.jpg`  | Emberloft   | The studio site homepage                                  |
| `pearmo.jpg`     | Pearmo      | App screens, composited side by side in a landscape frame |
| `internova.jpg`  | Internova   | Any working screen of the platform                        |

## Specs

- **Aspect ratio 16:10 landscape.** The card crops to fill, and the details
  panel covers roughly the left 34rem, so keep the important part of the shot on
  the **right-hand side** of the frame.
- **2400 x 1500 px** or larger. Next.js downscales, it cannot invent detail.
- **JPG** for screenshots. If you prefer PNG or WebP, change the extension in
  `cover` in `src/data/content.ts` to match.
- Aim for a light or mid-tone image. The card sits on a white section and the
  panel beside it is white.

Pearmo is the awkward one: phone screenshots are portrait. Composite two or
three onto a landscape background rather than letting a single tall screenshot
letterbox inside a 16:10 crop.
