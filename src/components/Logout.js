import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token'); // JWT 토큰 삭제
        alert('로그아웃 되었습니다.');

        //로그인 페이지 이동
        navigate('/login');
    };

    return (
        <button className="btn btn-danger" onClick={handleLogout}>
            로그아웃
        </button>
    );
}
