function useTimestamp(timestamp) {
  let age = "";

  const ageInSeconds = Math.round((Date.now() - Date.parse(timestamp)) / 1000);
  const ageInHours = ageInSeconds / 3600;

  if (ageInHours < 1) {
    const ageInMinutes = ageInSeconds / 60;
    if (ageInMinutes < 1) {
      age = "less than a minute";
    } else {
      age = `${Math.round(ageInMinutes)} min`;
    }
  }
  if (ageInHours >= 1 && ageInHours < 24) {
    age = `${Math.round(ageInHours)} h`;
  }
  if (ageInHours >= 24 && ageInHours < 24 * 7) {
    age = `${Math.round(ageInHours / 24)} d`;
  }
  if (ageInHours >= 24 * 7 && ageInHours < 24 * 7 * 4) {
    age = `${Math.round(ageInHours / 24 / 7)} weeks`;
  }

  if (ageInHours >= 24 * 7 * 4 && ageInHours < 24 * 365) {
    const date = new Date(ageInSeconds);
    const MONTHS = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Dec",
    ];
    age = `${date.getDate()} ${date.get} ${MONTHS[date.getMonth()]}`;
  }

  if (ageInHours >= 24 * 365) {
    age = `${ageInHours / 24 / 365} y`;
  }

  return age;
}

export default useTimestamp;
