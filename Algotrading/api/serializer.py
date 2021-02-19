from rest_framework  import serializers
from .models import PortfolioAnalyzer

class PortfolioAnalyzerSerializer(serializers.ModelSerializer):
    """ Serialize the PA model """
    class Meta:
        model = PortfolioAnalyzer
        fields = ('fund', 'sp', 'dow', 'created_at')

class CreatePortfolioSerializer(serializers.ModelSerializer):
    """ Serialize the Create PA model """
    class Meta:
        model = PortfolioAnalyzer
        fields = ('fund', 'sp', 'dow')
