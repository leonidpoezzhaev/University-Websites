document.addEventListener('DOMContentLoaded', function() {

  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }

  const datetimeEl = document.getElementById('datetime');
  if (datetimeEl) {
    function updateDateTime() {
      const now = new Date();
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      datetimeEl.textContent = now.toLocaleDateString('ru-RU', options);
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);
  }

  const slider = document.querySelector('.slider');
  if (slider) {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const totalSlides = slides.length;

    function showSlide(index) {
      if (index >= totalSlides) currentSlide = 0;
      else if (index < 0) currentSlide = totalSlides - 1;
      else currentSlide = index;
      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    document.getElementById('prevSlide').addEventListener('click', () => showSlide(currentSlide - 1));
    document.getElementById('nextSlide').addEventListener('click', () => showSlide(currentSlide + 1));

    setInterval(() => showSlide(currentSlide + 1), 5000);
  }

  const newsCards = document.querySelectorAll('.news-card');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  if (newsCards.length && modalOverlay) {
    const newsData = {
      1: { title: 'Встреча с автором', full: '20 июня в 17:00 в нашем магазине состоится творческий вечер с Дмитрием Глуховским. Автор представит новую книгу «Пост» и ответит на вопросы читателей. Вход свободный, количество мест ограничено.' },
      2: { title: 'Новое поступление комиксов', full: 'Поступила лимитированная серия графических романов Marvel «Мстители. Финал». Каждый экземпляр с уникальной суперобложкой. Цена 2500 ₽. Спешите приобрести!' },
      3: { title: 'Скидки на классику', full: 'До 30 апреля скидка 25% на все произведения русских классиков: Толстой, Достоевский, Чехов, Тургенев. Отличный повод пополнить библиотеку.' },
      4: { title: 'Детский уголок', full: 'В субботу открылась игровая зона для детей. Теперь можно оставить ребёнка под присмотром аниматора, пока вы выбираете книги. Работаем с 11:00 до 18:00.' },
      5: { title: 'Книжный клуб', full: '15 мая в 18:00 обсуждаем роман «Мастер и Маргарита». Присоединяйтесь, даже если не дочитали до конца. Будет чай и печенье.' },
      6: { title: 'Аудиокниги бесплатно', full: 'При покупке бумажной версии любой книги из специальной подборки вы получаете её аудиоверсию в подарок. Акция действует до конца месяца.' }
    };

    newsCards.forEach(card => {
      card.addEventListener('click', () => {
        const newsId = card.getAttribute('data-news');
        const data = newsData[newsId];
        if (data) {
          modalBody.innerHTML = `<h2>${data.title}</h2><p>${data.full}</p>`;
          modalOverlay.classList.add('active');
        }
      });
    });

    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  }

  const mapContainer = document.getElementById('map');
  if (mapContainer) {
    const map = L.map('map').setView([55.7495, 37.5908], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    L.marker([55.7495, 37.5908]).addTo(map).bindPopup('Книжный червь, ул. Арбат, 25').openPopup();

    document.getElementById('geolocateBtn').addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 14);
          L.marker([latitude, longitude]).addTo(map).bindPopup('Вы здесь').openPopup();
        }, () => {
          alert('Не удалось определить местоположение');
        });
      } else {
        alert('Геолокация не поддерживается');
      }
    });
  }

  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(orderForm);
      const data = Object.fromEntries(formData.entries());
      const gift = formData.get('gift') ? 'Да' : 'Нет';
      data.gift = gift;
      localStorage.setItem('lastOrder', JSON.stringify(data));

      const resultDiv = document.getElementById('orderResult');
      resultDiv.innerHTML = `
        <h3>Заказ принят</h3>
        <p><strong>Книга:</strong> ${data.bookTitle}</p>
        <p><strong>Автор:</strong> ${data.author || 'не указан'}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Телефон:</strong> ${data.phone}</p>
        <p><strong>Формат:</strong> ${data.format}</p>
        <p><strong>Количество:</strong> ${data.quantity}</p>
        <p><strong>Способ получения:</strong> ${data.delivery}</p>
        <p><strong>Адрес:</strong> ${data.address || 'не указан'}</p>
        <p><strong>Подарочная упаковка:</strong> ${data.gift}</p>
        <p><strong>Комментарий:</strong> ${data.comments || 'нет'}</p>
      `;
      orderForm.reset();
    });
  }

  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (galleryItems.length && lightbox) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        lightboxImg.src = item.src;
        lightbox.classList.add('active');
      });
    });
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('active');
    });
  }
});