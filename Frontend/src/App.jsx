import React, { useState,useEffect } from 'react'

import './App.css'

function App() {
  const [questions, setQuestions] = useState([])
  const [questionIndex, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const handleSelection = (selectedOption) => {
    console.log("Selected", selectedOption)
    const currentQuestion = questions[questionIndex]
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore+1)
    }
  }

  const loadQuizGame = () => {
    if (loading) {
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
      <AnswerCheck question={currentQuestion}
      handleSelection={handleSelection}/>
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
  const Question = ({ question, selectOption }) => {
    return (
      <>
        <div>
          <h3>Question</h3>
          <p>{question.questionText}</p>
          <div>
            {question.options.map((option, index) => (
          <AnswerOption key={index} optionText={option} onClick={() => selectOption(option)} />
        ))}
          </div>
        </div>
      </>
    )
  }
  const AnswerOption = ({ optionText, onClick }) => {
    return (
      <>
        <button onClick={onClick}>{optionText }</button>
      </>
    )
  }
 
  const AnswerCheck = ({question, handleSelection}) => {
    return (
      <>
        <div>
          <Question question ={question} selectOption={handleSelection} />
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
