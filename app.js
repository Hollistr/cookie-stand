// 'use strict';

var allLocations = [];


// ========== Form Stuff ================= //
var addLocationForm = document.getElementById('addLocation');

addLocationForm.addEventListener('submit', addALocation);

function addALocation(event){
  event.preventDefault();
  // get params from inputs
  var param1 = event.target.cityName.value;
  var param2 = event.target.min.value;
  var param3 = event.target.max.value;
  var param4 = event.target.avgCookies.value;
  var  param5  =  6 ;
  var  param6  =  20 ;

  // get those things and pass them into constructor
  var newCity = new StoreLocation(param1, param2, param3, param4, param5, param6);

  var footerElement = document.getElementById('footer');
  footerElement.parentNode.removeChild(footerElement); // referenced where I got this in the README

  // render that city in the table
  newCity.renderTableData(); // BUT it needs to go ABOVE TOTALS row
  renderTableFooter(allLocations); 
}


// Constructor function
function StoreLocation (location, min, max, avgCookies, openHour, closeHour) {
  this.location = location;
  this.minCustomers = min;
  this.maxCustomers = max;
  this.avgCookiesPerCustomer = avgCookies;
  this.openHour = openHour; 
  this.closeHour = closeHour; 

  this.hoursList = []; 
  this.cookiesPerHourArray = [];

  this.calculateCookiesForOpenHours();

  // add the new instance to the array
  allLocations.push(this);
};

StoreLocation.prototype.generateCustomersPerHour = function () {
  var  min  =  this . minCustomers ;
  var max = this.maxCustomers;
  var random = Math.floor(Math.random() * (+max + 1 - +min)) + +min; // see README for resources
  return random;
};

StoreLocation.prototype.refactorHours = function () {
  for (var i = this.openHour; i < this.closeHour; i++) {
    if (i < 12) {
      this.hoursList.push(i + ':00am');
    } else if (i === 12) {
      this.hoursList.push(i + ':00pm');
    } else if (i > 12) {
      this.hoursList.push((i - 12) + ':00pm')
    }
  }
  return this.hoursList;
};

StoreLocation.prototype.calculateCookiesForOpenHours = function () {
  this.refactorHours();

  for (var i = this.openHour; i < this.closeHour; i++) {
    var cookiesEachHour = Math.round(this.avgCookiesPerCustomer * this.generateCustomersPerHour());
    this.cookiesPerHourArray.push(cookiesEachHour);
  };
  return this.cookiesPerHourArray;
};

StoreLocation.prototype.dailyLocationTotal = function() {
  var sumOfCookies = 0;
  for (var i = 0; i < this.cookiesPerHourArray.length; i++) { 
    sumOfCookies = this.cookiesPerHourArray[i] + sumOfCookies;
  }
  return sumOfCookies;
};

StoreLocation.prototype.renderTableData = function () {
  var table = document.getElementById('cookieData');
  var row = document.createElement('tr');

  // city name cell
  var cityNameCell = document.createElement('th');
  cityNameCell.textContent = this.location;
  row.appendChild(cityNameCell);

  // cookie data x 14
  for (var i = 0; i < this.hoursList.length; i++) {
    var tableDataCell = document.createElement('td');
    tableDataCell.textContent = this.cookiesPerHourArray[i];
    row.appendChild(tableDataCell);
  }

  tableDataCell = document.createElement('td');
  tableDataCell.textContent = this.dailyLocationTotal();
  row.appendChild(tableDataCell);

  table.appendChild(row);
};

function renderTableHeaders () {
  var table = document.getElementById('cookieData');
  var row = document.createElement('tr');
  var tableHeadCell = document.createElement('th');
  row.appendChild(tableHeadCell);

  // hour of the day headers
  for (var i = 0; i < allLocations[0].hoursList.length; i++) {
    tableHeadCell = document.createElement('th');
    tableHeadCell.textContent = allLocations[0].hoursList[i];
    row.appendChild(tableHeadCell);
  }
  // total header
  tableHeadCell = document.createElement('th');
  tableHeadCell.textContent = 'Daily Location Total';
  row.appendChild(tableHeadCell);

  table.appendChild(row);
};

