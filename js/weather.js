const weatherApi = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=' + CWB_API_KEY;
// https: //opendata.cwb.gov.tw/dist/opendata-swagger.html?urls.primaryName=openAPI#/%E9%A0%90%E5%A0%B1/get_v1_rest_datastore_F_C0032_001
//解說 https: //opendata.cwb.gov.tw/opendatadoc/MFC/ForecastElement.pdf
fetch(weatherApi).then(res => res.json())
    .then(data => {
        let forecast = data.records;
        renderData(forecast);
    })

function renderData(data) {
    let date;
    let time = data.location[0].weatherElement[0].time;
    dateTime = time[0].startTime;
    // dataset Description
    let weather = document.querySelector('#weather');
    datasetDescription = document.createElement('h4');
    datasetDescription.textContent = dateTime + '起' + data.datasetDescription;
    weather.appendChild(datasetDescription);

    // 切換內容button
    let buttonBlock = document.createElement('div');
    buttonBlock.className = 'button';

    for (let i = 0; i < time.length; i++) {
        let button = document.createElement('button');
        button.textContent = time[i].startTime.split(' ')[1] + '-' + time[i].endTime.split(' ')[1];
        button.id = 'time-' + i;
        button.addEventListener('click', () => {
            removeContent();
            data.location.forEach(location => {
                let fillIn = [location.locationName, location.weatherElement[4].time[i].parameter.parameterName + ' °C', location.weatherElement[2].time[i].parameter.parameterName + ' °C', location.weatherElement[0].time[i].parameter.parameterName, location.weatherElement[1].time[i].parameter.parameterName + '%', location.weatherElement[3].time[i].parameter.parameterName];
                fillContent('body', data, i, fillIn);
            })
        })
        buttonBlock.appendChild(button);
    }
    weather.appendChild(buttonBlock);

    //生成表頭
    let fillIn = ['縣市', '高溫(°C)', '低溫(°C)', '天氣現象', '降雨機率(%)', '舒適度'];
    fillContent('head', data, 0, fillIn);

    //生成內容
    data.location.forEach(location => {
        let fillIn = [location.locationName, location.weatherElement[4].time[0].parameter.parameterName + ' °C', location.weatherElement[2].time[0].parameter.parameterName + ' °C', location.weatherElement[0].time[0].parameter.parameterName, location.weatherElement[1].time[0].parameter.parameterName + '%', location.weatherElement[3].time[0].parameter.parameterName];
        fillContent('body', data, 0, fillIn);
    })
}


// function
function fillContent(classBlock, data, time, fillInArray) {
    let block = document.createElement('div');
    block.className = 'weather-' + classBlock;
    let contentClassName = ['loc', 'maxT', 'minT', 'wx', 'per', 'comfort'];
    for (let i = 0; i < data.location[time].weatherElement.length + 1; i++) {
        let blockText = document.createElement('div');
        blockText.className = contentClassName[i];
        blockText.textContent = fillInArray[i];
        block.appendChild(blockText);
    }
    weather.appendChild(block);
}


function removeContent() {
    // 按下按鈕後先刪除原本的內容
    let weatherBodys = document.querySelectorAll('.weather-body');
    weatherBodys.forEach(weatherBody => weatherBody.remove());
}