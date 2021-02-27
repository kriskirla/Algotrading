from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
import json
from .models import PortfolioAnalyzer, StockForecastSVM, SentimentAnalysis
from .serializer import PortfolioAnalyzerSerializer, CreatePortfolioSerializer, StockForecastSVMSerializer, SentimentAnalysisSerializer
from .services import PortfolioAnalyzerService, test, StockTestSVMService, StockForecastSVMService, SentimentAnalysisService

# Create your views here.
class PortfolioAnalyzerView(generics.ListAPIView):
    """ Sets up PA """
    queryset = PortfolioAnalyzer.objects.all()
    serializer_class = PortfolioAnalyzerSerializer

class CreatePortfolioView(generics.ListAPIView):
    """ Create the PA view """
    queryset = PortfolioAnalyzer.objects.all()
    serializer_class = CreatePortfolioSerializer

    def post(self, request, format=None):
        """ POST request 
        
        This will save the payload and return the data required to generate the
        portfolio in the frontend.
        
        """
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            if serializer.data.get('fund') is not None:
                fund = serializer.data.get('fund')
            else:
                fund = 0
            # Save the information to database
            sp = serializer.data.get('sp')
            nasdaq = serializer.data.get('nasdaq')
            start_date = serializer.data.get('start_date')
            end_date = serializer.data.get('end_date')
            pa = PortfolioAnalyzer(fund=fund, sp=sp, nasdaq=nasdaq, start_date=start_date, end_date=end_date)
            pa.save()

            # Return the portfolio information
            portfolio = PortfolioAnalyzerService(pa)
            
            return Response(json.dumps(portfolio), status=status.HTTP_200_OK)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class StockTestSVMView(generics.ListAPIView):
    """ Create the forecast view """
    queryset = StockForecastSVM.objects.all()
    serializer_class = StockForecastSVMSerializer

    def post(self, request, format=None):
        """ POST request 
        
        This will save the payload and return the data required to generate the
        forecast in the frontend.
        
        """
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            if serializer.data.get('ticker') is not None:
                ticker = serializer.data.get('ticker')
            else:
                return Response({'Bad Request': 'Please enter a ticker symbol'}, status=status.HTTP_400_BAD_REQUEST)
            # Save the information to database
            year = serializer.data.get('year')
            pa = StockForecastSVM(ticker=ticker, year=year)
            pa.save()

            # Return the portfolio information
            portfolio = StockTestSVMService(pa)
            
            return Response(json.dumps(portfolio), status=status.HTTP_200_OK)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class StockForecastSVMView(generics.ListAPIView):
    """ Create the forecast view """
    queryset = StockForecastSVM.objects.all()
    serializer_class = StockForecastSVMSerializer

    def post(self, request, format=None):
        """ POST request 
        
        This will save the payload and return the data required to generate the
        forecast in the frontend.
        
        """
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            if serializer.data.get('ticker') is not None:
                ticker = serializer.data.get('ticker')
            else:
                return Response({'Bad Request': 'Please enter a ticker symbol'}, status=status.HTTP_400_BAD_REQUEST)
            # Save the information to database
            year = serializer.data.get('year')
            pa = StockForecastSVM(ticker=ticker, year=year)
            pa.save()

            # Return the portfolio information
            portfolio = StockForecastSVMService(pa)
            
            return Response(json.dumps(portfolio), status=status.HTTP_200_OK)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class SentimentAnalysisView(generics.ListAPIView):
    """ Create the sentiment analysis view """
    queryset = SentimentAnalysis.objects.all()
    serializer_class = SentimentAnalysisSerializer

    def post(self, request, format=None):
        """ POST request 
        
        This will save the payload and return the data required to generate the
        the sentiment chart and news.
        
        """
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            if serializer.data.get('ticker') is not None:
                ticker = serializer.data.get('ticker')
            else:
                return Response({'Bad Request': 'Please enter a ticker symbol'}, status=status.HTTP_400_BAD_REQUEST)
            # Save the information to database
            day = serializer.data.get('day')
            pa = SentimentAnalysis(ticker=ticker, day=day)
            pa.save()

            # Return the portfolio information
            portfolio = SentimentAnalysisService(pa)
            
            return Response(json.dumps(portfolio), status=status.HTTP_200_OK)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
