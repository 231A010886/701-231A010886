// Bài tìm kiếm sản phẩm trên trang chủ
const products = [
  { name: 'Bàn phím cơ', price: '750.000 VNĐ', description: 'Bàn phím dành cho học tập và chơi game.' },
  { name: 'Chuột không dây', price: '250.000 VNĐ', description: 'Chuột không dây gọn nhẹ.' },
  { name: 'Tai nghe gaming', price: '450.000 VNĐ', description: 'Tai nghe phục vụ giải trí và học tập.' },
  { name: 'Màn hình máy tính', price: '2.500.000 VNĐ', description: 'Màn hình cho máy tính để bàn.' },
  { name: 'Laptop', price: '12.000.000 VNĐ', description: 'Máy tính xách tay phục vụ công việc.' },
  { name: 'Lót chuột gaming', price: '100.000 VNĐ', description: 'Lót chuột bề mặt rộng.' }
];

function renderProducts(items) {
  const list = document.getElementById('productList');
  if (!list) return;
  list.replaceChildren();
  items.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    const title = document.createElement('h3');
    title.textContent = product.name;
    const description = document.createElement('p');
    description.textContent = product.description;
    const price = document.createElement('p');
    price.className = 'price';
    price.textContent = product.price;
    card.append(title, description, price);
    list.appendChild(card);
  });
}

const productSearch = document.getElementById('productSearch');
if (productSearch) {
  const message = document.getElementById('productMessage');
  renderProducts(products);
  productSearch.addEventListener('input', () => {
    const keyword = productSearch.value.trim().toLocaleLowerCase('vi');
    const matches = products.filter((product) => product.name.toLocaleLowerCase('vi').includes(keyword));
    renderProducts(matches);
    if (message) {
      message.textContent = matches.length ? '' : 'Không tìm thấy sản phẩm phù hợp.';
      message.classList.toggle('error', matches.length === 0);
    }
  });
}

// Bài đăng ký: kiểm tra dữ liệu, lưu tên/email (không lưu mật khẩu)
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  const password = document.getElementById('signupPassword');
  const showPassword = document.getElementById('showPassword');
  const message = document.getElementById('signupMessage');
  showPassword.addEventListener('change', () => {
    password.type = showPassword.checked ? 'text' : 'password';
  });
  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const pass = password.value;
    const accepted = document.getElementById('acceptTerms').checked;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passwordValid = pass.length >= 8 && /[A-Z]/.test(pass) && /[a-z]/.test(pass) && /\d/.test(pass);
    let error = '';
    if (!name) error = 'Vui lòng nhập họ và tên.';
    else if (!emailValid) error = 'Email chưa đúng định dạng.';
    else if (!passwordValid) error = 'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và chữ số.';
    else if (!accepted) error = 'Vui lòng đồng ý với điều khoản.';
    if (error) {
      message.textContent = error;
      message.classList.add('error');
      return;
    }
    try {
      localStorage.setItem('signupInfo', JSON.stringify({ name, email, registeredAt: new Date().toISOString() }));
      message.textContent = 'Đăng ký hợp lệ! Tên và email đã được lưu trên trình duyệt này.';
      message.classList.remove('error');
      signupForm.reset();
      password.type = 'password';
    } catch (storageError) {
      message.textContent = 'Dữ liệu hợp lệ nhưng trình duyệt không cho phép lưu LocalStorage.';
      message.classList.add('error');
    }
  });
}

// Bài đếm ngược 10 phút
const timerDisplay = document.getElementById('timerDisplay');
if (timerDisplay) {
  const startButton = document.getElementById('startTimer');
  const pauseButton = document.getElementById('pauseTimer');
  const resetButton = document.getElementById('resetTimer');
  const timerMessage = document.getElementById('timerMessage');
  const initialSeconds = 10 * 60;
  let remaining = initialSeconds;
  let intervalId = null;
  let endTime = null;
  const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const drawTimer = () => {
    timerDisplay.textContent = formatTime(remaining);
    timerDisplay.classList.toggle('warning', remaining > 0 && remaining < 60);
  };
  const stopTimer = () => {
    if (intervalId !== null) clearInterval(intervalId);
    intervalId = null;
    endTime = null;
  };
  const tick = () => {
    if (endTime !== null) remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    drawTimer();
    if (remaining <= 0) {
      stopTimer();
      timerMessage.textContent = 'Đã hết thời gian!';
      window.alert('Đã hết 10 phút!');
    }
  };
  startButton.addEventListener('click', () => {
    if (intervalId !== null || remaining <= 0) return;
    endTime = Date.now() + remaining * 1000;
    timerMessage.textContent = 'Đồng hồ đang chạy.';
    intervalId = setInterval(tick, 250);
    tick();
  });
  pauseButton.addEventListener('click', () => {
    if (intervalId === null) return;
    remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    stopTimer();
    drawTimer();
    timerMessage.textContent = 'Đồng hồ đã tạm dừng.';
  });
  resetButton.addEventListener('click', () => {
    stopTimer();
    remaining = initialSeconds;
    drawTimer();
    timerMessage.textContent = 'Đã đặt lại 10 phút. Nhấn Bắt đầu để chạy.';
  });
  drawTimer();
}

// Form liên hệ minh họa; không gửi dữ liệu ra máy chủ
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = document.getElementById('contactMessage');
    message.textContent = 'Đã kiểm tra biểu mẫu. Đây chỉ là bản minh họa, chưa gửi dữ liệu đến máy chủ.';
    message.classList.remove('error');
    contactForm.reset();
  });
}
