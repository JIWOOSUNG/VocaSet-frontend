import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaArrowLeft, FaTrash, FaEdit, FaPlus } from 'react-icons/fa';

export default function SetDetail() {
    const { setId } = useParams();
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [setDetails, setSetDetails] = useState(null);
    const [words, setWords] = useState([]);

    // 모달 상태
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newWord, setNewWord] = useState('');
    const [newMeaning, setNewMeaning] = useState('');
    const [editingWord, setEditingWord] = useState({ voca_id: '', word: '', meaning: '' });

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            navigate('/login');
        } else {
            setUserId(storedUserId);
        }
    }, [navigate]);

    useEffect(() => {
        if (userId) {
            fetchSetDetails(userId, setId);
            fetchWords(userId, setId);
        }
    }, [userId, setId]);

    // ✅ 단어 세트 정보 가져오기
    const fetchSetDetails = async (userId, setId) => {
        try {
            const response = await axios.get(`http://localhost:5500/api/users/${userId}/set/${setId}`);
            setSetDetails(response.data.data);
        } catch (error) {
            console.error('단어 세트 정보 불러오기 실패:', error);
        }
    };

    // ✅ 단어 목록 가져오기
    const fetchWords = async (userId, setId) => {
        try {
            const response = await axios.get(`http://localhost:5500/api/users/${userId}/set/${setId}/voca`);
            setWords(response.data.data || []);
        } catch (error) {
            console.error('단어 목록 불러오기 실패:', error);
        }
    };

    // ✅ 단어 삭제 기능
    const deleteWord = async (vocaId) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await axios.delete(`http://localhost:5500/api/users/${userId}/set/${setId}/voca/${vocaId}`);
                fetchWords(userId, setId); // 삭제 후 목록 갱신
            } catch (error) {
                console.error('단어 삭제 실패:', error);
            }
        }
    };

    // ✅ 단어 추가 기능 (모달 사용)
    const addWord = async () => {
        if (!newWord || !newMeaning) {
            alert('단어와 뜻을 입력하세요.');
            return;
        }
        console.log('📌 추가 요청 데이터:', { word: newWord, meaning: newMeaning });

        try {
            await axios.post(`http://localhost:5500/api/users/${userId}/set/${setId}/voca`, {
                word: newWord,
                meaning: newMeaning,
            });

            setNewWord('');
            setNewMeaning('');
            setShowModal(false);
            fetchWords(userId, setId); // 목록 갱신
        } catch (error) {
            console.error('단어 추가 실패:', error);
        }
    };

    // ✅ 단어 수정 버튼 클릭 → 모달 열기
    const handleEditClick = (word) => {
        setEditingWord(word);
        setShowEditModal(true);
    };

    // ✅ 단어 수정 요청 API 호출
    // const handleSaveEdit = async () => {
    //     console.log(
    //         '📌 [handleSaveEdit] 요청 URL:',
    //         `http://localhost:5500/api/users/${userId}/set/${setId}/voca/${editingWord.voca_id}`
    //     );

    //     try {
    //         const response = await axios.put(
    //             `http://localhost:5500/api/users/${userId}/set/${setId}/voca/${editingWord.voca_id}`,
    //             { word: editingWord.word, meaning: editingWord.meaning }
    //         );

    //         if (response.data.result === 'success') {
    //             alert('단어 수정 완료!');
    //             setShowEditModal(false);
    //             fetchWords(userId, setId);
    //         } else {
    //             alert('단어 수정 실패!');
    //         }
    //     } catch (error) {
    //         console.error('📌 단어 수정 실패:', error);
    //         alert('단어 수정 중 오류 발생!');
    //     }
    // };
    const handleSaveEdit = async () => {
        const updateUrl = `http://localhost:5500/api/users/${userId}/set/${setId}/voca/${editingWord.voca_id}`;
        console.log('📌 [handleSaveEdit] 요청 URL:', updateUrl);
        console.log('📌 [handleSaveEdit] 요청 데이터:', { word: editingWord.word, meaning: editingWord.meaning });

        try {
            const response = await axios.put(updateUrl, {
                word: editingWord.word,
                meaning: editingWord.meaning,
            });

            if (response.data.result === 'success') {
                alert('단어 수정 완료!');
                setShowEditModal(false);
                fetchWords(userId, setId);
            } else {
                alert('단어 수정 실패!');
            }
        } catch (error) {
            console.error('📌 단어 수정 실패:', error);
            alert('단어 수정 중 오류 발생!');
        }
    };

    return (
        <div className="container-fluid bg-light min-vh-100">
            {/* 네비게이션 바 유지 */}
            <nav className="navbar navbar-light bg-white px-5 shadow-sm">
                <span className="navbar-brand h1 fw-bold">WEB-KIT</span>
                <button className="btn btn-outline-dark" onClick={() => navigate('/home')}>
                    <FaArrowLeft /> 뒤로가기
                </button>
            </nav>

            <div className="container mt-4">
                {setDetails ? (
                    <>
                        <h2 className="fw-bold">{setDetails.set_name}</h2>
                        <p className="text-muted">{setDetails.description}</p>

                        {/* 단어 목록 */}
                        <div className="list-group mt-4">
                            {words.length > 0 ? (
                                words.map((word) => (
                                    <div key={word.voca_id} className="list-group-item d-flex justify-content-between">
                                        <span className="fw-bold">{word.word}</span>
                                        <span className="text-muted">{word.meaning}</span>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => deleteWord(word.voca_id)}
                                        >
                                            <FaTrash />
                                        </button>
                                        |
                                        <button className="btn btn-warning me-2" onClick={() => handleEditClick(word)}>
                                            <FaEdit /> 수정
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">등록된 단어가 없습니다.</p>
                            )}
                        </div>

                        {/* 단어 추가 버튼 */}
                        <div className="d-flex justify-content-end mt-4">
                            <button className="btn btn-success" onClick={() => setShowModal(true)}>
                                <FaPlus /> 단어 추가
                            </button>
                        </div>

                        {/* 단어 추가 모달 */}
                        {showModal && (
                            <div className="modal d-block" tabIndex="-1">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">새 단어 추가</h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                onClick={() => setShowModal(false)}
                                            ></button>
                                        </div>
                                        <div className="modal-body">
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                placeholder="단어"
                                                value={newWord}
                                                onChange={(e) => setNewWord(e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="뜻"
                                                value={newMeaning}
                                                onChange={(e) => setNewMeaning(e.target.value)}
                                            />
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => setShowModal(false)}
                                            >
                                                닫기
                                            </button>
                                            <button type="button" className="btn btn-primary" onClick={addWord}>
                                                추가
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-center text-muted">단어 세트 정보를 불러오는 중...</p>
                )}
            </div>
            {showEditModal && (
                <div className="modal d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">단어 수정</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowEditModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    value={editingWord.word}
                                    onChange={(e) => setEditingWord({ ...editingWord, word: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editingWord.meaning}
                                    onChange={(e) => setEditingWord({ ...editingWord, meaning: e.target.value })}
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    취소
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveEdit}>
                                    저장
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
