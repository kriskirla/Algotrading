from django.urls import path
from .views import CreatePortfolioView, StockForecastSVMView, SentimentAnalysisFinvizView, SentimentAnalysisRedditView, IntrinsicValuationView

urlpatterns = [
    path('portfolioanalyzer', CreatePortfolioView.as_view()),
    path('svmforecast', StockForecastSVMView.as_view()),
    path('sentimentanalysisfinviz', SentimentAnalysisFinvizView.as_view()),
    path('sentimentanalysisreddit', SentimentAnalysisRedditView.as_view()),
    path('intrinsicvaluation', IntrinsicValuationView.as_view()),
]
