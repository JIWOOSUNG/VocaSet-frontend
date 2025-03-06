import axios from 'axios';

const API_BASE_URL = 'http://localhost:5500'; // 백엔드 서버 주소

// 회원가입 요청 함수 (추가해야 함)
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/users`, userData);
        return response.data;
    } catch (error) {
        return error.response?.data || { result: 'fail', message: '회원가입 요청 실패' };
    }
};

// 로그인 요청 함수 (이미 있는 것)
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials);
        return response.data;
    } catch (error) {
        return error.response?.data || { result: 'fail', message: '로그인 요청 실패' };
    }
};
