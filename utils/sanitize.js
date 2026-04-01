const sanitizeText = (value) => {
    if (typeof value !== 'string') return value;
  
    return value
      .trim()
      .replace(/[<>]/g, '')
      .replace(/script/gi, '');
  };
  
  module.exports = { sanitizeText };