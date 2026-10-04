from django.urls import path
from .views import calculate_hos

urlpatterns = [
    path('calculate/', calculate_hos, name='calculate_hos'),
]