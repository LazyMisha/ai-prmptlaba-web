# Pages design and user flows

## Page Specifications (High Level)

### `Home` Page

**Route:** `/` path: `app/[lang]/(home)/index.tsx`

- **Purpose:** Welcome page
- **UI Elements:**
  - **Logo:** Top center
  - **Title:** "AI Prompt Laba"
  - **Description:** Brief app overview
  - **"Get Started" Button:** Navigates to Enhance page

### `Enhance` Page

**Route:** `/enhance` path: `app/[lang]/(inner)/enhance/index.tsx`

- **Purpose:** The primary workspace for prompt generation
- **UI Elements:**
  - **Description:** Brief page overview
  - **Inputs:**
    - **Context Dropdown:** Options:
      - Image Generator
      - Video Generator
      - Text Generator
      - Software Development Assistant
      - LinkedIn Post Generator
      - Facebook Post Creator
      - Twitter Post Creator
      - Instagram Post Generator
      - General
    - **Prompt Input:** Text area for user input
    - **Action Button:** "Enhance"
  - **Output (Post-Action):**
    - Card Token badge: displays the number of tokens used
    - Card Displays: "BEFORE" and "AFTER" expandable text
    - Card Metadata: Date and Category badges
    - Card Actions: Copy, Save

### `My Collections` Page

**Route:** `/saved` path: `app/[lang]/(inner)/saved/index.tsx`

- **Purpose:** Library management for saved prompts
- **UI Elements:**
  - **Description:** Brief page overview
  - **Collection Dropdown:** Select existing collection to show prompts from
  - **"Create Collection" Button:** Blue primary button - opens modal for new collection creation
  - **"Manage Collections" Button:** Blue primary button - opens collection management modal
  - **List View:**
    - Card Token badge: displays the number of tokens used
    - Card Displays: "BEFORE" and "AFTER" expandable text
    - Card Metadata: Date and Category badges
    - Card Actions: Copy, Delete, Move

### `History` Page

**Route:** `/history` path: `app/[lang]/(inner)/history/index.tsx`

- **Purpose:** Display a list of recently enhanced prompts
- **UI Elements:**
  - **Description:** Brief page overview
  - **Counter:** (e.g., "12 entries")
  - **"Clear All" Button:** Text button to wipe history -> confirmation dialog
  - **List View:** sorted by most recent
    - Card Token badge: displays the number of tokens used
    - Card Displays: "BEFORE" and "AFTER" expandable text
    - Card Metadata: Date and Category badges
    - Card Actions: Copy, Delete, Save

### Header & Navigation

**Component Path:** `app/components/common/Header.tsx`

- **UI Elements:**
  - **Logo:** Left aligned, clickable to `Home`
  - **Page Title:** Center aligned, skip on `Home` page
  - **Navigation Links:** Right aligned
    - Enhance
    - My Collections
    - History
  - **Language Selector:** Dropdown with options:
    - English (en)
    - Ukrainian (ua)

---

## User Flows

- **Enhance Flow:** User enters text -> Clicks Enhance -> App calls API -> Result displayed -> User Copies or Saves
- **Save Flow:** User clicks Save on result -> Selects or Creates collection -> confirms "Saved"
- **Collection Flow:** User opens My Collections -> Selects collection -> Views saved prompts -> Manages (Copy, Delete, Move)
- **History Flow:** User opens History -> Finds old prompt -> Copies, Deletes, or Saves it
