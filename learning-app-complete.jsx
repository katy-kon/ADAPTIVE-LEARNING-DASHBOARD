// ============================================
// ADAPTIVE LEARNING DASHBOARD - FRONTEND
// React + TailwindCSS + Chart.js
// ============================================

// App.jsx
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import StudentProgress from './components/StudentProgress';
import QuizInterface from './components/QuizInterface';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Загрузка данных пользователя
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} />
      
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'dashboard' && <Dashboard user={user} />}
        {currentPage === 'progress' && <StudentProgress user={user} />}
        {currentPage === 'quiz' && <QuizInterface user={user} />}
      </main>
    </div>
  );
}

export default App;

// ============================================
// components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    totalQuizzes: 42,
    averageScore: 78.5,
    streakDays: 12,
    completedLessons: 28,
    progressData: [
      { week: 'W1', score: 65 },
      { week: 'W2', score: 72 },
      { week: 'W3', score: 78 },
      { week: 'W4', score: 85 },
      { week: 'W5', score: 88 },
    ],
    categoryScores: [
      { name: 'Math', score: 85 },
      { name: 'Physics', score: 79 },
      { name: 'Chemistry', score: 82 },
      { name: 'Biology', score: 76 },
    ]
  });

  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      title: 'Улучши навыки в Химии',
      description: 'Твой результат 76%. Рекомендуем дополнительные материалы.',
      difficulty: 'medium',
      estimatedTime: '45 мин'
    },
    {
      id: 2,
      title: 'Продолжи серию на Физике',
      description: 'У тебя хороший прогресс (79%). Попробуй сложные задачи.',
      difficulty: 'hard',
      estimatedTime: '60 мин'
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Всего Квизов" 
          value={stats.totalQuizzes}
          icon="📝"
          color="bg-blue-500"
        />
        <StatCard 
          title="Средний Балл" 
          value={`${stats.averageScore}%`}
          icon="⭐"
          color="bg-green-500"
        />
        <StatCard 
          title="Дней в Серии" 
          value={stats.streakDays}
          icon="🔥"
          color="bg-orange-500"
        />
        <StatCard 
          title="Пройдено Уроков" 
          value={stats.completedLessons}
          icon="✅"
          color="bg-purple-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Прогресс по неделям</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Scores */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Баллы по категориям</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.categoryScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">📚 Рекомендации для тебя</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map(rec => (
            <div key={rec.id} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
              <h3 className="font-bold text-gray-800">{rec.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{rec.description}</p>
              <div className="flex justify-between mt-3">
                <span className={`text-xs px-2 py-1 rounded text-white ${
                  rec.difficulty === 'easy' ? 'bg-green-500' :
                  rec.difficulty === 'medium' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}>
                  {rec.difficulty === 'easy' ? '🟢 Easy' : 
                   rec.difficulty === 'medium' ? '🟡 Medium' : 
                   '🔴 Hard'}
                </span>
                <span className="text-xs text-gray-600">⏱️ {rec.estimatedTime}</span>
              </div>
              <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                Начать 🚀
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`${color} rounded-lg shadow-lg p-6 text-white`}>
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

export default Dashboard;

// ============================================
// components/QuizInterface.jsx
import React, { useState, useEffect } from 'react';

function QuizInterface({ user }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizComplete, setQuizComplete] = useState(false);

  const [quiz, setQuiz] = useState({
    title: 'Математика - Алгебра',
    difficulty: 'medium',
    questions: [
      {
        id: 1,
        question: 'Решите: 2x + 5 = 13',
        options: ['x = 4', 'x = 3', 'x = 5', 'x = 6'],
        correct: 0,
        explanation: 'Вычтем 5: 2x = 8, разделим на 2: x = 4'
      },
      {
        id: 2,
        question: 'Что такое производная функции?',
        options: [
          'Скорость изменения функции',
          'Площадь под графиком',
          'Максимальное значение',
          'Минимальное значение'
        ],
        correct: 0,
        explanation: 'Производная показывает скорость, с которой функция меняет свое значение'
      },
      {
        id: 3,
        question: 'Вычисли ∫x² dx',
        options: ['x³/3 + C', 'x²/2 + C', '2x + C', 'x³ + C'],
        correct: 0,
        explanation: 'По формуле степенной функции: ∫x² dx = x³/3 + C'
      }
    ]
  });

  const handleAnswer = (optionIndex) => {
    const isCorrect = optionIndex === quiz.questions[currentQuestion].correct;
    
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: {
        selected: optionIndex,
        correct: isCorrect
      }
    });

    if (isCorrect) {
      setScore(score + 1);
    }

    // Автоматический переход к следующему вопросу
    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setQuizComplete(true);
      }
    }, 800);
  };

  if (quizComplete) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Тест завершен! 🎉</h2>
        <div className="text-6xl font-bold mb-4 text-blue-500">{percentage}%</div>
        <p className="text-2xl mb-6">Правильно: {score} из {quiz.questions.length}</p>
        
        <div className="mb-8 text-left bg-gray-50 p-6 rounded">
          <h3 className="font-bold mb-4">Результаты по вопросам:</h3>
          {quiz.questions.map((q, idx) => (
            <div key={idx} className="mb-4 pb-4 border-b">
              <div className="flex items-center">
                <span className={selectedAnswers[idx]?.correct ? '✅' : '❌'} />
                <span className="ml-2 font-semibold">{q.question}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">📖 {q.explanation}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-green-100 p-4 rounded">
            <p className="text-sm text-gray-600">Правильные ответы</p>
            <p className="text-2xl font-bold text-green-600">{score}</p>
          </div>
          <div className="bg-red-100 p-4 rounded">
            <p className="text-sm text-gray-600">Неправильные ответы</p>
            <p className="text-2xl font-bold text-red-600">{quiz.questions.length - score}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded">
            <p className="text-sm text-gray-600">Успех</p>
            <p className="text-2xl font-bold text-blue-600">{percentage}%</p>
          </div>
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
        >
          Попробовать еще раз
        </button>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const userAnswer = selectedAnswers[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Вопрос {currentQuestion + 1} из {quiz.questions.length}
          </span>
          <span className="text-sm font-semibold text-blue-600">{Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{question.question}</h2>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {question.options.map((option, idx) => {
          const isSelected = userAnswer?.selected === idx;
          const isCorrect = idx === question.correct;
          let bgColor = 'bg-gray-50 hover:bg-gray-100';
          
          if (userAnswer) {
            if (isSelected && userAnswer.correct) {
              bgColor = 'bg-green-100 border-green-500';
            } else if (isSelected && !userAnswer.correct) {
              bgColor = 'bg-red-100 border-red-500';
            } else if (isCorrect && !userAnswer.correct) {
              bgColor = 'bg-green-100 border-green-500';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => !userAnswer && handleAnswer(idx)}
              disabled={!!userAnswer}
              className={`w-full p-4 border-2 border-gray-200 rounded-lg text-left transition ${bgColor} ${
                userAnswer ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">
                  {userAnswer && isCorrect && '✅'}
                  {userAnswer && isSelected && !userAnswer.correct && '❌'}
                  {!userAnswer && '◉'}
                </span>
                <span className="font-medium text-gray-800">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {userAnswer && (
        <div className={`p-4 rounded-lg ${userAnswer.correct ? 'bg-green-50' : 'bg-blue-50'}`}>
          <p className="font-semibold mb-2">
            {userAnswer.correct ? '✅ Правильно!' : '📚 Объяснение'}
          </p>
          <p className="text-gray-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default QuizInterface;

// ============================================
// components/Navigation.jsx
import React from 'react';

function Navigation({ currentPage, setCurrentPage, user }) {
  return (
    <nav className="bg-slate-800 border-b border-slate-700 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">📚</span>
          <h1 className="text-white text-xl font-bold">Learning Dashboard</h1>
        </div>

        <ul className="flex space-x-6 text-gray-300">
          <li>
            <button 
              onClick={() => setCurrentPage('dashboard')}
              className={`px-3 py-2 rounded transition ${
                currentPage === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:text-white'
              }`}
            >
              📊 Dashboard
            </button>
          </li>
          <li>
            <button 
              onClick={() => setCurrentPage('progress')}
              className={`px-3 py-2 rounded transition ${
                currentPage === 'progress' ? 'bg-blue-600 text-white' : 'hover:text-white'
              }`}
            >
              📈 Прогресс
            </button>
          </li>
          <li>
            <button 
              onClick={() => setCurrentPage('quiz')}
              className={`px-3 py-2 rounded transition ${
                currentPage === 'quiz' ? 'bg-blue-600 text-white' : 'hover:text-white'
              }`}
            >
              ✏️ Квиз
            </button>
          </li>
        </ul>

        <div className="text-white">
          <span>👤 {user?.name || 'Гость'}</span>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;

// ============================================
// components/StudentProgress.jsx
import React, { useState } from 'react';

function StudentProgress({ user }) {
  const [progressData] = useState([
    { subject: 'Математика', completed: 28, total: 40, percentage: 70 },
    { subject: 'Физика', completed: 35, total: 40, percentage: 87 },
    { subject: 'Химия', completed: 22, total: 40, percentage: 55 },
    { subject: 'Биология', completed: 31, total: 40, percentage: 77 },
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-8">Мой Прогресс</h1>
      
      {progressData.map((item, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-gray-800">{item.subject}</h3>
            <span className="text-2xl font-bold text-blue-600">{item.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${item.percentage}%` }}
            />
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Завершено: <strong>{item.completed}</strong> из <strong>{item.total}</strong> уроков
          </div>
        </div>
      ))}
    </div>
  );
}

export default StudentProgress;