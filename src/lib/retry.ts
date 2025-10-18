/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    backoff?: number;
    onRetry?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> {
  const {
    retries = 3,
    delay = 1000,
    backoff = 2,
    onRetry,
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < retries) {
        const waitTime = delay * Math.pow(backoff, attempt);
        
        if (onRetry) {
          onRetry(lastError, attempt + 1);
        }
        
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError!;
}

/**
 * Retry with condition check
 */
export async function retryWithCondition<T>(
  fn: () => Promise<T>,
  shouldRetry: (error: Error) => boolean,
  options: {
    retries?: number;
    delay?: number;
    onRetry?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> {
  const { retries = 3, delay = 1000, onRetry } = options;
  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < retries && shouldRetry(lastError)) {
        if (onRetry) {
          onRetry(lastError, attempt + 1);
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw lastError;
      }
    }
  }

  throw lastError!;
}
