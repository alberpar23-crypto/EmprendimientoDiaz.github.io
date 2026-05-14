document.addEventListener("DOMContentLoaded", () => {

    // 1. INICIALIZACIÓN DE SWIPER - SERVICIOS
    if (document.querySelector('.services-slider')) {
        new Swiper('.services-slider', {
            slidesPerView: 1,
            spaceBetween: 25,
            loop: true,
            autoplay: { delay: 3500 },
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            breakpoints: {
                640: { slidesPerView: 1.3 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    }

    // 2. INICIALIZACIÓN DE SWIPER - PRODUCTOS
 function initSlider(selector) {
  return new Swiper(selector, {
    slidesPerView: 3,
    spaceBetween: 20,
    loop: true,
    pagination: {
      el: selector + " .swiper-pagination",
      clickable: true
    },
    navigation: {
      nextEl: selector + " .swiper-button-next",
      prevEl: selector + " .swiper-button-prev"
    },
    breakpoints: {
      0: { slidesPerView: 1.2 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  });
}

initSlider(".productosSwiper1");
initSlider(".productosSwiper2");
initSlider(".productosSwiper3");


    // 3. MENÚ RESPONSIVE
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("#header nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            nav.classList.toggle("active");
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => nav.classList.remove("active"));
        });
    }

    // 4. ANIMACIÓN FADE-IN AL HACER SCROLL
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});


// 5. SISTEMA DE PRESUPUESTO (Funciones Globales)
/* ─── BUDGET BUILDER JS ────────────────────────── */

let selectedServices = {};
let selectedOptions = {};

// Abrir/cerrar servicio
function toggleBudgetItem(key) {
  const item = document.getElementById(`bsi-${key}`);
  const opts = document.getElementById(`opts-${key}`);

  const isSelected = item.classList.contains("selected");

  if (isSelected) {
    item.classList.remove("selected");
    opts.classList.remove("visible");
    delete selectedServices[key];
    delete selectedOptions[key];
  } else {
    item.classList.add("selected");
    opts.classList.add("visible");
    selectedServices[key] = item.querySelector(".bsi-name").textContent.trim();
  }

  updateSummary();
}

// Seleccionar opción (chips)
function selectOption(el, key) {
  const chips = el.parentElement.querySelectorAll(".option-chip");
  chips.forEach(c => c.classList.remove("active"));

  el.classList.add("active");
  selectedOptions[key] = el.textContent.trim();

  updateSummary();
}

// Actualizar resumen
function updateSummary() {
  const empty = document.getElementById("bs-empty");
  const itemsBox = document.getElementById("bs-items");
  const footer = document.getElementById("bs-footer");

  itemsBox.innerHTML = "";

  const keys = Object.keys(selectedServices);

  if (keys.length === 0) {
    empty.style.display = "block";
    itemsBox.style.display = "none";
    footer.style.display = "none";
    return;
  }

  empty.style.display = "none";
  itemsBox.style.display = "flex";
  footer.style.display = "block";

  keys.forEach(key => {
    const name = selectedServices[key];
    const detail = findOptionDetail(key);

    const div = document.createElement("div");
    div.className = "bs-item";

    div.innerHTML = `
      <div>
        <div class="bs-item-name">${name}</div>
        <div class="bs-item-detail">${detail || "Sin opciones seleccionadas"}</div>
      </div>
      <button class="bs-item-remove" onclick="removeItem('${key}')">×</button>
    `;

    itemsBox.appendChild(div);
  });

  updateWhatsAppLink();
}

// Obtener detalle seleccionado
function findOptionDetail(key) {
  const map = {
    facturacion: "facturacion-users",
    cctv: "cctv-qty",
    soporte: "soporte-type",
    web: "web-type",
    red: "red-type"
  };

  const optKey = map[key];
  return selectedOptions[optKey] || "";
}

// Eliminar servicio desde el resumen
function removeItem(key) {
  const item = document.getElementById(`bsi-${key}`);
  const opts = document.getElementById(`opts-${key}`);

  item.classList.remove("selected");
  opts.classList.remove("visible");

  delete selectedServices[key];
  delete selectedOptions[key];

  updateSummary();
}

// Generar mensaje WhatsApp
function updateWhatsAppLink() {
  const btn = document.getElementById("whatsapp-quote-btn");

  let message = "Hola, quiero solicitar una cotización:%0A%0A";

  Object.keys(selectedServices).forEach(key => {
    const name = selectedServices[key];
    const detail = findOptionDetail(key);

    message += `• *${name}*%0A`;
    if (detail) message += `   - ${detail}%0A`;
    message += "%0A";
  });

  const phone = "584244287599"; // ← CAMBIA TU NÚMERO AQUÍ
  btn.href = `https://wa.me/${phone}?text=${message}`;
}

// 6. SISTEMA DE FAQ (ACORDEÓN)
window.toggleFaq = function(element) {
    const item = element.parentElement;
    const answer = item.querySelector(".faq-answer");
    const chevron = item.querySelector(".faq-chevron");

    // Cerrar otros FAQ
    document.querySelectorAll(".faq-item").forEach(faq => {
        if (faq !== item) {
            faq.classList.remove("active");
            faq.querySelector(".faq-answer").style.maxHeight = null;
            faq.querySelector(".faq-chevron").style.transform = "rotate(0deg)";
        }
    });

    // Alternar el actual
    if (item.classList.contains("active")) {
        item.classList.remove("active");
        answer.style.maxHeight = null;
        chevron.style.transform = "rotate(0deg)";
    } else {
        item.classList.add("active");

        // Esperar al siguiente frame para medir correctamente
        requestAnimationFrame(() => {
            answer.style.maxHeight = answer.scrollHeight + "px";
        });

        chevron.style.transform = "rotate(180deg)";
    }
};





















