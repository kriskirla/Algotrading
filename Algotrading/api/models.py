from django.db import models
import string
import random
import datetime

# Create your models here.
class PortfolioAnalyzer(models.Model):
    """ Creates the PA object to trigger backend """
    fund = models.FloatField(help_text="i.e. 10000")
    sp = models.BooleanField(default=False, verbose_name='S&P500')
    nasdaq = models.BooleanField(default=False, verbose_name='NASDAQ-100')
    start_date = models.DateField(default=datetime.date.today, verbose_name='Start Period')
    end_date = models.DateField(default=datetime.date.today, verbose_name='End Period')
    created_at = models.DateTimeField(auto_now_add=True)

class StockForecastSVM(models.Model):
    """ Create the Stock Forecast SVM object """
    ticker = models.CharField(max_length=20)
    day = models.IntegerField(default=3, verbose_name='Days to predict')
    year = models.DateField(default=datetime.date.today, verbose_name='Analyzing Year')
    created_at = models.DateTimeField(auto_now_add=True)

class SentimentAnalysis(models.Model):
    """ Create the Stock Sentiment object """
    ticker = models.CharField(max_length=20)
    day = models.IntegerField(default=datetime.date.today, verbose_name='Days To Read')
    created_at = models.DateTimeField(auto_now_add=True)

class IntrinsicValuation(models.Model):
    """ Create the Intrinsic Valuation object """
    ticker = models.CharField(max_length=20)
    discount_rate = models.FloatField(help_text="i.e. 0.1")
    pe = models.FloatField(help_text="i.e. 33.86")
    eps = models.FloatField(help_text="i.e. 50.45")
    growth_one_year = models.FloatField(help_text="i.e. 0.1")
    growth_five_years = models.FloatField(help_text="i.e. 0.1")
    created_at = models.DateTimeField(auto_now_add=True)
