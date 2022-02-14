// Variables y selectores
let actualizarData = document.querySelector('#actualizar');
let actualPrice = document.querySelector('#actualPrice');
let priceNow = 0;

// Eventos
eventListeners();
function eventListeners(){
	document.addEventListener('DOMContentLoaded', () => {
		addData();
		setInterval(addData, 30000);
	});
	actualizarData.addEventListener('click', addData);
}

// Funciones
function addData(){
	try {
		const url = 'https://api.coindesk.com/v1/bpi/currentprice.json';
		fetch(url).then(response => response.json()).then(result => obtenerDataBitcoin(result)).catch(error => console.log(error));
	} catch (error) {
		console.error(error);
	}
}

function obtenerDataBitcoin(result){

	const criptoObj = {
		updated : result.time.updated,
		name: result.chartName,
		usd: result.bpi.USD.rate
	};

	actualPrice.textContent = `$${criptoObj.usd}`;

	if (Number(criptoObj.usd.replace(/,/g, "")).toFixed(4) > priceNow) {
		actualPrice.classList.remove('text-danger', 'text-info')
		actualPrice.classList.add('text-success');
	} else if (Number(criptoObj.usd.replace(/,/g, "")).toFixed(4) < priceNow){
		actualPrice.classList.remove('text-success', 'text-info')
		actualPrice.classList.add('text-danger');
	} else {
		actualPrice.classList.remove('text-success', 'text-danger')
		actualPrice.classList.add('text-info');
	}

	console.log(priceNow, Number(criptoObj.usd.replace(/,/g, "")).toFixed(4));

	priceNow = Number(criptoObj.usd.replace(/,/g, "")).toFixed(4);

	myChart.data.labels.push(moment().format('LTS', criptoObj.updated));
	myChart.data.datasets[0].data.push(Number(criptoObj.usd.replace(/,/g, "")).toFixed(4));
	myChart.update();
}
