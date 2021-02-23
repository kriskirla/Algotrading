from django.db import models
import string
import random
import datetime

# Create your models here.
class PortfolioAnalyzer(models.Model):
    """ Creates the PA object to trigger backend """
    fund = models.FloatField(help_text="i.e. 10000")
    sp = models.BooleanField(default=False, verbose_name='S&P500')
    dow = models.BooleanField(default=False, verbose_name='DOW')
    start_date = models.DateField(default=datetime.date.today, verbose_name='Start Period')
    end_date = models.DateField(default=datetime.date.today, verbose_name='End Period')
    created_at = models.DateTimeField(auto_now_add=True)

class StockForecastSVM(models.Model):
    """ Create the Stock Forecast SVM object """
    ticker = models.CharField(max_length=20)
    year = models.DateField(default=datetime.date.today, verbose_name='Analyzing Year')
    created_at = models.DateTimeField(auto_now_add=True)