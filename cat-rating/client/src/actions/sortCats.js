// Methods in this file modifies the Queue component state

const log = console.log;

export const sortCards = (inputArr) => { 
  log(inputArr)
  var sortedArr = [];
  var length10Arr = [];
  var min=inputArr[0];
  var currPos = 0;
  var max=inputArr[0];
  for (i=0; i<inputArr.length; i++)
  {
    if (max.likes<inputArr[i].likes) max=inputArr[i];

  }

  for (var i=0;i<inputArr.length;i++)
  {
    for (var j=0;j<inputArr.length;j++)
    {
      if (inputArr[j].likes != -1)
      {
        if (min.likes < inputArr[j].likes) 
        {
            min=inputArr[j];
            currPos=j;
        }
      }
    }
    sortedArr[i]=JSON.parse(JSON.stringify(min));
    inputArr[currPos].likes = -1;
    min=max;
  } 
  if (sortedArr.length < 10){
    length10Arr = sortedArr
  } else {
    length10Arr = sortedArr.slice(0, 10);
  }
  return length10Arr;
};


export const sortReportedCats = (inputArr) => { 
  log(inputArr)
  var sortedArr = [];
  var min=inputArr[0];
  var currPos = 0;
  var max=inputArr[0];
  for (i=0; i<inputArr.length; i++)
  {
    if (max.reports<inputArr[i].reports) max=inputArr[i];

  }

  for (var i=0;i<inputArr.length;i++)
  {
    for (var j=0;j<inputArr.length;j++)
    {
      if (inputArr[j].reports != -1)
      {
        if (min.reports < inputArr[j].reports) 
        {
            min=inputArr[j];
            currPos=j;
        }
      }
    }
    sortedArr[i]=JSON.parse(JSON.stringify(min));
    inputArr[currPos].reports = -1;
    min=max;
  } 
  log(sortedArr)
  return  sortedArr;
};


export const sortReportedUsers = (inputArr) => { 
  log(inputArr)
  var sortedArr = [];
  var min=inputArr[0];
  var currPos = 0;
  var max=inputArr[0];
  for (i=0; i<inputArr.length; i++)
  {
    if (max.totalReport<inputArr[i].totalReport) max=inputArr[i];

  }

  for (var i=0;i<inputArr.length;i++)
  {
    for (var j=0;j<inputArr.length;j++)
    {
      if (inputArr[j].totalReport != -1)
      {
        if (min.totalReport < inputArr[j].totalReport) 
        {
            min=inputArr[j];
            currPos=j;
        }
      }
    }
    sortedArr[i]=JSON.parse(JSON.stringify(min));
    inputArr[currPos].totalReport = -1;
    min=max;
  } 

  return sortedArr;
};
