from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('portfolioanalyzer', index),
    path('svmforecast', index),
    path('sentimentanalysis', index),
    path('intrinsicvaluation', index),
]
