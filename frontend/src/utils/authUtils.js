import jwtDecode from 'jwt-decode';

export const verifyToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error('Invalid token');
    return null;
  }
};
