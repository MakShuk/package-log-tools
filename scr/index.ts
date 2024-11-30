import { Injectable } from '@nestjs/common';
import { Logger, ILogObj } from 'tslog';

// Определяем доступные цвета для логирования
export type LogColor = 'blue' | 'green' | 'yellow' | 'red' | 'magenta' | 'cyan';
// Определяем уровни логирования
export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

@Injectable()
export class LoggerService {
  private logger: Logger<ILogObj>;
  // Singleton инстанс для глобального доступа к логгеру
  private static instance: LoggerService;

  // Карта цветов ANSI для раскраски текста в консоли
  private readonly colorMap: Record<LogColor, string> = {
    blue: '\x1b[34m', // Синий
    green: '\x1b[32m', // Зеленый
    yellow: '\x1b[33m', // Желтый
    red: '\x1b[31m', // Красный
    magenta: '\x1b[35m', // Пурпурный
    cyan: '\x1b[36m', // Голубой
  };

  // Код для сброса цвета текста
  private readonly resetColor = '\x1b[0m';
  // Цвет по умолчанию
  private readonly defaultColor: LogColor = 'yellow';

  /**
   * Конструктор сервиса логирования
   * @param name - Имя логгера, будет отображаться в каждом сообщении
   * @param color - Цвет для имени логгера
   * @param options - Дополнительные настройки логгера
   */
  constructor(
    name?: string,
    color: LogColor = 'blue',
    private readonly options: {
      minLevel?: LogLevel; // Минимальный уровень логирования
      displayDateTime?: boolean; // Показывать ли дату и время
      displayFunctionName?: boolean; // Показывать ли имя функции
    } = {},
  ) {
    this.logger = new Logger({
      hideLogPositionForProduction: true,
      prettyLogTimeZone: 'local',
      type: 'pretty',
      prettyLogTemplate: this.buildLogTemplate(),
      name: name ? `${this.colorMap[color]}[${name}]${this.resetColor}` : undefined,
    });
  }

  /**
   * Получение глобального инстанса логгера (Singleton паттерн)
   */
  public static getInstance(name?: string, color?: LogColor): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService(name, color);
    }
    return LoggerService.instance;
  }

  /**
   * Формирование шаблона для вывода логов
   * Собирает строку шаблона на основе настроек
   */
  private buildLogTemplate(): string {
    const parts = ['------------------------------------------------------------------------\n'];

    if (this.options.displayDateTime !== false) {
      parts.push('{{mm}}/{{dd}} {{hh}}:{{MM}}:{{ss}}');
    }

    parts.push('{{logLevelName}}');

    if (this.options.displayFunctionName !== false) {
      parts.push('{{name}} ');
    }

    return parts.join(' ');
  }

  /**
   * Установка префикса для сообщений логгера
   * @param prefix - Текст префикса
   * @param color - Цвет префикса
   */
  setPrefix(prefix: string, color: LogColor = this.defaultColor): void {
    this.logger.settings.prefix = [`${this.colorMap[color]}(${prefix})${this.resetColor} `];
  }

  // Методы для разных уровней логирования
  error(message: unknown, ...args: unknown[]): void {
    this.logger.error(this.formatMessage(message), ...args);
  }

  warn(message: unknown, ...args: unknown[]): void {
    this.logger.warn(this.formatMessage(message), ...args);
  }

  info(message: unknown, ...args: unknown[]): void {
    this.logger.info(this.formatMessage(message), ...args);
  }

  debug(message: unknown, ...args: unknown[]): void {
    this.logger.debug(this.formatMessage(message), ...args);
  }

  trace(message: unknown, ...args: unknown[]): void {
    this.logger.trace(this.formatMessage(message), ...args);
  }

  /**
   * Вывод данных в виде таблицы
   * @param data - Заголовок или дополнительные данные
   * @param tableData - Данные для вывода в табличном формате
   * @param options - Настройки отображения таблицы
   */
  table(
    data: unknown,
    tableData: unknown,
    options?: {
      title?: string; // Заголовок таблицы
      columns?: string[]; // Список колонок для отображения
    },
  ): void {
    if (options?.title) {
      this.info(options.title);
    }

    if (data) {
      this.info(data);
    }

    if (tableData) {
      if (options?.columns) {
        console.table(tableData, options.columns);
      } else {
        console.table(tableData);
      }
    }
  }

  /**
   * Группировка логов
   * @param label - Название группы
   * @param fn - Функция, логи которой будут сгруппированы
   */
  group(label: string, fn: () => void): void {
    console.group(label);
    try {
      fn();
    } finally {
      console.groupEnd();
    }
  }

  /**
   * Создает таймер для измерения длительности операций
   * @param label - Метка для идентификации измерения
   * @returns Функция, при вызове которой будет выведено затраченное время
   */
  startTimer(label: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.info(`${label}: ${duration.toFixed(2)}ms`);
    };
  }

  /**
   * Форматирование сообщения в зависимости от его типа
   * @param message - Сообщение для форматирования
   */
  private formatMessage(message: unknown): string {
    if (message instanceof Error) {
      return `${message.message}\n${message.stack}`;
    }

    if (typeof message === 'object') {
      return JSON.stringify(message, null, 2);
    }

    return String(message);
  }

  /**
   * Форматирование даты в читаемый вид
   * Использует Intl.DateTimeFormat для локализованного вывода
   */
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  }
}
