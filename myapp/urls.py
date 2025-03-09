from django.urls import path
from . import views

urlpatterns = [
    path('', views.index , name='index' ),
    path('counter',views.counter, name='counter'),
    path('register',views.register, name='register'),
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),
    path('dashboard', views.dashboard, name='dashboard'),
    path('calc', views.calc, name='calc'),
    path('goal', views.goal, name='goal'),
    path('ipo', views.ipo, name='ipo')
]