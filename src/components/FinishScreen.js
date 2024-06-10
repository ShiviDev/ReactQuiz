import RestartButton from "./RestartButton";

function FinishScreen({ points, maxPossiblePoints, highscore, dispatch }) {
    const percentage = (points / maxPossiblePoints) * 100;
    let emoji;
    if (percentage === 100) emoji = '🏆'
    if (percentage >= 80 && percentage < 100) emoji = "🥇"
    if (percentage >= 50 && percentage < 80) emoji = "👍"
    if (percentage >= 0 && percentage < 50) emoji = "🤦‍♀️"
    return <>
        <div className="result">
            <span>{emoji}</span> You scored <strong>{points}</strong> out of {maxPossiblePoints}({Math.ceil(percentage)}%)
        </div>
        <p className="highscore">(Highscore: {highscore} points) </p>
        <RestartButton dispatch={dispatch} />
    </>
}
export default FinishScreen