from rest_framework  import serializers
from .models import PortfolioAnalyzer

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
