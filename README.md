# Algotrading

This is just me having fun.

# Current feature

Progress on [youtube](https://youtube.com/playlist?list=PL31_Qju7bSIt-G1pozcT-vbPcmgqUYT5v)

## Setting up

Built with Django REST with React.

### To run with Docker
```python
# This will automatically pull image from Github Package
docker-compose up
```
After build is completed, navigate to http://0.0.0.0:8000

### Locally Testing
```
cd Algotrading
pip3 install -r requirement.txt
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver
```
For wsgi:
```
cd Algotrading
gunicorn Algotrading.wsgi
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

Sentiment Analysis
- Uses VADER to scrape headlines on finviz to determine if a stock is receiving good/bad news

Stock Intrinsic Value
- Still in progress
