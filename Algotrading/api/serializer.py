from rest_framework  import serializers
from .models import PortfolioAnalyzer, StockForecastSVM, SentimentAnalysis, IntrinsicValuation

class PortfolioAnalyzerSerializer(serializers.ModelSerializer):
    """ Serialize the PA model """
    class Meta:
        model = PortfolioAnalyzer
        fields = ('fund', 'sp', 'nasdaq', 'start_date', 'end_date', 'created_at')

class CreatePortfolioSerializer(serializers.ModelSerializer):
    """ Serialize the Create PA model """
    class Meta:
        model = PortfolioAnalyzer
        fields = ('fund', 'sp', 'nasdaq', 'start_date', 'end_date')

class StockForecastSVMSerializer(serializers.ModelSerializer):
    """ Serialize the Stock Forecast SVM model """
    class Meta:
        model = StockForecastSVM
        fields = ('ticker', 'day', 'year', 'created_at')

class SentimentAnalysisSerializer(serializers.ModelSerializer):
    """ Serialize the Stock Sentiment """
    class Meta:
        model = SentimentAnalysis
        fields = ('ticker', 'day', 'created_at')

class IntrinsicValuationSerializer(serializers.ModelSerializer):
    """ Serialize the Intrinsic Valuation """
    class Meta:
        model = IntrinsicValuation
        fields = ('ticker', 'discount_rate', 'pe', 'eps', 'growth_one_year', 'growth_five_years', 'created_at')
