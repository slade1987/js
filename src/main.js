const API_KEY_YANDEX = '85eaff1b-ef9e-4c11-89bc-ca01d1ae43de'
const place_name = 'Ухта'
const API_URL_GEO_DATA = `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY_YANDEX}&geocode=${place_name}&format=json`        

const ul = document.getElementById('air-pollution')

fetch(API_URL_GEO_DATA)
.then((resp) => resp.json()).then(function(data){
    let mas = (data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos).split(' ')
    if (mas.length !=0){
   
        fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${mas[0]}&longitude=${mas[1]}&hourly=pm10,pm2_5`)
        .then((res) => res.json()).then(function(rezult){
            let table  = document.getElementById('air-pollution')
            let html = " ";
            html = "<table> <tr><td>Время</td> <td>Количество частиц pm10  </td> <td>Количество частиц pm2_5</td></tr>"
            
            for(let i = 0; i < 100; i++){
                html += "<tr>"
                html += "<td>" + rezult.hourly.time[i] + "</td>" 
                html += "<td align=center>" + rezult.hourly.pm10[i] + "</td>" 
                html += "<td>" + rezult.hourly.pm2_5[i] + "</td>" 
                html += "</tr>"
            }
            
            const  getAvg = (num) => {
                return num.reduce((a,b)=> (a+b)) / num.length;
            }
             
            html += "<tr><td>Среднее значение </td> <td align=center>" + getAvg(rezult.hourly.pm10).toFixed(2) + "</td>"
            html += "<td>" + getAvg(rezult.hourly.pm2_5).toFixed(2) + "</td></tr>"

            html += "</table>"      
            table.innerHTML = html

            let ctx = document.getElementById('MyChart')
            new Chart(ctx, {
                type: 'bar',
                data: {
                  labels: ['PM10','PM2_5'],
                  datasets: [{
                    label: '# среднее значение за сутки',
                    data: [getAvg(rezult.hourly.pm10).toFixed(2), getAvg(rezult.hourly.pm2_5).toFixed(2) ],
                    borderWidth: 1
                  }]
                },
                options: {
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }

              });

        })
    } 
    else{
        console.log("Массив пуст")
    }

       
}) 

