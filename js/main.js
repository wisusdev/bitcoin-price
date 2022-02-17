// Variables y selectores
let actualizarData = document.querySelector('#actualizar');
let actualPrice = document.querySelector('#actualPrice');
let variantPrice = document.querySelector('#variantPrice');
let percentPrice = document.querySelector('#percentprice');
let isNow = document.querySelector('#isNow');
let lastHour = document.querySelector('#lastHour');
let myMount = document.querySelector('#myMount');
let myMountResult = document.querySelector('#myMountResult');

let dataStorage = [];
let myMountStorage = [];
let priceOld = 0;
let percentBTC;

let myMountOldVariant = 0;

let initInterval;

// Eventos
eventListeners();
function eventListeners(){
	document.addEventListener('DOMContentLoaded', () => {
		addData();
		initInterval = setInterval(addData, 30000);
	});

	actualizarData.addEventListener('click', () => {
		addData();
		actualizarData.disabled = true;
		setTimeout(() => {
			actualizarData.disabled = false;
		}, 60000)
	});

	isNow.addEventListener('click', () => {
		limpiarChart();
		addData();
		clearInterval(initInterval);
		initInterval = setInterval(addData, 30000);
	})

	lastHour.addEventListener('click', () => {
		limpiarChart();
		loadData();
		clearInterval(initInterval);
	});
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

function obtenerDataBitcoin({bpi: {USD}, chartName, time}){
	let rate = parseFloat(USD.rate.replace(',', ''));

	const criptoObj = {
		updated : moment().format('LLL:s', time.updated),
		name: chartName,
		price: rate,
	};

	// El valor se cambia a Number con 4 digitos
	let priceNow = criptoObj.price;

	// Se asigna el valor al ID "actualPrice"  y se cambia el texto de color
	actualPrice.textContent = `$${USD.rate}`;
	changeClass(actualPrice, priceNow);

	// Obtnemos el porcentaje y se asigna al ID "percentprice"
	percentBTC = Number( ( (priceNow - priceOld) / priceNow ) * 100);
	percentPrice.textContent = percentBTC.toFixed(3) + '%';
	changeClass(percentPrice, priceNow);

	// Obtenemos la diferencia con un numero mas legible
	let differenceBTC = Number(priceNow - priceOld);
	variantPrice.textContent = '$' + differenceBTC.toFixed(2);
	changeClass(variantPrice, priceNow);

	// Se agregan nuevas propiedades al objeto
	criptoObj.oldPrice = priceOld;
	criptoObj.percentBTC = percentBTC;
	criptoObj.differenceBTC = differenceBTC;

	// Actualizamos el precio anterior
	priceOld = priceNow;

	// La data se almacena en LocalStorage para poder consultar luego
	dataStorage = [...dataStorage, criptoObj];

	updateChart(criptoObj);

	syncStorage();

	if (myMount.value !== '' && myMount.value !== null) {
		saveMyMount();
	}

}

function loadData(){
	let BTCdata = JSON.parse(localStorage.getItem('bitcoinData')) || [];

	let filter = BTCdata.filter(n => n.updated > moment().subtract(1, 'hour').format('LLL:s') && n.updated < moment().format('LLL:s'));

	filter.forEach(data => {
		let {price, updated} = data;
		myChart.data.labels.push(updated.slice(updated.length - 8));
		myChart.data.datasets[0].data.push(price);
	});

	myChart.update();
}

function saveMyMount(){
	let amountResult;
	let myMountRT = Number(myMount.value * percentBTC) / 100;

	console.log(myMountRT)

	if (myMountOldVariant > 0){
		amountResult = Math.abs(Math.abs(myMount.value) + Math.abs(myMountOldVariant))
	} else {
		amountResult = Math.abs(Math.abs(myMount.value) - Math.abs(myMountOldVariant));
	}

	if (myMountRT > 0) {
		amountResult = Math.abs(Math.abs(amountResult) + Math.abs(myMountRT));
	} else {
		amountResult = Math.abs(Math.abs(amountResult) - Math.abs(myMountRT));
	}

	myMountResult.textContent = '$' + Number(amountResult).toFixed(2);

	myMountOldVariant = myMountRT;

}

function limpiarChart(){
	myChart.data.labels.length = 0;
	myChart.data.datasets[0].data.length = 0;
	myChart.update();
}

function updateChart(data){
	// Se actualizan los datos en el grafico
	myChart.data.labels.push(moment().format('LTS', data.updated));
	myChart.data.datasets[0].data.push(data.price);
	myChart.update();
}

function syncStorage(){
	localStorage.setItem('bitcoinData', JSON.stringify(dataStorage));
}

function changeClass(item, nowPrice){
	if (nowPrice > priceOld) {
		item.classList.remove('text-danger', 'text-info')
		item.classList.add('text-success');
	} else if (nowPrice < priceOld){
		item.classList.remove('text-success', 'text-info')
		item.classList.add('text-danger');
	} else {
		item.classList.remove('text-success', 'text-danger')
		item.classList.add('text-info');
	}
}