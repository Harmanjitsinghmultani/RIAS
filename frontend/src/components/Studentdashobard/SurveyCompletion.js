// src/components/Student/SurveyCompletion.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SurveyCompletion = ({ match }) => {
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    axios.get(`/api/surveys/${match.params.id}`).then(response => setSurvey(response.data));
  }, [match.params.id]);

  const handleResponseChange = (questionId, answer) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitSurvey = () => {
    axios.post(`/api/surveys/${match.params.id}/submit`, { responses }).then(response => {
      // Handle success
    }).catch(error => {
      // Handle error
    });
  };

  if (!survey) return <div>Loading...</div>;

  return (
    <div>
      <h1>{survey.title}</h1>
      {survey.questions.map((q, index) => (
        <div key={index}>
          <h3>{q.question}</h3>
          {q.options.map((option, idx) => (
            <div key={idx}>
              <input
                type="radio"
                name={`question_${index}`}
                value={option}
                onChange={() => handleResponseChange(q._id, option)}
              />
              {option}
            </div>
          ))}
        </div>
      ))}
      <button onClick={submitSurvey}>Submit</button>
    </div>
  );
};

export default SurveyCompletion;
