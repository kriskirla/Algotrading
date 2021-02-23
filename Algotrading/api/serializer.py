from rest_framework  import serializers
from .models import PortfolioAnalyzer, StockForecastSVM

class PortfolioAnalyzerSerializer(serializers.ModelSerializer):
    """ Serialize the PA model """
    class Meta:
        model = PortfolioAnalyzer
        fields = ('fund', 'sp', 'dow', 'start_date', 'end_date', 'created_at')

class CreatePortfolioSerializer(serializers.ModelSerializer):
    """ Serialize the Create PA model """
    class Meta:
        model = PortfolioAnalyzer
        fields = ('fund', 'sp', 'dow', 'start_date', 'end_date')

class StockForecastSVMSerializer(serializers.ModelSerializer):
    """ Serialize the Stock Forecast SVM model """
    class Meta:
        model = StockForecastSVM
        fields = ('ticker', 'year', 'created_at')