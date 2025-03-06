import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTrash, FaPlus, FaSearch, FaUserCircle } from 'react-icons/fa';

export default function Main() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [sets, setSets] = useState([]);

    // ✅ localStorage에서 userId 가져오기
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        console.log('저장된 userId:', storedUserId);

        if (!storedUserId) {
            navigate('/login');
        } else {
            setUserId(storedUserId);
        }
    }, [navigate]);

    // ✅ userId가 설정된 후 단어 세트 목록 가져오기
    useEffect(() => {
        if (userId) {
            fetchSets(userId);
        }
    }, [userId]);

    // ✅ 단어 세트 목록 API 호출
    const fetchSets = async (userId) => {
        try {
            if (!userId) return;
            const response = await axios.get(`http://localhost:5500/api/users/${userId}/set`);
            console.log('단어 세트 데이터:', response.data);
            setSets(response.data.data || []);
        } catch (error) {
            console.error('단어 세트 불러오기 실패:', error);
        }
    };

    // ✅ 단어 세트 삭제 기능 (선택 사항)
    const deleteSet = async (setId) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await axios.delete(`http://localhost:5500/api/users/${userId}/set/${setId}`);
                fetchSets(userId); // 삭제 후 목록 갱신
            } catch (error) {
                console.error('단어 세트 삭제 실패:', error);
            }
        }
    };

    return (
        <div className="container-fluid bg-light min-vh-100">
            {/* 네비게이션 바 */}
            <nav className="navbar navbar-light bg-white px-5 shadow-sm">
                <span className="navbar-brand h1 fw-bold">WEB-KIT</span>
                <div className="d-flex align-items-center">
                    <input type="text" className="form-control me-2" placeholder="단어 세트 검색" />
                    <button className="btn btn-danger me-3">
                        <FaSearch /> 검색
                    </button>
                    <FaUserCircle size={30} className="me-2" />
                    <span className="fw-bold">user 님</span>
                </div>
            </nav>

            {/* 단어 세트 목록 */}
            <div className="container mt-4">
                <div className="row">
                    {sets.length > 0 ? (
                        sets.map((set) => (
                            <div
                                key={set.set_id}
                                className="col-md-4 mb-3"
                                onClick={() => navigate(`/set/${set.set_id}`)} // ✅ 클릭 시 해당 단어 세트 상세 페이지 이동
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="border rounded p-3 shadow-sm position-relative">
                                    {/* 삭제 버튼 (선택 사항) */}
                                    <FaTrash
                                        className="position-absolute top-0 start-0 mt-2 ms-2 text-danger"
                                        role="button"
                                        onClick={(e) => {
                                            e.stopPropagation(); // ✅ 부모 onClick 방지
                                            deleteSet(set.set_id);
                                        }}
                                    />
                                    <h5 className="fw-bold">{set.set_name}</h5>
                                    <p className="text-muted">{set.description}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted mt-4">등록된 단어장이 없습니다.</p>
                    )}
                </div>

                {/* 단어 세트 추가 버튼 */}
                <div className="d-flex justify-content-end mt-4">
                    <button className="btn btn-danger" onClick={() => navigate('/create-set')}>
                        단어장 <FaPlus />
                    </button>
                </div>
            </div>
        </div>
    );
}
