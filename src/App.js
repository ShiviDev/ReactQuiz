import { useEffect, useReducer } from "react";
import Header from "./components/Header.js";
import Main from "./components/Main.js";
import NextButton from "./components/NextButton.js"
import Loader from "./components/Loader.js"
import FinishScreen from "./components/FinishScreen.js"
import Error from "./components/Error.js"
import StartScreen from "./components/StartScreen.js"
import Question from "./components/Question.js";
import Progress from "./components/Progress.js";
import Footer from "./components/Footer.js";
import Timer from "./components/Timer.js";
const initialState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null
}

const SECS_PER_QUESTION = 30

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state, questions: action.payload,
        status: "ready"
      }
    case 'dataFailed':
      return {
        ...state, status: 'error'
      }
    case 'start':
      return { ...state, status: 'active', secondsRemaining: state.questions.length * SECS_PER_QUESTION }
    case "newAnswer":
      const question = state.questions.at(state.index)
      return {
        ...state, answer: action.payload,
        points: action.payload === question.correctOption ? state.points + question.points : state.points,
      }
    case 'nextQuestion':
      return { ...state, index: state.index + 1, answer: null }
    case 'finish':
      return { ...state, status: "finished", highscore: state.points > state.highscore ? state.points : state.highscore }
    case 'restart':
      return {
        ...state, index: 0, answer: null,
        points: 0, status: "ready"
      }
    case 'tick':
      return {
        ...state, secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      }
    default:
      throw new Error("Action unknown")
  }
}
function App() {
  const [{ questions, status, index, answer, points, highscore, secondsRemaining }, dispatch] = useReducer(reducer, initialState)

  const numQuestions = questions.length
  const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0)
  useEffect(function () {
    fetch('http://localhost:9000/questions')
      .then((res) => res.json())
      .then(data => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: 'dataFailed' }))
  }, [])

  return (
    <div className="app">
      <Header />
      <Main >
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (<StartScreen numQuestions={numQuestions} dispatch={dispatch} />)}
        {status === "active" &&
          <>
            <Progress index={index} numQuestions={numQuestions} points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer} />
            <Question question={questions[index]} dispatch={dispatch}
              answer={answer} />
            <Footer>
              <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
              <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions} />
            </Footer>
          </>}
        {status === 'finished' && <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} highscore={highscore} dispatch={dispatch} />}

      </Main>
    </div>
  );
}

export default App;
