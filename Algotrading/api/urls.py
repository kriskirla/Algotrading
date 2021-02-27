from django.urls import path
from .views import CreatePortfolioView, StockTestSVMView, StockForecastSVMView, SentimentAnalysisView

urlpatterns = [
    path('portfolioanalyzer', CreatePortfolioView.as_view()),
    path('svmtest', StockTestSVMView.as_view()),
    path('svmforecast', StockForecastSVMView.as_view()),
    path('sentimentanalysis', SentimentAnalysisView.as_view())
]
