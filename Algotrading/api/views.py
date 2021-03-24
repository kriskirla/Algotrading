from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
import json
from .models import PortfolioAnalyzer, StockForecastSVM, SentimentAnalysisFinviz, SentimentAnalysisReddit, IntrinsicValuation
from .serializer import PortfolioAnalyzerSerializer, CreatePortfolioSerializer, StockForecastSVMSerializer, SentimentAnalysisFinvizSerializer, SentimentAnalysisRedditSerializer, IntrinsicValuationSerializer
from .services import PortfolioAnalyzerService, test, StockForecastSVMService, SentimentAnalysisFinvizService, SentimentAnalysisRedditService, IntrinsicValuationService

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
            print(serializer)
            tickers = serializer.data.get('tickers')
            sp = serializer.data.get('sp')
            nasdaq = serializer.data.get('nasdaq')
            start_date = serializer.data.get('start_date')
            end_date = serializer.data.get('end_date')
            model = PortfolioAnalyzer(fund=fund, tickers=tickers, sp=sp, nasdaq=nasdaq, start_date=start_date, end_date=end_date)
            model.save()

            # Return the portfolio information
            service = PortfolioAnalyzerService(model)
            
            if ("Failed" in service):
                return Response({'Bad Request': service['Failed']}, status=status.HTTP_400_BAD_REQUEST)
            return Response(json.dumps(service), status=status.HTTP_200_OK)

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
            day = serializer.data.get('day')
            model = StockForecastSVM(ticker=ticker, day=day, year=year)
            model.save()

            # Return the portfolio information
            service = StockForecastSVMService(model)
            
            return Response(json.dumps(service), status=status.HTTP_200_OK)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class SentimentAnalysisFinvizView(generics.ListAPIView):
    """ Create the sentiment analysis view """
    queryset = SentimentAnalysisFinviz.objects.all()
    serializer_class = SentimentAnalysisFinvizSerializer

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
            model = SentimentAnalysisFinvizSerializer(ticker=ticker, day=day)
            model.save()

            # Return the portfolio information
            service = SentimentAnalysisFinvizService(model)
            
            return Response(json.dumps(service), status=status.HTTP_200_OK)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class SentimentAnalysisRedditView(generics.ListAPIView):
    """ Create the sentiment analysis view """
    queryset = SentimentAnalysisReddit.objects.all()
    serializer_class = SentimentAnalysisRedditSerializer

    def post(self, request, format=None):
        """ POST request 
        
        This will save the payload and return the data required to generate the
        the sentiment chart and news.
        
        """
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            if serializer.data.get('subreddit') is not None:
                subreddit = serializer.data.get('subreddit')
            else:
                return Response({'Bad Request': 'Please enter a ticker symbol'}, status=status.HTTP_400_BAD_REQUEST)
            # Save the information to database
            client_id = serializer.data.get('client_id')
            client_secret = serializer.data.get('client_secret')
            user_agent = serializer.data.get('user_agent')
            subreddits = serializer.data.get('subreddits')
            filter_selfpost = serializer.data.get('filter_selfpost')
            model = SentimentAnalysisReddit(client_id=client_id, client_secret=client_secret, user_agent=user_agent, 
                subreddits=subreddits, subreddit=subreddit, filter_selfpost=filter_selfpost)
            model.save()

            # Return the portfolio information
            service = SentimentAnalysisRedditService(model)
            
            return Response(json.dumps(service), status=status.HTTP_200_OK)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class IntrinsicValuationView(generics.ListAPIView):
    """ Create the Intrinsic Valuation view """
    queryset = IntrinsicValuation.objects.all()
    serializer_class = IntrinsicValuationSerializer

    def post(self, request, format=None):
        """ POST request 
        
        This will save the payload and return the data required to generate the
        the intrinsic value.
        
        """
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            if serializer.data.get('ticker') is not None:
                ticker = serializer.data.get('ticker')
            else:
                return Response({'Bad Request': 'Please enter a ticker symbol'}, status=status.HTTP_400_BAD_REQUEST)
            # Save the information to database
            discount_rate = serializer.data.get('discount_rate')
            pe = serializer.data.get('pe')
            eps = serializer.data.get('eps')
            growth_one_year = serializer.data.get('growth_one_year')
            growth_five_years = serializer.data.get('growth_five_years')
            model = IntrinsicValuation(ticker=ticker, discount_rate=discount_rate, pe=pe, eps=eps, 
                growth_one_year=growth_one_year, growth_five_years=growth_five_years)
            model.save()

            # Return the portfolio information
            service = IntrinsicValuationService(model)
            
            return Response(json.dumps(service), status=status.HTTP_200_OK)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
