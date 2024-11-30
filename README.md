# Enhanced Logger Service для NestJS

Продвинутый сервис логирования для NestJS приложений с поддержкой цветного вывода, форматирования, группировки и измерения производительности.

## 🚀 Возможности

- 🎨 Цветной вывод логов с настраиваемыми цветами
- 📊 Вывод данных в табличном формате
- 📎 Группировка связанных логов
- ⏱️ Измерение времени выполнения операций
- 🔍 Различные уровни логирования (error, warn, info, debug, trace)
- 🔒 Поддержка Singleton паттерна для глобального доступа
- 📅 Настраиваемый формат вывода даты и времени
- 🛠️ Гибкая конфигурация

## 📋 Требования

- Node.js (версия 14+)
- NestJS
- TypeScript
- tslog

## 📥 Установка

```bash
npm install tslog
# или
yarn add tslog
```

## 🔧 Использование

### Базовая инициализация

```typescript
import { LoggerService } from './logger.service';

// Создание инстанса логгера
const logger = new LoggerService('МоёПриложение', 'blue', {
  displayDateTime: true,
  minLevel: 'info'
});
```

### Простое логирование

```typescript
logger.info('Приложение запущено');
logger.warn('Внимание! Высокая загрузка CPU');
logger.error('Ошибка подключения к базе данных');
logger.debug('Детальная информация для отладки');
```

### Измерение времени выполнения

```typescript
const timer = logger.startTimer('Загрузка данных');
// Выполнение операции
await loadData();
timer(); // Выведет время выполнения
```

### Группировка логов

```typescript
logger.group('Операции с базой данных', () => {
  logger.info('Подключение к базе...');
  logger.info('Выполнение миграций...');
  logger.info('Загрузка начальных данных...');
});
```

### Вывод таблиц

```typescript
  this.logger.table(
    'Дополнительная информация',
    [
      { id: 1, name: 'John', age: 30 },
      { id: 2, name: 'Jane', age: 25 },
    ],
    {
      title: 'Список пользователей',
      columns: ['name', 'age'],
    },
  );
```

### Использование как глобального логгера

```typescript
const globalLogger = LoggerService.getInstance('GlobalLogger');
```

## ⚙️ Конфигурация

При создании логгера можно указать следующие параметры:

```typescript
const logger = new LoggerService(
  'AppName', // Имя логгера
  'blue',    // Цвет (blue | green | yellow | red | magenta | cyan)
  {
    minLevel: 'debug',           // Минимальный уровень логирования
    displayDateTime: true,       // Отображение даты/времени
    displayFunctionName: true    // Отображение имени функции
  }
);
```

## 🎨 Доступные цвета

- blue (синий)
- green (зеленый)
- yellow (желтый)
- red (красный)
- magenta (пурпурный)
- cyan (голубой)

## 📊 Уровни логирования

1. error - Критические ошибки
2. warn - Предупреждения
3. info - Информационные сообщения
4. debug - Отладочная информация
5. trace - Детальная трассировка

## 🤝 Contribution

Мы приветствуем ваш вклад в развитие проекта! Пожалуйста, создавайте issues и pull requests.

## 📄 Лицензия

MIT License - используйте свободно для личных и коммерческих проектов.

---
