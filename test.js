const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');

console.log('=== RUNNING COMPREHENSIVE CAFE MENU & ORDER TESTS ===\n');

// 1. Basic Structure Checks
const checks = [
  { name: 'Self-contained index.html', pass: html.includes('<!DOCTYPE html>') },
  { name: 'CONFIG object defined', pass: html.includes('const CONFIG = {') },
  { name: 'MENU_DATA array defined', pass: html.includes('const MENU_DATA = [') },
  { name: 'wa.me WhatsApp link structure', pass: html.includes('https://wa.me/') },
  { name: 'encodeURIComponent used for WhatsApp message', pass: html.includes('encodeURIComponent') },
  { name: 'Google Fonts with fallback stack', pass: html.includes('Plus+Jakarta+Sans') && html.includes('system-ui') },
  { name: 'Light & Dark theme via CSS variables', pass: html.includes('prefers-color-scheme') && html.includes('--bg-page') },
  { name: 'prefers-reduced-motion supported', pass: html.includes('prefers-reduced-motion') },
  { name: 'localStorage wrapped in try/catch', pass: html.includes('localStorage.getItem') && html.includes('try {') },
  { name: 'Veg-only toggle input present', pass: html.includes('id="vegOnlyToggle"') },
  { name: 'Demo mode notice banner present', pass: html.includes('id="demoModeBanner"') },
  { name: 'URL table query support (?table=5)', pass: html.includes('urlParams.has("table")') || html.includes('urlParams.get("table")') },
  { name: 'URL hash table support (#table-5)', pass: html.includes('window.location.hash') },
  { name: 'Touch target size minimum 44px', pass: html.includes('min-height: 44px') }
];

let allPassed = true;
checks.forEach(c => {
  if (c.pass) {
    console.log(`✅ ${c.name}`);
  } else {
    console.log(`❌ FAIL: ${c.name}`);
    allPassed = false;
  }
});

// 2. Logic & Execution Testing
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  console.error('❌ Could not extract script from index.html');
  process.exit(1);
}

const scriptCode = scriptMatch[1];

function createMockEnvironment(initialSearch = '', initialHash = '') {
  const elements = {};
  function getEl(id) {
    if (!elements[id]) {
      elements[id] = {
        id,
        style: {},
        classList: {
          classes: new Set(),
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); },
          toggle(c, force) {
            if (force === undefined) {
              if (this.classes.has(c)) this.classes.delete(c);
              else this.classes.add(c);
            } else if (force) {
              this.classes.add(c);
            } else {
              this.classes.delete(c);
            }
          },
          contains(c) { return this.classes.has(c); }
        },
        setAttribute(k, v) { this[k] = v; },
        getAttribute(k) { return this[k]; },
        removeAttribute(k) { delete this[k]; },
        appendChild() {},
        querySelectorAll() { return []; },
        scrollIntoView() {},
        value: '',
        textContent: '',
        innerHTML: ''
      };
    }
    return elements[id];
  }

  const storageMap = {};

  const context = {
    console: console,
    document: {
      documentElement: {
        setAttribute: () => {},
        getAttribute: () => 'light'
      },
      addEventListener: () => {},
      getElementById: (id) => getEl(id),
      querySelectorAll: () => [],
      createElement: (tag) => ({
        tag,
        style: {},
        classList: {
          classes: new Set(),
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); },
          toggle(c, f) { if (f) this.classes.add(c); else this.classes.delete(c); }
        },
        setAttribute: () => {},
        appendChild: () => {},
        innerHTML: '',
        textContent: ''
      }),
      title: '',
      body: { style: {} }
    },
    window: {
      location: {
        search: initialSearch,
        hash: initialHash
      },
      matchMedia: () => ({ matches: false, addEventListener: () => {} }),
      URLSearchParams: global.URLSearchParams
    },
    URLSearchParams: global.URLSearchParams,
    localStorage: {
      getItem: (k) => storageMap[k] || null,
      setItem: (k, v) => { storageMap[k] = String(v); },
      removeItem: (k) => { delete storageMap[k]; }
    },
    IntersectionObserver: class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
    elements: elements,
    setTimeout: (fn) => fn(),
    clearTimeout: () => {}
  };

  vm.createContext(context);
  vm.runInContext(
    scriptCode + `
    this.out_CONFIG = CONFIG;
    this.out_MENU_DATA = MENU_DATA;
    this.out_state = state;
    this.out_buildWhatsAppUrl = buildWhatsAppUrl;
    this.out_getCartTotals = getCartTotals;
    this.out_updateItemQty = updateItemQty;
    this.out_clearCart = clearCart;
    this.out_setOrderType = setOrderType;
    this.out_detectTableFromUrl = detectTableFromUrl;
    this.out_validateOrderButton = validateOrderButton;
    this.out_isItemMatchingSearch = isItemMatchingSearch;
    this.out_elements = elements;
  `, context);

  return context;
}

console.log('\n--- Testing Logic & Message Formats ---');

// Test A: URL Table Detection (?table=5)
{
  const env = createMockEnvironment('?table=5', '');
  env.out_detectTableFromUrl();
  const tableVal = env.out_state.tableNumber;
  if (tableVal === '5') {
    console.log('✅ URL table (?table=5) correctly parsed as: ' + tableVal);
  } else {
    console.log('❌ URL table parsing failed, got: ' + tableVal);
    allPassed = false;
  }
}

// Test B: URL Hash Detection (#table-12)
{
  const env = createMockEnvironment('', '#table-12');
  env.out_detectTableFromUrl();
  const tableVal = env.out_state.tableNumber;
  if (tableVal === '12') {
    console.log('✅ URL hash (#table-12) correctly parsed as: ' + tableVal);
  } else {
    console.log('❌ URL hash parsing failed, got: ' + tableVal);
    allPassed = false;
  }
}

