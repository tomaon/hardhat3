const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export const formatDateTime = dateTimeFormatter.format;

const numberFormatter = new Intl.NumberFormat();

export const formatNumber = numberFormatter.format;
