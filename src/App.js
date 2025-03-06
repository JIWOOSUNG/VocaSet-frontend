import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Main from './components/Main';
import CreateSet from './components/CreateSet';
import SetDetail from './components/SetDetail';
import Quiz from './components/Quiz';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<Main />} />
                <Route path="/create-set" element={<CreateSet />} />
                <Route path="/set/:setId" element={<SetDetail />} /> {/* ✅ 단어 세트 상세 보기 */}
                <Route path="/quiz/:setId" element={<Quiz />} /> {/* ✅ 추가 */}
            </Routes>
        </Router>
    );
}

export default App;
