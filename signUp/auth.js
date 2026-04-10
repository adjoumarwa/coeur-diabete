// ============================================
// المستخدمين المسجلين
// ============================================
const defaultUsers = [
  { email: "user@example.com", password: "12345678", name: "أحمد", type: "user", registeredAt: new Date().toISOString() },
  { email: "test@test.com", password: "12345678", name: "محمد", type: "user", registeredAt: new Date().toISOString() },
  { email: "admin@coeur-diabete.com", password: "admin123", name: "المدير", type: "admin", registeredAt: new Date().toISOString() }
];

function loadUsersFromStorage() {
  const storedUsers = localStorage.getItem('registeredUsers');
  let allUsers = [...defaultUsers];
  
  if (storedUsers) {
    const parsedUsers = JSON.parse(storedUsers);
    parsedUsers.forEach(storedUser => {
      if (!allUsers.find(u => u.email === storedUser.email)) {
        allUsers.push(storedUser);
      }
    });
  }
  
  return allUsers;
}

function login(email, password) {
  const allUsers = loadUsersFromStorage();
  const user = allUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify({
      email: user.email,
      name: user.name,
      type: user.type,
      loginTime: new Date().toISOString()
    }));
    return { success: true, userType: user.type, userName: user.name };
  }
  return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
}

function togglePassword() {
  const passwordInput = document.getElementById("password");
  if (passwordInput) {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  }
}

function fillAdminCredentials() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  if (emailInput && passwordInput) {
    emailInput.value = "admin@coeur-diabete.com";
    passwordInput.value = "admin123";
  }
}

function fillUserCredentials() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  if (emailInput && passwordInput) {
    emailInput.value = "user@example.com";
    passwordInput.value = "12345678";
  }
}

window.authHelpers = {
  login,
  togglePassword,
  fillAdminCredentials,
  fillUserCredentials,
  loadUsersFromStorage
};