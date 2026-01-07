export type DateFilter =
  | 'today'
  | 'tomorrow'
  | 'week'
  | 'month'
  | 'all'
  | 'calendar';

export function getDateFilterRange(filter: DateFilter, date?: string) {
  const now = new Date();

  switch (filter) {
    case 'calendar': {
      if (!date) {
        throw new Error('Date is required for calendar filter');
      }

      const selected = new Date(date);

      if (isNaN(selected.getTime())) {
        throw new Error('Invalid date format');
      }

      const start = new Date(selected);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      return { start, end };
    }
    case 'today': {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      return { start, end };
    }
    case 'tomorrow': {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() + 1);

      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      return { start, end };
    }
    case 'week': {
      const day = now.getDay() || 7;
      const start = new Date(now);
      start.setDate(now.getDate() - day + 1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      return { start, end };
    }
    case 'month': {
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      };
    }
    default:
      throw new Error(`Unsupported date filter: ${filter}`);
  }
}
