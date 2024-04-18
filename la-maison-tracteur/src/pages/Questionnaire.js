import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/Questionnaire.css";

export default function Questionnaire() {
  const { questionNumber } = useParams();
  const nextQuestionNumber = parseInt(questionNumber) + 1;
  const prevQuestionNumber = parseInt(questionNumber) - 1;
  const question = parseInt(questionNumber);
  const [surveyData, setSurveyData] = useState({});
  useEffect(() => {
    fetch(`http://localhost:8000/survey`)
      .then((response) => response.json())
      .then((data) => {
        const surveyData = data.surveyData;
        setSurveyData(surveyData);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données du questionnaire:",
          error
        );
      });
  }, []);

  if (question > 1 && question < 6) {
    return (
      <div className="modale-container">
        <div className="container">
          <h1>Questionnaire sur votre expérience d'achat</h1>
          <div className="question">
            <h2>Question {questionNumber}</h2>
            <span>{surveyData[questionNumber]}</span>
          </div>
          <div className="buttons">
            <Link to={`/question/${prevQuestionNumber}`}>Précédent</Link>
            <Link to={`/question/${nextQuestionNumber}`}>Suivant</Link>
          </div>
        </div>
      </div>
    );
  } else if (question === 6) {
    return (
      <div className="modale-container">
        <div className="container">
          <h1>Questionnaire sur votre expérience d'achat</h1>
          <div className="question">
            <h2>Question {questionNumber}</h2>
            <span>{surveyData[questionNumber]}</span>
          </div>
          <div className="buttons">
            <Link to={`/question/${prevQuestionNumber}`}>Précédent</Link>
            <Link to={`/`}>Retour à l'accueil</Link>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="modale-container">
        <div className="container">
          <h1>Questionnaire sur votre expérience d'achat</h1>
          <div className="question">
            <h2>Question {questionNumber}</h2>
            <span>{surveyData[questionNumber]}</span>
          </div>
          <div className="buttons">
            <Link to={`/question/${nextQuestionNumber}`}>Suivant</Link>
          </div>
        </div>
      </div>
    );
  }
}
