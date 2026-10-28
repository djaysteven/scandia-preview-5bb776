(function () {
  const header = document.getElementById("header");
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const form = document.getElementById("inquiryForm");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const menuScrim = document.getElementById("menuScrim");
  const menuClose = document.getElementById("menuClose");
  let menuClosingTimer = null;
  let menuScrollY = 0;

  function setMenu(open) {
    if (!mobileNav || !menuBtn) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (menuClosingTimer) {
      clearTimeout(menuClosingTimer);
      menuClosingTimer = null;
    }
    const d = (typeof i18nDicts !== "undefined" && i18nDicts[currentLang]) || {};
    if (open) {
      mobileNav.hidden = false;
      if (menuScrim) menuScrim.hidden = false;
      menuScrollY = window.scrollY || window.pageYOffset || 0;
      document.documentElement.classList.add("menu-open");
      document.body.classList.add("menu-open");
      document.body.style.top = "-" + menuScrollY + "px";
      if (reduce) {
        mobileNav.classList.add("open");
        if (menuScrim) menuScrim.classList.add("open");
      } else {
        void mobileNav.offsetWidth;
        requestAnimationFrame(() => {
          mobileNav.classList.add("open");
          if (menuScrim) menuScrim.classList.add("open");
        });
      }
      menuBtn.setAttribute("aria-expanded", "true");
      menuBtn.setAttribute("aria-label", d["aria.menuClose"] || "Close menu");
      const focusEl = menuClose || mobileNav.querySelector("a, button");
      if (focusEl) setTimeout(() => focusEl.focus(), reduce ? 0 : 50);
    } else {
      mobileNav.classList.remove("open");
      if (menuScrim) menuScrim.classList.remove("open");
      document.documentElement.classList.remove("menu-open");
      document.body.classList.remove("menu-open");
      document.body.style.top = "";
      window.scrollTo(0, menuScrollY);
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", d["aria.menuOpen"] || "Open menu");
      const hide = () => {
        mobileNav.hidden = true;
        if (menuScrim) menuScrim.hidden = true;
        menuClosingTimer = null;
      };
      if (reduce) hide();
      else menuClosingTimer = setTimeout(hide, 340);
      menuBtn.focus();
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", () => setMenu(!mobileNav.classList.contains("open")));
  }
  if (menuClose) menuClose.addEventListener("click", () => setMenu(false));
  if (menuScrim) menuScrim.addEventListener("click", () => setMenu(false));
  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });
  }
  function menuFocusables() {
    if (!mobileNav) return [];
    return Array.from(
      mobileNav.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => {
      if (el.hasAttribute("disabled") || el.getAttribute("aria-hidden") === "true") return false;
      const style = window.getComputedStyle(el);
      return style.visibility !== "hidden" && style.display !== "none";
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!mobileNav || !mobileNav.classList.contains("open")) return;
    if (e.key === "Escape") {
      setMenu(false);
      return;
    }
    if (e.key !== "Tab") return;
    const list = menuFocusables();
    if (!list.length) return;
    const first = list[0];
    const last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });


  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      i18nAlert("form.alert", "Thanks! This is a front-end demo — inquiry submit is demo-only and will be connected after they invest. Please call, email, or WhatsApp the lodge for now.");
    });
  }

  const els = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add("in"));
  }


  /* --- i18n: TH/EN flag selector (embedded dicts for file:// + JSON files kept) --- */
  const LANG_KEY = "pattaya-demo-lang";
  const i18nDicts = {
    en: {"meta.title": "Scandia Jomtien Beach | Beautiful rooms near the beach", "meta.description": "Scandia Beach Hotel — 48 rooms about 200 meters from Jomtien Beach, Soi 7. Outdoor pool, coffee shop, and front desk. Book: booking@scandiajomtienbeach.com", "aria.home": "Scandia Jomtien Beach home", "aria.primaryNav": "Primary", "aria.menuOpen": "Open menu", "aria.menuClose": "Close menu", "aria.langSwitch": "Language", "aria.menuDialog": "Menu", "aria.gallery": "Hotel photos from Scandia site", "nav.rooms": "Rooms", "nav.gallery": "Gallery", "nav.facilities": "Facilities", "nav.about": "About", "nav.faq": "FAQ", "nav.nearby": "Nearby", "nav.book": "Book", "nav.contact": "Contact", "nav.compare": "Compare old vs new", "nav.cta": "Book inquiry", "nav.reviews": "Reviews", "menu.close": "Close", "theme.appearance": "Appearance", "theme.dark": "Dark", "theme.light": "Light", "theme.darkAnnounce": "Dark theme", "theme.lightAnnounce": "Light theme", "hero.pill": "200 m from Jomtien Beach · Soi 7", "hero.title": "Scandia <em>Jomtien Beach</em>", "hero.tagline": "Beautiful rooms near the beach", "hero.lead": "Scandia is located just 200 meters from the beautiful Jomtien sand beach. With 48 beautiful rooms and a swimming pool, your stay is made for relaxing.", "hero.ctaBook": "Send booking inquiry", "hero.ctaCall": "Call +66 096 221 1003", "hero.ctaEmail": "Email booking", "stat.roomsStrong": "48", "stat.roomsSpan": "beautiful rooms", "stat.beachStrong": "200 m", "stat.beachSpan": "to Jomtien Beach", "stat.poolStrong": "Pool", "stat.poolSpan": "& coffee shop", "float.a.strong": "Only 200 m from the beach", "float.a.span": "Coffee shop · outdoor pool · front desk", "float.b.strong": "Nice & clean suites", "float.b.span": "A/C · flat-screen TV · fridge · private bath", "alt.hero": "Jomtien Beach near Scandia Beach Hotel", "alt.room": "Scandia Beach Hotel guest suite", "alt.pool": "Scandia Beach Hotel outdoor swimming pool", "alt.beach": "Jomtien sand beach near Scandia", "loc.band": "Located on <strong>Jomtien Beach Soi 7</strong> — just <strong>200 meters</strong> from the beautiful Jomtien sand beach. Welcome to Scandia Beach Hotel.", "rooms.label": "Rooms & suites", "rooms.title": "Nice & clean suites", "rooms.lead": "Every suite features a private bathroom and shower, air conditioning, a flat-screen TV with English and Thai channels, and a fridge.", "feat.bath.h": "Private bathroom", "feat.bath.p": "Private bathroom and shower in every suite.", "feat.ac.h": "Air conditioning", "feat.ac.p": "Stay cool with air conditioning in every room.", "feat.tv.h": "Flat-screen TV", "feat.tv.p": "English and Thai channels on a flat-screen TV.", "feat.fridge.h": "Fridge", "feat.fridge.p": "In-room fridge for drinks and essentials.", "feat.hair.h": "Hairdryer", "feat.hair.p": "Hairdryers available in all rooms (FAQ).", "feat.iron.h": "Iron & board", "feat.iron.p": "Iron and ironing board placed in the room for guest convenience.", "feat.wifi.h": "Fiber Wi-Fi", "feat.wifi.p": "Wireless Fiber Internet in rooms. Complimentary for guests who book through the hotel’s own website.", "feat.water.h": "Bottled water", "feat.water.p": "Tap water is not potable; complimentary bottled water is supplied daily.", "rooms.typesTitle": "Room configurations (from FAQ)", "rooms.twin.h": "Superior Twin Suite", "rooms.twin.p": "The only twin-bedded configuration noted on the FAQ.", "rooms.deluxe.h": "Deluxe Suites", "rooms.deluxe.p": "Can stay 4 people. There are no dedicated quadruple rooms.", "rooms.extra.h": "Extra bed", "rooms.extra.p": "Other rooms can be converted to a triple by placing an extra bed (THB 150). No inter-connecting rooms.", "rooms.nonsmoke.h": "Non-smoking", "rooms.nonsmoke.p": "Non-smoking rooms on request, subject to availability.", "gallery.label": "Photos", "gallery.title": "A glimpse of Scandia", "gallery.lead": "Three real photos from scandiajomtienbeach.com — beach, pool, and room.", "gallery.note": "Traveler photos: TripAdvisor gallery linked from the old menu.", "peek.beach": "Beach", "peek.pool": "Pool", "peek.room": "Room", "about.label": "About us", "about.title": "Welcome to Scandia Beach Hotel", "about.lead": "Scandia offers a range of facilities and services for a comfortable Jomtien stay — polished from the hotel’s published About Us page.", "about.reception.h": "Reception & concierge", "about.reception.p": "Lobby reception with warm Thai hospitality. Published hours note 24-hour reception historically, with COVID-era hours listed as 9 am–11 pm.", "about.security.h": "CCTV & security", "about.security.p": "CCTV surveillance, smoke detectors, and sprinklers. 12-hour reception, maintenance, and security services listed on About Us.", "about.parking.h": "Free parking nearby", "about.parking.p": "Free public parking at Rompho / Romhoo Market near Scandia (About Us: ~75 m; FAQ: ~200 m). Confirm on arrival.", "about.fitness.h": "Fitness centre (nearby)", "about.fitness.p": "Nearby fitness option about 70 meters from Scandia — 50 baht per time. Opening hours listed 8:00 am–10:00 pm.", "about.massage.h": "In-room massage", "about.massage.p": "Massage in your room, 10:00 am–10:00 pm — book at reception.", "about.servicesTitle": "Our services (from About Us)", "svc.reception": "12-hour reception, maintenance, and security services", "svc.chillz": "Chillz Restaurant (listed NOT OPEN UNDER COVID on About Us)", "svc.roomService": "Room service (9:00 am–10:00 pm per FAQ — not 24-hour)", "svc.business": "Business Center services (listed NOT OPEN UNDER COVID on About Us)", "svc.cctv": "CCTV, smoke detectors, and sprinklers", "svc.housekeeping": "Daily housekeeping services (ON REQUEST)", "svc.internet": "Internet stations", "svc.laundry": "Laundry and dry cleaning services", "svc.tour": "Limousine and tour services", "svc.nonsmoke": "Non-smoking rooms on request", "svc.parking": "Free parking nearby (~75–200 m at Rompho Market)", "fac.label": "Facilities & services", "fac.title": "Relax at the pool — then explore Pattaya", "fac.lead": "Outdoor swimming pool, coffee shop, and front desk for your convenience. Pool size (FAQ): 20 m length × 3 m width × 0.6 m depth.", "fac.pool": "Outdoor swimming pool", "fac.coffee": "Coffee shop", "fac.desk": "Front desk / reception", "fac.wifi": "Fiber Wi-Fi (complimentary on direct web bookings)", "fac.laundry": "Laundry & dry cleaning", "fac.tour": "Tour / limousine services", "fac.massage": "In-room massage", "fac.cctv": "CCTV & safety systems", "offers.label": "Offers & membership", "offers.title": "Our offers & be a member", "offers.lead": "From the live homepage teasers (offer and member subpages currently 404).", "offers.plans.h": "Accommodation plans", "offers.plans.p": "Check out the offers and promotions of Scandia and choose the accommodation plan that best suits your preferences.", "offers.member.h": "Members get more", "offers.member.p": "Join and get Free Wi-Fi, Mobile check-in, and the lowest member rates PLUS discount on the coffee shop.", "faq.label": "FAQ", "faq.title": "Frequently asked questions", "faq.lead": "Recovered from the hotel’s published FAQ page (live URL currently 404 — content from public index).", "faq.q1": "What are check-in and check-out times?", "faq.a1": "Check-in time is 2:00 pm. Check-out time is 12:00 noon.", "faq.q2": "Do you have non-smoking rooms?", "faq.a2": "Yes — on request and subject to availability.", "faq.q3": "Do you have twin, triple and quadruple rooms?", "faq.a3": "Only the Superior Twin Suite is twin-bedded. Other rooms can be converted to a triple with an extra bed. There are no quadruple rooms, but Deluxe Suites can stay 4 people.", "faq.q4": "Do you have inter-connecting rooms?", "faq.a4": "Sorry, we don’t.", "faq.q5": "What is the cost of an extra bed?", "faq.a5": "An extra bed is THB 150.", "faq.q6": "Does the hotel offer baby-sitting?", "faq.a6": "Yes — book a day in advance. Cost is THB 250 per hour.", "faq.q7": "Where is breakfast served and at what time?", "faq.a7": "Breakfast is served at the restaurant next to the lobby on the ground floor, from 8:00 am to 10:30 am.", "faq.q8": "Do you have 24-hour room service?", "faq.a8": "No — room service is available from 9:00 am to 10:00 pm.", "faq.q9": "Is there free parking?", "faq.a9": "Free public parking at Rompho Market near Scandia Beach Hotel (FAQ lists ~200 m; About Us lists ~75 m).", "faq.q10": "What is the length and depth of your pool?", "faq.a10": "In meters: 20 (length) × 3 (width) × 0.6 (depth).", "faq.q11": "Do you have hairdryers / ironing?", "faq.a11": "Hairdryers in all rooms. Iron and ironing board are placed in the room for guest convenience.", "faq.q12": "Is tap water safe to drink?", "faq.a12": "No — tap water in Thailand is not potable. Complimentary bottled water is supplied to rooms daily.", "faq.q13": "Internet in rooms?", "faq.a13": "Yes — wireless Fiber Internet. Complimentary for guests who book through the hotel’s own website.", "faq.q14": "Are dual telephone sockets available in rooms?", "faq.a14": "Dual telephone sockets are available only for the reception.", "nearby.label": "Nearby attractions", "nearby.title": "Around Soi 7 & Jomtien", "nearby.lead": "From the hotel’s Nearby Attractions page (live URL currently 404 — content from public index).", "nearby.shop.h": "Shopping", "nearby.shop.p": "7-Eleven 24-hour stores around the corner; minimart about 50 m. Food mart and Mini Big C about 1 km. Central Festival in Pattaya downtown via 24/7 baht-bus on beach road (~10 baht).", "nearby.dine.h": "Dining & entertainment", "nearby.dine.p": "Many bars and restaurants next to the hotel — Thai plates mingled with contemporary Western flavours.", "nearby.spa.h": "Salons / spas", "nearby.spa.p": "Many massage shops & salons next to Scandia. Partner at The Train Resort (~2 km) — free shuttle for sauna & spa and mini golf (200 baht per person for all day); ask at reception.", "nearby.public.h": "Public services", "nearby.public.p": "Bangkok Bank ATM ~100 m; pharmacy ~100 m; foot market and bar complex within easy walking distance (~200 m).", "reviews.label": "Reviews", "reviews.title": "Read reviews at Scandia", "reviews.lead": "The old site linked reviews and TripAdvisor traveler photos. No invented guest quotes here — open TripAdvisor for first-hand reviews.", "reviews.heading": "Scandia Jomtien Beach on TripAdvisor", "reviews.open": "Open TripAdvisor reviews", "reviews.social": "Also on Facebook & Instagram", "inq.label": "Book", "inq.title": "Booking inquiry", "inq.lead": "Email booking@scandiajomtienbeach.com or call +66 096 221 1003. The form below is a front-end demo only.", "form.name": "Full name", "form.namePh": "Your name", "form.email": "Email", "form.emailPh": "you@email.com", "form.phone": "Phone / WhatsApp", "form.phonePh": "+66 …", "form.guests": "Guests", "form.g1": "1 guest", "form.g2": "2 guests", "form.g3": "3 guests", "form.g4": "4+ guests", "form.checkin": "Check-in", "form.checkout": "Check-out", "form.message": "Message / room preferences", "form.messagePh": "Suite type, dates, or questions…", "form.submit": "Send inquiry", "form.note": "Demo only — submit is not connected. Live booking (Beds24 on old site) wires after they invest. Call or email anytime.", "form.alert": "Thanks! This is a front-end demo — inquiry submit is demo-only. Please call +66 096 221 1003 or email booking@scandiajomtienbeach.com.", "contact.label": "Contact", "contact.title": "Find Scandia on Soi 7", "contact.lead": "Jomtien Beach Soi 7 · booking@scandiajomtienbeach.com · +66 096 221 1003", "contact.address": "Address", "contact.addressBody": "Jomtien Beach Soi 7<br />Jomtien, Pattaya, Chonburi, Thailand", "contact.phone": "Phone", "contact.email": "Email", "contact.map": "Find us on map", "contact.call": "Call hotel", "contact.emailUs": "Email booking", "contact.bookCta": "Booking inquiry", "extras.launchTitle": "Launch checklist", "extras.launchIntro": "What’s included in the build package after they invest — not live changes yet.", "extras.li1Strong": "Google Business Profile cleanup", "extras.li1Rest": " — categories, photos, hours, and description polish as a post-invest / launch service.", "extras.li2Strong": "Thai + English SEO basics", "extras.li2Rest": " — bilingual title & meta, hreflang-ready markup, meaningful image alt text.", "extras.li3Strong": "Booking & inquiry CTAs", "extras.li3Rest": " — reconnect Beds24 / booking engine and wire the inquiry form when back-end goes live.", "extras.seoStrong": "SEO note (EN / TH):", "extras.seoRest": " Page title and meta description update with the language toggle. Key image alt text is bilingual.", "extras.careTitle": "After go-live · Monthly site care", "extras.careLead": "A simple monthly care plan keeps the hotel site fresh and reliable:", "extras.care1": "Content updates & small edits", "extras.care2": "Uptime checks", "extras.care3": "Backup of site files", "extras.care4": "Minor SEO / listing tweaks as needed", "extras.carePrice": "Priced & connected after they invest.", "extras.careCta": "Ask about monthly care", "footer.tagline": "<strong>Scandia Jomtien Beach</strong> — 200 meters from Jomtien Beach (Scandia 200 เมตรจากหาดจอมเทียน)", "footer.compare": "Compare old vs new →", "footer.demo": "Front-end demo by Vantage — bookings/payments not connected yet; paid back-end after they invest. No outreach sent.", "footer.vantage": "Demo crafted by Vantage", "sticky.call": "Call", "sticky.email": "Email"},
    th: {"meta.title": "สแกนเดีย จอมเทียน บีช | ห้องพักสวยใกล้ชายหาด", "meta.description": "โรงแรมสแกนเดีย บีช — 48 ห้อง ห่างหาดจอมเทียนราว 200 เมตร ซอย 7 สระว่ายน้ำกลางแจ้ง ร้านกาแฟ และแผนกต้อนรับ จอง: booking@scandiajomtienbeach.com", "aria.home": "หน้าแรก สแกนเดีย จอมเทียน บีช", "aria.primaryNav": "เมนูหลัก", "aria.menuOpen": "เปิดเมนู", "aria.menuClose": "ปิดเมนู", "aria.langSwitch": "ภาษา", "aria.menuDialog": "เมนู", "aria.gallery": "ภาพโรงแรมจากเว็บสแกนเดีย", "nav.rooms": "ห้องพัก", "nav.gallery": "แกลเลอรี", "nav.facilities": "สิ่งอำนวยความสะดวก", "nav.about": "เกี่ยวกับเรา", "nav.faq": "คำถามที่พบบ่อย", "nav.nearby": "สถานที่ใกล้เคียง", "nav.book": "จองห้อง", "nav.contact": "ติดต่อ", "nav.compare": "เทียบเว็บเดิมกับใหม่", "nav.cta": "สอบถามจอง", "nav.reviews": "รีวิว", "menu.close": "ปิด", "theme.appearance": "ธีม", "theme.dark": "เข้ม", "theme.light": "สว่าง", "theme.darkAnnounce": "ธีมสีเข้ม", "theme.lightAnnounce": "ธีมสีสว่าง", "hero.pill": "ห่างหาดจอมเทียน 200 ม. · ซอย 7", "hero.title": "Scandia <em>Jomtien Beach</em>", "hero.tagline": "ห้องพักสวยใกล้ชายหาด", "hero.lead": "สแกนเดียตั้งอยู่ห่างหาดทรายจอมเทียนเพียง 200 เมตร มี 48 ห้องสวยและสระว่ายน้ำ พักผ่อนได้อย่างสบายใจ", "hero.ctaBook": "ส่งคำถามจองห้อง", "hero.ctaCall": "โทร +66 096 221 1003", "hero.ctaEmail": "อีเมลจองห้อง", "stat.roomsStrong": "48", "stat.roomsSpan": "ห้องสวย", "stat.beachStrong": "200 ม.", "stat.beachSpan": "ถึงหาดจอมเทียน", "stat.poolStrong": "สระว่ายน้ำ", "stat.poolSpan": "และร้านกาแฟ", "float.a.strong": "ห่างชายหาดเพียง 200 ม.", "float.a.span": "ร้านกาแฟ · สระกลางแจ้ง · แผนกต้อนรับ", "float.b.strong": "สวีทสะอาด น่าอยู่", "float.b.span": "แอร์ · ทีวีจอแบน · ตู้เย็น · ห้องน้ำส่วนตัว", "alt.hero": "หาดจอมเทียนใกล้โรงแรมสแกนเดีย บีช", "alt.room": "ห้องสวีทโรงแรมสแกนเดีย บีช", "alt.pool": "สระว่ายน้ำกลางแจ้งสแกนเดีย บีช", "alt.beach": "หาดทรายจอมเทียนใกล้สแกนเดีย", "loc.band": "ตั้งอยู่ที่ <strong>หาดจอมเทียน ซอย 7</strong> — ห่างหาดทรายจอมเทียนเพียง <strong>200 เมตร</strong> ยินดีต้อนรับสู่โรงแรมสแกนเดีย บีช", "rooms.label": "ห้องพักและสวีท", "rooms.title": "สวีทสะอาด น่าอยู่", "rooms.lead": "ทุกสวีทมีห้องน้ำและฝักบัวส่วนตัว เครื่องปรับอากาศ ทีวีจอแบนช่องภาษาอังกฤษและไทย และตู้เย็น", "feat.bath.h": "ห้องน้ำส่วนตัว", "feat.bath.p": "ห้องน้ำและฝักบัวส่วนตัวในทุกสวีท", "feat.ac.h": "เครื่องปรับอากาศ", "feat.ac.p": "เย็นสบายด้วยแอร์ในทุกห้อง", "feat.tv.h": "ทีวีจอแบน", "feat.tv.p": "ช่องภาษาอังกฤษและไทยบนทีวีจอแบน", "feat.fridge.h": "ตู้เย็น", "feat.fridge.p": "ตู้เย็นในห้องสำหรับเครื่องดื่มและของจำเป็น", "feat.hair.h": "ไดร์เป่าผม", "feat.hair.p": "มีไดร์เป่าผมในทุกห้อง (ตาม FAQ)", "feat.iron.h": "เตารีดและกระดานรีด", "feat.iron.p": "เตารีดและกระดานรีดไว้ในห้องเพื่อความสะดวก", "feat.wifi.h": "Wi-Fi ไฟเบอร์", "feat.wifi.p": "อินเทอร์เน็ตไร้สายไฟเบอร์ในห้อง ฟรีสำหรับผู้จองผ่านเว็บไซต์โรงแรมเอง", "feat.water.h": "น้ำดื่มบรรจุขวด", "feat.water.p": "น้ำประปาดื่มไม่ได้ มีน้ำดื่มบรรจุขวดให้ทุกวัน", "rooms.typesTitle": "รูปแบบห้อง (จาก FAQ)", "rooms.twin.h": "Superior Twin Suite", "rooms.twin.p": "รูปแบบเตียงแฝดที่ระบุใน FAQ", "rooms.deluxe.h": "Deluxe Suites", "rooms.deluxe.p": "พักได้ 4 ท่าน ไม่มีห้องควอดรูเปิลแยกต่างหาก", "rooms.extra.h": "เตียงเสริม", "rooms.extra.p": "ห้องอื่นแปลงเป็นสามท่านได้ด้วยเตียงเสริม (150 บาท) ไม่มีห้องเชื่อมต่อกัน", "rooms.nonsmoke.h": "ห้องปลอดบุหรี่", "rooms.nonsmoke.p": "ห้องปลอดบุหรี่ตามคำขอ ขึ้นกับห้องว่าง", "gallery.label": "ภาพถ่าย", "gallery.title": "ภาพบรรยากาศจากสแกนเดีย", "gallery.lead": "ภาพจริง 3 ภาพจาก scandiajomtienbeach.com — ชายหาด สระว่ายน้ำ และห้องพัก", "gallery.note": "ภาพนักท่องเที่ยว: แกลเลอรี TripAdvisor ตามเมนูเดิม", "peek.beach": "ชายหาด", "peek.pool": "สระว่ายน้ำ", "peek.room": "ห้องพัก", "about.label": "เกี่ยวกับเรา", "about.title": "ยินดีต้อนรับสู่โรงแรมสแกนเดีย บีช", "about.lead": "สแกนเดียมีสิ่งอำนวยความสะดวกและบริการสำหรับการพักที่จอมเทียน — เรียบเรียงจากหน้า About Us ที่เผยแพร่", "about.reception.h": "แผนกต้อนรับและคอนเซียร์จ", "about.reception.p": "แผนกต้อนรับที่ล็อบบี้ด้วยไมตรีแบบไทย ตามที่เผยแพร่เคยระบุ reception 24 ชม. และช่วงโควิด 9.00–23.00 น.", "about.security.h": "กล้องวงจรปิดและความปลอดภัย", "about.security.p": "กล้องวงจรปิด เครื่องตรวจจับควัน และสปริงเกอร์ มีบริการต้อนรับ ซ่อมบำรุง และรักษาความปลอดภัย 12 ชม. ตาม About Us", "about.parking.h": "ที่จอดรถฟรีใกล้เคียง", "about.parking.p": "ที่จอดสาธารณะฟรีที่ตลาดร่มโพธิ์ใกล้สแกนเดีย (About Us ~75 ม. / FAQ ~200 ม.) ยืนยันเมื่อถึงที่", "about.fitness.h": "ฟิตเนสใกล้เคียง", "about.fitness.p": "ฟิตเนสใกล้โรงแรมราว 70 เมตร ค่าใช้บริการ 50 บาท/ครั้ง เวลา 8.00–22.00 น.", "about.massage.h": "นวดในห้องพัก", "about.massage.p": "นวดในห้อง 10.00–22.00 น. จองที่แผนกต้อนรับ", "about.servicesTitle": "บริการของเรา (จาก About Us)", "svc.reception": "บริการต้อนรับ ซ่อมบำรุง และรักษาความปลอดภัย 12 ชม.", "svc.chillz": "ร้าน Chillz Restaurant (ระบุว่าปิดในช่วงโควิดบน About Us)", "svc.roomService": "รูมเซอร์วิส (9.00–22.00 ตาม FAQ — ไม่ใช่ 24 ชม.)", "svc.business": "บริการศูนย์ธุรกิจ (ระบุว่าปิดในช่วงโควิดบน About Us)", "svc.cctv": "กล้องวงจรปิด เครื่องตรวจจับควัน และสปริงเกอร์", "svc.housekeeping": "แม่บ้านรายวัน (ตามคำขอ)", "svc.internet": "จุดใช้อินเทอร์เน็ต", "svc.laundry": "บริการซักรีดและซักแห้ง", "svc.tour": "บริการรถลิมูซีนและทัวร์", "svc.nonsmoke": "ห้องปลอดบุหรี่ตามคำขอ", "svc.parking": "ที่จอดรถฟรีใกล้เคียง (~75–200 ม. ที่ตลาดร่มโพธิ์)", "fac.label": "สิ่งอำนวยความสะดวกและบริการ", "fac.title": "พักผ่อนที่สระ — แล้วออกเที่ยวพัทยา", "fac.lead": "สระว่ายน้ำกลางแจ้ง ร้านกาแฟ และแผนกต้อนรับ ขนาดสระ (FAQ): ยาว 20 ม. × กว้าง 3 ม. × ลึก 0.6 ม.", "fac.pool": "สระว่ายน้ำกลางแจ้ง", "fac.coffee": "ร้านกาแฟ", "fac.desk": "แผนกต้อนรับ", "fac.wifi": "Wi-Fi ไฟเบอร์ (ฟรีเมื่อจองผ่านเว็บโรงแรม)", "fac.laundry": "ซักรีดและซักแห้ง", "fac.tour": "บริการทัวร์ / ลิมูซีน", "fac.massage": "นวดในห้องพัก", "fac.cctv": "กล้องวงจรปิดและระบบความปลอดภัย", "offers.label": "โปรโมชันและสมาชิก", "offers.title": "ข้อเสนอและการเป็นสมาชิก", "offers.lead": "จากข้อความบนหน้าแรก (หน้า offers / member บนเว็บเดิม 404)", "offers.plans.h": "แพ็กเกจที่พัก", "offers.plans.p": "ดูข้อเสนอและโปรโมชันของสแกนเดีย แล้วเลือกแพ็กเกจที่เหมาะกับคุณ", "offers.member.h": "สมาชิกได้มากกว่า", "offers.member.p": "สมัครรับ Wi-Fi ฟรี Mobile check-in และเรทสมาชิกต่ำสุด พร้อมส่วนลดร้านกาแฟ", "faq.label": "คำถามที่พบบ่อย", "faq.title": "คำถามที่พบบ่อย", "faq.lead": "กู้คืนจากหน้า FAQ ที่เผยแพร่ (URL สด 404 — เนื้อหาจากดัชนีสาธารณะ)", "faq.q1": "เช็คอินและเช็คเอาท์กี่โมง?", "faq.a1": "เช็คอิน 14.00 น. เช็คเอาท์ 12.00 น.", "faq.q2": "มีห้องปลอดบุหรี่ไหม?", "faq.a2": "มี — ตามคำขอและขึ้นกับห้องว่าง", "faq.q3": "มีห้องทวิน ห้องสามท่าน และห้องสี่ท่านไหม?", "faq.a3": "มีเพียง Superior Twin Suite ที่เป็นเตียงแฝด ห้องอื่นแปลงเป็นสามท่านด้วยเตียงเสริมได้ ไม่มีห้องควอดรูเปิล แต่ Deluxe Suites พักได้ 4 ท่าน", "faq.q4": "มีห้องเชื่อมต่อกันไหม?", "faq.a4": "ขออภัย ไม่มี", "faq.q5": "เตียงเสริมราคาเท่าไร?", "faq.a5": "เตียงเสริม 150 บาท", "faq.q6": "โรงแรมมีบริการพี่เลี้ยงเด็กไหม?", "faq.a6": "มี — จองล่วงหน้าหนึ่งวัน ค่าบริการ 250 บาทต่อชั่วโมง", "faq.q7": "อาหารเช้าเสิร์ฟที่ไหน กี่โมง?", "faq.a7": "เสิร์ฟที่ร้านอาหารข้างล็อบบี้ ชั้นล่าง เวลา 8.00–10.30 น.", "faq.q8": "มีรูมเซอร์วิส 24 ชม. ไหม?", "faq.a8": "ไม่มี — รูมเซอร์วิส 9.00–22.00 น.", "faq.q9": "มีที่จอดรถฟรีไหม?", "faq.a9": "ที่จอดสาธารณะฟรีที่ตลาดร่มโพธิ์ใกล้โรงแรม (FAQ ~200 ม. / About Us ~75 ม.)", "faq.q10": "สระว่ายน้ำยาวและลึกเท่าไร?", "faq.a10": "หน่วยเมตร: ยาว 20 × กว้าง 3 × ลึก 0.6", "faq.q11": "มีไดร์เป่าผม / เตารีดไหม?", "faq.a11": "มีไดร์ในทุกห้อง มีเตารีดและกระดานรีดไว้ในห้อง", "faq.q12": "น้ำประปาดื่มได้ไหม?", "faq.a12": "ไม่ได้ — มีน้ำดื่มบรรจุขวดให้ทุกวัน", "faq.q13": "อินเทอร์เน็ตในห้อง?", "faq.a13": "มี — Wi-Fi ไฟเบอร์ ฟรีสำหรับผู้จองผ่านเว็บไซต์โรงแรมเอง", "faq.q14": "มีช่องเสียบโทรศัพท์คู่ในห้องไหม?", "faq.a14": "มีเฉพาะที่แผนกต้อนรับ", "nearby.label": "สถานที่ใกล้เคียง", "nearby.title": "รอบซอย 7 และจอมเทียน", "nearby.lead": "จากหน้า Nearby Attractions (URL สด 404 — เนื้อหาจากดัชนีสาธารณะ)", "nearby.shop.h": "ช้อปปิ้ง", "nearby.shop.p": "เซเว่นฯ 24 ชม. ใกล้ๆ มินิมาร์ทราว 50 ม. ฟู้ดมาร์ทและมินิ Big C ราว 1 กม. เซ็นทรัลเฟสติวัลตัวเมืองพัทยาขึ้นรถสองแถวริมหาดได้ (~10 บาท)", "nearby.dine.h": "อาหารและความบันเทิง", "nearby.dine.p": "บาร์และร้านอาหารมากมายข้างโรงแรม — เมนูไทยผสมรสชาติตะวันตก", "nearby.spa.h": "ซาลอน / สปา", "nearby.spa.p": "ร้านนวดและซาลอนใกล้สแกนเดีย พาร์ทเนอร์ The Train Resort (~2 กม.) รถรับส่งฟรีสำหรับซาวน่า สปา และมินิกอล์ฟ (200 บาท/ท่านทั้งวัน) สอบถามที่แผนกต้อนรับ", "nearby.public.h": "บริการสาธารณะ", "nearby.public.p": "ธนาคารกรุงเทพ ATM ~100 ม. ร้านขายยา ~100 ม. ตลาดเท้าและบาร์คอมเพล็กซ์เดินถึง (~200 ม.)", "reviews.label": "รีวิว", "reviews.title": "อ่านรีวิวที่สแกนเดีย", "reviews.lead": "เว็บเดิมลิงก์รีวิวและภาพนักท่องเที่ยวบน TripAdvisor ไม่แต่งคำรับรอง — เปิด TripAdvisor เพื่ออ่านรีวิวจริง", "reviews.heading": "Scandia Jomtien Beach บน TripAdvisor", "reviews.open": "เปิดรีวิว TripAdvisor", "reviews.social": "ยังมีบน Facebook และ Instagram", "inq.label": "จองห้อง", "inq.title": "สอบถามการจอง", "inq.lead": "อีเมล booking@scandiajomtienbeach.com หรือโทร +66 096 221 1003 แบบฟอร์มด้านล่างเป็นเดโมหน้าบ้านเท่านั้น", "form.name": "ชื่อ-นามสกุล", "form.namePh": "ชื่อของท่าน", "form.email": "อีเมล", "form.emailPh": "you@email.com", "form.phone": "โทรศัพท์ / WhatsApp", "form.phonePh": "+66 …", "form.guests": "จำนวนผู้เข้าพัก", "form.g1": "1 ท่าน", "form.g2": "2 ท่าน", "form.g3": "3 ท่าน", "form.g4": "4 ท่านขึ้นไป", "form.checkin": "วันเช็คอิน", "form.checkout": "วันเช็คเอาท์", "form.message": "ข้อความ / ความต้องการห้องพัก", "form.messagePh": "ประเภทสวีท วันเข้าพัก หรือคำถาม…", "form.submit": "ส่งคำถาม", "form.note": "เดโมเท่านั้น — ยังไม่เชื่อมระบบ จองจริง (Beds24 บนเว็บเดิม) จะเชื่อมหลังลงทุน โทรหรืออีเมลได้ทุกเมื่อ", "form.alert": "ขอบคุณครับ/ค่ะ! นี่เป็นเดโมหน้าบ้าน กรุณาโทร +66 096 221 1003 หรืออีเมล booking@scandiajomtienbeach.com", "contact.label": "ติดต่อ", "contact.title": "หาสแกนเดียที่ซอย 7", "contact.lead": "หาดจอมเทียน ซอย 7 · booking@scandiajomtienbeach.com · +66 096 221 1003", "contact.address": "ที่อยู่", "contact.addressBody": "หาดจอมเทียน ซอย 7<br />จอมเทียน พัทยา ชลบุรี ประเทศไทย", "contact.phone": "โทรศัพท์", "contact.email": "อีเมล", "contact.map": "ดูแผนที่", "contact.call": "โทรหาโรงแรม", "contact.emailUs": "อีเมลจองห้อง", "contact.bookCta": "สอบถามการจอง", "extras.launchTitle": "เช็กลิสต์ก่อนเปิดตัว", "extras.launchIntro": "สิ่งที่รวมในแพ็กเกจหลังลงทุน — ยังไม่ได้ปรับของจริงบนเว็บ/GBP", "extras.li1Strong": "จัดระเบียบ Google Business Profile", "extras.li1Rest": " — หมวดหมู่ รูปภาพ เวลาทำการ และคำอธิบาย เป็นบริการหลังลงทุน/เปิดตัว", "extras.li2Strong": "SEO พื้นฐานไทย+อังกฤษ", "extras.li2Rest": " — ชื่อหน้าและเมตาสองภาษา มาร์กอัพพร้อม hreflang และ alt รูปที่มีความหมาย", "extras.li3Strong": "ปุ่มจองและฟอร์มสอบถาม", "extras.li3Rest": " — เชื่อม Beds24 / ระบบจอง และฟอร์มสอบถามเมื่อระบบหลังบ้านพร้อม", "extras.seoStrong": "หมายเหตุ SEO (EN / TH):", "extras.seoRest": " ชื่อหน้าและเมตาคำอธิบายเปลี่ยนตามภาษาที่เลือก Alt ของรูปสำคัญเป็นสองภาษา", "extras.careTitle": "หลังเปิดตัว · ดูแลเว็บรายเดือน", "extras.careLead": "แพ็กดูแลรายเดือนช่วยให้เว็บโรงแรมสดใหม่และเสถียร:", "extras.care1": "อัปเดตเนื้อหาและแก้เล็กน้อย", "extras.care2": "ตรวจออนไลน์อยู่เสมอ", "extras.care3": "สำรองไฟล์เว็บไซต์", "extras.care4": "ปรับ SEO / รายชื่อธุรกิจเล็กน้อยตามต้องการ", "extras.carePrice": "คิดราคาและเชื่อมระบบหลังลงทุน", "extras.careCta": "สอบถามแพ็กดูแลรายเดือน", "footer.tagline": "<strong>Scandia Jomtien Beach</strong> — 200 เมตรจากหาดจอมเทียน (Scandia 200 เมตรจากหาดจอมเทียน)", "footer.compare": "เทียบเว็บเดิมกับใหม่ →", "footer.demo": "เดโมหน้าบ้านโดย Vantage — ยังไม่เชื่อมจอง/ชำระเงิน ระบบหลังบ้านหลังลงทุน ไม่ได้ติดต่อธุรกิจ", "footer.vantage": "เดโมโดย Vantage", "sticky.call": "โทร", "sticky.email": "อีเมล"}
  };
  let currentLang = "en";

  function detectDefaultLang() {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "th" || saved === "en") return saved;
    } catch (_) {}
    const nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    return nav.startsWith("th") ? "th" : "en";
  }

  function applyI18n(lang, dict) {
    if (!dict) return;
    currentLang = lang;
    document.documentElement.lang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (_) {}

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] != null) el.setAttribute("placeholder", dict[key]);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (dict[key] != null) el.setAttribute("aria-label", dict[key]);
    });
    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      if (dict[key] != null) el.setAttribute("alt", dict[key]);
    });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (dict[key] != null) el.setAttribute("title", dict[key]);
    });

    if (dict["meta.title"]) document.title = dict["meta.title"];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && dict["meta.description"]) metaDesc.setAttribute("content", dict["meta.description"]);

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === lang));
    });

    if (menuBtn && mobileNav) {
      const open = mobileNav.classList.contains("open");
      menuBtn.setAttribute("aria-label", open ? (dict["aria.menuClose"] || "Close menu") : (dict["aria.menuOpen"] || "Open menu"));
    }
  }

  function i18nAlert(key, fallback) {
    const dict = i18nDicts[currentLang];
    alert((dict && dict[key]) || fallback);
  }

  function initI18n() {
    const lang = detectDefaultLang();
    applyI18n(lang, i18nDicts[lang] || i18nDicts.en);
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.getAttribute("data-lang");
        if (next && i18nDicts[next]) applyI18n(next, i18nDicts[next]);
      });
    });
  }

  initI18n();


  /* --- Theme: dark default + light toggle (pattaya-demo-theme) --- */
  const THEME_KEY = "pattaya-demo-theme";
  const themeLive = document.getElementById("themeLive");

  function getTheme() {
    const t = document.documentElement.getAttribute("data-theme");
    return t === "light" ? "light" : "dark";
  }

  function applyTheme(theme, announce) {
    const next = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.style.colorScheme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-theme-set") === next));
    });
    if (announce && themeLive) {
      const d = (typeof i18nDicts !== "undefined" && i18nDicts[currentLang]) || {};
      const label = next === "light"
        ? (d["theme.lightAnnounce"] || d["theme.light"] || "Light theme")
        : (d["theme.darkAnnounce"] || d["theme.dark"] || "Dark theme");
      themeLive.textContent = label;
    }
  }

  function initTheme() {
    applyTheme(getTheme(), false);
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.getAttribute("data-theme-set");
        if (next) applyTheme(next, true);
      });
    });
  }
  initTheme();

})();
