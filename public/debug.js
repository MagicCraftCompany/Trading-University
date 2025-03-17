(function() {
  console.log('🔒 Auth Debug Helper');
  
  function clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('authVersion');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    console.log('✅ Auth state cleared - please refresh the page');
  }
  
  function showAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const cookieToken = document.cookie.split(';').find(c => c.trim().startsWith('token='));
    
    console.log('📝 Auth State:');
    console.log('LocalStorage token exists:', !!token);
    console.log('Cookie token exists:', !!cookieToken);
    console.log('User data:', user ? JSON.parse(user) : null);
    
    if (token) {
      try {
        // Parse the JWT without verification
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('JWT payload:', payload);
        console.log('Subscription status:', payload.subscriptionStatus);
        
        // Check expiration
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
          console.log('⚠️ Token expired!', new Date(payload.exp * 1000));
        } else if (payload.exp) {
          console.log('Token expires:', new Date(payload.exp * 1000));
        }
      } catch (e) {
        console.error('Failed to parse token:', e);
      }
    }
    return { token, user, cookieToken };
  }
  
  window.authDebug = {
    clear: clearAuth,
    show: showAuth
  };
  
  console.log('ℹ️ Run authDebug.show() to see auth state');
  console.log('ℹ️ Run authDebug.clear() to clear auth state');
})(); 