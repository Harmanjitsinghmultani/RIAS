import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = () => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    user: null,
  });

  useEffect(() => {
    if (auth.token) {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/user`, {
            headers: {
              'x-auth-token': auth.token,
            },
          });
          setAuth({ ...auth, user: res.data });
        } catch (error) {
          console.error(error);
        }
      };
      fetchUser();
    }
  }, [auth.token]);

  return [auth, setAuth];
};

export default useAuth;
