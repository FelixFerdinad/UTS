const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');
const authenticationRepository = require('./authentication-repository');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOGIN_TIMEOUT_DURATION = 30 * 60 * 1000; // 30 menit dalam milidetik
  const { email, password } = request.body;
  
  try {
    // Melakukan pengecekan apakah pengguna telah melebihi batas percobaan login
    let userAttempts = await authenticationRepository.getLoginAttempts(email);
    const lastFailedAttempt = await authenticationRepository.getLastFailedAttempt(email);
    const currentTime = Date.now();

    if (userAttempts >= MAX_LOGIN_ATTEMPTS && lastFailedAttempt) {
      const timeSinceLastAttempt = currentTime - lastFailedAttempt;

      if (timeSinceLastAttempt < LOGIN_TIMEOUT_DURATION) {
        const timeRemaining = Math.ceil((LOGIN_TIMEOUT_DURATION - timeSinceLastAttempt) / 1000 / 60);
        throw errorResponder(
          errorTypes.TOO_MANY_ATTEMPTS,
          `Terlalu banyak percobaan login. Silakan coba lagi dalam ${timeRemaining} menit`
        );
      } else {
        // Reset percobaan login jika waktu sudah lewat dari batas timeout
        await authenticationRepository.resetLoginAttempts(email);
        userAttempts = 0; // Reset nilai percobaan login pengguna
      }
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      // Menambahkan percobaan login gagal
      await authenticationRepository.addFailedLoginAttempt(email);
      
      // Mendapatkan waktu sekarang
      const currentTime = new Date();
      
      // Mengonversi nilai userAttempts menjadi bilangan bulat sebelum menambahkan 1
      userAttempts = parseInt(userAttempts) || 0;

      // Menambahkan pesan log untuk percobaan login yang gagal
      const attemptMessage = `${formatTime(currentTime)} User ${email} gagal login. Attempt = ${userAttempts + 1}.`;

      // Mengirimkan pesan log ke konsol
      console.log(attemptMessage);

      if (userAttempts + 1 >= MAX_LOGIN_ATTEMPTS) {
        throw errorResponder(
          errorTypes.TOO_MANY_ATTEMPTS,
          `${attemptMessage} Limit percobaan login tercapai.`
        );
      }

      return response.status(401).json({
        message: `${attemptMessage} ${errorTypes.INVALID_CREDENTIALS}`
      });
    }

    // Reset percobaan login jika berhasil
    await authenticationRepository.resetLoginAttempts(email);

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

function formatTime(date) {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  return '[' + date.toLocaleString('en-US', options).replace(/\//g, '-').replace(/,/g, '') + ']';
}

module.exports = {
  login,
  formatTime,
};
