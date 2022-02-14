const ctx = document.getElementById('myChart').getContext('2d');

gradient = ctx.createLinearGradient(0, 0, 0, 450);
gradient.addColorStop(0, 'rgba(250,174,50,1)');
gradient.addColorStop(1, 'rgba(250,174,50,0)');


const myChart = new Chart(ctx, {
	type: 'line',
	toolTip: {
		shared: true
	},
	legend: {
		cursor: "pointer",
		verticalAlign: "bottom",
		horizontalAlign: "left",
		dockInsidePlotArea: true,
	},
	data: {
		labels: [],
		datasets: [{
			label: 'Bitcoin Price',
			data: [],
			backgroundColor: gradient,
			borderColor: 'rgba(247,147,26,1)',
			borderWidth: 1,
			fill: true,
			cubicInterpolationMode: 'monotone',
			tension: 0.4,
			pointStyle: 'circle',
			pointRadius: 2,
		}]
	},
	options: {

	}

});