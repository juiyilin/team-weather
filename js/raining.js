let records = null;
let taiwan_cities = ["基隆市", "臺北市", "新北市", "桃園市", "新竹市", "新竹縣", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "臺南市", "高雄市", "屏東縣", "臺東縣", "花蓮縣", "宜蘭縣", "澎湖縣", "金門縣", "連江縣"];
init();
function init() {
	rainingAPI();
};



function rainingAPI() {
	fetch("https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=" + CWB_API_KEY).then((response) => {
		return response.json();
	}).then((data) => {
		let len = data.records.location.length;
		records = data.records;
		for(let i=0; i<taiwan_cities.length; i++) {
			let city = taiwan_cities[i];
			findCityData(len, city);
		}
	});
};

function findCityData(len, current_city) {
	let city_amount_list = [];
	for(let i=0; i<len; i++) {
		const location = records.location[i];
		let city = location.parameter[0].parameterValue
		if(city === current_city) {
			let amount = location.weatherElement[6].elementValue;
			if(amount === "-999.00") { // -999不知道是什麼雨量 => 歸零
				amount = "0";
			}
			amount = parseFloat(amount);
			city_amount_list.push(amount);
		}
	};
	sumCityData(city_amount_list, current_city);
};

function sumCityData(city_list, current_city) {
	let sum = 0;
	for(let i=0; i<city_list.length; i++) {
		sum += city_list[i];
	}
	let data = {
		"city": current_city,
		"sum": sum
	}
	renderCityRaining(data);
};



function renderCityRaining(city_sum) {
	const container = document.querySelector("#raining");
	const item = document.createElement("div");
	const city = document.createElement("div");
	const amount = document.createElement("amount");
	item.className = "location";
	city.className = "town";
	amount.className = "amount";
	city.textContent = city_sum.city;
	amount.textContent = city_sum.sum + " mm";
	container.appendChild(item);
	item.appendChild(city);
	item.appendChild(amount);
};

// function renderRaining(page) {
// 	let startIndex = page * 10;
// 	let endIndex = (page + 1) * 10;
// 	const container = document.querySelector("#raining");
// 	for (let i = startIndex; i < endIndex; i++) {
// 		const location = records.location[i];
// 		const item = document.createElement("div");
// 		const town = document.createElement("div");
// 		const amount = document.createElement("amount");
// 		item.className = "location";
// 		town.className = "town";
// 		amount.className = "amount";
// 		town.textContent = location.parameter[0].parameterValue + "、" + location.parameter[2].parameterValue;
// 		amount.textContent = location.weatherElement[6].elementValue + " mm";
// 		item.appendChild(town);
// 		item.appendChild(amount);
// 		container.appendChild(item);
// 	}
// }