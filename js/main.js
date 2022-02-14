// Variables y selectores
let actualizarData = document.querySelector('#actualizar');
let actualPrice = document.querySelector('#actualPrice');
let variantPrice = document.querySelector('#variantPrice');
let percentPrice = document.querySelector('#percentprice');
let dataStorage = [];
let priceOld = 0;

// Eventos
eventListeners();
function eventListeners(){
	document.addEventListener('DOMContentLoaded', () => {
		addData();
		setInterval(addData, 30000);
	});

	actualizarData.addEventListener('click', () => {
		addData();
		actualizarData.disabled = true;
		setTimeout(() => {
			actualizarData.disabled = false;
		}, 60000)
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

function obtenerDataBitcoin(result){

	const criptoObj = {
		updated : result.time.updated,
		name: result.chartName,
		price: result.bpi.USD.rate,
		oldPrice: '',
		percentBTC: '',
		differenceBTC: '',
	};

	// El valor se cambia a Number con 4 digitos
	priceNow = Number(criptoObj.price.replace(/,/g, "")).toFixed(4);

	// Se asigna el valor al ID "actualPrice"  y se cambia el texto de color
	actualPrice.textContent = `$${criptoObj.price}`;
	if (priceNow > priceOld) {
		actualPrice.classList.remove('text-danger', 'text-info')
		actualPrice.classList.add('text-success');
	} else if (priceNow < priceOld){
		actualPrice.classList.remove('text-success', 'text-info')
		actualPrice.classList.add('text-danger');
	} else {
		actualPrice.classList.remove('text-success', 'text-danger')
		actualPrice.classList.add('text-info');
	}

	// Obtnemos el porcentaje y se asigna al ID "percentprice"
	let percentBTC = Number( ( (priceNow - priceOld) / priceNow ) * 100).toFixed(3)
	percentPrice.textContent = percentBTC + '%';

	// Obtenemos la diferencia con un numero mas legible
	differenceBTC =  Number(priceNow - priceOld).toFixed(2);
	variantPrice.textContent = '$' + differenceBTC;

	// Se agregan nuevas propiedades al objeto
	criptoObj.oldPrice = priceOld;
	criptoObj.percentBTC = percentBTC;
	criptoObj.differenceBTC = differenceBTC;


	// Actualizamos el precio anterior
	priceOld = priceNow;

	// Se actualizan los datos en el grafico
	myChart.data.labels.push(moment().format('LTS', criptoObj.updated));
	myChart.data.datasets[0].data.push(priceNow);
	myChart.update();

	// La data se almacena en LocalStorage para poder consultar luego
	dataStorage = [...dataStorage, criptoObj];
	localStorage.setItem('bitcoinPrice', JSON.stringify(dataStorage));
}