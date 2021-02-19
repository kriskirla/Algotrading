from django.db import models
import string
import random

# Create your models here.
class PortfolioAnalyzer(models.Model):
    """ Creates the PA object to trigger backend """
    fund = models.FloatField(help_text="i.e. 10000")
    sp = models.BooleanField(default=False, verbose_name='S&P500')
    dow = models.BooleanField(default=False, verbose_name='DOW')
    created_at = models.DateTimeField(auto_now_add=True)
