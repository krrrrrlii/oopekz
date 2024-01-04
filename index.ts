import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';

interface WeatherService {
    getForecast(lat: number, lon: number): Promise<any>;
}

class YandexWeatherService implements WeatherService {
    async getForecast(lat: number, lon: number): Promise<any> {
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
    private app: express.Application;
    private weatherService: WeatherService;

    constructor(port: number, weatherService: WeatherService) {
        this.app = express();
        this.app.use(cors());
        this.app.use(express.json());
        this.weatherService = weatherService;

        this.app.get('/weather', this.handleWeatherRequest.bind(this));

        http.createServer(this.app).listen(port, () => {
            console.log('Server is working on port ' + port);
        });
    }

    async handleWeatherRequest(req: Request, res: Response) {
        try {
            const { lat, lon } = req.query;

            const jsonData = await this.weatherService.getForecast(Number(lat), Number(lon));

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