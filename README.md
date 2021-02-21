# Algotrading

This is just me having fun.

# Current feature

## Algotrading Development

Built with Django REST with React and containerized with Docker.

To run:
```
cd Algotrading
python3 manage.py migrate
python3 manage.py runserver
```
To run node script:
```
cd Algotrading/frontend
npm install
npm run dev
```

## Jupyter

Portfolio_Analyzer
- Scrape S&P500 holdings
- Optimize portfolio base on Efficient Frontier weights and available funds

Stock Forecast
- Forecast price prediction using Support vector machine model for the next day within the month
- Forecast price prediction using Neural Netowrk for the next day using past closing price

Stock Momentum
- ML Model using decision tree classifier to termine the target
- Graph for Price, MACD and RSI