function renderTableFooter (allLocations) {
  var table = document.getElementById('cookieData');
  var row = document.createElement('tr');
  var tableFootCell = document.createElement('th');
  var hoursOfDay = 14;
  tableFootCell.textContent = 'Totals';
  row.appendChild(tableFootCell);
  
  var cookieTotalArray = [];
  // to look at 14 hours of the day for 14 totals cells
  for (var i = 0; i < hoursOfDay; i++) {
    var cookieTotal = 0;
    // add up each index from all locations
    for (var j = 0; j < allLocations.length; j++) {
      cookieTotal = cookieTotal + allLocations[j].cookiesPerHourArray[i];
    }
    cookieTotalArray.push(cookieTotal);
    tableFootCell = document.createElement('td');
    tableFootCell . textContent  =  cookieTotalArray [ i ] ;
    row.appendChild(tableFootCell);
  }

  var superTotal = 0;
  for (var i = 0; i < allLocations.length; i++) {
    superTotal = superTotal + allLocations[i].dailyLocationTotal();
  }
  tableFootCell = document.createElement('td');
  tableFootCell . textContent  =  superTotal ;
  row.appendChild(tableFootCell);
  row.id = 'footer';
  table.appendChild(row);
};

// initial assignment store instances'
new StoreLocation('Seattle', 23, 65, 6.3, 6, 20);
new StoreLocation('Tokyo', 3, 24, 1.2, 6, 20);
new StoreLocation('Dubai', 11, 32, 3.7, 6, 20);
new StoreLocation('Paris', 20, 38, 2.3, 6, 20);
new StoreLocation('Lima', 2, 16, 4.6, 6, 20);

// table headers function is called only once to keep just 1 row of times data
renderTableHeaders(); 

// loop through allLocations array to render table DATA for each new instance
for(var i = 0; i < allLocations.length; i++) {
  console.log(allLocations)
  allLocations[i].renderTableData();
}

// footer ran 1 from global function adding hourly totals
renderTableFooter(allLocations); 


// First Draft

// let hoursOpen = ['6:00am', '7:00am', '8:00am', '9:00am', '10:00am', '11:00am', '12:00pm', '1:00pm', '2:00pm', '3:00pm', '4:00pm', '5:00pm', '6:00pm', '7:00pm'];

// let Seattle = {
//   name: 'seattle',
//   min: 23,
//   max: 65,
//   avg: 6.3,
//   avgCookies: function () { //average cookies per customer per hour
//     return (Math.floor(Math.random() * (this.max - this.min + 1)) + this.min) * this.avg;
//   },
//   total: 0,
//   calculateHourlyValues: function () {
//     let hourlySales = [];
//     for (let i = 0; i < hoursOpen.length; i++) {
//       let sales = this.avgCookies();
//       hourlySales.push(sales);
//       this.total += sales;
//     }
//     return hourlySales;
//   },
//   addListToHtml: function () {
//     let salesValues = this.calculateHourlyValues();
//     // read Elements
//     let listContainer = document.getElementById(this.name); // <div id="seattle"></div

//     // create Elements
//     let newList = document.createElement('ul');
//     listContainer.appendChild(newList);
//     for (let sale of salesValues) {
//       let listItem = document.createElement('li');
//       // update Elements
//       listItem.textContent = sale;
//       newList.appendChild(listItem);
//     }

//     // add one more list item
//     let listItem = document.createElement('li');
//     listItem.textContent = this.total;
//     newList.appendChild(listItem);
//   },
//   addHtml: function () { //adds html to the table
//     let html = `
//     <h1>Seattle</h1>
//     <table>
//       <tr>
//         <th>Time</th>
//         <th>Cookies</th>
//         </tr>
//         <tr>
//         <td>6:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>7:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>8:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>9:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>10:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>11:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>12:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>1:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>2:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>3:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>4:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>5:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>6:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>7:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>        
//         </table>
//         <h2>Total: ${this.total()} cookies</h2>
//         `;
//     document.getElementById("seattle").innerHTML = html;
//   },
// };

// let Tokyo = {
//   min: 3,
//   max: 24,
//   avg: 1.2,
//   avgCookies: function () { //average cookies per customer per hour
//     return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
//   },
//   total: function () { //total cookies sold
//     let total = 0;
//     for (let i = 0; i < 14; i++) {
//       total += this.avgCookies();
//     }
//     return total;
//   },
//   addHtml: function () { //adds html to the table
//     let html = `
//     <h1>Tokyo</h1>
//     <table>
//       <tr>
//         <th>Time</th>
//         <th>Cookies</th>
//         </tr>
//         <tr>
//         <td>6:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>7:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>8:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>9:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>10:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>11:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>12:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>1:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>2:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>3:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>4:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>5:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>6:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>7:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>        
//         </table>
//         <h2>Total: ${this.total()} cookies</h2>
//         `;
//     document.getElementById("tokyo").innerHTML = html;
//   },
// };

