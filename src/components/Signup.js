// import React, { useState } from 'react';
// import { registerUser } from '../api/auth';
// import { useNavigate } from 'react-router-dom';

// export default function Signup() {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         user_name: '',
//         user_email: '',
//         password: '',
//         confirmPassword: '',
//     });

//     const [message, setMessage] = useState('');

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (formData.password !== formData.confirmPassword) {
//             setMessage('비밀번호가 일치하지 않습니다.');
//             return;
//         }

//         const userData = {
//             user_name: formData.user_name,
//             user_email: formData.user_email,
//             password: formData.password,
//         };

//         const res = await registerUser(userData);
//         setMessage(res.message);

//         if (res.result === 'success') {
//             alert('회원가입 성공! 로그인 페이지로 이동합니다.');
//             navigate('/login');
//         }
//     };

//     return (
//         <div className="container text-center mt-4">
//             <h2>회원가입</h2>
//             <form onSubmit={handleSubmit} className="w-50 mx-auto">
//                 <div className="mb-3">
//                     <input
//                         type="text"
//                         className="form-control"
//                         placeholder="이름"
//                         name="user_name"
//                         value={formData.user_name}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div className="mb-3">
//                     <input
//                         type="email"
//                         className="form-control"
//                         placeholder="이메일"
//                         name="user_email"
//                         value={formData.user_email}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div className="mb-3">
//                     <input
//                         type="password"
//                         className="form-control"
//                         placeholder="비밀번호"
//                         name="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div className="mb-3">
//                     <input
//                         type="password"
//                         className="form-control"
//                         placeholder="비밀번호 확인"
//                         name="confirmPassword"
//                         value={formData.confirmPassword}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <button type="submit" className="btn btn-primary w-100">
//                     회원가입
//                 </button>
//             </form>
//             {message && <p className="mt-3 text-danger">{message}</p>}
//         </div>
//     );
// }

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        password: '',
        confirmPassword: '',
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            await axios.post('http://localhost:5500/api/users', {
                user_name: formData.user_name,
                user_email: formData.user_email,
                password: formData.password,
            });
            alert('회원가입 성공! 로그인 페이지로 이동합니다.');
            navigate('/login');
        } catch (error) {
            setErrorMessage('회원가입 실패: 이미 존재하는 이메일이거나 서버 오류.');
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
            {/* 네비게이션 바 */}
            <nav className="w-100 navbar navbar-light bg-white px-5 shadow-sm">
                <span className="navbar-brand h1 fw-bold">WEB-KIT</span>
                <div>
                    <button className="btn btn-link text-dark me-3" onClick={() => navigate('/signup')}>
                        회원가입
                    </button>
                    <button className="btn btn-danger" onClick={() => navigate('/login')}>
                        로그인
                    </button>
                </div>
            </nav>

            {/* 회원가입 컨테이너 */}
            <div className="container bg-white shadow rounded-3 p-5 mt-4" style={{ maxWidth: '900px' }}>
                <h2 className="fw-bold text-center mb-4">회원가입</h2>
                <form onSubmit={handleSubmit} className="w-75 mx-auto">
                    <input
                        type="text"
                        name="user_name"
                        placeholder="이름"
                        className="form-control mb-3"
                        value={formData.user_name}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="user_email"
                        placeholder="이메일"
                        className="form-control mb-3"
                        value={formData.user_email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="비밀번호"
                        className="form-control mb-3"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="비밀번호 확인"
                        className="form-control mb-3"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    <button type="submit" className="btn btn-danger w-100">
                        회원가입
                    </button>
                </form>
                {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
            </div>
        </div>
    );
}
