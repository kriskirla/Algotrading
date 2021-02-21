from django.urls import path
from .views import CreatePortfolioView

urlpatterns = [
    path('portfolioanalyzer', CreatePortfolioView.as_view())
]
