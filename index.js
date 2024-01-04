const express = require('express');
const cors = require('cors');
const http = require('http');


const WeatherService = {
    async getForecast(lat, lon) {

    }
};


class YandexWeatherService {
    async getForecast(lat, lon) {
        const url = `https://api.weather.yandex.ru/v2/forecast/?lat=${lat}&lon=${lon}&lang=ru_RU`;

        const data = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'X-Yandex-API-Key': '248ad155-70ec-4e55-9a6f-624bbaae8de3'
            },
        });

        return await data.json();
    }
}


class WeatherApp {
    constructor(port, weatherService) {
        this.app = express();
        this.app.use(cors());
        this.app.use(express.json());
        this.weatherService = weatherService;

        this.app.get('/weather', this.handleWeatherRequest.bind(this));

        http.createServer(this.app).listen(port, () => {
            console.log('Server is working on port ' + port);
        });
    }

    async handleWeatherRequest(req, res) {
        try {
            const { lat, lon } = req.query;


            const jsonData = await this.weatherService.getForecast(lat, lon);

            console.log(jsonData);
            res.send(jsonData);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
}


const yandexWeatherService = new YandexWeatherService();
const weatherApp = new WeatherApp(5000, yandexWeatherService);
