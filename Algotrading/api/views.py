from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import PortfolioAnalyzer
from .serializer import PortfolioAnalyzerSerializer, CreatePortfolioSerializer
from .services import PortfolioAnalyzerService

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
            dow = serializer.data.get('dow')
            start_date = serializer.data.get('start_date')
            end_date = serializer.data.get('end_date')
            pa = PortfolioAnalyzer(fund=fund, sp=sp, dow=dow, start_date=start_date, end_date=end_date)
            pa.save()

            # Return the portfolio information
            portfolio = PortfolioAnalyzerService(pa)
            
            return Response(portfolio, status=status.HTTP_200_OK)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

# class CreatePortfolioView(generics.ListAPIView):
#     """ Create the PA view """
#     queryset = PortfolioAnalyzer.objects.all()
#     serializer_class = CreatePortfolioSerializer

#     def get(self, request, format=None):
#         serializer = self.serializer_class(data=request.data)

#         if serializer.is_valid():
#             if serializer.data.get('fund') is not None:
#                 fund = serializer.data.get('fund')
#             else:
#                 fund = 0
#             sp = serializer.data.get('sp')
#             dow = serializer.data.get('dow')
#             start_date = serializer.data.get('start_date')
#             end_date = serializer.data.get('end_date')
#             pa = PortfolioAnalyzer(fund=fund, sp=sp, dow=dow)
#             pa.save()
#             return Response(PortfolioAnalyzerSerializer(pa).data, status=status.HTTP_200_OK)

#         return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)