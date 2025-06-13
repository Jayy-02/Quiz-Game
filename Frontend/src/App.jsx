import React, { useState,useEffect } from 'react'
import './index.css'
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
  const [trigger, setTrigger] = useState(0)


  useEffect(() => {
    const fetchQuestions = async() => {
    setLoading(true)
      try {
        const response = await fetch('https://the-trivia-api.com/v2/questions/')
        if (!response.ok) {
          throw new Error(`Error status: ${response.status}`)
        }
        const data = await response.json()
        const convertQuestions = data.map(apiQuestion => {
          let options = [...apiQuestion.incorrectAnswers, apiQuestion.correctAnswer]
          options.sort(() => Math.random() - 0.5)
          
          return {
            id: apiQuestion.id,
            questionText: apiQuestion.question.text,
            options: options,
            correctAnswer: apiQuestion.correctAnswer
          }
        })
        console.log("Converted questions")
        setQuestions(convertQuestions)
        setIndex(0)
        setScore(0)

      } catch (err) {
        console.error("Error fetching questions",err)
        setError("Failed to load questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions()
  },[trigger])

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

    setTimeout(() => {
    setProcessing(true)
      
      setTimeout(() => {
      setFeedback(null)
      setSelectedOption(null)
      setProcessing(false)
      setIndex(prevIndex => prevIndex + 1)
    },FEEDBACK_DURATION)
    })
    
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
      <AnswerCheck
        question={currentQuestion}
        handleSelection={handleSelection}
        feedback={feedback}
        selectedOption={selectedOption}
        correctAnswer ={currentQuestion.correctAnswer}
      />
    )
  }

  const loadNewQuiz = () => {
    setTrigger(prev=>prev+1)
  }
  const reloadQuiz = () => {
    setIndex(0)
    setScore(0)
  }


  const Spinner = () => {
    return (
      <>
        <div>
          <div>
            <a>Loading Questions ...</a>
          </div>
        </div>
      </>
    )
  }
  const Question = ({ question, selectOption, feedback, selectedOption, correctAnswer }) => {
    return (
      <>
        <div>
          <h3 className = " animate">Question {questionIndex + 1 }</h3>
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
    let classyButton = "classyButton"
    if (disabled && !isSelected && !showCorrectAnswer) {
      classyButton += " option-disabled"
    } else
      if (isCorrect) {
      classyButton += " option-correct" + " animate"
    }else if (isIncorrect) {
      classyButton += " option-incorrect"
    } else if (showCorrectAnswer) {
      classyButton += " show-correct"
    }else{
      classyButton
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
          <p>Your Score: <span class="score">{score}</span> of <span>{totalQuestions}</span></p>
          <button name = "restart" onClick={loadNewQuiz}>Play Again</button>
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
      <div class="navbar">
        <div class="head">
          <h2>Quiz Game</h2>
        </div>
        <div>
          <button name = "restart" onClick={reloadQuiz}>Restart</button>
        </div>
        </div>
      <div class="game-box">
        <div>
          {loadQuizGame()}
     </div>
      </div>
    </>
  )
}

export default App
