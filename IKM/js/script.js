document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (burger) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }

  const datetimeEl = document.getElementById('datetime');
  if (datetimeEl) {
    setInterval(() => {
      const now = new Date();
      datetimeEl.textContent = now.toLocaleString('ru-RU');
    }, 1000);
  }

  const newsGrid = document.getElementById('newsGrid');
  if (newsGrid) {
    const newsData = [
      { title: 'Открытие нового маршрута', img: 'https://picsum.photos/id/101/400/250', short: 'Запущен уникальный тур по Исландии.', full: 'Полный текст: Мы рады представить новый тур по Исландии, включающий гейзеры, водопады и северное сияние. Бронирование уже открыто!' },
      { title: 'Скидки на раннее бронирование', img: 'https://picsum.photos/id/102/400/250', short: 'Экономьте до 30% при бронировании летних туров.', full: 'С 1 марта по 30 апреля действует акция раннего бронирования на все направления. Спешите!' },
      { title: 'Новые визовые правила', img: 'https://picsum.photos/id/103/400/250', short: 'Италия упростила получение виз для россиян.', full: 'Итальянское консульство объявило об упрощении процедуры... (подробности).' },
      { title: 'Фестиваль цветов в Нидерландах', img: 'https://picsum.photos/id/104/400/250', short: 'Парк Кёкенхоф открыт с 21 марта.', full: 'Ежегодный фестиваль тюльпанов пройдёт с 21 марта по 10 мая. Билеты на нашем сайте.' },
      { title: 'Обновление флота авиакомпаний', img: 'https://picsum.photos/id/105/400/250', short: 'Новые самолёты на рейсах в Азию.', full: 'Авиакомпании-партнёры вводят в эксплуатацию Airbus A350...' },
      { title: 'Лучшие пляжи 2026', img: 'https://picsum.photos/id/106/400/250', short: 'Топ-10 пляжей по версии Wanderlust.', full: 'Список побережий, которые стоит посетить этим летом...' },
    ];

    newsData.forEach(item => {
      const block = document.createElement('div');
      block.className = 'news-item';
      block.innerHTML = `<img src="${item.img}" alt=""><h3>${item.title}</h3><p>${item.short}</p>`;
      block.addEventListener('click', () => {
        document.getElementById('modalImg').src = item.img;
        document.getElementById('modalTitle').textContent = item.title;
        document.getElementById('modalText').textContent = item.full;
        document.getElementById('newsModal').classList.add('active');
      });
      newsGrid.appendChild(block);
    });

    document.getElementById('modalClose').addEventListener('click', () => {
      document.getElementById('newsModal').classList.remove('active');
    });
    window.addEventListener('click', (e) => {
      if (e.target === document.getElementById('newsModal')) {
        document.getElementById('newsModal').classList.remove('active');
      }
    });
  }

  const cardsContainer = document.getElementById('cardsContainer');
  if (cardsContainer) {
    const destinations = [
      { name: 'Париж', img: 'https://picsum.photos/id/10/400/250' },
      { name: 'Токио', img: 'https://picsum.photos/id/15/400/250' },
      { name: 'Нью-Йорк', img: 'https://picsum.photos/id/20/400/250' },
      { name: 'Рим', img: 'https://picsum.photos/id/25/400/250' },
      { name: 'Барселона', img: 'https://picsum.photos/id/30/400/250' },
      { name: 'Лондон', img: 'https://picsum.photos/id/35/400/250' },
      { name: 'Дубай', img: 'https://picsum.photos/id/40/400/250' },
      { name: 'Сидней', img: 'https://picsum.photos/id/45/400/250' },
      { name: 'Бали', img: 'https://picsum.photos/id/50/400/250' },
      { name: 'Прага', img: 'https://picsum.photos/id/55/400/250' },
      { name: 'Кейптаун', img: 'https://picsum.photos/id/60/400/250' },
      { name: 'Рейкьявик', img: 'https://picsum.photos/id/65/400/250' }
    ];
    destinations.forEach(dest => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<img src="${dest.img}" alt=""><h3>${dest.name}</h3>`;
      cardsContainer.appendChild(card);
    });
  }

  const mapEl = document.getElementById('map');
  if (mapEl) {
    const map = L.map('map').setView([55.7558, 37.6173], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          map.setView([latitude, longitude], 13);
          L.marker([latitude, longitude]).addTo(map).bindPopup('Вы здесь').openPopup();
        },
        () => console.log('Геолокация отключена')
      );
    }
  }

  const form = document.getElementById('bookingForm');
  if (form) {
    const bookingsKey = 'wanderlustBookings';
    const loadBookings = () => JSON.parse(localStorage.getItem(bookingsKey) || '[]');
    const saveBookings = (bookings) => localStorage.setItem(bookingsKey, JSON.stringify(bookings));
    const renderTable = () => {
      const tbody = document.querySelector('#bookingsTable tbody');
      const bookings = loadBookings();
      tbody.innerHTML = bookings.map(b => `<tr><td>${b.name}</td><td>${b.email}</td><td>${b.destination}</td><td>${b.departure}</td></tr>`).join('');
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const booking = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        destination: form.destination.value,
        departure: form.departure.value,
        return: form.return.value,
        adults: form.adults.value,
        children: form.children.value,
        accommodation: form.accommodation.value,
        comments: form.comments.value
      };
      const bookings = loadBookings();
      bookings.push(booking);
      saveBookings(bookings);
      document.getElementById('formResult').innerHTML = `<h3>Заявка принята!</h3><p>Спасибо, ${booking.name}. Мы свяжемся с вами.</p>`;
      form.reset();
      renderTable();
    });

    renderTable();
  }

  const slider = document.getElementById('slider');
  if (slider) {
    const track = document.getElementById('sliderTrack');
    const slides = Array.from(track.children);
    let currentIndex = 0;

    const updateSlide = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    document.getElementById('nextBtn').addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlide();
    });
    document.getElementById('prevBtn').addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlide();
    });
  }
});