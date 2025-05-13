/**
 * Logger utility for consistent logging across the application
 * Automatically disables debug and info logs in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  // Whether to include timestamps in logs
  timestamps?: boolean;
  // Minimum log level to display (debug < info < warn < error)
  minLevel?: LogLevel;
}

// Map log levels to numeric values for comparison
const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private timestamps: boolean;
  private minLevel: LogLevel;
  private isProduction: boolean;

  constructor(options: LoggerOptions = {}) {
    this.timestamps = options.timestamps ?? true;
    this.minLevel = options.minLevel ?? 'debug';
    this.isProduction = process.env.NODE_ENV === 'production';
    
    // In production, default to only showing warnings and errors
    if (this.isProduction && !options.minLevel) {
      this.minLevel = 'warn';
    }
  }

  /**
   * Format a log message with optional timestamp
   */
  private format(level: LogLevel, message: string): string {
    const timestamp = this.timestamps ? `[${new Date().toISOString()}] ` : '';
    return `${timestamp}[${level.toUpperCase()}] ${message}`;
  }

  /**
   * Check if a log level should be displayed
   */
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_VALUES[level] >= LOG_LEVEL_VALUES[this.minLevel];
  }

  /**
   * Log a debug message (only in non-production)
   */
  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug') && !this.isProduction) {
      console.debug(this.format('debug', message), ...args);
    }
  }

  /**
   * Log an info message (only in non-production)
   */
  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info') && !this.isProduction) {
      console.info(this.format('info', message), ...args);
    }
  }

  /**
   * Log a warning message
   */
  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.format('warn', message), ...args);
    }
  }

  /**
   * Log an error message
   */
  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(this.format('error', message), ...args);
    }
  }
}

// Create and export a default logger instance
const logger = new Logger();

export default logger;
