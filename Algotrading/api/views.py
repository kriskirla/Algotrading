from django.shortcuts import render
from rest_framework import generics, status
from .models import PortfolioAnalyzer
from .serializer import PortfolioAnalyzerSerializer, CreatePortfolioSerializer
from rest_framework.views import APIView
from rest_framework.response import Response

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
        """ POST request """
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            if serializer.data.get('fund') is not None:
                fund = serializer.data.get('fund')
            else:
                fund = 0
            sp = serializer.data.get('sp')
            dow = serializer.data.get('dow')
            start_date = serializer.data.get('start_date')
            end_date = serializer.data.get('end_date')
            pa = PortfolioAnalyzer(fund=fund, sp=sp, dow=dow)
            pa.save()
            return Response(PortfolioAnalyzerSerializer(pa).data, status=status.HTTP_200_OK)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class GetPortfolio(APIView):
    """ Get the portfolio information """
    def get(self, request, format=None):
        """ Get Request """

        return None
