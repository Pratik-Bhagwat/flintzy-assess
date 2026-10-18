# Postify – Project Guide

Postify is a dashboard for planning social media posts. You can see upcoming
posts, search and filter them, write a new post, and retry posts that failed.

**Built with:** Next.js (App Router), React, Tailwind CSS v4, shadcn/ui and
lucide-react icons.

Live demo: (https://postify-sooty.vercel.app/)
---

## 1. How to run the app

### What you need
- Node.js 20 or newer
- A package manager (npm, pnpm or yarn)

### Steps
1. **Install packages**
   ```bash
   npm install
   ```
2. **Add the shadcn/ui components we use** (skip any you already have)
   ```bash
   npx shadcn@latest add button input textarea select input-group field toggle-group dialog drawer dropdown-menu sidebar sheet tooltip separator collapsible skeleton
   ```
3. **Check these files exist**
   - `data/posts.json` – the starting (fake) posts
   - `public/LogosX.svg`, `public/LogosFacebook.svg`,
     `public/LogosTiktokIcon.svg`, `public/LogosInstagramIcon.svg` – platform logos
   - `hooks/use-mobile.ts` – comes with the shadcn sidebar
   - `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png` – the site icon
4. **Start the dev server**
   ```bash
   npm run dev
   ```
5. **Open** <http://localhost:3000>

### Check it like production
```bash
npm run build
npm start
```
Always test speed on this version, not on `npm run dev`.

### Check for mistakes
```bash
npm run lint
npx tsc --noEmit
```

### If something breaks
| Problem | Fix |
| --- | --- |
| "Module not found: `@/components/ui/...`" | Run the `shadcn add` command from step 2 |
| Platform logo looks broken | Check the four logo files in `public/` |
| Build error about `useSearchParams` | It must stay inside a `<Suspense>` (already done in `dashboard-content.tsx`) |
| Old icon in the browser tab | Replace `app/favicon.ico` and hard refresh |

There are no environment variables and no database. Nothing needs setting up.

---

## 2. The big picture

```
data/posts.json
      |  (read on the server)
      v
PostsProvider  ----->  Stat cards (counts)
 keeps all posts  ----->  Post list (grouped by day, filtered by the URL)
 add / retry      <-----  New post form, Retry button

Filters (search, status, platform)  <---->  the page URL
```

- The server reads the starting posts.
- One provider holds all posts in the browser, so every part of the screen shows
  the same data.
- Filters live in the URL, not in the provider.

---

## 3. Where things live

| Part | What it does |
| --- | --- |
| `app/layout.tsx` | Fonts, site title, description, icons, phone screen settings |
| `app/(dashboard)/layout.tsx` | Page frame: sidebar on desktop, bottom bar on phones and tablets |
| `app/(dashboard)/page.tsx` | The Queue page |
| `navigation/dashboard-nav.tsx` | Shows the sidebar or the bottom bar |
| `navigation/dashboard-sidebar.tsx`, `bottom-nav.tsx` | The two menus |
| `navigation/nav-items.ts` | The one list of menu items both menus use |
| `dashboard-content.tsx` | Puts stats, filters and posts together |
| `posts-provider.tsx` | Holds all posts. Has `addPost` and `retryPost` |
| `post-stats.tsx`, `stat-pill.tsx` | The four number cards |
| `filter-bar.tsx`, `filter-options.ts` | Search box, Status and Platform filters |
| `use-post-filters.ts` | Reads and writes filters in the URL |
| `post-sections.tsx`, `post-section.tsx` | Posts grouped by day |
| `post-card.tsx` | One post card, with the Retry button |
| `platform-stack.tsx` | The round platform logos on a card |
| `composer/new-post-dialog.tsx` | The New post form (dialog or drawer) |
| `platform-limits.tsx` | Character count bars for each platform |
| `lib/posts.ts` | Post types and where the starting posts come from |
| `lib/platforms.ts` | Each platform's name, logo and character limit |
| `lib/post-groups.ts` | Groups posts by day in the visitor's timezone |
| `lib/post-filters.ts` | Turns URL values into filters and filters posts |
| `lib/new-post.ts` | Form helpers: character count, date and time checks |
| `lib/retry-post.ts` | Retry rules and the fake retry request |

---

## 4. Key decisions

### Navigation and layout
- **Desktop gets a sidebar. Phones and tablets get a floating bottom bar.** A
  sidebar wastes space on small screens, and thumbs reach the bottom easily.
- **The bottom bar is a floating pill.** The active tab grows to show its name.
  Other tabs show only an icon (screen readers still read the name).
- **Menu items live in one list** (`nav-items.ts`). Both menus read it, so they
  never go out of sync. The active tab comes from the URL.
- **The menus live in the layout.** When you change page, only the content
  changes. The sidebar and bottom bar stay put.

### Posts and dates
- **Posts are grouped by day.** Today is open. Tomorrow and later days are
  closed. Planning ahead is easier when you open only what you need.
- **Only today and future posts show on this page.** Older posts belong on the
  Published page.
- **We use the visitor's own timezone.** A person in the US sees US times, and a
  person in India sees Indian times. The server cannot know a visitor's timezone,
  so the browser does the grouping. (See "Performance" for the cost.)

### Filters
- **Search, Status and Platform are saved in the URL**, like
  `/?q=autumn&status=failed&platform=x`. You can refresh, bookmark or share a
  filtered view.
- **Typing updates the URL after a short pause** (250ms). This keeps typing
  smooth.
- **Filtering happens in the browser**, so results change instantly.
- **When you filter, matching days open automatically,** so you do not have to
  hunt for results.
- **The stat cards ignore filters.** They always show overall totals.
- **A "Clear filters" button** appears when any filter is on.

### New post form
- **Dialog on desktop, drawer on mobile** (below 768px). One form is shared by
  both, so the rules are the same everywhere.
- **Character limits per platform:** X 280, Instagram 2,200, TikTok 2,200,
  Facebook 5,000. Each selected platform gets its own progress bar.
- **You cannot schedule if any selected platform is over its limit.** The button
  is disabled and a message explains why.
- **Date must be today or later. If it is today, the time must be in the
  future.** This uses the visitor's local time.
- **A new post is added to the right day** (a new day section is created if
  needed). That section opens, scrolls into view and the card glows for a few
  seconds.
- **If your filters would hide the new post, they are cleared,** so it does not
  look like nothing happened.

### Retry failed posts
- **The update is optimistic:** when you press Retry, the card changes straight
  away, so the app feels fast.
- **The fake request succeeds 80% of the time and fails 20%** (random).
- **On success, the new status depends on the date:**
  - Failed post dated for a **later day** → **Scheduled** (it is not due yet).
  - Failed post due **today** → **Published**.
- **On failure,** the post goes back to Failed and shows "Retry failed. Please try
  again."
- **The label while waiting** is "Scheduling…" or "Publishing…" to match.
- **Stat cards update too,** because all posts live in one place
  (`posts-provider`).
  
---

## 5. Known limits

- **Nothing is saved.** Refreshing the page resets all changes. New posts and
  retries disappear.
- **Old failed posts are hidden** on this page, so filtering by "Failed" shows
  fewer posts than the Failed stat card.

---
