import pandas as pd
import numpy as np
import json
import yfinance as yf
#import matplotlib.pyplot as plt
from datetime import datetime as dt
from pypfopt.efficient_frontier import EfficientFrontier
from pypfopt import risk_models
from pypfopt import expected_returns
from pypfopt.discrete_allocation import DiscreteAllocation, get_latest_prices
import time
from sklearn.svm import SVR
import nltk
nltk.downloader.download('vader_lexicon')
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from urllib.request import urlopen, Request
from bs4 import BeautifulSoup
import yahoo_fin.stock_info as si

def PortfolioAnalyzerService(model):
    """ Get portfolio """
    # Settings from input
    start_date = model.start_date
    end_date = model.end_date
    fund = model.fund
    tickers = model.tickers.split(',')

    # Getting all tickers
    ticker = set(tickers)

    # Tickers to track S&P500
    if (model.sp or (len(tickers) == 0 and not model.nasdaq)):
        payload = pd.read_html('https://en.wikipedia.org/wiki/List_of_S%26P_500_companies')
        first_table = payload[0]
        second_table = payload[1]

        df = first_table
        ticker = ticker.union(set(df['Symbol'].values))
    if (model.nasdaq):
        payload = pd.read_html('https://en.wikipedia.org/wiki/NASDAQ-100%23External_links')
        first_table = payload[3]

        df = first_table
        ticker = ticker.union(set(df['Ticker'].values))

    # Get data from yahoo finance
    df = yf.download(ticker, start=start_date, end=end_date)['Close']
    # Drop all delisted tickers
    df = df.dropna(axis='columns', how='all')

    # Calculate the expected annualized returns and the annualized sample covariance matrix of the daily asset returns
    mu = expected_returns.mean_historical_return(df)
    S = risk_models.sample_cov(df)

    # Optimize for the maximal Sharpe ratio
    ef = EfficientFrontier(mu, S) # Create the Efficient Frontier Object
    weights = ef.max_sharpe()
    clean_weights = ef.clean_weights()
    print(clean_weights)
    ef.portfolio_performance(verbose=True)

    porfolio_val = fund
    latest_prices = get_latest_prices(df)
    da = DiscreteAllocation(clean_weights, latest_prices, porfolio_val)
    allocation, leftover = da.lp_portfolio()
    print(f"Discrete Allocation: {allocation}\nFunds Remaining: {leftover}")

    # Save information to print
    def get_company_information(symbol):
        """ Get information about ticker """
        ticker = yf.Ticker(symbol)
        return ticker.info

    table = []

    for symbol in allocation:
        info = get_company_information(symbol)
        table.append([
            symbol,
            info['longName'],
            int(allocation[symbol]),
            info['regularMarketPrice'],
            "${:.2f}".format(info['regularMarketPrice'] * allocation[symbol]),
            info['industry'],
            f"https://ca.finance.yahoo.com/quote/{symbol}"
        ])

        result = {"Table": table}
    print(result)

    return result

def test(model):
    time.sleep(2)
    return {'Table': [['AMD', 'Advanced Micro Devices, Inc.', 5, 84.28, '$421.40', 'Semiconductors', 'https://ca.finance.yahoo.com/quote/AMD'], ['CTAS', 'Cintas Corporation', 3, 342.12, '$1026.36', 'Specialty Business Services', 'https://ca.finance.yahoo.com/quote/CTAS'], ['DXCM', 'DexCom, Inc.', 2, 386.79, '$773.58', 'Diagnostics & Research', 'https://ca.finance.yahoo.com/quote/DXCM'], ['MRNA', 'Moderna, Inc.', 13, 146.09, '$1899.17', 'Biotechnology', 'https://ca.finance.yahoo.com/quote/MRNA'], ['OKTA', 'Okta, Inc.', 1, 256.42, '$256.42', 'Software—Infrastructure', 'https://ca.finance.yahoo.com/quote/OKTA'], ['PDD', 'Pinduoduo Inc.', 6, 180, '$1080.00', 'Internet Retail', 'https://ca.finance.yahoo.com/quote/PDD'], ['PTON', 'Peloton Interactive, Inc.', 23, 117.905, '$2711.82', 'Leisure', 'https://ca.finance.yahoo.com/quote/PTON'], ['TSLA', 'Tesla, Inc.', 2, 687.99, '$1375.98', 'Auto Manufacturers', 'https://ca.finance.yahoo.com/quote/TSLA'], ['XEL', 'Xcel Energy Inc.', 1, 58.83, '$58.83', 'Utilities—Regulated Electric', 'https://ca.finance.yahoo.com/quote/XEL'], ['ZM', 'Zoom Video Communications, Inc.', 3, 383, '$1149.00', 'Telecom Services', 'https://ca.finance.yahoo.com/quote/ZM']]}