// let Dubai = {
//   min: 11,
//   max: 38,
//   avg: 3.7,
//   avgCookies: function () {  //average cookies per customer per hour
//     return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
//   },
//   total: function () { //total cookies sold
//     let total = 0;
//     for (let i = 0; i < 14; i++) {
//       total += this.avgCookies();
//     }
//     return total;
//   },
//   addHtml: function () {    //adds html to the table
//     let html = `
//     <h1>Dubai</h1>
//     <table>
//       <tr>
//         <th>Time</th>
//         <th>Cookies</th>
//         </tr>
//         <tr>
//         <td>6:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>7:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>8:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>9:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>10:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>11:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>12:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>1:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>2:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>3:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>4:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>5:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>6:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>7:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>        
//         </table>
//         <h2>Total: ${this.total()} cookies</h2>
//         `;
//     document.getElementById("dubai").innerHTML = html;
//   },
// };

// let Paris = {
//   min: 20,
//   max: 38,
//   avg: 2.3,
//   avgCookies: function () { //average cookies per customer per hour
//     return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
//   },
//   total: function () {  //total cookies sold
//     let total = 0;
//     for (let i = 0; i < 14; i++) {
//       total += this.avgCookies();
//     }
//     return total;
//   },
//   addHtml: function () {    //adds html to the table
//     let html = `
//     <h1>Paris</h1>
//     <table>
//       <tr>
//         <th>Time</th>
//         <th>Cookies</th>
//         </tr>
//         <tr>
//         <td>6:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>7:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>8:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>9:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>10:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>11:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>12:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>1:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>2:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>3:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>4:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>5:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>6:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>7:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>        
//         </table>
//         <h2>Total: ${this.total()} cookies</h2>
//         `;
//     document.getElementById("paris").innerHTML = html;
//   },
// };

// let Lima = {
//   min: 2,
//   max: 16,
//   avg: 4.6,
//   avgCookies: function () { //average cookies per customer per hour
//     return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
//   },
//   total: function () { //total cookies sold
//     let total = 0;
//     for (let i = 0; i < 14; i++) {
//       total += this.avgCookies();
//     }
//     return total;
//   },
//   addHtml: function () { //adds html to the table
//     let html = `
//     <h1>Lima</h1>
//     <table>
//       <tr>
//         <th>Time</th>
//         <th>Cookies</th>
//         </tr>
//         <tr>
//         <td>6:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>7:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>8:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>9:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>10:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>11:00am</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>12:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>1:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>2:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>3:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>4:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>5:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>6:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>
//         <tr>
//         <td>7:00pm</td>
//         <td>${this.avgCookies()} cookies</td>
//         </tr>        
//         </table>
//         <h2>Total: ${this.total()} cookies</h2>
//         `;
//     document.getElementById("lima").innerHTML = html;
//   },
// };


// function addTable(){
//     //Variables
//     let h1 = document.createElement("h1");
//     let table = document.createElement("table");
//     let total = document.createElement("h2");
//     let header = document.createElement("th");
//     let header1 = document.createElement("th");
//     let header2 = document.createElement("th");

//     //Content
//     header1.innerHTML = "Time " ; 
//     header2.innerHTML = "Cookies " ;
//     header.appendChild(header1); //append header1 to header
//     header.appendChild(header2); //append header2 to header
//     table.appendChild(header); //append header to table
//     h1.innerHTML = "Seattle"; //set h1 content
//     total.innerHTML = "Total: " + Seattle.total() + " cookies"; //total cookies

//     for(let i = 6; i <= 12; i++){ //loop for 6am to 12pm
//         let row = document.createElement("tr"); //create row
//         let time = document.createElement("td"); //create td for time
//         time.innerHTML = i + "am: " + " " + Seattle.avgCookies() + " cookies"; //set time content
//         row.appendChild(time);
//         table.appendChild(row);
//     }
//     for(let i = 1; i <= 7; i++){ //loop for 1pm to 7pm
//         let row = document.createElement("tr");
//         let time = document.createElement("td");
//         time.innerHTML = i + "pm: " + " " + Seattle.avgCookies() + " cookies";
//         row.appendChild(time);
//         table.appendChild(row);
//     }

//     //Append
//     document.getElementById("seattle").appendChild(h1); //append h1 to seattle
//     document.getElementById("seattle").appendChild(table); //append table to seattle
//     document.getElementById("seattle").appendChild(total); //append total to seattle
// }

// // addTable();
// Seattle.addListToHtml();
// console.log(Seattle.total);
// // Tokyo.addHtml();
// // Dubai.addHtml();
// // Paris.addHtml();
// // Lima.addHtml();
