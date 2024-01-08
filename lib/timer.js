let timer;

export const stopTimer = () => clearInterval(timer);


export const getTimer = (end, setTimer, setWinners) => {
  timer = setInterval(function() {
    timeBetweenDates(new Date(end), setTimer, setWinners);

  }, 1000);
}

const timeBetweenDates = (toDate, setTimer, setWinners) => {
  var dateEntered = toDate;
  var now = new Date();
  var difference = dateEntered.getTime() - now.getTime();

  if (difference <= 0) {
    clearInterval(timer);
    setWinners();
  } else {
    
    var seconds = Math.floor(difference / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);

    hours %= 24;
    minutes %= 60;
    seconds %= 60;

    setTimer({
      days, hours, minutes, seconds
    });

  }
}

export const toEnd = end => {
  const now = new Date();
  const difference = new Date(end).getTime() - now.getTime();

  if (difference <= 0) return false;
  else {
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    hours %= 24;
    minutes %= 60;
    seconds %= 60;

    return { days, hours, minutes, seconds };
  }
}