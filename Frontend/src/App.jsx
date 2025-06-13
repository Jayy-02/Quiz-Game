import React, { useState,useEffect } from 'react'

import './App.css'

function App() {
  const [questions, setQuestions] = useState([])
  const [questionIndex, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const[processingAnswer, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)

  const dummyQuestions = [
    {
      id: 1,
      questionText: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correctAnswer: "Paris"
    },
    {
      id: 2,
      questionText: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      correctAnswer: "Mars"
    }
  ]

  useEffect(() => {
    setTimeout(() => {
      try {
        setQuestions(dummyQuestions);
        setLoading(false);
      } catch (err) {
        console.error(err)
        setError("Failed to load questions. Please try again later.");
        setLoading(false);
      }
    }, 1000);
  }, []);

  const handleSelection = (option) => {
    console.log("Selected", option)

    if (selectedOption !== null) return
    setSelectedOption(option)

    const currentQuestion = questions[questionIndex]

    if (option === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + 1)
      setFeedback('correct')
      console.log(`${option} is correct`)
    } else {
      setFeedback('incorrect')
      console.log(`${option} is incorrect. The correct answer is ${currentQuestion.correctAnswer}`)
    }

    const FEEDBACK_DURATION = 800
    const SPINNER_DURATION = 1500

    setTimeout(() => {
    setProcessing(true)
      
      setTimeout(() => {
      setFeedback(null)
      setSelectedOption(null)
      setProcessing(false)
      setIndex(prevIndex => prevIndex + 1)
    },FEEDBACK_DURATION)
    }, SPINNER_DURATION)
    
  }

  const loadQuizGame = () => {
    if (loading || processingAnswer) {
      return<Spinner/>
    }
    if (error) {
      return <ErrorDisplay message={error}/>
    }
    if (questionIndex >= questions.length) {
      return<ScoreScreen score={score} totalQuestions={questions.length}/>
    }
    const currentQuestion = questions[questionIndex]
    return (
      <AnswerCheck
        question={currentQuestion}
        handleSelection={handleSelection}
        feedback={feedback}
        selectedOption={selectedOption}
        correctAnswer ={currentQuestion.correctAnswer}
      />
    )
  }


  const Spinner = () => {
    return (
      <>
        <div>
          <div>
            <p>Loading Questions ...</p>
          </div>
        </div>
      </>
    )
  }
  const Question = ({ question, selectOption, feedback, selectedOption, correctAnswer }) => {
    return (
      <>
        <div>
          <h3>Question {questionIndex + 1 }</h3>
          <p>{question.questionText}</p>
          <div>
            {question.options.map((option, index) => (
              <AnswerOption
                key={index}
                optionText={option}
                onClick={() => selectOption(option)}
                isSelected={selectedOption === option}
                isCorrect={feedback === 'correct' && selectedOption === option}
                isIncorrect={feedback === 'incorrect' && selectedOption === option}
                showCorrectAnswer={feedback === 'incorrect' && selectedOption === correctAnswer}
                disabled ={feedback !==null}
              />
        ))}
          </div>
        </div>
      </>
    )
  }
  const AnswerOption = ({ optionText, onClick, isSelected, isCorrect, isIncorrect, showCorrectAnswer, disabled }) => {
    let classyButton = "w-full text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform shadow-md"
    if (disabled && !isSelected && !showCorrectAnswer) {
      classyButton += "bg-gray-300 text-gray-400 cursor-not-allowed"
    } else
      if (isCorrect) {
      classyButton+= "bg-green-500 animate-pulse"
    }else if (isIncorrect) {
      classyButton+="bg-red-500 animate-[shake_0.5s_cubic-bezier(.36,.07,.19,.97)_both;]"
    } else if (showCorrectAnswer) {
      classyButton +="bg-blue-400 border-2 border-blue-600"
    }else{
      classyButton+= "bg-blue-500 hover:bg-blue-600"
    }
    return (
      <>
        <button
          onClick={onClick}
          className={classyButton}
          disabled ={disabled}
        >
          {optionText}
        </button>
      </>
    )
  }
 
  const AnswerCheck = ({question, handleSelection, feedback, selectedOption, correctAnswer}) => {
    return (
      <>
        <div>
          <Question
            question={question}
            selectOption={handleSelection}
            feedback={feedback}
            selectedOption={selectedOption}
            correctAnswer={correctAnswer}
          />
        </div>
      </>
    )
  }
  const ScoreScreen = ({ score, totalQuestions }) => {
    return (
      <>
        <div>
          <h2>Quiz Finished!</h2>
          <p>Your Score: <span>{score}</span> of <span>{totalQuestions }</span></p>
        </div>
      </>
    )
  }

  const ErrorDisplay = ({ message }) => {
    return (
      <>
        <div>
          <p>Oops, something went wrong!</p>
          <p>{message }</p>
        </div>
      </>
    )
  }

  return (
    <>
      <div>
        <div>
          <h1>Quiz Game</h1>
          {loadQuizGame()}
        </div>
      </div>
    </>
  )
}

export default App
