# Show More Button Guide

## Purpose
The "Show More" button allows you to limit how many sections are displayed on your home page at first, and lets users reveal more sections incrementally.

---

## How It Works

### 1. Initial Section Limit
- The number of sections shown by default is controlled by the `visibleCount` state:
  ```js
  const [visibleCount, setVisibleCount] = useState(30);
  ```
- This means, when the page loads, only the first 30 sections will be visible.

### 2. Rendering Sections
- The home page renders only the first `visibleCount` sections:
  ```js
  {sections.slice(0, visibleCount).map((section, idx) => (
    // ...render section...
  ))}
  ```

### 3. Show More Button
- If there are more sections than `visibleCount`, and the "Show More" feature is enabled in the sidebar, a "Show More" button appears at the bottom of the page:
  ```js
  {(pageProperties.showMoreEnabled ?? true) && visibleCount < sections.length && (
    <div className="flex justify-center my-8">
      <button
        onClick={() => setVisibleCount(c => Math.min(c + 2, sections.length))}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow"
      >
        Show More
      </button>
    </div>
  )}
  ```
- When the user clicks "Show More", `visibleCount` increases by 2, revealing two more sections each time.

### 4. Enabling/Disabling the Button
- In the PageControls sidebar, under the "Metadata" tab, there is a toggle labeled "Enable Show More Button".
- If this is turned off, the button will not appear, and all sections will be shown at once.

---

## Adjusting the Default Limit

- To change how many sections are shown by default, simply change the number in:
  ```js
  const [visibleCount, setVisibleCount] = useState(30);
  ```
  - For example, `useState(6)` will show 6 sections by default.
  - `useState(10)` will show 10 sections, and so on.

- To change how many sections are revealed per click, adjust the increment in the button’s `onClick`:
  ```js
  onClick={() => setVisibleCount(c => Math.min(c + 2, sections.length))}
  ```
  - Change `2` to any number you want.

---

## Summary Table

| Setting/Code                                 | What it Controls                                 |
|----------------------------------------------|--------------------------------------------------|
| `useState(30)`                              | Number of sections shown by default              |
| `setVisibleCount(c => Math.min(c + 2, ...))` | Number of sections revealed per "Show More" click|
| Sidebar "Enable Show More Button" toggle     | Whether the button is shown at all               |

---

**That’s it!**
This setup gives you full control over how many sections are visible by default, how many are revealed per click, and whether the feature is enabled at all. 