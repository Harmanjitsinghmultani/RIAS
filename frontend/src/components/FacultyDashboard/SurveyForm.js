import React, { useState } from 'react';
import axios from 'axios';
import './css/SurveyForm.css'; // Adjust the path if needed

const SurveyForm = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ questionText: '', options: [] }]);

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index][event.target.name] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push('');
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/surveys/create', { title, questions });
      alert('Survey created successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to create survey');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="surveyDashboard">
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Survey Title" 
        required 
      />
      {questions.map((question, index) => (
        <div key={index}>
          <input 
            type="text" 
            name="questionText" 
            value={question.questionText} 
            onChange={(e) => handleQuestionChange(index, e)} 
            placeholder="Question" 
            required 
          />
          {question.options.map((option, i) => (
            <input 
              key={i} 
              type="text" 
              value={option} 
              onChange={(e) => {
                const newQuestions = [...questions];
                newQuestions[index].options[i] = e.target.value;
                setQuestions(newQuestions);
              }} 
              placeholder="Option" 
              required 
            />
          ))}
          <button 
            type="button" 
            onClick={() => handleAddOption(index)} 
          >
            Add Option
          </button>
        </div>
      ))}
      <button 
        type="submit" 
      >
        Create Survey
      </button>
    </form>
  );
};

export default SurveyForm;
