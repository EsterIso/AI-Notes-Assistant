import { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import '../../styles/Dashboard.css';

const Flashcard = ({ cards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

    if (!cards || cards.length === 0) {
        return <p>No flashcards available.</p>;
    }

    const currentCard = cards[currentIndex];

    const handleNext = () => {
        setFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    };

    const handlePrev = () => {
        setFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    const handleFlip = () => {
        setFlipped((prev) => !prev);
    };

    return (
        <div className="flashcard-container">
            <div className="flashcard">
                <div className={`card ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
                    <div className="card-front">
                        <p>{currentCard.question}</p>
                    </div>
                    <div className="card-back">
                        <p>{currentCard.answer}</p>
                    </div>
                </div>
            </div>

            <div className="flashcard-controls">
                <button onClick={handlePrev} className="control-btn">
                    <ArrowLeft /> Prev
                </button>
                <button onClick={handleFlip} className="control-btn">
                    <RotateCcw /> Flip
                </button>
                <button onClick={handleNext} className="control-btn">
                    Next <ArrowRight />
                </button>
            </div>

            <p className="flashcard-counter">
                {currentIndex + 1} / {cards.length}
            </p>
        </div>
    );
};

export default Flashcard;
