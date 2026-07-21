import logging

logger = logging.getLogger("worker.operations")

def execute_operation(operation_type: str, input_text: str) -> str:
    """
    Executes specified text processing operation.
    Supported types: uppercase, lowercase, reverse, word_count.
    """
    logger.info(f"Executing operation '{operation_type}' on text of length {len(input_text)}")
    
    if operation_type == "uppercase":
        return input_text.upper()
    elif operation_type == "lowercase":
        return input_text.lower()
    elif operation_type == "reverse":
        return input_text[::-1]
    elif operation_type == "word_count":
        words = input_text.split()
        char_count = len(input_text)
        word_count = len(words)
        return f"Word Count: {word_count} | Character Count: {char_count} | Lines: {len(input_text.splitlines())}"
    else:
        raise ValueError(f"Unsupported operation type: '{operation_type}'")
