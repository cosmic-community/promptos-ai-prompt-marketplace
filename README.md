# PromptOS - AI Prompt Marketplace

![App Preview](https://imgix.cosmicjs.com/36f0d9d0-b70c-11f0-ac0f-f7b89d2a648e-photo-1596526131083-e8c633c948d2-1761992352935.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A modern AI prompt marketplace built with Vue.js featuring macOS-inspired glassmorphism design. Browse and purchase high-quality AI prompts for ChatGPT, Midjourney, Gemini, Claude, and other AI tools.

## ✨ Features

- 🎨 **Glassmorphism UI Design** - macOS-inspired interface with semi-transparent panels and blur effects
- 🔍 **Category Filtering** - Filter prompts by Marketing, Design, Development, and Content Creation
- 💎 **Premium Prompt Library** - Curated collection of AI prompts with preview images and examples
- 💰 **Flexible Pricing** - Individual prompt purchases or subscription plans with discounts
- 🌓 **Dark/Light Mode** - Seamless theme switching with smooth transitions
- 📱 **Fully Responsive** - Beautiful experience on desktop, tablet, and mobile devices
- ⚡ **Fast & Modern** - Built with Vue 3 Composition API and Vite for optimal performance

## 🚀 Clone this Project

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=6905dbe0271316ad9f4cfda4&clone_repository=6905e001271316ad9f4cfde4)

## 📋 Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create a modern and elegant website with a macOS-style glassmorphism interface for selling AI Prompts.
> 
> ### 🧠 Website purpose
> A professional e-commerce site dedicated to selling AI prompts for ChatGPT, Midjourney, Gemini, Claude, and other AI tools.  
> Users can browse, try, and purchase prompts or subscribe to monthly plans.
> 
> ---
> 
> ### 🎨 Design & Aesthetic
> - Design style: **macOS-inspired**, clean, minimal, and elegant.
> - Use **glassmorphism** effects: semi-transparent white panels with blur (rgba(255,255,255,0.2)) and soft shadows.
> - Rounded corners (border-radius: 16px–24px).
> - Font: **SF Pro Display** or **Inter**.
> - Light and dark mode switch.
> - Subtle hover animations and depth effects.
> - Use pastel tones (white, gray, lavender, sky blue).
> - Navigation bar and modals should float with acrylic transparency like macOS windows.
> 
> ---
> 
> ### 🧩 Main Pages & Features
> 
> #### 1. Home Page
> - Hero section:  
>   - Title: "Explore, Buy, and Master AI Prompts."  
>   - Subtitle: "Your all-in-one store for ChatGPT, Midjourney, and Gemini prompts."  
>   - CTA buttons: "Browse Prompts" and "Start Free Trial".
> - Featured categories: ChatGPT / Midjourney / Gemini / Developer / Marketing / Design.
> - Trending and Recommended prompts section.
> - Floating search bar with blur background.
> - Testimonials and trust badges (like "10,000+ users trust us").
> 
> ---
> 
> #### 2. Prompt Detail Page
> - Large preview section showing the prompt's purpose and example outputs.
> - Description, tags, difficulty, and category.
> - Pricing section:
>   - Buy once (e.g., 20,000đ)
>   - Or Subscribe to unlock all.
> - Buttons:
>   - "Use Trial" (if not subscribed)
>   - "Buy Now"
> - Related prompts below (carousel style).
> 
> ---
> 
> #### 3. User Account Page
> - Profile info: avatar, username, balance, purchase history.
> - "Top up wallet" button.
> - Section for managing subscriptions (1 month / 3 months / 6 months).
> - Dark/light toggle switch in top bar (macOS-style toggle).
> 
> ---
> 
> #### 4. Payment & Wallet System
> **Two payment modes:**
> 1. **Wallet Payment**
>    - Users can top up their wallet using:
>      - Bank transfer (display account number & QR code)
>      - E-wallets (Momo, ZaloPay, etc.)
>    - Show balance and transactions.
>    - Purchase prompts with one click using wallet balance.
> 
> 2. **Direct Bank Transfer**
>    - When purchasing, show:
>      - Bank name, account number, owner name, and transfer note.
>    - After payment confirmation, grant access to prompt or send via email.
> 
> ---
> 
> #### 5. Subscription Plans Page
> - Elegant macOS-style cards:
>   - **1 Month** – Standard Access
>   - **3 Months** – Save 10%
>   - **6 Months** – Save 20%
> - Cards should have acrylic backgrounds, hover scaling animation.
> - "Buy Now" buttons with blur-glass effects.
> 
> ---
> 
> #### 6. Free Trial System
> - New users can try up to 3 prompts for free.
> - After the limit, show modal: "Upgrade your plan to continue using prompts."
> - Use a soft blur modal (glassmorphism).
> 
> ---
> 
> #### 🧭 Navigation
> Top bar:
> - Logo (PromptOS)
> - Links: Home, Prompts, Pricing, Wallet, Account
> - Search icon (magnifying glass)
> - Theme toggle (☀️/🌙 icon)
> - "Login" or avatar dropdown
> 
> Footer:
> - Contact info
> - Terms & Privacy Policy
> - Social icons (minimalist Apple-style)
> 
> ---
> 
> ### ⚙️ Technical & Interaction Details
> - Responsive design (desktop, tablet, mobile)
> - Light/Dark mode switching with smooth transition
> - Use blur backdrop for modals and navbar
> - Smooth scroll, shadow transitions
> - Floating buttons and cards should feel like macOS windows
> 
> ---
> 
> ### 💳 Payment Flow Summary
> 1. User selects a prompt or subscription.
> 2. Chooses to pay via:
>    - Wallet (balance deducted)
>    - Direct bank transfer (manual confirmation)
> 3. On success → show download or copy prompt page.
> 
> ---
> 
> ### ✨ Optional Enhancements
> - Show AI-generated preview of prompt output
> - Add "favorite" or "wishlist" feature
> - Notification panel for purchases
> - Integrate small chat widget (for support)
> 
> ---
> 
> ### 🧾 Summary
> Create a **modern macOS-inspired AI Prompt Store** with:
> - Glassmorphism UI (blurred transparent panels)
> - Prompt browsing and purchasing
> - Wallet & direct bank transfer payment system
> - Free trial and subscription options
> - Light/Dark mode
> - Smooth animations and depth
> 
> Output should be a complete front-end design with dummy data and modern aesthetics."

