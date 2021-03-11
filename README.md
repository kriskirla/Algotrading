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

If you are having authentication issue, run this command before docker-compose (replacing `$GITHUB_USERNAME`, `$GITHUB_TOKEN` with your own).

Note: Make sure your Github token has `read:packages` scope.
```
docker login -u $GITHUB_USERNAME -p $GITHUB_TOKEN docker.pkg.github.com
```

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

### The notebook is used for prototyping and will not be most up to date but a good reference in the logic behind each feature.

Portfolio_Analyzer
- Scrape index holdings for processing (S&P500, Nasdaq)
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
- Only works for bluechip company that has P/E ratio and EPS
