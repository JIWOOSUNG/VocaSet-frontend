import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Quiz() {
    const { setId } = useParams();
    const navigate = useNavigate();
    const [userId] = useState(localStorage.getItem('userId'));
    const [quizWords, setQuizWords] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [quizResult, setQuizResult] = useState(null);

    useEffect(() => {
        if (!userId) {
            navigate('/login');
        } else {
            fetchQuizWords();
        }
        console.log(quizWords);
    }, [userId, setId]);

    // 퀴즈 단어 가져오기
    const fetchQuizWords = async () => {
        try {
            const response = await axios.get(`http://localhost:5500/api/users/${userId}/set/${setId}/voca/quiz`);
            setQuizWords(response.data.data || []);
        } catch (error) {
            console.error('퀴즈 단어 불러오기 실패:', error);
        }
    };

    // 입력값 변경 핸들러
    const handleInputChange = (vocaId, value) => {
        setUserAnswers((prev) => ({
            ...prev,
            [vocaId]: value
        }));
    };

    // 퀴즈 제출
    const handleSubmit = async (e) => {
        e.preventDefault();
        const answers = quizWords.map(({ voca_id }) => ({
            voca_id,
            user_answer: userAnswers[voca_id] || ''
        }));

        try {
            const response = await axios.post(`http://localhost:5500/api/users/${userId}/set/${setId}/voca/quiz/submit`, { answers });
            setQuizResult(response.data.data);
        } catch (error) {
            console.error('퀴즈 제출 실패:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="fw-bold">퀴즈 풀기</h2>
            {quizWords.length > 0 ? (
                <form onSubmit={handleSubmit}>
                    {quizWords.map(({ voca_id, word }) => (
                        <div key={voca_id} className="mb-3">
                            <label className="form-label fw-bold">{word}</label>
                            <input
                                type="text"
                                className="form-control"
                                value={userAnswers[voca_id] || ''}
                                onChange={(e) => handleInputChange(voca_id, e.target.value)}
                                required
                            />
                        </div>
                    ))}
                    <button type="submit" className="btn btn-primary mt-3">제출</button>
                </form>
            ) : (
                <p className="text-muted">퀴즈 단어를 불러오는 중...</p>
            )}

            {/* 결과 표시 */}
            {quizResult && (
                <div className="mt-4">
                    <h3>결과: {quizResult.score} / {quizResult.total}</h3>
                    <ul className="list-group">
                        {quizResult.results.map(({ voca_id, user_answer, correct_answer, is_correct }) => (
                            <li key={voca_id} className={`list-group-item ${is_correct ? 'text-success' : 'text-danger'}`}>
                                <strong>단어:</strong> {quizWords.find(q => q.voca_id === voca_id)?.word} <br />
                                <strong>입력한 답:</strong> {user_answer} <br />
                                <strong>정답:</strong> {correct_answer} <br />
                                {is_correct ? '✅ 정답' : '❌ 오답'}
                            </li>
                        ))}
                    </ul>
                    <button className="btn btn-secondary mt-3" onClick={() => navigate(`/set/${setId}`)}>돌아가기</button>
                </div>
            )}
        </div>
    );
}
