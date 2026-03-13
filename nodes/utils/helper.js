const reindexId = (notes) => {
  return notes.map((note, index) => ({...note, id: index + 1}));
};

const validateInput = (input, type = 'string') => {
  if (!input || input.trim() === '') {
    return { isValid: false, message: 'Поле не может быть пустым!' };
  }
  
  if (type === 'number') {
    const num = parseInt(input);
    if (isNaN(num)) {
      return { isValid: false, message: 'Введите число!' };
    }
    return { isValid: true, value: num };
  }
  
  return { isValid: true, value: input.trim() };
};

const formatDate = (date) => {
  const options = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit' 
  };
  return new Date(date).toLocaleString('ru-RU', options);
};

module.exports = { 
  reindexId, 
  validateInput, 
  formatDate
};