### Code Generation Prompt

> "Develop a Vue.js application that uses my existing object types and objects"

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠️ Technologies Used

- **Vue 3** - Progressive JavaScript framework with Composition API
- **Vite** - Next-generation frontend build tool
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Cosmic CMS** - Headless CMS for content management
- **Vue Router** - Official routing library
- **Axios** - HTTP client for API requests

## 📋 Prerequisites

- Node.js 18+ or Bun runtime
- A Cosmic account with bucket access
- Basic knowledge of Vue.js and TypeScript

## 🚀 Getting Started

### Installation

1. Clone this repository
2. Install dependencies:

```bash
bun install
```

3. Create a `.env` file in the root directory:

```env
VITE_COSMIC_BUCKET_SLUG=your-bucket-slug
VITE_COSMIC_READ_KEY=your-read-key
VITE_COSMIC_WRITE_KEY=your-write-key
```

4. Start the development server:

```bash
bun run dev
```

5. Open your browser to `http://localhost:5173`

## 📚 Cosmic SDK Examples

### Fetching Prompts

```typescript
import { cosmic } from './lib/cosmic'

// Get all prompts with category information
const response = await cosmic.objects
  .find({ type: 'prompts' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

const prompts = response.objects
```

### Filtering by Category

```typescript
// Get prompts for a specific category
const response = await cosmic.objects
  .find({
    type: 'prompts',
    'metadata.category': categoryId
  })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)
```

### Fetching Subscription Plans

```typescript
const response = await cosmic.objects
  .find({ type: 'subscription-plans' })
  .props(['id', 'title', 'slug', 'metadata'])

const plans = response.objects.sort((a, b) => 
  a.metadata.duration_months - b.metadata.duration_months
)
```

## 🎨 Cosmic CMS Integration

This application uses three main content types from your Cosmic bucket:

### Prompts
- **Description**: Detailed explanation of the prompt
- **Category**: Connected to Categories object type
- **AI Tool**: Select dropdown (ChatGPT, Midjourney, Gemini, Claude, Stable Diffusion)
- **Difficulty Level**: Beginner, Intermediate, Advanced
- **Price**: Numeric value in VND
- **Preview Image**: Visual representation
- **Example Output**: Sample results
- **Prompt Content**: The actual prompt text
- **Tags**: Comma-separated keywords
- **Is Featured**: Boolean for trending/recommended

### Categories
- **Description**: Category explanation
- **Icon Emoji**: Visual icon
- **Display Order**: Sort order control

### Subscription Plans
- **Duration (Months)**: Plan length
- **Price**: Cost in VND
- **Discount Percentage**: Savings compared to monthly
- **Features**: Newline-separated list
- **Is Popular**: Boolean for recommended plan

## 🚀 Deployment Options

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_COSMIC_BUCKET_SLUG`
   - `VITE_COSMIC_READ_KEY`
   - `VITE_COSMIC_WRITE_KEY`
4. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository in Netlify
3. Set build command: `bun run build`
4. Set publish directory: `dist`
5. Add environment variables in Netlify dashboard
6. Deploy!

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Support

For questions or issues, please visit [Cosmic Docs](https://www.cosmicjs.com/docs) or contact support.

<!-- README_END -->