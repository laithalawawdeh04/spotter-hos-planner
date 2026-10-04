from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .hos_logic import calculate_hos_plan

@api_view(['POST'])
def calculate_hos(request):
    data = request.data
    start_location = data.get('start_location', 'Origin')
    end_location = data.get('end_location', 'Destination')
    total_distance = data.get('distance_miles')
    
    if not total_distance:
        return Response({"error": "Please provide distance_miles"}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        total_distance = float(total_distance)
        result = calculate_hos_plan(start_location, end_location, total_distance)
        return Response(result, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)