export const timeClass = (quakes, feedIndex, index) => {
  if (index !== -1) {
    const calcTime = new Date().getTime() - quakes[feedIndex][index].time;
    const hour = 3600000; // (1 Hour)
    const day = 86400000; // (1 Day)
    const week = 604800000; // (1 Week)
    const month = 2629746000; // (1 Month)

    let className = "";

    if (calcTime > week) {
      className = "month triangle";
    } else if (calcTime < month && calcTime > day) {
      className = "week triangle";
    } else if (calcTime < week && calcTime > hour) {
      className = "day triangle";
    } else {
      className = "hour triangle";
    }

    return className;
  }
  return "";
};

export const formattedQuakeCount = (quakes, feedIndex) => {
  if (quakes) {
    const count = quakes[feedIndex].length;
    let countArr = count.toString().split("");

    if (countArr.length >= 4) {
      // Reverse Number and Add Comma at 3rd index
      countArr.reverse();
      countArr.splice(3, 0, ",");
      countArr.reverse();
      return countArr;
    } else {
      return count;
    }
  } else {
    return 0;
  }
};
