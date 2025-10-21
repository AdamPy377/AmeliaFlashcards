import { useRef, useState } from "react";
import { Card } from "../Types/Card";
import { formatBoldText, cleanText } from "../utils/formatText";

interface StudyViewProps {
	localCards: Card[];
}

export default function StudyView({ localCards }: StudyViewProps) {
	const [index, setIndex] = useState(0);
	const [showBack, setShowBack] = useState(false);
	const [showExplanation, setShowExplanation] = useState(false);
	const [answer, setAnswer] = useState("");
	const [correctAnswer, setCorrectAnswer] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			// Handle answer submission
			if (showBack) {
				setAnswer("");
				setShowBack(false);
				setShowExplanation(false);
				setIndex((i) => (i + 1) % localCards.length);
			} else {
				setAnswer((e.target as HTMLInputElement).value);
				setShowBack(true);
				(e.target as HTMLInputElement).value === cleanText(current.back)
					? setCorrectAnswer(true)
					: setCorrectAnswer(false);
			}
		}
	};

	if (localCards.length === 0)
		return (
			<p>No cards available to study. Please create some cards first!</p>
		);

	const current = localCards[index];

	return (
		<div>
			<h2>Study Flashcards</h2>
			{showBack && !correctAnswer && (
				<div>
					<div
						className="studyCard"
						dangerouslySetInnerHTML={{
							__html: formatBoldText(answer),
						}}
					/>
					<div
						style={{
							fontWeight: "bold",
							fontSize: "30px",
						}}
					>
						↓
					</div>
				</div>
			)}
			<div className="studyCard">
				{showBack ? (
					<div
						dangerouslySetInnerHTML={{
							__html: formatBoldText(current.back),
						}}
					/>
				) : current.frontImage ? (
					<img
						src={current.frontImage}
						alt="Front Preview"
						width={200}
					/>
				) : (
					<div
						dangerouslySetInnerHTML={{
							__html: formatBoldText(current.front),
						}}
					/>
				)}
			</div>
			{/* {!current.frontImage && (
				<div
					className="studyCard"
					dangerouslySetInnerHTML={{
						__html: formatBoldText(
							showBack ? current.back : current.front
						),
					}}
				/>
			)} */}
			{
				<input
					type="text"
					id="answer"
					className={`answerInput ${showBack ? "readonly" : ""}`}
					autoFocus
					onKeyDown={handleKeyDown}
					readOnly={showBack}
					ref={inputRef}
					value={answer}
					onChange={(e) => setAnswer(e.target.value)}
					placeholder="Answer"
				/>
			}

			{showBack && current.explanation && (
				<div className="explanationSection">
					<button
						onClick={() => {
							setShowExplanation((prev) => !prev);
							inputRef.current?.focus();
						}}
						className="explanationBtn"
					>
						{showExplanation
							? "Hide Explanation"
							: "Show Explanation"}
					</button>

					{showExplanation && (
						<div
							className="studyCard"
							dangerouslySetInnerHTML={{
								__html: formatBoldText(
									current.explanation || ""
								),
							}}
						/>
					)}
				</div>
			)}

			{/* {false && (
				<div>
					<button
						onClick={() => {
							setShowBack(false);
							setIndex((prev) =>
								prev === 0 ? cards.length - 1 : prev - 1
							);
						}}
					>
						Prev
					</button>
					<button
						onClick={() => {
							setShowBack(false);
							setIndex((i) => (i + 1) % cards.length);
						}}
					>
						Next
					</button>
				</div>
			)} */}
		</div>
	);
}
