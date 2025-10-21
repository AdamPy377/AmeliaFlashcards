import { useState, useEffect } from "react";
import "./App.css";
import { Card } from "./Types/Card";
import CardCreator from "./Components/CardCreator";
import CardList from "./Components/CardList";
import StudyView from "./Components/StudyView";

function App() {
	const [localCards, setLocalCards] = useState<Card[]>([]);
	const [isInitialized, setIsInitialized] = useState(false); // Track initialization
	const [view, setView] = useState<"create" | "list" | "study">("list");

	// Initial load of cards from localStorage
	useEffect(() => {
		const saved = localStorage.getItem("cards");
		console.log("Raw localStorage data:", saved);
		console.log("JSON stringified saved:", JSON.stringify(saved));
		if (saved) {
			try {
				const parsedCards = JSON.parse(saved);
				console.log("Parsed cards:", parsedCards);
				if (Array.isArray(parsedCards)) {
					// Validate card structure
					const validCards = parsedCards.filter(
						(card) =>
							card &&
							typeof card.id === "number" &&
							typeof card.front === "string" &&
							typeof card.back === "string" &&
							(typeof card.explanation === "string" ||
								card.explanation === undefined)
					);
					console.log("Valid cards:", validCards);
					setLocalCards(validCards);
				} else {
					console.error("Parsed data is not an array:", parsedCards);
				}
			} catch (error) {
				console.error("Error parsing localStorage cards:", error);
			}
		}
		setIsInitialized(true); // Mark initialization complete
	}, []);

	// Update localStorage when localCards changes, after initialization
	useEffect(() => {
		if (isInitialized) {
			console.log("Saving to localStorage:", localCards);
			localStorage.setItem("cards", JSON.stringify(localCards));
		} else {
			console.log("Skipping save to localStorage: not initialized yet");
		}
	}, [localCards, isInitialized]);

	// Log current state for debugging
	console.log("Current localCards in render:", localCards);

	return (
		<div className="App">
			<h1>Flashcards for My Love</h1>
			<nav>
				<button onClick={() => setView("list")}>My Cards</button>
				<button onClick={() => setView("create")}>Create Card</button>
				<button onClick={() => setView("study")}>Study</button>
			</nav>

			{view === "create" && <CardCreator setLocalCards={setLocalCards} />}
			{view === "list" && (
				<CardList
					localCards={localCards}
					setLocalCards={setLocalCards}
				/>
			)}
			{view === "study" && <StudyView localCards={localCards} />}
		</div>
	);
}

export default App;
