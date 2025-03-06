// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaPlus, FaSave, FaTrash } from 'react-icons/fa';
// import 'bootstrap/dist/css/bootstrap.min.css';

// export default function CreateSet() {
//     const navigate = useNavigate();
//     const userId = 1; // 예제 사용자 ID (로그인 구현 후 실제 값 사용)
//     const [setTitle, setSetTitle] = useState('');
//     const [description, setDescription] = useState('');
//     const [words, setWords] = useState([{ id: 1, word: '', meaning: '' }]);

//     const handleWordChange = (id, field, value) => {
//         setWords(words.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
//     };

//     // 단어 추가
//     const addWord = () => {
//         setWords([...words, { id: words.length + 1, word: '', meaning: '' }]);
//     };

//     // 단어 삭제
//     const deleteWord = (id) => {
//         setWords(words.filter((item) => item.id !== id));
//     };

//     // 단어 세트 저장
//     const saveSet = async () => {
//         if (!setTitle || !description) {
//             alert('단어 세트 이름과 설명을 입력하세요.');
//             return;
//         }

//         try {
//             // 1️⃣ 단어 세트 저장
//             const setResponse = await axios.post(`http://localhost:5500/api/users/${userId}/set`, {
//                 set_name: setTitle,
//                 description,
//             });

//             if (setResponse.data.result === 'success') {
//                 const setId = setResponse.data.data.insertId; // 생성된 세트 ID
//                 console.log('단어 세트 저장 완료:', setId);

//                 // 2️⃣ 단어 저장 (각 단어를 별도로 저장)
//                 for (const word of words) {
//                     if (word.word && word.meaning) {
//                         await axios.post(`http://localhost:5500/api/users/${userId}/set/${setId}/voca`, {
//                             word: word.word,
//                             meaning: word.meaning,
//                         });
//                     }
//                 }

//                 alert('단어 세트가 저장되었습니다.');
//                 navigate('/home'); // ✅ 저장 후 홈으로 이동
//             }
//         } catch (error) {
//             console.error('단어 세트 저장 실패:', error);
//         }
//     };

//     return (
//         <div className="container text-dark mt-4">
//             <h2 className="mb-3">새 단어 세트 만들기</h2>
//             <input
//                 type="text"
//                 className="form-control mb-2"
//                 placeholder="단어 세트 이름"
//                 value={setTitle}
//                 onChange={(e) => setSetTitle(e.target.value)}
//             />
//             <input
//                 type="text"
//                 className="form-control mb-3"
//                 placeholder="단어 세트 설명"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//             />

//             {words.map((item) => (
//                 <div key={item.id} className="d-flex gap-2 mb-2">
//                     <input
//                         type="text"
//                         className="form-control"
//                         placeholder="단어"
//                         value={item.word}
//                         onChange={(e) => handleWordChange(item.id, 'word', e.target.value)}
//                     />
//                     <input
//                         type="text"
//                         className="form-control"
//                         placeholder="뜻"
//                         value={item.meaning}
//                         onChange={(e) => handleWordChange(item.id, 'meaning', e.target.value)}
//                     />
//                     <button className="btn btn-danger" onClick={() => deleteWord(item.id)}>
//                         <FaTrash />
//                     </button>
//                 </div>
//             ))}

//             <div className="d-flex gap-3 mt-2">
//                 <button className="btn btn-success" onClick={addWord}>
//                     <FaPlus /> 단어 추가
//                 </button>
//                 <button className="btn btn-primary" onClick={saveSet}>
//                     <FaSave /> 저장하기
//                 </button>
//             </div>
//         </div>
//     );
// }
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaSave, FaTrash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CreateSet() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [setTitle, setSetTitle] = useState('');
    const [description, setDescription] = useState('');
    const [words, setWords] = useState([{ id: 1, word: '', meaning: '' }]);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        console.log('저장된 userId:', storedUserId);
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            navigate('/login'); // 로그인하지 않은 경우 로그인 페이지로 이동
        }
    }, [navigate]);

    const handleWordChange = (id, field, value) => {
        setWords(words.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    };

    const addWord = () => {
        setWords([...words, { id: words.length + 1, word: '', meaning: '' }]);
    };

    const deleteWord = (id) => {
        setWords(words.filter((item) => item.id !== id));
    };

    const saveSet = async () => {
        if (!userId) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (!setTitle || !description || words.length === 0) {
            alert('세트 정보와 단어를 입력하세요.');
            return;
        }

        try {
            console.log('저장 요청:', { set_name: setTitle, description, words, userId });

            const setResponse = await axios.post(`http://localhost:5500/api/users/${userId}/set`, {
                set_name: setTitle,
                description,
                words, // ✅ 단어 목록도 함께 전달
            });

            console.log('서버 응답:', setResponse.data);

            if (setResponse.data.result === 'success') {
                alert('단어 세트가 저장되었습니다.');
                navigate('/home');
            } else {
                alert('단어 세트 저장 중 오류 발생!');
            }
        } catch (error) {
            console.error('단어 세트 저장 실패:', error);
        }
    };

    return (
        <div className="container text-dark mt-4">
            <h2 className="mb-3">새 단어 세트 만들기</h2>

            {/* 단어 세트 이름 입력 */}
            <input
                type="text"
                className="form-control mb-2"
                placeholder="단어 세트 이름"
                value={setTitle}
                onChange={(e) => setSetTitle(e.target.value)}
            />

            {/* 단어 세트 설명 입력 */}
            <input
                type="text"
                className="form-control mb-3"
                placeholder="단어 세트 설명"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            {/* 단어 목록 입력 */}
            {words.map((item) => (
                <div key={item.id} className="d-flex gap-2 mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="단어"
                        value={item.word}
                        onChange={(e) => handleWordChange(item.id, 'word', e.target.value)}
                    />
                    <input
                        type="text"
                        className="form-control"
                        placeholder="뜻"
                        value={item.meaning}
                        onChange={(e) => handleWordChange(item.id, 'meaning', e.target.value)}
                    />
                    <button className="btn btn-danger" onClick={() => deleteWord(item.id)}>
                        <FaTrash />
                    </button>
                </div>
            ))}

            {/* 단어 추가 및 저장 버튼 */}
            <div className="d-flex gap-3 mt-3">
                <button className="btn btn-success" onClick={addWord}>
                    <FaPlus /> 단어 추가
                </button>
                <button className="btn btn-primary" onClick={saveSet}>
                    <FaSave /> 저장하기
                </button>
            </div>
        </div>
    );
}
