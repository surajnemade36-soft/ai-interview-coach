export const saveInterview = (report) => {
  const history =
    JSON.parse(localStorage.getItem("history")) || [];

  history.unshift({
    date: new Date().toLocaleString(),
    report,
  });

  localStorage.setItem("history", JSON.stringify(history));
};

export const getHistory = () => {
  return JSON.parse(localStorage.getItem("history")) || [];
};

export const deleteInterview = (index) => {
  const history =
    JSON.parse(localStorage.getItem("history")) || [];

  history.splice(index, 1);

  localStorage.setItem("history", JSON.stringify(history));
};

export const clearHistory = () => {
  localStorage.removeItem("history");
};