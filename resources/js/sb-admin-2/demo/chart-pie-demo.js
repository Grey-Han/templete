// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// task ranking - 1
var ctx = document.getElementById("pieChart_1");
var myPieChart = new Chart(ctx, {
  type: 'doughnut',
  borderWidth: 1,
  data: {
    labels: ["박찬호 대리", ""],
    datasets: [{
      data: [90, 10],
      backgroundColor: ['#fd9870', '#c8c8c8'],
    }],
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      enabled: false
    },
    legend: {
      display: false
    },
    cutoutPercentage: 50,
  },
});

// task ranking - 2
var ctx = document.getElementById("pieChart_2");
var myPieChart2 = new Chart(ctx, {
  type: 'doughnut',
  borderWidth: 1,
  data: {
    labels: ["서장훈 대리", ""],
    datasets: [{
      data: [70, 30],
      backgroundColor: ['#ff6fa0','#c8c8c8'],
      hoverBackgroundColor: ['#ff216d', '#c8c8c8'], 
      // hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      enabled: false
    },
    legend: {
      display: false
    },
    cutoutPercentage: 50,
  },
});

// task ranking - 3
var ctx = document.getElementById("pieChart_3");
var myPieChart3 = new Chart(ctx, {
  type: 'doughnut',
  borderWidth: 1,
  data: {
    labels: ["서장훈 대리", ""],
    datasets: [{
      data: [52, 48],
      backgroundColor: ['#ffb36f','#c8c8c8'],
      hoverBackgroundColor: ['#ff912e', '#c8c8c8'], 
      // hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      enabled: false
    },
    legend: {
      display: false
    },
    cutoutPercentage: 50,
  },
});


// task ranking - 4
var ctx = document.getElementById("pieChart_4");
var myPieChart4 = new Chart(ctx, {
  type: 'doughnut',
  borderWidth: 1,
  data: {
    labels: ["서장훈 대리", ""],
    datasets: [{
      data: [40, 60],
      backgroundColor: ['#ff6f77','#c8c8c8'],
      hoverBackgroundColor: ['#ff303c', '#c8c8c8'], 
      // hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      enabled: false
    },
    legend: {
      display: false
    },
    cutoutPercentage: 50,
  },
});

// task ranking - 5
var ctx = document.getElementById("pieChart_5");
var myPieChart5 = new Chart(ctx, {
  type: 'doughnut',
  borderWidth: 1,
  data: {
    labels: ["서장훈 대리", ""],
    datasets: [{
      data: [28, 72],
      backgroundColor: ['#89e9c0','#c8c8c8'],
      hoverBackgroundColor: ['#2bee9b', '#c8c8c8'], 
      // hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      enabled: false
    },
    legend: {
      display: false
    },
    cutoutPercentage: 50,
  },
});

// task ranking - 6
var ctx = document.getElementById("pieChart_6");
var myPieChart6 = new Chart(ctx, {
  type: 'doughnut',
  borderWidth: 1,
  data: {
    labels: ["서장훈 대리", ""],
    datasets: [{
      data: [19, 81],
      backgroundColor: ['#e68ddb','#c8c8c8'],
      hoverBackgroundColor: ['#dd3ac9', '#c8c8c8'], 
      // hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      enabled: false
    },
    legend: {
      display: false
    },
    cutoutPercentage: 50,
  },
});