import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

const Quiz = ({ questions = [] }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    if (!questions.length) return <p>No quiz questions available</p>;

    const handleAnswerSelect = (answerIndex) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestion]: answerIndex
        }));
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResults(true);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswers({});
        setShowResults(false);
    };

    const calculateScore = () => {
        let correct = 0;
        questions.forEach((question, index) => {
            const correctAnswerIndex = parseInt(question.answer);
            if (selectedAnswers[index] === correctAnswerIndex) {
                correct++;
            }
        });
        return {
            correct,
            total: questions.length,
            percentage: Math.round((correct / questions.length) * 100)
        };
    };

    const renderResults = () => {
        const score = calculateScore();
        
        return (
            <div className="quiz-results">
                <h3>Quiz Results</h3>
                <div className="score-summary">
                    <p><strong>Score: {score.correct}/{score.total} ({score.percentage}%)</strong></p>
                </div>
                
                <div className="answer-review">
                    {questions.map((question, qIndex) => {
                        const userAnswer = selectedAnswers[qIndex];
                        const correctAnswer = parseInt(question.answer);
                        const isCorrect = userAnswer === correctAnswer;
                        
                        return (
                            <div key={qIndex} className="question-review">
                                <p><strong>{qIndex + 1}. {question.question}</strong></p>
                                <ul>
                                    {question.choices.map((choice, cIndex) => {
                                        let className = '';
                                        
                                        if (cIndex === correctAnswer) {
                                            className = 'correct-answer';
                                        } else if (cIndex === userAnswer && !isCorrect) {
                                            className = 'wrong-answer';
                                        }
                                        
                                        return (
                                            <li key={cIndex} className={className}>
                                                {String.fromCharCode(65 + cIndex)}. {choice}
                                                {cIndex === correctAnswer ? ' ✓' : ''}
                                                {(cIndex === userAnswer && cIndex !== correctAnswer) ? ' ✗' : ''}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </div>
                
                <button onClick={resetQuiz} className="action-button">
                    <RotateCcw size={16} /> Retake Quiz
                </button>
            </div>
        );
    };

    if (showResults) {
        return renderResults();
    }

    const question = questions[currentQuestion];
    const selectedAnswer = selectedAnswers[currentQuestion];

    return (
        <div className="quiz-container">
            <div className="quiz-progress">
                <p>Question {currentQuestion + 1} of {questions.length}</p>
                <div className="progress-bar">
                    <div 
                        className="progress-fill" 
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="quiz-question">
                <h3>{question.question}</h3>
                <div className="quiz-choices">
                    {question.choices.map((choice, index) => (
                        <button
                            key={index}
                            className={`choice-button ${selectedAnswer === index ? 'selected' : ''}`}
                            onClick={() => handleAnswerSelect(index)}
                        >
                            {String.fromCharCode(65 + index)}. {choice}
                        </button>
                    ))}
                </div>
            </div>

            <div className="quiz-navigation">
                <button 
                    onClick={nextQuestion}
                    disabled={selectedAnswer === undefined}
                    className="action-button"
                >
                    {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
            </div>
        </div>
    );
};

export default Quiz;