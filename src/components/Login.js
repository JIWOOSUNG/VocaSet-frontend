// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { loginUser } from '../api/auth';

// export default function Login() {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({ user_email: '', password: '' });
//     const [message, setMessage] = useState('');

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const res = await loginUser(formData);

//         if (res.result === 'success') {
//             localStorage.setItem('token', res.data.token); // JWT 저장
//             alert('로그인 성공!');
//             navigate('/home'); // 로그인 후 홈으로 이동 (추후 변경 가능)
//         } else {
//             setMessage(res.message);
//         }
//     };

//     return (
//         <div className="container text-center mt-4">
//             <h2>로그인</h2>
//             <form onSubmit={handleSubmit} className="w-50 mx-auto">
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
//                 <button type="submit" className="btn btn-primary w-100">
//                     로그인
//                 </button>
//             </form>
//             {message && <p className="mt-3 text-danger">{message}</p>}
//             <p className="mt-3">
//                 <span>계정이 없나요? </span>
//                 <a href="/signup">회원가입</a>
//             </p>
//         </div>
//     );
// }
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ user_email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5500/api/auth/login', formData);

            console.log('서버 응답:', response.data);

            if (response.data.result === 'success') {
                const userId = response.data.data.user_id;
                console.log('로그인 성공! userId:', userId);

                if (userId) {
                    localStorage.setItem('userId', userId);
                    navigate('/home');
                } else {
                    console.error('userId가 없습니다. 백엔드 응답 확인 필요!');
                }
            } else {
                setErrorMessage('로그인 실패: ' + response.data.message);
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            setErrorMessage('로그인 중 오류 발생!');
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
                    <button className="btn btn-danger">로그인</button>
                </div>
            </nav>

            {/* 로그인 컨테이너 */}
            <div className="container bg-white shadow rounded-3 p-5 mt-4" style={{ maxWidth: '900px' }}>
                <div className="row">
                    {/* 왼쪽 텍스트 */}
                    <div className="col-md-6 d-flex flex-column justify-content-center text-start">
                        <h1 className="fw-bold">
                            create <br /> your <br /> word <br /> set
                        </h1>
                    </div>

                    {/* 오른쪽 로그인 폼 */}
                    <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
                        <h2 className="fw-bold">WEB-KIT</h2>
                        <form onSubmit={handleSubmit} className="w-75">
                            <input
                                type="email"
                                name="user_email"
                                placeholder="ID"
                                className="form-control mb-3"
                                value={formData.user_email}
                                onChange={handleChange}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="PASSWORD"
                                className="form-control mb-4"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button type="submit" className="btn btn-danger w-100">
                                로그인
                            </button>
                        </form>
                        {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
                        <div className="mt-3 d-flex justify-content-between w-75 text-secondary small">
                            <button onClick={() => navigate('/signup')} className="btn btn-link p-0">
                                회원가입
                            </button>
                            <span>아이디 찾기 | 비밀번호 찾기</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
