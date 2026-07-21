export const executeTextOperation = (operationType: string, inputText: string): string => {
  switch (operationType) {
    case 'uppercase':
      return inputText.toUpperCase();
    case 'lowercase':
      return inputText.toLowerCase();
    case 'reverse':
      return inputText.split('').reverse().join('');
    case 'word_count': {
      const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
      const chars = inputText.length;
      const lines = inputText.split(/\r\n|\r|\n/).length;
      return `Word Count: ${words} | Character Count: ${chars} | Lines: ${lines}`;
    }
    default:
      throw new Error(`Unsupported operation type: ${operationType}`);
  }
};