// Test C: Cart Operations: Add, Stepper (+ and -), Remove
{
  const env = createMockEnvironment('', '');
  // Start empty
  if (Object.keys(env.out_state.cart).length === 0) {
    console.log('✅ Initial cart is empty');
  }

  // Add 1
  env.out_updateItemQty('chai-kulhad', 1);
  if (env.out_state.cart['chai-kulhad'] === 1) {
    console.log('✅ Added 1 item successfully');
  } else {
    console.log('❌ Cart item add failed');
    allPassed = false;
  }

  // Increase to 3
  env.out_updateItemQty('chai-kulhad', 2);
  if (env.out_state.cart['chai-kulhad'] === 3) {
    console.log('✅ Stepper increased quantity to 3');
  } else {
    console.log('❌ Stepper increase failed');
    allPassed = false;
  }

  // Decrease to 2
  env.out_updateItemQty('chai-kulhad', -1);
  if (env.out_state.cart['chai-kulhad'] === 2) {
    console.log('✅ Stepper decreased quantity to 2');
  } else {
    console.log('❌ Stepper decrease failed');
    allPassed = false;
  }

  // Decrease to 0 -> should delete key
  env.out_updateItemQty('chai-kulhad', -2);
  if (env.out_state.cart['chai-kulhad'] === undefined) {
    console.log('✅ Decreasing to 0 removes item completely from cart');
  } else {
    console.log('❌ Item not removed from cart when 0');
    allPassed = false;
  }
}

// Test D: WhatsApp Message Formatting (Dine-in and Takeaway)
{
  const env = createMockEnvironment('?table=5', '');
  env.out_detectTableFromUrl();
  env.out_state.customerName = 'Rahul Sharma';
  env.out_state.orderNote = 'Less sugar in chai, extra spicy sandwich';

  // Add items: 2 x Kulhad Masala Chai (35 -> 70), 1 x Bombay Masala Grilled Sandwich (105 -> 105)
  env.out_updateItemQty('chai-kulhad', 2);
  env.out_updateItemQty('sandwich-bombay-masala', 1);

  const totals = env.out_getCartTotals();
  if (totals.totalCount === 3 && totals.totalPrice === 175) {
    console.log(`✅ Cart totals correct: 3 items, ₹${totals.totalPrice}`);
  } else {
    console.log(`❌ Cart totals mismatch: count=${totals.totalCount}, price=${totals.totalPrice}`);
    allPassed = false;
  }

  const url = env.out_buildWhatsAppUrl();
  const parsedUrl = new URL(url);
  const text = parsedUrl.searchParams.get('text');

  console.log('\nGenerated WhatsApp Message (Dine-in):');
  console.log('------------------------------------');
  console.log(text);
  console.log('------------------------------------');

  const expectedLines = [
    `*New order – ${env.out_CONFIG.cafeName}*`,
    'Table: 5',
    'Name: Rahul Sharma',
    '2 x Kulhad Masala Chai – ₹70',
    '1 x Bombay Masala Grilled Sandwich – ₹105',
    '*Total: ₹175*',
    'Note: Less sugar in chai, extra spicy sandwich'
  ];

  let formatOk = true;
  expectedLines.forEach(l => {
    if (!text.includes(l)) {
      console.log(`❌ Message missing expected line: "${l}"`);
      formatOk = false;
      allPassed = false;
    }
  });
  if (formatOk) {
    console.log('✅ WhatsApp message format matches specification perfectly!');
  }

  // Test Takeaway format
  env.out_setOrderType('takeaway');
  const takeawayUrl = env.out_buildWhatsAppUrl();
  const takeawayText = new URL(takeawayUrl).searchParams.get('text');

  if (takeawayText.includes('Table: Takeaway')) {
    console.log('✅ Takeaway order formatted correctly with "Table: Takeaway"');
  } else {
    console.log('❌ Takeaway formatting failed');
    allPassed = false;
  }
}

// Test E: Search Filtering Functionality
{
  const env = createMockEnvironment('', '');
  const item1 = env.out_MENU_DATA.find(i => i.id === 'chai-kulhad');
  const item2 = env.out_MENU_DATA.find(i => i.id === 'snack-peri-peri-fries');

  const matchChai = env.out_isItemMatchingSearch(item1, 'chai');
  const matchChaiOnFries = env.out_isItemMatchingSearch(item2, 'chai');
  const matchFries = env.out_isItemMatchingSearch(item2, 'fries');

  if (matchChai && !matchChaiOnFries && matchFries) {
    console.log('✅ Search filter correctly matches keywords');
  } else {
    console.log('❌ Search filter matching failed');
    allPassed = false;
  }
}

// Test F: Veg & Non-Veg Filtering
{
  const env = createMockEnvironment('', '');
  const menu = env.out_MENU_DATA;
  const vegItems = menu.filter(i => i.isVeg);
  const nonVegItems = menu.filter(i => !i.isVeg);
  console.log(`\nMenu summary: ${menu.length} total items (${vegItems.length} veg, ${nonVegItems.length} non-veg)`);
  if (vegItems.length >= 15 && nonVegItems.length >= 3) {
    console.log('✅ Realistic mixed menu with Veg & Non-Veg items present');
  } else {
    console.log('❌ Expected realistic balance of veg and non-veg items');
    allPassed = false;
  }
}

console.log('\n=============================================');
if (allPassed) {
  console.log('🎉 ALL COMPREHENSIVE TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED.');
  process.exit(1);
}
