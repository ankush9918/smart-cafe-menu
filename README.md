<div align="center">

# ☕ Smart Cafe Menu & WhatsApp Ordering System

**A modern, mobile-first digital menu and contactless ordering web app for cafes, restaurants, and tea lounges.**  
*Customers scan a QR code at their table, browse appetizing visual dishes, customize their cart, and send their order directly to the cafe's WhatsApp.*

[![Deploy to GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-22c55e?style=for-the-badge&logo=github&logoColor=white)](https://pages.github.com/)
[![Zero Backend](https://img.shields.io/badge/Backend-Zero_Server-3b82f6?style=for-the-badge&logo=cloudflare&logoColor=white)](#)
[![No Frameworks](https://img.shields.io/badge/Stack-Pure_HTML_+_CSS_+_JS-f97316?style=for-the-badge&logo=javascript&logoColor=white)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br/>

[✨ Live Demo](https://ankush9918.github.io/smart-cafe-menu/?table=5) • [📱 Table QR Generator](https://ankush9918.github.io/smart-cafe-menu/generate-qr.html) • [🚀 Deploy Guide](#-free-deployment) • [⚙️ Configuration](#-easy-customization)

</div>

---

## 🌟 Why This Project?

Traditional restaurant POS and ordering apps require expensive monthly subscriptions, complex backend servers, customer logins, and app downloads.

**Smart Cafe Menu** solves this completely:
- ❌ **No database required**
- ❌ **No app download or customer signups**
- ❌ **No payment gateway commissions**
- ✅ **100% Free Hosting on GitHub Pages / Netlify**
- ✅ **Self-contained single file (`index.html`)**
- ✅ **Order received directly on your Cafe's WhatsApp**

---

## ✨ Features & Highlights

| Feature | Description |
| :--- | :--- |
| 📍 **Table QR Auto-Detection** | Append `?table=5` or `#table-5` to your link. When scanned, the app auto-locks Dine-in and confirms: *"Ordering for Table 5 (Auto-detected from QR Code)"* without re-asking! |
| 📸 **Mouthwatering Dish Photos** | Swiggy/Zomato style food cards with high-res photos, golden bestseller tags, and smooth hover zoom. |
| 🟢 **FSSAI Veg / Non-Veg Standard** | Authentic green and red indicator symbols with an instant **"Veg Only"** toggle switch that auto-hides empty categories. |
| 🛒 **In-Card Stepper Controls** | Tap `+ ADD` and it instantly morphs into a `- 1 +` stepper directly on the dish card. |
| 📋 **Slide-Up Order Drawer** | Bottom sheet showing itemized summary, Dine-in vs Takeaway toggle, optional customer name, and kitchen instructions (e.g. *"less sugar"*). |
| 💬 **Formatted WhatsApp KOT** | Generates an instant, kitchen-ready formatted WhatsApp message with item counts, table number, notes, and grand total. |
| 🌗 **Dark & Light Modes** | Beautiful warm espresso dark theme and artisan cafe light theme, supporting auto-detection and a manual Sun/Moon toggle. |
| 🖨️ **1-Click Bulk QR Generator** | Includes [`generate-qr.html`](generate-qr.html) to batch generate and print table tent cards for all your tables (1 to 20+) in 1 click! |
| 💾 **Cart Persistence** | Cart and customer details are safely stored in `localStorage` with `try...catch` guards—reloading the page never loses the order. |

---

## 📲 How the WhatsApp Order Looks

When a customer finishes adding items and taps **"Send Order on WhatsApp"**, it automatically launches WhatsApp with a pre-filled Kitchen Order Ticket (KOT):

```text
*New order – Chai & Charcha Cafe*
Table: 5
Name: Rahul Sharma

2 x Kulhad Masala Chai – ₹70
1 x Bombay Masala Grilled Sandwich – ₹105

*Total: ₹175*
Note: Less sugar in chai, extra spicy sandwich
```

The cafe owner or counter staff simply receives this structured message on their phone or WhatsApp Web and starts preparing the order!

---

## ⚙️ Easy Customization

Everything is configured inside `index.html` at the top of the `<script>` tag. No build tools needed!

### 1. Update Cafe Details & WhatsApp Number
Open `index.html` and search for `CONFIG` (around line 1640):

```javascript
const CONFIG = {
  cafeName: "Chai & Charcha Cafe",
  tagline: "Slow-brewed chai, warm bites & great conversations",
  
  // ⚠️ Your 10-digit WhatsApp number with country code (no '+' or spaces)
  whatsappNumber: "919876543210", 
  
  currencySymbol: "₹",
  defaultOrderType: "dine-in",
  noticeText: "Freshly prepared to order • Dine-in & Takeaway"
};
```

### 2. Edit Dishes, Prices & Photos
Right below `CONFIG`, update the `MENU_DATA` array:

```javascript
{
  id: "chai-kulhad",
  name: "Kulhad Masala Chai",
  category: "Chai & Hot Sips",
  description: "Slow-simmered Assam tea brewed with crushed ginger, green cardamom, and cinnamon in a clay cup.",
  price: 35,
  isVeg: true,
  isBestseller: true,
  image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=320&auto=format&fit=crop&q=80"
}
```

---

## 🖨️ How to Generate Table QR Codes

You can generate QR codes for all your tables in two ways:

### Option A: Use the Included 1-Click Generator (Fastest!)
1. Open [`generate-qr.html`](generate-qr.html) in your browser.
2. Enter your live website URL (e.g. `https://ankush9918.github.io/smart-cafe-menu`).
3. Enter your cafe name and number of tables (e.g. `10`).
4. Click **"⚡ Generate Table Cards"** and then **"🖨️ Print All Cards (A4 PDF)"**.
5. Cut the printed cards and place them in acrylic table stands on each table!

### Option B: Manual QR Links
Use any free QR generator (e.g. [QRCode Monkey](https://www.qrcode-monkey.com/) or Canva) with these URLs:

| Table | QR Code Destination URL |
| :--- | :--- |
| **Table 1** | `https://ankush9918.github.io/smart-cafe-menu/?table=1` |
| **Table 2** | `https://ankush9918.github.io/smart-cafe-menu/?table=2` |
| **Table 3** | `https://ankush9918.github.io/smart-cafe-menu/?table=3` |
| **Counter / Takeaway** | `https://ankush9918.github.io/smart-cafe-menu/` |

---

## 🚀 Free Deployment

### Deploy on GitHub Pages (Recommended)
1. Fork or push this repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Smart Cafe Menu"
   git branch -M main
   git remote add origin https://github.com/ankush9918/smart-cafe-menu.git
   git push -u origin main
   ```
2. Go to your repo on GitHub: **Settings** > **Pages**.
3. Under **Branch**, select `main` and root `/(root)`, then click **Save**.
4. Your website is live in 60 seconds at `https://ankush9918.github.io/smart-cafe-menu/`!

### Deploy on Netlify (Drag & Drop)
1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Drag and drop this folder.
3. Your site is instantly live with free custom domain support and SSL!

---

## 🛠️ Tech Stack & Architecture

- **Markup & Layout:** Semantic HTML5, CSS Grid (2-column desktop), Flexbox (mobile-first)
- **Styling & Theming:** Custom CSS3 Variables, Glassmorphism, CSS Transitions (`prefers-reduced-motion` compliant)
- **Typography:** Google Fonts (*Plus Jakarta Sans* + *Playfair Display*) with native fallback stack
- **Icons:** Inline optimized SVG icons (zero external icon font dependencies)
- **State & Logic:** Vanilla ES6+ JavaScript, `IntersectionObserver` scrollspy, `localStorage` API

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE). Feel free to customize and use it for your cafe or restaurant!

<div align="center">
  <sub>Built with ❤️ for local cafes and food entrepreneurs.</sub>
</div>