def StockForecastSVMService(model):
    """ Get the forecast for the ticker using SVM models """
    ticker = model.ticker
    day = model.day
    year = model.year

    # Get data from yahoo finance
    df = yf.download(ticker, start=year, end=dt.today().strftime('%Y-%m-%d'))

    # Create independant dataset and dependant dataset
    df_days = df.index
    df_adj_close = df.loc[:, 'Adj Close']

    days = [[i.dayofyear] for i in df_days ]
    adj_close_price = [float(price) for price in df_adj_close]

    # Linear Model
    lin_svr = SVR(kernel='linear', C=1000)
    lin_svr.fit(days, adj_close_price)
    lin_predict = lin_svr.predict(days)
    # Polynomial Model
    poly_svr = SVR(kernel='poly', C=1000, degree=2)
    poly_svr.fit(days, adj_close_price)
    poly_predict = poly_svr.predict(days)
    # Radial Basis Function Model
    rbf_svr = SVR(kernel='rbf', C=1000, gamma=0.85)
    rbf_svr.fit(days, adj_close_price)
    rbf_predict = rbf_svr.predict(days)

    # Show the test prediction
    test_graph = []
    for i in range(0, len(df.index)):
        test_graph.append({
            "date": str(df.index[i]).split(" ")[0],
            "adj": adj_close_price[i],
            "lin": lin_predict[i],
            "poly": poly_predict[i],
            "rbf": rbf_predict[i]
        })

    # Test the predicted price for the next n days
    predict_graph = []
    for i in range(1, day + 1):
        predict_day = [[days[-1][0] + i]]
        date = dt.strptime('{} {}'.format(days[-1][0] + i, df_days.year[0]),'%j %Y').strftime('%Y-%m-%d %H:%M:%S')
        predict_graph.append({
            "date": str(date).split(" ")[0],
            "lin": float(lin_svr.predict(predict_day)),
            "poly": float(poly_svr.predict(predict_day)),
            "rbf": float(rbf_svr.predict(predict_day))
        })

    result = {"TestGraph": test_graph, "PredictGraph": predict_graph}

    return result

def SentimentAnalysisService(model):
    source = 'https://finviz.com/quote.ashx?t='
    ticker = model.ticker
    day = model.day

    news_tables = {}
    url = source + ticker
    req = Request(url=url,headers={'user-agent': 'my-app/0.0.1'}) 
    response = urlopen(req)    
    # Read the contents of the file into 'html'
    html = BeautifulSoup(response)
    # Find 'news-table' in the Soup and load it into 'news_table'
    news_table = html.find(id='news-table')
    # Add the table to our dictionary
    news_tables[ticker] = news_table

    # Parse the news
    parsed_news = []

    # Iterate through the news
    for file_name, news_table in news_tables.items():
        ticker = file_name.split('_')[0]
        count = 0
        # Iterate through all tr tags
        for tr in news_table.findAll('tr'):
            # The first tag contains date
            if len(tr.td.text.split()) > 1:
                date = tr.td.text.split()[0]
                time = tr.td.text.split()[1]
                count += 1
            else:
                time = tr.td.text.split()[0]

            if count <= day:
                parsed_news.append([file_name, date, time, tr.a.get_text(), tr.a.attrs['href']])
            else:
                break
    
    # Instantiate the sentiment intensity analyzer
    vader = SentimentIntensityAnalyzer()

    df = pd.DataFrame(parsed_news, columns=['Ticker', 'Date', 'Time', 'Headline', 'URL'])
    # Apply Vader sentiment analysis to headlines
    scores = df['Headline'].apply(vader.polarity_scores).tolist()
    scores_df = pd.DataFrame(scores)
    df = df.join(scores_df, rsuffix='_right')
    df['Date'] = pd.to_datetime(df['Date']).dt.date
    df.set_index('Date', inplace=True)

    # Group the scores by ticker and date
    mean_scores = df.groupby(['Ticker', 'Date']).mean()
    mean_scores = mean_scores.unstack()
    mean_scores = mean_scores.xs('compound', axis="columns").transpose()

    table = []
    mean_graph = []

    for i in range(0, len(df.index)):
        table.append([
            f"{df.index[i]} {df['Time'][i]}",
            df['Headline'][i],
            df['neg'][i],
            df['neu'][i],
            df['pos'][i],
            df['compound'][i],
            df['URL'][i],
        ])
    
    for i in range(0, len(mean_scores.index)):
        mean_graph.append({
            "date": str(mean_scores.index[i]),
            "value": mean_scores[ticker][i]
        })
    
    result = {'Table': table, 'Graph': mean_graph}

    return result

def IntrinsicValuationService(model):
    ticker = model.ticker
    discount_rate = model.discount_rate + (0.1 * ((13 - dt.today().month) / 12))
    pe = model.pe
    eps = model.eps
    growth_one_year = model.growth_one_year
    growth_five_years = model.growth_five_years

    # Intrinsic value with P/E ratio, EPS, and expected Growth (Only works with Blue Chip)
    # http://theautomatic.net/yahoo_fin-documentation/#get_analysts_info
    try:
        # Actual Price
        actual = si.get_live_price(ticker)
        # Find Fair Price
        quote = si.get_quote_table(ticker)
        pe = quote['PE Ratio (TTM)'] if pe == 0 else pe
        eps = quote['EPS (TTM)'] if eps == 0 else eps
        # Expected growth of next year
        analysis = si.get_analysts_info(ticker)
        growth_one_year = (1 + float(analysis['Growth Estimates'][ticker][3][:-1])/100) if growth_one_year == 0 else growth_one_year
        growth_five_years = (1 + float(analysis['Growth Estimates'][ticker][4][:-1])/100) if growth_five_years == 0 else growth_five_years
    except:
        return {'Failed': 'Missing P/E Ratio, EPS (TTM) data, or Growth analytics'}
    
    # Calculate fair price, upper, and lower bound
    fair = (pe * eps * growth_one_year) / discount_rate
    upper = fair * (1.1)
    lower = fair * (0.9)
    in5years = pe * eps * growth_five_years
    
    result = {
        'Graph': [
            {
                "name": "PE_EPS_Graph",
                "actual": float("{:.2f}".format(actual)),
                "fair": float("{:.2f}".format(fair)),
                "upper": float("{:.2f}".format(upper)),
                "lower": float("{:.2f}".format(lower)),
                "in5years": float("{:.2f}".format(in5years))
            }
        ]
    }

    return result
