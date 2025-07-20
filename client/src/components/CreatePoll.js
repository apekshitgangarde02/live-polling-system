import React, { useState } from 'react';
import styled from 'styled-components';
import socketService from '../services/socketService';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OptionInput = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const OptionField = styled(Input)`
  flex: 1;
`;

const RemoveButton = styled.button`
  background: #e74c3c;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: #c0392b;
  }
`;

const AddButton = styled.button`
  background: #27ae60;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
  align-self: flex-start;

  &:hover {
    background: #229954;
    transform: translateY(-2px);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 10px;
`;

const TimeInput = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const TimeField = styled(Input)`
  width: 100px;
  text-align: center;
`;

function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [maxTime, setMaxTime] = useState(60);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    const validOptions = options.filter(option => option.trim());
    if (validOptions.length < 2) {
      setError('Please provide at least 2 options');
      return;
    }

    if (maxTime < 10 || maxTime > 300) {
      setError('Time must be between 10 and 300 seconds');
      return;
    }

    setIsSubmitting(true);

    try {
      socketService.createPoll({
        question: question.trim(),
        options: validOptions,
        maxTime
      });

      // Reset form
      setQuestion('');
      setOptions(['', '']);
      setMaxTime(60);
    } catch (err) {
      setError('Failed to create poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Label htmlFor="question">Question</Label>
        <TextArea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question here..."
          maxLength={200}
        />
      </InputGroup>

      <InputGroup>
        <Label>Options</Label>
        <OptionsContainer>
          {options.map((option, index) => (
            <OptionInput key={index}>
              <OptionField
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                maxLength={100}
              />
              {options.length > 2 && (
                <RemoveButton
                  type="button"
                  onClick={() => removeOption(index)}
                >
                  ✕
                </RemoveButton>
              )}
            </OptionInput>
          ))}
        </OptionsContainer>
        {options.length < 6 && (
          <AddButton type="button" onClick={addOption}>
            + Add Option
          </AddButton>
        )}
      </InputGroup>

      <InputGroup>
        <Label>Time Limit (seconds)</Label>
        <TimeInput>
          <TimeField
            type="number"
            value={maxTime}
            onChange={(e) => setMaxTime(parseInt(e.target.value) || 60)}
            min="10"
            max="300"
          />
          <span style={{ color: '#666', fontSize: '0.9rem' }}>
            (10-300 seconds)
          </span>
        </TimeInput>
      </InputGroup>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <SubmitButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating Poll...' : 'Create Poll'}
      </SubmitButton>
    </Form>
  );
}

export default CreatePoll; 