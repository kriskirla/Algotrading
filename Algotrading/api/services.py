import pandas as pd
import numpy as np
import requests
import yfinance as yf
#import matplotlib.pyplot as plt
from datetime import datetime as dt
from pypfopt.efficient_frontier import EfficientFrontier
from pypfopt import risk_models
from pypfopt import expected_returns
from pypfopt.discrete_allocation import DiscreteAllocation, get_latest_prices

def PortfolioAnalyzerService(pa):
    """ Get portfolio """
    # Settings from input
    start_date = pa.start_date
    end_date = pa.end_date
    fund = pa.fund

    # Tickers to track S&P500
    payload = pd.read_html('https://en.wikipedia.org/wiki/List_of_S%26P_500_companies')
    first_table = payload[0]
    second_table = payload[1]

    df = first_table
    ticker = df['Symbol'].values.tolist()

    # Get data from yahoo finance
    df = yf.download(ticker, start=start_date, end=end_date)['Close']
    # Drop all delisted tickers
    df = df.dropna(axis='columns', how='all')
    df = df.drop(columns=["WRK"]) # For some reason WRK is showing Na for all except latest

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
    
    company_name = []
    industry = []
    share_price = []
    total_price = []

    for symbol in allocation:
        info = get_company_information(symbol)
        company_name.append(info['longName'])
        industry.append(info['industry'])
        share_price.append(info['regularMarketPrice'])
        total_price.append("${:.2f}".format(info['regularMarketPrice'] * allocation[symbol]))

    # Setup the portfolio view
    portfolio_df = pd.DataFrame(columns=["Ticker", "Name", "Allocation", "Price/Share", "Total", "Industry"])
    portfolio_df["Ticker"] = allocation.keys()
    portfolio_df["Name"] = company_name
    portfolio_df["Allocation"] = allocation.values()
    portfolio_df["Price/Share"] = share_price
    portfolio_df["Total"] = total_price
    portfolio_df["Industry"] = industry

    return portfolio_df.to_json()
