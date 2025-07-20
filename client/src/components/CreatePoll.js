import React, { useState } from 'react';
import styled from 'styled-components';
import socketService from '../services/socketService';

const CreatePollContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const QuestionInput = styled.textarea`
  width: 100%;
  border: none;
  border-bottom: 2px solid #e1e5e9;
  padding: 10px 0;
  font-size: 1.2rem;
  font-weight: 500;
  resize: none;

  &:focus {
    border-bottom-color: #667eea;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const OptionInput = styled.input`
  flex-grow: 1;
  background: #f8f9fa;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 1rem;
`;

const CorrectAnswerSelector = styled.div`
  display: flex;
  gap: 10px;

  label {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
  }
`;

const AddOptionButton = styled.button`
  color: #667eea;
  font-weight: 600;
  align-self: flex-start;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
`;

const AskQuestionButton = styled.button`
  background: #667eea;
  color: white;
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
`;

function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socketService.createPoll({ question, options, correctAnswer, maxTime: 60 });
  };

  return (
    <CreatePollContainer>
      <Form onSubmit={handleSubmit}>
        <QuestionInput
          placeholder="Enter your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <OptionsContainer>
          {options.map((option, index) => (
            <OptionRow key={index}>
              <OptionInput
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
              <CorrectAnswerSelector>
                <span>Is it Correct?</span>
                <label>
                  <input
                    type="radio"
                    name={`correct-answer`}
                    checked={correctAnswer === index}
                    onChange={() => setCorrectAnswer(index)}
                  />
                  Yes
                </label>
              </CorrectAnswerSelector>
            </OptionRow>
          ))}
        </OptionsContainer>
        <AddOptionButton type="button" onClick={addOption}>
          + Add more option
        </AddOptionButton>
        <FormActions>
          <AskQuestionButton type="submit">Ask Question</AskQuestionButton>
        </FormActions>
      </Form>
    </CreatePollContainer>
  );
}

export default CreatePoll; 