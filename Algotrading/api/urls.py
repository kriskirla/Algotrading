from django.urls import path
from .views import PortfolioAnalyzerView, CreatePortfolioView

urlpatterns = [
    path('portfolioanalyzer', CreatePortfolioView.as_view())
]
