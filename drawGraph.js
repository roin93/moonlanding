/**
 * author: roin93
 * date: 03.02.2019
 */

var graphData = [];
var chartDiv = 'ThingsChart';
var headline = 'Gegenstände';


function setGraphData(tlist, prop) {
	graphData = [];
	dataList = [];
	if(tlist instanceof ThingList) {
		if(tlist.length() > 0) {
			if(tlist.arr[0].hasOwnProperty(prop)) {
				if(prop == "weight") {
					for(var w = 0, maxWeight = tlist.getMaxWeight(); w <= maxWeight; w++) {
						dataList[w] = 0;
					}
				} else if(prop == "value") {
					for(var v = 0, maxValue = tlist.getMaxValue(); v <= maxValue; v++) {
						dataList[v] = 0;
					}
				} else {
					console.log("Wrong property");
					return;
				}
				
				for(var i = 0, len = tlist.length(); i < len; i++) {
						dataList[int(tlist.arr[i][prop])]++;
				}
			} else {
				console.log("Given property not available");
			}
			
			for(var i = 1, len = dataList.length; i < len; i++) {
				//console.log(i + " " + int(dataList[i]));
				graphData.push([int(i), int(dataList[i])]);
			}
		} else {
			console.log("List is empty");
		}
	}
}

function setHeadline(line) {
	headline = line;
}

function setChartDiv(id) {
	chartDiv = id;
}

google.charts.load('44', {
	packages: ['corechart']
});

function drawGraph(xLabel, yLabel) {
	var data = new google.visualization.DataTable();
	data.addColumn('number', xLabel);
	data.addColumn('number', yLabel);

	data.addRows(graphData);

	var options = {
	hAxis: {
		title: xLabel
	},
	vAxis: {
		title: yLabel
	},
	backgroundColor: '#f1f8e9',
	title: headline
	};

	var chart = new google.visualization.LineChart(document.getElementById(chartDiv));
	chart.draw(data, options);
}