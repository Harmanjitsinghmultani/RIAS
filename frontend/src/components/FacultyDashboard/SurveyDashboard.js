import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SurveyDashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const result = await axios.get('http://localhost:4000/api/surveys/active');
        setSurveys(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSurveys();
  }, []);

  const handleSurveySelect = (survey) => {
    setSelectedSurvey(survey);
    setResponses(new Array(survey.questions.length).fill(''));
  };

  const handleResponseChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:4000/api/surveys/submit', { surveyId: selectedSurvey._id, responses });
      alert('Responses submitted');
    } catch (error) {
      console.error(error);
      alert('Failed to submit responses');
    }
  };

  return (
    <div>
      <h1>Active Surveys</h1>
      <ul>
        {surveys.map(survey => (
          <li key={survey._id} onClick={() => handleSurveySelect(survey)}>
            {survey.title}
          </li>
        ))}
      </ul>
      {selectedSurvey && (
        <div>
          <h2>{selectedSurvey.title}</h2>
          {selectedSurvey.questions.map((question, index) => (
            <div key={index}>
              <p>{question.questionText}</p>
              {question.options.map((option, i) => (
                <label key={i}>
                  <input
                    type="radio"
                    name={`question${index}`}
                    value={option}
                    checked={responses[index] === option}
                    onChange={(e) => handleResponseChange(index, e.target.value)}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button onClick={handleSubmit}>Submit Responses</button>
        </div>
      )}
    </div>
  );
};

export default SurveyDashboard;
